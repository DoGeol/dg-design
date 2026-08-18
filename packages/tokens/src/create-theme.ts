/**
 * 소비 프로젝트용 테마 생성기.
 *
 * 브랜드 hex 하나를 받아 DDS 규칙(고정 lightness 스텝 + hue별 sRGB 상한 × 비율
 * 프로파일)으로 팔레트 전체를 재파생하고, 기본 팔레트와 **같은 대비·gamut 검사**를
 * 전량 통과시킨 뒤에만 tokens.css와 동일 구조의 CSS를 돌려준다. 검사 미달이면
 * 자동 보정 없이 진단과 함께 실패한다 — "통과했다면 정말 통과한 것"이 이 API의 계약이다.
 */
import { checkContrast, maxChroma, tokensCss, type Palette } from "./color-core.ts";
import {
  CHROMA_RATIO_PROFILE,
  GRAY_CHROMA,
  LIGHTNESS,
  STEPS,
  palette as basePalette,
  type Oklch,
} from "./tokens.ts";

export interface CreateThemeOptions {
  /** 브랜드 hex (`#RGB` 또는 `#RRGGBB`). */
  brand: string;
}

export interface CreateThemeResult {
  /** tokens.css와 드롭인 호환인 완성 CSS. `:root` + `[data-dds-theme="dark"]`. */
  css: string;
  /** 입력 hex에서 추출된 OKLCH hue (0~360). 진단·로그용. */
  brandHue: number;
}

/** #RGB·#RRGGBB만 허용. 파싱 불가는 명확히 실패시킨다 — 조용한 fallback 금지. */
function parseHex(input: string): [number, number, number] {
  const m = /^#(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i.exec(input.trim());
  if (!m) {
    throw new Error(
      `brand는 "#RGB" 또는 "#RRGGBB" 형식의 hex여야 한다 — 받은 값: "${input}"`,
    );
  }
  const hex = m[1] ? [...m[1]].map((ch) => ch + ch).join("") : m[2]!;
  return [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

/** sRGB 8비트 → OKLCH hue. color-core의 OKLCH→sRGB와 같은 OKLab 행렬의 역방향. */
function hexToHue(rgb8: [number, number, number]): number {
  const [r, g, b] = rgb8.map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  // 무채색(a≈b≈0)은 hue가 무의미하다 — 임의값을 조용히 쓰는 대신 거부한다.
  if (Math.hypot(a, bb) < 1e-4) {
    throw new Error(
      "무채색에 가까운 hex라 hue를 추출할 수 없다 — 채도가 있는 브랜드 색을 달라.",
    );
  }
  return ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
}

/**
 * 입력 hex는 hue만 쓴다. lightness 스텝과 chroma는 시스템 규칙으로 재파생하므로
 * **입력 색 자체가 램프에 그대로 박히지 않을 수 있다** — 일관된 톤과 대비 보증의 대가다.
 */
export function createTheme(options: CreateThemeOptions): CreateThemeResult {
  const hue = hexToHue(parseHex(options.brand));

  const brandRamp: Palette = {};
  const grayRamp: Palette = {};
  STEPS.forEach((step, i) => {
    const l = LIGHTNESS[i]!;
    brandRamp[`brand-${step}`] = { l, c: maxChroma(l, hue) * CHROMA_RATIO_PROFILE[i]!, h: hue };
    // gray는 brand hue를 따라간다(차가운/따뜻한 중성 자동 연동) — 기본 팔레트와 같은 규칙.
    grayRamp[`gray-${step}`] = { l, c: GRAY_CHROMA, h: hue };
  });

  // intent 4종은 의미색이라 브랜드와 독립 — 기본 팔레트 값을 그대로 쓴다.
  const intents: Palette = Object.fromEntries(
    Object.entries(basePalette).filter(([name]) =>
      /^(critical|positive|warning|informative)-/.test(name),
    ),
  );

  const themePalette: Palette = {
    ...brandRamp,
    "gray-00": { l: 1, c: 0, h: hue } satisfies Oklch,
    ...grayRamp,
    ...intents,
  };

  try {
    checkContrast(themePalette);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `이 브랜드 색(hue ${hue.toFixed(1)})으로는 WCAG 대비를 만족하는 팔레트를 만들 수 없다.\n` +
        `${detail}\n` +
        "더 진하거나 탁한(채도가 낮은) 브랜드 색을 시도해라. " +
        "밝은 노랑 계열은 지원 범위 밖이다 — DDS 자신도 warning을 반전 규칙으로 푼다.",
    );
  }

  const header =
    `/* @dg-design/tokens createTheme 생성 파일 (brand ${options.brand.trim()}, hue ${hue.toFixed(1)}).\n` +
    "   tokens.css의 드롭인 교체본 — 둘 중 하나만 로드한다. */";
  return { css: tokensCss(themePalette, header), brandHue: hue };
}
