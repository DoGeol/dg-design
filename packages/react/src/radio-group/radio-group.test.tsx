import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "../field/Field";
import { RadioGroup } from "./RadioGroup";

function Basic(props: React.ComponentProps<typeof RadioGroup.Root>) {
  return (
    <RadioGroup.Root aria-label="배송 방법" {...props}>
      <RadioGroup.Item value="standard">일반배송</RadioGroup.Item>
      <RadioGroup.Item value="express">빠른배송</RadioGroup.Item>
      <RadioGroup.Item value="pickup">방문수령</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

describe("RadioGroup", () => {
  it("클릭하면 해당 항목만 선택된다 (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="standard" />);

    const standard = screen.getByRole("radio", { name: "일반배송" }) as HTMLInputElement;
    const express = screen.getByRole("radio", { name: "빠른배송" }) as HTMLInputElement;
    expect(standard.checked).toBe(true);

    await user.click(express);
    expect(express.checked).toBe(true);
    expect(standard.checked).toBe(false);
  });

  it("label 텍스트 클릭으로도 선택된다 (label 래핑 구조)", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(screen.getByText("방문수령"));
    expect((screen.getByRole("radio", { name: "방문수령" }) as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("세로 orientation: 위/아래 화살표로 이동+선택, 좌/우는 무시", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="standard" orientation="vertical" />);

    const standard = screen.getByRole("radio", { name: "일반배송" }) as HTMLInputElement;
    const express = screen.getByRole("radio", { name: "빠른배송" }) as HTMLInputElement;

    standard.focus();
    await user.keyboard("{ArrowRight}");
    expect(standard.checked).toBe(true);

    await user.keyboard("{ArrowDown}");
    expect(express.checked).toBe(true);

    await user.keyboard("{ArrowUp}");
    expect(standard.checked).toBe(true);
  });

  it("가로 orientation: 좌/우 화살표로 이동+선택, 위/아래는 무시", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="standard" orientation="horizontal" />);

    const standard = screen.getByRole("radio", { name: "일반배송" }) as HTMLInputElement;
    const express = screen.getByRole("radio", { name: "빠른배송" }) as HTMLInputElement;

    standard.focus();
    await user.keyboard("{ArrowDown}");
    expect(standard.checked).toBe(true);

    await user.keyboard("{ArrowRight}");
    expect(express.checked).toBe(true);

    await user.keyboard("{ArrowLeft}");
    expect(standard.checked).toBe(true);
  });

  it("disabled 항목은 화살표 이동에서 건너뛴다", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="플랜" defaultValue="a">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b" disabled>
          B
        </RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const a = screen.getByRole("radio", { name: "A" }) as HTMLInputElement;
    const c = screen.getByRole("radio", { name: "C" }) as HTMLInputElement;

    a.focus();
    await user.keyboard("{ArrowDown}");
    expect(c.checked).toBe(true);
  });

  it("disabled 항목은 클릭해도 선택되지 않는다", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup.Root aria-label="플랜">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b" disabled>
          B
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const b = screen.getByRole("radio", { name: "B" }) as HTMLInputElement;
    await user.click(b);
    expect(b.checked).toBe(false);
  });

  it("Root disabled면 모든 항목이 비활성화된다", () => {
    render(<Basic disabled />);
    for (const radio of screen.getAllByRole("radio")) {
      expect((radio as HTMLInputElement).disabled).toBe(true);
    }
  });

  it("모든 항목이 같은 name을 공유한다 (자동 생성 name)", () => {
    render(<Basic />);
    const names = screen.getAllByRole("radio").map((el) => (el as HTMLInputElement).name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).toBeTruthy();
  });

  it("controlled: value·onValueChange로 상태를 소유할 수 있다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = React.useState("standard");
      return (
        <Basic
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Controlled />);
    const express = screen.getByRole("radio", { name: "빠른배송" }) as HTMLInputElement;

    await user.click(express);
    expect(onValueChange).toHaveBeenCalledWith("express");
    expect(express.checked).toBe(true);
  });

  it("controlled: 값을 undefined로 되돌리면 선택이 해제된다", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = React.useState<string | undefined>(undefined);
      return (
        <>
          <Basic value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue(undefined)}>
            지우기
          </button>
        </>
      );
    }

    render(<Controlled />);
    const standard = screen.getByRole("radio", { name: "일반배송" }) as HTMLInputElement;

    await user.click(standard);
    expect(standard.checked).toBe(true);

    await user.click(screen.getByRole("button", { name: "지우기" }));
    expect(standard.checked).toBe(false);
  });
});

