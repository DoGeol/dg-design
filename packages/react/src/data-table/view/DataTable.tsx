"use client";

import "../../table/table.css";
import "./data-table.css";

import * as React from "react";

import {
  columnId,
  type DataColumn,
  type DataTableFilters,
  type DataTableSelection,
  type DataTableSort,
  type RowKey,
} from "../model/data-table-model";
import { columnsFromChildren, type ColumnComponent } from "./columns";
import { DataTableBody } from "./DataTableBody";
import { DataTableHeader } from "./DataTableHeader";
import { useDataTableState } from "./use-data-table-state";
import { useVirtualViewport } from "./use-virtual-viewport";

export type DataTableVirtual = false | { height: number; rowHeight: number; overscan?: number };

type DataTableBaseProps<T> = {
  data: readonly T[];
  rowKey: RowKey<T>;
  caption: string;
  virtual?: DataTableVirtual;
  selectable?: boolean;
  sort?: DataTableSort;
  defaultSort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  filters?: DataTableFilters;
  defaultFilters?: DataTableFilters;
  onFiltersChange?: (filters: DataTableFilters) => void;
  selectedKeys?: DataTableSelection;
  defaultSelectedKeys?: DataTableSelection;
  onSelectedKeysChange?: (keys: DataTableSelection) => void;
};

export type DataTableProps<T> = DataTableBaseProps<T> &
  (
    | { columns: readonly DataColumn<T>[]; children?: never }
    | { columns?: never; children: (api: { Column: ColumnComponent<T> }) => React.ReactNode }
  );

function resolveColumns<T>(columns: readonly DataColumn<T>[]): readonly DataColumn<T>[] {
  if (columns.length === 0) throw new Error("DataTable requires at least one column.");
  const ids = columns.map(columnId);
  if (new Set(ids).size !== ids.length) throw new Error("DataTable column ids must be unique.");
  for (const column of columns) {
    if (column.width !== undefined && (!Number.isFinite(column.width) || column.width <= 0)) {
      throw new Error(`DataTable column "${columnId(column)}" requires a positive width.`);
    }
  }
  return columns;
}

function createPinStyle<T>(columns: readonly DataColumn<T>[], selectable: boolean) {
  const leftOffsets = new Map<string, number>();
  let left = selectable ? 44 : 0;
  for (const column of columns) {
    if (column.pin === "left") {
      leftOffsets.set(columnId(column), left);
      left += column.width;
    }
  }
  const rightOffsets = new Map<string, number>();
  let right = 0;
  for (const column of [...columns].reverse()) {
    if (column.pin === "right") {
      rightOffsets.set(columnId(column), right);
      right += column.width;
    }
  }
  return (column: DataColumn<T>): React.CSSProperties | undefined => {
    if (column.pin === "left") return { left: leftOffsets.get(columnId(column)) };
    if (column.pin === "right") return { right: rightOffsets.get(columnId(column)) };
    return undefined;
  };
}

export function DataTable<T>(props: DataTableProps<T>): React.ReactElement {
  const { rowKey, caption, selectable = false, virtual = false } = props;
  const columns = React.useMemo(
    () => resolveColumns(props.columns ?? columnsFromChildren(props.children)),
    [props.columns, props.children],
  );
  const orderedColumns = React.useMemo(
    () => [
      ...columns.filter((column) => column.pin === "left"),
      ...columns.filter((column) => !column.pin),
      ...columns.filter((column) => column.pin === "right"),
    ],
    [columns],
  );
  const state = useDataTableState(props, orderedColumns);
  const viewport = useVirtualViewport(virtual, state.rows, orderedColumns);
  const isVirtual = virtual !== false;
  const span = orderedColumns.length + (selectable ? 1 : 0);
  const pinStyle = React.useMemo(
    () => createPinStyle(orderedColumns, selectable),
    [orderedColumns, selectable],
  );

  return (
    <div
      ref={viewport.scrollRef}
      className="dds-table__wrapper dds-data-table__wrapper"
      style={virtual ? { height: virtual.height } : undefined}
      role={virtual || viewport.scrollable ? "region" : undefined}
      aria-label={virtual || viewport.scrollable ? `${caption} 스크롤` : undefined}
      tabIndex={virtual || viewport.scrollable ? 0 : undefined}
      onScroll={viewport.onScroll}
    >
      <table
        className={`dds-table dds-data-table${virtual ? " dds-data-table--virtual" : ""}`}
        style={virtual ? { "--dds-data-row-height": `${virtual.rowHeight}px` } as React.CSSProperties : undefined}
        aria-rowcount={virtual ? Math.max(1, state.rows.length) + 1 : undefined}
      >
        <caption className="dds-table__caption">{caption}</caption>
        <colgroup>
          {selectable ? <col style={{ width: 44 }} /> : null}
          {orderedColumns.map((column) => <col key={columnId(column)} style={column.width ? { width: column.width } : undefined} />)}
        </colgroup>
        <DataTableHeader
          columns={orderedColumns}
          caption={caption}
          selectable={selectable}
          rowCount={state.rows.length}
          allSelected={state.allSelected}
          someSelected={state.someSelected}
          sort={state.sort}
          filters={state.filters}
          virtual={isVirtual}
          pinStyle={pinStyle}
          onSort={state.onSort}
          onFilter={state.onFilter}
          onToggleAll={state.onToggleAll}
        />
        <DataTableBody
          rows={state.rows}
          columns={orderedColumns}
          rowKey={rowKey}
          caption={caption}
          selectable={selectable}
          selectedSet={state.selectedSet}
          virtual={virtual}
          range={viewport.range}
          span={span}
          pinStyle={pinStyle}
          onToggleRow={state.onToggleRow}
        />
      </table>
    </div>
  );
}
