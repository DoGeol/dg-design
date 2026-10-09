/**
 * @title DataTable
 * @summary 데이터 배열과 열 정의로 그리는 표. 정렬·필터·행 선택·열 고정·가상 스크롤을 내장한다.
 *
 * ## 언제 쓰나
 *
 * - 이미 불러온 행 데이터를 정렬하고 걸러서 보여 줄 때(관리 화면의 목록).
 * - 체크박스로 여러 행을 골라 일괄 작업을 할 때(`selectable`).
 * - 행이 많아 스크롤 가상화가 필요할 때(`virtual`).
 *
 * ## 쓰지 말 때
 *
 * - 정적인 표나 셀을 자유롭게 짜야 하면 `Table`.
 * - 서버 쪽 정렬·페이지가 필요하면 DataTable은 불러온 행만 처리한다 — `sort`·`filters`를 controlled로 두고 직접 요청하거나 `Table` + `Pagination`.
 * - 제목 + 메타 + 행 동작의 객체 목록은 `List`.
 *
 * ## 핵심 API
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `data` | `readonly T[]` | 행 데이터 |
 * | `rowKey` | 필드 이름 또는 `(row) => key` | 문자열·유한 숫자만 허용(아니면 에러) |
 * | `caption` | string | 필수. 표 이름 |
 * | `columns` | `DataColumn<T>[]` | 또는 `children` render prop의 `Column` (둘 중 하나만) |
 * | `selectable` | boolean | 체크박스 열. `selectedKeys`·`defaultSelectedKeys`·`onSelectedKeysChange` |
 * | `sort` · `defaultSort` · `onSortChange` | `{ id, direction: "asc" \| "desc" } \| null` | |
 * | `filters` · `defaultFilters` · `onFiltersChange` | `Record<열 id, 검색어>` | |
 * | `virtual` | `{ height, rowHeight, overscan? }` | 가상 스크롤. 고정 높이 |
 *
 * `DataColumn`: `header`(필수) · `field`(데이터 키) 또는 `id` + `cell`(계산 열) · `cell?` · `sortable`(true 또는 비교 함수) · `filter`(`"text"` 또는 `{ options }`) · `align`(`start`·`center`·`end`, 숫자 열은 `end`) · `width` · `pin`(`left`·`right`, `width` 필수).
 * 계산 열에 `filter`를 주려면 `filterValue`도 준다. 열 id는 유일해야 하고 열이 하나도 없으면 에러다.
 *
 * ## 접근성
 *
 * - `caption`이 표 이름이 된다. 스크롤 영역은(`virtual`이거나 내용이 넘칠 때) `"{caption} 스크롤"` region으로 키보드 포커스를 받는다.
 * - 정렬 가능한 머리글은 `"{header} 정렬"` 버튼이며 `aria-sort`가 반영된다. 필터 입력은 `"{header} 필터"` 이름을 가진다.
 * - 행 선택 체크박스 이름은 `"{caption} {rowKey} 선택"`이라 `rowKey`는 사람이 읽을 수 있는 값이 좋다. 가상 스크롤에서도 `rowKey`가 안정적이어야 선택이 유지된다.
 */
import { Badge } from "@dg-design/react/badge";
import { type DataColumn, DataTable } from "@dg-design/react/data-table";
import * as React from "react";

type Project = { id: string; name: string; owner: string; tasks: number; status: "active" | "idle" };

const projects: Project[] = [
  { id: "p1", name: "디자인 토큰 정리", owner: "김하나", tasks: 12, status: "active" },
  { id: "p2", name: "문서 개편", owner: "이둘", tasks: 4, status: "idle" },
  { id: "p3", name: "접근성 점검", owner: "박셋", tasks: 9, status: "active" },
];

const columns: DataColumn<Project>[] = [
  { field: "name", header: "이름", sortable: true, filter: "text" },
  { field: "owner", header: "담당", sortable: true },
  { field: "tasks", header: "작업 수", sortable: true, align: "end" },
  {
    id: "status",
    header: "상태",
    cell: (row) => (
      <Badge intent={row.status === "active" ? "positive" : "neutral"} variant="weak">
        {row.status === "active" ? "진행 중" : "대기"}
      </Badge>
    ),
  },
];

/** 열 배열로 정의 — 정렬·텍스트 필터, 숫자 열은 end 정렬 */
export function SortableAndFilterable() {
  return <DataTable data={projects} rowKey="id" caption="프로젝트 목록" columns={columns} defaultSort={{ id: "name", direction: "asc" }} />;
}

/** 행 선택 — 선택 키를 부모가 들고 일괄 작업에 쓴다 */
export function Selectable() {
  const [selected, setSelected] = React.useState<readonly React.Key[]>([]);
  return (
    <div style={{ display: "grid", gap: "var(--dds-dimension-x2)" }}>
      <DataTable
        data={projects}
        rowKey="id"
        caption="프로젝트 선택"
        columns={columns}
        selectable
        selectedKeys={selected}
        onSelectedKeysChange={setSelected}
      />
      <p role="status">{selected.length}개 선택됨</p>
    </div>
  );
}

/** children render prop으로 정의 — Column을 직접 그린다 */
export function ColumnChildren() {
  return (
    <DataTable data={projects} rowKey={(row) => row.id} caption="담당자별 작업">
      {({ Column }) => (
        <>
          <Column field="owner" header="담당" sortable />
          <Column field="tasks" header="작업 수" sortable align="end" />
        </>
      )}
    </DataTable>
  );
}

/** 고정 열 — pin은 width와 함께 */
export function PinnedColumn() {
  const pinned: DataColumn<Project>[] = [
    { field: "name", header: "이름", width: 200, pin: "left" },
    { field: "owner", header: "담당", width: 160 },
    { field: "tasks", header: "작업 수", width: 120, align: "end" },
  ];
  return <DataTable data={projects} rowKey="id" caption="고정 열 예시" columns={pinned} />;
}
