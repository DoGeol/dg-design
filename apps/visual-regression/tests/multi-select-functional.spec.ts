import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "multiselect--functional-demo";

/** MultiSelect 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("MultiSelect 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("옵션 2개 연속 선택 → 패널 유지 → 트리거에 개수 반영 → 외부 클릭 닫힘", async ({
    page,
  }) => {
    // 트리거·리스트박스·옵션 role은 Select와 동형이다(스펙: aria 경로 그대로 재사용).
    const trigger = page
      .locator("#storybook-root")
      .getByRole("combobox")
      .first();
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const options = listbox.getByRole("option");
    await expect(options.first()).toBeVisible();
    expect(await options.count()).toBeGreaterThanOrEqual(2);

    // 첫 옵션 선택 — Select와 갈리는 지점: 클릭해도 패널이 열려 있어야 한다.
    await options.nth(0).click();
    await expect(listbox).toBeVisible();
    await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");

    // 두 번째 옵션도 연속 선택 — 여전히 패널 유지.
    await options.nth(1).click();
    await expect(listbox).toBeVisible();
    await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");

    // 2개 이상 선택 시 트리거 문구는 "{n}개 선택됨"으로 요약된다.
    await expect(trigger).toContainText("2개 선택됨");

    // 닫힘은 외부 클릭·ESC·트리거 재클릭으로만 — 뷰포트 모서리는 패널과 겹치지 않는다.
    await page.mouse.click(4, 4);
    await expect(listbox).toBeHidden();
  });

  test("이미 선택된 항목 재클릭 → 선택 해제(패널은 유지)", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("combobox")
      .first();
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const option = listbox.getByRole("option").first();
    const label = (await option.textContent())?.trim();
    expect(label).toBeTruthy();

    await option.click();
    await expect(option).toHaveAttribute("aria-selected", "true");
    // 1개만 선택된 상태의 트리거 문구는 요약이 아니라 그 라벨 그대로다.
    await expect(trigger).toContainText(label!);

    // 같은 옵션 재클릭 → 토글로 해제. 패널은 계속 열려 있어야 한다.
    await option.click();
    await expect(listbox).toBeVisible();
    await expect(option).toHaveAttribute("aria-selected", "false");
    await expect(trigger).not.toContainText(label!);
  });
});
