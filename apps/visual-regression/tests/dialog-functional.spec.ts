import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "dialog--functional-demo";
const NESTED_DEMO = "dialog--nested-demo";

/** Dialog 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("Dialog 기능 — 기본", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("열기 → ESC → 닫힘 + 트리거로 포커스 복귀", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    // presence는 퇴장 애니메이션 뒤 unmount — 고정 sleep 대신 로케이터 자동 대기.
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("오버레이 클릭 → 닫힘", async ({ page }) => {
    await page
      .locator("#storybook-root")
      .getByRole("button")
      .first()
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Content는 화면 중앙에 위치 — 뷰포트 모서리는 Overlay만 덮는다.
    await page.mouse.click(4, 4);
    await expect(dialog).toBeHidden();
  });

  test("열린 동안 배경 inert — 트리거 클릭·포커스 불가", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    expect(await page.locator("[inert]").count()).toBeGreaterThan(0);

    // inert 요소는 .focus()가 no-op이어야 한다 — 클릭 액션너빌리티 타임아웃보다 결정적.
    await trigger.evaluate((el) => (el as HTMLElement).focus());
    await expect(trigger).not.toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(await page.locator("[inert]").count()).toBe(0);
  });

  test("열림: 초기 포커스가 Content", async ({ page }) => {
    await page
      .locator("#storybook-root")
      .getByRole("button")
      .first()
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeFocused();
  });
});

test.describe("Dialog 기능 — 중첩", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(NESTED_DEMO), `스토리 없음: ${NESTED_DEMO}`);
    await page.goto(`/iframe.html?id=${NESTED_DEMO}&viewMode=story`);
  });

  test("중첩 2단 열기 → ESC → 최상단만 닫힘", async ({ page }) => {
    await page
      .locator("#storybook-root")
      .getByRole("button")
      .first()
      .click();

    const dialogs = page.getByRole("dialog");
    await expect(dialogs).toHaveCount(1);
    const outerDialog = dialogs.first();

    // 바깥 다이얼로그 안의 버튼 중 Close가 아닌 것을 중첩 트리거로 간주.
    await outerDialog
      .getByRole("button")
      .filter({ hasNotText: /close|닫기/i })
      .first()
      .click();
    await expect(dialogs).toHaveCount(2);

    await page.keyboard.press("Escape");
    await expect(dialogs).toHaveCount(1);
    await expect(outerDialog).toBeVisible();
  });
});
