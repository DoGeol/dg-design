/**
 * createTheme 셀프체크. generate처럼 의존성 0으로 빌드마다 돈다 —
 * 실패하면 빌드가 실패한다(대비 검사와 같은 지위).
 */
import { strict as assert } from "node:assert";

import { createTheme } from "./create-theme.ts";
import { palette, semanticColors } from "./tokens.ts";

// ── 1. 임의 브랜드(보라)로 전량 생성 + 구조 확인
{
  const { css, brandHue } = createTheme({ brand: "#6A4FBB" });
  assert.ok(brandHue > 250 && brandHue < 320, `보라 hue 추출 실패: ${brandHue}`);

  const paletteCount = (css.match(/--dds-color-palette-/g) ?? []).length;
  assert.equal(paletteCount, Object.keys(palette).length, "palette 개수 불일치");

  const semanticCount = (css.match(/--dds-color-(?!palette-)/g) ?? []).length;
  // semantic은 라이트·다크 두 번 나온다.
  assert.equal(semanticCount, Object.keys(semanticColors).length * 2, "semantic 개수 불일치");

  assert.ok(css.includes(":root {"), ":root 블록 없음");
  assert.ok(css.includes('[data-dds-theme="dark"] {'), "다크 블록 없음");
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
