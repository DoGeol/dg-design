import { expect, test, type Locator, type Page } from "@playwright/test";

import { hasStory, indicatorProbe } from "./motion-helpers";

/**
 * Tabs는 automatic 활성화(포커스가 곧 활성화)라 입력 방식을 pointerdown에서 가른다.
 * 밑줄은 가로로만 움직이므로 세로 정렬은 항상 활성 Trigger와 같아야 한다.
 */
const TABS = "tabs--motion-demo";

const probe = (list: Locator) =>
  indicatorProbe(list, { indicator: ".dds-tabs__indicator", item: ".dds-tabs__trigger" });

const listOf = (page: Page, testId: string) =>
  page.getByTestId(testId).locator(".dds-tabs__list");

test.describe("Tabs 모션", () => {
  const SUMMARY = "요약";
  const BILLING = "결제 및 정산 내역";
  const ALERTS = "알림";

  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(TABS), `스토리 없음: ${TABS}`);
    await page.goto(`/iframe.html?id=${TABS}&viewMode=story`);
    await expect(page.getByTestId("motion-tabs")).toBeVisible();
  });

  test("포인터 선택은 밑줄이 직전 탭 자리에서 새 탭으로 옮겨간다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const list = listOf(page, "motion-tabs");

    await expect(list).toHaveAttribute("data-indicator", "");
    expect(await probe(list).gap(SUMMARY)).toBeLessThan(0.5);
    const from = await probe(list).itemRect(SUMMARY);

    // 라벨 길이가 크게 다른 탭으로 — 위치와 폭을 같이 맞춰야 한다.
    await list.getByText(BILLING).click();

    const start = await probe(list).seek(0);
    expect(start).not.toBeNull();
    expect(start!.duration).toBe(150);
    expect(start!.easing).toBe("cubic-bezier(0, 0, 0.2, 1)");
    expect(Math.abs(start!.left - from.left)).toBeLessThan(0.5);
    expect(Math.abs(start!.width - from.width)).toBeLessThan(0.5);
    // 세로로는 움직이지 않는다 — 밑줄은 시작부터 끝까지 같은 높이다.
    expect(Math.abs(start!.top - from.top)).toBeLessThan(0.5);

    const to = await probe(list).itemRect(BILLING);
    const end = await probe(list).seek("end");
    expect(Math.abs(end!.left - to.left)).toBeLessThan(0.5);
    expect(Math.abs(end!.width - to.width)).toBeLessThan(0.5);

    await probe(list).finish();
    expect(await probe(list).gap(BILLING)).toBeLessThan(0.5);
  });

  test("이동 중 다른 탭을 누르면 처음으로 튀지 않고 현재 자리에서 이어간다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const list = listOf(page, "motion-tabs");
    const origin = await probe(list).itemRect(SUMMARY);

    await list.getByText(BILLING).click();
    const paused = await probe(list).seek(75);
    expect(paused!.left).toBeGreaterThan(origin.left);

    await list.getByText(ALERTS).click();
    const restart = await probe(list).seek(0);
    expect(Math.abs(restart!.left - paused!.left)).toBeLessThan(0.5);
    expect(Math.abs(restart!.width - paused!.width)).toBeLessThan(0.5);

    await probe(list).finish();
    expect(await probe(list).gap(ALERTS)).toBeLessThan(0.5);
  });

  test("키보드는 automatic 활성화를 유지한 채 즉시 정렬한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const list = listOf(page, "motion-tabs");
    const panel = page.getByTestId("motion-tabs").getByRole("tabpanel");

    await list.getByText(SUMMARY).click();
    await probe(list).finish();

    // 화살표: 포커스가 닿는 즉시 선택·패널이 바뀌고 밑줄은 애니메이션 없이 이미 제자리다.
    await page.keyboard.press("ArrowRight");
    await expect(list.getByRole("tab", { name: BILLING })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(panel).toContainText("메모");
    expect(await probe(list).animations()).toBe(0);
    expect(await probe(list).gap(BILLING)).toBeLessThan(0.5);

    await page.keyboard.press("End");
    await expect(list.getByRole("tab", { name: ALERTS })).toBeFocused();
    expect(await probe(list).animations()).toBe(0);
    expect(await probe(list).gap(ALERTS)).toBeLessThan(0.5);

    await page.keyboard.press("Home");
    expect(await probe(list).animations()).toBe(0);
    expect(await probe(list).gap(SUMMARY)).toBeLessThan(0.5);
  });

  test('프로그램 선택·motion="none"·reduce는 움직이지 않는다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const list = listOf(page, "motion-tabs");

    await page.getByTestId("set-alerts").click();
    expect(await probe(list).animations()).toBe(0);
    expect(await probe(list).gap(ALERTS)).toBeLessThan(0.5);

    const none = listOf(page, "motion-none-tabs");
    await none.getByText(BILLING).click();
    expect(await probe(none).animations()).toBe(0);
    expect(await probe(none).gap(BILLING)).toBeLessThan(0.5);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await list.getByText(SUMMARY).click();
    expect(await probe(list).animations()).toBe(0);
    expect(await probe(list).gap(SUMMARY)).toBeLessThan(0.5);
  });

  test("탭 추가·제거와 RTL 뒤에도 밑줄이 정확히 정렬한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const list = listOf(page, "motion-tabs");

    await page.getByTestId("toggle-extra").click();
    await expect.poll(() => probe(list).gap(SUMMARY)).toBeLessThan(0.5);

    await page.getByTestId("toggle-extra").click();
    await expect.poll(() => probe(list).gap(SUMMARY)).toBeLessThan(0.5);

    await page.getByTestId("toggle-rtl").click();
    await expect(list).toHaveCSS("direction", "rtl");
    await expect.poll(() => probe(list).gap(SUMMARY)).toBeLessThan(0.5);

    // RTL에서의 포인터 선택도 정확히 도착한다.
    await list.getByText(BILLING).click();
    await probe(list).finish();
    expect(await probe(list).gap(BILLING)).toBeLessThan(0.5);
  });

  test("responsive wide를 오갈 때 잔상 없이 다시 정렬하고 패널 상태가 남는다", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const narrowList = listOf(page, "motion-responsive-tabs");
    const wrapper = page.getByTestId("motion-responsive-tabs");

    await page.setViewportSize({ width: 480, height: 700 });
    await expect(narrowList).toBeVisible();
    await expect(narrowList).toHaveAttribute("data-indicator", "");

    // 패널 안 입력값이 wide 왕복에도 살아남는지 같이 본다.
    await listOf(page, "motion-tabs").getByText(BILLING).click();
    await page.getByTestId("motion-tabs").getByLabel("메모").fill("초안");

    await page.setViewportSize({ width: 900, height: 700 });
    await expect(wrapper.locator(".dds-tabs")).toHaveAttribute("data-wide", "");
    await expect(narrowList).toBeHidden();
    // 숨은 동안에는 진행 중이던 이동도 남지 않는다.
    expect(await probe(narrowList).animations()).toBe(0);

    await page.setViewportSize({ width: 480, height: 700 });
    await expect(narrowList).toBeVisible();
    await expect.poll(() => probe(narrowList).gap("요약")).toBeLessThan(0.5);
    await expect(page.getByTestId("motion-tabs").getByLabel("메모")).toHaveValue("초안");
  });
});
