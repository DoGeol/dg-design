import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

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

/** 모션 허용 여부만 본다 — 실제 프레임·opacity는 jsdom이 판정할 수 없어 브라우저 기능 테스트가 맡는다. */
describe("Checkbox 선택 표시 전환", () => {
  const box = () => document.querySelector<HTMLElement>(".dds-checkbox__box")!;
  const motionOn = () => box().hasAttribute("data-motion");

  it("최초 렌더에는 모션이 꺼져 있다", () => {
    render(<Checkbox aria-label="약관" defaultChecked />);
    expect(motionOn()).toBe(false);
  });

  it("포인터 클릭은 input·label 어느 쪽이든 모션을 켠다", async () => {
    const user = userEvent.setup();
    render(<Checkbox>약관에 동의합니다</Checkbox>);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(input);
    expect(input.checked).toBe(true);
    expect(motionOn()).toBe(true);

    // 전환 종료는 사용자 인터랙션이 아니라 브라우저 생명주기 이벤트라 user-event에 대응이 없다.
    fireEvent.transitionEnd(box());
    expect(motionOn()).toBe(false);

    await user.click(screen.getByText("약관에 동의합니다"));
    expect(input.checked).toBe(false);
    expect(motionOn()).toBe(true);
  });

  it("키보드 Space는 모션 없이 바꾸고, 남아 있던 모션도 끈다", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="약관" />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(input);
    expect(motionOn()).toBe(true);

    // 전환이 끝나기 전에 키보드로 개입 — 값은 바뀌고 모션 허용은 사라진다.
    input.focus();
    await user.keyboard(" ");
    expect(input.checked).toBe(false);
    expect(motionOn()).toBe(false);
  });

  it("폼 reset과 외부 값 변경은 모션을 켜지 않는다", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = React.useState(false);
      return (
        <form>
          <Checkbox
            aria-label="약관"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          <button type="button" onClick={() => setChecked(true)}>
            프로그램 체크
          </button>
          <button type="reset">리셋</button>
        </form>
      );
    }
    render(<Controlled />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(screen.getByText("프로그램 체크"));
    expect(input.checked).toBe(true);
    expect(motionOn()).toBe(false);

    await user.click(screen.getByText("리셋"));
    expect(motionOn()).toBe(false);
  });

  it('motion="none"이면 포인터 클릭에도 모션을 켜지 않는다', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="약관" motion="none" />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(input);
    expect(input.checked).toBe(true);
    expect(motionOn()).toBe(false);
    expect(input.hasAttribute("motion")).toBe(false);
  });

  it("사용자 onClick을 보존하고, preventDefault면 값도 모션도 그대로다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(<Checkbox aria-label="약관" onClick={onClick} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    await user.click(input);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(input.checked).toBe(false);
    expect(motionOn()).toBe(false);
  });

  it("indeterminate에서 클릭해도 ref와 DOM 프로퍼티 배선이 유지된다", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox aria-label="일부" ref={ref} indeterminate />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(ref.current).toBe(input);
    expect(input.indeterminate).toBe(true);

    await user.click(input);
    expect(input.checked).toBe(true);
    expect(motionOn()).toBe(true);

    rerender(<Checkbox aria-label="일부" ref={ref} indeterminate={false} />);
    expect(input.indeterminate).toBe(false);
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
