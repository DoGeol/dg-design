import * as React from "react";

import type { TooltipGroupContextValue } from "./tooltip-group-context";

export interface TooltipSchedule {
  scheduleOpen: () => void;
  scheduleClose: () => void;
  closeImmediate: () => void;
}

/**
 * hover/focus 진입·이탈을 openDelay·closeDelay 타이머로 열고 닫는다.
 * 그룹(Provider) 스코프에서 하나가 열려 있으면(또는 닫힌 직후 짧은 유예) openDelay를 생략한다.
 */
export function useTooltipSchedule(
  open: boolean,
  setOpen: (next: boolean) => void,
  openDelay: number,
  closeDelay: number,
  group: TooltipGroupContextValue | undefined,
): TooltipSchedule {
  const openTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  // 그룹의 열림 수는 실제 열림 상태로 센다 — 타이머 경로에서 세면 열린 채 unmount되거나
  // controlled 부모가 직접 닫을 때 onClose가 빠져 스킵이 영영 안 풀린다. 열리기 전 이탈
  // (openDelay 중 blur)은 열린 적이 없으니 세지 않는다.
  React.useEffect(() => {
    if (!open || !group) return;
    group.onOpen();
    return group.onClose;
  }, [open, group]);

  React.useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    [],
  );

  return React.useMemo(() => {
    const openNow = () => {
      openTimer.current = undefined;
      setOpen(true);
    };

    const scheduleOpen = () => {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
      if (openTimer.current) return;

      const delay = group?.isSkipped() ? 0 : openDelay;
      if (delay <= 0) {
        openNow();
        return;
      }
      openTimer.current = setTimeout(openNow, delay);
    };

    const scheduleClose = () => {
      clearTimeout(openTimer.current);
      openTimer.current = undefined;
      closeTimer.current = setTimeout(() => {
        closeTimer.current = undefined;
        setOpen(false);
      }, closeDelay);
    };

    const closeImmediate = () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      openTimer.current = undefined;
      closeTimer.current = undefined;
      setOpen(false);
    };

    return { scheduleOpen, scheduleClose, closeImmediate };
  }, [setOpen, openDelay, closeDelay, group]);
}
