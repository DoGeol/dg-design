import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { MultiSelect } from "./MultiSelect";

function Searchable(props: React.ComponentProps<typeof MultiSelect.Root> = {}) {
  return (
    <MultiSelect.Root searchProps={{ "aria-label": "과일 검색" }} {...props}>
      <MultiSelect.Trigger placeholder="과일 선택" />
      <MultiSelect.Content>
        <MultiSelect.Option value="apple">Apple</MultiSelect.Option>
        <MultiSelect.Option value="banana">Banana</MultiSelect.Option>
        <MultiSelect.Option value="blueberry">Blueberry</MultiSelect.Option>
        <MultiSelect.Option value="melon">Melon</MultiSelect.Option>
      </MultiSelect.Content>
    </MultiSelect.Root>
  );
}

const input = () => screen.getByRole("combobox") as HTMLInputElement;
const searchbox = () => screen.getByRole("searchbox") as HTMLInputElement;
const option = (name: string) => screen.getByRole("option", { name });
const optionNames = () =>
  screen.getAllByRole("option").map((element) => element.textContent?.trim());

describe('MultiSelect search="trigger"', () => {
  it("타이핑하면 열리고 라벨이 안 맞는 옵션은 hidden으로 빠진다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="trigger" />);

    expect(screen.queryByRole("listbox")).toBeNull();
    await user.type(input(), "bl");

    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(optionNames()).toEqual(["Blueberry"]);
    // 언마운트가 아니라 hidden이다 — 등록 목록이 그대로 남아야 한다.
    expect(screen.getByRole("listbox").querySelectorAll('[role="option"]')).toHaveLength(4);
  });

  it("필터는 NFKC 소문자 기준이라 전각·대소문자를 함께 잡는다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="trigger" />);

    await user.type(input(), "ＡＰＰ");
    expect(optionNames()).toEqual(["Apple"]);
  });

  it("filter={null}이면 걸러내지 않는다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="trigger" filter={null} />);

    await user.type(input(), "zzz");
    expect(optionNames()).toEqual(["Apple", "Banana", "Blueberry", "Melon"]);
  });

  it("↓로 활성이 옮겨가고 aria-activedescendant만 갱신된다(DOM 포커스는 입력)", async () => {
    const user = userEvent.setup();
    render(<Searchable search="trigger" />);

    await user.type(input(), "b");
    expect(optionNames()).toEqual(["Banana", "Blueberry"]);
    expect(input().getAttribute("aria-activedescendant")).toBe(option("Banana").id);

    await user.keyboard("{ArrowDown}");
    expect(input().getAttribute("aria-activedescendant")).toBe(option("Blueberry").id);
    expect(document.activeElement).toBe(input());
    expect(option("Blueberry").hasAttribute("data-active")).toBe(true);
  });

  it("Enter는 활성 옵션을 토글한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Searchable search="trigger" onValueChange={onValueChange} />);

    await user.type(input(), "mel");
    await user.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith(["melon"]);
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("빈 입력의 Backspace는 마지막 칩을 뗀다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Searchable
        search="trigger"
        defaultValue={["apple", "melon"]}
        onValueChange={onValueChange}
      />,
    );

    input().focus();
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
  });

  it("입력에 글자가 있으면 Backspace는 칩을 건드리지 않는다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Searchable search="trigger" defaultValue={["apple"]} onValueChange={onValueChange} />);

    await user.type(input(), "me");
    await user.keyboard("{Backspace}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(input().value).toBe("m");
  });

  it("칩 제거 버튼은 tab 순서에 들어가고 눌리면 값이 빠진다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Searchable search="trigger" defaultValue={["apple"]} onValueChange={onValueChange} />);

    const remove = screen.getByRole("button", { name: "Apple" });
    expect(remove.hasAttribute("tabindex")).toBe(false);

    await user.tab();
    expect(document.activeElement).toBe(remove);

    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("입력 클릭·타이핑은 닫지 않고 칩 영역 빈 곳 클릭만 토글한다", async () => {
    const user = userEvent.setup();
    const { container } = render(<Searchable search="trigger" defaultOpen />);

    await user.click(input());
    expect(screen.getByRole("listbox")).toBeTruthy();

    await user.click(container.querySelector(".dds-multi-select__trigger--search") as HTMLElement);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("combobox 입력이 aria 배선을 갖는다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="trigger" />);

    expect(input().getAttribute("aria-autocomplete")).toBe("list");
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(input().getAttribute("aria-controls")).toBeNull();

    await user.type(input(), "a");
    expect(input().getAttribute("aria-expanded")).toBe("true");
    expect(input().getAttribute("aria-controls")).toBe(screen.getByRole("listbox").id);
  });
});

describe('MultiSelect search="content"', () => {
  it("열릴 때 검색 입력에 포커스가 가고 ↓로 목록에 들어간다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="content" />);

    await user.click(screen.getByRole("combobox"));
    expect(document.activeElement).toBe(searchbox());

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(option("Apple"));
  });

  it("타이핑은 목록 typeahead에 새지 않고 필터만 건다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="content" />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("blue");

    expect(searchbox().value).toBe("blue");
    expect(optionNames()).toEqual(["Blueberry"]);
    expect(document.activeElement).toBe(searchbox());
  });

  it("걸러진 옵션은 ↓ 이동에서도 빠진다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="content" />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("b");
    await user.keyboard("{ArrowDown}");

    expect(document.activeElement).toBe(option("Banana"));
  });
});

