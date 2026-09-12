import { expect, test, type Locator } from "@playwright/test";

import { hasStory, interruptMidTransition, SLOW_MOTION } from "./motion-helpers";

/**
 * Checkbox는 "포인터로 누른 변경"만 전환한다. 페이지 안에서 부르는 element.click()은
 * detail=0(프로그램 클릭)이라 전환 대상이 아니므로, 포인터 조작은 실제 입력으로만 만든다.
 * 중단 검증은 전환을 10배로 늘려 라운드트립 지연이 결과를 흔들지 않게 한다.
 */
const CHECKBOX = "checkbox--motion-demo";

/** 두 프레임(≈32ms) 뒤의 상태 — 전환 시간보다 훨씬 짧아, 최종값이면 "즉시 반영"이다. */
function checkboxState(root: Locator) {
  return root.evaluate(async (el) => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const input = el.querySelector("input")!;
    const check = getComputedStyle(el.querySelector(".dds-checkbox__check-icon")!);
    const dash = getComputedStyle(el.querySelector(".dds-checkbox__dash-icon")!);
    return {
      motion: el.querySelector(".dds-checkbox__box")!.hasAttribute("data-motion"),
      checked: input.checked,
      indeterminate: input.indeterminate,
      check: Number(check.opacity).toFixed(2),
      dash: Number(dash.opacity).toFixed(2),
      checkTransform: check.transform,
    };
  });
}

function iconOpacity(root: Locator) {
  return root.evaluate((el) =>
    Number(getComputedStyle(el.querySelector(".dds-checkbox__check-icon")!).opacity),
  );
}

test.describe("Checkbox 모션", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(CHECKBOX), `스토리 없음: ${CHECKBOX}`);
    await page.goto(`/iframe.html?id=${CHECKBOX}&viewMode=story`);
    await expect(page.getByTestId("motion-auto")).toBeVisible();
  });

  test("포인터 클릭한 아이콘만 150ms opacity·scale로 전환한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const root = page.getByTestId("motion-auto");
    const box = root.locator(".dds-checkbox__box");
    const check = root.locator(".dds-checkbox__check-icon");

    // 모션 허용은 전환이 끝나면 스스로 꺼진다 — 150ms 창 안에서 값을 읽으려다 흔들리지 않게
    // 전환을 10배로 늘려 창을 넓히고, 오버라이드를 걷어 토큰 기본값도 같은 창에서 확인한다.
    const slow = await page.addStyleTag({ content: SLOW_MOTION });
    await root.getByText("포인터로 누르면 전환").click();

    await expect(box).toHaveAttribute("data-motion", "");
    await expect(check).toHaveCSS("transition-property", "opacity, transform");
    await expect(check).toHaveCSS("transition-duration", "1.5s, 1.5s");
    await expect(check).toHaveCSS(
      "transition-timing-function",
      "cubic-bezier(0, 0, 0.2, 1), cubic-bezier(0, 0, 0.2, 1)",
    );

    await slow.evaluate((el) => el.remove());
    await expect(check).toHaveCSS("transition-duration", "0.15s, 0.15s");

    // 전환이 끝나면 모션 허용이 사라진다 — 포인터 뒤에 모션 상태가 남지 않는다.
    await expect(box).not.toHaveAttribute("data-motion", "");
    expect(await checkboxState(root)).toMatchObject({
      motion: false,
      checked: true,
      check: "1.00",
      checkTransform: "none",
    });
  });

  test("반복 클릭은 현재값에서 이어지고 최신 상태로 수렴한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const root = page.getByTestId("motion-auto");
    const label = root.getByText("포인터로 누르면 전환");

    await label.click();
    await page.waitForTimeout(300);
    const rising = await iconOpacity(root);
    expect(rising).toBeGreaterThan(0);
    expect(rising).toBeLessThan(1);

    // 반전: 0이나 1로 튀지 않고 지금 값에서 되돌아간다.
    await label.click();
    const reversing = await iconOpacity(root);
    expect(reversing).toBeGreaterThan(0);
    expect(reversing).toBeLessThan(1);
    await expect.poll(() => iconOpacity(root)).toBe(0);
    expect(await checkboxState(root)).toMatchObject({ checked: false, check: "0.00" });
  });

  test("키보드 Space는 진행 중 전환을 끊고 즉시 반영한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const root = page.getByTestId("motion-auto");

    await root.getByText("포인터로 누르면 전환").click();
    await page.waitForTimeout(200);
    expect(await iconOpacity(root)).toBeLessThan(1);

    // 클릭이 input에 포커스를 남기므로 그대로 Space — 전환 한복판의 키보드 개입이다.
    await page.keyboard.press(" ");
    expect(await checkboxState(root)).toMatchObject({
      motion: false,
      checked: false,
      check: "0.00",
    });
  });

  test("프로그램 변경·중간 상태·폼 리셋은 전환 없이 즉시 반영한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const root = page.getByTestId("motion-auto");

    await page.getByTestId("set-checked").click();
    expect(await checkboxState(root)).toMatchObject({
      motion: false,
      checked: true,
      check: "1.00",
    });

    await page.getByTestId("set-indeterminate").click();
    expect(await checkboxState(root)).toMatchObject({
      motion: false,
      indeterminate: true,
      check: "0.00",
      dash: "1.00",
    });

    await page.getByTestId("reset").click();
    expect(await checkboxState(root)).toMatchObject({
      motion: false,
      checked: false,
      indeterminate: false,
      check: "0.00",
      dash: "0.00",
    });
  });

  test('motion="none"과 disabled는 포인터에도 전환하지 않는다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const none = page.getByTestId("motion-none");
    const disabled = page.getByTestId("motion-disabled");

    await none.getByText('motion="none"').click();
    expect(await checkboxState(none)).toMatchObject({
      motion: false,
      checked: true,
      check: "1.00",
    });

    // disabled는 label을 눌러도 input click 자체가 없다 — 값도 모션도 그대로.
    // (Playwright는 비활성 컨트롤의 label을 "enabled 아님"으로 보고 막으므로 강제로 누른다.)
    await disabled.getByText("비활성").click({ force: true });
    expect(await checkboxState(disabled)).toMatchObject({
      motion: false,
      checked: false,
      check: "0.00",
    });
  });

  test("reduce에서는 scale 없이 opacity만 전환한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const root = page.getByTestId("motion-auto");
    const check = root.locator(".dds-checkbox__check-icon");

    await root.getByText("포인터로 누르면 전환").click();
    await expect(check).toHaveCSS("transition-property", "opacity");

    // 전환 한복판인데도 크기는 이미 최종값(identity)이다 — 페이드만 남는다.
    await page.waitForTimeout(200);
    expect(await iconOpacity(root)).toBeLessThan(1);
    await expect(check).toHaveCSS("transform", "none");
  });
});
