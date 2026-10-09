import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, DataTable, type DataColumn } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { HoverRow, POSTS, STATUS_INTENT, Surface, num, tableRow, type Post } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/DataTable", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 숫자 열은 `align: "end"`(머리글·본문 끝 정렬, 정렬 아이콘은 라벨 앞). 고정폭 숫자는 셀 안 span(fx-num)이 맡는다. */
const COLUMNS: DataColumn<Post>[] = [
  { field: "title", header: "제목", sortable: true, width: 128, pin: "left" },
  { field: "views", header: "조회수", sortable: true, width: 84, align: "end", cell: (p) => <span className="fx-num">{num(p.views)}</span> },
  { field: "comments", header: "댓글", width: 64, align: "end", cell: (p) => <span className="fx-num">{num(p.comments)}</span> },
  { field: "status", header: "상태", width: 80, cell: (p) => <Badge intent={STATUS_INTENT[p.status]}>{p.status}</Badge> },
];
const FILTERED: DataColumn<Post>[] = [{ ...COLUMNS[0]!, filter: "text" } as DataColumn<Post>, ...COLUMNS.slice(1)];

const SELECTED = ["P-102", "P-103"];
/** caption(8+18+8)과 머리글(12+18+12+선 1)이 스크롤 영역 안에 있어 그만큼 더해야 rows개 행이 보인다. */
const viewport = (rowHeight: number, rows: number) => ({ height: 80 + rowHeight * rows, rowHeight });

function Posts({ rowHeight, rows = 5, selected = SELECTED, hover }: { rowHeight: number; rows?: number; selected?: string[]; hover?: number }) {
  const table = (
    <DataTable
      data={POSTS}
      rowKey="id"
      caption="글 목록"
      columns={COLUMNS}
      selectable
      defaultSort={{ id: "views", direction: "desc" }}
      defaultSelectedKeys={selected}
      virtual={viewport(rowHeight, rows)}
    />
  );
  return <Surface style={{ padding: "0 4px" }}>{hover === undefined ? table : <HoverRow index={hover}>{table}</HoverRow>}</Surface>;
}

function View({ v }: { v: Flex }) {
  const isA = v.variant === "a";
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const row = tableRow(v);
  return (
    <FlexPage
      v={v}
      title="DataTable"
      summary={
        isB
          ? "표가 맞는 과업인지 먼저 고르고, 행 높이는 현재 44px을 유지합니다. 검색·필터 toolbox는 앱이 조합합니다."
          : isA
            ? "한 줄 가상 행에 compact 44 / comfortable 52 두 밀도를 둡니다. CSS 행 높이와 virtual.rowHeight를 같은 값으로 넘깁니다."
            : "현재 DDS DataTable입니다. 행 높이는 소비자가 virtual.rowHeight로 정합니다."
      }
    >
      <FlexSection
        title={isA ? "밀도" : "행 높이"}
        columns={1}
        note={isA
          ? "밀도는 CSS 변수만 바꾸지 않고 virtual.rowHeight·고정 열 offset·colgroup과 함께 바꿉니다. 두 줄 내용은 별도 높이가 필요합니다."
          : `행 높이 ${row}px — table-row 역할 값을 JS virtual.rowHeight로 그대로 넘깁니다.`}
      >
        <FlexState label={isA ? `compact · rowHeight ${row}` : `rowHeight ${row} · 조회수 내림차순`} block>
          <Posts rowHeight={row} />
        </FlexState>
        {isA && (
          <FlexState label="comfortable · rowHeight 52" block>
            <Posts rowHeight={52} rows={4} />
          </FlexState>
        )}
      </FlexSection>

      <FlexSection
        title="선택"
        columns={1}
        note={current
          ? "선택 행에 hover가 겹치면 고정 열(체크·제목)만 중성 표면으로 바뀌어 행이 두 색으로 갈립니다. 일반 hover도 고정 열과 나머지 셀의 톤이 다릅니다."
          : "선택 행은 체크 + bg-brand-weak. hover가 겹치면 고정 열까지 bg-brand-weak-hover로 함께 바뀌고 체크는 남습니다. 일반 hover도 행 전체 한 톤입니다. 머리글은 일부 선택(indeterminate)입니다."}
      >
        <FlexState label="selected + hover · 셋째 행" block>
          <Posts rowHeight={row} rows={3} hover={2} />
        </FlexState>
        <FlexState label="hover · 선택 안 된 첫 행" block>
          <Posts rowHeight={row} rows={3} hover={0} />
        </FlexState>
      </FlexSection>

      <FlexSection title="빈 결과" note="머리글 필터는 높이 32·반경 8 입력입니다. 결과가 없으면 표 안 한 줄로 알립니다 — 조건 초기화는 바깥 toolbox가 맡습니다.">
        <FlexState label="empty · 제목 필터 일치 없음" block>
          <Surface style={{ padding: "0 4px" }}>
            <DataTable data={POSTS} rowKey="id" caption="글 목록" columns={FILTERED} selectable defaultFilters={{ title: "없는 글" }} />
          </Surface>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["table-row"]} extra={[
        ...(isA ? [["comfortable 행", "52px", "C 연구 proposed — virtual.rowHeight와 같은 값 필수"] as const] : []),
        ["선택 열 폭", "44px", "D 현재 값(JS pin offset과 공유)"],
        ["머리글 필터", "32px · r8", "D 현재 값"],
        ["hover 표면", current ? "고정 열 bg-neutral-weak · 나머지 bg-transparent-hover" : "행 전체 bg-neutral-weak", current ? "현재 동작(두 톤)" : "C 고정 열 불투명 표면과 한 톤(A·B 공통)"],
        ["선택 행 표면", current ? "bg-brand-weak (hover 시 고정 열만 bg-neutral-weak)" : "bg-brand-weak → hover bg-brand-weak-hover", current ? "현재 동작" : "C 선택+hover 조합 유지(A·B 공통)"],
        ["숫자 셀", current ? "왼쪽 정렬" : "끝 정렬 + tabular-nums (머리글은 API 없음)", current ? "현재 동작" : "C — 머리글 정렬은 DataColumn align 보완 필요"],
        ["toolbox", isB ? "앱 조합 (결과 수·초기화)" : isA ? "외부 Toolbar (검색·필터·선택 수·일괄 행동)" : "없음", "Scenarios/CompareTable 참조"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1200} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={1200} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
