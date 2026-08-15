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
