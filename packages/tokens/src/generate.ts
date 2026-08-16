/**
 * 토큰 코드젠. 외부 의존성 0.
 *
 * tokens.ts → dist/{tokens.css, tailwind.css, index.d.ts, index.js}
 * 생성 전에 WCAG 대비를 검사하고, 미달이면 아무것도 쓰지 않고 실패한다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  palette,
  radius,
  semanticColors,
  shadow,
  zIndex,
} from "./tokens.ts";

const OUT = join(dirname(dirname(fileURLToPath(import.meta.url))), "dist");
const MODES = ["light", "dark"] as const;
type Mode = (typeof MODES)[number];
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

function oklchToRgb8(name: string, color: Oklch): Rgb {
  const linear = oklchToLinearSrgb(color);
  const out = linear.find((x) => x < -GAMUT_EPS || x > 1 + GAMUT_EPS);
  if (out !== undefined) {
    throw new Error(
      `palette "${name}" (oklch ${color.l} ${color.c} ${color.h})가 sRGB 밖이다: ` +
        `linear [${linear.map((x) => x.toFixed(4)).join(", ")}]. chroma를 낮춰라.`,
    );
  }
  return linear.map((x) => Math.round(gammaEncode(Math.min(1, Math.max(0, x))) * 255)) as Rgb;
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

function parseRef(ref: ColorRef): { rgb: Rgb; alpha?: number } {
  const [name, alpha] = ref.split("/");
  const color = palette[name!];
  if (!color) throw new Error(`알 수 없는 palette 참조: "${ref}"`);
  return { rgb: oklchToRgb8(name!, color), alpha: alpha ? Number(alpha) : undefined };
}

const cssColor = ({ rgb, alpha }: { rgb: Rgb; alpha?: number }) =>
  alpha === undefined ? toHex(rgb) : `rgb(${rgb.join(" ")} / ${alpha})`;

/** 대비 계산용 실색. 알파가 있으면 그 모드의 bg-layer-default 위에 합성한다. */
function flatten(token: string, mode: Mode, backdrop: Rgb): Rgb {
  const entry = semanticColors[token];
  if (!entry) throw new Error(`대비 검사가 존재하지 않는 토큰을 참조한다: "${token}"`);
  const { rgb, alpha } = parseRef(entry[mode]);
  return alpha === undefined ? rgb : composite(rgb, backdrop, alpha);
}

// ── 대비 검사

function checkContrast(): string[] {
  const rows: string[] = [];
  const failures: string[] = [];

  for (const mode of MODES) {
    const backdrop = parseRef(semanticColors["bg-layer-default"]![mode]).rgb;
    for (const { fg, bg, min, exempt } of contrastChecks) {
      const pair = `${fg} on ${bg}`;
      if (exempt) {
        rows.push(`  ${mode.padEnd(5)}  -       ${pair}  (면제: ${exempt})`);
        continue;
      }
      const ratio = contrastRatio(flatten(fg, mode, backdrop), flatten(bg, mode, backdrop));
      const ok = ratio >= min!;
      rows.push(
        `  ${mode.padEnd(5)}  ${ok ? "✓" : "✗"} ${ratio.toFixed(2).padStart(5)}:1  ${pair}  (min ${min}:1)`,
      );
      if (!ok) {
        failures.push(`${mode} "${pair}" = ${ratio.toFixed(2)}:1 (min ${min}:1)`);
      }
    }
  }

  console.log(rows.join("\n"));
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

function tokensCss(): string {
  const paletteVars = Object.entries(palette).map(
    ([name, color]) => `--dds-color-palette-${name}: ${toHex(oklchToRgb8(name, color))};`,
  );
  const semanticVars = (mode: Mode) =>
    Object.entries(semanticColors).map(
      ([name, value]) => `--dds-color-${name}: ${cssColor(parseRef(value[mode]))};`,
    );
  const scale = (prefix: string, entries: Record<string, string>) =>
    Object.entries(entries).map(([name, value]) => `--dds-${prefix}-${name}: ${value};`);

  return [
    "/* 생성 파일. 직접 고치지 말고 src/tokens.ts를 고친 뒤 `pnpm generate`. */",
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

/** Tailwind v4 브릿지. 값을 복제하지 않고 참조만 재바인딩한다 (tokens.css 선로드 필수). */
const tailwindCss = () =>
  [
    "/* 생성 파일. `tokens.css`를 먼저 로드해야 동작한다. */",
    "",
    block(
      "@theme",
      Object.keys(semanticColors).map((name) => `--color-${name}: var(--dds-color-${name});`),
    ),
    "",
  ].join("\n");

const union = (names: string[]) => names.map((n) => `\n  | "${n}"`).join("");

const typesDts = () =>
  [
    "// 생성 파일. palette 이름은 내부 구현이라 여기서 제외한다.",
    "",
    `export type DdsColorToken =${union(Object.keys(semanticColors))};`,
    "",
    `export type DdsDimensionToken =${union(Object.keys(dimension))};`,
    "",
    `export type DdsRadiusToken =${union(Object.keys(radius))};`,
    "",
    `export type DdsZIndexToken =${union(Object.keys(zIndex))};`,
    "",
    `export type DdsTypographyScale =${union(Object.keys(fontSize))};`,
    "",
    `export type DdsFontWeightToken =${union(Object.keys(fontWeight))};`,
    "",
    `export type DdsShadowToken =${union(Object.keys(shadow))};`,
    "",
    `export type DdsDurationToken =${union(Object.keys(duration))};`,
    "",
    `export type DdsEasingToken =${union(Object.keys(easing))};`,
    "",
  ].join("\n");

// ── 실행

checkContrast();

mkdirSync(OUT, { recursive: true });
const files = {
  "tokens.css": tokensCss(),
  "tailwind.css": tailwindCss(),
  "index.d.ts": typesDts(),
  "index.js": "// 타입 전용 진입점. 런타임 값은 tokens.css에 있다.\nexport {};\n",
};
for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, name), content);

console.log(
  `\n생성 완료 → dist/ (palette ${Object.keys(palette).length}, semantic ${Object.keys(semanticColors).length})`,
);
