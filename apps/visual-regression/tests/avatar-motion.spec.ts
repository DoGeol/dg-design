import { expect, test, type Locator, type Page } from "@playwright/test";

import { hasStory, SLOW_MOTION } from "./motion-helpers";

/**
 * Avatar는 기본값이 motion="none"이라 대량 목록에서 아무것도 움직이지 않는다. auto를 고른
 * 아바타에서 "네트워크로 새로 받은" 이미지만 페이드하므로, 로드 시점은 응답을 직접 가로채
 * 만든다 — 캐시(데이터 URL 재사용)·오류·src 교체는 즉시 경로여야 한다.
 */
const AVATAR = "avatar--motion-demo";

const PIXEL_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#c0392b'/></svg>";

/** 네트워크 이미지 응답을 원할 때까지 붙잡는다. reset으로 다음 요청도 다시 붙잡을 수 있다. */
async function networkImageGate(page: Page) {
  let release = () => {};
  let held = Promise.resolve();
  const reset = () => {
    held = new Promise<void>((resolve) => {
      release = resolve;
    });
  };
  reset();
  await page.route("**/avatar-motion.svg*", async (route) => {
    await held;
    await route.fulfill({ status: 200, contentType: "image/svg+xml", body: PIXEL_SVG });
  });
  return { reset, release: () => release() };
}

function avatarState(wrapper: Locator) {
  return wrapper.evaluate(async (el) => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const root = el.querySelector(".dds-avatar")!;
    const image = el.querySelector<HTMLImageElement>(".dds-avatar__image")!;
    const fallback = el.querySelector<HTMLElement>(".dds-avatar__fallback")!;
    const badge = el.querySelector<HTMLElement>(".dds-avatar__badge")!;
    const box = (node: Element) => {
      const rect = node.getBoundingClientRect();
      return [rect.x, rect.y, rect.width, rect.height].map((n) => Math.round(n));
    };
    return {
      state: root.getAttribute("data-loading-state"),
      fade: image.getAttribute("data-fade"),
      imageHidden: image.hidden,
      imageOpacity: Number(getComputedStyle(image).opacity),
      fallbackDisplay: getComputedStyle(fallback).display,
      fallbackAriaHidden: fallback.getAttribute("aria-hidden"),
      transitions: image.getAnimations().length,
      rootBox: box(root),
      badgeBox: box(badge),
    };
  });
}

function imageOpacity(wrapper: Locator) {
  return wrapper.evaluate((el) =>
    Number(getComputedStyle(el.querySelector(".dds-avatar__image")!).opacity),
  );
}