describe("RadioGroup Field 연동", () => {
  // Field.Label의 htmlFor·aria는 개별 radio가 아니라 그룹이 받는다 (RadioGroup.tsx 주석 참고).
  function WithField() {
    return (
      <Field.Root>
        <Field.Label>배송 방법</Field.Label>
        <RadioGroup.Root>
          <RadioGroup.Item value="standard">일반배송</RadioGroup.Item>
          <RadioGroup.Item value="express">빠른배송</RadioGroup.Item>
        </RadioGroup.Root>
        <Field.ErrorMessage>하나를 골라주세요.</Field.ErrorMessage>
      </Field.Root>
    );
  }

  it("그룹 id가 Field.Label의 htmlFor와 맞는다", () => {
    render(<WithField />);
    expect(screen.getByText("배송 방법").getAttribute("for")).toBe(
      screen.getByRole("radiogroup").id,
    );
  });

  it("ErrorMessage가 그룹의 aria-invalid·aria-describedby에 걸린다", () => {
    render(<WithField />);
    const group = screen.getByRole("radiogroup");

    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(group.getAttribute("aria-describedby")).toBe(
      screen.getByText("하나를 골라주세요.").id,
    );
  });

  it("Field.Label이 그룹의 접근 이름이 된다", () => {
    // `<label for>`는 labelable 요소만 연결하므로 div인 그룹에는 안 걸린다 —
    // aria-labelledby로 참조해야 스크린리더가 이름을 읽는다.
    render(<WithField />);
    expect(screen.getByRole("radiogroup", { name: "배송 방법" })).toBeTruthy();
  });

  it("직접 준 aria-labelledby가 Field.Label보다 우선한다", () => {
    render(
      <Field.Root>
        <Field.Label>배송 방법</Field.Label>
        <span id="custom-label">직접 지정</span>
        <RadioGroup.Root aria-labelledby="custom-label">
          <RadioGroup.Item value="standard">일반배송</RadioGroup.Item>
        </RadioGroup.Root>
      </Field.Root>,
    );
    expect(screen.getByRole("radiogroup", { name: "직접 지정" })).toBeTruthy();
  });

  it("Field 밖에서는 자체 id를 쓰고 invalid가 false다", () => {
    render(<Basic />);
    const group = screen.getByRole("radiogroup");

    expect(group.id).toBeTruthy();
    expect(group.getAttribute("aria-invalid")).toBe("false");
  });
});

describe("RadioGroup segmented variant", () => {
  function Segmented(props: Partial<React.ComponentProps<typeof RadioGroup.Root>>) {
    return (
      <RadioGroup.Root variant="segmented" aria-label="테마 선택" defaultValue="light" {...props}>
        <RadioGroup.Item value="light">라이트</RadioGroup.Item>
        <RadioGroup.Item value="dark">다크</RadioGroup.Item>
        <RadioGroup.Item value="system">시스템</RadioGroup.Item>
      </RadioGroup.Root>
    );
  }

  it("variant='segmented'면 세그먼트 클래스와 size_medium 기본 클래스를 갖는다", () => {
    render(<Segmented />);
    const group = screen.getByRole("radiogroup");

    expect(group.classList.contains("dds-radio-group--variant_segmented")).toBe(true);
    expect(group.classList.contains("dds-radio-group--size_medium")).toBe(true);
  });

  it("size small과 large에 대응하는 클래스를 갖는다", () => {
    const { rerender } = render(<Segmented size="small" />);
    const group = screen.getByRole("radiogroup");
    expect(group.classList.contains("dds-radio-group--size_small")).toBe(true);

    rerender(<Segmented size="large" />);
    expect(group.classList.contains("dds-radio-group--size_large")).toBe(true);
  });

  it("default variant는 size prop을 무시하여 size 클래스가 붙지 않는다", () => {
    render(<RadioGroup.Root aria-label="테마" size="small" />);
    const group = screen.getByRole("radiogroup");
    expect(group.classList.contains("dds-radio-group--size_small")).toBe(false);
    expect(group.classList.contains("dds-radio-group--size_medium")).toBe(false);
  });

  it("segmented는 orientation='vertical'을 전달해도 horizontal로 강제된다", async () => {
    const user = userEvent.setup();
    render(<Segmented orientation="vertical" defaultValue="light" />);
    const group = screen.getByRole("radiogroup");

    expect(group.getAttribute("aria-orientation")).toBe("horizontal");
    expect(group.classList.contains("dds-radio-group--orientation_horizontal")).toBe(true);

    const light = screen.getByRole("radio", { name: "라이트" }) as HTMLInputElement;
    const dark = screen.getByRole("radio", { name: "다크" }) as HTMLInputElement;

    light.focus();
    // vertical 키(ArrowDown)는 무시됨
    await user.keyboard("{ArrowDown}");
    expect(light.checked).toBe(true);

    // horizontal 키(ArrowRight)로 이동+선택
    await user.keyboard("{ArrowRight}");
    expect(dark.checked).toBe(true);
  });

  it("클릭으로 선택을 이동하고 data-state를 갱신한다", async () => {
    const user = userEvent.setup();
    render(<Segmented defaultValue="light" />);

    const dark = screen.getByRole("radio", { name: "다크" }) as HTMLInputElement;
    const darkLabel = dark.closest("label");
    const light = screen.getByRole("radio", { name: "라이트" }) as HTMLInputElement;
    const lightLabel = light.closest("label");

    expect(lightLabel?.getAttribute("data-state")).toBe("checked");
    expect(darkLabel?.getAttribute("data-state")).toBe("unchecked");

    await user.click(dark);
    expect(dark.checked).toBe(true);
    expect(darkLabel?.getAttribute("data-state")).toBe("checked");
    expect(lightLabel?.getAttribute("data-state")).toBe("unchecked");
  });
});
