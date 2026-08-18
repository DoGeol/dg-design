#!/usr/bin/env node
/**
 * createTheme의 얇은 CLI 래퍼. Node 내장(parseArgs)만 쓴다 — 의존성 0 유지.
 *
 *   npx @dg-design/tokens --brand "#FF6F0F" -o dds-tokens.css
 *
 * -o 없이 부르면 stdout으로 낸다(파이프 용도). 실패는 exit 1 + stderr 진단.
 */
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

import { createTheme } from "./create-theme.ts";

function run(): number {
  let brand: string | undefined;
  let out: string | undefined;
  try {
    const { values } = parseArgs({
      options: {
        brand: { type: "string" },
        out: { type: "string", short: "o" },
        help: { type: "boolean", short: "h" },
      },
    });
    if (values.help || !values.brand) {
      const usage =
        'usage: dds-tokens --brand "#RRGGBB" [-o <file>]\n' +
        "  브랜드 hex로 WCAG 검사를 통과한 tokens.css 드롭인 교체본을 생성한다.";
      if (values.help) {
        console.log(usage);
        return 0;
      }
      console.error(usage);
      return 1;
    }
    brand = values.brand;
    out = values.out;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  try {
    const { css, brandHue } = createTheme({ brand });
    if (out === undefined) {
      process.stdout.write(css);
    } else {
      writeFileSync(out, css);
      console.error(`생성 완료 → ${out} (brand ${brand}, hue ${brandHue.toFixed(1)})`);
    }
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

process.exitCode = run();
