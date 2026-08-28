import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Collapsible } from "./Collapsible";

function Example(props: React.ComponentProps<typeof Collapsible.Root>) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>상세 보기</Collapsible.Trigger>
      <Collapsible.Content>
        <label>
          이름 <input aria-label="이름" defaultValue="초기값" />
        </label>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

describe("Collapsible", () => {
  it("uncontrolled 상태를 토글하고 Trigger와 Content ARIA를 연결한다", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "상세 보기" });
    const content = screen.getByLabelText("이름").parentElement?.parentElement;

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(content?.id).toBe(trigger.getAttribute("aria-controls"));
    expect(content?.getAttribute("aria-hidden")).toBe("true");
    expect(content?.hasAttribute("inert")).toBe(true);

    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content?.getAttribute("aria-hidden")).toBe("false");
    expect(content?.hasAttribute("inert")).toBe(false);
  });

  it("닫아도 Content DOM과 내부 폼 상태를 보존한다", async () => {
    const user = userEvent.setup();
    render(<Example defaultOpen />);
    const trigger = screen.getByRole("button", { name: "상세 보기" });
    const input = screen.getByRole("textbox", { name: "이름" });

    await user.clear(input);
    await user.type(input, "수정한 값");
    await user.click(trigger);
    await user.click(trigger);

    expect((screen.getByRole("textbox", { name: "이름" }) as HTMLInputElement).value).toBe(
      "수정한 값",
    );
  });

  it("controlled 상태는 외부 값만 따르고 외부 reset도 즉시 반영한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Example open onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "상세 보기" });

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    rerender(<Example open={false} onOpenChange={onOpenChange} />);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("disabled면 사용자 입력으로 변하지 않지만 controlled 갱신은 반영한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Example open={false} disabled onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "상세 보기" });

    await user.click(trigger);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect((trigger as HTMLButtonElement).disabled).toBe(true);

    rerender(<Example open disabled onOpenChange={onOpenChange} />);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("asChild Trigger가 자식 요소와 상태 속성을 유지한다", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <button>사용자 Trigger</button>
        </Collapsible.Trigger>
        <Collapsible.Content>내용</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "사용자 Trigger" });

    expect(trigger.classList.contains("dds-collapsible__trigger")).toBe(true);
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("측정한 높이를 CSS 변수로 Content에 반영한다", () => {
    render(<Example defaultOpen />);
    const content = screen.getByLabelText("이름").parentElement?.parentElement;

    expect(content?.style.getPropertyValue("--dds-collapsible-content-height")).toBe("0px");
  });
});
