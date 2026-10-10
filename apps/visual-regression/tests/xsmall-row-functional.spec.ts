import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * 입력류 xsmall은 Button xsmall(28)과 같은 높이이고, 모바일 밀도에서는 field-height(56)로 그린다
 * (16px 미만 입력은 iOS가 초점 때 확대한다).
 */
const height = (l: Locator) => l.evaluate((el) => (el as HTMLElement).offsetHeight);
const columns = (page: Page) => ({
  desktop: page.locator("#storybook-root section").nth(0),
  mobile: page.locator('#storybook-root [data-dds-density="mobile"]'),
});

test("xsmall 입력류: 데스크톱 28, 모바일 56", async ({ page }) => {
  await page.goto("/iframe.html?id=xsmall-row--state-matrix&viewMode=story");
  for (const [density, expected] of [["desktop", 28], ["mobile", 56]] as const) {
    const col = columns(page)[density];
    const targets = {
      button: col.getByRole("button", { name: "적용" }),
      textField: col.getByRole("textbox", { name: "검색" }),
      select: col.getByRole("combobox", { name: "상태" }),
      multiSelectWithChip: col.locator(".dds-multi-select__trigger--search"),
      textArea: col.getByRole("textbox", { name: "메모" }),
    };
    for (const [name, locator] of Object.entries(targets)) {
      // Button xsmall은 모바일에서도 보이는 크기 28을 유지한다.
      const want = name === "button" ? 28 : expected;
      if (name === "multiSelectWithChip") {
        // 칩이 줄을 넘기면 자란다 — 최소 높이와 넘침 없음만 본다.
        expect(await height(locator), `${density} ${name}`).toBeGreaterThanOrEqual(want);
        expect(await locator.evaluate((el) => el.scrollHeight <= el.clientHeight), `${density} ${name} 넘침`).toBe(true);
      } else {
        expect(await height(locator), `${density} ${name}`).toBe(want);
      }
    }
  }
});

test("라벨 없는 Checkbox·Switch small: 보이는 상자 밖 touch-target 안을 눌러도 켜진다", async ({ page }) => {
  await page.goto("/iframe.html?id=xsmall-row--state-matrix&viewMode=story");
  for (const [density, target] of [["desktop", 24], ["mobile", 44]] as const) {
    const col = columns(page)[density];
    for (const [control, visual] of [
      [col.getByRole("checkbox", { name: "행 선택" }), ".dds-checkbox__box"],
      [col.getByRole("switch", { name: "알림" }), ".dds-switch__track"],
    ] as const) {
      const box = (await col.locator(`${visual}:not(:has(~ span))`).boundingBox())!;
      // 보이는 상자 위 가장자리보다 바깥, touch-target 반경 안쪽(2px 여유).
      const y = box.y + box.height / 2 - (target / 2 - 2);
      expect(y, `${density} ${visual} 바깥 지점`).toBeLessThan(box.y);
      await page.mouse.click(box.x + box.width / 2, y);
      await expect(control, `${density} ${visual}`).toBeChecked();
    }
  }
});

test("Badge outline truncate: 줄 높이가 테두리 안쪽 높이와 같다", async ({ page }) => {
  await page.goto("/iframe.html?id=xsmall-row--state-matrix&viewMode=story");
  const badge = columns(page).desktop.locator(".dds-badge--truncate");
  const [lineHeight, inner] = await badge.evaluate((el) => [parseFloat(getComputedStyle(el).lineHeight), el.clientHeight]);
  expect(lineHeight).toBe(inner);
});
