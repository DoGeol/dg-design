import { expect, test } from "@playwright/test";

import { hasStory } from "./motion-helpers";

/**
 * 2026-10-31 모션 조사의 조작 색 전환(1·8·9)과 Alert 진입(3).
 *
 * 계산된 transition은 jsdom이 못 본다 — 여기가 "규칙이 실제로 걸렸나"를 보는 유일한 자리다.
 * 색 전환은 위치·크기 변화가 아니라 reduce에서도 남아야 하므로 reduce를 켠 채로 잰다.
 */

const DURATION = "0.15s";

const CASES = [
  { story: "switch--state-matrix-story", selector: ".dds-switch__track", properties: "background-color" },
  { story: "checkbox--state-matrix-story", selector: ".dds-checkbox__box", properties: "background-color, border-color" },
  { story: "chip--state-matrix", selector: ".dds-chip--filter", properties: "background-color, box-shadow, color" },
  { story: "tabs--state-matrix", selector: ".dds-tabs__trigger", properties: "background-color, color" },
  { story: "breadcrumb--state-matrix", selector: ".dds-breadcrumb__link", properties: "color" },
  { story: "fileinput--state-matrix", selector: ".dds-file-input__dropzone", properties: "background-color, border-color" },
] as const;

test.describe("조작 색 전환", () => {
  for (const { story, selector, properties } of CASES) {
    test(`${selector} — ${properties} ${DURATION}, reduce에서도 유지`, async ({ page }) => {
      test.skip(!hasStory(story), `스토리 없음: ${story}`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/iframe.html?id=${story}&viewMode=story`);

      const style = await page.locator(selector).first().evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          property: computed.transitionProperty,
          duration: computed.transitionDuration,
        };
      });

      expect(style.property).toBe(properties);
      expect(new Set(style.duration.split(", "))).toEqual(new Set([DURATION]));
    });
  }
});

/** 새로 붙은 Alert만 전환한다 — 이미 있던 Alert는 @starting-style 대상이 아니다. */
const mountCopy = async (selector: string) => {
  const original = document.querySelector(selector)!;
  const copy = original.cloneNode(true) as HTMLElement;
  original.parentElement!.append(copy);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const computed = getComputedStyle(copy);
  return { opacity: Number(computed.opacity), translate: computed.translate };
};

test.describe("Alert 진입", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory("alert--state-matrix"), "스토리 없음: alert--state-matrix");
  });

  test("한 칸 아래에서 올라오며 떠오른다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/iframe.html?id=alert--state-matrix&viewMode=story");
    await page.locator(".dds-alert").first().waitFor();

    const entering = await page.evaluate(mountCopy, ".dds-alert");

    expect(entering.opacity).toBeLessThan(1);
    expect(entering.translate).not.toBe("none");
  });

  test("reduce에서는 이동 없이 페이드만", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/iframe.html?id=alert--state-matrix&viewMode=story");
    await page.locator(".dds-alert").first().waitFor();

    const entering = await page.evaluate(mountCopy, ".dds-alert");

    expect(entering.opacity).toBeLessThan(1);
    expect(entering.translate).toBe("none");
  });
});
