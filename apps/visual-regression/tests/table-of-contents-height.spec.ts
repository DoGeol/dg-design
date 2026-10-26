import { expect, test } from "@playwright/test";

test("열린 목차의 높이가 안정적으로 유지된다", async ({ page }) => {
  await page.goto("/iframe.html?id=tableofcontents--state-matrix&viewMode=story");
  const content = page.locator('.dds-table-of-contents__content[data-state="open"]').first();
  await expect(content).toBeVisible();
  const before = await content.evaluate((element) => element.getBoundingClientRect().height);
  await page.waitForTimeout(600);
  const after = await content.evaluate((element) => element.getBoundingClientRect().height);
  expect(after).toBe(before);
});
