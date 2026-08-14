/**
 * DDS 토큰 단일 진실 소스.
 *
 * palette = OKLCH 파생 램프(모드 무관 단일 값). semantic = palette 참조 + light/dark 쌍.
 * 값 추가·변경은 이 파일만 고친다. `generate.ts`는 여기서 읽어 CSS·타입을 만든다.
 */

export type Oklch = { l: number; c: number; h: number };

/** 청록. 스펙 Round 11 확정. */
export const BRAND_HUE = 195;
/** gray도 같은 hue를 쓰되 chroma만 낮춘다 — 완전 무채색이 아닌 차가운 중성. */
export const GRAY_HUE = 195;
export const GRAY_CHROMA = 0.005;

export const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

/**
 * 램프 lightness (OKLCH L). 밝은 → 어두운, brand·gray 공용.
 *
 * 선형 분할이 아니라 어두운 쪽에 스텝을 몰아준 분포다. 이유:
 * solid(700)·weak-pressed(300)·dark weak(800~1000)가 전부 대비 검사 대상이라
 * 램프 양 끝의 여유가 중간 구간의 균등함보다 중요하다.
 */
const LIGHTNESS = [0.97, 0.929, 0.869, 0.76, 0.64, 0.54, 0.45, 0.36, 0.27, 0.18];

/**
 * brand 스텝별 chroma. hue 195의 sRGB 최대 chroma는 L≈0.87에서 0.148로 정점을 찍고
 * 양쪽으로 급히 좁아진다(L=0.97에서 0.044, L=0.45에서 0.077, L=0.18에서 0.031).
 * 각 스텝의 상한 대비 ~85~90%로 잡았다. 넘기면 generate가 gamut 검사에서 실패한다.
 */
const BRAND_CHROMA = [0.03, 0.06, 0.095, 0.1, 0.092, 0.082, 0.068, 0.055, 0.041, 0.027];

/** intent 램프 hue. 관례 위치에서 출발해 gamut·대비 검사를 통과한 값 그대로 확정. */
export const INTENT_HUES = {
  critical: 25,
  positive: 145,
  warning: 85,
  informative: 250,
} as const;

/**
 * intent 스텝별 chroma. hue마다 sRGB 상한 곡선이 달라 램프별로 다시 잡았다.
 * 전부 해당 (L, hue) 상한의 87% — 넘기면 generate가 gamut 검사에서 실패한다.
 */
const INTENT_CHROMA: Record<keyof typeof INTENT_HUES, number[]> = {
  // 각 스텝의 sRGB 상한 × brand의 실측 비율 프로파일(0.69 0.54 0.64 0.77 0.84
  // 0.89 0.88 0.89 0.89 0.86). 균일 87%를 쓰면 green처럼 밝은 영역 상한이 큰
  // hue에서 네온색(#50fa64)이 튀어 램프 패밀리가 깨진다.
  critical: [0.01, 0.019, 0.045, 0.11, 0.207, 0.195, 0.162, 0.131, 0.097, 0.064],
  positive: [0.035, 0.071, 0.175, 0.184, 0.17, 0.151, 0.125, 0.101, 0.076, 0.05],
  warning: [0.022, 0.041, 0.092, 0.12, 0.111, 0.099, 0.082, 0.066, 0.049, 0.033],
  informative: [0.01, 0.019, 0.043, 0.099, 0.153, 0.136, 0.113, 0.091, 0.068, 0.045],
};

/** brand·gray·intent 공용 파생 함수. chroma는 스칼라(gray) 또는 스텝별 배열. */
function ramp(name: string, hue: number, chroma: number | number[]): Record<string, Oklch> {
  return Object.fromEntries(
    STEPS.map((step, i) => [
      `${name}-${step}`,
      { l: LIGHTNESS[i]!, c: typeof chroma === "number" ? chroma : chroma[i]!, h: hue },
    ]),
  );
}

/** primitive 팔레트 61개 (brand 10 + gray 11 + intent 40). 비공개 API — 타입으로 export하지 않는다. */
export const palette: Record<string, Oklch> = {
  ...ramp("brand", BRAND_HUE, BRAND_CHROMA),
  "gray-00": { l: 1, c: 0, h: GRAY_HUE },
  ...ramp("gray", GRAY_HUE, GRAY_CHROMA),
  ...ramp("critical", INTENT_HUES.critical, INTENT_CHROMA.critical),
  ...ramp("positive", INTENT_HUES.positive, INTENT_CHROMA.positive),
  ...ramp("warning", INTENT_HUES.warning, INTENT_CHROMA.warning),
  ...ramp("informative", INTENT_HUES.informative, INTENT_CHROMA.informative),
};

