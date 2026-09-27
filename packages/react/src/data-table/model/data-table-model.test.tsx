import { describe, expect, it, vi } from "vitest";

import {
  columnId,
  processRows,
  rowKeyOf,
  type DataColumn,
  type DataTableSelection,
} from "./data-table-model";

type Row = { id: number; name: string; status: string; score: number };

const rows: readonly Row[] = Object.freeze([
  { id: 1, name: "Ana", status: "open", score: 2 },
  { id: 2, name: "bob", status: "closed", score: 1 },
  { id: 3, name: "ann", status: "open", score: 2 },
]);

const columns: readonly DataColumn<Row>[] = [
  { field: "name", header: "Name", filter: "text", sortable: true },
  {
    field: "status",
    header: "Status",
    filter: { options: [{ label: "Open", value: "open" }] },
  },
  { field: "score", header: "Score", sortable: true, pin: "right", width: 80 },
];

describe("DataTable model", () => {
  it("keeps source order stable and untouched while filtering then sorting", () => {
    const result = processRows(rows, columns, { id: "score", direction: "desc" }, {
      status: "open",
    });

    expect(result.map((row) => row.id)).toEqual([1, 3]);
    expect(rows.map((row) => row.id)).toEqual([1, 2, 3]);
    expect(result).not.toBe(rows);
  });

  it("filters text case insensitively and options by exact value", () => {
    expect(processRows(rows, columns, null, { name: "AN" }).map((row) => row.id)).toEqual([
      1, 3,
    ]);
    expect(processRows(rows, columns, null, { status: "op" })).toEqual([]);
    expect(processRows(rows, columns, null, { unknown: "x" })).toBe(rows);
  });

  it("sorts numerically and resolves row identity independently of position", () => {
    const sorted = processRows(rows, columns, { id: "score", direction: "asc" }, {});
    const selected: DataTableSelection = [3];

    expect(sorted.map((row) => row.id)).toEqual([2, 1, 3]);
    expect(sorted.filter((row) => selected.includes(rowKeyOf(row, "id"))).map((row) => row.id)).toEqual([3]);
    expect(rowKeyOf(rows[0]!, (row) => `row-${row.id}`)).toBe("row-1");
    expect(columnId(columns[0]!)).toBe("name");
  });

  it("rejects invalid row identities before React keys or selection can collide", () => {
    expect(() => rowKeyOf({ id: null }, "id")).toThrow(/rowKey "id"/);
    expect(() => rowKeyOf(rows[0]!, () => Number.NaN)).toThrow(/finite number/);
    expect(() => rowKeyOf({ id: 1n }, "id")).toThrow(/string or finite number/);
  });

  it("uses computed accessors and comparators without evaluating cells", () => {
    const cell = vi.fn((row: Row) => row.name);
    const computed: readonly DataColumn<Row>[] = [
      {
        id: "display",
        header: "Display",
        cell,
        sortable: (a, b) => a.name.localeCompare(b.name),
        filter: "text",
        filterValue: (row) => row.name,
      },
    ];

    expect(
      processRows(rows, computed, { id: "display", direction: "asc" }, { display: "an" }).map(
        (row) => row.id,
      ),
    ).toEqual([1, 3]);
    expect(cell).not.toHaveBeenCalled();
  });
});

// Compile-time contract for both column forms.
const typedColumn: DataColumn<Row> = { field: "name", header: "Name", cell: (row) => row.name };
void typedColumn;
// @ts-expect-error unknown data field
const unknownField: DataColumn<Row> = { field: "missing", header: "Missing" };
void unknownField;
// @ts-expect-error pinned columns need a width
const unmeasuredPin: DataColumn<Row> = { field: "name", header: "Name", pin: "left" };
void unmeasuredPin;
// @ts-expect-error computed sorting needs a row comparator
const computedSortWithoutComparator: DataColumn<Row> = { id: "computed", header: "Computed", cell: (row) => row.name, sortable: true };
void computedSortWithoutComparator;
// @ts-expect-error computed filters need a value accessor
const computedFilterWithoutValue: DataColumn<Row> = { id: "computed", header: "Computed", cell: (row) => row.name, filter: "text" };
void computedFilterWithoutValue;