describe("MultiSelect onCreate", () => {
  const createProps = {
    search: "trigger" as const,
    createLabel: (query: string) => `Create "${query}"`,
  };

  it("onCreate만 있고 createLabel이 없으면 만들기 항목을 렌더하지 않는다", async () => {
    const user = userEvent.setup();
    render(<Searchable search="trigger" onCreate={vi.fn()} />);

    await user.type(input(), "kiwi");
    expect(screen.queryByRole("option", { name: /Create/ })).toBeNull();
  });

  it("정확히 같은 라벨이 있으면 만들기 항목이 나오지 않는다", async () => {
    const user = userEvent.setup();
    render(<Searchable {...createProps} onCreate={vi.fn()} />);

    await user.type(input(), "app");
    expect(screen.getByRole("option", { name: 'Create "app"' })).toBeTruthy();

    await user.type(input(), "le");
    expect(screen.queryByRole("option", { name: /Create/ })).toBeNull();
  });

  it("resolve한 옵션이 값에 붙고 질의가 비워진다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onCreate = vi.fn().mockResolvedValue({ value: "kiwi", label: "Kiwi" });
    render(<Searchable {...createProps} onCreate={onCreate} onValueChange={onValueChange} />);

    await user.type(input(), "kiwi");
    await user.click(screen.getByRole("option", { name: 'Create "kiwi"' }));

    await waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith(["kiwi"]));
    expect(onCreate).toHaveBeenCalledWith("kiwi");
    expect(input().value).toBe("");
    // 소비자가 목록에 넣기 전에도 칩 라벨은 resolve가 준 label이다.
    expect(screen.getByRole("button", { name: "Kiwi" })).toBeTruthy();
  });

  it("void resolve면 아무것도 하지 않는다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<Searchable {...createProps} onCreate={onCreate} onValueChange={onValueChange} />);

    await user.type(input(), "kiwi");
    await user.click(screen.getByRole("option", { name: 'Create "kiwi"' }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input().value).toBe("kiwi");
  });

  it("보류 중에는 만들기 항목만 aria-disabled가 되고 다른 옵션은 그대로 조작된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    let settle: () => void = () => {};
    const onCreate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          settle = () => resolve();
        }),
    );
    render(<Searchable {...createProps} onCreate={onCreate} onValueChange={onValueChange} />);

    await user.type(input(), "ki");
    const create = screen.getByRole("option", { name: /Create/ });
    await user.click(create);

    await waitFor(() => expect(create.getAttribute("aria-disabled")).toBe("true"));
    expect(create.querySelector(".dds-spinner")).toBeTruthy();

    // 보류 중에도 입력과 다른 옵션은 살아 있다.
    await user.clear(input());
    await user.type(input(), "melon");
    await user.click(option("Melon"));
    expect(onValueChange).toHaveBeenLastCalledWith(["melon"]);

    settle();
    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
  });

  it("reject면 항목이 복구되고 createErrorLabel이 role=alert로 뜬다", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockRejectedValue(new Error("서버 실패"));
    render(
      <Searchable
        {...createProps}
        onCreate={onCreate}
        createErrorLabel={(error) => `실패: ${(error as Error).message}`}
      />,
    );

    await user.type(input(), "kiwi");
    await user.click(screen.getByRole("option", { name: 'Create "kiwi"' }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe("실패: 서버 실패");
    const create = screen.getByRole("option", { name: 'Create "kiwi"' });
    expect(create.getAttribute("aria-disabled")).toBeNull();

    // 질의가 바뀌면 실패 문구는 사라진다.
    await user.type(input(), "x");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("createErrorLabel이 없으면 실패해도 문구 없이 항목만 복구된다", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockRejectedValue(new Error("nope"));
    render(<Searchable {...createProps} onCreate={onCreate} />);

    await user.type(input(), "kiwi");
    await user.click(screen.getByRole("option", { name: 'Create "kiwi"' }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(
      screen.getByRole("option", { name: 'Create "kiwi"' }).getAttribute("aria-disabled"),
    ).toBeNull();
  });

  it("Enter로도 만들기 항목을 고를 수 있다", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue({ value: "kiwi", label: "Kiwi" });
    render(<Searchable {...createProps} onCreate={onCreate} />);

    await user.type(input(), "kiwi");
    // 보이는 옵션이 없으니 활성은 만들기 항목 하나뿐이다.
    await user.keyboard("{Enter}");

    await waitFor(() => expect(onCreate).toHaveBeenCalledWith("kiwi"));
  });
});

describe("MultiSelect search 회귀", () => {
  it("search가 없으면 트리거는 여전히 button이고 검색 입력도 만들기 항목도 없다", async () => {
    const user = userEvent.setup();
    render(<Searchable onCreate={vi.fn()} createLabel={() => "만들기"} />);

    const trigger = screen.getByRole("combobox");
    expect(trigger.tagName).toBe("BUTTON");

    await user.click(trigger);
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(optionNames()).toEqual(["Apple", "Banana", "Blueberry", "Melon"]);
    expect(document.activeElement).toBe(option("Apple"));
  });
});
