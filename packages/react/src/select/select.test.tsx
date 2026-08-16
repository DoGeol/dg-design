import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Field } from "../field/Field";
import { Select } from "./Select";

function Basic(props: React.ComponentProps<typeof Select.Root> = {}) {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="과일 선택" />
      <Select.Content>
        <Select.Group>
          <Select.Label>흔한 것</Select.Label>
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
          <Select.Option value="cherry" disabled>
            Cherry
          </Select.Option>
        </Select.Group>
        <Select.Option value="melon">Melon</Select.Option>
      </Select.Content>
    </Select.Root>
  );
}

const trigger = () => screen.getByRole("combobox");
const options = () => screen.getAllByRole("option");

describe("Select 값 상태", () => {
  it("uncontrolled: defaultValue가 트리거에 보이고 선택하면 바뀐다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic defaultValue="banana" onValueChange={onValueChange} />);

    expect(trigger().textContent).toContain("Banana");

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Melon" }));

    expect(onValueChange).toHaveBeenCalledWith("melon");
    expect(trigger().textContent).toContain("Melon");
  });

  it("controlled: value prop이 진실이고 onValueChange만 통지한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic value="apple" onValueChange={onValueChange} />);

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Melon" }));

    expect(onValueChange).toHaveBeenCalledWith("melon");
    expect(trigger().textContent).toContain("Apple");

    rerender(<Basic value="melon" onValueChange={onValueChange} />);
    expect(trigger().textContent).toContain("Melon");
  });

  it("controlled: 값을 undefined로 되돌리면 placeholder로 돌아간다", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = React.useState<string | undefined>(undefined);
      return (
        <>
          <Basic value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue(undefined)}>
            지우기
          </button>
        </>
      );
    }

    render(<Controlled />);

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(trigger().textContent).toContain("Apple");

    await user.click(screen.getByRole("button", { name: "지우기" }));
    expect(trigger().textContent).toContain("과일 선택");
  });

  it("값이 없으면 placeholder를 회색 표시로 보여준다", () => {
    render(<Basic />);
    const value = trigger().querySelector(".dds-select__value") as HTMLElement;

    expect(value.textContent).toBe("과일 선택");
    expect(value.hasAttribute("data-placeholder")).toBe(true);
  });

  it("선택하면 닫히고 트리거로 포커스가 돌아간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Apple" }));

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });
});

describe("Select 열림 포커스", () => {
  it("선택된 옵션으로 포커스가 들어간다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="melon" />);

    await user.click(trigger());
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Melon" }));
  });

  it("선택이 없으면 첫 옵션으로 들어간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(trigger());
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Apple" }));
  });

  it("화살표가 순환하고 disabled 옵션을 건너뛴다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    expect(options().map((option) => option.textContent)).toEqual([
      "Apple",
      "Banana",
      "Cherry",
      "Melon",
    ]);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Banana" }));

    // disabled인 Cherry는 roving 목록에서 빠져 Melon으로 건너뛴다.
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Melon" }));

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Apple" }));
  });
});

