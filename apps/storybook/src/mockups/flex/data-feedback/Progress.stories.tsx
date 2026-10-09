import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, Progress } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/DataFeedback/Progress", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const line = { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--dds-dimension-x2)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" } as const;
const stack = { display: "grid", gap: "var(--dds-dimension-x2)", width: "100%" } as const;

/** 라벨과 값은 같은 시작선·끝선. 값은 고정폭 숫자라 늘어나도 흔들리지 않는다. 라벨 연결은 aria-labelledby. */
function Labeled({ id, label, value, indeterminate, children }: { id: string; label: string; value?: number; indeterminate?: boolean; children?: React.ReactNode }) {
  return (
    <div style={stack}>
      <div style={line}>
        <span id={id}>{label}</span>
        {value !== undefined && <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--dds-color-fg-neutral-weak)" }}>{value}%</span>}
      </div>
      <Progress aria-labelledby={id} value={value} indeterminate={indeterminate} />
      {children}
    </div>
  );
}

function View({ v }: { v: Flex }) {
  return (
    <FlexPage
      v={v}
      title="Progress"
      summary={
        v.variant === "current"
          ? "현재 DDS Progress입니다. 트랙 6px, 중성 바탕 + 브랜드 채움, 모르는 진행은 40% 막대가 왕복합니다."
          : "트랙 6px을 유지합니다. 진행률을 알 때만 퍼센트를 쓰고, 범위(전체 작업인지 파일 하나인지)를 문구로 밝힙니다. A·B 같다."
      }
    >
      <FlexSection title="값과 문구" note="라벨·값 정렬은 앱 조합입니다. 가짜 완료율을 보이지 않습니다 — A·B 같다.">
        <FlexState label="determinate · 전체 작업" block>
          <Labeled id="fx-pg-1" label="이미지 3개 중 2개 올림" value={67} />
        </FlexState>
        <FlexState label="indeterminate · 값 모름" block>
          <Labeled id="fx-pg-2" label="용량을 계산하는 중" indeterminate />
        </FlexState>
        <FlexState label="error · 색만 바꾸지 않음" block>
          <Labeled id="fx-pg-3" label="이미지 3개 중 1개 올림" value={33}>
            <div style={{ ...line, justifyContent: "flex-start", color: "var(--dds-color-fg-critical)" }}>
              <span role="alert">cover.png를 올리지 못했습니다.</span>
              <Button size="small" intent="neutral" variant="ghost">다시 시도</Button>
            </div>
          </Labeled>
        </FlexState>
        <FlexState label="완료" block>
          <Labeled id="fx-pg-4" label="이미지 3개 모두 올림" value={100} />
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["트랙", "6px · r-full · bg-neutral-weak", "D 현재 값(A·B 공통)"],
        ["채움", "bg-brand-solid · width 전환 base", "D 현재 값"],
        ["indeterminate", "40% 막대 왕복 · reduced motion 정지", "D 현재 값"],
        ["라벨 줄", "13/18 · 값은 tabular-nums · 트랙과 간격 8", "C 앱 조합(A·B 공통)"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={560} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
