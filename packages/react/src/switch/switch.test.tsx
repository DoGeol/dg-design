import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("role=switch로 렌더된다", () => {
    render(<Switch aria-label="알림" />);
    expect(screen.getByRole("switch").tagName).toBe("INPUT");
  });

  it("클릭하면 checked가 토글된다", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="알림" />);
    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBe(false);
    await user.click(input);
    expect(input.checked).toBe(true);
  });

  it("disabled면 클릭해도 상태가 바뀌지 않는다", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="비활성" disabled />);
    const input = screen.getByRole("switch") as HTMLInputElement;

    await user.click(input);
    expect(input.checked).toBe(false);
  });
});
