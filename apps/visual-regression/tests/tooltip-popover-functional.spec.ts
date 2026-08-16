import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const TOOLTIP_DEMO = "tooltip--functional-demo";
const POPOVER_DEMO = "popover--functional-demo";

/** Tooltip/Popover 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("Tooltip 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(TOOLTIP_DEMO), `스토리 없음: ${TOOLTIP_DEMO}`);
    await page.goto(`/iframe.html?id=${TOOLTIP_DEMO}&viewMode=story`);
  });

  test("hover 진입 → 지연 경과 후 표시 → 이탈 → 사라짐", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    const tooltip = page.getByRole("tooltip");

    // 고정 sleep 대신 toBeVisible의 자체 폴링(기본 5s)이 openDelay(~700ms)를 흡수한다.
    await trigger.hover();
    await expect(tooltip).toBeVisible();

    // 트리거·패널과 겹치지 않는 뷰포트 모서리로 이동 — 실 mouseleave 이벤트.
    await page.mouse.move(4, 4);
    await expect(tooltip).toBeHidden();
  });

  test("포커스 → 표시, blur → 사라짐", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    const tooltip = page.getByRole("tooltip");

    // 헤드리스에서 새 페이지의 첫 Tab은 문서 포커스를 못 받는 복불복이라(Select 레이스와
    // 동일 패턴) Tab 역학 대신 focus/blur를 직접 낸다 — 검증 대상은 "포커스가 열고 blur가
    // 닫는다"이지 Tab 이동이 아니다.
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect(tooltip).toBeVisible();

    await trigger.blur();
    await expect(trigger).not.toBeFocused();
    await expect(tooltip).toBeHidden();
  });
});

test.describe("Popover 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(POPOVER_DEMO), `스토리 없음: ${POPOVER_DEMO}`);
    await page.goto(`/iframe.html?id=${POPOVER_DEMO}&viewMode=story`);
  });

  // Popover Content의 role은 스펙상 위임(없음 또는 group)이라 role로 특정할 수 없다.
  // data-state="open"/"closed"는 Dialog·DropdownMenu Content가 이미 쓰는 확립된 관례라
  // 이를 재사용해 패널을 찾는다.
  const openContent = (page: import("@playwright/test").Page) =>
    page.locator('[data-state="open"]');

  test("트리거 클릭 열림 → 외부 클릭 닫힘", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const content = openContent(page);
    await expect(content).toBeVisible();

    // 뷰포트 모서리 — 트리거·패널과 겹치지 않는 빈 영역.
    await page.mouse.click(4, 4);
    await expect(content).toBeHidden();
  });

  test("ESC 닫힘 + 트리거 복귀", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const content = openContent(page);
    await expect(content).toBeVisible();

    await page.keyboard.press("Escape");
    // presence는 퇴장 애니메이션 뒤 unmount — 고정 sleep 대신 로케이터 자동 대기.
    await expect(content).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
