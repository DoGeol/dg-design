import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "dropdownmenu--functional-demo";
const IN_DIALOG_DEMO = "dropdownmenu--in-dialog-demo";

/** DropdownMenu 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("DropdownMenu 기능 — 기본", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("트리거 클릭 열기 → 화살표 이동 → Enter 선택 → 닫힘 + 트리거 포커스 복귀", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem").first()).toBeVisible();

    // roving tabindex: 초기 포커스가 첫 항목이든 Content든(위임) 무관하게
    // 화살표로 항목 사이를 옮겨 다닐 수 있는지만 검증한다.
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    const focusedRole = await page.evaluate(() =>
      document.activeElement?.getAttribute("role"),
    );
    expect(focusedRole).toBe("menuitem");

    await page.keyboard.press("Enter");
    // presence는 퇴장 애니메이션 뒤 unmount — 고정 sleep 대신 로케이터 자동 대기.
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("ESC 닫힘 + 트리거 포커스 복귀", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("외부 클릭 닫힘 + 트리거 재클릭 토글(이중 동작 없음)", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    // 뷰포트 모서리 — 트리거·패널과 겹치지 않는 빈 영역.
    await page.mouse.click(4, 4);
    await expect(menu).toBeHidden();

    await trigger.click();
    await expect(menu).toBeVisible();

    // 열린 상태에서 트리거를 다시 클릭 — 닫힘 한 번만 일어나야 한다
    // (외부 클릭 판정과 트리거 클릭이 겹쳐 닫힘+재열림 이중 동작이 나면 회귀).
    await trigger.click();
    await expect(menu).toBeHidden();
  });
});

test.describe("DropdownMenu 기능 — Dialog 안", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(IN_DIALOG_DEMO), `스토리 없음: ${IN_DIALOG_DEMO}`);
    await page.goto(`/iframe.html?id=${IN_DIALOG_DEMO}&viewMode=story`);
  });

  test("메뉴 연 상태 ESC 1회 → 메뉴만 닫히고 Dialog 유지", async ({
    page,
  }) => {
    const dialogTrigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await dialogTrigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const menuTrigger = dialog.getByRole("button").first();
    await menuTrigger.click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    // 비모달 스택 검증 — ESC 1회는 최상단(메뉴)만 닫아야 하고 Dialog까지 흘러선 안 된다.
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(dialog).toBeVisible();
  });
});
