import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * P5 작업형 패널의 레이아웃 계약 — jsdom은 레이아웃이 없어 여기서 잰다.
 * 부품을 쓰면 Body만 스크롤되고 Toolbar·Footer는 Content 안 같은 자리에 남는다.
 */
const open = (page: Page, id: string) => page.goto(`/iframe.html?id=${id}&viewMode=story`);
const top = (locator: Locator) => locator.evaluate((el) => el.getBoundingClientRect().top);
// 열림 애니메이션(translate·scale) 중에는 위치가 흔들린다 — 끝난 뒤 잰다.
const settled = (locator: Locator) =>
  locator.evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)));
const scrollable = (locator: Locator) =>
  locator.evaluate((el) => el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY === "auto");

test("Dialog large: Body만 스크롤되고 Toolbar·Footer는 고정, Aside는 Body 옆", async ({ page }) => {
  await open(page, "dialog--work-state-matrix");
  const dialog = page.getByRole("dialog");
  const body = dialog.locator(".dds-panel__body");
  const toolbar = dialog.locator(".dds-panel__toolbar");
  const footer = dialog.locator(".dds-panel__footer");
  await expect(dialog).toBeVisible();
  await settled(dialog);
  expect(await scrollable(body)).toBe(true);
  expect(await dialog.evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true);

  const [toolbarTop, footerTop] = [await top(toolbar), await top(footer)];
  await body.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  expect(await top(toolbar)).toBe(toolbarTop);
  expect(await top(footer)).toBe(footerTop);

  const bodyBox = await body.boundingBox();
  const asideBox = await dialog.locator(".dds-panel__aside").boundingBox();
  expect(asideBox!.x).toBeGreaterThanOrEqual(bodyBox!.x + bodyBox!.width - 1);
});

test("Sheet bottom fit: 내용 높이(최대 90dvh)이고 Body만 스크롤", async ({ page }) => {
  await open(page, "sheet--work-bottom-state-matrix");
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  await settled(sheet);
  const height = await sheet.evaluate((el) => (el as HTMLElement).offsetHeight);
  const viewport = page.viewportSize()!.height;
  expect(height).toBeGreaterThan(320);
  expect(height).toBeLessThanOrEqual(viewport * 0.9 + 1);
  if (height >= viewport * 0.9 - 1) expect(await scrollable(sheet.locator(".dds-panel__body"))).toBe(true);
});

test("Sheet side: 한 열로 쌓여 Aside가 Body 뒤에 오고 Toolbar·Footer는 sticky", async ({ page }) => {
  await open(page, "sheet--work-side-state-matrix");
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  await settled(sheet);
  const bodyBox = await sheet.locator(".dds-panel__body").boundingBox();
  const asideBox = await sheet.locator(".dds-panel__aside").boundingBox();
  expect(asideBox!.y).toBeGreaterThanOrEqual(bodyBox!.y + bodyBox!.height - 1);

  const toolbar = sheet.locator(".dds-panel__toolbar");
  const toolbarTop = await top(toolbar);
  await sheet.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  expect(await top(toolbar)).toBe(toolbarTop);
});

test("Select sheet: 목록이 화면 아래 모달 패널로 열린다", async ({ page }) => {
  await open(page, "select--sheet-state-matrix");
  const sheet = page.getByRole("dialog", { name: "과일" });
  await expect(sheet.getByRole("listbox")).toBeVisible();
  await settled(sheet);
  const box = await sheet.boundingBox();
  const viewport = page.viewportSize()!;
  expect(Math.round(box!.y + box!.height)).toBe(viewport.height);
  expect(Math.round(box!.width)).toBe(viewport.width);
});
