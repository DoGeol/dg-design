import * as React from "react";

export type SheetSide = "left" | "right" | "top" | "bottom";

export interface SheetContextValue {
  /** 논리 상태. 퇴장 애니메이션 중에는 false지만 아직 마운트돼 있다. */
  open: boolean;
  /** 실제 마운트 여부(퇴장 애니메이션 포함). */
  present: boolean;
  /** body 직속 portal 컨테이너. 마운트 전에는 null. */
  container: HTMLElement | null;
  /** presence가 퇴장 완료를 기다릴 요소 — Content가 붙인다. */
  contentRef: React.RefObject<HTMLElement | null>;
  side: SheetSide;
  titleId: string;
  descriptionId: string;
  /** Title이 실제로 렌더됐을 때만 채워진다. */
  labelledBy: string | undefined;
  /** Description이 실제로 렌더됐을 때만 채워진다. */
  describedBy: string | undefined;
  /** id를 등록하고 해제 함수를 돌려준다 (Field.Root와 같은 관습). */
  register: (id: string) => () => void;
  setOpen: (next: boolean) => void;
  closeOnOverlayClick: boolean;
}

export const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

export function useSheetContext(component: string): SheetContextValue {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error(`${component}은 Sheet.Root 안에서만 쓸 수 있다.`);
  return context;
}
