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
  setOpen: (next: boolean) => void,
  openDelay: number,
  closeDelay: number,
  group: TooltipGroupContextValue | undefined,
): TooltipSchedule {
  const openTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

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
      group?.onOpen();
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
        group?.onClose();
      }, closeDelay);
    };

    const closeImmediate = () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      openTimer.current = undefined;
      closeTimer.current = undefined;
      setOpen(false);
      group?.onClose();
    };

    return { scheduleOpen, scheduleClose, closeImmediate };
  }, [setOpen, openDelay, closeDelay, group]);
}
