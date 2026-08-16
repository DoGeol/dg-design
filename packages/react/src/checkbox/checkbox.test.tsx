import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Field } from "../field/Field";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("클릭하면 checked가 토글된다", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="약관 동의" />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.checked).toBe(false);
    await user.click(input);
    expect(input.checked).toBe(true);
    await user.click(input);
    expect(input.checked).toBe(false);
  });

  it("children 라벨 텍스트 클릭으로도 토글된다 (label 래핑 구조)", async () => {
    const user = userEvent.setup();
    render(<Checkbox>약관에 동의합니다</Checkbox>);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(screen.getByText("약관에 동의합니다"));
    expect(input.checked).toBe(true);
  });

  it("indeterminate prop이 DOM 프로퍼티에 반영된다", () => {
    const { rerender } = render(<Checkbox aria-label="일부 선택" indeterminate />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.indeterminate).toBe(true);

    rerender(<Checkbox aria-label="일부 선택" indeterminate={false} />);
    expect(input.indeterminate).toBe(false);
  });

  it("disabled면 클릭해도 상태가 바뀌지 않는다", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="비활성" disabled />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(input);
    expect(input.checked).toBe(false);
  });
});

describe("Checkbox Field 연동", () => {
  function WithField() {
    return (
      <Field.Root>
        <Field.Label>약관 동의</Field.Label>
        <Checkbox />
        <Field.ErrorMessage>동의가 필요합니다.</Field.ErrorMessage>
      </Field.Root>
    );
  }

  it("Field.Label 클릭으로 토글된다 (htmlFor 자동 연결)", async () => {
    const user = userEvent.setup();
    render(<WithField />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(screen.getByText("약관 동의"));
    expect(input.checked).toBe(true);
  });

  it("ErrorMessage가 aria-invalid·aria-describedby에 걸린다", () => {
    render(<WithField />);
    const input = screen.getByRole("checkbox");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(
      screen.getByText("동의가 필요합니다.").id,
    );
  });

  it("Field 밖에서는 자체 id를 쓰고 invalid가 false다", () => {
    render(<Checkbox aria-label="단독" />);
    const input = screen.getByRole("checkbox");

    expect(input.id).toBeTruthy();
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });
});
