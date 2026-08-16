import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

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
});
