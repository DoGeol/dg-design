import { expect, test, type Page } from "@playwright/test";

const STORIES = {
  columns: "datatable--functional-demo",
  tags: "datatable--column-tags",
  virtual: "datatable--virtualized",
} as const;

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await expect(page.locator("#storybook-root").getByRole("table")).toBeVisible();
}

test("columns prop과 Column 태그는 같은 표·정렬·필터·선택 결과를 만든다", async ({ page }) => {
  const results = [];

  for (const id of [STORIES.columns, STORIES.tags]) {
    await openStory(page, id);
    const table = page.getByRole("table", { name: "사용자 목록" });
    const rows = table.getByRole("row");
    await expect(rows).toHaveCount(5);
    const initial = await rows.allInnerTexts();
    const semantics = await table.ariaSnapshot();

    const sort = table.getByRole("button", { name: "이름 정렬" });
    const nameHeader = table.getByRole("columnheader", { name: /이름/ });
    await sort.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    const ascending = await rows.allInnerTexts();
    await sort.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    const descending = await rows.allInnerTexts();
    await sort.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "none");

    await table.getByRole("searchbox", { name: "이름 필터" }).fill("김");
    await expect(rows).toHaveCount(2);
    const filtered = await rows.allInnerTexts();
    await table.getByRole("checkbox", { name: "사용자 목록 U-1001 선택" }).locator("..").click();
    const selected = await table.getByRole("checkbox", { name: "사용자 목록 U-1001 선택" }).isChecked();

    results.push({ initial, semantics, ascending, descending, filtered, selected });
  }

  expect(results[0]).toEqual(results[1]);
  expect(results[0].ascending[1]).toContain("김도경");
  expect(results[0].descending[1]).toContain("최윤아");
  expect(results[0].filtered[1]).toContain("김도경");
  expect(results[0].selected).toBe(true);
});

test("필터 결과 전체 선택은 화면의 행 ID를 따르고 필터 해제 후에도 보존된다", async ({ page }) => {
  await openStory(page, STORIES.columns);
  const table = page.getByRole("table", { name: "사용자 목록" });
  const status = table.getByRole("combobox", { name: "상태 필터" });
  await status.selectOption("활성");
  await expect(table.getByRole("row")).toHaveCount(3);

  await table.getByRole("checkbox", { name: "사용자 목록 필터 결과 전체 선택" }).locator("..").click();
  await status.selectOption("");
  await expect(table.getByRole("row")).toHaveCount(5);
  for (const key of ["U-1001", "U-1003"]) {
    await expect(table.getByRole("checkbox", { name: `사용자 목록 ${key} 선택` })).toBeChecked();
  }
  for (const key of ["U-1002", "U-1004"]) {
    await expect(table.getByRole("checkbox", { name: `사용자 목록 ${key} 선택` })).not.toBeChecked();
  }
});

test("비가상 표는 가로 overflow일 때만 이름 있는 키보드 스크롤 영역이 된다", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await openStory(page, STORIES.columns);
  const region = page.getByRole("region", { name: "사용자 목록 스크롤" });
  await expect(region).toHaveAttribute("tabindex", "0");
  expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator("#storybook-root > div").evaluate((element) => {
    (element as HTMLElement).style.maxWidth = "none";
  });
  await expect(region).toHaveCount(0);
  const table = page.getByRole("table", { name: "사용자 목록" });
  await expect(table.locator("..")).not.toHaveAttribute("tabindex", "0");
});

test("1만 행은 보이는 행만 마운트하고 9,000번째 행의 실제 인덱스를 알린다", async ({ page }) => {
  await openStory(page, STORIES.virtual);
  const region = page.getByRole("region", { name: "가상 사용자 목록 스크롤" });
  const table = page.getByRole("table", { name: "가상 사용자 목록" });
  const realRows = table.locator("tbody tr[data-row-index]");

  await expect(region).toHaveAttribute("tabindex", "0");
  await region.focus();
  await expect(region).toBeFocused();
  await expect(table).toHaveAttribute("aria-rowcount", "10001");
  await expect(table.getByRole("row").first()).toHaveAttribute("aria-rowindex", "1");
  expect(await realRows.count()).toBeLessThanOrEqual(30);
  await expect(realRows.first()).toHaveAttribute("aria-rowindex", "2");

  await region.evaluate((element) => { element.scrollTop = 8999 * 44; });
  const row9000 = table.getByRole("row", { name: /사용자 9000/ });
  await expect(row9000).toBeVisible();
  await expect(row9000).toHaveAttribute("aria-rowindex", "9001");
  expect(await realRows.count()).toBeLessThanOrEqual(30);
  const geometry = await row9000.evaluate((element) => {
    const rowRect = element.getBoundingClientRect();
    const bodyRect = element.closest("tbody")!.getBoundingClientRect();
    return { height: rowRect.height, offset: rowRect.top - bodyRect.top };
  });
  expect(geometry.height).toBe(44);
  expect(Math.abs(geometry.offset - 8999 * 44)).toBeLessThanOrEqual(1);
  const [viewport, row] = await Promise.all([region.boundingBox(), row9000.boundingBox()]);
  expect(viewport && row && row.y < viewport.y + viewport.height && row.y + row.height > viewport.y).toBe(true);

  await table.getByRole("searchbox", { name: "이름 필터" }).fill("사용자 1");
  await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(realRows.first()).toContainText("사용자 1");
  await expect(realRows.first()).toHaveAttribute("aria-rowindex", "2");
});

