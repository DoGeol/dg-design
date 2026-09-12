import * as React from "react";

/** 토큰과 같은 값(--dds-duration-fast / --dds-easing-out). WAAPI는 CSS 변수를 못 읽어 여기서 맞춘다. */
const DURATION_MS = 150;
const EASING = "cubic-bezier(0, 0, 0.2, 1)";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** 서버에는 레이아웃이 없다 — Collapsible과 같은 방식으로 SSR 경고를 피한다. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export interface SelectionIndicatorOptions {
  /** 배경 이동을 쓰는 variant일 때만 true. false면 아무것도 측정하지 않는다. */
  enabled: boolean;
  /** 현재 선택값. 바뀔 때마다 다시 배치한다. */
  value: string | undefined;
  /** 이번 변경을 움직여 보여줄지. 소비 즉시 false로 되돌려, 늦게 온 변경에 번지지 않게 한다. */
  animateNextRef: React.MutableRefObject<boolean>;
  /** "horizontal"이면 가로로만 움직인다 — Tabs 밑줄처럼 세로 이동·확대가 의미 없는 표시에 쓴다. */
  axis?: "both" | "horizontal";
}

/**
 * 선택된 항목 위로 배경 하나를 옮겨 그린다.
 *
 * 좌표는 항상 최종값으로 즉시 넣고, 직전에 "보이던" 위치에서 새 위치로 되돌리는 역보정
 * transform을 WAAPI로 identity까지 되돌린다(FLIP). left/width를 전환하지 않으므로 매 프레임
 * 레이아웃이 다시 돌지 않고, 진행 중이던 이동을 가로채도 현재 화면 위치에서 이어진다.
 *
 * 측정할 수 없는 환경(SSR·jsdom·0 크기)에서는 배치를 포기하고 `measured`를 false로 둔다 —
 * 호출자는 그동안 기존 항목 배경을 fallback으로 보여주면 된다.
 */
export function useSelectionIndicator<T extends HTMLElement = HTMLElement>({
  enabled,
  value,
  animateNextRef,
  axis = "both",
}: SelectionIndicatorOptions) {
  const containerRef = React.useRef<T>(null);
  const indicatorRef = React.useRef<HTMLElement | null>(null);
  const itemsRef = React.useRef(new Map<string, HTMLElement>());
  const animationRef = React.useRef<Animation | null>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const placedRef = React.useRef<Rect | null>(null);
  const [measured, setMeasured] = React.useState(false);

  // place()는 ResizeObserver 콜백에서도 불려야 해서 정체성이 고정이다 — 최신 값은 ref로 읽는다.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const enabledRef = React.useRef(enabled);
  enabledRef.current = enabled;
  const axisRef = React.useRef(axis);
  axisRef.current = axis;

  const place = React.useCallback((animate: boolean) => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    // 꺼진 동안(예: Tabs의 responsive wide)에는 진행 중이던 이동도 남기지 않는다.
    if (!enabledRef.current) {
      animationRef.current?.cancel();
      animationRef.current = null;
      return;
    }

    const current = valueRef.current;
    const item = current === undefined ? undefined : itemsRef.current.get(current);
    if (!item) {
      animationRef.current?.cancel();
      animationRef.current = null;
      placedRef.current = null;
      indicator.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    // 측정 불가(SSR 이후 첫 렌더 전·display:none·jsdom) — fallback을 유지한다.
    if (itemRect.width === 0 || itemRect.height === 0) return;

    // 컨테이닝 블록은 컨테이너의 패딩 박스라 테두리를 빼고, 스크롤된 만큼 되돌린다.
    const style = getComputedStyle(container);
    const next: Rect = {
      left:
        itemRect.left - containerRect.left - Number.parseFloat(style.borderLeftWidth) + container.scrollLeft,
      top: itemRect.top - containerRect.top - Number.parseFloat(style.borderTopWidth) + container.scrollTop,
      width: itemRect.width,
      height: itemRect.height,
    };

    const placed = placedRef.current;
    const unchanged =
      placed !== null &&
      placed.left === next.left &&
      placed.top === next.top &&
      placed.width === next.width &&
      placed.height === next.height;
    // 목표가 그대로면 손대지 않는다. 선택 항목이 굵어지며 도는 ResizeObserver가
    // 방금 시작한 이동을 취소해 버리는 것을 막는 자리다.
    if (unchanged && !animate) return;

    // 지금 "보이는" 위치를 애니메이션을 지우기 전에 읽어 둔다(진행 중이면 중간 프레임 값).
    const from = animate && placed !== null ? indicator.getBoundingClientRect() : null;

    animationRef.current?.cancel();
    animationRef.current = null;

    indicator.style.left = `${next.left}px`;
    indicator.style.top = `${next.top}px`;
    indicator.style.width = `${next.width}px`;
    indicator.style.height = `${next.height}px`;
    indicator.style.opacity = "1";
    // 선택 항목이 비활성이면 배경도 비활성 톤 — 기존 segmented 정착값을 그대로 쓴다.
    const input = item.querySelector("input");
    indicator.toggleAttribute("data-disabled", input instanceof HTMLInputElement && input.disabled);
    placedRef.current = next;
    setMeasured(true);

    if (!from || typeof indicator.animate !== "function") return;

    const to = indicator.getBoundingClientRect();
    const horizontal = axisRef.current === "horizontal";
    const dx = from.left - to.left;
    const dy = horizontal ? 0 : from.top - to.top;
    const sx = to.width === 0 ? 1 : from.width / to.width;
    const sy = horizontal || to.height === 0 ? 1 : from.height / to.height;
    if (dx === 0 && dy === 0 && sx === 1 && sy === 1) return;

    animationRef.current = indicator.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transform: "none" }],
      { duration: DURATION_MS, easing: EASING },
    );
  }, []);

  const registerItem = React.useCallback(
    (itemValue: string, node: HTMLElement | null) => {
      if (node) {
        itemsRef.current.set(itemValue, node);
        observerRef.current?.observe(node);
      } else {
        const previous = itemsRef.current.get(itemValue);
        if (previous) observerRef.current?.unobserve(previous);
        itemsRef.current.delete(itemValue);
      }
    },
    [],
  );

  // 커밋마다 다시 잰다. 크기가 아니라 "위치만" 바뀌는 변화(direction 전환, 형제 요소 변화)는
  // ResizeObserver가 못 보기 때문이다. 목표가 그대로면 place가 곧바로 빠져나가므로 쓰기는 없다.
  useIsomorphicLayoutEffect(() => {
    const animate = animateNextRef.current && !prefersReducedMotion();
    animateNextRef.current = false;
    place(animate);
  });

  // 폰트·라벨·size 변화로 항목 폭이 달라지면 다시 맞춘다(모션 없이). jsdom과 일부
  // non-browser renderer에는 ResizeObserver가 없으니 그때는 배치 한 번으로 끝난다.
  React.useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => place(false));
    observerRef.current = observer;
    if (containerRef.current) observer.observe(containerRef.current);
    for (const node of itemsRef.current.values()) observer.observe(node);
    return () => {
      observer.disconnect();
      observerRef.current = null;
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, [place]);

  return { containerRef, indicatorRef, registerItem, measured };
}
