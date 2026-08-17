import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");

const SPINNER = "spinner--state-matrix";
const PROGRESS = "progress--state-matrix";

/** 스토리가 아직 빌드에 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

/**
 * reduced-motion은 CSS 미디어쿼리라 jsdom이 원리적으로 못 본다. Playwright는 실제로
 * 흉내낼 수 있으므로 여기서만 검증한다 — 유닛 테스트에서 CSS 원문을 문자열로 뒤지는
 * 방식은 포맷만 바뀌어도 깨지면서 정작 적용 여부는 증명하지 못한다.
 *
 * 설정(`use.reducedMotion`)에 의존하지 않고 테스트마다 `emulateMedia`로 직접 건다 —
 * 실측 결과 config 경로는 matchMedia에 반영되지 않았다(대조군 테스트가 그것을 고정한다).
 */
test.describe("prefers-reduced-motion", () => {
  test("Spinner의 회전이 멈춘다", async ({ page }) => {
    test.skip(!hasStory(SPINNER), `스토리 없음: ${SPINNER}`);
    await page.goto(`/iframe.html?id=${SPINNER}&viewMode=story`);

    const spinner = page.locator(".dds-spinner").first();
    await expect(spinner).toBeVisible();

    // 대조군: 무력화 전에는 실제로 돈다 — "원래도 안 돌았다"로 통과하는 것을 막는다.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(() => spinner.evaluate((el) => getComputedStyle(el).animationName))
      .not.toBe("none");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => spinner.evaluate((el) => getComputedStyle(el).animationName))
      .toBe("none");
  });

  test("Progress의 애니메이션이 멈춘다", async ({ page }) => {
    test.skip(!hasStory(PROGRESS), `스토리 없음: ${PROGRESS}`);
    await page.goto(`/iframe.html?id=${PROGRESS}&viewMode=story`);

    const indicator = page.locator("[class*='dds-progress']").first();
    await expect(indicator).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    const { animationName, transitionDuration } = await indicator.evaluate((el) => {
      const style = getComputedStyle(el);
      return { animationName: style.animationName, transitionDuration: style.transitionDuration };
    });
    expect(animationName).toBe("none");
    expect(transitionDuration === "0s" || transitionDuration === "").toBe(true);
  });
});
