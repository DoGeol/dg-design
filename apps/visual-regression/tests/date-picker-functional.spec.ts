import { expect, test } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

test.describe("DatePicker 기능", () => {
  test("데스크톱 단일 날짜: 달력 선택 즉시 확정·폼 값·포커스 복귀", async ({ page }) => {
    await page.goto(story("datepicker--functional-demo"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /방문 날짜/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "방문 날짜" });
    await expect(dialog).toBeVisible();
    await dialog.locator('[data-date="2026-09-28"]').click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toContainText("28");
    await expect(trigger).toBeFocused();
    await expect(page.locator('input[name="visitDate"]')).toHaveValue("2026-09-28");
  });

  test("데스크톱 범위: 두 달 가로 배치·적용/취소·중간 불가일", async ({ page }) => {
    await page.goto(story("daterangepicker--functional-demo"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /여행 기간/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "여행 기간" });
    const grids = dialog.getByRole("grid");
    await expect(grids).toHaveCount(2);
    const first = await grids.nth(0).boundingBox();
    const second = await grids.nth(1).boundingBox();
    expect(first && second && second.x > first.x && Math.abs(second.y - first.y) < 2).toBeTruthy();
    await dialog.getByRole("textbox", { name: "시작일" }).fill("2026-10-03");
    await dialog.getByRole("textbox", { name: "종료일" }).fill("2026-10-05");
    await dialog.getByRole("button", { name: "적용" }).click();
    await expect(dialog.getByRole("alert")).toContainText("선택할 수 없는 날짜");
    await dialog.getByRole("button", { name: "취소" }).click();
    await expect(trigger).toContainText("9. 27");
  });

  test("모바일: 모든 모드는 한 달 시트, 적용 버튼은 화면 안에 남음", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(story("daterangepicker--functional-demo"));
    await page.locator("#storybook-root").getByRole("button", { name: /여행 기간/ }).click();
    const dialog = page.getByRole("dialog", { name: "여행 기간" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByRole("grid")).toHaveCount(1);
    await expect(dialog.locator('[data-date="2026-09-27"]')).toBeFocused();
    const dayBox = await dialog.locator('[data-date="2026-09-27"]').boundingBox();
    expect(dayBox && dayBox.width >= 44 && dayBox.height >= 44).toBeTruthy();
    const apply = dialog.getByRole("button", { name: "적용" });
    await expect.poll(async () => {
      const box = await apply.boundingBox();
      return Boolean(box && box.y + box.height <= 667);
    }).toBe(true);
    await page.setViewportSize({ width: 375, height: 430 });
    await expect.poll(async () => {
      const box = await apply.boundingBox();
      return Boolean(box && box.y + box.height <= 430);
    }).toBe(true);
  });

  test("시간 모드: 임시 편집 취소와 화면 전환에서 값 보존", async ({ page }) => {
    await page.goto(story("datepicker--local-date-time"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /Meeting time/ });
    const original = await trigger.textContent();
    await trigger.click();
    await page.getByRole("textbox", { name: "Meeting time" }).fill("09/28/2026");
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileDialog = page.getByRole("dialog", { name: "Meeting time" });
    await expect(mobileDialog).toHaveAttribute("aria-modal", "true");
    await expect(mobileDialog.getByRole("textbox", { name: "Meeting time" })).toHaveValue(/09\/28\/2026/);
    await mobileDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(trigger).toHaveText(original ?? "");
  });

  test("시간대 중복 시각: 오프셋을 선택해야 적용 가능", async ({ page }) => {
    await page.goto(story("datepicker--zoned-date-time"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /New York meeting/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "New York meeting" });
    await dialog.getByRole("textbox", { name: "Time" }).fill("01:15 AM");
    await expect(dialog.getByRole("radio")).toHaveCount(2);
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    await dialog.getByRole("radio").nth(1).click();
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeEnabled();
    await dialog.getByRole("button", { name: "Apply" }).click();
    await expect(trigger).toContainText("1:15");
  });

  test("Escape는 기간 입력의 임시 변경을 버리고 기존 폼 값을 보존", async ({ page }) => {
    await page.goto(story("daterangepicker--functional-demo"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /여행 기간/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "여행 기간" });
    await dialog.getByRole("textbox", { name: "시작일" }).fill("2026-09-29");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.locator('input[name="tripStart"]')).toHaveValue("2026-09-27");
    await trigger.click();
    await expect(page.getByRole("dialog").getByRole("textbox", { name: "시작일" })).toHaveValue(/2026.*09.*27/);
  });

  test("키보드만으로 달력 열기·날짜 이동·선택·포커스 복귀", async ({ page }) => {
    await page.goto(story("datepicker--functional-demo"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /방문 날짜/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "방문 날짜" });
    await expect(dialog.locator('[data-date="2026-09-27"]')).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.locator('[data-date="2026-09-28"]')).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.locator('input[name="visitDate"]')).toHaveValue("2026-09-28");
  });

  test("직접 입력 후 달력으로 이동하면 클릭한 날짜만 확정", async ({ page }) => {
    await page.goto(story("datepicker--functional-demo"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /방문 날짜/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "방문 날짜" });
    await dialog.getByRole("textbox", { name: "방문 날짜" }).fill("2026-09-29");
    await dialog.locator('[data-date="2026-09-28"]').click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('input[name="visitDate"]')).toHaveValue("2026-09-28");
  });

  test("직접 입력 후 바깥으로 나가면 유효한 날짜를 확정", async ({ page }) => {
    await page.goto(story("datepicker--functional-demo"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /방문 날짜/ });
    await trigger.click();
    await page.getByRole("dialog", { name: "방문 날짜" }).getByRole("textbox", { name: "방문 날짜" }).fill("2026-09-29");
    await page.mouse.click(900, 500);
    await expect(page.locator('input[name="visitDate"]')).toHaveValue("2026-09-29");
  });

  test("시간대가 있는 범위는 실제 시점 순서를 유지", async ({ page }) => {
    await page.goto(story("daterangepicker--zoned-date-time-range"));
    const trigger = page.locator("#storybook-root").getByRole("button", { name: /New York window/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "New York window" });
    await expect(dialog.getByRole("textbox", { name: "Start" })).toHaveValue(/11\/01\/2026/);
    await expect(dialog.getByRole("textbox", { name: "End" })).toHaveValue(/11\/01\/2026/);
    await dialog.getByRole("button", { name: "Apply" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toContainText("America/New_York");
  });

  test.describe("모바일 터치", () => {
    test.use({ hasTouch: true });

    test("터치로 시트를 열고 날짜를 확정", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(story("datepicker--functional-demo"));
      const trigger = page.locator("#storybook-root").getByRole("button", { name: /방문 날짜/ });
      const triggerBox = await trigger.boundingBox();
      if (!triggerBox) throw new Error("DatePicker trigger was not laid out");
      await page.touchscreen.tap(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
      const dialog = page.getByRole("dialog", { name: "방문 날짜" });
      await expect(dialog).toBeVisible();
      await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
      const day = dialog.locator('[data-date="2026-09-28"]');
      await day.scrollIntoViewIfNeeded();
      const dayBox = await day.boundingBox();
      if (!dayBox) throw new Error("Date cell was not laid out");
      await page.touchscreen.tap(dayBox.x + dayBox.width / 2, dayBox.y + dayBox.height / 2);
      await expect(dialog).toBeHidden();
      await expect(trigger).toContainText("28");
    });
  });
});
