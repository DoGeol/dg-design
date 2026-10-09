import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button, StatePanel } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { CloudOffIcon, InboxIcon, SearchOffIcon } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/StatePanel", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 작은 부유 패널 자리(담당자 선택기 등). 1px 경계는 다크에서도 패널 가장자리를 보이게 한다. */
function SmallPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "min(280px, 100%)", boxSizing: "border-box", padding: "var(--dds-dimension-x1)", borderRadius: "var(--dds-radius-r3)", border: "1px solid var(--dds-color-stroke-neutral-weak)", background: "var(--dds-color-bg-layer-default)", boxShadow: "var(--dds-shadow-overlay)" }}>
      {children}
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const isA = v.variant === "a";
  const isB = v.variant === "b";
  return (
    <FlexPage
      v={v}
      title="StatePanel"
      summary={
        isB
          ? "현재 크기를 유지하고 과업별 문구와 다음 행동만 정합니다. 작은 패널은 기존 minHeight prop으로 줄입니다."
          : isA
            ? "페이지 전체 상태는 현재 크기, 작은 선택기·패널은 compact 조합 후보입니다."
            : "현재 DDS StatePanel입니다. 최소 높이 16rem, 아이콘→제목→설명→행동 순서입니다."
      }
    >
      <FlexSection title="페이지 상태" note="검색 결과 없음은 조건 초기화, 데이터 없음은 첫 항목 만들기로 다음 행동을 나눕니다 — A·B 같다.">
        <FlexState label="empty · 검색 결과 없음" block>
          <StatePanel.Root role="status">
            <StatePanel.Icon><SearchOffIcon /></StatePanel.Icon>
            <StatePanel.Title>‘행 높이’와 맞는 글이 없습니다</StatePanel.Title>
            <StatePanel.Description>검색어를 줄이거나 상태 조건을 지워 보세요.</StatePanel.Description>
            <StatePanel.Actions><Button intent="neutral" variant="weak">조건 초기화</Button></StatePanel.Actions>
          </StatePanel.Root>
        </FlexState>
        <FlexState label="empty · 데이터 없음" block>
          <StatePanel.Root role="status">
            <StatePanel.Icon><InboxIcon /></StatePanel.Icon>
            <StatePanel.Title>아직 쓴 글이 없습니다</StatePanel.Title>
            <StatePanel.Description>첫 글을 쓰면 이곳에 모입니다.</StatePanel.Description>
            <StatePanel.Actions><Button>첫 글 쓰기</Button></StatePanel.Actions>
          </StatePanel.Root>
        </FlexState>
      </FlexSection>

      <FlexSection title="오류 · 로딩" columns={v.density === "mobile" ? 1 : 2} note="진단 코드는 Footer(보조 영역)에 둡니다. 로딩은 StatePanel.Loading 프리셋.">
        <FlexState label="error · role=alert" block>
          <StatePanel.Root role="alert" minHeight={200}>
            <StatePanel.Icon><CloudOffIcon /></StatePanel.Icon>
            <StatePanel.Title>글을 불러오지 못했습니다</StatePanel.Title>
            <StatePanel.Actions><Button intent="neutral" variant="weak">다시 시도</Button></StatePanel.Actions>
            <StatePanel.Footer>오류 코드 504</StatePanel.Footer>
          </StatePanel.Root>
        </FlexState>
        <FlexState label="loading" block>
          <StatePanel.Loading label="글을 불러오는 중입니다" minHeight={200} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="작은 패널"
        note={isA
          ? "compact 후보 — 최소 높이 없음, 여백 16/12, 제목 14. 패널 안 현재 작업을 밀어내지 않습니다."
          : isB
            ? "새 크기 없이 기존 minHeight={0}만 씁니다 — 여백·글자는 페이지 상태와 같습니다."
            : "현재 없음/우회 — compact 크기가 없어 minHeight={0}으로 높이만 풉니다."}
      >
        <FlexState label="선택기 · 검색 결과 없음" block>
          <SmallPanel>
            <StatePanel.Root role="status" minHeight={isA ? undefined : 0} className={isA ? "fx-df-compact" : undefined}>
              <StatePanel.Icon><SearchOffIcon /></StatePanel.Icon>
              <StatePanel.Title asChild><p>‘한도윤’을 찾지 못했습니다</p></StatePanel.Title>
              <StatePanel.Actions><Button size="small" intent="neutral" variant="weak">검색어 지우기</Button></StatePanel.Actions>
            </StatePanel.Root>
          </SmallPanel>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["최소 높이", "256px (16rem)", "D 현재 값(A·B 공통 · 페이지 상태)"],
        ["여백 · 반경", "24/16 · r12", "D 현재 값"],
        ["제목 / 설명", "16/22 bold · 13/18", "D 현재 값"],
        ["아이콘 아래 · 행동 위", "12 · 16", "D 현재 값"],
        ...(isA ? [
          ["compact 최소 높이", "없음(내용 높이)", "C 작은 패널 문맥 — 미측정"],
          ["compact 여백 · 제목", "16/12 · 14/19 bold", "C 작은 패널 문맥 — 미측정"],
          ["compact 아이콘 아래 · 행동 위", "8 · 12", "C 같은 비율로 축소"],
        ] as const : [["작은 패널", "minHeight={0}", "D 기존 prop"] as const]),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1100} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={1100} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