/** `"brand-700"` 또는 알파 합성용 `"gray-1000/0.06"`. */
export type ColorRef = string;

/**
 * semantic 색 토큰 38개 (brand 8 + neutral 8 + intent 16 + 공통 6).
 *
 * 모드별 방향: light는 hover/pressed가 어두워지고, dark는 밝아진다.
 * 양쪽 모두 페이지 배경과의 대비가 커지는 방향이다.
 *
 * intent 4종은 base 4개씩만 — Badge가 비인터랙티브라 hover/pressed가 없다.
 */
export const semanticColors: Record<string, { light: ColorRef; dark: ColorRef }> = {
  // ── brand (8)
  "bg-brand-solid": { light: "brand-700", dark: "brand-400" },
  "bg-brand-solid-hover": { light: "brand-800", dark: "brand-300" },
  "bg-brand-solid-pressed": { light: "brand-900", dark: "brand-200" },
  "bg-brand-weak": { light: "brand-100", dark: "brand-900" },
  "bg-brand-weak-hover": { light: "brand-200", dark: "brand-800" },
  "bg-brand-weak-pressed": { light: "brand-300", dark: "brand-700" },
  "fg-brand": { light: "brand-800", dark: "brand-300" },
  "fg-brand-contrast": { light: "gray-00", dark: "gray-1000" },

  // ── neutral (8)
  "bg-neutral-solid": { light: "gray-800", dark: "gray-300" },
  "bg-neutral-solid-hover": { light: "gray-900", dark: "gray-200" },
  "bg-neutral-solid-pressed": { light: "gray-1000", dark: "gray-100" },
  "bg-neutral-weak": { light: "gray-100", dark: "gray-900" },
  "bg-neutral-weak-hover": { light: "gray-200", dark: "gray-800" },
  "bg-neutral-weak-pressed": { light: "gray-300", dark: "gray-700" },
  "fg-neutral": { light: "gray-900", dark: "gray-100" },
  "fg-neutral-contrast": { light: "gray-00", dark: "gray-1000" },

  // ── critical (4)
  "bg-critical-solid": { light: "critical-700", dark: "critical-400" },
  "bg-critical-weak": { light: "critical-100", dark: "critical-900" },
  "fg-critical": { light: "critical-800", dark: "critical-300" },
  "fg-critical-contrast": { light: "gray-00", dark: "gray-1000" },

  // ── positive (4)
  "bg-positive-solid": { light: "positive-700", dark: "positive-400" },
  "bg-positive-weak": { light: "positive-100", dark: "positive-900" },
  "fg-positive": { light: "positive-800", dark: "positive-300" },
  "fg-positive-contrast": { light: "gray-00", dark: "gray-1000" },

  // ── warning (4)
  // 유일하게 solid가 밝은 쪽 스텝이고 contrast가 양 모드 모두 어둡다.
  // 황색은 어두운 스텝에서 갈색으로 읽혀 경고로 안 보이고, 밝은 황색 위 흰 글자는 4.5:1이 불가능하다.
  "bg-warning-solid": { light: "warning-400", dark: "warning-300" },
  "bg-warning-weak": { light: "warning-100", dark: "warning-900" },
  "fg-warning": { light: "warning-800", dark: "warning-300" },
  "fg-warning-contrast": { light: "gray-1000", dark: "gray-1000" },

  // ── informative (4)
  "bg-informative-solid": { light: "informative-700", dark: "informative-400" },
  "bg-informative-weak": { light: "informative-100", dark: "informative-900" },
  "fg-informative": { light: "informative-800", dark: "informative-300" },
  "fg-informative-contrast": { light: "gray-00", dark: "gray-1000" },

  // ── 공통 (6)
  "bg-layer-default": { light: "gray-00", dark: "gray-1000" },
  "bg-disabled": { light: "gray-200", dark: "gray-800" },
  "bg-transparent-hover": { light: "gray-1000/0.06", dark: "gray-00/0.08" },
  "bg-transparent-pressed": { light: "gray-1000/0.12", dark: "gray-00/0.14" },
  "fg-disabled": { light: "gray-500", dark: "gray-600" },
  "stroke-focus-ring": { light: "brand-700", dark: "brand-400" },
  "stroke-neutral": { light: "gray-600", dark: "gray-500" },
  "stroke-neutral-weak": { light: "gray-200", dark: "gray-800" },
};

export type ContrastCheck = { fg: string; bg: string; min?: number; exempt?: string };

