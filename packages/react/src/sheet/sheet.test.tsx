import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { getDialogStack } from "../internal/dialog-stack";
import { Sheet } from "./Sheet";
import type { SheetSide } from "./sheet-context";

function Basic(props: React.ComponentProps<typeof Sheet.Root>) {
  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>열기</Sheet.Trigger>
      <Sheet.Overlay data-testid="overlay" />
      <Sheet.Content>
        <Sheet.Title>제목</Sheet.Title>
        <Sheet.Close>닫기</Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>
  );
}

/** 바깥 시트의 Content 안에 또 하나를 여는 중첩 구조 — Dialog와 동일한 스택 규칙을 검증한다. */
function Nested() {
  return (
    <Sheet.Root defaultOpen>
      <Sheet.Overlay />
      <Sheet.Content aria-label="바깥">
        <Sheet.Root defaultOpen>
          <Sheet.Overlay />
          <Sheet.Content aria-label="안쪽" />
        </Sheet.Root>
      </Sheet.Content>
    </Sheet.Root>
  );
}

describe("Sheet side", () => {
  it.each<SheetSide>(["left", "right", "top", "bottom"])(
    "side=%s면 해당 방향의 클래스와 data-side를 단다",
    (side) => {
      const { unmount } = render(<Basic defaultOpen side={side} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).toContain(`dds-sheet--side_${side}`);
      expect(dialog.getAttribute("data-side")).toBe(side);
      unmount();
    },
  );

  it("side를 생략하면 기본값 right", () => {
    render(<Basic defaultOpen />);
    expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("right");
  });

  it("퇴장 애니메이션 동안에도 data-side/side 클래스를 유지한 채 data-state만 closed로 바뀐다 (스냅백 방지 — forwards 없으면 out keyframe이 side를 못 찾는다)", () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(
        <Sheet.Root open side="left">
          <Sheet.Content style={{ animationDuration: "200ms" }} />
        </Sheet.Root>,
      );
      rerender(
        <Sheet.Root open={false} side="left">
          <Sheet.Content style={{ animationDuration: "200ms" }} />
        </Sheet.Root>,
      );
      // 아직 퇴장 애니메이션 중 — 언마운트 전이라 side 클래스·data-side가 그대로여야
      // out keyframe(.dds-sheet--side_left[data-state="closed"])이 계속 매칭된다.
      const dialog = screen.getByRole("dialog");
      expect(dialog.getAttribute("data-state")).toBe("closed");
      expect(dialog.getAttribute("data-side")).toBe("left");
      expect(dialog.className).toContain("dds-sheet--side_left");

      React.act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.queryByRole("dialog")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Sheet 상태", () => {
  it("uncontrolled: Trigger로 열고 Close로 닫는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("오버레이 클릭으로 닫히고, closeOnOverlayClick=false면 유지된다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Basic defaultOpen />);
    await user.click(screen.getByTestId("overlay"));
    expect(screen.queryByRole("dialog")).toBeNull();
    unmount();

    render(<Basic defaultOpen closeOnOverlayClick={false} />);
    await user.click(screen.getByTestId("overlay"));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});

describe("Sheet 모달 스택", () => {
  it("열린 만큼 push되고 닫히면 pop되며, modal:true로 등록된다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    expect(getDialogStack()).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(getDialogStack()).toHaveLength(1);
    expect(getDialogStack()[0]?.modal).toBe(true);

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(getDialogStack()).toHaveLength(0);
  });

  it("ESC는 최상단 하나만 닫는다", async () => {
    const user = userEvent.setup();
    render(<Nested />);
    expect(getDialogStack()).toHaveLength(2);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "안쪽" })).toBeNull();
    expect(screen.getByRole("dialog", { name: "바깥" })).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "바깥" })).toBeNull();
  });

  it("ESC로 닫히고, closeOnEscape=false면 유지된다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Basic defaultOpen />);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    unmount();

    render(<Basic defaultOpen closeOnEscape={false} />);
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("열리면 배경(스크롤 잠금)이 걸리고 닫히면 복원된다", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    render(<Basic />);

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(document.body.style.overflow).toBe("scroll");
    document.body.style.overflow = "";
  });

  it("배경 형제에 inert를 부여하고 닫히면 복원한다", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Basic />);
    const rtlContainer = baseElement.firstElementChild as HTMLElement;

    expect(rtlContainer.hasAttribute("inert")).toBe(false);
    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(rtlContainer.hasAttribute("inert")).toBe(true);

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(rtlContainer.hasAttribute("inert")).toBe(false);
  });
});

describe("Sheet 포커스", () => {
  it("열면 Content가 포커스를 받고 닫으면 트리거로 돌아간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "열기" });

    await user.click(trigger);
    expect(document.activeElement).toBe(screen.getByRole("dialog"));

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(document.activeElement).toBe(trigger);
  });

  it("initialFocusRef가 있으면 그쪽이 포커스를 받는다", () => {
    function WithInitialFocus() {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <Sheet.Root defaultOpen initialFocusRef={ref}>
          <Sheet.Content>
            <input ref={ref} aria-label="이름" />
          </Sheet.Content>
        </Sheet.Root>
      );
    }
    render(<WithInitialFocus />);
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });
});

describe("Sheet aria", () => {
  it("렌더된 Title만 aria-labelledby로 연결하고, aria-modal=true다", () => {
    render(<Basic defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe(screen.getByText("제목").id);
  });
});
