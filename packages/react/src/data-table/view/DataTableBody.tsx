import * as React from "react";

import { Checkbox } from "../../checkbox/Checkbox";
import { columnId, rowKeyOf, type DataColumn, type RowKey } from "../model/data-table-model";

type DataTableBodyProps<T> = {
  rows: readonly T[];
  columns: readonly DataColumn<T>[];
  rowKey: RowKey<T>;
  caption: string;
  selectable: boolean;
  selectedSet: ReadonlySet<React.Key>;
  virtual: false | { rowHeight: number };
  range: { first: number; end: number };
  span: number;
  pinStyle: (column: DataColumn<T>) => React.CSSProperties | undefined;
  onToggleRow: (key: React.Key) => void;
};

export function DataTableBody<T>({
  rows,
  columns,
  rowKey,
  caption,
  selectable,
  selectedSet,
  virtual,
  range,
  span,
  pinStyle,
  onToggleRow,
}: DataTableBodyProps<T>): React.ReactElement {
  return (
    <tbody className="dds-table__body">
      {virtual && range.first > 0 ? <tr aria-hidden="true" className="dds-data-table__spacer"><td colSpan={span} style={{ height: range.first * virtual.rowHeight }} /></tr> : null}
      {rows.slice(range.first, range.end).map((row, offset) => {
        const index = range.first + offset;
        const key = rowKeyOf(row, rowKey);
        return (
          <tr key={key} data-row-index={index} aria-rowindex={virtual ? index + 2 : undefined} className="dds-table__row dds-data-table__row" style={virtual ? { height: virtual.rowHeight } : undefined}>
            {selectable ? (
              <td className="dds-table__cell dds-data-table__pinned dds-data-table__select" style={{ left: 0 }}>
                <Checkbox aria-label={`${caption} ${String(key)} 선택`} checked={selectedSet.has(key)} motion="none" onChange={() => onToggleRow(key)} />
              </td>
            ) : null}
            {columns.map((column) => (
              <td key={columnId(column)} className={`dds-table__cell${column.pin ? " dds-data-table__pinned" : ""}`} style={pinStyle(column)}>
                <span className="dds-data-table__cell-content">{column.cell ? column.cell(row) : column.field === undefined || row[column.field] == null ? "" : String(row[column.field])}</span>
              </td>
            ))}
          </tr>
        );
      })}
      {virtual && range.end < rows.length ? <tr aria-hidden="true" className="dds-data-table__spacer"><td colSpan={span} style={{ height: (rows.length - range.end) * virtual.rowHeight }} /></tr> : null}
      {rows.length === 0 ? <tr className="dds-table__row" aria-rowindex={virtual ? 2 : undefined}><td className="dds-table__cell dds-data-table__empty" colSpan={span}>표시할 데이터가 없습니다.</td></tr> : null}
    </tbody>
  );
}
