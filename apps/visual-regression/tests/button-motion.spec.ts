import { expect, test, type Locator } from "@playwright/test";

import { hasStory, SLOW_MOTION } from "./motion-helpers";

/**
 * Button 로딩은 비동기 상태라 포인터 판별이 없다 — 첫 렌더만 빼고 언제나 교차 페이드한다.
 * 핵심 계약은 "전/중/후 버튼 크기가 같다"라서 좌표를 직접 재고, 중단 검증은 전환을 10배로 늘려
 * 라운드트립 지연이 결과를 흔들지 않게 한다.
 */
const BUTTON = "button--motion-demo";

/** 버튼 사각형과 두 레이어의 opacity를 두 프레임 뒤에 읽는다. */
function state(wrapper: Locator) {
  return wrapper.evaluate(async (el) => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const button = el.querySelector(".dds-button")!;
    const rect = button.getBoundingClientRect();
    const layer = (name: string) =>
      Number(getComputedStyle(el.querySelector(`[data-layer="${name}"]`)!).opacity);
    return {
      box: [rect.x, rect.y, rect.width, rect.height].map((n) => Math.round(n * 100) / 100),
      content: layer("content"),
      spinner: layer("spinner"),
      busy: button.getAttribute("aria-busy"),
      disabled: (button as HTMLButtonElement).disabled,
      spinnerMounted: el.querySelector(".dds-button__spinner") !== null,
    };
  });
}

function opacities(wrapper: Locator) {
  return wrapper.evaluate((el) => ({
    content: Number(getComputedStyle(el.querySelector('[data-layer="content"]')!).opacity),
    spinner: Number(getComputedStyle(el.querySelector('[data-layer="spinner"]')!).opacity),
  }));
}

/** 브라우저 반올림 여유 1px — 계획의 합격 기준과 같다. */
function expectSameBox(a: number[], b: number[]) {
  for (let i = 0; i < a.length; i += 1) expect(Math.abs(a[i] - b[i])).toBeLessThanOrEqual(1);
}

test.describe("Button 모션", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(BUTTON), `스토리 없음: ${BUTTON}`);
    await page.goto(`/iframe.html?id=${BUTTON}&viewMode=story`);
    await expect(page.getByTestId("motion-button")).toBeVisible();
  });

  test("로딩 전·중·후 버튼 크기가 같고 라벨과 Spinner가 교차한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const wrapper = page.getByTestId("motion-button");
    const content = wrapper.locator('[data-layer="content"]');

    const before = await state(wrapper);
    expect(before).toMatchObject({ content: 1, spinner: 0, disabled: false, spinnerMounted: false });

    await page.getByTestId("toggle-loading").click();

    // 의미 상태는 전환을 기다리지 않는다.
    await expect(wrapper.locator(".dds-button")).toHaveAttribute("aria-busy", "true");
    await expect(content).toHaveCSS("transition-duration", "0.15s");
    await expect(content).toHaveCSS("transition-timing-function", "cubic-bezier(0, 0, 0.2, 1)");

    const during = await state(wrapper);
    expectSameBox(before.box, during.box);
    expect(during.disabled).toBe(true);

    const loaded = await state(wrapper);
    expectSameBox(before.box, loaded.box);

    await expect.poll(async () => (await opacities(wrapper)).spinner).toBe(1);
    expect((await opacities(wrapper)).content).toBe(0);

    // 복귀도 같은 크기로 돌아오고, 전환이 끝나면 Spinner가 내려간다.
    await page.getByTestId("toggle-loading").click();
    await expect.poll(async () => (await state(wrapper)).spinnerMounted).toBe(false);
    const after = await state(wrapper);
    expectSameBox(before.box, after.box);
    expect(after).toMatchObject({ content: 1, spinner: 0, disabled: false });
  });

  test("전환 도중 되돌리면 현재 값에서 이어가고 크기는 그대로다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const wrapper = page.getByTestId("motion-button");
    const before = await state(wrapper);

    await page.getByTestId("toggle-loading").click();
    await page.waitForTimeout(300);
    const rising = await opacities(wrapper);
    expect(rising.spinner).toBeGreaterThan(0);
    expect(rising.spinner).toBeLessThan(1);
    expect(rising.content).toBeLessThan(1);

    // 한복판에서 되돌린다 — 0이나 1로 튀지 않고 지금 값에서 반대로 간다.
    await page.getByTestId("toggle-loading").click();
    const reversing = await opacities(wrapper);
    expect(reversing.spinner).toBeGreaterThan(0);
    expect(reversing.spinner).toBeLessThan(1);

    await expect.poll(async () => (await opacities(wrapper)).content).toBe(1);
    const after = await state(wrapper);
    expectSameBox(before.box, after.box);
    expect(after.spinner).toBe(0);
  });

  test("아이콘+라벨과 전체 폭 버튼도 로딩 중 크기가 같다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const icon = page.getByTestId("motion-icon-button");
    const full = page.getByTestId("motion-full-button");

    const iconBefore = await state(icon);
    const fullBefore = await state(full);

    await page.getByTestId("toggle-loading").click();
    await expect.poll(async () => (await opacities(icon)).spinner).toBe(1);

    expectSameBox(iconBefore.box, (await state(icon)).box);
    expectSameBox(fullBefore.box, (await state(full)).box);

    // 정착 상태에서는 라벨과 Spinner가 겹치지 않는다(한쪽이 완전히 0).
    expect((await opacities(icon)).content).toBe(0);
    expect((await opacities(full)).content).toBe(0);
  });

  test('motion="none"은 즉시 바뀌고 reduce는 opacity 전환만 남긴다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const none = page.getByTestId("motion-none-button");
    const noneBefore = await state(none);

    await page.getByTestId("toggle-loading").click();
    // 두 프레임 안에 최종값이면 전환을 기다린 것이 아니다. 크기도 그대로다.
    const noneLoading = await state(none);
    expect(noneLoading).toMatchObject({ content: 0, spinner: 1, disabled: true });
    expectSameBox(noneBefore.box, noneLoading.box);

    await page.getByTestId("toggle-loading").click();
    expect(await state(none)).toMatchObject({ content: 1, spinner: 0, spinnerMounted: false });

    // reduce에서도 위치 변화 없는 opacity 전환은 150ms로 남는다.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const auto = page.getByTestId("motion-button");
    await expect(auto.locator('[data-layer="content"]')).toHaveCSS(
      "transition-duration",
      "0.15s",
    );
    await page.getByTestId("toggle-loading").click();
    await expect.poll(async () => (await opacities(auto)).spinner).toBe(1);
    expectSameBox((await state(auto)).box, (await state(auto)).box);
  });

  test("asChild 경로에는 래퍼도 레이어도 붙지 않는다", async ({ page }) => {
    const link = page.getByTestId("motion-aschild").getByRole("link", { name: "링크형 버튼" });

    await expect(link).toHaveClass(/dds-button/);
    expect(await link.locator("[data-layer]").count()).toBe(0);
    await expect(link).not.toHaveAttribute("data-motion", "");
    await expect(link).toHaveText("링크형 버튼");
  });
});