/** 명시 배열. 규칙 기반 생성을 쓰지 않는다 (스펙 "대비 검사"). */
export const contrastChecks: ContrastCheck[] = [
  // brand solid
  { fg: "fg-brand-contrast", bg: "bg-brand-solid", min: 4.5 },
  { fg: "fg-brand-contrast", bg: "bg-brand-solid-hover", min: 4.5 },
  { fg: "fg-brand-contrast", bg: "bg-brand-solid-pressed", min: 4.5 },
  // brand weak
  { fg: "fg-brand", bg: "bg-brand-weak", min: 4.5 },
  { fg: "fg-brand", bg: "bg-brand-weak-hover", min: 4.5 },
  { fg: "fg-brand", bg: "bg-brand-weak-pressed", min: 4.5 },
  // neutral solid
  { fg: "fg-neutral-contrast", bg: "bg-neutral-solid", min: 4.5 },
  { fg: "fg-neutral-contrast", bg: "bg-neutral-solid-hover", min: 4.5 },
  { fg: "fg-neutral-contrast", bg: "bg-neutral-solid-pressed", min: 4.5 },
  // neutral weak
  { fg: "fg-neutral", bg: "bg-neutral-weak", min: 4.5 },
  { fg: "fg-neutral", bg: "bg-neutral-weak-hover", min: 4.5 },
  { fg: "fg-neutral", bg: "bg-neutral-weak-pressed", min: 4.5 },
  // critical
  { fg: "fg-critical-contrast", bg: "bg-critical-solid", min: 4.5 },
  { fg: "fg-critical", bg: "bg-critical-weak", min: 4.5 },
  { fg: "fg-critical", bg: "bg-layer-default", min: 4.5 },
  // positive
  { fg: "fg-positive-contrast", bg: "bg-positive-solid", min: 4.5 },
  { fg: "fg-positive", bg: "bg-positive-weak", min: 4.5 },
  { fg: "fg-positive", bg: "bg-layer-default", min: 4.5 },
  // warning
  { fg: "fg-warning-contrast", bg: "bg-warning-solid", min: 4.5 },
  { fg: "fg-warning", bg: "bg-warning-weak", min: 4.5 },
  { fg: "fg-warning", bg: "bg-layer-default", min: 4.5 },
  // informative
  { fg: "fg-informative-contrast", bg: "bg-informative-solid", min: 4.5 },
  { fg: "fg-informative", bg: "bg-informative-weak", min: 4.5 },
  { fg: "fg-informative", bg: "bg-layer-default", min: 4.5 },
  // ghost — 페이지 배경 위
  { fg: "fg-brand", bg: "bg-layer-default", min: 4.5 },
  { fg: "fg-neutral", bg: "bg-layer-default", min: 4.5 },
  // 포커스 링 (비텍스트)
  { fg: "stroke-focus-ring", bg: "bg-layer-default", min: 3.0 }, // WCAG 1.4.11
  // 인터랙티브 컨트롤 테두리 (비텍스트)
  { fg: "stroke-neutral", bg: "bg-layer-default", min: 3.0 }, // WCAG 1.4.11
  // 면제
  { fg: "fg-disabled", bg: "bg-disabled", exempt: "WCAG 1.4.3 비활성 컨트롤" },
];

// ── 비색상 (모드 분기 없음 → semantic 레이어 없음)

/** 4px 배수 수치 스케일. 컴포넌트가 직접 참조한다. */
export const dimension = {
  x0_5: "2px",
  x1: "4px",
  x1_5: "6px",
  x2: "8px",
  x2_5: "10px",
  x3: "12px",
  x3_5: "14px",
  x4: "16px",
  x4_5: "18px",
  x5: "20px",
  x6: "24px",
  x7: "28px",
  x8: "32px",
  x9: "36px",
  x10: "40px",
  x12: "48px",
  x13: "52px",
  x14: "56px",
  x16: "64px",
} as const;

export const radius = {
  r0_5: "2px",
  r1: "4px",
  r1_5: "6px",
  r2: "8px",
  r2_5: "10px",
  r3: "12px",
  r3_5: "14px",
  r4: "16px",
  r5: "20px",
  r6: "24px",
  "r-full": "9999px",
} as const;

/** font-size와 line-height는 별도 스케일이되 `t` 인덱스를 공유한다. */
export const fontSize = {
  t1: "0.6875rem",
  t2: "0.75rem",
  t3: "0.8125rem",
  t4: "0.875rem",
  t5: "1rem",
  t6: "1.125rem",
  t7: "1.25rem",
  t8: "1.375rem",
  t9: "1.5rem",
  t10: "1.625rem",
} as const;

export const lineHeight = {
  t1: "0.9375rem",
  t2: "1rem",
  t3: "1.125rem",
  t4: "1.1875rem",
  t5: "1.375rem",
  t6: "1.5rem",
  t7: "1.6875rem",
  t8: "1.875rem",
  t9: "2rem",
  t10: "2.1875rem",
} as const;

export const fontWeight = { regular: "400", bold: "700" } as const;
