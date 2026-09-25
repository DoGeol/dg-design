import type * as React from "react";

export type DataTableSort = { id: string; direction: "asc" | "desc" } | null;
export type DataTableFilters = Record<string, string>;
export type DataTableSelection = readonly React.Key[];
export type RowKey<T> = Extract<keyof T, string> | ((row: T) => React.Key);

export type DataTableFilter =
  | "text"
  | { options: readonly { label: string; value: string }[] };

type Comparator<T> = (a: T, b: T) => number;

type ColumnWidth =
  | { width?: number; pin?: undefined }
  | { width: number; pin: "left" | "right" };

type ColumnBase = {
  header: string;
} & ColumnWidth;

type FieldColumn<T> = ColumnBase & {
  field: Extract<keyof T, string>;
  id?: never;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean | Comparator<T>;
  filter?: DataTableFilter;
  filterValue?: never;
};

type ComputedColumn<T> = ColumnBase & {
  id: string;
  field?: never;
  cell: (row: T) => React.ReactNode;
  sortable?: false | Comparator<T>;
} & (
    | { filter?: undefined; filterValue?: never }
    | { filter: DataTableFilter; filterValue: (row: T) => unknown }
  );

export type DataColumn<T> = FieldColumn<T> | ComputedColumn<T>;

export function columnId<T>(column: DataColumn<T>): string {
  if (column.field !== undefined) return column.field;
  if (column.id !== undefined) return column.id;
  throw new Error("DataTable column requires a field or id");
}

export function rowKeyOf<T>(row: T, rowKey: RowKey<T>): React.Key {
  const key: unknown = typeof rowKey === "function" ? rowKey(row) : row[rowKey];
  if (typeof key === "string" || (typeof key === "number" && Number.isFinite(key))) {
    return key;
  }
  throw new Error(
    `DataTable rowKey${typeof rowKey === "string" ? ` "${rowKey}"` : ""} must resolve to a string or finite number`,
  );
}

const textCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compareValues(a: unknown, b: unknown): number {
  if (a == null) return b == null ? 0 : 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return textCollator.compare(String(a), String(b));
}

function fieldValue<T>(column: DataColumn<T>, row: T): unknown {
  return column.field === undefined ? column.filterValue?.(row) : row[column.field];
}

/** Filter the loaded rows, then sort them without mutating the input or calling cell renderers. */
export function processRows<T>(
  data: readonly T[],
  columns: readonly DataColumn<T>[],
  sort: DataTableSort,
  filters: DataTableFilters,
): readonly T[] {
  const activeFilters = Object.entries(filters).flatMap(([id, query]) => {
    if (query === "") return [];
    const column = columns.find((item) => columnId(item) === id);
    return column?.filter ? [{ column, query, foldedQuery: query.toLocaleLowerCase() }] : [];
  });

  const filtered = activeFilters.length
    ? data.filter((row) =>
        activeFilters.every(({ column, query, foldedQuery }) => {
          const value = fieldValue(column, row);
          const text = value == null ? "" : String(value);
          return column.filter === "text"
            ? text.toLocaleLowerCase().includes(foldedQuery)
            : text === query;
        }),
      )
    : data;

  if (!sort) return filtered;
  const sortColumn = columns.find((column) => columnId(column) === sort.id);
  if (!sortColumn?.sortable) return filtered;

  const comparator: Comparator<T> =
    typeof sortColumn.sortable === "function"
      ? sortColumn.sortable
      : (a, b) => compareValues(fieldValue(sortColumn, a), fieldValue(sortColumn, b));
  const direction = sort.direction === "asc" ? 1 : -1;

  return filtered
    .map((row, index) => ({ row, index }))
    .sort((a, b) => direction * comparator(a.row, b.row) || a.index - b.index)
    .map(({ row }) => row);
}
