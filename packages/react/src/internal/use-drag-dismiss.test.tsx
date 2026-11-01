import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useDragDismiss, type DragDismissOptions } from "./use-drag-dismiss";

function Draggable(props: Omit<DragDismissOptions, "axis" | "towards">) {
  const { dragging, handlers } = useDragDismiss({ axis: "x", towards: 1, ...props });
  return <div data-testid="target" data-dragging={dragging ? "" : undefined} {...handlers} />;
}

describe("useDragDismiss", () => {
  afterEach(() => {
    delete (HTMLElement.prototype as { setPointerCapture?: unknown }).setPointerCapture;
  });

  it("문턱을 넘으면 포인터를 잡는다 — 요소 밖에서 놓아도 pointerup을 받아야 한다", async () => {
    // jsdom에는 포인터 캡처가 없다 — 호출 여부만 본다.
    const capture = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
      configurable: true,
      value: capture,
    });
    const user = userEvent.setup();
    render(<Draggable onMove={() => {}} onEnd={() => {}} />);
    const target = screen.getByTestId("target");

    await user.pointer([
      { keys: "[MouseLeft>]", target, coords: { clientX: 10, clientY: 10 } },
      { target, coords: { clientX: 12, clientY: 10 } },
    ]);
    expect(capture).not.toHaveBeenCalled();

    await user.pointer({ target, coords: { clientX: 30, clientY: 10 } });
    expect(capture).toHaveBeenCalledTimes(1);
    expect(target.hasAttribute("data-dragging")).toBe(true);

    await user.pointer({ keys: "[/MouseLeft]", target });
    expect(target.hasAttribute("data-dragging")).toBe(false);
  });

  // user-event는 pointercancel을 만들 수 없어 핸들러를 직접 부른다.
  it("pointercancel은 거리·속도와 상관없이 제자리로 돌린다", () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() =>
      useDragDismiss({ axis: "x", towards: 1, onMove: () => {}, onEnd }),
    );
    const element = document.createElement("div");
    const event = (clientX: number) =>
      ({ button: 0, pointerId: 1, clientX, clientY: 0, currentTarget: element }) as unknown as React.PointerEvent;
    type Handler = (event: React.PointerEvent) => void;
    const handlers = result.current.handlers as Record<"onPointerDown" | "onPointerMove" | "onPointerCancel", Handler>;

    act(() => {
      handlers.onPointerDown(event(0));
      // 한 프레임 안의 500px — 놓았다면 속도로든 거리로든 해제였다.
      handlers.onPointerMove(event(500));
      handlers.onPointerCancel(event(500));
    });

    expect(onEnd).toHaveBeenCalledWith({ dismissed: false, offset: 500 });
  });
});
