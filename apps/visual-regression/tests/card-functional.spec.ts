import { expect, test } from "@playwright/test";

test("링크 카드는 별도 display 지정 없이 컨테이너 너비와 누름 영역을 가진다", async ({ page }) => {
  await page.goto("/iframe.html?id=card--link-demo&viewMode=story");
  const link = page.getByRole("link", { name: "문서 열기" });
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS("display", "block");
  expect((await link.boundingBox())?.width).toBe(320);
});
