import * as React from "react";

import type { DataColumn } from "../model/data-table-model";

export type ColumnComponent<T> = (props: DataColumn<T>) => React.ReactElement | null;

/** Only descriptors directly returned by the render prop are inspected. */
export function columnsFromChildren<T>(
  render: (api: { Column: ColumnComponent<T> }) => React.ReactNode,
): readonly DataColumn<T>[] {
  const Column: ColumnComponent<T> = () => null;
  const columns: DataColumn<T>[] = [];

  function visit(node: React.ReactNode): void {
    if (node == null || typeof node === "boolean") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!React.isValidElement(node)) {
      throw new Error("DataTable children must contain only Column elements.");
    }
    if (node.type === React.Fragment) {
      visit((node.props as { children?: React.ReactNode }).children);
      return;
    }
    if (node.type !== Column) {
      throw new Error("DataTable children must contain only Column elements.");
    }
    columns.push(node.props as DataColumn<T>);
  }

  visit(render({ Column }));
  return columns;
}
