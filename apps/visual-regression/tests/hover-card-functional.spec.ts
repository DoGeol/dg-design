import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "hovercard--functional-demo";

/** HoverCard 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

// HoverCard Content 역할은 Popover Content와 같은 이유로 role로 특정할 수 없다 — 패널
// 스타일·presence를 Popover에서 그대로 재사용하므로(스펙 기술 맥락) Dialog·DropdownMenu·Popover가
// 이미 쓰는 data-state="open"/"closed" 관례를 그대로 따른다.
const openContent = (page: import("@playwright/test").Page) =>
  page.locator('[data-state="open"]');

test.describe("HoverCard 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("hover 진입 → openDelay 후 열림 → 콘텐츠로 이동 시 유지 → 이탈 → closeDelay 후 닫힘", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    const content = openContent(page);

    // 고정 sleep 대신 toBeVisible의 자체 폴링(기본 5s)이 openDelay(700ms)를 흡수한다.
    await trigger.hover();
    await expect(content).toBeVisible();

    // 트리거→콘텐츠로 실 포인터 이동(hover는 실 mousemove/enter/leave를 낸다). closeDelay(300ms)
    // 안에 진입해 예약된 닫힘을 취소시킨다 — Tooltip과 갈리는 HoverCard의 정체성 지점.
    await content.hover();

    // "닫히지 않았다"는 폴링만으로 증명할 수 없다 — closeDelay(300ms)를 실제로 흘려보낸 뒤에도
    // 열려 있어야 취소가 먹혔다는 뜻이라, 이 지점만 고정 대기를 쓴다(마진 2배).
    await page.waitForTimeout(600);
    await expect(content).toBeVisible();

    // 콘텐츠에서도 이탈 — 트리거·패널과 겹치지 않는 뷰포트 모서리로 이동.
    await page.mouse.move(4, 4);
    await expect(content).toBeHidden();
  });

  test("열린 상태 ESC → 닫힘", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    const content = openContent(page);

    await trigger.hover();
    await expect(content).toBeVisible();

    await page.keyboard.press("Escape");
    // presence는 퇴장 애니메이션 뒤 unmount — 고정 sleep 대신 로케이터 자동 대기.
    await expect(content).toBeHidden();
  });
});
