import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { getDialogStack, registerNotificationLayer } from "../internal/dialog-stack";
import { Dialog } from "./Dialog";

function Basic(props: React.ComponentProps<typeof Dialog.Root>) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>열기</Dialog.Trigger>
      <Dialog.Overlay data-testid="overlay" />
      <Dialog.Content>
        <Dialog.Title>제목</Dialog.Title>
        <Dialog.Close>닫기</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}

/** 바깥 다이얼로그의 Content 안에 또 하나를 여는 중첩 구조. */
function Nested() {
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Overlay />
      <Dialog.Content aria-label="바깥">
        <Dialog.Root defaultOpen>
          <Dialog.Overlay />
          <Dialog.Content aria-label="안쪽" />
        </Dialog.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe("Dialog 상태", () => {
  it("uncontrolled: Trigger로 열고 Close로 닫는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("controlled: open prop이 진실이고 onOpenChange만 통지한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Basic open={false} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(<Basic open onOpenChange={onOpenChange} />);
    expect(screen.getByRole("dialog")).toBeTruthy();
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
});

describe("Dialog 스택", () => {
  it("열린 만큼 push되고 닫히면 pop된다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    expect(getDialogStack()).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(getDialogStack()).toHaveLength(1);

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
    expect(getDialogStack()).toHaveLength(1);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "바깥" })).toBeNull();
  });

  it("스크롤 잠금은 refcount — 중첩 중 하나만 닫혀도 유지된다", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    render(<Nested />);
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
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

  it("알림 레이어는 모달이 열려도 inert되지 않고, 해제하면 다시 inert된다", async () => {
    const user = userEvent.setup();
    const layer = document.body.appendChild(document.createElement("div"));
    const plain = document.body.appendChild(document.createElement("div"));
    const unregister = registerNotificationLayer(layer);

    try {
      render(<Basic />);
      await user.click(screen.getByRole("button", { name: "열기" }));
      expect(layer.hasAttribute("inert")).toBe(false);
      expect(plain.hasAttribute("inert")).toBe(true);

      // 열린 채로 해제해도 누수 없이 배경으로 돌아간다.
      unregister();
      expect(layer.hasAttribute("inert")).toBe(true);

      await user.click(screen.getByRole("button", { name: "닫기" }));
      expect(layer.hasAttribute("inert")).toBe(false);
      expect(plain.hasAttribute("inert")).toBe(false);
    } finally {
      unregister();
      layer.remove();
      plain.remove();
    }
  });

  it("모달이 열린 뒤에 등록해도 걸려 있던 inert가 즉시 걷힌다", async () => {
    const user = userEvent.setup();
    const layer = document.body.appendChild(document.createElement("div"));
    let unregister = () => {};

    try {
      render(<Basic />);
      await user.click(screen.getByRole("button", { name: "열기" }));
      expect(layer.hasAttribute("inert")).toBe(true);

      unregister = registerNotificationLayer(layer);
      expect(layer.hasAttribute("inert")).toBe(false);
    } finally {
      unregister();
      layer.remove();
    }
  });

  it("중첩되면 이전 다이얼로그의 컨테이너도 inert가 된다", () => {
    render(<Nested />);
    const outer = screen.getByRole("dialog", { name: "바깥" }).parentElement as HTMLElement;
    expect(outer.hasAttribute("inert")).toBe(true);
    expect(
      (screen.getByRole("dialog", { name: "안쪽" }).parentElement as HTMLElement).hasAttribute(
        "inert",
      ),
    ).toBe(false);
  });
});

describe("Dialog aria·포커스", () => {
  it("렌더된 Title/Description만 aria로 연결한다", () => {
    const { unmount } = render(<Basic defaultOpen />);
    const dialog = screen.getByRole("dialog");

    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe(screen.getByText("제목").id);
    expect(dialog.getAttribute("aria-describedby")).toBeNull();
    unmount();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Description>설명</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const second = screen.getByRole("dialog");
    expect(second.getAttribute("aria-labelledby")).toBeNull();
    expect(second.getAttribute("aria-describedby")).toBe(screen.getByText("설명").id);
  });

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
        <Dialog.Root defaultOpen initialFocusRef={ref}>
          <Dialog.Content>
            <input ref={ref} aria-label="이름" />
          </Dialog.Content>
        </Dialog.Root>
      );
    }
    render(<WithInitialFocus />);
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("복귀 대상이 사라졌으면 body로 폴백한다", async () => {
    const user = userEvent.setup();
    function Vanishing() {
      const [open, setOpen] = React.useState(false);
      return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          {!open && <Dialog.Trigger>열기</Dialog.Trigger>}
          <Dialog.Content>
            <Dialog.Close>닫기</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      );
    }
    render(<Vanishing />);

    await user.click(screen.getByRole("button", { name: "열기" }));
    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(document.activeElement).toBe(document.body);
  });
});

describe("Dialog presence", () => {
  it("퇴장 애니메이션이 끝날 때까지 마운트를 유지하고 타임아웃으로도 언마운트된다", () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(
        <Dialog.Root open>
          <Dialog.Content style={{ animationDuration: "200ms" }} />
        </Dialog.Root>,
      );
      expect(screen.getByRole("dialog")).toBeTruthy();

      rerender(
        <Dialog.Root open={false}>
          <Dialog.Content style={{ animationDuration: "200ms" }} />
        </Dialog.Root>,
      );
      expect(screen.getByRole("dialog")).toBeTruthy();

      // animationend가 오지 않아도 CSS 길이 + 여유 안에 정리된다.
      React.act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.queryByRole("dialog")).toBeTruthy();

      React.act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.queryByRole("dialog")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("애니메이션이 없으면(reduced-motion 포함) 즉시 언마운트한다", () => {
    const { rerender } = render(
      <Dialog.Root open>
        <Dialog.Content />
      </Dialog.Root>,
    );
    rerender(
      <Dialog.Root open={false}>
        <Dialog.Content />
      </Dialog.Root>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
