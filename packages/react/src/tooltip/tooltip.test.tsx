import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "./Tooltip";

function Basic(props: Partial<React.ComponentProps<typeof Tooltip.Root>> = {}) {
  return (
    <Tooltip.Root {...props}>
      <Tooltip.Trigger>버튼</Tooltip.Trigger>
      <Tooltip.Content>도움말</Tooltip.Content>
    </Tooltip.Root>
  );
}

const trigger = (name = "버튼") => screen.getByRole("button", { name });
const tooltip = () => screen.queryByRole("tooltip");

/** vi.advanceTimersByTime은 act로 감싸지 않으면 상태 갱신이 경고 없이 유실된다. */
const advance = (ms: number) => {
  React.act(() => {
    vi.advanceTimersByTime(ms);
  });
};

afterEach(() => {
  vi.useRealTimers();
});

describe("Tooltip 지연", () => {
  it("hover 진입 후 openDelay 경과 전에는 열리지 않고, 경과하면 열린다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={700} />);

    fireEvent.mouseEnter(trigger());
    advance(699);
    expect(tooltip()).toBeNull();

    advance(1);
    expect(tooltip()).toBeTruthy();
  });

  it("hover 이탈 후 closeDelay가 경과해야 닫힌다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={0} closeDelay={150} />);

    fireEvent.mouseEnter(trigger());
    expect(tooltip()).toBeTruthy();

    fireEvent.mouseLeave(trigger());
    advance(149);
    expect(tooltip()).toBeTruthy();

    advance(1);
    expect(tooltip()).toBeNull();
  });

  it("Provider 그룹: 하나가 열려 있으면 인접 트리거는 지연 없이 연다", () => {
    vi.useFakeTimers();
    render(
      <Tooltip.Provider>
        <Tooltip.Root openDelay={700}>
          <Tooltip.Trigger>하나</Tooltip.Trigger>
          <Tooltip.Content>첫 도움말</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root openDelay={700}>
          <Tooltip.Trigger>둘</Tooltip.Trigger>
          <Tooltip.Content>둘째 도움말</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    fireEvent.mouseEnter(trigger("하나"));
    advance(700);
    expect(screen.getByText("첫 도움말")).toBeTruthy();

    fireEvent.mouseLeave(trigger("하나"));
    fireEvent.mouseEnter(trigger("둘"));
    // openDelay·closeDelay 어느 쪽도 advance하지 않았는데 즉시 열려야 그룹 스킵이 맞다.
    expect(screen.getByText("둘째 도움말")).toBeTruthy();
  });

  it("떠난 툴팁의 closeDelay가 끝나도, 다른 툴팁이 열려 있으면 스킵이 유지된다", () => {
    // 떠나는 쪽의 onClose가 그룹 상태를 안 보고 유예를 시작하면 열린 채로 스킵이 풀려
    // 다음 트리거가 openDelay를 전부 다시 기다리게 된다.
    vi.useFakeTimers();
    render(
      <Tooltip.Provider skipDelayDuration={300}>
        {["하나", "둘", "셋"].map((name) => (
          <Tooltip.Root key={name} openDelay={700} closeDelay={150}>
            <Tooltip.Trigger>{name}</Tooltip.Trigger>
            <Tooltip.Content>{`${name} 도움말`}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </Tooltip.Provider>,
    );

    fireEvent.mouseEnter(trigger("하나"));
    advance(700);
    fireEvent.mouseLeave(trigger("하나"));
    fireEvent.mouseEnter(trigger("둘"));
    expect(screen.getByText("둘 도움말")).toBeTruthy();

    // "하나"의 closeDelay(150)와 유예(300)가 전부 지나도 "둘"은 아직 열려 있다.
    advance(500);
    expect(screen.getByText("둘 도움말")).toBeTruthy();

    fireEvent.mouseLeave(trigger("둘"));
    fireEvent.mouseEnter(trigger("셋"));
    expect(screen.getByText("셋 도움말")).toBeTruthy();
  });

  it("열리기 전에 이탈하면 그룹 스킵이 깨지지 않는다", () => {
    // openDelay 중 이탈은 열린 적이 없으므로 그룹의 열림 수를 깎으면 안 된다.
    vi.useFakeTimers();
    render(
      <Tooltip.Provider skipDelayDuration={300}>
        {["하나", "둘", "셋"].map((name) => (
          <Tooltip.Root key={name} openDelay={700} closeDelay={150}>
            <Tooltip.Trigger>{name}</Tooltip.Trigger>
            <Tooltip.Content>{`${name} 도움말`}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </Tooltip.Provider>,
    );

    fireEvent.mouseEnter(trigger("하나"));
    advance(700);
    expect(screen.getByText("하나 도움말")).toBeTruthy();

    // "둘"에 잠깐 들렀다 openDelay 전에 나온다 — 열린 적 없다.
    fireEvent.mouseEnter(trigger("둘"));
    fireEvent.mouseLeave(trigger("둘"));
    advance(500);

    fireEvent.mouseEnter(trigger("셋"));
    expect(screen.getByText("셋 도움말")).toBeTruthy();
  });

  it("Provider 없이는 그룹 스킵이 없다 — 인접 트리거도 openDelay를 전부 기다린다", () => {
    vi.useFakeTimers();
    render(
      <>
        <Tooltip.Root openDelay={700}>
          <Tooltip.Trigger>하나</Tooltip.Trigger>
          <Tooltip.Content>첫 도움말</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root openDelay={700}>
          <Tooltip.Trigger>둘</Tooltip.Trigger>
          <Tooltip.Content>둘째 도움말</Tooltip.Content>
        </Tooltip.Root>
      </>,
    );

    fireEvent.mouseEnter(trigger("하나"));
    advance(700);
    expect(screen.getByText("첫 도움말")).toBeTruthy();

    fireEvent.mouseLeave(trigger("하나"));
    fireEvent.mouseEnter(trigger("둘"));
    expect(screen.queryByText("둘째 도움말")).toBeNull();

    advance(700);
    expect(screen.getByText("둘째 도움말")).toBeTruthy();
  });

  it("unmount 시 대기 중인 타이머를 정리한다(act 경고 없음)", () => {
    vi.useFakeTimers();
    const onError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<Basic openDelay={700} />);

    fireEvent.mouseEnter(trigger());
    unmount();
    advance(700);

    expect(onError).not.toHaveBeenCalled();
    onError.mockRestore();
  });
});

describe("Tooltip 트리거", () => {
  it("focus로 열리고(탭 포커스 포함) blur로 즉시 닫힌다", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Basic openDelay={700} />);

    await user.tab();
    expect(document.activeElement).toBe(trigger());
    advance(700);
    expect(tooltip()).toBeTruthy();

    await user.tab();
    expect(tooltip()).toBeNull();
  });

  it("aria-describedby는 열려 있을 때만 연결된다", () => {
    vi.useFakeTimers();
    render(<Basic openDelay={0} />);
    expect(trigger().getAttribute("aria-describedby")).toBeNull();

    fireEvent.mouseEnter(trigger());
    const describedBy = trigger().getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toBe(tooltip());
  });

  it("ESC로 즉시 닫힌다(스택 미등록 — 자체 리스너)", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Basic openDelay={0} />);

    fireEvent.mouseEnter(trigger());
    expect(tooltip()).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(tooltip()).toBeNull();
  });
});
