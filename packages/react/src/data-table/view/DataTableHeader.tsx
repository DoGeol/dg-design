import clsx from "clsx";
import * as React from "react";

import { Checkbox } from "../../checkbox/Checkbox";
import { alignClass, columnId, type DataColumn, type DataTableFilters, type DataTableSort } from "../model/data-table-model";

type DataTableHeaderProps<T> = {
  columns: readonly DataColumn<T>[];
  caption: string;
  selectable: boolean;
  rowCount: number;
  allSelected: boolean;
  someSelected: boolean;
  sort: DataTableSort;
  filters: DataTableFilters;
  virtual: boolean;
  pinStyle: (column: DataColumn<T>) => React.CSSProperties | undefined;
  onSort: (id: string) => void;
  onFilter: (id: string, value: string) => void;
  onToggleAll: () => void;
};

export function DataTableHeader<T>({
  columns,
  caption,
  selectable,
  rowCount,
  allSelected,
  someSelected,
  sort,
  filters,
  virtual,
  pinStyle,
  onSort,
  onFilter,
  onToggleAll,
}: DataTableHeaderProps<T>): React.ReactElement {
  return (
    <thead className="dds-table__header">
      <tr className="dds-table__row" aria-rowindex={virtual ? 1 : undefined}>
        {selectable ? (
          <th scope="col" className="dds-table__head dds-data-table__pinned dds-data-table__select" style={{ left: 0 }}>
            <Checkbox
              aria-label={`${caption} 필터 결과 전체 선택`}
              checked={allSelected}
              disabled={rowCount === 0}
              indeterminate={someSelected}
              motion="none"
              onChange={onToggleAll}
            />
          </th>
        ) : null}
        {columns.map((column) => {
          const id = columnId(column);
          const direction = sort?.id === id ? sort.direction : undefined;
          return (
            <th
              key={id}
              scope="col"
              className={clsx("dds-table__head", column.pin && "dds-data-table__pinned", alignClass(column))}
              style={pinStyle(column)}
              aria-sort={column.sortable ? (direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none") : undefined}
            >
              <div className="dds-data-table__heading">
                {column.sortable ? (
                  <button type="button" className="dds-data-table__sort" aria-label={`${column.header} 정렬`} onClick={() => onSort(id)}>
                    {column.header}<SortIcon direction={direction} />
                  </button>
                ) : column.header}
              </div>
              {column.filter ? column.filter === "text" ? (
                <input className="dds-data-table__filter" type="search" aria-label={`${column.header} 필터`} value={filters[id] ?? ""} onChange={(event) => onFilter(id, event.target.value)} />
              ) : (
                <select className="dds-data-table__filter" aria-label={`${column.header} 필터`} value={filters[id] ?? ""} onChange={(event) => onFilter(id, event.target.value)}>
                  <option value="">전체</option>
                  {column.filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : null}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

const SORT_PATH = { asc: "M4 10l4-4 4 4", desc: "M4 6l4 4 4-4", none: "M5 6.5l3-3 3 3M5 9.5l3 3 3-3" } as const;

/** 저장소에 아이콘 모듈이 없다(Pagination 선례) — 정렬 방향 셰브론을 로컬로 둔다. */
function SortIcon({ direction }: { direction?: "asc" | "desc" }) {
  return (
    <svg className="dds-data-table__sort-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={SORT_PATH[direction ?? "none"]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
