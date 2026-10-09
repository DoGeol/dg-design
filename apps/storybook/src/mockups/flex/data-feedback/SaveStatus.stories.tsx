import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Alert, Button, SaveStatus } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { Surface } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/SaveStatus", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 편집 헤더 — 저장 상태는 저장 버튼 바로 옆, 작은 글자로. */
function Header({ children, mobile }: { children: React.ReactNode; mobile: boolean }) {
  return (
    <Surface style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x3)", padding: "var(--dds-dimension-x3) var(--dds-dimension-x4)" }}>
      <strong style={{ flex: 1, minWidth: 0, fontSize: "var(--dds-font-size-t5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>표와 목록을 고르는 기준</strong>
      {children}
      {!mobile && <Button intent="neutral" variant="weak">미리보기</Button>}
      <Button>저장</Button>
    </Surface>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  return (
    <FlexPage
      v={v}
      title="SaveStatus"
      summary={
        v.variant === "current"
          ? "현재 DDS SaveStatus입니다. 12px 글자, 16px 아이콘, 상태마다 문구와 아이콘을 함께 씁니다."
          : "현재 밀도를 유지해 저장 버튼 옆에 둡니다. 저장 완료와 업무 완료(발행·승인)를 나눕니다. A·B 같다."
      }
    >
      <FlexSection title="상태" columns={2} note="색만으로 상태를 나르지 않습니다. error만 role=alert — A·B 같다.">
        <FlexState label="dirty"><SaveStatus status="dirty">변경 사항 있음</SaveStatus></FlexState>
        <FlexState label="saving"><SaveStatus status="saving">저장 중</SaveStatus></FlexState>
        <FlexState label="saved"><SaveStatus status="saved">10:42에 저장됨</SaveStatus></FlexState>
        <FlexState label="error"><SaveStatus status="error">저장하지 못함</SaveStatus></FlexState>
      </FlexSection>

      <FlexSection title="배치" note="성공할 때마다 큰 녹색 Badge로 바꾸지 않습니다. 긴 실패 설명은 별도 Alert, 좁은 화면에서도 실패는 숨기지 않습니다.">
        <FlexState label="저장됨 · 헤더" block>
          <Header mobile={mobile}><SaveStatus status="saved">저장됨</SaveStatus></Header>
        </FlexState>
        <FlexState label="실패 · 헤더 + Alert" block>
          <div style={{ display: "grid", gap: "var(--dds-dimension-x2)" }}>
            <Header mobile={mobile}><SaveStatus status="error">저장 실패</SaveStatus></Header>
            <Alert intent="critical" title="저장하지 못했습니다" description="연결이 끊겼습니다. 변경 사항은 이 기기에 보관하고 있습니다." />
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["글자", "12/16 · fg-neutral-weak", "D 현재 값(A·B 공통)"],
        ["아이콘 · 간격", "16px · 4px", "D 현재 값"],
        ["색", "dirty warning · error critical · 나머지 neutral-weak", "D 현재 값"],
        ["완료 전환", "saving → saved 150ms 교차 페이드", "D 현재 값"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
