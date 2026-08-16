import type { Placement } from "@floating-ui/dom";
import * as React from "react";

export interface TooltipContextValue {
  /** 논리 상태. 퇴장 애니메이션 중에는 false지만 아직 마운트돼 있다. */
  open: boolean;
  /** 실제 마운트 여부(퇴장 애니메이션 포함). */
  present: boolean;
  /** body 직속 portal 컨테이너. 마운트 전에는 null. */
  container: HTMLElement | null;
  /** presence가 퇴장 완료를 기다릴 요소 — Content가 붙인다. */
  contentRef: React.RefObject<HTMLElement | null>;
  /** floating 기준 요소. */
  triggerNode: HTMLElement | null;
  setTriggerNode: (node: HTMLElement | null) => void;
  setContentNode: (node: HTMLElement | null) => void;
  setArrowNode: (node: HTMLElement | null) => void;
  triggerId: string;
  contentId: string;
  placement: Placement;
  /** hover/focus 진입. openDelay(그룹 스킵 시 즉시) 뒤 연다. */
  scheduleOpen: () => void;
  /** hover 이탈. closeDelay 뒤 닫는다. */
  scheduleClose: () => void;
  /** blur·ESC. 지연 없이 즉시 닫는다. */
  closeImmediate: () => void;
}

export const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

export function useTooltipContext(component: string): TooltipContextValue {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error(`${component}은 Tooltip.Root 안에서만 쓸 수 있다.`);
  return context;
}
