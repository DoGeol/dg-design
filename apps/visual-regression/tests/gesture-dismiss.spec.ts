import { expect, test, type Page } from "@playwright/test";

import { hasStory } from "./motion-helpers";

/**
 * 끌어서 닫기(Toast 가로 스와이프·Sheet 손잡이)와 Toast 세로 재배치 FLIP.
 *
 * 판정은 거리로만 본다 — 속도 규칙(0.11px/ms)은 라운드트립 지연이 섞여 CI에서 흔들린다.
 * 포인터는 마우스뿐이다. 실제 손가락(터치 스크롤과의 다툼)은 여기서 못 본다.
 */

const TOAST = "toast--functional-demo";
const SHEET = "sheet--drag-demo";

/**
 * 잡고 끌다 놓는다. `pauseMs`를 주면 구간마다 쉬어 "천천히 끄는" 손가락이 된다 —
 * Playwright의 mouse.move는 지연이 없어 그냥 끌면 전부 튕기기(속도 해제)로 읽힌다.
 */
async function dragBy(
  page: Page,
  from: { x: number; y: number },
  dx: number,
  dy: number,
  pauseMs = 0,
) {
  const STEPS = 5;
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let step = 1; step <= STEPS; step += 1) {
    await page.mouse.move(from.x + (dx * step) / STEPS, from.y + (dy * step) / STEPS);
    if (pauseMs) await page.waitForTimeout(pauseMs);
  }
  await page.mouse.up();
}

/**
 * 닫힘 퇴장이 시작되는 순간을 기록한다. 시작 프레임의 계산값을 끌 때 남긴 인라인 값과 견주면
 * "멈춘 자리에서 이어 빠지는지"(되돌아갔다 나가지 않는지)가 보인다.
 */
async function recordExitStart(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const log: { name: string; opacity: number; inlineOpacity: number }[] = [];
    (window as unknown as { __exit: typeof log }).__exit = log;
    document.addEventListener(
      "animationstart",
      (event) => {
        const el = event.target as HTMLElement;
        if (!el.matches(sel) || el.dataset.state !== "closed") return;
        log.push({
          name: event.animationName,
          opacity: Number(getComputedStyle(el).opacity),
          inlineOpacity: Number(el.style.opacity || "1"),
        });
      },
      true,
    );
  }, selector);
}

async function exitStarts(page: Page) {
  return page.evaluate(
    () => (window as unknown as { __exit: { name: string; opacity: number; inlineOpacity: number }[] }).__exit,
  );
}

