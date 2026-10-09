import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, Collapsible, Field, Switch, TextField } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { ChevronDownIcon } from "./icons";

const meta = { title: "Mockups/Flex/Navigation/Collapsible", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak: React.CSSProperties = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" };
/** 트리거 좌우 여백만큼 당겨 글자 시작을 본문 시작선에 맞춘다. */
const pull: React.CSSProperties = { marginInlineStart: "calc(-1 * var(--dds-dimension-x2))" };

function Chevron({ open }: { open?: boolean }) {
  return <span style={{ display: "inline-flex", transform: open ? "rotate(180deg)" : undefined }}><ChevronDownIcon /></span>;
}

/** 상태 칸용 — 트리거 하나. */
function One({ open, disabled }: { open?: boolean; disabled?: boolean }) {
  return (
    <Collapsible.Root defaultOpen={open} disabled={disabled}>
      <Collapsible.Trigger>상세 옵션<Chevron open={open} /></Collapsible.Trigger>
      <Collapsible.Content><p className="fx-collapsible-body" style={weak}>공개 범위와 저장 위치를 바꿀 수 있습니다.</p></Collapsible.Content>
    </Collapsible.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isA = v.variant === "a";
  const isCurrent = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Collapsible"
      summary={
        v.variant === "b"
          ? "새 조형 근거가 없어 그대로 둡니다. 무엇을 감추고 어떻게 다시 여는지는 과업 맥락이 정합니다."
          : isA
            ? "낮은 우선순위 정보를 여는 작은 ghost 트리거입니다. 열린 본문 위에 12px을 두고, 모바일은 조작 영역을 넓힙니다."
            : "현재 DDS입니다. 본문 위 여백은 소비자가 정합니다(기존 스토리 8~12)."
      }
    >
      <FlexSection title="발행 폼 · 상세 옵션" note="주 행동(발행)은 접힌 영역 밖에 둡니다. 숨긴 내용은 탭 순서에 남지 않습니다.">
        <FlexState label="열림" block>
          <div style={{ display: "grid", gap: 12 }}>
            <Field.Root style={{ width: "100%" }}>
              <Field.Label>제목</Field.Label>
              <TextField defaultValue="컴포넌트 디자인 기록" />
            </Field.Root>
            <Collapsible.Root defaultOpen>
              <Collapsible.Trigger style={pull}>상세 옵션<Chevron open /></Collapsible.Trigger>
              <Collapsible.Content>
                <div className="fx-collapsible-body" style={{ display: "grid", gap: 8 }}>
                  <Switch defaultChecked>검색 노출</Switch>
                  <Switch>댓글 허용</Switch>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
            <div style={{ display: "flex", justifyContent: mobile ? "stretch" : "flex-end" }}>
              <Button style={mobile ? { flex: 1 } : undefined}>발행하기</Button>
            </div>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={2}>
        <FlexState label="default"><One /></FlexState>
        <FlexState label="hover" force="hover"><One /></FlexState>
        <FlexState label="focus" force="focus"><One /></FlexState>
        <FlexState label="pressed" force="pressed"><One /></FlexState>
        <FlexState label="open" block><One open /></FlexState>
        <FlexState label="disabled"><One disabled /></FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["트리거", "여백 4·8 · r4 · 간격 4", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["본문 위 여백", isA ? "12px" : "8px", isA ? "C 후보 8~12 중 12" : isCurrent ? "소비자 몫(기존 스토리 8)" : "D 소비자 몫 유지"],
        ...(mobile && !isCurrent ? [["모바일 조작 높이", "44px 이상", "C 터치 조작 영역 44"]] as const : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
