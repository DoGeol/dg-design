import { expect, test } from "@playwright/test";

test("좁은 Alert에서 행동과 닫기 버튼은 겹치지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 260, height: 800 });
  await page.goto("/iframe.html?id=alert--with-actions&viewMode=story");
  const close = page.getByRole("button", { name: "닫기" });
  await expect(close).toBeVisible();
  const closeBox = await close.boundingBox();
  if (!closeBox) throw new Error("닫기 버튼의 크기를 읽을 수 없습니다.");
  for (const name of ["복원", "폐기"]) {
    const action = page.getByRole("button", { name });
    await expect(action).toBeVisible();
    const box = await action.boundingBox();
    if (!box) throw new Error(`${name} 버튼의 크기를 읽을 수 없습니다.`);
    const overlap = box.x < closeBox.x + closeBox.width && box.x + box.width > closeBox.x && box.y < closeBox.y + closeBox.height && box.y + box.height > closeBox.y;
    expect(overlap).toBe(false);
  }
});