test.describe("Avatar 모션", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(AVATAR), `스토리 없음: ${AVATAR}`);
    await page.goto(`/iframe.html?id=${AVATAR}&viewMode=story`);
    await expect(page.getByTestId("motion-auto")).toBeVisible();
  });

  test("네트워크 지연 로드만 페이드하고 그동안 fallback이 자리를 지킨다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const auto = page.getByTestId("motion-auto");
    const gate = await networkImageGate(page);

    const before = await avatarState(auto);
    expect(before.state).toBe("loaded");

    await page.getByTestId("src-network").click();

    // 응답 전: loading으로 되돌아가고 이미지는 감춰진다(오래된 이미지가 남지 않는다).
    const loading = await avatarState(auto);
    expect(loading.state).toBe("loading");
    expect(loading.imageHidden).toBe(true);
    expect(loading.fallbackDisplay).toBe("flex");
    expect(loading.rootBox).toEqual(before.rootBox);
    expect(loading.badgeBox).toEqual(before.badgeBox);

    gate.release();

    // 응답 뒤: 시작 프레임 → 전환. 그동안 fallback은 그림으로 남되 접근성 트리에선 빠진다.
    await expect.poll(() => avatarState(auto).then((s) => s.state)).toBe("loaded");
    await expect
      .poll(() => avatarState(auto).then((s) => s.fallbackAriaHidden))
      .toBe("true");
    const fading = await avatarState(auto);
    expect(fading.imageHidden).toBe(false);
    // 실제로 전환이 돌고 있고(합성 중인 애니메이션 1개) 화면 값도 중간이다.
    expect(fading.transitions).toBe(1);
    expect(fading.imageOpacity).toBeGreaterThan(0);
    expect(fading.imageOpacity).toBeLessThan(1);
    expect(fading.fallbackDisplay).toBe("flex");
    expect(fading.rootBox).toEqual(before.rootBox);

    // 전환이 끝나면 fallback을 접고 접근성 속성도 걷는다.
    await expect.poll(() => imageOpacity(auto)).toBe(1);
    await expect.poll(() => avatarState(auto).then((s) => s.fallbackDisplay)).toBe("none");
    const settled = await avatarState(auto);
    expect(settled.fade).toBeNull();
    expect(settled.fallbackAriaHidden).toBeNull();
    expect(settled.rootBox).toEqual(before.rootBox);
    expect(settled.badgeBox).toEqual(before.badgeBox);
  });

  test("캐시된 이미지와 오류는 페이드 없이 즉시 반영한다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const auto = page.getByTestId("motion-auto");

    // 다른 이미지로 갔다가 처음 이미지로 돌아온다 — 두 번째는 캐시라 시작 프레임이 없다.
    await page.getByTestId("src-other").click();
    await expect.poll(() => imageOpacity(auto)).toBe(1);
    await page.getByTestId("src-cached").click();

    const cached = await avatarState(auto);
    expect(cached).toMatchObject({ state: "loaded", fade: null, imageHidden: false });
    expect(cached.imageOpacity).toBe(1);
    expect(cached.fallbackDisplay).toBe("none");

    // 깨진 이미지는 fallback을 즉시 되돌린다.
    await page.getByTestId("src-broken").click();
    const failed = await avatarState(auto);
    expect(failed).toMatchObject({ state: "error", fade: null, imageHidden: true });
    expect(failed.fallbackDisplay).toBe("flex");
    expect(failed.fallbackAriaHidden).toBeNull();
  });

  test("페이드 도중 src를 갈아끼워도 오래된 이미지가 남지 않는다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addStyleTag({ content: SLOW_MOTION });
    const auto = page.getByTestId("motion-auto");
    const image = auto.locator(".dds-avatar__image");
    const gate = await networkImageGate(page);

    await page.getByTestId("src-network").click();
    gate.release();
    await expect.poll(() => avatarState(auto).then((s) => s.fade)).not.toBeNull();
    const firstSrc = await image.getAttribute("src");

    // 전환 한복판에서 다음 요청으로 교체 — 진행 중 페이드를 버리고 새 로드로 간다.
    gate.reset();
    await page.getByTestId("src-network").click();
    const swapped = await avatarState(auto);
    expect(swapped.fade).toBeNull();
    expect(swapped.state).toBe("loading");
    expect(swapped.imageHidden).toBe(true);
    expect(await image.getAttribute("src")).not.toBe(firstSrc);

    gate.release();
    await expect.poll(() => imageOpacity(auto)).toBe(1);
    const settled = await avatarState(auto);
    expect(settled.state).toBe("loaded");
    expect(settled.fade).toBeNull();
    expect(settled.fallbackDisplay).toBe("none");
  });

  test("기본 motion=none은 지연 로드에도 움직이지 않는다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const none = page.getByTestId("motion-none");
    const gate = await networkImageGate(page);

    await page.getByTestId("src-network").click();
    expect((await avatarState(none)).state).toBe("loading");
    gate.release();

    await expect.poll(() => avatarState(none).then((s) => s.state)).toBe("loaded");
    const loaded = await avatarState(none);
    expect(loaded.fade).toBeNull();
    expect(loaded.imageOpacity).toBe(1);
    expect(loaded.fallbackDisplay).toBe("none");
  });

  test("reduce에서도 위치 변화 없는 opacity 전환은 150ms로 남는다", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const auto = page.getByTestId("motion-auto");
    const image = auto.locator(".dds-avatar__image");
    const gate = await networkImageGate(page);

    await page.getByTestId("src-network").click();
    gate.release();

    await expect.poll(() => avatarState(auto).then((s) => s.state)).toBe("loaded");
    await expect(image).toHaveCSS("transition-duration", "0.15s");
    await expect(image).toHaveCSS("transition-timing-function", "cubic-bezier(0, 0, 0.2, 1)");
    await expect.poll(() => imageOpacity(auto)).toBe(1);
  });
});
