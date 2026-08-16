import * as React from "react";

/**
 * field-sizing: content 지원 여부. 모듈 스코프에서 한 번만 계산한다 — 브라우저 지원은
 * 런타임 중에 바뀌지 않으므로 렌더마다 다시 물을 이유가 없다. SSR(CSS 전역 없음)에서는
 * false로 취급 — 아래 훅의 효과는 클라이언트 이펙트 안에서만 도니 문제 없다.
 */
const supportsFieldSizing =
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("field-sizing", "content");

/**
 * autoResize=true일 때 입력량에 따라 높이를 늘린다.
 * field-sizing 지원 브라우저는 text-area.css의 `field-sizing: content`가 전부 처리하므로
 * 아무 것도 하지 않는다. 미지원 브라우저(주로 Firefox)만 scrollHeight를 높이에 동기화하는
 * JS 폴백을 돌린다 — 두 경로가 동시에 height를 건드리면 서로 싸우니 배타적으로 나눈다.
 */
export function useAutoResize(ref: React.RefObject<HTMLTextAreaElement | null>, enabled: boolean) {
  const needsFallback = enabled && !supportsFieldSizing;

  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref]);

  // 매 렌더 후 실행 — value가 바깥(제어형)에서 바뀌어도 입력 이벤트 없이 크기가 맞는다.
  React.useLayoutEffect(() => {
    if (needsFallback) resize();
  });

  const handleInput = React.useCallback(() => {
    if (needsFallback) resize();
  }, [needsFallback, resize]);

  return { handleInput };
}
