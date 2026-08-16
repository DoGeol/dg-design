import * as React from "react";

export interface HoverCardContextValue {
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
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  closeImmediate: () => void;
}

export const HoverCardContext = React.createContext<HoverCardContextValue | undefined>(undefined);

export function useHoverCardContext(component: string): HoverCardContextValue {
  const context = React.useContext(HoverCardContext);
  if (!context) throw new Error(`${component}은 HoverCard.Root 안에서만 쓸 수 있다.`);
  return context;
}
