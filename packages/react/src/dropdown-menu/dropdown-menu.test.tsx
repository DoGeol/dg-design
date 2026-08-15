import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "../dialog/Dialog";
import { DropdownMenu } from "./DropdownMenu";

function Basic(
  props: React.ComponentProps<typeof DropdownMenu.Root> & { onSelect?: () => void } = {},
) {
  const { onSelect, ...rootProps } = props;
  return (
    <DropdownMenu.Root {...rootProps}>
      <DropdownMenu.Trigger>메뉴</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>작업</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={onSelect}>복사</DropdownMenu.Item>
        <DropdownMenu.Item disabled>붙여넣기</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>삭제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

const items = () => screen.getAllByRole("menuitem");

describe("DropdownMenu 상태", () => {
  it("uncontrolled: 트리거 클릭으로 열리고 재클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "메뉴" });

    expect(screen.queryByRole("menu")).toBeNull();
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeTruthy();

    await user.click(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("controlled: open prop이 진실이고 onOpenChange만 통지한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Basic open={false} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "메뉴" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).toBeNull();

    rerender(<Basic open onOpenChange={onOpenChange} />);
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("ESC로 닫히고 트리거로 포커스가 돌아간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "메뉴" });

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("바깥 클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.click(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("다른 메뉴가 열리면 먼저 열린 메뉴가 닫힌다", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>첫째</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>가</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>둘째</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>나</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "첫째" }));
    expect(screen.getByRole("menu", { name: "첫째" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "둘째" }));
    expect(screen.getByRole("menu", { name: "둘째" })).toBeTruthy();
    expect(screen.queryByRole("menu", { name: "첫째" })).toBeNull();
  });
});

describe("DropdownMenu roving tabindex", () => {
  it("열리면 첫 항목이 포커스와 tabIndex 0을 갖는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "메뉴" }));

    const first = screen.getByRole("menuitem", { name: "복사" });
    expect(document.activeElement).toBe(first);
    expect(first.tabIndex).toBe(0);
  });

  it("화살표가 순환하고 disabled 항목을 건너뛴다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    // disabled인 "붙여넣기"는 목록에서 빠져 복사 ↔ 삭제 두 개만 순환한다.
    expect(items().map((item) => item.textContent)).toEqual(["복사", "붙여넣기", "삭제"]);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "삭제" }));

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "복사" }));

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "삭제" }));
  });

  it("Home/End가 처음·마지막 항목으로 간다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "삭제" }));

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "복사" }));
  });

  it("포커스를 받은 항목만 tabIndex 0으로 남는다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "삭제" }).tabIndex).toBe(0);
    expect(screen.getByRole("menuitem", { name: "복사" }).tabIndex).toBe(-1);
  });
});

describe("DropdownMenu 선택", () => {
  it("Enter로 선택하면 onSelect 호출 후 닫히고 트리거로 복귀한다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: "메뉴" });

    await user.click(trigger);
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("클릭으로도 선택되고 닫힌다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic defaultOpen onSelect={onSelect} />);

    await user.click(screen.getByRole("menuitem", { name: "복사" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("Space로도 선택된다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic defaultOpen onSelect={onSelect} />);

    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe("DropdownMenu 비모달", () => {
  it("열려도 배경 inert도 스크롤 잠금도 없다", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    const { baseElement } = render(<Basic />);
    const rtlContainer = baseElement.firstElementChild as HTMLElement;

    await user.click(screen.getByRole("button", { name: "메뉴" }));
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(rtlContainer.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");

    document.body.style.overflow = "";
  });

  it("Dialog 안에서 열면 메뉴 컨테이너는 inert가 아니고 ESC 1회에 메뉴만 닫힌다", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="다이얼로그">
          <Basic />
        </Dialog.Content>
      </Dialog.Root>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴" }));
    const menuContainer = screen.getByRole("menu").parentElement as HTMLElement;
    expect(menuContainer.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("dialog", { name: "다이얼로그" })).toBeTruthy();
  });
});

describe("DropdownMenu aria", () => {
  it("트리거와 메뉴가 aria로 연결된다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "메뉴" });

    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu").getAttribute("aria-labelledby")).toBe(trigger.id);
    expect(items()).toHaveLength(3);
  });
});
