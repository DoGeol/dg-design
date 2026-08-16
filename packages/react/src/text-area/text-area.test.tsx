import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Field } from "../field/Field";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  it("단독 사용 시 context 없이도 자체 id를 생성한다", () => {
    render(<TextArea aria-label="자기소개" />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(textarea.id).toBeTruthy();
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea.getAttribute("aria-invalid")).toBe("false");
    expect(textarea.getAttribute("aria-describedby")).toBeFalsy();
  });

  it("명시적 id를 넘기면 그대로 쓴다", () => {
    render(<TextArea aria-label="자기소개" id="custom-id" />);
    expect(screen.getByRole("textbox").id).toBe("custom-id");
  });

  it("rows 기본값은 3이고, 넘기면 그대로 쓴다", () => {
    render(<TextArea aria-label="자기소개" />);
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).rows).toBe(3);

    render(<TextArea aria-label="설명" rows={6} />);
    expect((screen.getByRole("textbox", { name: "설명" }) as HTMLTextAreaElement).rows).toBe(6);
  });

  it("타이핑하면 값이 반영된다", async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="자기소개" />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    await user.type(textarea, "안녕하세요\n반갑습니다");
    expect(textarea.value).toBe("안녕하세요\n반갑습니다");
  });

  it("disabled면 타이핑해도 값이 바뀌지 않는다", async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="자기소개" disabled />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    await user.type(textarea, "안녕하세요");
    expect(textarea.value).toBe("");
  });

  it("readOnly면 타이핑해도 값이 바뀌지 않는다", async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="자기소개" readOnly defaultValue="고정값" />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    await user.type(textarea, "안녕하세요");
    expect(textarea.value).toBe("고정값");
  });

  it("Field.Root 안에서는 label·describedby·invalid가 연동된다", () => {
    render(
      <Field.Root>
        <Field.Label>자기소개</Field.Label>
        <TextArea />
        <Field.ErrorMessage>필수 항목입니다.</Field.ErrorMessage>
      </Field.Root>,
    );
    const textarea = screen.getByRole("textbox", { name: "자기소개" }) as HTMLTextAreaElement;

    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByText("필수 항목입니다.").id).toBe(textarea.getAttribute("aria-describedby"));
  });

  it("aria-describedby를 직접 넘기면 Field context 값과 합쳐진다", () => {
    render(
      <Field.Root>
        <Field.Label>자기소개</Field.Label>
        <TextArea aria-describedby="external-hint" />
        <Field.Description>200자 이내로 작성하세요.</Field.Description>
      </Field.Root>,
    );
    const textarea = screen.getByRole("textbox", { name: "자기소개" });
    const describedBy = textarea.getAttribute("aria-describedby") ?? "";

    expect(describedBy).toContain("external-hint");
    expect(describedBy.split(" ")).toHaveLength(2);
  });

  it("autoResize=false면 resize 자동확장 클래스가 없다", () => {
    render(<TextArea aria-label="자기소개" />);
    expect(screen.getByRole("textbox").className).not.toContain("dds-text-area--auto-resize");
  });

  it("autoResize=true면 자동확장 클래스가 붙고 타이핑도 정상 동작한다", async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="자기소개" autoResize />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(textarea.className).toContain("dds-text-area--auto-resize");

    // jsdom은 레이아웃 엔진이 없어 scrollHeight가 항상 0이고, CSS.supports("field-sizing", …)도
    // 실제 렌더링 지원과 무관하게 파싱 가능 여부만 답한다 — height px 값 자체는 검증 불가.
    // 여기서는 자동확장 경로에서도 입력이 막히지 않는지(값 반영)만 jsdom 한계 내에서 확인한다.
    await user.type(textarea, "여러 줄\n입력");
    expect(textarea.value).toBe("여러 줄\n입력");
  });
});
