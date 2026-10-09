import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { ChipStandIn } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/Badge", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const STATUSES = [
  ["발행됨", "positive"], ["검토 중", "informative"], ["초안", "neutral"], ["주의", "warning"], ["반려", "critical"],
] as const;

function View({ v }: { v: Flex }) {
  const isA = v.variant === "a";
  const isB = v.variant === "b";
  const current = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Badge"
      summary={
        isB
          ? "상태 Badge, 선택 Chip, 코드 표식을 서로 다른 것으로 구별합니다. 의미 없는 색을 더하지 않습니다."
          : isA
            ? "현재 비율을 유지하고 일반 상태는 weak로 둡니다. 누르는 것은 Chip으로 분리합니다."
            : "현재 DDS Badge입니다. 읽기 전용 상태 표시이며 hover·focus가 없습니다."
      }
    >
      <FlexSection title="상태 Badge" note="의미가 다른 상태는 글자로 구분하고 색은 업무 의미에 맞춥니다. 대부분 weak — A·B 같다.">
        <FlexState label="weak · medium 20">
          {STATUSES.map(([label, intent]) => <Badge key={label} intent={intent}>{label}</Badge>)}
        </FlexState>
        <FlexState label="weak · large 24">
          {STATUSES.slice(0, 3).map(([label, intent]) => <Badge key={label} intent={intent} size="large">{label}</Badge>)}
        </FlexState>
        <FlexState label="truncate · 좁은 칸">
          <div style={{ width: 96 }}><Badge truncate intent="informative">검토 요청 · 디자인시스템팀</Badge></div>
        </FlexState>
      </FlexSection>

      <FlexSection
        title={isB ? "Badge · Chip · 코드 표식" : "Badge와 Chip"}
        columns={1}
        note={
          current
            ? "현재 없음/우회 — 공개 Chip이 없어 필터 선택은 Button small로 대신합니다. Badge에 제거 버튼을 넣지 않습니다."
            : isB
              ? "Chip은 누르는 필터(aria-pressed), 코드 표식은 도메인 값 설명(고정폭 글자·outline). Badge는 읽기 전용 상태입니다."
              : "Chip은 누르는 필터입니다(aria-pressed). 치수는 chip 역할(아래 표). 읽기 전용 Badge와 시각·동작을 나눕니다."
        }
      >
        <FlexState label={current ? "Button small · 필터 우회" : "Chip · 기본 / 선택 / 비활성"}>
          {current ? (
            <>
              <Button size="small" intent="neutral" variant="weak" aria-pressed>발행됨</Button>
              <Button size="small" intent="neutral" variant="weak" aria-pressed={false}>초안</Button>
            </>
          ) : (
            <>
              <ChipStandIn label="발행됨" pressed />
              <ChipStandIn label="초안" />
              <ChipStandIn label="보관" disabled />
            </>
          )}
        </FlexState>
        {!current && (
          <>
            <FlexState label="Chip · hover" force="hover"><ChipStandIn label="초안" /></FlexState>
            <FlexState label="Chip · focus-visible" force="focus"><ChipStandIn label="발행됨" pressed /></FlexState>
          </>
        )}
        {isB && (
          <FlexState label="코드 표식 · 행 안">
            <Badge variant="outline" className="fx-df-code">FE-102</Badge>
            <span style={{ fontSize: "var(--dds-font-size-t4)" }}>가상 스크롤 행 높이</span>
            <Badge intent="positive">발행됨</Badge>
          </FlexState>
        )}
      </FlexSection>

      <FlexSpec v={v} roles={["chip-height", "chip-radius"]} extra={[
        ["Badge medium", "20px · r4 · 좌우 6 · 11px", "D 현재 값(A·B 공통)"],
        ["Badge large", "24px · r6 · 좌우 8 · 12px", "D 현재 값(A·B 공통)"],
        ["기본 variant", "weak", "D 현재 기본값"],
        ...(current ? [] : [["Chip 선택", "bg-brand-weak · fg-brand + 체크", "C 선택은 브랜드, 색 외 표식 동반"] as const]),
        ...(isB ? [["코드 표식", "outline · 고정폭 글자", "C DS018 코드 배지 — 크기는 D Badge 재사용"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={760} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={760} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
