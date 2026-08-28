import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");
const FUNCTIONAL_DEMO = "collapsible--functional-demo";

function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as { entries: Record<string, unknown> };
  return id in entries;
}

test.describe("Collapsible 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("닫힌 상태에서 클릭으로 열고, ARIA와 inert를 전환한다", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "상세 설정" });
    const contentId = await trigger.getAttribute("aria-controls");
    const content = page.locator(`[id="${contentId}"]`);

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(content).toHaveAttribute("aria-hidden", "true");
    await expect(content).toHaveAttribute("inert", "");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(content).toHaveAttribute("aria-hidden", "false");
    await expect(content).not.toHaveAttribute("inert", "");
  });

  test("접었다 열어도 내부 폼 값이 보존되고 외부 controlled reset이 반영된다", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "상세 설정" });
    // 닫히면 Content는 aria-hidden이다. role locator는 의도적으로 이를 제외하므로,
    // DOM 보존 계약은 aria-label 기반 DOM locator로 직접 확인한다.
    const input = page.locator('input[aria-label="표시 이름"]');
    const value = "dds-collapsible-state";

    await trigger.click();
    await input.fill(value);
    await trigger.click();
    await expect(input).toHaveValue(value);
    await trigger.click();
    await expect(input).toHaveValue(value);

    await page.getByRole("button", { name: "외부에서 닫기" }).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("asChild Trigger와 생략 가능한 하위 요소가 안전하게 동작한다", async ({ page }) => {
    const asChildTrigger = page.getByRole("button", { name: "asChild 트리거" });
    const triggerOnly = page.getByRole("button", { name: "Content 없는 Trigger" });

    await expect(page.getByTestId("collapsible-root-only")).toHaveCount(1);
    await expect(asChildTrigger).toHaveAttribute("aria-expanded", "false");
    await asChildTrigger.click();
    await expect(asChildTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(triggerOnly).toHaveAttribute("aria-expanded", "false");
    await triggerOnly.click();
    await expect(triggerOnly).toHaveAttribute("aria-expanded", "true");
  });

  test("열린 콘텐츠의 크기 변경을 관찰한다", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "동적 콘텐츠" });
    const content = trigger.locator("xpath=following-sibling::*[contains(@class, 'dds-collapsible__content')]");

    await trigger.click();
    const initialHeight = await content.evaluate((element) => element.style.getPropertyValue("--dds-collapsible-content-height"));
    await page.getByRole("button", { name: "콘텐츠 추가" }).click();
    await expect(page.getByTestId("collapsible-added-content")).toBeVisible();
    await expect.poll(() => content.evaluate((element) => element.style.getPropertyValue("--dds-collapsible-content-height"))).not.toBe(initialHeight);
  });
});
