import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "sheet--functional-demo";

/** Sheet 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("Sheet 기능", () => {
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

    // 모달 스택 등록은 Dialog와 동일 — role="dialog"를 그대로 재사용한다(스펙: 대칭 compound).
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();

    await page.keyboard.press("Escape");
    // 퇴장 애니메이션 뒤 unmount — 고정 sleep 대신 로케이터 자동 대기.
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("오버레이 클릭 → 닫힘", async ({ page }) => {
    await page.locator("#storybook-root").getByRole("button").first().click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();

    // 기본 side(right)는 뷰포트 우측에 붙으므로 좌상단 모서리는 Overlay만 덮는다.
    await page.mouse.click(4, 4);
    await expect(sheet).toBeHidden();
  });

  test("열린 동안 배경 inert — 닫히면 해제", async ({ page }) => {
    await page.locator("#storybook-root").getByRole("button").first().click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    expect(await page.locator("[inert]").count()).toBeGreaterThan(0);

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    expect(await page.locator("[inert]").count()).toBe(0);
  });
});
