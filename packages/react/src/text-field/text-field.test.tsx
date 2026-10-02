import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { TextField } from "./TextField";

describe("TextField", () => {
  it("단독 사용 시 context 없이도 자체 id를 생성한다", () => {
    render(<TextField aria-label="이름" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input.id).toBeTruthy();
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(input.getAttribute("aria-describedby")).toBeFalsy();
  });

  it("명시적 id를 넘기면 그대로 쓴다", () => {
    render(<TextField aria-label="이름" id="custom-id" />);
    expect(screen.getByRole("textbox").id).toBe("custom-id");
  });

  it("타이핑하면 값이 반영된다", async () => {
    const user = userEvent.setup();
    render(<TextField aria-label="이름" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    await user.type(input, "도결");
    expect(input.value).toBe("도결");
  });

  it("disabled면 타이핑해도 값이 바뀌지 않는다", async () => {
    const user = userEvent.setup();
    render(<TextField aria-label="이름" disabled />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    await user.type(input, "도결");
    expect(input.value).toBe("");
  });

  it("readOnly면 타이핑해도 값이 바뀌지 않는다", async () => {
    const user = userEvent.setup();
    render(<TextField aria-label="이름" readOnly defaultValue="고정값" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    await user.type(input, "도결");
    expect(input.value).toBe("고정값");
  });
});

describe("TextField prefix/suffix", () => {
  it("둘 다 없으면 input 하나만 렌더한다 (wrapper 없음)", () => {
    const { container } = render(<TextField aria-label="이름" className="x" />);
    const input = container.firstElementChild as HTMLElement;

    expect(input.tagName).toBe("INPUT");
    expect(input.classList.contains("dds-text-field")).toBe(true);
    expect(input.classList.contains("x")).toBe(true);
  });

  it("있으면 wrapper로 감싸고 className은 wrapper, ref·props는 input으로 간다", () => {
    const ref = React.createRef<HTMLInputElement>();
    const { container } = render(
      <TextField ref={ref} aria-label="금액" className="x" prefix="₩" suffix="원" disabled />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(wrapper.classList.contains("dds-text-field__wrapper")).toBe(true);
    expect(wrapper.classList.contains("x")).toBe(true);
    expect(input.classList.contains("x")).toBe(false);
    expect(ref.current).toBe(input);
    expect(input.disabled).toBe(true);
    expect(wrapper.textContent).toBe("₩원");
    // HTML prefix 속성으로 새지 않는다
    expect(input.getAttribute("prefix")).toBeNull();
  });

  it("장식 영역을 누르면 input에 포커스가 간다", async () => {
    const user = userEvent.setup();
    render(<TextField aria-label="금액" suffix={<span data-testid="s">원</span>} />);

    await user.click(screen.getByTestId("s").parentElement as HTMLElement);
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });
});
