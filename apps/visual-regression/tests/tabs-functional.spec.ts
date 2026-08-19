import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "tabs--functional-demo";

/** Tabs 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("Tabs 기능 — 기본", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("클릭으로 탭 전환 → tabpanel 내용 교체", async ({ page }) => {
    const root = page.locator("#storybook-root");
    const tabs = root.getByRole("tab");
    const panel = root.getByRole("tabpanel");

    // 데모의 기본 활성 탭이 무엇이든, 포커스로 첫 탭을 확실히 활성화한 뒤 시작한다.
    await tabs.first().focus();
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    const firstText = (await panel.textContent()) ?? "";

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(panel).not.toHaveText(firstText);
  });

  test("automatic 활성화: 첫 탭 포커스 → ArrowRight → 포커스·aria-selected·패널이 Enter 없이 함께 이동", async ({
    page,
  }) => {
    const root = page.locator("#storybook-root");
    const tabs = root.getByRole("tab");
    const panel = root.getByRole("tabpanel");

    await tabs.first().focus();
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    const firstText = (await panel.textContent()) ?? "";

    // Enter를 누르지 않는다 — automatic 활성화는 포커스 이동만으로 선택까지 끝나야 한다.
    await page.keyboard.press("ArrowRight");

    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
    await expect(panel).not.toHaveText(firstText);
  });

  test("Home/End로 처음·끝 탭으로 이동", async ({ page }) => {
    const root = page.locator("#storybook-root");
    const tabs = root.getByRole("tab");

    await tabs.first().focus();
    expect(await tabs.count()).toBeGreaterThanOrEqual(2);

    await page.keyboard.press("End");
    await expect(tabs.last()).toBeFocused();
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  });

  test("패널 상태 보존: 입력에 타이핑 → 다른 탭 → 돌아오면 값 유지", async ({
    page,
  }) => {
    const root = page.locator("#storybook-root");
    const tabs = root.getByRole("tab");
    const panel = root.getByRole("tabpanel");

    await expect(tabs.first()).toBeVisible();
    const count = await tabs.count();

    // 입력이 있는 탭을 찾는다 — 데모의 탭 순서·입력 위치에 값을 매지 않는다.
    let inputTabIndex = -1;
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      if ((await panel.getByRole("textbox").count()) > 0) {
        inputTabIndex = i;
        break;
      }
    }
    expect(
      inputTabIndex,
      "입력 필드가 있는 탭 패널이 데모에 필요",
    ).toBeGreaterThanOrEqual(0);

    const input = panel.getByRole("textbox").first();
    const value = "dds-tabs-state";
    await input.fill(value);
    await expect(input).toHaveValue(value);

    const otherIndex = inputTabIndex === 0 ? count - 1 : 0;
    await tabs.nth(otherIndex).click();
    await expect(tabs.nth(otherIndex)).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await tabs.nth(inputTabIndex).click();
    await expect(input).toHaveValue(value);
  });
});
