import { autoUpdate, computePosition, flip, offset, shift, type Placement } from "@floating-ui/dom";
import * as React from "react";

/** 트리거와 패널 사이 간격(px). dimension-x1과 같은 값이지만 계산은 JS에서 하므로 상수다. */
const GAP = 4;
/** 뷰포트 가장자리에서 유지할 여백(px). shift가 밀어붙일 때의 하한. */
const VIEWPORT_PADDING = 8;

/**
 * 트리거 기준으로 패널을 배치하고 스크롤·리사이즈를 따라간다.
 * strategy는 fixed — portal 컨테이너가 body 직속이라 문서 스크롤 오프셋을 다시 더할 필요가 없다.
 */
export function useMenuPosition(
  reference: HTMLElement | null,
  floating: HTMLElement | null,
  enabled: boolean,
  placement: Placement,
): void {
  React.useEffect(() => {
    if (!enabled || !reference || !floating) return;

    return autoUpdate(reference, floating, () => {
      void computePosition(reference, floating, {
        strategy: "fixed",
        placement,
        middleware: [offset(GAP), flip(), shift({ padding: VIEWPORT_PADDING })],
      }).then(({ x, y }) => {
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
      });
    });
  }, [reference, floating, enabled, placement]);
}
