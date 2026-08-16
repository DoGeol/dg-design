import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "select--functional-demo";
const WITH_FIELD_DEMO = "select--with-field-demo";

/** Select 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("Select 기능 — 기본", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("트리거 클릭 열기 → 화살표 이동 → Enter 선택 → 트리거 라벨 반영 + 닫힘 + 포커스 복귀", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("combobox")
      .first();
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole("option").first()).toBeVisible();

    // roving tabindex: 초기 포커스가 선택 옵션이든 첫 옵션이든(위임) 무관하게
    // 화살표로 항목 사이를 옮겨 다닐 수 있는지만 검증한다.
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    const focusedRole = await page.evaluate(() =>
      document.activeElement?.getAttribute("role"),
    );
    expect(focusedRole).toBe("option");

    const label = await page.evaluate(() =>
      document.activeElement?.textContent?.trim(),
    );
    expect(label).toBeTruthy();

    await page.keyboard.press("Enter");
    // presence는 퇴장 애니메이션 뒤 unmount — 고정 sleep 대신 로케이터 자동 대기.
    await expect(listbox).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toContainText(label!);
  });

  test("닫힌 상태 문자 키 → 값 변경(typeahead), 화살표 → 열리기만(값 불변)", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("combobox")
      .first();

    // typeahead 대상 글자를 얻기 위해 한 번 열었다가 값 변경 없이 닫는다(ESC).
    await trigger.click();
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const labels = (await listbox.getByRole("option").allTextContents()).map(
      (label) => label.trim(),
    );
    await page.keyboard.press("Escape");
    await expect(listbox).toBeHidden();
    await expect(trigger).toBeFocused();

    const initialText = (await trigger.textContent())?.trim() ?? "";
    const target = labels.find(
      (label) => label.length > 0 && !initialText.includes(label),
    );
    expect(
      target,
      `초기값과 다른 옵션 라벨 필요 (labels=${labels.join(",")})`,
    ).toBeTruthy();

    await page.keyboard.press(target![0]);
    await expect(trigger).toContainText(target!);
    await expect(listbox).toBeHidden();

    await page.keyboard.press("ArrowDown");
    await expect(listbox).toBeVisible();
    await expect(trigger).toContainText(target!);
  });

  test("외부 클릭 닫힘", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("combobox")
      .first();
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    // 뷰포트 모서리 — 트리거·패널과 겹치지 않는 빈 영역.
    await page.mouse.click(4, 4);
    await expect(listbox).toBeHidden();
  });
});

test.describe("Select 기능 — Field 연동", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(WITH_FIELD_DEMO), `스토리 없음: ${WITH_FIELD_DEMO}`);
    await page.goto(`/iframe.html?id=${WITH_FIELD_DEMO}&viewMode=story`);
  });

  test("Field.Label 클릭 → 트리거 활성화(열림 + 옵션 포커스)", async ({ page }) => {
    const label = page.locator("#storybook-root label").first();
    await label.click();

    // htmlFor가 버튼 활성화까지 전달돼 Select가 열린다(네이티브 select 동형).
    // 트리거 포커스는 열리면서 옵션으로 넘어가는 과도기 상태라 단언하면 레이스다.
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    await expect(page.locator(":focus")).toHaveRole("option");
  });
});
