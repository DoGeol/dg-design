import * as React from "react";
import type { Placement } from "@floating-ui/dom";

export interface DropdownMenuContextValue {
  /** 논리 상태. 퇴장 애니메이션 중에는 false지만 아직 마운트돼 있다. */
  open: boolean;
  /** 실제 마운트 여부(퇴장 애니메이션 포함). */
  present: boolean;
  /** body 직속 portal 컨테이너. 마운트 전에는 null. */
  container: HTMLElement | null;
  /** presence가 퇴장 완료를 기다릴 요소 — Content가 붙인다. */
  contentRef: React.RefObject<HTMLElement | null>;
  /** floating 기준 요소. 위치 계산 effect의 의존성이라 ref가 아니라 상태다. */
  triggerNode: HTMLElement | null;
  setTriggerNode: (node: HTMLElement | null) => void;
  /** Content를 floating 요소로 등록한다. */
  setContentNode: (node: HTMLElement | null) => void;
  triggerId: string;
  placement: Placement;
  setOpen: (next: boolean) => void;
}

export const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(
  undefined,
);

export function useDropdownMenuContext(component: string): DropdownMenuContextValue {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error(`${component}은 DropdownMenu.Root 안에서만 쓸 수 있다.`);
  return context;
}
