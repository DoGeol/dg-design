import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const DIALOG_DEMO = "dialog--functional-demo";
const SHEET_DEMO = "sheet--functional-demo";
const DROPDOWN_DEMO = "dropdownmenu--functional-demo";
const TOOLTIP_DEMO = "tooltip--functional-demo";

/**
 * 백로그 C1 — 퇴장 애니메이션이 흐르는 구간과 "닫히는 중 재열림" 경로는 jsdom 유닛 테스트로
 * 검증 불가능하다(getComputedStyle(node).animationDuration이 jsdom에서 "auto"라
 * internal/use-presence.ts의 exitDurationMs가 항상 0 → 언제나 동기 언마운트). 실제 브라우저가
 * 있어야만 관찰되는 구간이라 여기서 대신 검증한다.
 *
 * 9개 대상 오버레이 전부가 아니라 usePresence 소비 패턴별 대표만 고른다 — 테스트 대상은
 * internal/use-presence.ts의 타이머 스케줄링·cleanup이지, 오버레이별 UI가 아니기 때문이다.
 *   1) 모달 + Overlay·Content 이중 애니메이션, dialog-stack(모달) 등록: Dialog 대표.
 *      Sheet는 동일 코드 경로(스펙: 대칭 compound)라 가벼운 확인만 별도로 둔다.
 *   2) 비모달 + internal/use-overlay.ts 공유 훅(클릭 즉시 열림/닫힘): DropdownMenu 대표.
 *      Popover·Select·MultiSelect는 useOverlay를 그대로 재사용해 트리거·role만 다를 뿐
 *      presence·타이머 배선이 동일해 생략한다.
 *   3) 비모달 + hover 스케줄(openDelay/closeDelay) 기반: Tooltip 대표.
 *      HoverCard는 지연 상수만 다른 동일 계열이라 생략한다.
 *   4) ContextMenu는 usePresence(isOpen)를 직접 쓰는 점은 위 계열들과 같지만, ESC로 오는
 *      close 신호가 결국 같은 usePresence(isOpen) 계약을 타므로(차이는 "isOpen이 어떻게
 *      true/false가 되는가"일 뿐 — 우클릭 위치 지정은 그 이전 단계) 생략한다.
 */

/** 대상 스토리는 병렬 작업이 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

/**
 * playwright.config의 use.reducedMotion: "reduce"는 이 저장소에서 matchMedia에 실제로
 * 반영되지 않는 것으로 실측됐다(reduced-motion.spec.ts의 대조군 테스트가 이를 고정한다).
 * 혹시 나중에 반영되도록 바뀌면 애니메이션이 꺼져 퇴장 구간 자체가 사라지므로, 이 스펙은
 * config에 기대지 않고 테스트마다 명시적으로 no-preference를 건다.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
});

/**
 * 오버레이 콘텐츠의 부모(= present 동안만 body에 매달리는 portal 컨테이너 div) 핸들을 얻는다.
 *
 * document.body.children.length 전체 개수 비교는 처음에 시도했다가 실측으로 버렸다 —
 * Storybook 자체 애드온(예: storybook-highlights-root)이 goto 직후 우리 오버레이와 무관하게
 * 비동기로 body에 노드를 추가해서, 이르게 찍은 baseline과 나중 값이 어긋나며 거짓 잔여물로
 * 보고됐다(4개 테스트 모두 baseline보다 정확히 1 많게 실패 — 재현·확인됨). 그래서 개수 대신
 * "그 컨테이너 노드 자신이 여전히 문서에 붙어 있는가(isConnected)"로 좁혀 무관한 DOM 변화에
 * 흔들리지 않게 한다.
 */
async function portalContainerHandle(
  locator: import("@playwright/test").Locator,
) {
  return locator.evaluateHandle((el) => el.parentElement as HTMLElement);
}

