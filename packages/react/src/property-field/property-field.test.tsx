import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Popover } from "../popover/Popover";
import { Select } from "../select/Select";
import { PropertyField } from "./PropertyField";

function PublishSettings({ timeError }: { timeError?: string }) {
  return (
    <PropertyField.Group aria-label="발행 설정">
      <PropertyField.Root>
        <PropertyField.Label>공개 범위</PropertyField.Label>
        <Select.Root defaultValue="link">
          <Select.Trigger />
          <Select.Content>
            <Select.Option value="public">전체 공개</Select.Option>
            <Select.Option value="link">링크가 있는 사람</Select.Option>
          </Select.Content>
        </Select.Root>
      </PropertyField.Root>
      <PropertyField.Root>
        <PropertyField.Label>발행 시각</PropertyField.Label>
        <Popover.Root>
          <Popover.Trigger asChild>
            <PropertyField.Trigger placeholder="선택">{timeError ? undefined : "10월 9일 09:00"}</PropertyField.Trigger>
          </Popover.Trigger>
          <Popover.Content aria-label="발행 시각 고르기">달력</Popover.Content>
        </Popover.Root>
        <PropertyField.Description>예약 발행은 한국 시간 기준</PropertyField.Description>
        {timeError && <PropertyField.ErrorMessage>{timeError}</PropertyField.ErrorMessage>}
      </PropertyField.Root>
    </PropertyField.Group>
  );
}

describe("PropertyField", () => {
  it("Group은 이름 있는 group이다", () => {
    render(<PublishSettings />);
    expect(screen.getByRole("group", { name: "발행 설정" })).toBeTruthy();
  });

  it("Select형: 라벨이 combobox 이름이고 라벨을 누르면 열린다", async () => {
    const user = userEvent.setup();
    render(<PublishSettings />);
    const combobox = screen.getByRole("combobox", { name: "공개 범위" });
    await user.click(screen.getByText("공개 범위"));
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("Popover형: 이름은 라벨 + 현재 값이고 라벨을 누르면 열린다", async () => {
    const user = userEvent.setup();
    render(<PublishSettings />);
    const trigger = screen.getByRole("button", { name: "발행 시각 10월 9일 09:00" });
    await user.click(screen.getByText("발행 시각"));
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("group", { name: "발행 시각 고르기" })).toBeTruthy();
  });

  it("값이 없으면 placeholder를 보이고 이름에도 넣는다", () => {
    render(<PublishSettings timeError="발행 시각을 고르세요" />);
    expect(screen.getByRole("button", { name: "발행 시각 선택" })).toBeTruthy();
  });

  it("ErrorMessage가 있으면 트리거가 aria-invalid이고 설명과 오류가 describedby에 잇는다", () => {
    render(<PublishSettings timeError="발행 시각을 고르세요" />);
    const trigger = screen.getByRole("button", { name: /발행 시각/ });
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    const described = trigger.getAttribute("aria-describedby")?.split(" ") ?? [];
    const texts = described.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(expect.arrayContaining(["예약 발행은 한국 시간 기준", "발행 시각을 고르세요"]));
  });

  it("Select형도 ErrorMessage로 aria-invalid가 된다", () => {
    render(
      <PropertyField.Root>
        <PropertyField.Label>카테고리</PropertyField.Label>
        <Select.Root>
          <Select.Trigger placeholder="선택" />
          <Select.Content>
            <Select.Option value="a">디자인</Select.Option>
          </Select.Content>
        </Select.Root>
        <PropertyField.ErrorMessage>카테고리를 고르세요</PropertyField.ErrorMessage>
      </PropertyField.Root>,
    );
    expect(screen.getByRole("combobox", { name: "카테고리" }).getAttribute("aria-invalid")).toBe("true");
  });
});
