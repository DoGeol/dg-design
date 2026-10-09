import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Dialog } from "../dialog/Dialog";
import { Sheet } from "../sheet/Sheet";

describe("작업형 부품 (Dialog·Sheet)", () => {
  it("Dialog: Toolbar·Body·Aside·Footer가 Content 직속으로 붙고 Aside는 aside 요소다", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content size="large">
          <Dialog.Toolbar>
            <Dialog.Title>PDF 미리보기</Dialog.Title>
          </Dialog.Toolbar>
          <Dialog.Body>본문</Dialog.Body>
          <Dialog.Aside aria-label="활동">로그</Dialog.Aside>
          <Dialog.Footer>
            <button type="button">저장</button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const dialog = screen.getByRole("dialog", { name: "PDF 미리보기" });
    expect(dialog.className).toContain("dds-dialog__content--size_large");
    const parts = Array.from(dialog.children).map((el) => el.className);
    expect(parts).toEqual(["dds-panel__toolbar", "dds-panel__body", "dds-panel__aside", "dds-panel__footer"]);
    expect(screen.getByRole("complementary", { name: "활동" }).tagName).toBe("ASIDE");
  });

  it("Dialog size 기본값은 default 클래스, full도 고를 수 있다", () => {
    const { rerender } = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="확인" />
      </Dialog.Root>,
    );
    expect(screen.getByRole("dialog").className).not.toMatch(/size_(large|full)/);
    rerender(
      <Dialog.Root defaultOpen>
        <Dialog.Content aria-label="확인" size="full" />
      </Dialog.Root>,
    );
    expect(screen.getByRole("dialog").className).toContain("dds-dialog__content--size_full");
  });

  it("Sheet: 같은 부품을 쓰고 size를 바꿔도 Content가 유지돼 입력값과 포커스가 남는다", async () => {
    const user = userEvent.setup();
    function Staged() {
      const [size, setSize] = React.useState<"fit" | "tall" | "full">("fit");
      return (
        <Sheet.Root side="bottom" defaultOpen>
          <Sheet.Content size={size}>
            <Sheet.Toolbar>
              <Sheet.Title>상태 바꾸기</Sheet.Title>
              <button type="button" onClick={() => setSize(size === "fit" ? "tall" : "full")}>
                넓히기
              </button>
            </Sheet.Toolbar>
            <Sheet.Body>
              <input aria-label="메모" />
            </Sheet.Body>
            <Sheet.Footer>
              <button type="button">저장</button>
            </Sheet.Footer>
          </Sheet.Content>
        </Sheet.Root>
      );
    }
    render(<Staged />);
    const dialog = screen.getByRole("dialog", { name: "상태 바꾸기" });
    expect(dialog.className).toContain("dds-sheet--size_fit");
    await user.type(screen.getByRole("textbox", { name: "메모" }), "검토 완료");
    await user.click(screen.getByRole("button", { name: "넓히기" }));
    expect(screen.getByRole("dialog")).toBe(dialog);
    expect(dialog.className).toContain("dds-sheet--size_tall");
    expect((screen.getByRole("textbox", { name: "메모" }) as HTMLInputElement).value).toBe("검토 완료");
    await user.click(screen.getByRole("button", { name: "넓히기" }));
    expect(dialog.className).toContain("dds-sheet--size_full");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "넓히기" }));
  });
});
