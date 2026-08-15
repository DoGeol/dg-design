import * as React from "react";

/**
 * 이벤트가 유실됐을 때를 위한 여유. CSS 실계산 길이 위에 얹으므로 토큰 값이 바뀌어도
 * 따라 고칠 필요가 없다 — 애니메이션을 절단하지 않는 것이 유일한 조건이다.
 */
const FALLBACK_MARGIN_MS = 100;

/** computed style의 시간 목록(`"150ms, 0s"`)에서 가장 긴 값을 ms로 돌려준다. */
function longestMs(list: string | undefined): number {
  if (!list) return 0;
  const values = list.split(",").map((raw) => {
    const trimmed = raw.trim();
    const parsed = Number.parseFloat(trimmed);
    if (Number.isNaN(parsed)) return 0;
    return trimmed.endsWith("ms") ? parsed : parsed * 1000;
  });
  return Math.max(0, ...values);
}

/**
 * 퇴장에 실제로 걸리는 시간. 0이면 애니메이션이 없다는 뜻이다 —
 * `prefers-reduced-motion: reduce`(CSS가 `animation: none`)나 dialog.css 미로드가 여기 해당한다.
 */
function exitDurationMs(node: HTMLElement): number {
  const style = getComputedStyle(node);
  return Math.max(
    longestMs(style.animationDuration) + longestMs(style.animationDelay),
    longestMs(style.transitionDuration) + longestMs(style.transitionDelay),
  );
}

/**
 * 닫힌 뒤에도 퇴장 애니메이션이 끝날 때까지 마운트를 유지한다.
 *
 * 반환한 ref를 퇴장 애니메이션이 걸린 요소에 붙인다. 그 요소가 없으면(= ref 미부착)
 * 기다릴 대상이 없으므로 즉시 언마운트한다.
 */
export function usePresence(open: boolean) {
  const [present, setPresent] = React.useState(open);
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  React.useEffect(() => {
    if (open || !present) return;

    const node = ref.current;
    if (!node) {
      setPresent(false);
      return;
    }

    const duration = exitDurationMs(node);
    if (duration === 0) {
      setPresent(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const finish = () => {
      clearTimeout(timer);
      node.removeEventListener("animationend", onEnd);
      node.removeEventListener("transitionend", onEnd);
      setPresent(false);
    };
    // 자식의 애니메이션이 버블링으로 올라와 조기 언마운트시키는 것을 막는다.
    const onEnd = (event: Event) => {
      if (event.target === node) finish();
    };

    node.addEventListener("animationend", onEnd);
    node.addEventListener("transitionend", onEnd);
    timer = setTimeout(finish, duration + FALLBACK_MARGIN_MS);

    return () => {
      clearTimeout(timer);
      node.removeEventListener("animationend", onEnd);
      node.removeEventListener("transitionend", onEnd);
    };
  }, [open, present]);

  return { present, ref };
}
