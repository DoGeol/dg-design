import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Badge, Button, DataTable, Select, Tabs, TextField, type DataColumn } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { ChipStandIn, POSTS, STATUS_INTENT, SearchIcon, Surface, num, tableRow, type Post, type PostStatus } from "../data-feedback/shared";

const meta = { title: "Mockups/Flex/Scenarios/CompareTable", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const TABS: readonly [string, string, readonly PostStatus[] | null][] = [
  ["all", "전체", null], ["published", "발행", ["발행"]], ["writing", "작성 중", ["검토", "초안"]], ["archived", "보관", ["보관"]],
];

/** 데스크톱 표본 폭(약 400px)에 맞춘 열. 오른쪽 고정 열은 좁은 폭에서 끝 정렬 숫자를 덮어 쓰지 않는다. */
const COLUMNS: DataColumn<Post>[] = [
  { field: "title", header: "제목", sortable: true, width: 128, pin: "left" },
  { field: "views", header: "조회수", sortable: true, width: 84, align: "end", cell: (p) => <span className="fx-num">{num(p.views)}</span> },
  { field: "comments", header: "댓글", sortable: true, width: 64, align: "end", cell: (p) => <span className="fx-num">{num(p.comments)}</span> },
  { field: "status", header: "상태", width: 80, cell: (p) => <Badge intent={STATUS_INTENT[p.status]}>{p.status}</Badge> },
];

const weak = { color: "var(--dds-color-fg-neutral-weak)" } as const;
const bar = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--dds-dimension-x2)" } as const;

/** 검색·필터·결과 수·초기화·선택 수·일괄 행동. 상태는 앱이 갖고 DataTable에는 거른 행과 선택만 넘긴다. */
function Workspace({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [commented, setCommented] = React.useState(true);
  const [selected, setSelected] = React.useState<readonly React.Key[]>(["P-101", "P-105"]);
  const row = tableRow(v);

  const inTab = (statuses: readonly PostStatus[] | null) => POSTS.filter((p) => !statuses || statuses.includes(p.status));
  const rows = inTab(TABS.find(([value]) => value === tab)![2]).filter(
    (p) => (!commented || p.comments > 0) && (!query || p.title.includes(query)),
  );
  const dirty = commented || query !== "";
  const reset = () => { setQuery(""); setCommented(false); };

  const filter = isB ? (
    <ChipStandIn label="댓글 있음" pressed={commented} onClick={() => setCommented((c) => !c)} />
  ) : (
    <Select.Root value={commented ? "with" : "all"} onValueChange={(value) => setCommented(value === "with")}>
      <Select.Trigger aria-label="댓글 조건" style={{ width: 136, flex: "none" }} />
      <Select.Content>
        <Select.Option value="all">모든 글</Select.Option>
        <Select.Option value="with">댓글 있는 글</Select.Option>
      </Select.Content>
    </Select.Root>
  );

  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <Tabs.List aria-label="글 상태">
        {TABS.map(([value, label, statuses]) => (
          <Tabs.Trigger key={value} value={value}>{label} <span style={weak}>{inTab(statuses).length}</span></Tabs.Trigger>
        ))}
      </Tabs.List>
      {TABS.map(([value]) => (
        <Tabs.Content key={value} value={value}>
          {tab === value && (
            <div style={{ display: "grid", gap: "var(--dds-dimension-x3)" }}>
              <div style={bar}>
                <div style={{ flex: "1 1 160px", minWidth: 0 }}>
                  <TextField
                    aria-label="제목 검색" placeholder="제목으로 검색" prefix={<SearchIcon />}
                    value={query} onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                {filter}
              </div>
              <div style={{ ...bar, justifyContent: "space-between", fontSize: "var(--dds-font-size-t3)" }}>
                <span style={bar}>
                  <span role="status">결과 <b style={{ fontVariantNumeric: "tabular-nums" }}>{rows.length}</b>건</span>
                  <Button size="small" intent="neutral" variant="ghost" disabled={!dirty} onClick={reset}>조건 초기화</Button>
                </span>
                {selected.length > 0 && (
                  <span style={bar}>
                    <span style={weak}>{selected.length}개 선택</span>
                    <Button size="small" intent="neutral" variant="weak">보관</Button>
                    <Button size="small" intent="neutral" variant="ghost" onClick={() => setSelected([])}>선택 해제</Button>
                  </span>
                )}
              </div>
              <Surface style={{ padding: "0 4px" }}>
                <DataTable
                  data={rows} rowKey="id" caption="글 목록" columns={COLUMNS} selectable
                  selectedKeys={selected} onSelectedKeysChange={setSelected}
                  defaultSort={{ id: "views", direction: "desc" }}
                  virtual={{ height: 80 + row * 6, rowHeight: row }}
                />
              </Surface>
            </div>
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function View({ v }: { v: Flex }) {
  const isA = v.variant === "a";
  const isB = v.variant === "b";
  return (
    <FlexPage
      v={v}
      title="비교 표"
      summary={
        isB
          ? "열끼리 값을 비교하는 화면이라 표를 고릅니다. 필터는 Chip toolbox, 결과 수와 초기화는 바로 아래 한 줄. 행 높이는 현재 44px."
          : isA
            ? "compact 44 행(--fx-table-row = virtual.rowHeight), 숫자 끝 정렬, 외부 Toolbar에 검색·필터·선택 수·일괄 행동을 모읍니다."
            : "현재 DDS 부품만으로 조합한 화면입니다. toolbar 규칙이 없어 앱이 TextField·Select·Button을 직접 배치합니다."
      }
    >
      <FlexSection
        title="글 관리"
        note={isB
          ? "목록 vs 비교 표 — 조회수·댓글을 열로 견줘야 하면 표, 글을 훑고 여는 것이 목적이면 같은 데이터를 List 두 줄 행으로 둡니다. 모바일에서 객체 탐색이 주 과업이면 List가 기본입니다."
          : isA
            ? "탭 높이·여백은 A 탭 역할, 행은 compact. 선택이 생기면 같은 줄에 선택 수와 일괄 행동이 붙습니다."
            : "현재 없음/우회 — 결과 수·초기화·선택 수 위치에 대한 공용 규칙이 없습니다."}
      >
        <FlexState label="전체 탭 · 댓글 있음 필터 · 2개 선택" block>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--dds-dimension-x2)" }}>
            <strong style={{ fontSize: "var(--dds-font-size-t6)" }}>글 관리</strong>
            <Button>새 글 쓰기</Button>
          </div>
          <Workspace v={v} />
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["table-row", "tab-height", "tab-inset", "tab-panel-gap", "field-height", "chip-height"]} extra={[
        ["필터 형태", isB ? "Chip toggle (aria-pressed)" : "Select 트리거", isB ? "C B toolbox — Chip은 new-kinds 정의를 따름" : "D 현재 부품"],
        ["결과 수 · 초기화", "필터 줄 바로 아래 한 줄 · 초기화는 조건 없으면 비활성", isB ? "C B toolbox 문서화 항목" : isA ? "C A 외부 Toolbar" : "앱 조합(규칙 없음)"],
        ["선택 수 · 일괄 행동", "결과 줄 오른쪽 · neutral weak small", "C 앱 조합(세 안 공통)"],
        ["숫자 열", v.variant === "current" ? "왼쪽 정렬" : "끝 정렬 + tabular-nums", "DataTable 시안과 같음"],
        ["Tabs 외관", "navigation 묶음 CSS를 따름", "이 시나리오는 Tabs 치수를 정하지 않음"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