test.describe("Dialog 퇴장·재열림 (모달 + 이중 애니메이션 대표)", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(DIALOG_DEMO), `스토리 없음: ${DIALOG_DEMO}`);
    await page.goto(`/iframe.html?id=${DIALOG_DEMO}&viewMode=story`);
  });

  test("ESC 직후 data-state=closed로 남아있다가 이후 사라짐(퇴장 구간 실재)", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    // 여기서 실패하면 exitDurationMs가 0으로 회귀해(애니메이션 잘림) 즉시 언마운트됐다는 뜻.
    await expect(dialog).toHaveAttribute("data-state", "closed");
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeHidden();
  });

  test("퇴장 중 재열림 → 정상 열림 유지, 중복 렌더 없음", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    // 배경 inert는 present가 아니라 isOpen에 묶여 즉시 풀린다 — 애니메이션 도중에도 트리거는 클릭 가능.
    await expect(dialog).toHaveAttribute("data-state", "closed");
    await trigger.click();

    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(dialog).toBeVisible();

    // duration-base(200ms)+FALLBACK_MARGIN_MS(100ms)≈300ms를 넉넉히 넘겨, 첫 close에서 예약된
    // 타이머가 뒤늦게 발화해 방금 재열린 다이얼로그를 죽이지 않는지 확인한다(cleanup 누락 회귀 포착).
    await page.waitForTimeout(400);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(page.getByRole("dialog")).toHaveCount(1);
  });

  test("퇴장 완료 후 portal 컨테이너가 body에 남지 않는다", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const container = await portalContainerHandle(dialog);
    expect(await container.evaluate((el) => el.isConnected)).toBe(true); // 대조군: 열린 동안은 연결돼 있다

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect
      .poll(() => container.evaluate((el) => el.isConnected))
      .toBe(false);
  });
});

test.describe("Sheet 퇴장 (Dialog와 대칭 compound — 가벼운 확인만)", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(SHEET_DEMO), `스토리 없음: ${SHEET_DEMO}`);
    await page.goto(`/iframe.html?id=${SHEET_DEMO}&viewMode=story`);
  });

  // 퇴장 중 재열림은 생략한다 — Sheet는 Dialog와 동일한 usePresence + dialog-stack(모달)
  // 경로를 그대로 쓰고 방향별 트랜스폼 애니메이션만 다르다. 타이머-cleanup 회귀는 위 Dialog
  // 테스트가 이미 잡으므로, 여기서는 "달라지는 지점"인 슬라이드 애니메이션 자체의 퇴장 구간·
  // 잔여물만 확인한다.
  test("ESC 직후 data-state=closed 유지 → 사라짐 → portal 잔여물 없음", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    const container = await portalContainerHandle(sheet);

    await page.keyboard.press("Escape");
    await expect(sheet).toHaveAttribute("data-state", "closed");
    await expect(sheet).toBeVisible();
    await expect(sheet).toBeHidden();
    await expect
      .poll(() => container.evaluate((el) => el.isConnected))
      .toBe(false);
  });
});

test.describe("DropdownMenu 퇴장·재열림 (use-overlay 공유 훅 대표)", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(DROPDOWN_DEMO), `스토리 없음: ${DROPDOWN_DEMO}`);
    await page.goto(`/iframe.html?id=${DROPDOWN_DEMO}&viewMode=story`);
  });

  test("ESC 직후 data-state=closed로 남아있다가 이후 사라짐(퇴장 구간 실재)", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("data-state", "closed");
    await expect(menu).toBeVisible();
    await expect(menu).toBeHidden();
  });

  test("퇴장 중 재열림 → 정상 열림 유지, 중복 렌더 없음", async ({ page }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("data-state", "closed");
    await trigger.click();

    await expect(menu).toHaveAttribute("data-state", "open");
    await expect(menu).toBeVisible();

    // duration-fast(150ms)+margin(100ms)≈250ms를 넉넉히 넘겨, 예약된 첫 close 타이머가
    // 뒤늦게 발화해 재열린 메뉴를 죽이지 않는지 확인한다.
    await page.waitForTimeout(350);
    await expect(menu).toBeVisible();
    await expect(page.getByRole("menu")).toHaveCount(1);
  });

  test("퇴장 완료 후 portal 컨테이너가 body에 남지 않는다", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const container = await portalContainerHandle(menu);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect
      .poll(() => container.evaluate((el) => el.isConnected))
      .toBe(false);
  });
});

