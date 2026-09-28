import { expect, test } from "@playwright/test";

test.describe("DatePicker 열린 화면 시각 회귀", () => {
  test.skip(process.platform !== "linux", "Linux 기준 이미지는 visual-baseline 워크플로에서만 생성·비교한다");

  test("데스크톱 단일 달력 · light", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/iframe.html?id=datepicker--functional-demo&viewMode=story&globals=theme:light");
    await page.locator("#storybook-root").getByRole("button", { name: /방문 날짜/ }).click();
    const dialog = page.getByRole("dialog", { name: "방문 날짜" });
    await expect(dialog).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect(dialog).toHaveScreenshot("datepicker-open-desktop-light.png");
  });

  test("데스크톱 두 달 범위 · dark", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/iframe.html?id=daterangepicker--functional-demo&viewMode=story&globals=theme:dark");
    await expect(page.locator("html")).toHaveAttribute("data-dds-theme", "dark");
    await page.locator("#storybook-root").getByRole("button", { name: /여행 기간/ }).click();
    const dialog = page.getByRole("dialog", { name: "여행 기간" });
    await expect(dialog.getByRole("grid")).toHaveCount(2);
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect(dialog).toHaveScreenshot("daterangepicker-open-desktop-dark.png");
  });

  test("모바일 범위 시트 · light", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/iframe.html?id=daterangepicker--functional-demo&viewMode=story&globals=theme:light");
    await page.locator("#storybook-root").getByRole("button", { name: /여행 기간/ }).click();
    const dialog = page.getByRole("dialog", { name: "여행 기간" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByRole("grid")).toHaveCount(1);
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect(dialog).toHaveScreenshot("daterangepicker-open-mobile-light.png");
  });
});
