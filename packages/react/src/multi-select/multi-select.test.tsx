import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "../field/Field";
import { MultiSelect } from "./MultiSelect";

function Basic(props: React.ComponentProps<typeof MultiSelect.Root> = {}) {
  return (
    <MultiSelect.Root {...props}>
      <MultiSelect.Trigger placeholder="과일 선택" />
      <MultiSelect.Content>
        <MultiSelect.Group>
          <MultiSelect.Label>흔한 것</MultiSelect.Label>
          <MultiSelect.Option value="apple">Apple</MultiSelect.Option>
          <MultiSelect.Option value="banana">Banana</MultiSelect.Option>
          <MultiSelect.Option value="cherry" disabled>
            Cherry
          </MultiSelect.Option>
        </MultiSelect.Group>
        <MultiSelect.Option value="melon">Melon</MultiSelect.Option>
      </MultiSelect.Content>
    </MultiSelect.Root>
  );
}

const trigger = () => screen.getByRole("combobox");
const summary = () => (trigger().querySelector(".dds-select__value") as HTMLElement).textContent;
const option = (name: string) => screen.getByRole("option", { name });

describe("MultiSelect 값 배열", () => {
  it("uncontrolled: 고를 때마다 값이 쌓이고 다시 누르면 빠진다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic defaultValue={["banana"]} onValueChange={onValueChange} />);

    await user.click(trigger());
    await user.click(option("Melon"));
    expect(onValueChange).toHaveBeenLastCalledWith(["banana", "melon"]);

    await user.click(option("Banana"));
    expect(onValueChange).toHaveBeenLastCalledWith(["melon"]);
    expect(summary()).toBe("Melon");
  });

  it("controlled: value prop이 진실이고 onValueChange만 통지한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic value={["apple"]} onValueChange={onValueChange} />);

    await user.click(trigger());
    await user.click(option("Melon"));

    expect(onValueChange).toHaveBeenCalledWith(["apple", "melon"]);
    expect(summary()).toBe("Apple");

    rerender(<Basic value={["apple", "melon"]} onValueChange={onValueChange} />);
    expect(summary()).toBe("2개 선택됨");
  });

  it("Enter도 토글이다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic defaultOpen onValueChange={onValueChange} />);

    // 열림 포커스가 첫 옵션(Apple)에 들어가 있다.
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);

    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });
});

describe("MultiSelect 패널 유지", () => {
  it("선택해도 닫히지 않고 포커스도 옵션에 남는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(trigger());
    await user.click(option("Apple"));
    await user.click(option("Melon"));

    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(option("Apple").getAttribute("aria-selected")).toBe("true");
    expect(option("Melon").getAttribute("aria-selected")).toBe("true");
  });

  it("바깥 클릭·ESC·트리거 재클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(trigger());
    await user.click(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(trigger());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger());

    await user.click(trigger());
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.click(trigger());
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});

describe("MultiSelect 요약 문구", () => {
  it("0개면 placeholder를 회색 표시로 보여준다", () => {
    render(<Basic />);
    const value = trigger().querySelector(".dds-select__value") as HTMLElement;

    expect(value.textContent).toBe("과일 선택");
    expect(value.hasAttribute("data-placeholder")).toBe(true);
  });

  it("1개면 그 라벨, 2개 이상이면 개수 문구다", () => {
    const { rerender } = render(<Basic value={["banana"]} />);
    expect(summary()).toBe("Banana");
    expect(
      (trigger().querySelector(".dds-select__value") as HTMLElement).hasAttribute(
        "data-placeholder",
      ),
    ).toBe(false);

    rerender(<Basic value={["banana", "melon"]} />);
    expect(summary()).toBe("2개 선택됨");

    rerender(<Basic value={["apple", "banana", "melon"]} />);
    expect(summary()).toBe("3개 선택됨");
  });

  it("사용자 컴포넌트로 감싼 옵션도 라벨로 요약된다", async () => {
    // children 트리 스캔은 <Wrapped />의 안을 못 본다 — 마운트 등록이 그 구멍을 메운다.
    const user = userEvent.setup();
    function Wrapped() {
      return <MultiSelect.Option value="apple">Apple</MultiSelect.Option>;
    }
    render(
      <MultiSelect.Root>
        <MultiSelect.Trigger placeholder="과일 선택" />
        <MultiSelect.Content>
          <Wrapped />
        </MultiSelect.Content>
      </MultiSelect.Root>,
    );

    await user.click(trigger());
    await user.click(option("Apple"));

    expect(summary()).toBe("Apple");
  });
});

