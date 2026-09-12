import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Locator, Page } from "@playwright/test";

/**
 * 모션 기능 테스트 공용 도구. 컴포넌트별 스펙(`*-motion.spec.ts`)이 가져다 쓴다 —
 * 파일명이 `.spec.ts`가 아니라 Playwright가 테스트로 수집하지 않는다.
 *
 * 모션은 CSS·실제 프레임에 걸려 있어 jsdom이 원리적으로 못 본다. 여기 스펙들만 그걸 본다.
 * Playwright 기본값이 reducedMotion: "reduce"라, 일반 모션 검증은 매번 명시적으로 해제한다.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");

/** 전환을 10배로 늘려 라운드트립 지연이 중단 검증을 흔들지 않게 한다(CSS 전환 한정). */
export const SLOW_MOTION = ":root { --dds-duration-fast: 1500ms; }";

/** 스토리가 아직 빌드에 없을 수 있다 — 실패 대신 스킵. */
export function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

export type TransitionEvent = { phase: string; property: string; layer: string };

/**
 * transition 이벤트를 클릭 전에 걸어 두고 나중에 읽는다 — "전환이 실제로 돌았나"를
 * 프레임 타이밍에 기대지 않고 판정하는 유일한 안정적 방법이다(폴링은 150ms를 놓친다).
 */
export async function recordTransitions(page: Page) {
  await page.evaluate(() => {
    const log: TransitionEvent[] = [];
    (window as unknown as { __ddsTransitions: TransitionEvent[] }).__ddsTransitions = log;
    for (const phase of ["transitionstart", "transitionend", "transitioncancel"]) {
      document.addEventListener(
        phase,
        (event) => {
          const target = event.target as HTMLElement;
          log.push({
            phase,
            property: (event as globalThis.TransitionEvent).propertyName,
            layer: target.dataset.layer ?? "",
          });
        },
        true,
      );
    }
  });
}

/** 우리 레이어에서 난 전환만 본다 — UA 기본 스타일의 전환이 섞여 들어오지 않게. */
export function transitions(page: Page) {
  return page.evaluate(() =>
    (window as unknown as { __ddsTransitions: TransitionEvent[] }).__ddsTransitions.filter(
      (event) => event.layer !== "",
    ),
  );
}

/**
 * 150ms 전환의 한복판(50ms)에서 개입한다. 클릭 두 번을 라운드트립으로 나누면 느린 머신에서
 * 전환이 이미 끝나 버려 "중단"을 검증하지 못한다 — 개입 시점을 페이지 안에서 고정한다.
 */
export async function interruptMidTransition(
  page: Page,
  startTestId: string,
  interruptTestId: string,
) {
  await page.evaluate(
    async ([start, interrupt]) => {
      const click = (id: string) =>
        document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!.click();
      click(start);
      await new Promise((resolve) => setTimeout(resolve, 50));
      click(interrupt);
    },
    [startTestId, interruptTestId],
  );
}

/**
 * 이동식 선택 표시(RadioGroup 배경·Tabs 밑줄)를 재는 공용 도구. 표시 요소와 항목 요소를
 * 선택자로 받아 같은 방식으로 검증한다 — 진행 중 애니메이션을 멈춰 세워 시점별로 읽으므로
 * 프레임 타이밍에 기대지 않는다.
 */
export function indicatorProbe(
  root: Locator,
  selectors: { indicator: string; item: string },
) {
  const { indicator, item } = selectors;

  return {
    /** 항목의 화면 사각형. */
    itemRect(label: string) {
      return root.evaluate(
        (el, [itemSelector, text]) => {
          const rect = [...el.querySelectorAll(itemSelector)]
            .find((node) => node.textContent?.trim() === text)!
            .getBoundingClientRect();
          return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        },
        [item, label] as const,
      );
    },

    /** 표시와 해당 항목 사각형의 최대 차이(px). 두 프레임 뒤에 잰다 — 0이면 정확히 덮고 있다. */
    gap(label: string, sides: "all" | "horizontal" = "all") {
      return root.evaluate(
        async (el, [indicatorSelector, itemSelector, text, mode]) => {
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
          const a = el.querySelector(indicatorSelector)!.getBoundingClientRect();
          const b = [...el.querySelectorAll(itemSelector)]
            .find((node) => node.textContent?.trim() === text)!
            .getBoundingClientRect();
          const horizontal = Math.max(Math.abs(a.left - b.left), Math.abs(a.width - b.width));
          if (mode === "horizontal") return horizontal;
          return Math.max(horizontal, Math.abs(a.top - b.top), Math.abs(a.height - b.height));
        },
        [indicator, item, label, sides] as const,
      );
    },

    /** 진행 중인 이동을 멈춰 원하는 시점으로 돌리고 그때의 사각형을 읽는다. */
    seek(at: number | "end") {
      return root.evaluate(
        (el, [indicatorSelector, time]) => {
          const node = el.querySelector(indicatorSelector) as HTMLElement;
          const animation = node.getAnimations()[0];
          if (!animation) return null;
          animation.pause();
          const timing = animation.effect!.getTiming();
          animation.currentTime = time === "end" ? Number(timing.duration) : Number(time);
          const rect = node.getBoundingClientRect();
          return {
            duration: Number(timing.duration),
            easing: timing.easing,
            left: rect.left,
            top: rect.top,
            width: rect.width,
          };
        },
        [indicator, at] as const,
      );
    },

    animations() {
      return root.evaluate(
        (el, indicatorSelector) =>
          (el.querySelector(indicatorSelector) as HTMLElement).getAnimations().length,
        indicator,
      );
    },

    /** 남은 이동을 끝까지 감아 정착 상태로 만든다(기다리지 않는다). */
    finish() {
      return root.evaluate((el, indicatorSelector) => {
        for (const animation of (
          el.querySelector(indicatorSelector) as HTMLElement
        ).getAnimations())
          animation.finish();
      }, indicator);
    },
  };
}
