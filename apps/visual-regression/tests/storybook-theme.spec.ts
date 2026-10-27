import { expect, test } from "@playwright/test";

test("Storybook preview는 실제 테마에 따라 배경과 기본 글자색을 바꾼다", async ({ page }) => {
  const colors = async (theme: "light" | "dark") => {
    await page.goto(`/iframe.html?id=button--all-combinations&viewMode=story&globals=theme:${theme}`);
    await expect(page.locator("#storybook-root > *").first()).toBeVisible();
    return page.locator("body").evaluate((body) => ({
      background: getComputedStyle(body).backgroundColor,
      foreground: getComputedStyle(body).color,
    }));
  };
  const light = await colors("light");
  const dark = await colors("dark");
  expect(dark.background).not.toBe(light.background);
  expect(dark.foreground).not.toBe(light.foreground);
});
