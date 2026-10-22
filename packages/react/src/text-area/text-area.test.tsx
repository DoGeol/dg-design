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

/** 손잡이·최소·최대 높이의 실제 계산은 CSS가 한다(VR 기능 테스트가 잰다) — 여기서는 클래스와 변수 배선만 본다. */
describe("TextArea 높이·조절", () => {
  const box = () => screen.getByRole("textbox") as HTMLTextAreaElement;

  it("기본은 손잡이 클래스가 없고 resizable이면 붙는다", () => {
    const { rerender } = render(<TextArea aria-label="메모" />);
    expect(box().className).not.toContain("dds-text-area--resizable");
    rerender(<TextArea aria-label="메모" resizable />);
    expect(box().className).toContain("dds-text-area--resizable");
  });

  it("autoResize면 rows를 최소 줄 수 변수로 넘긴다", () => {
    const { rerender } = render(<TextArea aria-label="메모" rows={4} />);
    expect(box().style.getPropertyValue("--dds-text-area-min-rows")).toBe("");
    rerender(<TextArea aria-label="메모" rows={4} autoResize />);
    expect(box().style.getPropertyValue("--dds-text-area-min-rows")).toBe("4");
  });

  it("maxRows는 클래스와 최대 줄 수 변수로 넘기고 사용자 style을 보존한다", () => {
    const { rerender } = render(<TextArea aria-label="메모" style={{ width: 200 }} />);
    expect(box().className).not.toContain("dds-text-area--max-rows");
    rerender(<TextArea aria-label="메모" maxRows={6} style={{ width: 200 }} />);
    expect(box().className).toContain("dds-text-area--max-rows");
    expect(box().style.getPropertyValue("--dds-text-area-max-rows")).toBe("6");
    expect(box().style.width).toBe("200px");
  });
});

describe("TextArea showCount", () => {
  it("showCount가 없으면 wrapper·카운터가 없다", () => {
    const { container } = render(<TextArea aria-label="소개" />);
    expect(container.firstElementChild?.tagName).toBe("TEXTAREA");
  });

  it("maxLength가 있으면 현재/최대, 없으면 현재 글자 수만 보인다 (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(
      <>
        <TextArea aria-label="a" showCount maxLength={10} defaultValue="가나" />
        <TextArea aria-label="b" showCount />
      </>,
    );

    expect(screen.getByText("2/10")).toBeTruthy();
    await user.type(screen.getByRole("textbox", { name: "a" }), "다");
    expect(screen.getByText("3/10")).toBeTruthy();

    await user.type(screen.getByRole("textbox", { name: "b" }), "abcd");
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("controlled 값을 그대로 세고 onChange도 전달한다", async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    function Controlled() {
      const [v, setV] = React.useState("");
      return (
        <TextArea
          aria-label="c"
          showCount
          maxLength={5}
          value={v}
          onChange={(e) => {
            seen.push(e.target.value);
            setV(e.target.value.toUpperCase());
          }}
        />
      );
    }
    render(<Controlled />);

    await user.type(screen.getByRole("textbox"), "ab");
    expect(screen.getByText("2/5")).toBeTruthy();
    expect(seen).toEqual(["a", "Ab"]);
  });

  it("카운터는 aria-describedby로 연결되고 기존 describedby와 병합된다", () => {
    render(<TextArea aria-label="d" showCount aria-describedby="extra" />);
    const textarea = screen.getByRole("textbox");
    const [first, countId = ""] = (textarea.getAttribute("aria-describedby") ?? "").split(" ");

    expect(first).toBe("extra");
    expect(document.getElementById(countId)?.textContent).toBe("0");
    expect(document.querySelector("[aria-live]")).toBeNull();
  });

  it("uncontrolled 카운트는 form reset 뒤 defaultValue 길이로 돌아온다", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <TextArea aria-label="메모" showCount defaultValue="ab" />
        <button type="reset">초기화</button>
      </form>,
    );
    const textarea = screen.getByRole("textbox");
    const countOf = () => document.getElementById(textarea.getAttribute("aria-describedby") ?? "")?.textContent;

    await user.type(textarea, "cd");
    expect(countOf()).toBe("4");
    await user.click(screen.getByRole("button", { name: "초기화" }));
    expect(countOf()).toBe("2");
  });

  it("variant 클래스는 showCount wrapper가 아니라 textarea에 붙고 Field 연결은 그대로다", () => {
    render(
      <Field.Root>
        <Field.Label>메모</Field.Label>
        <TextArea variant="line" showCount />
        <Field.ErrorMessage>필수</Field.ErrorMessage>
      </Field.Root>,
    );
    const textarea = screen.getByRole("textbox", { name: "메모" });
    expect(textarea.className).toContain("dds-text-area--variant_line");
    expect(textarea.parentElement?.className).toBe("dds-text-area__wrapper");
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
  });
});
