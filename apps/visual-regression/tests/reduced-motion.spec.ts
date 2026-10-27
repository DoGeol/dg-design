import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");

const SPINNER = "spinner--state-matrix";
const PROGRESS = "progress--state-matrix";
const SKELETON = "skeleton--state-matrix";
const COLLAPSIBLE = "collapsible--state-matrix";

/** 스토리가 아직 빌드에 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

/**
 * reduced-motion은 CSS 미디어쿼리라 jsdom이 원리적으로 못 본다. Playwright는 실제로
 * 흉내낼 수 있으므로 여기서만 검증한다 — 유닛 테스트에서 CSS 원문을 문자열로 뒤지는
 * 방식은 포맷만 바뀌어도 깨지면서 정작 적용 여부는 증명하지 못한다.
 *
 * 설정(`use.reducedMotion`)에 의존하지 않고 테스트마다 `emulateMedia`로 직접 건다 —
 * 실측 결과 config 경로는 matchMedia에 반영되지 않았다(대조군 테스트가 그것을 고정한다).
 */
test.describe("prefers-reduced-motion", () => {
  test("Spinner의 회전이 멈춘다", async ({ page }) => {
    test.skip(!hasStory(SPINNER), `스토리 없음: ${SPINNER}`);
    await page.goto(`/iframe.html?id=${SPINNER}&viewMode=story`);

    const spinner = page.locator(".dds-spinner").first();
    await expect(spinner).toBeVisible();

    // 대조군: 무력화 전에는 실제로 돈다 — "원래도 안 돌았다"로 통과하는 것을 막는다.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(() => spinner.evaluate((el) => getComputedStyle(el).animationName))
      .not.toBe("none");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => spinner.evaluate((el) => getComputedStyle(el).animationName))
      .toBe("none");
  });

  test("Progress의 애니메이션이 멈춘다", async ({ page }) => {
    test.skip(!hasStory(PROGRESS), `스토리 없음: ${PROGRESS}`);
    await page.goto(`/iframe.html?id=${PROGRESS}&viewMode=story`);

    const indicator = page.locator("[class*='dds-progress']").first();
    await expect(indicator).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    const { animationName, transitionDuration } = await indicator.evaluate((el) => {
      const style = getComputedStyle(el);
      return { animationName: style.animationName, transitionDuration: style.transitionDuration };
    });
    expect(animationName).toBe("none");
    expect(transitionDuration === "0s" || transitionDuration === "").toBe(true);
  });

  test("Skeleton shimmer가 멈춘다", async ({ page }) => {
    test.skip(!hasStory(SKELETON), `스토리 없음: ${SKELETON}`);
    await page.goto(`/iframe.html?id=${SKELETON}&viewMode=story`);
    const skeleton = page.locator(".dds-skeleton").first();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => skeleton.evaluate((el) => getComputedStyle(el, "::after").animationName))
      .toBe("none");
  });

  test("Collapsible 전환이 즉시 끝난다", async ({ page }) => {
    test.skip(!hasStory(COLLAPSIBLE), `스토리 없음: ${COLLAPSIBLE}`);
    await page.goto(`/iframe.html?id=${COLLAPSIBLE}&viewMode=story`);
    const content = page.locator(".dds-collapsible__content").first();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => content.evaluate((el) => getComputedStyle(el).transitionDuration))
      .toBe("0s");
  });

  /**
   * 오버레이는 reduce에서 바로 사라지지 않고 opacity만 fast로 페이드한다(이동·확대만 뺀다).
   * 대조군: no-preference에서는 각자의 이동 keyframes를 쓴다.
   */
  const POP = "dds-overlay-pop-in 0.15s";
  const FADES = [
    { story: "dialog--functional-demo", cls: "dds-dialog__content", moving: "dds-dialog-content-in 0.2s" },
    { story: "sheet--functional-demo", cls: "dds-sheet__content dds-sheet--side_right", moving: "dds-sheet-content-in-right 0.2s" },
    { story: "toast--functional-demo", cls: "dds-toast", moving: "dds-toast-in 0.2s" },
    { story: "popover--functional-demo", cls: "dds-popover__content", moving: POP },
    { story: "tooltip--functional-demo", cls: "dds-tooltip__content", moving: POP },
    { story: "hovercard--functional-demo", cls: "dds-hover-card__content", moving: POP },
    { story: "dropdownmenu--functional-demo", cls: "dds-dropdown-menu__content", moving: POP },
    { story: "select--functional-demo", cls: "dds-select__content", moving: POP },
  ];

  for (const { story, cls, moving } of FADES) {
    test(`${cls.split(" ")[0]}는 reduce에서 opacity 페이드만 남는다`, async ({ page }) => {
      test.skip(!hasStory(story), `스토리 없음: ${story}`);
      await page.goto(`/iframe.html?id=${story}&viewMode=story`);
      // 컴포넌트 CSS는 스토리 모듈과 함께 로드된다 — 렌더를 기다린 뒤에 규칙을 읽는다.
      await expect(page.locator("#storybook-root > *").first()).toBeVisible();
      const read = () =>
        page.evaluate((className) => {
          const pick = (state: string) => {
            const el = document.createElement("div");
            el.className = className;
            el.dataset.state = state;
            document.body.append(el);
            const style = getComputedStyle(el);
            const value = `${style.animationName} ${style.animationDuration}`;
            el.remove();
            return value;
          };
          return { open: pick("open"), closed: pick("closed") };
        }, cls);

      await page.emulateMedia({ reducedMotion: "no-preference" });
      expect((await read()).open).toBe(moving);

      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await read()).toEqual({
        open: "dds-overlay-fade-in 0.15s",
        closed: "dds-overlay-fade-out 0.15s",
      });
    });
  }

  test("Dialog는 reduce에서도 닫힐 때 바로 사라지지 않고 페이드 뒤 언마운트된다", async ({ page }) => {
    test.skip(!hasStory("dialog--functional-demo"), "스토리 없음: dialog--functional-demo");
    await page.goto("/iframe.html?id=dialog--functional-demo&viewMode=story");
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.locator("#storybook-root").getByRole("button").first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveAttribute("data-state", "closed");
    await expect(dialog).toBeHidden();
  });
});

