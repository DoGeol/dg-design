/**
 * 색 수학·검사·CSS 방출. 외부 의존성 0, I/O 0.
 *
 * `generate.ts`(기본 팔레트)와 임의 브랜드 팔레트가 같은 변환·같은 검사·같은 방출을
 * 쓰도록 palette를 인자로 받는다. 스케일(dimension·radius·타이포·모션)은 테마 축이
 * 아니라서 tokens.ts에서 직접 읽는다.
 */
import {
  type ColorRef,
  type Oklch,
  contrastChecks,
  dimension,
  duration,
  easing,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  semanticColors,
  shadow,
  zIndex,
} from "./tokens.ts";

export type Palette = Record<string, Oklch>;

export const MODES = ["light", "dark"] as const;
export type Mode = (typeof MODES)[number];
type Rgb = [number, number, number];

// ── 색 변환 (OKLab 행렬 / sRGB 감마 / WCAG 상대휘도 전부 직접 구현)

/** OKLCH → linear sRGB. 클리핑하지 않는다 — gamut 판정을 호출부에 맡긴다. */
function oklchToLinearSrgb({ l, c, h }: Oklch): Rgb {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

const gammaEncode = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

/** 감마 클리핑으로 색이 조용히 왜곡되는 것을 막는다. */
const GAMUT_EPS = 1e-4;

const outOfGamut = (linear: Rgb) => linear.find((x) => x < -GAMUT_EPS || x > 1 + GAMUT_EPS);

function oklchToRgb8(name: string, color: Oklch): Rgb {
  const linear = oklchToLinearSrgb(color);
  const out = outOfGamut(linear);
  if (out !== undefined) {
    throw new Error(
      `palette "${name}" (oklch ${color.l} ${color.c} ${color.h})가 sRGB 밖이다: ` +
        `linear [${linear.map((x) => x.toFixed(4)).join(", ")}]. chroma를 낮춰라.`,
    );
  }
  return linear.map((x) => Math.round(gammaEncode(Math.min(1, Math.max(0, x))) * 255)) as Rgb;
}

/**
 * 주어진 (lightness, hue)에서 "0부터 거기까지 전부" sRGB gamut 안인 최대 chroma.
 *
 * 경계가 chroma에 대해 단조라고 가정하면 안 된다 — 각 linear 채널은 chroma의 3차식이라
 * 중간에서 음수로 파였다 되돌아올 수 있다(실측: hue 264, L 0.27에서 R이 c≈0.167에
 * 밖이었다가 c≈0.188에 다시 안). 그래서 순수 이진 탐색은 "되돌아온 지점"을 최대치로
 * 잡을 수 있고, 그 아래 비율점(× CHROMA_RATIO_PROFILE)이 gamut 밖에 걸린다.
 * 거친 스캔으로 첫 이탈 구간을 찾고 그 안에서만 이진 탐색한다 — 결과 이하의 모든
 * chroma가 안전해져 비율 곱이 항상 통과한다. 판정은 `oklchToRgb8`과 같은 `GAMUT_EPS`.
 */
export function maxChroma(l: number, h: number, tolerance = 1e-5): number {
  const HI = 0.5; // OKLCH sRGB 최대치(~0.32)보다 넉넉한 상한
  const STEP = 1e-3;

  let lo = 0;
  let hi = HI;
  for (let c = STEP; c <= HI; c += STEP) {
    if (outOfGamut(oklchToLinearSrgb({ l, c, h })) !== undefined) {
      hi = c;
      break;
    }
    lo = c;
  }
  while (hi - lo > tolerance) {
    const mid = (lo + hi) / 2;
    if (outOfGamut(oklchToLinearSrgb({ l, c: mid, h })) === undefined) lo = mid;
    else hi = mid;
  }
  return lo;
}

const toHex = (rgb: Rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

/** WCAG 2.x 상대휘도. 실제 방출되는 8비트 값에서 계산한다. */
function luminance([r, g, b]: Rgb): number {
  const lin = ([r, g, b] as Rgb).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as Rgb;
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** `over` 위에 알파 합성. 알파 토큰은 그 자체로 대비를 잴 수 없다. */
const composite = (fg: Rgb, bg: Rgb, alpha: number) =>
  fg.map((v, i) => Math.round(v * alpha + bg[i]! * (1 - alpha))) as Rgb;

// ── 해석

function parseRef(palette: Palette, ref: ColorRef): { rgb: Rgb; alpha?: number } {
  const [name, alpha] = ref.split("/");
  const color = palette[name!];
  if (!color) throw new Error(`알 수 없는 palette 참조: "${ref}"`);
  return { rgb: oklchToRgb8(name!, color), alpha: alpha ? Number(alpha) : undefined };
}

const cssColor = ({ rgb, alpha }: { rgb: Rgb; alpha?: number }) =>
  alpha === undefined ? toHex(rgb) : `rgb(${rgb.join(" ")} / ${alpha})`;

/** 대비 계산용 실색. 알파가 있으면 그 모드의 bg-layer-default 위에 합성한다. */
function flatten(palette: Palette, token: string, mode: Mode, backdrop: Rgb): Rgb {
  const entry = semanticColors[token];
  if (!entry) throw new Error(`대비 검사가 존재하지 않는 토큰을 참조한다: "${token}"`);
  const { rgb, alpha } = parseRef(palette, entry[mode]);
  return alpha === undefined ? rgb : composite(rgb, backdrop, alpha);
}

// ── 대비 검사

/** 검사표를 문자열 행으로 돌려준다. 실패가 하나라도 있으면 throw — 출력은 호출부 몫. */
export function checkContrast(palette: Palette): string[] {
  const rows: string[] = [];
  const failures: string[] = [];

  for (const mode of MODES) {
    const backdrop = parseRef(palette, semanticColors["bg-layer-default"]![mode]).rgb;
    for (const { fg, bg, min, exempt } of contrastChecks) {
      const pair = `${fg} on ${bg}`;
      if (exempt) {
        rows.push(`  ${mode.padEnd(5)}  -       ${pair}  (면제: ${exempt})`);
        continue;
      }
      const ratio = contrastRatio(
        flatten(palette, fg, mode, backdrop),
        flatten(palette, bg, mode, backdrop),
      );
      const ok = ratio >= min!;
      rows.push(
        `  ${mode.padEnd(5)}  ${ok ? "✓" : "✗"} ${ratio.toFixed(2).padStart(5)}:1  ${pair}  (min ${min}:1)`,
      );
      if (!ok) {
        failures.push(`${mode} "${pair}" = ${ratio.toFixed(2)}:1 (min ${min}:1)`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `대비 검사 실패 ${failures.length}건 — 토큰 값을 고쳐라:\n` +
        failures.map((f) => `  ✗ ${f}`).join("\n"),
    );
  }
  return rows;
}

// ── 방출

const block = (selector: string, lines: string[]) =>
  `${selector} {\n${lines.map((l) => (l ? `  ${l}` : "")).join("\n")}\n}`;

export function tokensCss(
  palette: Palette,
  header = "/* 생성 파일. 직접 고치지 말고 src/tokens.ts를 고친 뒤 `pnpm generate`. */",
): string {
  const paletteVars = Object.entries(palette).map(
    ([name, color]) => `--dds-color-palette-${name}: ${toHex(oklchToRgb8(name, color))};`,
  );
  const semanticVars = (mode: Mode) =>
    Object.entries(semanticColors).map(
      ([name, value]) => `--dds-color-${name}: ${cssColor(parseRef(palette, value[mode]))};`,
    );
  const scale = (prefix: string, entries: Record<string, string>) =>
    Object.entries(entries).map(([name, value]) => `--dds-${prefix}-${name}: ${value};`);

  return [
    header,
    "",
    block(":root", [
      "/* palette — 내부 구현. 모드 무관 단일 램프라 다크에서 재정의하지 않는다. */",
      ...paletteVars,
      "",
      "/* semantic (light) */",
      ...semanticVars("light"),
      "",
      "/* dimension / radius / z / typography / shadow / motion — 모드 분기 없음 */",
      ...scale("dimension", dimension),
      ...scale("radius", radius),
      ...scale("z", zIndex),
      ...scale("font-size", fontSize),
      ...scale("line-height", lineHeight),
      ...scale("font-weight", fontWeight),
      ...scale("shadow", shadow),
      ...scale("duration", duration),
      ...scale("easing", easing),
    ]),
    "",
    block('[data-dds-theme="dark"]', ["/* semantic (dark) */", ...semanticVars("dark")]),
    "",
  ].join("\n");
}

/**
 * Tailwind v4 브릿지. 값을 복제하지 않고 참조만 재바인딩한다 (tokens.css 선로드 필수).
 *
 * duration·z-index는 여기 없다 — 실측(스모크 빌드) 결과 Tailwind v4는 `duration-*`·
 * `z-*`를 theme 네임스페이스가 아니라 고정 정수 스케일/임의값으로만 받는다(`--duration-*`·
 * `--z-*`를 `@theme`에 넣어도 어떤 유틸리티도 읽지 않아 죽은 변수가 된다). 소비자는 이미
 * tokens.css가 내는 `--dds-duration-fast`·`--dds-z-overlay`를 Tailwind의 괄호 임의값
 * 문법으로 직접 쓸 수 있다: `duration-(--dds-duration-fast)`, `z-(--dds-z-overlay)`.
 *
 * radius의 `r-full`도 뺐다 — `rounded-r-full`은 Tailwind 자체 문법에서 "우측만
 * full"(방향 접두 `r-` + 크기 `full`)로 먼저 해석돼 우리 키와 클래스명이 충돌한다
 * (실측: 좌우 코너에 다른 값이 섞여 방출됨). 어차피 Tailwind 기본 `rounded-full`이
 * 같은 값(완전 원형)을 이미 프리픽스 없이 제공해 바인딩이 불필요하다.
 */
export const tailwindCss = () =>
  [
    "/* 생성 파일. `tokens.css`를 먼저 로드해야 동작한다. */",
    "",
    block("@theme", [
      ...Object.keys(semanticColors).map((name) => `--color-${name}: var(--dds-color-${name});`),
      "",
      ...Object.keys(radius)
        .filter((name) => name !== "r-full")
        .map((name) => `--radius-${name}: var(--dds-radius-${name});`),
      "",
      ...Object.keys(dimension).map((name) => `--spacing-${name}: var(--dds-dimension-${name});`),
      "",
      ...Object.keys(fontSize).flatMap((name) => [
        `--text-${name}: var(--dds-font-size-${name});`,
        `--text-${name}--line-height: var(--dds-line-height-${name});`,
      ]),
      "",
      ...Object.keys(easing).map((name) => `--ease-${name}: var(--dds-easing-${name});`),
    ]),
    "",
  ].join("\n");
