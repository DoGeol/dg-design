import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ContextMenu } from "../context-menu/ContextMenu";
import { DropdownMenu } from "./DropdownMenu";

function Settings({ onGrid, onSort }: { onGrid?: (v: boolean) => void; onSort?: (v: string) => void }) {
  const [grid, setGrid] = React.useState(false);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>보기</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          checked={grid}
          onCheckedChange={(v) => {
            setGrid(v);
            onGrid?.(v);
          }}
        >
          격자 보기
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.Label id="sort-label">정렬</DropdownMenu.Label>
        <DropdownMenu.RadioGroup aria-labelledby="sort-label" defaultValue="recent" onValueChange={onSort}>
          <DropdownMenu.RadioItem value="recent">최근 순</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="name">이름 순</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="size" disabled>
            크기 순
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Item>닫기</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe("DropdownMenu.CheckboxItem", () => {
  it("menuitemcheckbox + aria-checked가 상태를 따르고, 눌러도 메뉴가 열려 있다", async () => {
    const user = userEvent.setup();
    const onGrid = vi.fn();
    render(<Settings onGrid={onGrid} />);
    await user.click(screen.getByRole("button", { name: "보기" }));

    const item = screen.getByRole("menuitemcheckbox", { name: "격자 보기" });
    expect(item.getAttribute("aria-checked")).toBe("false");
    await user.click(item);
    expect(onGrid).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("menuitemcheckbox", { name: "격자 보기" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("비제어 defaultChecked도 토글된다", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>보기</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem defaultChecked>미리보기</DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const item = screen.getByRole("menuitemcheckbox");
    expect(item.getAttribute("aria-checked")).toBe("true");
    await user.click(item);
    expect(item.getAttribute("aria-checked")).toBe("false");
  });

  it("화살표 이동이 체크·라디오 항목을 일반 항목과 함께 훑고 disabled는 건너뛴다", async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await user.click(screen.getByRole("button", { name: "보기" }));
    expect(document.activeElement).toBe(screen.getByRole("menuitemcheckbox"));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitemradio", { name: "최근 순" }));
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "닫기" }));
  });
});

describe("DropdownMenu.RadioGroup·RadioItem", () => {
  it("group 안의 menuitemradio 하나만 checked이고, 고르면 바뀌며 메뉴가 열려 있다", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<Settings onSort={onSort} />);
    await user.click(screen.getByRole("button", { name: "보기" }));

    expect(screen.getByRole("group", { name: "정렬" })).toBeTruthy();
    const name = screen.getByRole("menuitemradio", { name: "이름 순" });
    await user.click(name);
    expect(onSort).toHaveBeenCalledWith("name");
    expect(name.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("menuitemradio", { name: "최근 순" }).getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("disabled 라디오는 골라지지 않는다", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<Settings onSort={onSort} />);
    await user.click(screen.getByRole("button", { name: "보기" }));
    await user.click(screen.getByRole("menuitemradio", { name: "크기 순" }));
    expect(onSort).not.toHaveBeenCalled();
  });

  it("일반 Item은 여전히 메뉴를 닫는다", async () => {
    const user = userEvent.setup();
    render(<Settings />);
    await user.click(screen.getByRole("button", { name: "보기" }));
    await user.click(screen.getByRole("menuitem", { name: "닫기" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("ContextMenu 체크·라디오 항목", () => {
  it("같은 항목을 ContextMenu에서도 쓴다", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>영역</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem defaultChecked={false}>잠금</ContextMenu.CheckboxItem>
          <ContextMenu.RadioGroup aria-label="크기" defaultValue="s">
            <ContextMenu.RadioItem value="s">작게</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="l">크게</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    await user.pointer({ keys: "[MouseRight]", target: screen.getByText("영역") });
    await user.click(screen.getByRole("menuitemcheckbox", { name: "잠금" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "잠금" }).getAttribute("aria-checked")).toBe("true");
    await user.click(screen.getByRole("menuitemradio", { name: "크게" }));
    expect(screen.getByRole("menuitemradio", { name: "크게" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
  });
});