async function centerOf(page: Page, selector: string) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) throw new Error(`측정 불가: ${selector}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, width: box.width, height: box.height };
}

test.describe("Toast 스와이프", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(TOAST), `스토리 없음: ${TOAST}`);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`/iframe.html?id=${TOAST}&viewMode=story`);
  });

  test("폭 절반을 넘겨 끌면 멈춘 자리에서 이어 빠진다", async ({ page }) => {
    await page.getByRole("button", { name: "brand 토스트" }).click();
    const toast = page.locator(".dds-toast");
    await expect(toast).toHaveCount(1);

    const box = await centerOf(page, ".dds-toast");
    // 토스트는 오른쪽 가장자리에 붙어 있다 — 가운데서 잡으면 폭의 절반을 끌 자리가 화면에 없다.
    const grip = { x: box.x - box.width / 2 + 16, y: box.y };
    await recordExitStart(page, ".dds-toast");
    // 천천히 끌어도 거리만으로 해제된다 — 속도 규칙에 기대지 않는 판정.
    await dragBy(page, grip, box.width * 0.6, 0, 120);

    await expect(toast).toHaveCount(0);
    // 끌면서 옅어진 투명도에서 이어 사라진다 — 1로 되돌아갔다 꺼지면 번쩍인다.
    const [start] = await exitStarts(page);
    expect(start?.name).toBe("dds-toast-swipe-out");
    expect(start!.inlineOpacity).toBeLessThan(1);
    expect(start!.opacity).toBeLessThanOrEqual(start!.inlineOpacity + 0.05);
  });

  test("reduce에서도 끌어서 해제하면 옅어진 투명도에서 이어 사라진다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "brand 토스트" }).click();
    const toast = page.locator(".dds-toast");
    await expect(toast).toHaveCount(1);

    const box = await centerOf(page, ".dds-toast");
    const grip = { x: box.x - box.width / 2 + 16, y: box.y };
    await recordExitStart(page, ".dds-toast");
    await dragBy(page, grip, box.width * 0.6, 0, 120);

    await expect(toast).toHaveCount(0);
    const [start] = await exitStarts(page);
    expect(start?.name).toBe("dds-toast-swipe-fade-out");
    expect(start!.opacity).toBeLessThanOrEqual(start!.inlineOpacity + 0.05);
  });

  test("끌다가 토스트 밖에서 놓아도 끌기가 끝난다", async ({ page }) => {
    await page.getByRole("button", { name: "brand 토스트" }).click();
    const toast = page.locator(".dds-toast");
    await expect(toast).toHaveCount(1);

    const box = await centerOf(page, ".dds-toast");
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    // 문턱(4px)은 넘기되 해제 거리에는 못 미치게, 천천히.
    for (const dx of [10, 20, 30]) {
      await page.mouse.move(box.x + dx, box.y);
      await page.waitForTimeout(120);
    }
    await expect(toast).toHaveAttribute("data-dragging", "");
    // 세로로 토스트를 벗어나서 놓는다 — 포인터를 잡지 않았다면 pointerup이 토스트에 오지 않는다.
    await page.mouse.move(box.x + 30, box.y + box.height * 3);
    await page.waitForTimeout(120);
    await page.mouse.up();

    await expect(toast).not.toHaveAttribute("data-dragging", "");
    expect(await toast.evaluate((el) => (el as HTMLElement).style.transform)).toBe("");
  });

  test("천천히 조금만 끌면 제자리로 돌아간다", async ({ page }) => {
    await page.getByRole("button", { name: "brand 토스트" }).click();
    const toast = page.locator(".dds-toast");

    const box = await centerOf(page, ".dds-toast");
    await dragBy(page, box, box.width * 0.1, 0, 120);

    await expect(toast).toHaveCount(1);
    await expect(toast).not.toHaveAttribute("data-swipe-out", "");
    // 인라인 위치는 손을 떼는 즉시 지운다 — 되돌아가는 것은 WAAPI가 그린다.
    expect(await toast.evaluate((el) => (el as HTMLElement).style.transform)).toBe("");
  });

  test("가운데 토스트가 사라지면 남은 토스트가 FLIP으로 따라 올라온다", async ({ page }) => {
    for (const name of ["brand 토스트", "neutral 토스트", "positive 토스트"]) {
      await page.getByRole("button", { name }).click();
    }
    const toasts = page.locator(".dds-toast");
    await expect(toasts).toHaveCount(3);

    // 입장 애니메이션이 끝난 뒤에 재배치를 본다.
    await page.waitForTimeout(400);

    // FLIP은 150ms라 "지금 돌고 있나"를 폴링으로 잡으면 흔들린다 — 호출 자체를 기록한다.
    await page.evaluate(() => {
      const original = Element.prototype.animate;
      (window as unknown as { __flips: string[] }).__flips = [];
      Element.prototype.animate = function (this: Element, ...args: Parameters<Element["animate"]>) {
        const [frames] = args;
        (window as unknown as { __flips: string[] }).__flips.push(JSON.stringify(frames));
        return original.apply(this, args);
      };
    });

    const middle = toasts.nth(1);
    await middle.getByRole("button", { name: "닫기" }).click();
    await expect(toasts).toHaveCount(2);

    const flips = await page.evaluate(() => (window as unknown as { __flips: string[] }).__flips);
    expect(flips.some((frames) => frames.includes("translateY("))).toBe(true);
  });
});

test.describe("Sheet 손잡이", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(SHEET), `스토리 없음: ${SHEET}`);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`/iframe.html?id=${SHEET}&viewMode=story`);
    await page.getByRole("button", { name: "하단 시트 열기" }).click();
    await expect(page.locator(".dds-sheet__content")).toBeVisible();
    await page.waitForTimeout(300);
  });

  test("높이 절반을 넘겨 끌면 닫힌다", async ({ page }) => {
    const sheet = await centerOf(page, ".dds-sheet__content");
    const handle = await centerOf(page, ".dds-sheet__handle");

    await recordExitStart(page, ".dds-sheet__content");
    await dragBy(page, handle, 0, sheet.height * 0.7, 120);

    await expect(page.locator(".dds-sheet__content")).toHaveCount(0);
    // side별 닫힘 keyframes(translateY(0)에서 시작)가 아니라 멈춘 자리에서 이어지는 쪽이어야 한다.
    const [start] = await exitStarts(page);
    expect(start?.name).toBe("dds-sheet-drag-out");
  });

  test("절반에 못 미치면 제자리로 돌아간다", async ({ page }) => {
    const sheet = await centerOf(page, ".dds-sheet__content");
    const handle = await centerOf(page, ".dds-sheet__handle");

    await dragBy(page, handle, 0, sheet.height * 0.2, 120);

    const content = page.locator(".dds-sheet__content");
    await expect(content).toHaveCount(1);
    await expect(content).toHaveJSProperty("style.transform", "");
  });
});
