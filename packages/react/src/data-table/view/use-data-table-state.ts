import * as React from "react";

import { useControllableState } from "../../internal/use-controllable-state";
import {
  processRows,
  rowKeyOf,
  type DataColumn,
  type DataTableFilters,
  type DataTableSelection,
  type DataTableSort,
} from "../model/data-table-model";
import type { DataTableProps } from "./DataTable";

const EMPTY_FILTERS: DataTableFilters = {};
const EMPTY_SELECTION: DataTableSelection = [];

function nextSort(current: DataTableSort, id: string): DataTableSort {
  if (current?.id !== id) return { id, direction: "asc" };
  if (current.direction === "asc") return { id, direction: "desc" };
  return null;
}

export function useDataTableState<T>(props: DataTableProps<T>, columns: readonly DataColumn<T>[]) {
  const [sort, setSort] = useControllableState<DataTableSort>({
    value: props.sort,
    controlled: "sort" in props,
    defaultValue: props.defaultSort ?? null,
    onChange: props.onSortChange,
  });
  const [filters, setFilters] = useControllableState<DataTableFilters>({
    value: props.filters,
    controlled: "filters" in props,
    defaultValue: props.defaultFilters ?? {},
    onChange: props.onFiltersChange,
  });
  const [selectedKeys, setSelectedKeys] = useControllableState<DataTableSelection>({
    value: props.selectedKeys,
    controlled: "selectedKeys" in props,
    defaultValue: props.defaultSelectedKeys ?? [],
    onChange: props.onSelectedKeysChange,
  });
  const effectiveFilters = filters ?? EMPTY_FILTERS;
  const effectiveSelectedKeys = selectedKeys ?? EMPTY_SELECTION;
  const rows = React.useMemo(
    () => processRows(props.data, columns, sort, effectiveFilters),
    [props.data, columns, sort, effectiveFilters],
  );
  const selectedSet = React.useMemo(() => new Set(effectiveSelectedKeys), [effectiveSelectedKeys]);
  const selectedCount = React.useMemo(() => {
    if (!props.selectable) return 0;
    let count = 0;
    for (const row of rows) if (selectedSet.has(rowKeyOf(row, props.rowKey))) count++;
    return count;
  }, [rows, selectedSet, props.selectable, props.rowKey]);
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function setFilter(id: string, value: string) {
    const next = { ...effectiveFilters };
    if (value) next[id] = value;
    else delete next[id];
    setFilters(next);
  }

  function toggleRow(key: React.Key) {
    const next = new Set(effectiveSelectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedKeys([...next]);
  }

  function toggleAll() {
    const next = new Set(effectiveSelectedKeys);
    for (const row of rows) {
      const key = rowKeyOf(row, props.rowKey);
      if (allSelected) next.delete(key);
      else next.add(key);
    }
    setSelectedKeys([...next]);
  }

  return {
    rows,
    sort,
    filters: effectiveFilters,
    selectedSet,
    allSelected,
    someSelected,
    onSort: (id: string) => setSort(nextSort(sort, id)),
    onFilter: setFilter,
    onToggleRow: toggleRow,
    onToggleAll: toggleAll,
  };
}
