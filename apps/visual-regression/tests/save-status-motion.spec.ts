import { expect, test, type Locator } from "@playwright/test";

import { hasStory, interruptMidTransition, recordTransitions, transitions } from "./motion-helpers";

const SAVE_STATUS = "savestatus--motion-demo";

/**
 * 두 프레임(≈32ms) 뒤의 상태. 남은 전환 시간(≈100ms)보다 훨씬 짧아, 여기서 최종값이 보이면
 * "전환이 끝나길 기다린 것"이 아니라 "취소하고 즉시 반영한 것"이다.
 */
function settledState(icon: Locator) {
  return icon.evaluate(async (el) => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const root = el.closest(".dds-save-status")!;
    return {
      crossfade: el.hasAttribute("data-crossfade"),
      spinners: el.querySelectorAll('[data-layer="spinner"]').length,
      glyph: getComputedStyle(el.querySelector('[data-layer="glyph"]')!).opacity,
      status: [...root.classList]
        .find((name) => name.startsWith("dds-save-status--status_"))!
        .replace("dds-save-status--status_", ""),
    };
  });
}

test.describe("SaveStatus 모션", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(SAVE_STATUS), `스토리 없음: ${SAVE_STATUS}`);
    await page.goto(`/iframe.html?id=${SAVE_STATUS}&viewMode=story`);
    await expect(page.getByTestId("motion-status")).toBeVisible();
  });

  test("saving → saved에서만 두 레이어가 150ms 교차 페이드한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const icon = page.getByTestId("motion-status").locator(".dds-save-status__icon");

    await page.getByTestId("motion-set-saving").click();
    await expect(icon.locator('[data-layer="spinner"]')).toHaveCSS("opacity", "1");

    await recordTransitions(page);
    await page.getByTestId("motion-set-saved").click();

    // 사라지는 스피너 레이어가 같은 자리에 남아 현재 opacity에서 이어진다.
    await expect(icon).toHaveAttribute("data-crossfade", "");
    await expect(icon.locator('[data-layer="glyph"]')).toHaveCSS(
      "transition-duration",
      "0.15s",
    );
    await expect(icon.locator('[data-layer="spinner"]')).toHaveCount(1);

    await expect
      .poll(async () =>
        (await transitions(page)).filter((e) => e.phase === "transitionend" && e.property === "opacity")
          .map((e) => e.layer)
          .sort(),
      )
      .toEqual(["glyph", "spinner"]);
    await expect(icon.locator('[data-layer="spinner"]')).toHaveCSS("opacity", "0");
    await expect(icon.locator('[data-layer="glyph"]')).toHaveCSS("opacity", "1");
  });

  test("완료 외의 진입은 즉시 반영한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const icon = page.getByTestId("motion-status").locator(".dds-save-status__icon");
    await recordTransitions(page);

    // saved → saving(스피너 진입), saving → error(실패는 지연 없이)
    await page.getByTestId("motion-set-saving").click();
    await expect(icon).not.toHaveAttribute("data-crossfade", "");
    await page.getByTestId("motion-set-error").click();
    await expect(icon).not.toHaveAttribute("data-crossfade", "");
    await expect(icon.locator('[data-layer="spinner"]')).toHaveCount(0);
    await expect(page.getByTestId("motion-status")).toHaveAttribute("role", "alert");

    // dirty → saved도 전환 대상이 아니다.
    await page.getByTestId("motion-set-dirty").click();
    await page.getByTestId("motion-set-saved").click();
    await expect(icon).not.toHaveAttribute("data-crossfade", "");
    expect(await transitions(page)).toEqual([]);
  });

  test("전환 도중 상태가 바뀌면 처음으로 튀지 않고 최신 상태로 수렴한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const icon = page.getByTestId("motion-status").locator(".dds-save-status__icon");

    await page.getByTestId("motion-set-saving").click();
    await recordTransitions(page);
    await interruptMidTransition(page, "motion-set-saved", "motion-set-dirty");

    expect(await settledState(icon)).toEqual({
      crossfade: false,
      spinners: 0,
      glyph: "1",
      status: "dirty",
    });
    // 시작된 전환이 있었다면 끝까지 가지 않았다는 것만 본다 — 바쁜 머신에서는 첫 스타일 재계산이
    // 밀려 전환이 시작조차 안 할 수 있어, 취소 이벤트 자체를 단언하면 흔들린다.
    expect((await transitions(page)).some((event) => event.phase === "transitionend")).toBe(false);
  });

  test('motion="none"은 전환 도중에도 즉시 적용된다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const icon = page.getByTestId("motion-status").locator(".dds-save-status__icon");

    await page.getByTestId("motion-set-saving").click();
    await recordTransitions(page);
    await interruptMidTransition(page, "motion-set-saved", "motion-none");

    expect(await settledState(icon)).toEqual({
      crossfade: false,
      spinners: 0,
      glyph: "1",
      status: "saved",
    });
    expect((await transitions(page)).some((event) => event.phase === "transitionend")).toBe(
      false,
    );

    // 끈 뒤의 완료는 아예 전환을 만들지 않는다.
    await recordTransitions(page);
    await page.getByTestId("motion-set-saving").click();
    await page.getByTestId("motion-set-saved").click();
    await expect(icon).not.toHaveAttribute("data-crossfade", "");
    await expect(icon.locator('[data-layer="spinner"]')).toHaveCount(0);
    expect(await transitions(page)).toEqual([]);
  });

  test("reduce에서도 위치 변화 없는 opacity 전환은 150ms로 남는다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const icon = page.getByTestId("motion-status").locator(".dds-save-status__icon");

    await page.getByTestId("motion-set-saving").click();
    // 스피너 회전은 reduce에서 멈춘다(기존 정책) — 교차 페이드만 남는다.
    await expect(icon.locator(".dds-spinner")).toHaveCSS("animation-name", "none");

    await recordTransitions(page);
    await page.getByTestId("motion-set-saved").click();
    await expect(icon.locator('[data-layer="glyph"]')).toHaveCSS(
      "transition-duration",
      "0.15s",
    );
    await expect
      .poll(async () => (await transitions(page)).some((e) => e.phase === "transitionend"))
      .toBe(true);
  });
});