test.describe("Tooltip 퇴장 (hover 지연 스케줄 계열 대표)", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(TOOLTIP_DEMO), `스토리 없음: ${TOOLTIP_DEMO}`);
    await page.goto(`/iframe.html?id=${TOOLTIP_DEMO}&viewMode=story`);
  });

  // 퇴장 중 재열림은 생략한다 — Tooltip·HoverCard는 hover 재진입도 scheduleOpen의
  // openDelay(기본 700ms)를 다시 타는데, 이는 퇴장 창(fast 150ms+margin 100ms≈250ms)보다
  // 훨씬 길어서 hover만으로는 "퇴장 도중 재열림" 경로 자체를 실제로 못 밟는다. 그 경로
  // (열림 신호가 즉시 오는 재열림)는 지연이 없는 Dialog·DropdownMenu에서 이미 검증했다.
  test("이탈 후 data-state=closed로 남아있다가 사라짐 + portal 잔여물 없음", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button")
      .first();
    const tooltip = page.getByRole("tooltip");

    await trigger.hover();
    await expect(tooltip).toBeVisible();
    const container = await portalContainerHandle(tooltip);

    await page.mouse.move(4, 4);
    // closeDelay(기본 150ms) 경과 후 open→false, 그 뒤 퇴장 애니메이션 동안 이 상태가
    // 관찰된다 — 고정 sleep 대신 toHaveAttribute의 폴링이 지연을 흡수한다.
    await expect(tooltip).toHaveAttribute("data-state", "closed");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toBeHidden();
    await expect
      .poll(() => container.evaluate((el) => el.isConnected))
      .toBe(false);
  });
});

const DIALOG_NESTED = "dialog--nested-demo";

/**
 * 백로그 B5 — 스택에서 빠진 컨테이너가 퇴장 애니메이션 동안 아직 body에 남아 있는데,
 * `dialog-stack`의 면제 목록(= 최상단 모달 위 스택 엔트리)에서는 이미 빠져 있다. 그래서
 * 바깥 모달이 남은 채 안쪽을 닫으면 닫히는 쪽이 자기 퇴장 내내 `inert`로 페이드아웃한다.
 *
 * jsdom은 퇴장 구간이 0이라(exitDurationMs=0) 이 상태를 원리적으로 관찰할 수 없다.
 */
test.describe("닫히는 오버레이의 inert (B5)", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(DIALOG_NESTED), `스토리 없음: ${DIALOG_NESTED}`);
    await page.goto(`/iframe.html?id=${DIALOG_NESTED}&viewMode=story`);
  });

  test("바깥 모달이 열린 채 안쪽을 닫아도 퇴장 중 inert가 걸리지 않는다", async ({
    page,
  }) => {
    await page.locator("#storybook-root").getByRole("button").first().click();
    const outer = page.getByRole("dialog").first();
    await expect(outer).toBeVisible();

    await outer.getByRole("button", { name: "안쪽 다이얼로그" }).click();
    // 바깥 다이얼로그도 "안쪽 다이얼로그" 버튼 텍스트를 품고 있어 hasText로는 안 갈린다 —
    // 안쪽에만 있는 설명 문구로 특정한다.
    const inner = page
      .getByRole("dialog")
      .filter({ hasText: "ESC는 이 다이얼로그만 닫는다." });
    await expect(inner).toBeVisible();

    const innerContainer = await portalContainerHandle(inner);

    await page.keyboard.press("Escape");
    // 논리 상태는 닫힘인데 아직 마운트돼 있는 그 구간에서 관찰한다.
    await expect(inner).toHaveAttribute("data-state", "closed");
    expect(
      await innerContainer.evaluate(
        (el) => el.isConnected && el.hasAttribute("inert"),
      ),
    ).toBe(false);

    // 바깥은 계속 살아 있고 조작 가능해야 한다(면제가 넓어져 격리가 뚫린 게 아님을 확인).
    await expect(outer).toBeVisible();
    const outerContainerInert = await (
      await portalContainerHandle(outer)
    ).evaluate((el) => el.hasAttribute("inert"));
    expect(outerContainerInert).toBe(false);
  });
});
