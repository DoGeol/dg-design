import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");
const FUNCTIONAL_DEMO = "accordion--functional-demo";
const CONTROLLED_VALUES = "accordion--controlled-values";

function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as { entries: Record<string, unknown> };
  return id in entries;
}

test.describe("Accordion 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("닫힌 항목은 클릭으로 열고 다시 닫으며 내부 폼 상태를 보존한다", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /프로필/ });
    const input = page.getByRole("textbox", { name: "프로필 이름" });
    const value = "dds-accordion-state";

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await input.fill(value);
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(input).toHaveValue(value);
  });

  test("ArrowDown/ArrowUp/Home/End는 disabled를 건너뛰며 활성 trigger 사이를 이동한다", async ({ page }) => {
    const profile = page.getByRole("button", { name: /프로필/ });
    const security = page.getByRole("button", { name: /보안/ });
    const notification = page.getByRole("button", { name: /알림/ });

    await profile.focus();
    await page.keyboard.press("ArrowDown");
    await expect(security).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(profile).toBeFocused();
    await page.keyboard.press("End");
    await expect(security).toBeFocused();
    await page.keyboard.press("Home");
    await expect(profile).toBeFocused();
    await expect(notification).toBeDisabled();
  });
});

test.describe("Accordion controlled 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(CONTROLLED_VALUES), `스토리 없음: ${CONTROLLED_VALUES}`);
    await page.goto(`/iframe.html?id=${CONTROLLED_VALUES}&viewMode=story`);
  });

  test("외부 reset은 controlled values를 비우고 Root disabled는 토글되지 않는다", async ({ page }) => {
    const controlledProfile = page.getByRole("button", { name: /관리된 프로필/ });
    const disabledProfile = page.getByRole("button", { name: /Root 비활성 프로필/ });

    await expect(controlledProfile).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "외부에서 모두 닫기" }).click();
    await expect(controlledProfile).toHaveAttribute("aria-expanded", "false");

    await expect(disabledProfile).toBeDisabled();
    await expect(disabledProfile).toHaveAttribute("aria-expanded", "true");
    await disabledProfile.click({ force: true });
    await expect(disabledProfile).toHaveAttribute("aria-expanded", "true");
  });
});