describe("MultiSelect 닫힌 상태 키", () => {
  it.each(["{ArrowDown}", "{ArrowUp}", "{Enter}", " ", "m"])(
    "%s는 열기만 하고 값을 바꾸지 않는다",
    async (key) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Basic onValueChange={onValueChange} />);

      trigger().focus();
      await user.keyboard(key);

      expect(screen.getByRole("listbox")).toBeTruthy();
      expect(onValueChange).not.toHaveBeenCalled();
    },
  );
});

describe("MultiSelect 열린 상태 typeahead", () => {
  it("문자 키는 포커스만 옮긴다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic defaultOpen onValueChange={onValueChange} />);

    await user.keyboard("m");

    expect(document.activeElement).toBe(option("Melon"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("화살표가 순환하고 disabled 옵션을 건너뛴다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(option("Banana"));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(option("Melon"));
  });
});

describe("MultiSelect 폼 제출", () => {
  const hiddens = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLInputElement>('input[type="hidden"]'));

  it("선택 개수만큼 같은 name의 hidden input을 렌더한다", async () => {
    const user = userEvent.setup();
    const { container } = render(<Basic name="fruit" />);

    expect(hiddens(container)).toHaveLength(0);

    await user.click(trigger());
    await user.click(option("Apple"));
    await user.click(option("Melon"));

    expect(hiddens(container).map((input) => input.value)).toEqual(["apple", "melon"]);
    expect(hiddens(container).every((input) => input.name === "fruit")).toBe(true);

    await user.click(option("Apple"));
    expect(hiddens(container).map((input) => input.value)).toEqual(["melon"]);
  });

  it("name이 없으면 hidden input을 렌더하지 않는다", () => {
    const { container } = render(<Basic value={["apple"]} />);
    expect(hiddens(container)).toHaveLength(0);
  });
});

describe("MultiSelect aria", () => {
  it("패널은 다중 선택 listbox이고 옵션마다 aria-selected가 붙는다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue={["banana"]} />);

    expect(trigger().getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger());
    const listbox = screen.getByRole("listbox");
    expect(listbox.getAttribute("aria-multiselectable")).toBe("true");
    expect(listbox.getAttribute("aria-labelledby")).toBe(trigger().id);
    expect(trigger().getAttribute("aria-expanded")).toBe("true");

    expect(option("Banana").getAttribute("aria-selected")).toBe("true");
    expect(option("Apple").getAttribute("aria-selected")).toBe("false");
    expect(screen.getByRole("group", { name: "흔한 것" })).toBeTruthy();
  });
});

describe("MultiSelect Field 연동", () => {
  function WithField() {
    return (
      <Field.Root>
        <Field.Label>과일</Field.Label>
        <Basic />
        <Field.ErrorMessage>하나 이상 골라주세요.</Field.ErrorMessage>
      </Field.Root>
    );
  }

  it("라벨이 트리거를 가리키고, 클릭이 트리거까지 전달된다", async () => {
    const user = userEvent.setup();
    render(<WithField />);
    const label = screen.getByText("과일") as HTMLLabelElement;

    expect(label.htmlFor).toBe(trigger().id);

    await user.click(label);
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(document.activeElement).toBe(option("Apple"));
  });

  it("ErrorMessage가 있으면 invalid와 describedby가 붙는다", () => {
    render(<WithField />);

    expect(trigger().getAttribute("aria-invalid")).toBe("true");
    const describedBy = trigger().getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)?.textContent).toBe(
      "하나 이상 골라주세요.",
    );
  });

  it("Field 밖에서는 invalid가 false다", () => {
    render(<Basic />);
    expect(trigger().getAttribute("aria-invalid")).toBe("false");
    expect(trigger().getAttribute("aria-describedby")).toBeNull();
  });
});

describe("MultiSelect i18n", () => {
  it("formatCount로 요약 문구를 바꾼다", () => {
    render(
      <MultiSelect.Root value={["apple", "banana"]}>
        <MultiSelect.Trigger placeholder="고르기" formatCount={(n) => `${n} selected`} />
        <MultiSelect.Content>
          <MultiSelect.Option value="apple">Apple</MultiSelect.Option>
          <MultiSelect.Option value="banana">Banana</MultiSelect.Option>
        </MultiSelect.Content>
      </MultiSelect.Root>,
    );
    expect(summary()).toBe("2 selected");
  });
});
