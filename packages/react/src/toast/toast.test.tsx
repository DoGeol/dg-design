import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toast, useToast, type ToastOptions } from "./Toast";

function Trigger({ options, label = "띄우기" }: { options: ToastOptions; label?: string }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast(options)}>
      {label}
    </button>
  );
}

/** 클릭할 때마다 서로 다른 제목의 토스트를 쌓는다. */
function Spammer() {
  const toast = useToast();
  const count = React.useRef(0);
  return (
    <button
      type="button"
      onClick={() => {
        count.current += 1;
        toast({ title: `알림 ${count.current}` });
      }}
    >
      띄우기
    </button>
  );
}

function renderWithProvider(children: React.ReactNode) {
  return render(<Toast.Provider>{children}</Toast.Provider>);
}

describe("Toast 기본", () => {
  it("훅 호출로 토스트가 뜬다", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Trigger options={{ title: "저장했다", description: "변경분 3건" }} />);

    expect(screen.queryByText("저장했다")).toBeNull();
    await user.click(screen.getByRole("button", { name: "띄우기" }));

    expect(screen.getByText("저장했다")).toBeTruthy();
    expect(screen.getByText("변경분 3건")).toBeTruthy();
  });

  it("닫기 버튼으로 사라진다", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Trigger options={{ title: "저장했다" }} />);

    await user.click(screen.getByRole("button", { name: "띄우기" }));
    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByText("저장했다")).toBeNull();
  });

  it("최대 개수를 넘기면 오래된 것부터 밀려난다", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Spammer />);

    const trigger = screen.getByRole("button", { name: "띄우기" });
    for (let i = 0; i < 4; i += 1) await user.click(trigger);

    expect(screen.queryByText("알림 1")).toBeNull();
    expect(screen.getByText("알림 2")).toBeTruthy();
    expect(screen.getByText("알림 3")).toBeTruthy();
    expect(screen.getByText("알림 4")).toBeTruthy();
  });

  it("max로 최대 개수를 바꾼다", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider max={1}>
        <Spammer />
      </Toast.Provider>,
    );

    const trigger = screen.getByRole("button", { name: "띄우기" });
    await user.click(trigger);
    await user.click(trigger);

    expect(screen.queryByText("알림 1")).toBeNull();
    expect(screen.getByText("알림 2")).toBeTruthy();
  });

  it("Provider 밖에서 useToast를 부르면 에러", () => {
    // React가 렌더 예외를 콘솔에도 뱉는다 — 테스트 출력만 조용히 시킨다.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger options={{ title: "무" }} />)).toThrow(/Toast\.Provider/);
    spy.mockRestore();
  });
});

describe("Toast live region", () => {
  it("critical은 alert, 나머지 intent는 status", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <>
        <Trigger options={{ intent: "critical", title: "실패" }} label="위험" />
        <Trigger options={{ intent: "positive", title: "성공" }} label="긍정" />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "위험" }));
    await user.click(screen.getByRole("button", { name: "긍정" }));

    expect(screen.getByRole("alert").textContent).toContain("실패");
    expect(screen.getByRole("status").textContent).toContain("성공");
    // aria-live는 얹지 않는다 — role이 politeness를 이미 갖는다.
    expect(screen.getByRole("alert").getAttribute("aria-live")).toBeNull();
  });
});

describe("Toast 자동 닫힘", () => {
  beforeEach(() => {
    // shouldAdvanceTime이 없으면 user-event가 기다리는 프라미스가 가짜 시계에 갇혀 안 풀린다.
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // delay: null이 없으면 user-event의 이벤트 간 대기가 가짜 타이머에 걸려 영원히 안 풀린다.
  function setupUser() {
    return userEvent.setup({ delay: null, advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
  }

  it("지정 시간이 지나면 스스로 사라진다", async () => {
    const user = setupUser();
    renderWithProvider(<Trigger options={{ title: "저장했다" }} />);

    await user.click(screen.getByRole("button", { name: "띄우기" }));
    expect(screen.getByText("저장했다")).toBeTruthy();

    // shouldAdvanceTime 때문에 실제 경과 시간도 시계에 더해진다 — 경계 1ms를 재지 않는다.
    act(() => void vi.advanceTimersByTime(4000));
    expect(screen.getByText("저장했다")).toBeTruthy();

    act(() => void vi.advanceTimersByTime(1500));
    expect(screen.queryByText("저장했다")).toBeNull();
  });

  it("hover 중에는 타이머가 멈추고, 벗어나면 다시 흐른다", async () => {
    const user = setupUser();
    renderWithProvider(<Trigger options={{ title: "저장했다" }} />);

    await user.click(screen.getByRole("button", { name: "띄우기" }));
    const toast = screen.getByRole("status");

    await user.hover(toast);
    act(() => void vi.advanceTimersByTime(20000));
    expect(screen.getByText("저장했다")).toBeTruthy();

    await user.unhover(toast);
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.queryByText("저장했다")).toBeNull();
  });

  it("포커스 중에는 타이머가 멈춘다", async () => {
    const user = setupUser();
    renderWithProvider(<Trigger options={{ title: "저장했다" }} />);

    await user.click(screen.getByRole("button", { name: "띄우기" }));
    act(() => void screen.getByRole("button", { name: "닫기" }).focus());

    act(() => void vi.advanceTimersByTime(20000));
    expect(screen.getByText("저장했다")).toBeTruthy();
  });
});

describe("Toast.View", () => {
  it("Provider 없이 그려지고 intent별 role을 단다", () => {
    render(
      <>
        <Toast.View title="저장했다" description="변경분" />
        <Toast.View intent="critical" title="실패" />
      </>,
    );

    expect(screen.getByRole("status").textContent).toContain("저장했다");
    expect(screen.getByRole("alert").textContent).toContain("실패");
    expect(screen.getByRole("status").classList.contains("dds-toast--intent_neutral")).toBe(true);
  });

  it("onClose가 있을 때만 닫기 버튼을 그리고 클릭하면 호출한다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<Toast.View title="a" />);
    expect(screen.queryByRole("button")).toBeNull();

    rerender(<Toast.View title="a" onClose={onClose} closeLabel="close" />);
    await user.click(screen.getByRole("button", { name: "close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("live={false}면 role이 없고 action 슬롯을 그린다", () => {
    render(<Toast.View live={false} title="a" action={<a href="/undo">되돌리기</a>} />);

    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByRole("link", { name: "되돌리기" }).parentElement?.className).toBe(
      "dds-toast__action",
    );
  });
});

describe("Toast action", () => {
  it("action 버튼을 누르면 onClick이 한 번 불리고 그 토스트가 닫힌다", async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    renderWithProvider(
      <Trigger options={{ title: "보관함으로 옮겼습니다", action: { label: "되돌리기", onClick: undo } }} />,
    );
    await user.click(screen.getByRole("button", { name: "띄우기" }));
    await user.click(screen.getByRole("button", { name: "되돌리기" }));

    expect(undo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("보관함으로 옮겼습니다")).toBeNull();
  });

  it("action이 없으면 행동 버튼을 그리지 않는다", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Trigger options={{ title: "저장했다" }} />);
    await user.click(screen.getByRole("button", { name: "띄우기" }));
    expect(screen.getAllByRole("button").map((b) => b.textContent)).not.toContain("되돌리기");
    expect(document.querySelector(".dds-toast__action")).toBeNull();
  });
});
