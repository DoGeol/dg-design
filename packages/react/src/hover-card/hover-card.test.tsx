import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HoverCard } from "./HoverCard";

function Basic(props: Partial<React.ComponentProps<typeof HoverCard.Root>> = {}) {
  return (
    <HoverCard.Root {...props}>
      <HoverCard.Trigger href="#">링크</HoverCard.Trigger>
      <HoverCard.Content>프리뷰</HoverCard.Content>
    </HoverCard.Root>
  );
}

const trigger = (name = "링크") => screen.getByRole("link", { name });
const content = () => screen.queryByText("프리뷰");
/** Content 루트(mouseenter/leave를 직접 쏘려면 텍스트 노드가 아니라 컨테이너가 필요하다). */
const contentEl = () => screen.getByText("프리뷰").closest(".dds-hover-card__content") as HTMLElement;

/** vi.advanceTimersByTime은 act로 감싸지 않으면 상태 갱신이 경고 없이 유실된다. */
const advance = (ms: number) => {
  React.act(() => {
    vi.advanceTimersByTime(ms);
  });
};

afterEach(() => {
  vi.useRealTimers();
});

describe("HoverCard 지연", () => {
  it("hover 진입 후 openDelay 경과 전에는 열리지 않고, 경과하면 열린다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={700} />);

    fireEvent.mouseEnter(trigger());
    advance(699);
    expect(content()).toBeNull();

    advance(1);
    expect(content()).toBeTruthy();
  });

  it("hover 이탈 후 closeDelay가 경과해야 닫힌다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={0} closeDelay={300} />);

    fireEvent.mouseEnter(trigger());
    expect(content()).toBeTruthy();

    fireEvent.mouseLeave(trigger());
    advance(299);
    expect(content()).toBeTruthy();

    advance(1);
    expect(content()).toBeNull();
  });
});

describe("HoverCard 정체성 — 콘텐츠 hover 유지", () => {
  it("트리거 이탈 후 closeDelay 안에 콘텐츠로 진입하면 닫힘이 취소되고, 콘텐츠 이탈 후에는 다시 닫힌다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={0} closeDelay={300} />);

    fireEvent.mouseEnter(trigger());
    expect(content()).toBeTruthy();

    fireEvent.mouseLeave(trigger());
    advance(200); // closeDelay(300) 안
    fireEvent.mouseEnter(contentEl());
    advance(200); // 트리거 이탈로부터 400ms 경과 — 취소되지 않았다면 이미 닫혔을 시점
    expect(content()).toBeTruthy();

    fireEvent.mouseLeave(contentEl());
    advance(300);
    expect(content()).toBeNull();
  });
});

describe("HoverCard 트리거", () => {
  it("포커스로는 열리지 않는다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={0} />);

    fireEvent.focus(trigger());
    advance(1000);
    expect(content()).toBeNull();
  });

  it("ESC로 즉시 닫힌다(비모달 스택 등록)", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Basic openDelay={0} />);

    fireEvent.mouseEnter(trigger());
    expect(content()).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(content()).toBeNull();
  });

  it("열려도 포커스를 옮기지 않는다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={0} />);
    const activeBefore = document.activeElement;

    fireEvent.mouseEnter(trigger());
    expect(content()).toBeTruthy();
    expect(document.activeElement).toBe(activeBefore);
    expect(document.activeElement).not.toBe(contentEl());
  });
});
