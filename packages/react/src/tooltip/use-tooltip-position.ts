import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";
import * as React from "react";

/**
 * `internal/use-overlay-position.ts`와 갈라진 자체 구현이다 — 그 파일은 공용이라 손댈 수
 * 없고(수정 금지), arrow 미들웨어와 실제 배치(side) 노출은 Tooltip에만 필요하다.
 */
const GAP = 4;
const VIEWPORT_PADDING = 8;
/** tooltip.css의 `.dds-tooltip__arrow` width/height와 같은 값(px). */
const ARROW_SIZE = 8;

type Side = "top" | "right" | "bottom" | "left";

const STATIC_SIDE: Record<Side, Side> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};

/**
 * 트리거 기준으로 패널을 배치하고 스크롤·리사이즈를 따라간다. arrow가 있으면 함께 맞춘다.
 * 실제 배치(flip으로 뒤집힐 수 있는 side)는 `floating.dataset.side`에 남겨 CSS가 화살표
 * 회전에 쓸 수 있게 한다.
 */
export function useTooltipPosition(
  reference: HTMLElement | null,
  floating: HTMLElement | null,
  arrowEl: HTMLElement | null,
  enabled: boolean,
  placement: Placement,
): void {
  React.useEffect(() => {
    if (!enabled || !reference || !floating) return;

    return autoUpdate(reference, floating, () => {
      void computePosition(reference, floating, {
        strategy: "fixed",
        placement,
        middleware: [
          offset(GAP),
          flip(),
          shift({ padding: VIEWPORT_PADDING }),
          ...(arrowEl ? [arrow({ element: arrowEl })] : []),
        ],
      }).then(({ x, y, placement: actualPlacement, middlewareData }) => {
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;

        const side = (actualPlacement.split("-")[0] ?? "top") as Side;
        floating.dataset.side = side;

        if (!arrowEl || !middlewareData.arrow) return;
        const { x: arrowX, y: arrowY } = middlewareData.arrow;
        Object.assign(arrowEl.style, {
          left: arrowX != null ? `${arrowX}px` : "",
          top: arrowY != null ? `${arrowY}px` : "",
          right: "",
          bottom: "",
          [STATIC_SIDE[side]]: `${-ARROW_SIZE / 2}px`,
        });
      });
    });
  }, [reference, floating, arrowEl, enabled, placement]);
}
