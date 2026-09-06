import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const TRIGGER_DEMO = "multiselect--search-trigger-demo";
const CONTENT_DEMO = "multiselect--search-content-demo";

/** 스토리는 병렬 태스크가 만드는 중일 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe('MultiSelect search="trigger" 키보드', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(TRIGGER_DEMO), `스토리 없음: ${TRIGGER_DEMO}`);
    await page.goto(`/iframe.html?id=${TRIGGER_DEMO}&viewMode=story`);
  });

  test("타이핑으로 열림 → 필터 → ↓/Enter 선택 → Backspace로 칩 제거", async ({
    page,
  }) => {
    // 검색 모드의 combobox는 트리거 버튼이 아니라 트리거 안의 입력이다.
    const input = page.locator("#storybook-root").getByRole("combobox");
    await expect(input).toHaveAttribute("aria-autocomplete", "list");
    await expect(input).toHaveAttribute("aria-expanded", "false");

    // 타이핑만으로 열린다(클릭 없이).
    await input.click();
    await expect(page.getByRole("listbox")).toBeHidden();
    await input.pressSequentially("ba");

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const listboxId = (await listbox.getAttribute("id")) ?? "";
    await expect(input).toHaveAttribute("aria-controls", listboxId);

    // 필터에서 떨어진 옵션은 언마운트가 아니라 hidden이라 접근성 트리에서만 빠진다.
    // 이 데모는 onCreate가 있어 맨 아래 "만들기" 항목이 하나 더 붙는다.
    const options = listbox.getByRole("option");
    await expect(options).toHaveCount(2);
    await expect(options.first()).toHaveText(/Banana/);
    await expect(options.last()).toHaveAttribute("data-create", "");

    // DOM 포커스는 입력에 남고 활성 옵션은 aria-activedescendant로만 표시된다.
    const active = await input.getAttribute("aria-activedescendant");
    expect(active).toBeTruthy();
    expect(await options.first().getAttribute("id")).toBe(active);
    await expect(input).toBeFocused();

    await input.press("Enter");
    await expect(page.getByRole("listbox")).toBeVisible();
    // 선택은 트리거 안의 칩으로 나타나고 제거 버튼이 tab 순서에 들어간다.
    const chip = page.locator(".dds-multi-select__chip");
    await expect(chip).toHaveCount(1);
    await expect(chip).toContainText("Banana");

    // 빈 입력에서 Backspace → 마지막 칩 제거.
    await input.fill("");
    await input.press("Backspace");
    await expect(page.locator(".dds-multi-select__chip")).toHaveCount(0);
  });

  test("↓ 이동이 활성 옵션만 바꾸고 포커스는 입력에 남는다", async ({ page }) => {
    const input = page.locator("#storybook-root").getByRole("combobox");
    await input.click();
    await input.pressSequentially("a");

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const first = await input.getAttribute("aria-activedescendant");

    await input.press("ArrowDown");
    await expect(input).not.toHaveAttribute("aria-activedescendant", first ?? "");
    await expect(input).toBeFocused();
  });

  test("만들기 항목: 보류 표시 뒤 칩으로 들어오고 질의가 비워진다", async ({
    page,
  }) => {
    const input = page.locator("#storybook-root").getByRole("combobox");
    await input.click();
    await input.pressSequentially("kiwi");

    const create = page.getByRole("option").filter({ hasText: "만들기" });
    await expect(create).toHaveCount(1);
    await create.click();

    // 보류 중에는 이 항목만 aria-disabled + Spinner다.
    await expect(create).toHaveAttribute("aria-disabled", "true");
    await expect(create.locator(".dds-spinner")).toBeVisible();

    await expect(page.locator(".dds-multi-select__chip")).toContainText("kiwi");
    await expect(input).toHaveValue("");
  });
});

test.describe('MultiSelect search="content" 키보드', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(CONTENT_DEMO), `스토리 없음: ${CONTENT_DEMO}`);
    await page.goto(`/iframe.html?id=${CONTENT_DEMO}&viewMode=story`);
  });

  test("열릴 때 검색 입력 포커스 → 필터 → ↓로 목록 진입", async ({ page }) => {
    // 트리거는 현행 그대로 button 역할의 combobox다.
    const trigger = page.locator("#storybook-root").getByRole("combobox");
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    const search = page.getByRole("searchbox");
    await expect(search).toBeFocused();

    await search.pressSequentially("ba");
    const options = listbox.getByRole("option");
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveText(/Banana/);

    // 타이핑이 목록 typeahead로 새지 않았어야 포커스가 아직 입력에 있다.
    await expect(search).toBeFocused();
    await expect(search).toHaveValue("ba");

    // ↓로 목록에 진입하면 실제 DOM 포커스가 옵션으로 옮겨간다(현행 roving 그대로).
    await search.press("ArrowDown");
    await expect(options.first()).toBeFocused();

    await options.first().press("Enter");
    await expect(options.first()).toHaveAttribute("aria-selected", "true");
    await expect(listbox).toBeVisible();
  });
});