test("가상 행이 사라지면 포커스를 스크롤 영역으로 옮기고 선택을 보존한다", async ({ page }) => {
  await openStory(page, STORIES.virtual);
  const region = page.getByRole("region", { name: "가상 사용자 목록 스크롤" });
  const table = page.getByRole("table", { name: "가상 사용자 목록" });
  const first = table.getByRole("checkbox", { name: "가상 사용자 목록 U-00001 선택" });
  await first.locator("..").click();
  await expect(first).toBeFocused();

  await region.evaluate((element) => { element.scrollTop = 8999 * 44; });
  await expect(region).toBeFocused();
  await expect(table.getByRole("row", { name: /사용자 9000/ })).toBeVisible();

  await region.evaluate((element) => { element.scrollTop = 0; });
  await expect(first).toBeVisible();
  await expect(first).toBeChecked();
});

for (const width of [500, 375]) {
  test(`고정 헤더·좌우 열은 ${width}px에서 스크롤 후에도 머리글과 본문에 정렬된다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openStory(page, STORIES.virtual);
    const region = page.getByRole("region", { name: "가상 사용자 목록 스크롤" });
    const table = page.getByRole("table", { name: "가상 사용자 목록" });
    const leftHeader = table.getByRole("columnheader", { name: /이름/ });
    const middleHeader = table.getByRole("columnheader", { name: /이메일/ });
    const rightHeader = table.getByRole("columnheader", { name: /상태/ });
    const before = await Promise.all([leftHeader.boundingBox(), middleHeader.boundingBox(), rightHeader.boundingBox()]);

    await region.evaluate((element) => { element.scrollLeft = element.scrollWidth - element.clientWidth; });
    await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    const after = await Promise.all([leftHeader.boundingBox(), middleHeader.boundingBox(), rightHeader.boundingBox()]);
    expect(before.every(Boolean) && after.every(Boolean)).toBe(true);
    expect(Math.abs(after[0]!.x - before[0]!.x)).toBeLessThanOrEqual(1);
    expect(after[1]!.x).toBeLessThan(before[1]!.x - 10);
    expect(Math.abs(after[2]!.x - before[2]!.x)).toBeLessThanOrEqual(1);

    await region.evaluate((element) => { element.scrollTop = 300; });
    await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThanOrEqual(300);
    const stickyY = (await leftHeader.boundingBox())!.y;
    await region.evaluate((element) => { element.scrollTop = 600; });
    await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThanOrEqual(600);
    expect(Math.abs((await leftHeader.boundingBox())!.y - stickyY)).toBeLessThanOrEqual(1);

    const realRows = table.locator("tbody tr[data-row-index]");
    const row = realRows.nth(Math.floor((await realRows.count()) / 2));
    const cells = row.locator("td");
    const leftCell = await cells.nth(1).boundingBox();
    const rightCell = await cells.last().boundingBox();
    const left = await leftHeader.boundingBox();
    const right = await rightHeader.boundingBox();
    expect(Math.abs(left!.x - leftCell!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(left!.width - leftCell!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(right!.x - rightCell!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(right!.width - rightCell!.width)).toBeLessThanOrEqual(1);
  });
}

test("비가상 표도 375px 가로 스크롤에서 좌우 고정 열이 본문과 정렬된다", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await openStory(page, STORIES.columns);
  const region = page.getByRole("region", { name: "사용자 목록 스크롤" });
  const table = page.getByRole("table", { name: "사용자 목록" });
  const leftHeader = table.getByRole("columnheader", { name: /이름/ });
  const rightHeader = table.getByRole("columnheader", { name: /상태/ });
  const before = await Promise.all([leftHeader.boundingBox(), rightHeader.boundingBox()]);

  await region.evaluate((element) => { element.scrollLeft = element.scrollWidth - element.clientWidth; });
  await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const after = await Promise.all([leftHeader.boundingBox(), rightHeader.boundingBox()]);
  const cells = table.locator("tbody tr[data-row-index]").first().getByRole("cell");
  const leftCell = await cells.nth(1).boundingBox();
  const rightCell = await cells.last().boundingBox();
  expect(Math.abs(after[0]!.x - before[0]!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(after[1]!.x - before[1]!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(after[0]!.x - leftCell!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(after[1]!.x - rightCell!.x)).toBeLessThanOrEqual(1);
});
