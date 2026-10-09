import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Slider } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/Slider", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const [size, setSize] = React.useState(16);
  const valued = v.variant !== "current";
  return (
    <FlexPage
      v={v}
      title="Slider"
      summary={
        isB
          ? "네이티브 range와 값 표시를 유지하고, 같은 값이 바꾸는 결과 예시를 바로 아래에 둡니다."
          : v.variant === "a"
            ? "track 비율을 유지하고 값은 라벨 오른쪽, 설명은 아래에 둡니다. 모바일은 drag 영역만 넓힙니다."
            : "현재 DDS Slider입니다. 네이티브 range이고 값 표시는 앱이 붙입니다."
      }
    >
      <FlexSection title="상태" columns={2} note="medium 기준 — track 6px, thumb 18px입니다.">
        <FlexState label="default" block><Slider aria-label="음량" defaultValue={40} style={full} /></FlexState>
        <FlexState label="hover" force="hover" block><Slider aria-label="음량" defaultValue={40} style={full} /></FlexState>
        <FlexState label="focus" force="focus" block><Slider aria-label="음량" defaultValue={40} style={full} /></FlexState>
        <FlexState label="pressed" force="pressed" block><Slider aria-label="음량" defaultValue={40} style={full} /></FlexState>
        <FlexState label="disabled" block><Slider aria-label="음량" defaultValue={40} disabled style={full} /></FlexState>
        <FlexState label="small · track 4" block><Slider aria-label="음량" size="small" defaultValue={40} style={full} /></FlexState>
      </FlexSection>

      <FlexSection
        title="라벨 · 값 · 설명"
        note={
          isB
            ? "값은 라벨 오른쪽, 결과 예시는 슬라이더 아래 — 같은 값이 세 곳에서 일치합니다."
            : valued
              ? "값은 라벨 오른쪽에 정렬하고 설명은 아래에 둡니다."
              : "현재 없음 — 값 표시 자리가 없어 라벨 문구에 값을 넣습니다."
        }
      >
        <FlexState label="본문 글자 크기" block>
          <Field.Root style={full}>
            {valued ? (
              <div className="fx-slider-head">
                <Field.Label>본문 글자 크기</Field.Label>
                <output className="fx-slider-value">{size}px</output>
              </div>
            ) : (
              <Field.Label>본문 글자 크기 ({size}px)</Field.Label>
            )}
            <Slider min={12} max={20} step={1} value={size} onChange={(e) => setSize(Number(e.currentTarget.value))} style={full} />
            <Field.Description>12–20px, 1px 단위입니다.</Field.Description>
          </Field.Root>
          {isB && (
            <p className="fx-preview fx-preview-text" style={{ fontSize: size, lineHeight: 1.5 }}>
              제품을 만드는 과정을 기록합니다.
            </p>
          )}
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["track small / medium", "4 / 6px", "D 현재 DDS 값 유지"],
        ["thumb small / medium", "14 / 18px", "D 현재 DDS 값 유지"],
        ["입력 높이(drag 영역)", v.density === "mobile" && valued ? "44px" : "24px", v.density === "mobile" && valued ? "C 터치 44 — track·thumb 외형은 그대로" : "D WCAG 2.5.8 최소 24 유지"],
        ...(valued ? [["값 표시", "라벨 오른쪽 · 본문 굵게 · tabular-nums", "C A 문서 — 라벨과 같은 줄"] as const] : []),
        ...(isB ? [["결과 예시", "슬라이더 아래 · 같은 값", "C 서비스 설정 비전 응용"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
