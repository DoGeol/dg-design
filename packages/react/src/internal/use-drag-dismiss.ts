import * as React from "react";

/**
 * 끌어서 닫기 공용 배선 — Toast 가로 스와이프와 Sheet 손잡이가 같은 규칙을 쓴다.
 *
 * 움직임을 직접 그리지는 않는다. 끌린 거리(px)만 넘겨주고, 무엇을 어떻게 옮길지는
 * 컴포넌트가 정한다 — Toast는 자기 요소, Sheet는 손잡이가 아니라 Content를 옮긴다.
 */

/** 거리가 모자라도 이 속도(px/ms)를 넘으면 해제한다 — 짧고 빠르게 튕기는 조작. */
const DISMISS_VELOCITY = 0.11;
/**
 * 속도를 재는 구간. 조작 전체 평균을 쓰면 "천천히 끌다 멈춘" 손가락도 초반 속도 때문에
 * 해제로 읽힌다 — 놓기 직전 구간만 본다.
 */
const VELOCITY_WINDOW_MS = 100;
/** 거리만으로 판정할 때의 기준: 대상 크기의 절반. */
const DISMISS_RATIO = 0.5;
/** 닫히는 반대쪽으로 끌면 이만큼 나눠 따라간다 — 하드 스톱 대신 고무줄. */
const RUBBER_BAND = 3;
/** 이만큼 움직이기 전에는 끌기로 보지 않는다 — 안쪽 버튼 클릭이 살아야 한다. */
const DRAG_THRESHOLD_PX = 4;

export interface DragDismissOptions {
  /** false면 포인터를 아예 잡지 않는다. */
  enabled?: boolean;
  axis: "x" | "y";
  /** 해제되는 쪽. 오른쪽·아래가 1, 왼쪽·위가 -1. 반대쪽은 고무줄이다. */
  towards: 1 | -1;
  /** 임계 거리를 재는 요소. 없으면 끄는 요소 자신의 크기를 쓴다. */
  sizeRef?: React.RefObject<HTMLElement | null>;
  /** 이 포인터로 시작해도 되는지. 스크롤 중인 영역을 피할 때 쓴다. */
  canStart?: (event: React.PointerEvent) => boolean;
  /**
   * 누르는 즉시 포인터를 잡는다. 끄는 요소가 작아(손잡이) 문턱을 넘기 전에 포인터가
   * 밖으로 나가 버리는 경우에 쓴다. 안쪽에 눌리는 것이 있으면 쓰지 않는다 —
   * 캡처 중에는 click이 캡처 요소로 간다.
   */
  captureImmediately?: boolean;
  onStart?: () => void;
  /** 해제 방향이 양수인 거리. 반대쪽은 고무줄이 적용된 음수다. */
  onMove: (offset: number) => void;
  onEnd: (result: { dismissed: boolean; offset: number }) => void;
}

export function useDragDismiss({
  enabled = true,
  axis,
  towards,
  sizeRef,
  canStart,
  captureImmediately = false,
  onStart,
  onMove,
  onEnd,
}: DragDismissOptions) {
  const [dragging, setDragging] = React.useState(false);
  /** 방금 끌고 놓았는지. 뒤따라오는 click을 삼킬 판단은 state 반영을 기다릴 수 없다. */
  const draggedRef = React.useRef(false);
  const state = React.useRef<{
    pointerId: number;
    origin: number;
    offset: number;
    moved: boolean;
    /** 속도 계산의 기준점. 창(100ms)을 넘으면 현재 값으로 민다. */
    sample: { at: number; offset: number };
  } | null>(null);

  const point = (event: React.PointerEvent) => (axis === "x" ? event.clientX : event.clientY);

  const finish = (event: React.PointerEvent, cancelled = false) => {
    const current = state.current;
    if (!current || current.pointerId !== event.pointerId) return;
    state.current = null;
    setDragging(false);
    draggedRef.current = current.moved;
    if (!current.moved) return;
    // 취소(스크롤 전환·시스템 제스처)는 사용자가 놓은 것이 아니다 — 언제나 제자리로.
    if (cancelled) {
      onEnd({ dismissed: false, offset: current.offset });
      return;
    }

    const target = sizeRef?.current ?? (event.currentTarget as HTMLElement);
    const size = axis === "x" ? target.offsetWidth : target.offsetHeight;
    // 경과 시간 하한 1ms — 첫 프레임 안에 끝난 조작이 0으로 나눠지지 않게.
    const elapsed = Math.max(1, performance.now() - current.sample.at);
    const velocity = (current.offset - current.sample.offset) / elapsed;
    const dismissed = current.offset > size * DISMISS_RATIO || velocity > DISMISS_VELOCITY;
    onEnd({ dismissed, offset: current.offset });
  };

  if (!enabled) return { dragging: false, handlers: {} as Record<string, never> };

  return {
    dragging,
    handlers: {
      onPointerDown(event: React.PointerEvent) {
        // 주 버튼만. 오른쪽 클릭·보조 버튼으로는 끌지 않는다.
        if (event.button !== 0 || state.current) return;
        if (canStart && !canStart(event)) return;
        draggedRef.current = false;
        state.current = {
          pointerId: event.pointerId,
          origin: point(event),
          offset: 0,
          moved: false,
          sample: { at: performance.now(), offset: 0 },
        };
        if (captureImmediately) {
          (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
        }
      },
      onPointerMove(event: React.PointerEvent) {
        const current = state.current;
        if (!current || current.pointerId !== event.pointerId) return;

        const raw = (point(event) - current.origin) * towards;
        if (!current.moved) {
          if (Math.abs(raw) < DRAG_THRESHOLD_PX) return;
          current.moved = true;
          // 문턱을 넘은 뒤에야 포인터를 잡는다 — 그 전에는 안쪽 버튼이 클릭을 받는다.
          // 안 잡으면 마우스가 요소 밖에서 놓일 때 pointerup이 오지 않아 끌기 상태에 갇힌다.
          (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
          setDragging(true);
          onStart?.();
        }
        current.offset = raw >= 0 ? raw : raw / RUBBER_BAND;
        const now = performance.now();
        if (now - current.sample.at > VELOCITY_WINDOW_MS) {
          current.sample = { at: now, offset: current.offset };
        }
        onMove(current.offset);
      },
      onPointerUp: (event: React.PointerEvent) => finish(event),
      onPointerCancel: (event: React.PointerEvent) => finish(event, true),
      onClickCapture(event: React.MouseEvent) {
        // 끌고 놓은 손가락이 남기는 클릭 한 번을 삼킨다(닫기 버튼 위에서 끝났을 때).
        if (!draggedRef.current) return;
        draggedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
}
