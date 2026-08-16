import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "contextmenu--functional-demo";
/** Trigger가 버튼이 아닌 임의 영역이라 role로 못 잡는다 — 데모의 안내 문구로 특정한다. */
const TRIGGER_TEXT = "여기를 우클릭하세요";

/** 스토리가 아직 빌드에 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

/** 우클릭 대상 중심 좌표를 반환한다. */
async function rightClickTarget(
  page: import("@playwright/test").Page,
): Promise<{ x: number; y: number }> {
  // 트리거 자체를 겨냥한다 — #storybook-root는 뷰포트를 채우므로 그 중앙은 트리거 박스
  // 바깥이고, 그 자리를 우클릭하면 트리거의 contextmenu 핸들러가 아예 안 걸린다.
  const target = page.locator("#storybook-root").getByText(TRIGGER_TEXT);
  const box = await target.boundingBox();
  expect(box, "우클릭 대상 영역의 boundingBox 필요").toBeTruthy();
  const x = box!.x + box!.width / 2;
  const y = box!.y + box!.height / 2;
  await page.mouse.click(x, y, { button: "right" });
  return { x, y };
}

test.describe("ContextMenu 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("우클릭 → 메뉴 열림 + 브라우저 기본 메뉴 차단 + 커서 좌표 근처 배치", async ({
    page,
  }) => {
    // preventDefault()는 타깃 단계에서 호출되고 버블링 중에도 유지되므로, document의
    // 버블 단계 리스너(트리거보다 나중에 실행)가 최종 defaultPrevented를 관찰할 수 있다.
    await page.evaluate(() => {
      (window as unknown as { __cmPrevented?: boolean }).__cmPrevented =
        undefined;
      document.addEventListener(
        "contextmenu",
        (event) => {
          (
            window as unknown as { __cmPrevented?: boolean }
          ).__cmPrevented = event.defaultPrevented;
        },
        { once: true },
      );
    });

    const { x, y } = await rightClickTarget(page);

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem").first()).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { __cmPrevented?: boolean }).__cmPrevented,
        ),
      )
      .toBe(true);

    // placement는 bottom-start(커서 오른쪽 아래로 펼침) — 패널 좌상단이 커서 근처여야 한다.
    // 정확한 px(gap·arrow 유무)는 구현 위임 사항이라 느슨한 근접 범위로만 검증한다.
    const menuBox = await menu.boundingBox();
    expect(menuBox, "메뉴 boundingBox 필요").toBeTruthy();
    expect(menuBox!.x).toBeGreaterThan(x - 20);
    expect(menuBox!.x).toBeLessThan(x + 100);
    expect(menuBox!.y).toBeGreaterThan(y - 5);
    expect(menuBox!.y).toBeLessThan(y + 100);
  });

  test("ESC 닫힘", async ({ page }) => {
    await rightClickTarget(page);

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});
