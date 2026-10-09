import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, Tabs, TextField } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { FileIcon, FilterIcon, PlusIcon, SearchIcon } from "./icons";

const meta = { title: "Mockups/Flex/Navigation/Tabs", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak: React.CSSProperties = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" };

const SCOPES = [
  ["all", "전체", 12],
  ["draft", "작성 중", 3],
  ["public", "공개", 9],
  ["archived", "보관", 0],
] as const;

function Label({ name, count }: { name: string; count: number }) {
  return <>{name}<span className="fx-tab-count">{count}</span></>;
}

/** 상태 칸용 — 탭 하나만 둔다(force가 칸 안 모든 dds 요소에 걸린다). */
function One({ active, disabled, children }: { active?: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Tabs.Root defaultValue={active ? "x" : undefined}>
      <Tabs.List><Tabs.Trigger value="x" disabled={disabled}>{children}</Tabs.Trigger></Tabs.List>
    </Tabs.Root>
  );
}

const DOCS = [
  ["컴포넌트 디자인 기록", "10월 8일 수정 · 작성 중"],
  ["토큰 이름 규칙", "10월 6일 수정 · 공개"],
] as const;

function DocRows() {
  return (
    <div style={{ display: "grid" }}>
      {DOCS.map(([title, info]) => (
        <div key={title} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--dds-color-stroke-neutral-weak)" }}>
          <FileIcon size={20} />
          <div style={{ minWidth: 0 }}><div>{title}</div><p style={weak}>{info}</p></div>
        </div>
      ))}
    </div>
  );
}

/** 탭 목록. 모바일·탭이 많을 때는 래퍼가 가로 스크롤을 맡는다 — 현재는 앱 우회, A·B는 끝 흐림 단서까지. */
function ScopeTabs({ mobile, many }: { mobile: boolean; many?: boolean }) {
  const list = (
    <Tabs.List aria-label="문서 범위">
      {SCOPES.map(([value, name, count]) => <Tabs.Trigger key={value} value={value}><Label name={name} count={count} /></Tabs.Trigger>)}
      {many && <Tabs.Trigger value="shared"><Label name="공유받은 문서" count={4} /></Tabs.Trigger>}
      {many && <Tabs.Trigger value="trash"><Label name="휴지통" count={2} /></Tabs.Trigger>}
    </Tabs.List>
  );
  return mobile || many ? <div className="fx-tabs-scroll" style={{ overflowX: "auto" }}>{list}</div> : list;
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const isCurrent = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Tabs"
      summary={
        isB
          ? "치수는 현재 그대로 두고, 탭을 페이지 문법(제목 · 주 행동 하나 · 범위 탭 · 검색/필터)에 넣습니다."
          : v.variant === "a"
            ? "높이 40px, 좌우 12px, 패널 간격 24px. 활성 탭은 진한 글자와 브랜드 밑줄로 위계를 줍니다."
            : "현재 DDS 밑줄 탭입니다. 활성 탭은 브랜드 글자와 2px 밑줄입니다."
      }
    >
      <FlexSection
        title={isB ? "페이지 문법" : "탭과 패널"}
        note={
          isB
            ? "탭은 범위, 필터는 그 범위 안의 조건입니다. 주 행동은 제목 줄에 하나만 둡니다."
            : "화살표로 이동하면 바로 전환됩니다(automatic). manual activation은 기본값으로 보이지 않습니다."
        }
      >
        <FlexState label={isB ? "제목 + CTA → 탭 → 검색·필터 → 목록" : "범위 탭 + 패널"} block>
          {isB ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: "var(--dds-font-size-t7)", lineHeight: "var(--dds-line-height-t7)" }}>문서</h3>
                <Button size={mobile ? "small" : "medium"}><PlusIcon />새 문서</Button>
              </div>
              <Tabs.Root defaultValue="all">
                <ScopeTabs mobile={mobile} />
                <Tabs.Content value="all" style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0, display: "grid" }}><TextField aria-label="문서 검색" prefix={<SearchIcon />} placeholder="제목으로 검색" /></div>
                    <Button intent="neutral" variant="weak" iconOnly={mobile} aria-label={mobile ? "필터" : undefined} style={mobile ? { height: "var(--fx-field-height)", width: "var(--fx-field-height)" } : undefined}><FilterIcon />{!mobile && "필터"}</Button>
                  </div>
                  <DocRows />
                </Tabs.Content>
              </Tabs.Root>
            </div>
          ) : (
            <Tabs.Root defaultValue="all">
              <ScopeTabs mobile={mobile} />
              <Tabs.Content value="all"><DocRows /></Tabs.Content>
            </Tabs.Root>
          )}
        </FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={2} note="한 칸에 탭 하나입니다. 선택은 밑줄, hover는 배경, focus는 2px 안쪽 링입니다.">
        <FlexState label="default"><One>작성 중</One></FlexState>
        <FlexState label="hover" force="hover"><One>작성 중</One></FlexState>
        <FlexState label="focus" force="focus"><One>작성 중</One></FlexState>
        <FlexState label="pressed" force="pressed"><One>작성 중</One></FlexState>
        <FlexState label="selected"><One active>전체</One></FlexState>
        <FlexState label="selected · hover" force="hover"><One active>전체</One></FlexState>
        <FlexState label="selected · focus" force="focus"><One active>전체</One></FlexState>
        <FlexState label="disabled"><One disabled>보관</One></FlexState>
      </FlexSection>

      <FlexSection
        title="이름이 길거나 탭이 많을 때"
        note={
          isCurrent
            ? "현재 없음 — 목록에 넘침 처리가 없어 앱이 가로 스크롤 래퍼로 우회합니다. 경계선이 첫 화면 폭에서 끊깁니다."
            : "글자를 줄이지 않고 가로 스크롤합니다. 끝을 흐려 탭이 더 있음을 알립니다. 건수는 약한 글자입니다."
        }
      >
        <FlexState label="6개 · 긴 이름" block>
          <Tabs.Root defaultValue="all"><ScopeTabs mobile={mobile} many /></Tabs.Root>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["tab-height", "tab-inset", "tab-panel-gap"]} extra={[
        ["활성 표시", v.variant === "a" ? "진한 글자 + 브랜드 밑줄 2px" : "브랜드 글자 + 브랜드 밑줄 2px", v.variant === "a" ? "C DS004·007 진한 활성 라벨" : isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["글자", "14 / 19 bold, 비활성 fg-neutral-weak", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["넘침", isCurrent ? "없음(앱 우회)" : "가로 스크롤 + 끝 32px 흐림", isCurrent ? "—" : "C 글자 축소 대신 스크롤"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={760} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={760} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
