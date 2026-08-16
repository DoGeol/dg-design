import * as React from "react";

export interface HoverCardSchedule {
  /** hover 진입. openDelay(또는 즉시, delay<=0) 뒤 연다. */
  scheduleOpen: () => void;
  /** hover 이탈. closeDelay 뒤 닫는다. */
  scheduleClose: () => void;
  /** 콘텐츠 진입 등으로 대기 중인 닫힘만 취소한다 — 열림 상태는 건드리지 않는다. */
  cancelClose: () => void;
  /** ESC. 지연 없이 즉시 닫는다. */
  closeImmediate: () => void;
}

/**
 * tooltip/use-tooltip-schedule.ts를 hover-card용으로 정리한 복제본이다(원본 수정 금지).
 * HoverCard는 Provider 그룹(스킵 지연)이 없어(스펙: Provider 그룹 없음, YAGNI) 그 절반이 빠졌고,
 * 대신 콘텐츠로 포인터가 넘어왔을 때 "열림은 그대로 두고 닫힘만 취소"하는 cancelClose가 필요하다 —
 * Tooltip 콘텐츠는 비인터랙티브라 이 개념 자체가 없었다.
 */
export function useHoverCardSchedule(
  setOpen: (next: boolean) => void,
  openDelay: number,
  closeDelay: number,
): HoverCardSchedule {
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
    const scheduleOpen = () => {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
      if (openTimer.current) return;

      if (openDelay <= 0) {
        setOpen(true);
        return;
      }
      openTimer.current = setTimeout(() => {
        openTimer.current = undefined;
        setOpen(true);
      }, openDelay);
    };

    const scheduleClose = () => {
      clearTimeout(openTimer.current);
      openTimer.current = undefined;
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        closeTimer.current = undefined;
        setOpen(false);
      }, closeDelay);
    };

    const cancelClose = () => {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    };

    const closeImmediate = () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      openTimer.current = undefined;
      closeTimer.current = undefined;
      setOpen(false);
    };

    return { scheduleOpen, scheduleClose, cancelClose, closeImmediate };
  }, [setOpen, openDelay, closeDelay]);
}
