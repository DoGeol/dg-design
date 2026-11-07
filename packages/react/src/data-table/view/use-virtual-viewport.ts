import * as React from "react";

import type { DataColumn, DataTableFilters, DataTableSort } from "../model/data-table-model";
import type { DataTableVirtual } from "./DataTable";

function visibleRange(count: number, scrollTop: number, height: number, rowHeight: number, overscan: number) {
  const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(count, first + Math.ceil(height / rowHeight) + overscan * 2 + 1);
  return { first, end };
}

function useScrollability<T>(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  isVirtual: boolean,
  columns: readonly DataColumn<T>[],
  rows: readonly T[],
) {
  const [scrollable, setScrollable] = React.useState(false);

  React.useEffect(() => {
    if (isVirtual) return;
    const element = scrollRef.current;
    if (!element) return;
    const measure = () => setScrollable(element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(element);
    const table = element.querySelector("table");
    if (table) observer?.observe(table);
    element.ownerDocument.defaultView?.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      element.ownerDocument.defaultView?.removeEventListener("resize", measure);
    };
  }, [scrollRef, isVirtual, columns, rows]);

  return scrollable;
}

type ViewportSource<T> = { data: readonly T[]; sort: DataTableSort; filters: DataTableFilters };

export function useVirtualViewport<T>(
  virtual: DataTableVirtual,
  rows: readonly T[],
  columns: readonly DataColumn<T>[],
  source: ViewportSource<T>,
) {
  const isVirtual = virtual !== false;
  if (virtual && (
    !Number.isFinite(virtual.height) || virtual.height <= 0 ||
    !Number.isFinite(virtual.rowHeight) || virtual.rowHeight <= 0 ||
    (virtual.overscan !== undefined && (!Number.isInteger(virtual.overscan) || virtual.overscan < 0))
  )) {
    throw new Error("DataTable virtual requires positive height and rowHeight, and a nonnegative integer overscan.");
  }

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollable = useScrollability(scrollRef, isVirtual, columns, rows);
  const viewportHeight = virtual ? virtual.height : 0;
  const rowHeight = virtual ? virtual.rowHeight : 0;
  const overscan = virtual ? virtual.overscan ?? 4 : 0;
  // rows는 인라인 columns만 바뀌어도 새 배열이라, 그 정체성에 걸면 부모 리렌더마다 스크롤이 맨 위로 튄다.
  // 실제 원본·정렬·필터 변경에만 건다 — controlled 인라인 리터럴도 값이 같으면 유지되도록 직렬화한다.
  const sortKey = JSON.stringify(source.sort);
  const filtersKey = JSON.stringify(source.filters);
  const resetKey = React.useMemo(
    () => Symbol("DataTable viewport"),
    [source.data, sortKey, filtersKey, viewportHeight, rowHeight, overscan, isVirtual],
  );
  const [scrollState, setScrollState] = React.useState({ key: resetKey, top: 0 });
  // A changed row model renders its first window immediately, before the DOM scroll reset effect runs.
  const scrollTop = scrollState.key === resetKey ? scrollState.top : 0;
  const range = virtual ? visibleRange(rows.length, scrollTop, viewportHeight, rowHeight, overscan) : { first: 0, end: rows.length };

  React.useEffect(() => {
    if (!isVirtual) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [resetKey, isVirtual]);

  function onScroll(event: React.UIEvent<HTMLDivElement>) {
    if (!virtual) return;
    const element = event.currentTarget;
    const next = visibleRange(rows.length, element.scrollTop, virtual.height, virtual.rowHeight, overscan);
    const active = element.ownerDocument.activeElement;
    if (active instanceof HTMLElement && element.contains(active)) {
      const activeRow = active.closest<HTMLTableRowElement>("tr[data-row-index]");
      const index = activeRow && Number(activeRow.dataset.rowIndex);
      if (index !== null && index !== undefined && (index < next.first || index >= next.end)) {
        element.focus({ preventScroll: true });
      }
    }
    setScrollState({ key: resetKey, top: element.scrollTop });
  }

  return { scrollRef, scrollable, range, onScroll };
}
