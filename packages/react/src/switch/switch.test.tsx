import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Field } from "../field/Field";
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

describe("Switch Field 연동", () => {
  function WithField() {
    return (
      <Field.Root>
        <Field.Label>알림 받기</Field.Label>
        <Switch />
        <Field.ErrorMessage>설정을 확인해주세요.</Field.ErrorMessage>
      </Field.Root>
    );
  }

  it("Field.Label 클릭으로 토글된다 (htmlFor 자동 연결)", async () => {
    const user = userEvent.setup();
    render(<WithField />);
    const input = screen.getByRole("switch") as HTMLInputElement;

    await user.click(screen.getByText("알림 받기"));
    expect(input.checked).toBe(true);
  });

  it("ErrorMessage가 aria-invalid·aria-describedby에 걸린다", () => {
    render(<WithField />);
    const input = screen.getByRole("switch");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(
      screen.getByText("설정을 확인해주세요.").id,
    );
  });

  it("Field 밖에서는 자체 id를 쓰고 invalid가 false다", () => {
    render(<Switch aria-label="단독" />);
    const input = screen.getByRole("switch");

    expect(input.id).toBeTruthy();
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });
});
