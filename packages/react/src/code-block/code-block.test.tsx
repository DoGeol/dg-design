import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { CodeBlock, CopyButton } from "./CodeBlock";

describe("CodeBlock 컴포넌트", () => {
  it("코드 영역에 role='region', tabIndex=0, aria-label 속성이 올바르게 렌더된다", () => {
    render(
      <CodeBlock filename="test.tsx" copyText="const a = 1;">
        <code>const a = 1;</code>
      </CodeBlock>,
    );

    const region = screen.getByRole("region", { name: "test.tsx 코드" });
    expect(region).toBeDefined();
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(screen.getByText("test.tsx")).toBeDefined();
  });

  it("filename 유무 및 label prop에 따라 aria-label과 헤더 렌더링이 달라진다", () => {
    const { rerender } = render(
      <CodeBlock copyText="const a = 1;">
        <code>const a = 1;</code>
      </CodeBlock>,
    );

    // filename 없을 때 기본 label은 "코드"
    expect(screen.getByRole("region", { name: "코드" })).toBeDefined();

    // label prop이 직접 주어지면 우선 사용
    rerender(
      <CodeBlock
        filename="test.tsx"
        label="사용자 지정 레이블"
        copyText="const a = 1;"
      >
        <code>const a = 1;</code>
      </CodeBlock>,
    );
    expect(
      screen.getByRole("region", { name: "사용자 지정 레이블" }),
    ).toBeDefined();
  });

  it("filename과 copyable이 모두 없으면 헤더가 렌더되지 않는다", () => {
    const { container } = render(
      <CodeBlock copyable={false}>
        <code>const a = 1;</code>
      </CodeBlock>,
    );

    expect(container.querySelector(".dds-code-block__header")).toBeNull();
  });

  it("user-event Tab 키 입력 시 복사 버튼과 코드 영역에 순서대로 포커스가 이동한다", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock filename="example.tsx" copyText="const a = 1;">
        <code>const a = 1;</code>
      </CodeBlock>,
    );

    const copyButton = screen.getByRole("button", { name: "코드 복사" });
    const codeRegion = screen.getByRole("region", {
      name: "example.tsx 코드",
    });

    await user.tab();
    expect(document.activeElement).toBe(copyButton);

    await user.tab();
    expect(document.activeElement).toBe(codeRegion);
  });

  it("복사 버튼 클릭 시 clipboard.writeText가 호출되고 role='status'에 성공 메시지가 노출된다", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const onCopy = vi.fn();

    render(
      <CodeBlock
        filename="snippet.ts"
        copyText="console.log('hello');"
        onCopy={onCopy}
      >
        <code>console.log('hello');</code>
      </CodeBlock>,
    );

    const button = screen.getByRole("button", { name: "코드 복사" });
    const statusRegion = screen.getByRole("status");
    expect(statusRegion.textContent).toBe("");

    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith("console.log('hello');");
    expect(onCopy).toHaveBeenCalledWith(true);

    // 성공 메시지 및 라벨 변경
    expect(statusRegion.textContent).toBe("코드를 복사했습니다.");
    expect(button.getAttribute("aria-label")).toBe("복사됨");
    expect(button.textContent).toContain("복사됨");

    writeTextSpy.mockRestore();
  });

  it("clipboard 쓰기 실패 시 합쇼체 실패 메시지가 role='status'에 출력된다", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockRejectedValue(new Error("Permission denied"));
    const onCopy = vi.fn();

    render(
      <CodeBlock copyText="secure code" onCopy={onCopy}>
        <code>secure code</code>
      </CodeBlock>,
    );

    const button = screen.getByRole("button", { name: "코드 복사" });
    const statusRegion = screen.getByRole("status");

    await user.click(button);

    expect(onCopy).toHaveBeenCalledWith(false);
    expect(statusRegion.textContent).toBe(
      "복사하지 못했습니다. 코드를 선택해 직접 복사하십시오.",
    );
    // 실패 시 버튼은 기본 라벨 유지
    expect(button.getAttribute("aria-label")).toBe("코드 복사");

    writeTextSpy.mockRestore();
  });

  it("copyText 미지정 시 단일 문자열 children에서 텍스트를 자동 추출하여 복사한다", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(<CodeBlock>단일 문자열 코드 내용</CodeBlock>);

    const button = screen.getByRole("button", { name: "코드 복사" });
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith("단일 문자열 코드 내용");
    writeTextSpy.mockRestore();
  });

  it("복잡한 children에 원문이 없으면 클립보드를 건드리지 않고 실패를 알린다", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onCopy = vi.fn();
    render(<CodeBlock onCopy={onCopy}><pre><code>const a = 1;</code></pre></CodeBlock>);
    await user.click(screen.getByRole("button", { name: "코드 복사" }));
    expect(writeText).not.toHaveBeenCalled();
    expect(onCopy).toHaveBeenCalledWith(false);
    expect(screen.getByRole("status").textContent).toContain("복사하지 못했습니다");
    warn.mockRestore();
    writeText.mockRestore();
  });

  it("명시적으로 지정한 빈 원문은 유효한 복사 요청이다", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    render(<CodeBlock copyText=""><pre><code /></pre></CodeBlock>);
    await user.click(screen.getByRole("button", { name: "코드 복사" }));
    expect(writeText).toHaveBeenCalledWith("");
    expect(screen.getByRole("status").textContent).toBe("코드를 복사했습니다.");
    writeText.mockRestore();
  });

  it("타이머 만료 후 성공 상태에서 idle로 자동 복귀한다", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: (ms) => vi.advanceTimersByTime(ms),
      });
      const writeTextSpy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);

      render(<CodeBlock copyText="test code">test code</CodeBlock>);

      const button = screen.getByRole("button", { name: "코드 복사" });
      const statusRegion = screen.getByRole("status");

      await user.click(button);

      expect(button.getAttribute("aria-label")).toBe("복사됨");
      expect(statusRegion.textContent).toBe("코드를 복사했습니다.");

      // 2초 경과 후 복귀
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      await waitFor(() => {
        expect(button.getAttribute("aria-label")).toBe("코드 복사");
        expect(statusRegion.textContent).toBe("");
      });

      writeTextSpy.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("단독 CopyButton 컴포넌트", () => {
  it("단독 렌더링 시 aria-describedby로 role='status' 엘리먼트와 올바르게 연결된다", () => {
    render(<CopyButton text="pnpm add @dg-design/react" />);

    const button = screen.getByRole("button", { name: "코드 복사" });
    const status = screen.getByRole("status");

    expect(button.getAttribute("aria-describedby")).toBe(status.id);
    expect(status.getAttribute("aria-atomic")).toBe("true");
    expect(status.getAttribute("aria-live")).toBeNull(); // DDS 규칙: role="status"에 aria-live 생략
  });

  it("disabled prop이 주어지면 클릭 및 복사가 차단된다", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(<CopyButton text="disabled test" disabled />);

    const button = screen.getByRole("button", { name: "코드 복사" });
    expect(button.hasAttribute("disabled")).toBe(true);

    await user.click(button);
    expect(writeTextSpy).not.toHaveBeenCalled();

    writeTextSpy.mockRestore();
  });
});
