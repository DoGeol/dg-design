import * as React from "react";

export interface UseResizeHandleOptions {
  /** 구분선 방향. vertical: 세로 손잡이(가로 조절), horizontal: 가로 손잡이(세로 조절). 기본값 "vertical" */
  orientation?: "vertical" | "horizontal";
  /** 제어되는 현재 값 */
  value: number;
  /** 허용 최소값 */
  min: number;
  /** 허용 최대값 */
  max: number;
  /** 키보드 화살표 입력 시 1회 증감량. 기본값 1 */
  step?: number;
  /** 값이 변경되었을 때 호출되는 콜백 */
  onValueChange: (value: number) => void;
  /** 더블클릭 또는 Enter/Space 키 입력 시 기본값 복원을 위한 콜백 */
  onReset?: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 스크린 리더용 접근성 라벨 */
  "aria-label"?: string;
  /** 스크린 리더용 접근성 라벨 참조 ID */
  "aria-labelledby"?: string;
}

export interface UseResizeHandleReturn {
  handleProps: React.HTMLAttributes<HTMLDivElement> & {
    role: "separator";
    tabIndex: number;
    "aria-orientation": "vertical" | "horizontal";
    "aria-valuenow": number;
    "aria-valuemin": number;
    "aria-valuemax": number;
    "aria-disabled"?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "data-orientation": "vertical" | "horizontal";
    "data-dragging"?: boolean | string;
    "data-disabled"?: boolean | string;
  };
  /** 현재 포인터 드래그 중인지 여부 */
  isDragging: boolean;
}

export function clampResizeValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 분할 화면 조절 손잡이의 포인터 캡처, 키보드 조작, ARIA separator 계약을 다루는 저수준 훅.
 */
export function useResizeHandle(options: UseResizeHandleOptions): UseResizeHandleReturn {
  const {
    orientation = "vertical",
    value,
    min,
    max,
    step = 1,
    onValueChange,
    onReset,
    disabled = false,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
  } = options;

  const [isDragging, setIsDragging] = React.useState(false);

  // 이벤트 핸들러 클로저에서 최신 options 값을 안전하게 참조하기 위한 ref
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const dragStateRef = React.useRef<{
    startX: number;
    startY: number;
    startValue: number;
    hasMoved: boolean;
    pointerId: number;
  } | null>(null);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // 주 버튼(좌클릭)만 드래그를 시작하고, 비활성 상태에서는 포인터 조작을 차단한다.
      if (disabled || event.button !== 0) return;

      try {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      } catch {
        /* jsdom 등 포인터 캡처 미지원 환경 대응 */
      }

      // 드래그 시작 시 초점을 손잡이로 이동하여 키보드 연속 조작으로 자연스럽게 이어지게 한다.
      event.currentTarget.focus();

      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startValue: value,
        hasMoved: false,
        pointerId: event.pointerId,
      };
      setIsDragging(true);
    },
    [disabled, value],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (!state) return;

      const {
        orientation: currentOrientation = "vertical",
        min: currentMin,
        max: currentMax,
        onValueChange: currentOnValueChange,
      } = optionsRef.current;

      const delta =
        currentOrientation === "vertical"
          ? event.clientX - state.startX
          : event.clientY - state.startY;

      if (delta !== 0) {
        state.hasMoved = true;
      }

      const nextValue = clampResizeValue(state.startValue + delta, currentMin, currentMax);
      // 스펙 요구사항: 드래그가 일어나는 동안 aria-valuenow를 실시간 갱신하고 onValueChange를 즉시 호출한다.
      event.currentTarget.setAttribute("aria-valuenow", String(Math.round(nextValue)));
      currentOnValueChange(nextValue);
    },
    [],
  );

  const releasePointer = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* jsdom 등 대응 */
    }
    dragStateRef.current = null;
    setIsDragging(false);
  }, []);

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStateRef.current) return;
      releasePointer(event);
      // 이동량이 0인 단순 클릭은 값을 확정 변경하지 않고 double click 이벤트가 발생할 수 있도록 둔다.
    },
    [releasePointer],
  );

  const handlePointerCancel = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (!state) return;

      const { onValueChange: currentOnValueChange } = optionsRef.current;
      // 스펙 요구사항: onPointerCancel 발생 시 드래그 직전의 확정 값으로 복구한다.
      currentOnValueChange(state.startValue);
      event.currentTarget.setAttribute("aria-valuenow", String(Math.round(state.startValue)));

      releasePointer(event);
    },
    [releasePointer],
  );

  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      // 더블클릭 시 기본값 복원 콜백 실행
      onReset?.();
    },
    [disabled, onReset],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      const {
        orientation: currentOrientation = "vertical",
        min: currentMin,
        max: currentMax,
        step: currentStep = 1,
        onValueChange: currentOnValueChange,
        onReset: currentOnReset,
      } = optionsRef.current;

      const isVertical = currentOrientation === "vertical";
      const isDecrease = isVertical ? event.key === "ArrowLeft" : event.key === "ArrowDown";
      const isIncrease = isVertical ? event.key === "ArrowRight" : event.key === "ArrowUp";

      if (isDecrease) {
        event.preventDefault();
        currentOnValueChange(clampResizeValue(value - currentStep, currentMin, currentMax));
      } else if (isIncrease) {
        event.preventDefault();
        currentOnValueChange(clampResizeValue(value + currentStep, currentMin, currentMax));
      } else if (event.key === "Home") {
        event.preventDefault();
        currentOnValueChange(currentMin);
      } else if (event.key === "End") {
        event.preventDefault();
        currentOnValueChange(currentMax);
      } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        if (currentOnReset) {
          event.preventDefault();
          currentOnReset();
        }
      }
    },
    [disabled, value],
  );

  return {
    handleProps: {
      role: "separator",
      tabIndex: disabled ? -1 : 0,
      "aria-orientation": orientation,
      "aria-valuenow": Math.round(value),
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-disabled": disabled ? true : undefined,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "data-orientation": orientation,
      "data-dragging": isDragging ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onDoubleClick: handleDoubleClick,
      onKeyDown: handleKeyDown,
    },
    isDragging,
  };
}
