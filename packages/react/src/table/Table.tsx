import "./table.css";

import clsx from "clsx";
import * as React from "react";

export interface TableRootProps extends React.TableHTMLAttributes<HTMLTableElement> {}

/**
 * 어드민 표는 뷰포트를 쉽게 넘친다 — table을 overflow-x:auto div로 감싼다.
 * 래퍼는 고정 클래스만 쓰는 순수 레이아웃 요소라 className·ref·나머지 props는
 * 전부 table에 그대로 간다 (시맨틱은 getByRole("table")이 그대로 잡도록 유지,
 * 래퍼 자체를 확장하는 통로는 두지 않음 — sticky·정렬 등 옵션 없음 방침과 동일 선상).
 */
const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  ({ className, ...props }, ref) => (
    <div className="dds-table__wrapper">
      <table ref={ref} className={clsx("dds-table", className)} {...props} />
    </div>
  ),
);
TableRoot.displayName = "Table.Root";

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={clsx("dds-table__header", className)} {...props} />
  ),
);
TableHeader.displayName = "Table.Header";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={clsx("dds-table__body", className)} {...props} />
  ),
);
TableBody.displayName = "Table.Body";

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={clsx("dds-table__footer", className)} {...props} />
  ),
);
TableFooter.displayName = "Table.Footer";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={clsx("dds-table__row", className)} {...props} />
  ),
);
TableRow.displayName = "Table.Row";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

// scope 기본값 "col": Head는 대부분 헤더 행의 열 머리글로 쓰인다. 행 머리글로 쓸
// 드문 경우는 소비자가 scope="row"를 넘겨 덮어쓸 수 있다 (신규 prop 아님, 네이티브 th 속성).
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, scope = "col", ...props }, ref) => (
    <th ref={ref} scope={scope} className={clsx("dds-table__head", className)} {...props} />
  ),
);
TableHead.displayName = "Table.Head";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={clsx("dds-table__cell", className)} {...props} />
  ),
);
TableCell.displayName = "Table.Cell";

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={clsx("dds-table__caption", className)} {...props} />
  ),
);
TableCaption.displayName = "Table.Caption";

/**
 * compound: Table.Root/Header/Body/Footer/Row/Head/Cell/Caption.
 * 정렬·필터·선택·가상화 등 데이터 로직은 없다 — 스타일드 마크업만 제공하고
 * 나머지는 소비자(tanstack 등) 몫이다.
 */
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
};
