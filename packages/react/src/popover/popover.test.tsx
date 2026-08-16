import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { Select } from "../select/Select";
import { Popover } from "./Popover";

function Basic(props: React.ComponentProps<typeof Popover.Root> = {}) {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger>열기</Popover.Trigger>
      <Popover.Content aria-label="패널">
        <p>내용</p>
        <input aria-label="이름" />
      </Popover.Content>
    </Popover.Root>
  );
}

describe("Popover 상태", () => {
  it("uncontrolled: 트리거 클릭으로 열리고 재클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "열기" });

    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();
    await user.click(trigger);
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();

    await user.click(trigger);
    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();
  });

  it("controlled: open prop이 진실이고 onOpenChange만 통지한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Basic open={false} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();

    rerender(<Basic open onOpenChange={onOpenChange} />);
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
  });
});

describe("Popover 닫힘", () => {
  it("ESC로 닫히고 트리거로 포커스가 돌아간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "열기" });

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closeOnEscape=false면 ESC로 닫히지 않는다", async () => {
    const user = userEvent.setup();
    render(<Basic closeOnEscape={false} />);

    await user.click(screen.getByRole("button", { name: "열기" }));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
  });

  it("바깥 클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.click(document.body);
    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();
  });

  it("closeOnOutsideClick=false면 바깥 클릭으로 닫히지 않는다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen closeOnOutsideClick={false} />);

    await user.click(document.body);
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
  });
});

describe("Popover autoFocus", () => {
  it("기본값(true): 열리면 Content가 포커스를 받고 닫히면 트리거로 복귀한다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "열기" });

    await user.click(trigger);
    expect(document.activeElement).toBe(screen.getByRole("group", { name: "패널" }));

    await user.keyboard("{Escape}");
    expect(document.activeElement).toBe(trigger);
  });

  it("false면 열려도 포커스를 옮기지 않는다", async () => {
    const user = userEvent.setup();
    render(<Basic autoFocus={false} />);
    const trigger = screen.getByRole("button", { name: "열기" });

    await user.click(trigger);
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
    expect(document.activeElement).toBe(trigger);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();
    // 애초에 패널로 옮겨간 적이 없으니 복귀 로직도 트리거를 건드리지 않는다 — 그래도 자리는 그대로다.
    expect(document.activeElement).toBe(trigger);
  });
});

describe("Popover 비모달", () => {
  it("열려도 배경 inert도 스크롤 잠금도 없다", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    const { baseElement } = render(<Basic />);
    const rtlContainer = baseElement.firstElementChild as HTMLElement;

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
    expect(rtlContainer.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");

    document.body.style.overflow = "";
  });
});

describe("Popover 단일 열림", () => {
  it("DropdownMenu가 열리면 열려 있던 Popover가 닫힌다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Basic />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>메뉴</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>가</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "메뉴" }));
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.queryByRole("group", { name: "패널" })).toBeNull();
  });

  it("Popover가 열리면 열려 있던 DropdownMenu가 닫힌다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>메뉴</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>가</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Basic />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴" }));
    expect(screen.getByRole("menu")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

function NestedSelect({ placeholder }: { placeholder: string }) {
  return (
    <Select.Root>
      {/* combobox는 ARIA상 내용에서 이름을 못 얻는다 — 조회하려면 aria-label이 필요하다. */}
      <Select.Trigger placeholder={placeholder} aria-label={placeholder} />
      <Select.Content>
        <Select.Option value="a">가</Select.Option>
        <Select.Option value="b">나</Select.Option>
      </Select.Content>
    </Select.Root>
  );
}

describe("Popover 중첩", () => {
  it("Content 안의 Select를 열어도 Popover는 닫히지 않는다", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>열기</Popover.Trigger>
        <Popover.Content aria-label="패널">
          <NestedSelect placeholder="고르기" />
        </Popover.Content>
      </Popover.Root>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));
    await user.click(screen.getByRole("combobox", { name: "고르기" }));

    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
  });

  it("3단 중첩에서도 조상이 모두 살아 있다", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>바깥 열기</Popover.Trigger>
        <Popover.Content aria-label="바깥 패널">
          <Popover.Root>
            <Popover.Trigger>안쪽 열기</Popover.Trigger>
            <Popover.Content aria-label="안쪽 패널">
              <NestedSelect placeholder="고르기" />
            </Popover.Content>
          </Popover.Root>
        </Popover.Content>
      </Popover.Root>,
    );

    await user.click(screen.getByRole("button", { name: "바깥 열기" }));
    await user.click(screen.getByRole("button", { name: "안쪽 열기" }));
    await user.click(screen.getByRole("combobox", { name: "고르기" }));

    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.getByRole("group", { name: "안쪽 패널" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "바깥 패널" })).toBeTruthy();
  });

  it("Content 안에서도 형제끼리는 하나만 열린다", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>열기</Popover.Trigger>
        <Popover.Content aria-label="패널">
          <NestedSelect placeholder="첫째" />
          <NestedSelect placeholder="둘째" />
        </Popover.Content>
      </Popover.Root>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));
    await user.click(screen.getByRole("combobox", { name: "첫째" }));
    expect(screen.getAllByRole("listbox")).toHaveLength(1);

    await user.click(screen.getByRole("combobox", { name: "둘째" }));
    expect(screen.getAllByRole("listbox")).toHaveLength(1);
    expect(screen.getByRole("group", { name: "패널" })).toBeTruthy();
  });
});

describe("Popover aria", () => {
  it("트리거에 aria-expanded가 열림 상태를 따라간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "열기" });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });
});
