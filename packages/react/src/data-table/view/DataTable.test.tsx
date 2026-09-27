import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import type { DataColumn } from "../model";
import { DataTable } from "./DataTable";

type Person = { id: number; name: string; status: string };

const people: Person[] = [
  { id: 2, name: "Beta", status: "active" },
  { id: 1, name: "Alpha", status: "inactive" },
];

const columns: DataColumn<Person>[] = [
  { field: "name", header: "이름", sortable: true, filter: "text" },
  { field: "status", header: "상태", filter: { options: [{ label: "활성", value: "active" }] } },
];

// This function is typechecked but never rendered: both public declaration forms reject typos.
function typecheckColumnTags() {
  return (
    <DataTable data={people} rowKey="id" caption="사람">
      {({ Column }) => (
        <>
          <Column field="name" header="이름" cell={(person) => person.name} />
          <Column field="name" header="타입 확인" cell={(person) => {
            // @ts-expect-error cell receives Person, not any
            return person.naem;
          }} />
          {/* @ts-expect-error unknown fields must fail in the tag form too */}
          <Column field="naem" header="오타" />
        </>
      )}
    </DataTable>
  );
}
void typecheckColumnTags;

describe("DataTable", () => {
  it("빈 열과 중복 열 ID를 사용 전에 알린다", () => {
    expect(() => render(<DataTable data={people} rowKey="id" caption="사람" columns={[]} />)).toThrow(/at least one column/);
    expect(() => render(<DataTable data={people} rowKey="id" caption="사람" columns={[columns[0]!, columns[0]!]} />)).toThrow(/ids must be unique/);
  });

  it("열 배열과 render prop 태그가 동일한 표와 셀을 만든다", () => {
    const array = render(<DataTable data={people} rowKey="id" caption="사람" columns={columns} />);
    const arrayTable = array.getByRole("table").outerHTML;
    array.unmount();

    render(
      <DataTable data={people} rowKey="id" caption="사람">
        {({ Column }) => [
          <React.Fragment key="columns">
            <Column field="name" header="이름" sortable filter="text" />
            {null}
          </React.Fragment>,
          <Column key="status" field="status" header="상태" filter={{ options: [{ label: "활성", value: "active" }] }} />,
        ]}
      </DataTable>,
    );

    expect(screen.getByRole("table").outerHTML).toBe(arrayTable);
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("정렬·필터·행 선택은 현재 결과의 안정적인 ID를 사용한다", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} rowKey="id" caption="사람" columns={columns} selectable />);

    await user.click(screen.getByRole("button", { name: "이름 정렬" }));
    expect(screen.getAllByRole("row")[1]?.textContent).toContain("Alpha");
    expect(screen.getByRole("columnheader", { name: /이름/ }).getAttribute("aria-sort")).toBe("ascending");

    await user.click(screen.getByRole("checkbox", { name: "사람 1 선택" }));
    await user.type(screen.getByRole("searchbox", { name: "이름 필터" }), "beta");
    expect(screen.getAllByRole("row")).toHaveLength(2);
    await user.click(screen.getByRole("checkbox", { name: "사람 필터 결과 전체 선택" }));
    expect((screen.getByRole("checkbox", { name: "사람 2 선택" }) as HTMLInputElement).checked).toBe(true);

    await user.clear(screen.getByRole("searchbox", { name: "이름 필터" }));
    expect((screen.getByRole("checkbox", { name: "사람 1 선택" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("checkbox", { name: "사람 2 선택" }) as HTMLInputElement).checked).toBe(true);
    expect(people.map((person) => person.id)).toEqual([2, 1]);
  });

  it("controlled 정렬은 부모가 값을 갱신할 때만 화면을 바꾼다", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<DataTable data={people} rowKey="id" caption="사람" columns={columns} sort={null} onSortChange={onSortChange} />);

    await user.click(screen.getByRole("button", { name: "이름 정렬" }));
    expect(onSortChange).toHaveBeenCalledWith({ id: "name", direction: "asc" });
    expect(screen.getAllByRole("row")[1]?.textContent).toContain("Beta");
  });

  it("명시적 undefined controlled 값은 빈 필터·선택으로 취급한다", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    const onSelectedKeysChange = vi.fn();
    render(
      <DataTable
        data={people}
        rowKey="id"
        caption="사람"
        columns={columns}
        selectable
        filters={undefined}
        selectedKeys={undefined}
        onFiltersChange={onFiltersChange}
        onSelectedKeysChange={onSelectedKeysChange}
      />,
    );
    await user.type(screen.getByRole("searchbox", { name: "이름 필터" }), "a");
    await user.click(screen.getByRole("checkbox", { name: "사람 1 선택" }));
    expect(onFiltersChange).toHaveBeenCalled();
    expect(onSelectedKeysChange).toHaveBeenCalledWith([1]);
  });

  it("가상 모드는 1만 행에서 보이는 셀만 호출하고 실제 인덱스를 노출한다", () => {
    const cell = vi.fn((row: { id: number }) => row.id);
    const data = Array.from({ length: 10_000 }, (_, id) => ({ id }));
    render(<DataTable data={data} rowKey="id" caption="대량 데이터" columns={[{ id: "value", header: "값", cell }]} virtual={{ height: 480, rowHeight: 44 }} />);

    const table = screen.getByRole("table", { name: "대량 데이터" });
    expect(table.getAttribute("aria-rowcount")).toBe("10001");
    expect(within(table).getAllByRole("row").filter((row) => row.hasAttribute("data-row-index")).length).toBeLessThanOrEqual(30);
    expect(cell.mock.calls.length).toBeLessThanOrEqual(30);
    expect(table.querySelector("tr[data-row-index='0']")?.getAttribute("aria-rowindex")).toBe("2");
    expect(screen.getByRole("region", { name: "대량 데이터 스크롤" }).getAttribute("tabindex")).toBe("0");
  });

  it("필터 결과가 없으면 표 안에 안내한다", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} rowKey="id" caption="사람" columns={columns} />);
    await user.type(screen.getByRole("searchbox", { name: "이름 필터" }), "nobody");
    expect(within(screen.getByRole("table")).getByText("표시할 데이터가 없습니다.")).toBeTruthy();
  });
});
