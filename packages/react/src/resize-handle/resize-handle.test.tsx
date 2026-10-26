import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ResizeHandle, useResizeHandle } from "./ResizeHandle";

function ControlledResizeHandle(
  props: Partial<React.ComponentProps<typeof ResizeHandle>> & {
    initialValue?: number;
  },
) {
  const {
    initialValue = 50,
    min = 0,
    max = 100,
    step = 1,
    orientation = "vertical",
    onReset,
    ...rest
  } = props;
  const [val, setVal] = React.useState(initialValue);

  return (
    <ResizeHandle
      aria-label="크기 조절"
      orientation={orientation}
      value={val}
      min={min}
      max={max}
      step={step}
      onValueChange={setVal}
      onReset={onReset}
      data-testid="handle"
      {...rest}
    />
  );
}

describe("ResizeHandle ARIA 및 기본 렌더링", () => {
  it("separator role, aria-valuenow, min, max, orientation 속성이 올바르게 렌더된다", () => {
    render(
      <ResizeHandle
        aria-label="사이드바 너비"
        orientation="vertical"
        value={42.3}
        min={10}
        max={100}
        onValueChange={vi.fn()}
      />,
    );

    const handle = screen.getByRole("separator", { name: "사이드바 너비" });
    expect(handle).toBeTruthy();
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");
    expect(handle.getAttribute("aria-valuenow")).toBe("42");
    expect(handle.getAttribute("aria-valuemin")).toBe("10");
    expect(handle.getAttribute("aria-valuemax")).toBe("100");
    expect(handle.getAttribute("tabindex")).toBe("0");
    expect(handle.getAttribute("data-orientation")).toBe("vertical");
  });

  it("horizontal orientation을 올바르게 반영한다", () => {
    render(
      <ResizeHandle
        aria-label="패널 높이"
        orientation="horizontal"
        value={80}
        min={50}
        max={200}
        onValueChange={vi.fn()}
      />,
    );

    const handle = screen.getByRole("separator", { name: "패널 높이" });
    expect(handle.getAttribute("aria-orientation")).toBe("horizontal");
    expect(handle.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("disabled 시 탭 정지점에서 제외되고 aria-disabled가 붙는다", () => {
    render(
      <ResizeHandle
        aria-label="비활성 조절 손잡이"
        value={50}
        min={0}
        max={100}
        disabled
        onValueChange={vi.fn()}
      />,
    );

    const handle = screen.getByRole("separator", { name: "비활성 조절 손잡이" });
    expect(handle.getAttribute("tabindex")).toBe("-1");
    expect(handle.getAttribute("aria-disabled")).toBe("true");
    expect(handle.hasAttribute("data-disabled")).toBe(true);
  });
});

describe("ResizeHandle 키보드 조작", () => {
  it("vertical: ArrowLeft로 -step, ArrowRight로 +step 증감하고 clamp 하한/상한을 지킨다", async () => {
    const user = userEvent.setup();
    render(<ControlledResizeHandle initialValue={50} step={5} min={40} max={60} />);

    const handle = screen.getByTestId("handle");
    handle.focus();

    await user.keyboard("{ArrowLeft}");
    expect(handle.getAttribute("aria-valuenow")).toBe("45");

    await user.keyboard("{ArrowRight}");
    expect(handle.getAttribute("aria-valuenow")).toBe("50");

    // 상한 60 초과 방지
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(handle.getAttribute("aria-valuenow")).toBe("60");

    // 하한 40 미만 방지
    await user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}");
    expect(handle.getAttribute("aria-valuenow")).toBe("40");
  });

  it("horizontal: ArrowDown으로 -step, ArrowUp으로 +step 증감한다", async () => {
    const user = userEvent.setup();
    render(
      <ControlledResizeHandle
        orientation="horizontal"
        initialValue={50}
        step={10}
        min={0}
        max={100}
      />,
    );

    const handle = screen.getByTestId("handle");
    handle.focus();

    await user.keyboard("{ArrowDown}");
    expect(handle.getAttribute("aria-valuenow")).toBe("40");

    await user.keyboard("{ArrowUp}");
    expect(handle.getAttribute("aria-valuenow")).toBe("50");
  });

  it("Home 및 End 키 입력 시 min 하한과 max 상한으로 즉시 변경된다", async () => {
    const user = userEvent.setup();
    render(<ControlledResizeHandle initialValue={50} min={20} max={80} />);

    const handle = screen.getByTestId("handle");
    handle.focus();

    await user.keyboard("{Home}");
    expect(handle.getAttribute("aria-valuenow")).toBe("20");

    await user.keyboard("{End}");
    expect(handle.getAttribute("aria-valuenow")).toBe("80");
  });

  it("Enter 및 Space 키 입력 시 onReset 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<ControlledResizeHandle initialValue={50} onReset={onReset} />);

    const handle = screen.getByTestId("handle");
    handle.focus();

    await user.keyboard("{Enter}");
    expect(onReset).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(onReset).toHaveBeenCalledTimes(2);
  });

  it("disabled 시 키보드 입력이 무시된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onReset = vi.fn();
    render(
      <ResizeHandle
        aria-label="비활성"
        value={50}
        min={0}
        max={100}
        disabled
        onValueChange={onValueChange}
        onReset={onReset}
        data-testid="handle"
      />,
    );

    const handle = screen.getByTestId("handle");
    handle.focus();

    await user.keyboard("{ArrowLeft}{ArrowRight}{Home}{End}{Enter} ");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();
  });
});

