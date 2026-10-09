import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * 입력류 xsmall은 Button xsmall(28)과 같은 높이이고, 모바일 밀도에서는 medium(56)으로 그린다
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
      // TextArea 모바일 medium은 여백 16·줄 24에 테두리 2가 더해져 58이다(기존 medium 그대로).
      const want = name === "button" ? 28 : name === "textArea" && density === "mobile" ? 58 : expected;
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
