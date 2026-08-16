import type { VirtualElement } from "@floating-ui/dom";
import * as React from "react";

export interface ContextMenuContextValue {
  /** 논리 상태. 퇴장 애니메이션 중에는 false지만 아직 마운트돼 있다. */
  open: boolean;
  /** 실제 마운트 여부(퇴장 애니메이션 포함). */
  present: boolean;
  /** body 직속 portal 컨테이너. 마운트 전에는 null. */
  container: HTMLElement | null;
  /** presence가 퇴장 완료를 기다릴 요소 — Content가 붙인다. */
  contentRef: React.RefObject<HTMLElement | null>;
  /** 우클릭을 받는 트리거 요소. 바깥 클릭 판정·닫힘 시 포커스 복귀 대상. */
  triggerNode: HTMLElement | null;
  setTriggerNode: (node: HTMLElement | null) => void;
  /** Content를 floating 요소로 등록한다. */
  setContentNode: (node: HTMLElement | null) => void;
  setOpen: (next: boolean) => void;
  /**
   * 커서 좌표로 만든 VirtualElement로 연다. 이미 열려 있어도 그대로 다시 호출되며,
   * 배치 훅이 reference identity 변화를 보고 새 좌표로 재계산한다.
   */
  openAt: (virtualElement: VirtualElement) => void;
}

export const ContextMenuContext = React.createContext<ContextMenuContextValue | undefined>(
  undefined,
);

export function useContextMenuContext(component: string): ContextMenuContextValue {
  const context = React.useContext(ContextMenuContext);
  if (!context) throw new Error(`${component}은 ContextMenu.Root 안에서만 쓸 수 있다.`);
  return context;
}