describe("Select 닫힌 상태 키", () => {
  it.each(["{ArrowDown}", "{ArrowUp}", "{Enter}", " "])("%s는 열기만 한다", async (key) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    trigger().focus();
    await user.keyboard(key);

    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("Select typeahead", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("닫힌 상태에서는 문자 키가 값을 바로 바꾼다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    trigger().focus();
    await user.keyboard("m");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onValueChange).toHaveBeenCalledWith("melon");
    expect(trigger().textContent).toContain("Melon");
  });

  it("목록에서 빠진 옵션은 닫힌 상태 typeahead로 선택되지 않는다", async () => {
    // 등록 캐시는 해제하지 않으므로(트리거 라벨 유지용) 한 번 연 뒤 목록이 교체되면
    // 옛 항목이 캐시에 남는다 — 그게 선택 후보로 새면 소비자가 지운 값이 방출된다.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Swappable() {
      const [swapped, setSwapped] = React.useState(false);
      return (
        <>
          <button onClick={() => setSwapped(true)}>교체</button>
          <Select.Root onValueChange={onValueChange}>
            <Select.Trigger placeholder="고르기" />
            <Select.Content>
              {swapped ? (
                <Select.Option value="paris">Paris</Select.Option>
              ) : (
                <Select.Option value="seoul">Seoul</Select.Option>
              )}
            </Select.Content>
          </Select.Root>
        </>
      );
    }
    render(<Swappable />);

    // 한 번 열어 Seoul을 등록 캐시에 남긴 뒤 닫는다.
    await user.click(trigger());
    await user.keyboard("{Escape}");
    await user.click(screen.getByText("교체"));

    trigger().focus();
    await user.keyboard("s");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger().textContent).toContain("고르기");
  });

  it("사용자 컴포넌트로 감싼 옵션도 닫힌 상태 typeahead로 잡힌다", async () => {
    // 스캔은 <Wrapped /> 안을 못 보므로 등록 캐시가 유일한 후보 출처다 —
    // 사라진 옵션을 정리하면서 이쪽까지 지우면 안 된다.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Wrapped() {
      return <Select.Option value="melon">Melon</Select.Option>;
    }
    render(
      <Select.Root onValueChange={onValueChange}>
        <Select.Trigger placeholder="고르기" />
        <Select.Content>
          <Wrapped />
        </Select.Content>
      </Select.Root>,
    );

    // 한 번 열어 등록시킨 뒤 닫는다.
    await user.click(trigger());
    await user.keyboard("{Escape}");

    trigger().focus();
    await user.keyboard("m");

    expect(onValueChange).toHaveBeenCalledWith("melon");
  });

  it("닫힌 상태에서 disabled 옵션은 건너뛴다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    trigger().focus();
    await user.keyboard("c");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("열린 상태에서는 값이 아니라 포커스만 옮긴다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic defaultOpen onValueChange={onValueChange} />);

    await user.keyboard("m");

    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Melon" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("버퍼가 이어지면 여러 글자로 매칭한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    trigger().focus();
    await user.keyboard("ba");

    expect(onValueChange).toHaveBeenLastCalledWith("banana");
  });

  it("1초가 지나면 버퍼가 비어 다음 글자가 새 검색이 된다", async () => {
    // shouldAdvanceTime이 없으면 user-event의 내부 대기가 가짜 시계에 갇혀 테스트가 멈춘다.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    trigger().focus();
    await user.keyboard("b");
    expect(onValueChange).toHaveBeenLastCalledWith("banana");

    vi.advanceTimersByTime(1100);

    // 버퍼가 살아 있었다면 "ba"라 Banana에 머문다. 비었으므로 "a" 단독 검색이다.
    await user.keyboard("a");
    expect(onValueChange).toHaveBeenLastCalledWith("apple");
  });
});

describe("Select 폼 제출", () => {
  it("name을 주면 hidden input에 값이 실린다", async () => {
    const user = userEvent.setup();
    const { container } = render(<Basic name="fruit" />);
    const hidden = () => container.querySelector('input[type="hidden"]') as HTMLInputElement;

    expect(hidden().name).toBe("fruit");
    expect(hidden().value).toBe("");

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(hidden().value).toBe("apple");
  });

  it("name이 없으면 hidden input을 렌더하지 않는다", () => {
    const { container } = render(<Basic />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });
});

describe("Select Field 연동", () => {
  function WithField() {
    return (
      <Field.Root>
        <Field.Label>과일</Field.Label>
        <Basic />
        <Field.ErrorMessage>하나를 골라주세요.</Field.ErrorMessage>
      </Field.Root>
    );
  }

  it("라벨이 트리거를 가리키고, 클릭이 트리거까지 전달된다", async () => {
    const user = userEvent.setup();
    render(<WithField />);
    const label = screen.getByText("과일") as HTMLLabelElement;

    expect(label.htmlFor).toBe(trigger().id);

    // 라벨 클릭은 버튼 활성화까지 간다(네이티브 select와 동형) — 포커스가 트리거로 들어간 뒤
    // 열림 처리가 이어져 최종 포커스는 첫 옵션이다.
    await user.click(label);
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Apple" }));
  });

  it("ErrorMessage가 있으면 invalid와 describedby가 붙는다", () => {
    render(<WithField />);

    expect(trigger().getAttribute("aria-invalid")).toBe("true");
    const describedBy = trigger().getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)?.textContent).toBe("하나를 골라주세요.");
  });

  it("Field 밖에서는 invalid가 false다", () => {
    render(<Basic />);
    expect(trigger().getAttribute("aria-invalid")).toBe("false");
    expect(trigger().getAttribute("aria-describedby")).toBeNull();
  });
});

describe("Select dismissal", () => {
  it("ESC로 닫히고 트리거로 포커스가 돌아간다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(trigger());
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("바깥 클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.click(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("열려도 배경 inert도 스크롤 잠금도 없다", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    const { baseElement } = render(<Basic />);
    const rtlContainer = baseElement.firstElementChild as HTMLElement;

    await user.click(trigger());
    expect(rtlContainer.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");

    document.body.style.overflow = "";
  });
});

describe("Select aria", () => {
  it("트리거는 combobox, 패널은 listbox로 연결된다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="banana" />);

    expect(trigger().getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger());
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("listbox").getAttribute("aria-labelledby")).toBe(trigger().id);

    expect(options()).toHaveLength(4);
    expect(screen.getByRole("option", { name: "Banana" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("Group이 Label로 이름을 받는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(trigger());
    expect(screen.getByRole("group", { name: "흔한 것" })).toBeTruthy();
  });
});
