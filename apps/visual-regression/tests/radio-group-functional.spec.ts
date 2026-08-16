import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");

const FUNCTIONAL_DEMO = "radiogroup--functional-demo";

/** RadioGroup 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("RadioGroup 기능 — 기본", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("첫 항목 포커스 → 화살표 아래로 이동하면 다음 항목이 즉시 선택된다", async ({ page }) => {
    const group = page.locator("#storybook-root").getByRole("radiogroup").first();
    const first = group.getByRole("radio").first();
    const second = group.getByRole("radio").nth(1);

    await first.focus();
    await expect(first).toBeChecked();

    await page.keyboard.press("ArrowDown");
    await expect(second).toBeChecked();
    await expect(second).toBeFocused();
    await expect(first).not.toBeChecked();
  });

  test("클릭으로 항목을 선택하면 같은 그룹의 다른 항목은 선택 해제된다", async ({ page }) => {
    const group = page.locator("#storybook-root").getByRole("radiogroup").first();
    const radios = group.getByRole("radio");
    const first = radios.first();
    const last = radios.last();

    // 네이티브 input은 시각적으로 숨겨져 있어 직접 클릭이 안 된다 — 실사용자처럼 label을 클릭한다.
    await group.locator("label").last().click();
    await expect(last).toBeChecked();
    await expect(first).not.toBeChecked();
  });
});
