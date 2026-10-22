import { expect, test, type Locator, type Page } from "@playwright/test";

/** 2026-10-22 스펙 합격 조건 — TextArea 높이·조절, 작은 크기, 모바일 조작 영역 44. */
const STORY = "/iframe.html?id=compact-sizes--state-matrix&viewMode=story";
const height = (l: Locator) => l.evaluate((el) => (el as HTMLElement).offsetHeight);
const style = (l: Locator, prop: string) =>
  l.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);
const columns = (page: Page) => ({
  desktop: page.locator("#storybook-root section").nth(0),
  mobile: page.locator('#storybook-root [data-dds-density="mobile"]'),
});

test("TextArea: 기본은 손잡이 없음, autoResize는 rows를 최소로, maxRows에서 스크롤", async ({ page }) => {
  await page.goto(STORY);
  for (const col of Object.values(columns(page))) {
    const fixed = col.getByRole("textbox", { name: "고정" });
    expect(await style(fixed, "resize")).toBe("none");
    expect(await style(col.getByRole("textbox", { name: "손잡이" }), "resize")).toBe("vertical");

    const minRows = col.getByRole("textbox", { name: "자동 최소" });
    expect(await height(minRows)).toBe(await height(fixed));

    // maxRows=4의 최대 높이 = 고정 rows=3 + 한 줄
    const lineHeight = parseFloat(await style(fixed, "line-height"));
    const maxRows = col.getByRole("textbox", { name: "자동 최대" });
    expect(await height(maxRows)).toBe((await height(fixed)) + lineHeight);
    expect(await style(maxRows, "overflow-y")).toBe("auto");
    expect(await maxRows.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  }
});

test("작은 크기: 데스크톱은 작게, 모바일은 medium", async ({ page }) => {
  await page.goto(STORY);
  const cases: [string, (col: Locator) => Locator, number, number][] = [
    ["Chip small", (c) => c.locator(".dds-chip:not(.dds-chip--filter)").first(), 20, 32],
    ["FilterChip small", (c) => c.getByRole("button", { name: "내 글" }), 20, 32],
    ["Select 칩 small", (c) => c.getByRole("combobox", { name: "상태" }), 20, 32],
    ["MultiSelect xsmall 칩", (c) => c.locator(".dds-multi-select__trigger--search .dds-chip"), 20, 32],
    ["Tabs small", (c) => c.getByRole("tab", { name: "개요 small" }), 32, 40],
    ["Pagination xsmall", (c) => c.getByRole("navigation", { name: "쪽 xsmall" }).getByRole("link").first(), 28, 44],
    ["Pagination small", (c) => c.getByRole("navigation", { name: "쪽 small" }).getByRole("link").first(), 36, 44],
    ["DatePicker xsmall", (c) => c.getByRole("button", { name: /시작일/ }), 28, 56],
    // large는 TextField large처럼 밀도와 무관하다.
    ["DatePicker large", (c) => c.getByRole("button", { name: /종료일/ }), 52, 52],
  ];
  const { desktop, mobile } = columns(page);
  for (const [name, find, want, wantMobile] of cases) {
    expect(await height(find(desktop)), `데스크톱 ${name}`).toBe(want);
    expect(await height(find(mobile)), `모바일 ${name}`).toBe(wantMobile);
  }
  const search = desktop.locator(".dds-multi-select__trigger--search");
  expect(await height(search)).toBe(28);
  expect(await search.evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true);
});

test("모바일: 탭·닫기 X는 보이는 상자 밖 44 반경 안을 눌러도 동작한다", async ({ page }) => {
  await page.goto(STORY);
  const { mobile } = columns(page);
  const pressAbove = async (target: Locator, reach: number) => {
    await target.scrollIntoViewIfNeeded();
    const box = (await target.boundingBox())!;
    const y = box.y + box.height / 2 - reach;
    expect(y).toBeLessThan(box.y);
    await page.mouse.click(box.x + box.width / 2, y);
  };

  const tab = mobile.getByRole("tab", { name: "기록 medium" });
  await pressAbove(tab, 21); // 탭 40 → 44: 위로 2px 넓어진다
  await expect(tab).toHaveAttribute("aria-selected", "true");

  const close = mobile.getByRole("button", { name: "닫기" });
  await pressAbove(close, 20); // 원 24 → 44: 위로 10px 넓어진다
  // onClose는 스토리에서 아무것도 하지 않는다 — 버튼이 클릭을 받았는지(포커스)로 본다.
  await expect(close).toBeFocused();
});

test("FileInput 기본 Trigger 반경은 Button 역할 반경이다", async ({ page }) => {
  await page.goto(STORY);
  const { desktop, mobile } = columns(page);
  expect(await style(desktop.getByRole("button", { name: "파일 선택" }), "border-radius")).toBe("6px");
  expect(await style(mobile.getByRole("button", { name: "파일 선택" }), "border-radius")).toBe("12px");
});