describe("ResizeHandle 포인터 드래그 및 초기화", () => {
  it("pointerdown → pointermove → pointerup 인터랙션에서 델타 이동량에 따라 값이 변경된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ResizeHandle
        aria-label="드래그 테스트"
        orientation="vertical"
        value={100}
        min={50}
        max={200}
        onValueChange={onValueChange}
        data-testid="handle"
      />,
    );

    const handle = screen.getByTestId("handle");

    // x=100에서 시작해 x=130으로 드래그 (+30px)
    await user.pointer([
      { keys: "[MouseLeft>]", target: handle, coords: { clientX: 100, clientY: 50 } },
      { coords: { clientX: 130, clientY: 50 } },
      { keys: "[/MouseLeft]" },
    ]);

    expect(onValueChange).toHaveBeenCalledWith(130);
  });

  it("horizontal 드래그 시 clientY 델타에 따라 값이 변경된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ResizeHandle
        aria-label="수평 드래그"
        orientation="horizontal"
        value={200}
        min={100}
        max={400}
        onValueChange={onValueChange}
        data-testid="handle"
      />,
    );

    const handle = screen.getByTestId("handle");

    // y=100에서 시작해 y=60으로 드래그 (-40px)
    await user.pointer([
      { keys: "[MouseLeft>]", target: handle, coords: { clientX: 50, clientY: 100 } },
      { coords: { clientX: 50, clientY: 60 } },
      { keys: "[/MouseLeft]" },
    ]);

    expect(onValueChange).toHaveBeenCalledWith(160);
  });

  it("이동이 없는 단순 클릭에서는 값이 변경되지 않고, 더블클릭 시 onReset이 호출된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onReset = vi.fn();

    render(
      <ResizeHandle
        aria-label="클릭 및 더블클릭"
        value={100}
        min={0}
        max={200}
        onValueChange={onValueChange}
        onReset={onReset}
        data-testid="handle"
      />,
    );

    const handle = screen.getByTestId("handle");

    // 단순 클릭 (이동량 0)
    await user.click(handle);
    expect(onValueChange).not.toHaveBeenCalled();

    // 더블 클릭
    await user.dblClick(handle);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("onPointerCancel 시 드래그 시작 전 확정 값으로 복구한다", async () => {
    const onValueChange = vi.fn();

    render(
      <ResizeHandle
        aria-label="취소 복구"
        value={100}
        min={0}
        max={200}
        onValueChange={onValueChange}
        data-testid="handle"
      />,
    );

    const handle = screen.getByTestId("handle");

    // 포인터 다운
    const pointerDownEvent = new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 100,
      clientY: 100,
      pointerId: 1,
    });
    handle.dispatchEvent(pointerDownEvent);

    // 포인터 이동
    const pointerMoveEvent = new PointerEvent("pointermove", {
      bubbles: true,
      clientX: 140,
      clientY: 100,
      pointerId: 1,
    });
    handle.dispatchEvent(pointerMoveEvent);
    expect(onValueChange).toHaveBeenCalledWith(140);

    // 포인터 캔슬 -> 시작값 100으로 복구
    const pointerCancelEvent = new PointerEvent("pointercancel", {
      bubbles: true,
      pointerId: 1,
    });
    handle.dispatchEvent(pointerCancelEvent);
    expect(onValueChange).toHaveBeenLastCalledWith(100);
    expect(handle.getAttribute("aria-valuenow")).toBe("100");
  });
});

describe("useResizeHandle 저수준 훅", () => {
  it("커스텀 요소에 handleProps를 바인딩해 동작을 그대로 사용할 수 있다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Custom() {
      const { handleProps } = useResizeHandle({
        orientation: "vertical",
        value: 50,
        min: 0,
        max: 100,
        step: 5,
        onValueChange,
        "aria-label": "커스텀 손잡이",
      });
      return <div {...handleProps} data-testid="custom-handle" />;
    }

    render(<Custom />);
    const handle = screen.getByTestId("custom-handle");

    expect(handle.getAttribute("role")).toBe("separator");
    expect(handle.getAttribute("aria-valuenow")).toBe("50");

    handle.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith(55);
  });
});
