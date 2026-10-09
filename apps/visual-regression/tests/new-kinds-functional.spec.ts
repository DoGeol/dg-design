import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * P4 새 종류의 레이아웃 계약 — jsdom은 레이아웃이 없어 여기서 잰다.
 * 모바일 조작 영역 44: 보이는 크기는 그대로고 투명 의사요소가 넓힌다. 중심에서 위아래 21px 지점을
 * 눌렀을 때 그 요소가 잡히면(의사요소는 소유 요소로 잡힌다) 44 영역이 있는 것이다.
 */
async function expectTouchTarget(target: Locator) {
  for (const dy of [-21, 21]) {
    const same = await target.evaluate((el, offset) => {
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2 + offset);
      return hit !== null && el.contains(hit);
    }, dy);
    expect(same, `중심에서 ${dy}px 지점이 같은 요소를 눌러야 한다`).toBe(true);
  }
}

const mobile = (page: Page) => page.locator('#storybook-root [data-dds-density="mobile"]');

test("Chip: 모바일 제거 버튼·필터 칩 조작 영역 44", async ({ page }) => {
  await page.goto("/iframe.html?id=chip--state-matrix&viewMode=story");
  await expectTouchTarget(mobile(page).getByRole("button", { name: "디자인 제거" }));
  await expectTouchTarget(mobile(page).getByRole("button", { name: "꺼짐" }));
});

test("List: 모바일 trailing 버튼 조작 영역 44", async ({ page }) => {
  await page.goto("/iframe.html?id=list--state-matrix&viewMode=story");
  await expectTouchTarget(mobile(page).getByRole("button", { name: "이력서 v2 더 보기" }));
});

// 패널은 열림 애니메이션 중 scale이 걸려 boundingBox가 줄어든다 — 레이아웃 폭(offsetWidth)으로 잰다.
const layoutWidth = (locator: Locator) => locator.evaluate((el) => (el as HTMLElement).offsetWidth);

test("Select chip: 열린 패널은 칩 폭이 아니라 최소 12rem", async ({ page }) => {
  await page.goto("/iframe.html?id=select--chip-state-matrix&viewMode=story");
  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible();
  expect(await layoutWidth(listbox)).toBeGreaterThanOrEqual(192);
});

test("Select 기본: 패널 폭은 트리거 폭을 따른다(최소 폭 변수 없음)", async ({ page }) => {
  await page.goto("/iframe.html?id=select--state-matrix-story&viewMode=story");
  const trigger = await layoutWidth(page.locator("#storybook-root").getByRole("combobox"));
  const panel = await layoutWidth(page.getByRole("listbox"));
  expect(panel).toBeGreaterThanOrEqual(trigger);
  expect(panel).toBeLessThan(trigger + 40);
});
