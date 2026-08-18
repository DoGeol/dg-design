/**
 * 토큰 코드젠. 외부 의존성 0.
 *
 * tokens.ts → dist/{tokens.css, tailwind.css, index.d.ts, index.js}
 * 생성 전에 WCAG 대비를 검사하고, 미달이면 아무것도 쓰지 않고 실패한다.
 * 색 수학·검사·CSS 방출은 color-core.ts에 있다 — 이 파일은 I/O와 타입 방출만 맡는다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { checkContrast, tailwindCss, tokensCss } from "./color-core.ts";
import {
  dimension,
  duration,
  easing,
  fontSize,
  fontWeight,
  palette,
  radius,
  semanticColors,
  shadow,
  zIndex,
} from "./tokens.ts";

const OUT = join(dirname(dirname(fileURLToPath(import.meta.url))), "dist");

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
    '// 런타임 API — 구현은 tsc가 dist/create-theme.js로 방출한다.',
    'export { createTheme } from "./create-theme.js";',
    'export type { CreateThemeOptions, CreateThemeResult } from "./create-theme.js";',
    "",
  ].join("\n");

// ── 실행

console.log(checkContrast(palette).join("\n"));

mkdirSync(OUT, { recursive: true });
const files = {
  "tokens.css": tokensCss(palette),
  "tailwind.css": tailwindCss(),
  "index.d.ts": typesDts(),
  "index.js": "// CSS는 tokens.css로, 런타임은 createTheme 하나다.\nexport { createTheme } from \"./create-theme.js\";\n",
};
for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, name), content);

console.log(
  `\n생성 완료 → dist/ (palette ${Object.keys(palette).length}, semantic ${Object.keys(semanticColors).length})`,
);
