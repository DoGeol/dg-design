import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");

const FUNCTIONAL_DEMO = "toast--functional-demo";

/** Toast 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("Toast 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("모달이 열린 상태에서도 토스트가 보이고 닫기 버튼이 실제로 눌린다", async ({ page }) => {
    const root = page.locator("#storybook-root");
    await root.getByRole("button", { name: "다이얼로그 열기" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "모달에서 토스트 띄우기" }).click();

    // 트리거된 토스트는 positive intent라 role="status" — Dialog 자체(role="dialog")와
    // 겹치지 않아 안전하게 구분된다.
    const toast = page.getByRole("status");
    await expect(toast).toBeVisible();

    // dialog-stack의 알림 레이어 inert 면제가 없다면 이 클릭은 actionability 체크(요소가
    // 실제로 포인터 이벤트를 받는지)에서 타임아웃난다 — jsdom은 inert를 구현하지 않아
    // vitest로는 못 잡는 지점이라 여기서만 검증된다.
    await toast.getByRole("button", { name: "닫기" }).click();
    await expect(toast).toBeHidden();

    // 토스트를 닫아도 모달 자체는 그대로 열려 있어야 한다 — 클릭이 배경으로 새지 않았다는 방증.
    await expect(dialog).toBeVisible();
  });

  test("자동 닫힘 — 지정 시간 뒤 사라진다", async ({ page }) => {
    const root = page.locator("#storybook-root");
    await root.getByRole("button", { name: "brand 토스트" }).click();

    const toast = page.getByRole("status");
    await expect(toast).toBeVisible();

    // 고정 sleep 대신 확장된 폴링 타임아웃(기본 자동 닫힘 지속시간보다 여유 있게)으로 대기한다.
    await expect(toast).toBeHidden({ timeout: 10_000 });
  });
});
