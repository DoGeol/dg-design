import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Spinner } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/DataFeedback/Spinner", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const status = { display: "inline-flex", alignItems: "center", gap: "var(--dds-dimension-x2)", color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;

function View({ v }: { v: Flex }) {
  return (
    <FlexPage
      v={v}
      title="Spinner"
      summary={
        v.variant === "current"
          ? "현재 DDS Spinner입니다. 16/20px, 선 2px, 1000ms 회전, 색은 currentColor."
          : "기존 값을 유지합니다. 버튼 안은 버튼 글자색, 본문 대기는 중성 색 — 작은 로딩마다 브랜드 색을 쓰지 않습니다. A·B 같다."
      }
    >
      <FlexSection title="크기" note="새 easing·속도를 더하지 않습니다 — A·B 같다.">
        <FlexState label="small 16 · medium 20">
          <Spinner size="small" aria-label="불러오는 중" />
          <Spinner size="medium" aria-label="불러오는 중" />
        </FlexState>
      </FlexSection>

      <FlexSection title="문맥별 색" columns={2} note="라벨이 있을 때만 role=status, 버튼 안에서는 장식(aria-hidden)이고 버튼이 aria-busy를 갖습니다.">
        <FlexState label="버튼 안 · 폭 유지"><Button loading>발행</Button></FlexState>
        <FlexState label="버튼 안 · neutral"><Button loading intent="neutral" variant="weak">불러오기</Button></FlexState>
        <FlexState label="본문 대기 · 중성 + 문구" span={2}>
          <span style={status}><Spinner size="small" aria-hidden="true" /><span role="status">댓글을 불러오는 중입니다</span></span>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["크기", "16 / 20px", "D 현재 값(A·B 공통)"],
        ["선 · 회전", "2px · 1000ms linear", "D 현재 값"],
        ["색", "currentColor (본문은 fg-neutral-weak)", "D 현재 값 · 사용 규칙"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={480} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={480} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
