import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Avatar, Skeleton } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { Surface } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/Skeleton", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 목록 두 줄 행. 행 높이·좌우 여백·leading 간격은 List 역할 — Skeleton과 실제 행이 같은 틀을 쓴다. */
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", boxSizing: "border-box",
  gap: "var(--fx-list-leading-gap, var(--dds-dimension-x2))",
  minHeight: "var(--fx-list-row-2, auto)",
  padding: "var(--dds-dimension-x2) var(--fx-list-inset, var(--dds-dimension-x2))",
  borderBottom: "1px solid var(--dds-color-stroke-neutral-weak)",
};
const text: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x1)", flex: 1, minWidth: 0 };

function SkeletonRow() {
  return (
    <div style={row}>
      <Skeleton radius="full" style={{ width: 36, height: 36 }} />
      <div style={text}>
        <Skeleton radius="small" style={{ width: "55%", height: 14 }} />
        <Skeleton radius="small" style={{ width: "35%", height: 12 }} />
      </div>
    </div>
  );
}

function LoadedRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div style={row}>
      <Avatar.Root size="medium"><Avatar.Fallback aria-label={name}>{name.slice(0, 1)}</Avatar.Fallback></Avatar.Root>
      <div style={{ ...text, gap: 0 }}>
        <span style={{ fontSize: "var(--dds-font-size-t4)", lineHeight: "var(--dds-line-height-t4)", fontWeight: "var(--dds-font-weight-bold)" }}>{name}</span>
        <span style={{ fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)", color: "var(--dds-color-fg-neutral-weak)" }}>{meta}</span>
      </div>
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const current = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Skeleton"
      summary={
        current
          ? "현재 DDS Skeleton입니다. 반경 none/8/12/full, 중성 표면 위 shimmer, reduced motion에서 정지."
          : "실제 콘텐츠의 Avatar·글줄·행 여백을 그대로 예고합니다. 모양은 현재 그대로 — A·B 같다. 행 높이만 각 안의 List 역할을 따릅니다."
      }
    >
      <FlexSection
        title="목록 행 예고"
        note={current ? "현재 List가 없어 행 높이는 내용대로입니다." : "로딩 행과 실제 행이 같은 행 높이(list-row-2)라 로드 뒤 시작선과 높이가 바뀌지 않습니다."}
        columns={2}
      >
        <FlexState label="loading" block>
          <Surface><SkeletonRow /><SkeletonRow /></Surface>
        </FlexState>
        <FlexState label="loaded" block>
          <Surface><LoadedRow name="편도걸" meta="디자인시스템 · 리드" /><LoadedRow name="김하늘" meta="제품 디자인" /></Surface>
        </FlexState>
      </FlexSection>

      <FlexSection title="카드 자리" note="Card 자리에는 같은 반경(medium = r12). 무관한 큰 블록으로 페이지를 채우지 않습니다 — A·B 같다.">
        <FlexState label="radius medium · 카드 한 장" block>
          <div style={{ display: "grid", gap: "var(--dds-dimension-x2)", padding: "var(--dds-dimension-x4)", border: "1px solid var(--dds-color-stroke-neutral-weak)", borderRadius: "var(--dds-radius-r3)" }}>
            <Skeleton radius="medium" style={{ width: "100%", height: 120 }} />
            <Skeleton radius="small" style={{ width: "70%", height: 16 }} />
            <Skeleton radius="small" style={{ width: "40%", height: 12 }} />
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["list-row-2", "list-inset", "list-leading-gap"]} extra={[
        ["반경", "none / 8 / 12 / full", "D 현재 값(A·B 공통)"],
        ["표면 · shimmer", "bg-neutral-weak · bg-neutral-weak-hover 1000ms", "D 현재 값"],
        ["글줄 높이", "14 / 12px (본문·보조 글자 크기)", "C 실제 글자 크기 예고"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
