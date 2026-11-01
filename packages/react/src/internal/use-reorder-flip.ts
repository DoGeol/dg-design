import * as React from "react";

/**
 * 목록에서 항목이 빠지거나 늘어 나머지가 자리를 옮길 때, 옮겨진 거리만큼 되돌린 뒤
 * 제자리로 보낸다(FLIP). 레이아웃은 이미 최종값이고 `transform`만 되감으므로 매 프레임
 * 레이아웃이 다시 돌지 않는다 — `use-selection-indicator`와 같은 방식이다.
 *
 * 토큰과 같은 값. WAAPI는 CSS 변수를 못 읽어 여기서 맞춘다(--dds-duration-fast / --dds-easing-out).
 */
const DURATION_MS = 150;
const EASING = "cubic-bezier(0, 0, 0.2, 1)";
/** 이보다 작은 차이는 소수점 반올림이지 이동이 아니다. */
const EPSILON_PX = 0.5;

/** 서버에는 레이아웃이 없다. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/**
 * `container`의 직계 자식들을 `key`가 바뀔 때마다 다시 재고, 세로로 움직인 것만 되감는다.
 * 순수한 위치 이동이라 reduce에서는 걸지 않는다.
 */
export function useReorderFlip(container: HTMLElement | null, key: unknown) {
  const topsRef = React.useRef(new Map<Element, number>());

  useIsomorphicLayoutEffect(() => {
    if (!container) return;

    const previous = topsRef.current;
    const next = new Map<Element, number>();
    const reduced = prefersReducedMotion();

    for (const child of Array.from(container.children)) {
      const top = child.getBoundingClientRect().top;
      next.set(child, top);

      const before = previous.get(child);
      if (before === undefined || reduced) continue;
      const delta = before - top;
      if (Math.abs(delta) < EPSILON_PX) continue;

      child.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: "none" }],
        { duration: DURATION_MS, easing: EASING },
      );
    }

    topsRef.current = next;
  }, [container, key]);
}
