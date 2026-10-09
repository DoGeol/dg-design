import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Chip, FilterChip } from "./Chip";

function People({ initial = ["김도걸", "이수민", "박지원"] }: { initial?: string[] }) {
  const [names, setNames] = React.useState(initial);
  return (
    <div>
      {names.map((name) => (
        <Chip key={name} onRemove={() => setNames((prev) => prev.filter((n) => n !== name))} removeLabel={`${name} 제거`}>
          {name}
        </Chip>
      ))}
    </div>
  );
}

describe("Chip", () => {
  it("제거 버튼 이름은 removeLabel이고 칩 자체는 초점을 받지 않는다", () => {
    render(
      <Chip onRemove={() => {}} removeLabel="김도걸 제거">
        김도걸
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "김도걸 제거" })).toBeTruthy();
    expect(screen.getByText("김도걸").closest(".dds-chip")?.getAttribute("tabindex")).toBeNull();
  });

  it("onRemove 없으면 제거 버튼이 없다", () => {
    render(<Chip>태그</Chip>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("누르면 onRemove를 한 번 부른다", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Chip onRemove={onRemove} removeLabel="태그 제거">
        태그
      </Chip>,
    );
    await user.click(screen.getByRole("button", { name: "태그 제거" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("제거 뒤 초점이 다음 칩의 제거 버튼으로 간다", async () => {
    const user = userEvent.setup();
    render(<People />);
    await user.click(screen.getByRole("button", { name: "이수민 제거" }));
    expect(screen.queryByText("이수민")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "박지원 제거" }));
  });

  it("마지막 칩을 지우면 이전 칩의 제거 버튼으로 간다", async () => {
    const user = userEvent.setup();
    render(<People />);
    await user.click(screen.getByRole("button", { name: "박지원 제거" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "이수민 제거" }));
  });

  it("disabled면 제거되지 않는다", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Chip disabled onRemove={onRemove} removeLabel="태그 제거">
        태그
      </Chip>,
    );
    await user.click(screen.getByRole("button", { name: "태그 제거" }));
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("onRemove를 주면 removeLabel이 타입에서 필수다", () => {
    // @ts-expect-error removeLabel 누락
    render(<Chip onRemove={() => {}}>태그</Chip>);
  });
});

describe("FilterChip", () => {
  it("aria-pressed가 제어 상태를 따르고 onPressedChange가 다음 값을 받는다", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = React.useState(false);
      return (
        <FilterChip pressed={on} onPressedChange={setOn}>
          내 글
        </FilterChip>
      );
    }
    render(<Controlled />);
    const chip = screen.getByRole("button", { name: "내 글" });
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    await user.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
  });

  it("비제어 defaultPressed도 토글되고 켜지면 체크 아이콘이 붙는다", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <FilterChip defaultPressed onPressedChange={onPressedChange}>
        최근 수정
      </FilterChip>,
    );
    const chip = screen.getByRole("button", { name: "최근 수정" });
    expect(chip.querySelector(".dds-chip__check")).toBeTruthy();
    await user.click(chip);
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    expect(chip.querySelector(".dds-chip__check")).toBeNull();
  });

  it("disabled면 토글되지 않는다", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <FilterChip disabled onPressedChange={onPressedChange}>
        내 글
      </FilterChip>,
    );
    await user.click(screen.getByRole("button", { name: "내 글" }));
    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
