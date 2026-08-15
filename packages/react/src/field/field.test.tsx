import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { TextField } from "../text-field/TextField";
import { Field } from "./Field";

describe("Field", () => {
  it("Label 클릭 시 TextField로 포커스가 이동한다 (htmlFor 자동 연결)", async () => {
    const user = userEvent.setup();
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField />
      </Field.Root>,
    );

    await user.click(screen.getByText("이메일"));
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("Description만 렌더되면 aria-describedby에 description id만 들어간다", () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField />
        <Field.Description>회사 이메일만 허용됩니다.</Field.Description>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox");
    const description = screen.getByText("회사 이메일만 허용됩니다.");
    expect(input.getAttribute("aria-describedby")).toBe(description.id);
  });

  it("ErrorMessage가 렌더되면 aria-describedby에 포함되고 input이 invalid로 표시된다", () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField />
        <Field.ErrorMessage>올바른 이메일이 아닙니다.</Field.ErrorMessage>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox");
    const error = screen.getByText("올바른 이메일이 아닙니다.");
    expect(input.getAttribute("aria-describedby")).toBe(error.id);
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("Description·ErrorMessage가 둘 다 렌더되면 aria-describedby에 둘 다 들어간다", () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField />
        <Field.Description>회사 이메일만 허용됩니다.</Field.Description>
        <Field.ErrorMessage>올바른 이메일이 아닙니다.</Field.ErrorMessage>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox");
    const description = screen.getByText("회사 이메일만 허용됩니다.");
    const error = screen.getByText("올바른 이메일이 아닙니다.");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain(description.id);
    expect(describedBy).toContain(error.id);
  });

  it("ErrorMessage가 없으면 aria-invalid가 false다", () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField />
      </Field.Root>,
    );

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("false");
  });

  it("ErrorMessage가 언마운트되면 aria-describedby·aria-invalid에서 빠진다", () => {
    function Wrapper({ showError }: { showError: boolean }) {
      return (
        <Field.Root>
          <Field.Label>이메일</Field.Label>
          <TextField />
          {showError ? <Field.ErrorMessage>에러</Field.ErrorMessage> : null}
        </Field.Root>
      );
    }
    const { rerender } = render(<Wrapper showError />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");

    rerender(<Wrapper showError={false} />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(input.getAttribute("aria-describedby")).toBeFalsy();
  });
});
