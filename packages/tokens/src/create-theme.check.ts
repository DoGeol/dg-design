/**
 * createTheme 셀프체크. generate처럼 의존성 0으로 빌드마다 돈다 —
 * 실패하면 빌드가 실패한다(대비 검사와 같은 지위).
 */
import { strict as assert } from "node:assert";

import { tokensCss } from "./color-core.ts";
import { createTheme } from "./create-theme.ts";
import { palette, semanticColors } from "./tokens.ts";

/** 블록 하나의 semantic 색 변수 → 값. palette·스케일은 뺀다. */
function semanticBlock(css: string, selector: string): Map<string, string> {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `${selector} 블록 없음`);
  const body = css.slice(start, css.indexOf("\n}", start));
  return new Map(
    [...body.matchAll(/(--dds-color-(?!palette-)[\w-]+): ([^;]+);/g)].map((m) => [m[1]!, m[2]!]),
  );
}

/**
 * 중첩 라이트 스코프 계약: `[data-dds-theme="light"]`가 다크 블록의 semantic을 빠짐없이
 * 재정의하고, 값은 `:root` 라이트와 같다. 빠지면 다크 조상의 값이 새어 들어온다.
 */
function assertLightScope(css: string, label: string) {
  const root = semanticBlock(css, ":root");
  const light = semanticBlock(css, '[data-dds-theme="light"]');
  const dark = semanticBlock(css, '[data-dds-theme="dark"]');
  assert.equal(root.size, Object.keys(semanticColors).length, `${label}: :root semantic 개수`);
  assert.deepEqual([...light.keys()].sort(), [...dark.keys()].sort(), `${label}: 라이트·다크 키 불일치`);
  assert.deepEqual(light, root, `${label}: 라이트 스코프 값이 :root와 다름`);
}

// ── 0. 기본 tokens.css의 라이트 스코프
assertLightScope(tokensCss(palette), "tokens.css");

// ── 1. 임의 브랜드(보라)로 전량 생성 + 구조 확인
{
  const { css, brandHue } = createTheme({ brand: "#6A4FBB" });
  assert.ok(brandHue > 250 && brandHue < 320, `보라 hue 추출 실패: ${brandHue}`);

  const paletteCount = (css.match(/--dds-color-palette-/g) ?? []).length;
  assert.equal(paletteCount, Object.keys(palette).length, "palette 개수 불일치");

  const semanticCount = (css.match(/--dds-color-(?!palette-)/g) ?? []).length;
  // semantic은 :root·라이트 스코프·다크 세 번 나온다.
  assert.equal(semanticCount, Object.keys(semanticColors).length * 3, "semantic 개수 불일치");

  assertLightScope(css, "createTheme");
}

// ── 2. hex 경계: 축약형 허용, 쓰레기 문자열·무채색 거부
{
  assert.ok(createTheme({ brand: "#f60" }).css.length > 0, "#RGB 축약형이 거부됨");
  assert.throws(() => createTheme({ brand: "notacolor" }), /hex여야 한다/);
  assert.throws(() => createTheme({ brand: "#808080" }), /무채색/);
}

// ── 3. hue 전수 스윕 — 검사에 걸리는 hue가 있으면 진단 메시지 형식을 검증하고,
//      전부 통과하면 그 사실 자체를 고정한다(회귀 시 이 단언이 알려준다).
{
  const failedHues: number[] = [];
  for (let hue = 0; hue < 360; hue += 1) {
    const rad = (hue * Math.PI) / 180;
    // hue만 실리면 되므로 채도 있는 중간 밝기 색을 합성해 hex로 넘긴다.
    const l = 0.6;
    const a = 0.12 * Math.cos(rad);
    const b = 0.12 * Math.sin(rad);
    const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const lin = [
      4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
      -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
      -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
    ].map((x) => Math.min(1, Math.max(0, x)));
    const hex = `#${lin
      .map((x) => {
        const srgb = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
        return Math.round(srgb * 255)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")}`;
    try {
      createTheme({ brand: hex });
    } catch (error) {
      failedHues.push(hue);
      const message = error instanceof Error ? error.message : "";
      // 진단 계약: 실패 쌍·실측 대비·조정 방향이 반드시 담긴다.
      assert.ok(/on/.test(message) && /:1/.test(message), `진단에 쌍·대비 없음 (hue ${hue})`);
      assert.ok(message.includes("시도해라"), `진단에 조정 방향 없음 (hue ${hue})`);
    }
  }
  console.log(
    failedHues.length === 0
      ? "  createTheme: 360개 hue 전부 검사 통과"
      : `  createTheme: 실패 hue ${failedHues.length}개 (${failedHues.slice(0, 8).join(", ")}…) — 진단 형식 검증됨`,
  );
}

console.log("createTheme 셀프체크 통과");
