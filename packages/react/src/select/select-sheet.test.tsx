import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { getDialogStack } from "../internal/dialog-stack";
import { Field } from "../field/Field";
import { MultiSelect } from "../multi-select/MultiSelect";
import { Select } from "./Select";

afterEach(() => {
  delete document.documentElement.dataset.ddsDensity;
});

function Fruit(props: React.ComponentProps<typeof Select.Root>) {
  return (
    <Field.Root>
      <Field.Label>과일</Field.Label>
      <Select.Root {...props}>
        <Select.Trigger placeholder="고르기" />
        <Select.Content title="과일 고르기">
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select.Content>
      </Select.Root>
    </Field.Root>
  );
}

describe("Select presentation", () => {
  it("기본(popover)은 지금처럼 dialog 없이 listbox만 뜬다", async () => {
    const user = userEvent.setup();
    render(<Fruit />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("sheet: 모달 dialog 안 listbox로 열리고, 고르면 닫히며 초점이 트리거로 돌아온다", async () => {
    const user = userEvent.setup();
    render(<Fruit presentation="sheet" />);
    const trigger = screen.getByRole("combobox", { name: "과일" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "과일 고르기" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.contains(screen.getByRole("listbox"))).toBe(true);
    expect(getDialogStack().at(-1)?.modal).toBe(true);
    await user.click(screen.getByRole("option", { name: "Banana" }));
    expect(trigger.textContent).toContain("Banana");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("sheet: title이 없으면 Field 라벨이 dialog 이름이다", async () => {
    const user = userEvent.setup();
    render(
      <Field.Root>
        <Field.Label>정렬</Field.Label>
        <Select.Root presentation="sheet">
          <Select.Trigger />
          <Select.Content>
            <Select.Option value="a">최근</Select.Option>
          </Select.Content>
        </Select.Root>
      </Field.Root>,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("dialog", { name: "정렬" })).toBeTruthy();
  });

  it("auto: 루트 data-dds-density=mobile이면 sheet, 아니면 popover이고 속성 변화를 따른다", async () => {
    const user = userEvent.setup();
    render(<Fruit presentation="auto" />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.keyboard("{Escape}");

    await act(async () => {
      document.documentElement.dataset.ddsDensity = "mobile";
    });
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("sheet: Escape로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Fruit presentation="sheet" />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("MultiSelect presentation", () => {
  function Tags(props: React.ComponentProps<typeof MultiSelect.Root>) {
    return (
      <MultiSelect.Root searchProps={{ "aria-label": "태그 검색" }} {...props}>
        <MultiSelect.Trigger placeholder="태그" aria-label="태그" />
        <MultiSelect.Content title="태그 고르기">
          <MultiSelect.Option value="a11y">접근성</MultiSelect.Option>
          <MultiSelect.Option value="token">토큰</MultiSelect.Option>
        </MultiSelect.Content>
      </MultiSelect.Root>
    );
  }

  it("sheet: 열린 채 여러 개를 고르고 Escape로 닫는다", async () => {
    const user = userEvent.setup();
    render(<Tags presentation="sheet" />);
    await user.click(screen.getByRole("combobox", { name: "태그" }));
    const dialog = screen.getByRole("dialog", { name: "태그 고르기" });
    await user.click(screen.getByRole("option", { name: "접근성" }));
    await user.click(screen.getByRole("option", { name: "토큰" }));
    expect(screen.getByRole("dialog")).toBe(dialog);
    expect(screen.getAllByRole("option", { selected: true })).toHaveLength(2);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("sheet + search=trigger: 트리거는 버튼이 되고 검색 입력은 Sheet 안으로 옮긴다", async () => {
    const user = userEvent.setup();
    render(<Tags presentation="sheet" search="trigger" />);
    const trigger = screen.getByRole("combobox", { name: "태그" });
    expect(trigger.tagName).toBe("BUTTON");
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const search = screen.getByRole("searchbox", { name: "태그 검색" });
    expect(dialog.contains(search)).toBe(true);
    await user.type(search, "토");
    expect(screen.getAllByRole("option").map((o) => o.textContent?.trim())).toEqual(["토큰"]);
  });
});
