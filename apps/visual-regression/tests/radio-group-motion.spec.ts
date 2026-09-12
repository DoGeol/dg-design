import { expect, test, type Locator } from "@playwright/test";

import { hasStory, indicatorProbe, SLOW_MOTION } from "./motion-helpers";

/**
 * RadioGroup segmented 배경은 WAAPI로 움직여서 CSS duration 오버라이드가 통하지 않는다 —
 * 대신 진행 중인 애니메이션을 직접 멈춰 세우고 원하는 시점으로 돌려 중간 상태를 읽는다.
 * 프레임 타이밍에 기대지 않으므로 느린 머신에서도 결과가 같다.
 */
const RADIO_GROUP = "radiogroup--motion-demo";

const probe = (root: Locator) =>
  indicatorProbe(root, { indicator: ".dds-radio-group__indicator", item: ".dds-radio" });

test.describe("RadioGroup 모션", () => {
  const ALL = "전체";
  const MINE = "내 것";
  const ARCHIVED = "보관함(오래된 항목)";

  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(RADIO_GROUP), `스토리 없음: ${RADIO_GROUP}`);
    await page.goto(`/iframe.html?id=${RADIO_GROUP}&viewMode=story`);
    await expect(page.getByTestId("motion-segmented")).toBeVisible();
  });

  test("포인터 선택은 배경이 직전 위치·크기에서 새 항목으로 옮겨간다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const root = page.getByTestId("motion-segmented").locator(".dds-radio-group");

    expect(await probe(root).gap(ALL)).toBeLessThan(0.5);
    const from = await probe(root).itemRect(ALL);

    // 폭이 다른 항목으로 — 위치와 크기를 같이 맞춰야 한다.
    await root.getByText(ARCHIVED).click();

    const start = await probe(root).seek(0);
    expect(start).not.toBeNull();
    expect(start!.duration).toBe(150);
    expect(start!.easing).toBe("cubic-bezier(0, 0, 0.2, 1)");
    expect(Math.abs(start!.left - from.left)).toBeLessThan(0.5);
    expect(Math.abs(start!.width - from.width)).toBeLessThan(0.5);

    const to = await probe(root).itemRect(ARCHIVED);
    const end = await probe(root).seek("end");
    expect(Math.abs(end!.left - to.left)).toBeLessThan(0.5);
    expect(Math.abs(end!.width - to.width)).toBeLessThan(0.5);

    await probe(root).finish();
    expect(await probe(root).gap(ARCHIVED)).toBeLessThan(0.5);
  });

  test("이동 중 반대로 선택하면 처음으로 튀지 않고 현재 위치에서 이어간다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const root = page.getByTestId("motion-segmented").locator(".dds-radio-group");
    const origin = await probe(root).itemRect(ALL);

    await root.getByText(ARCHIVED).click();
    const paused = await probe(root).seek(75);
    expect(paused!.left).toBeGreaterThan(origin.left);

    // 멈춰 세운 한복판에서 반전 — 새 이동은 "지금 보이는 자리"에서 시작해야 한다.
    await root.getByText(ALL).click();
    const restart = await probe(root).seek(0);
    expect(Math.abs(restart!.left - paused!.left)).toBeLessThan(0.5);
    expect(Math.abs(restart!.width - paused!.width)).toBeLessThan(0.5);

    await probe(root).finish();
    expect(await probe(root).gap(ALL)).toBeLessThan(0.5);
  });

  test("키보드와 프로그램 변경은 이동 없이 즉시 정렬한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const root = page.getByTestId("motion-segmented").locator(".dds-radio-group");

    await root.getByText(ALL).click();
    await probe(root).finish();

    // 네이티브 방향키 선택 — 값이 바뀌고 배경은 애니메이션 없이 이미 제자리다.
    await page.keyboard.press("ArrowRight");
    await expect(root.getByRole("radio", { name: MINE })).toBeChecked();
    expect(await probe(root).animations()).toBe(0);
    expect(await probe(root).gap(MINE)).toBeLessThan(0.5);

    await page.getByTestId("set-archived").click();
    expect(await probe(root).animations()).toBe(0);
    expect(await probe(root).gap(ARCHIVED)).toBeLessThan(0.5);
  });

  test('motion="none"과 reduce는 포인터 선택에도 움직이지 않는다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const none = page.getByTestId("motion-none-segmented").locator(".dds-radio-group");

    await none.getByText(ARCHIVED).click();
    expect(await probe(none).animations()).toBe(0);
    expect(await probe(none).gap(ARCHIVED)).toBeLessThan(0.5);

    await page.emulateMedia({ reducedMotion: "reduce" });
    const root = page.getByTestId("motion-segmented").locator(".dds-radio-group");
    await root.getByText(MINE).click();
    expect(await probe(root).animations()).toBe(0);
    expect(await probe(root).gap(MINE)).toBeLessThan(0.5);
  });

  test("라벨 폭 변경·항목 추가·RTL 뒤에도 배경이 정확히 정렬한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const root = page.getByTestId("motion-segmented").locator(".dds-radio-group");

    // 선택된 항목이 아닌 항목의 폭이 변해도(ResizeObserver) 다시 맞춘다.
    await page.getByTestId("toggle-wide").click();
    await expect.poll(() => probe(root).gap(ALL)).toBeLessThan(0.5);

    await page.getByTestId("toggle-extra").click();
    await expect.poll(() => probe(root).gap(ALL)).toBeLessThan(0.5);

    await page.getByTestId("toggle-rtl").click();
    await expect(root).toHaveCSS("direction", "rtl");
    await expect.poll(() => probe(root).gap(ALL)).toBeLessThan(0.5);

    // RTL에서의 포인터 선택도 정확히 도착한다.
    await root.getByText(ARCHIVED).click();
    await probe(root).finish();
    expect(await probe(root).gap(ARCHIVED)).toBeLessThan(0.5);
  });

  test("기본형 점은 포인터 선택에만 교차하고 키보드는 즉시다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const root = page.getByTestId("motion-default").locator(".dds-radio-group");
    const dots = () =>
      root.evaluate((el) =>
        [...el.querySelectorAll(".dds-radio__dot")].map((dot) =>
          Number(getComputedStyle(dot).opacity),
        ),
      );

    await root.getByText("빠른배송").click();
    await expect(root).toHaveAttribute("data-motion", "");
    await page.waitForTimeout(300);

    // 나가는 점과 들어오는 점이 같이 진행 중 — 둘 다 중간값이다.
    const [first, second] = await dots();
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(1);
    expect(second).toBeGreaterThan(0);
    expect(second).toBeLessThan(1);

    // 전환 한복판의 키보드 개입은 즉시 반영하고 모션 허용도 내린다.
    await page.keyboard.press("ArrowDown");
    await expect(root).not.toHaveAttribute("data-motion", "");
    expect(await dots()).toEqual([0, 0, 1]);
  });
});
