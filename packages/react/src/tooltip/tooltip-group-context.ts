import * as React from "react";

export interface TooltipGroupContextValue {
  /** 이 순간 openDelay를 생략해야 하는지 — 그룹 내 다른 툴팁이 열려 있거나 닫힌 직후 유예 중. */
  isSkipped: () => boolean;
  /** 툴팁이 실제로 열렸을 때 호출한다. 그룹을 "열림" 상태로 표시한다. */
  onOpen: () => void;
  /** 툴팁이 실제로 닫혔을 때 호출한다. 유예 시간 뒤 그룹을 "닫힘"으로 되돌린다. */
  onClose: () => void;
}

export const TooltipGroupContext = React.createContext<TooltipGroupContextValue | undefined>(
  undefined,
);

/** Provider 밖에서는 undefined — Root가 항상 전체 delay를 쓰는 단독 모드로 대체한다. */
export function useTooltipGroup(): TooltipGroupContextValue | undefined {
  return React.useContext(TooltipGroupContext);
}
