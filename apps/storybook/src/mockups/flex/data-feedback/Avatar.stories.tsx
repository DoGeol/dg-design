import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Avatar, Badge, NotificationBadge } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { DocIcon, Surface } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/Avatar", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Size = "small" | "medium" | "large" | "xlarge";
const SIZES: readonly [Size, number][] = [["small", 24], ["medium", 36], ["large", 48], ["xlarge", 64]];

function Person({ size = "medium", name, dot }: { size?: Size; name: string; dot?: boolean }) {
  return (
    <Avatar.Root size={size}>
      <Avatar.Fallback aria-label={name}>{name.slice(0, 1)}</Avatar.Fallback>
      {dot && <Avatar.Badge><NotificationBadge role="img" aria-label="새 활동" /></Avatar.Badge>}
    </Avatar.Root>
  );
}

/** 목록 행 조합. List가 없어 행 높이·여백·leading 간격은 역할 변수(현재 열은 fallback)로만 정한다. */
function Row({ leading, title, meta, tall = true }: { leading: React.ReactNode; title: string; meta?: string; tall?: boolean }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", boxSizing: "border-box",
        gap: "var(--fx-list-leading-gap, var(--dds-dimension-x2))",
        minHeight: tall ? "var(--fx-list-row-2, auto)" : "var(--fx-list-row-1, auto)",
        padding: "var(--dds-dimension-x2) var(--fx-list-inset, var(--dds-dimension-x2))",
        borderBottom: "1px solid var(--dds-color-stroke-neutral-weak)",
      }}
    >
      {leading}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ fontSize: "var(--dds-font-size-t4)", lineHeight: "var(--dds-line-height-t4)", fontWeight: "var(--dds-font-weight-bold)" }}>{title}</span>
        {meta && <span style={{ fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)", color: "var(--dds-color-fg-neutral-weak)" }}>{meta}</span>}
      </div>
    </div>
  );
}

/** B의 leading 슬롯 — 사람이 아닌 객체. 크기는 같은 행의 Avatar(36)와 맞추고 반경은 r2(8). */
function Thumb() {
  return (
    <span className="fx-df-slot fx-df-thumb" aria-hidden="true">
      <DocIcon size={18} />
    </span>
  );
}
function CodeMark({ code }: { code: string }) {
  return (
    <span className="fx-df-slot" aria-hidden="true">
      <Badge size="large" variant="outline" className="fx-df-code">{code}</Badge>
    </span>
  );
}

function View({ v }: { v: Flex }) {
  const isA = v.variant === "a";
  const isB = v.variant === "b";
  return (
    <FlexPage
      v={v}
      title="Avatar"
      summary={
        isB
          ? "원형 Avatar는 사람에게만 씁니다. 목록 leading 슬롯은 이미지·Avatar·도메인 표식을 모두 받습니다 — 새 Avatar API가 아니라 행 조합입니다."
          : isA
            ? "네 크기를 유지하고 문맥별 크기를 정합니다. 선택 행 24/36, 객체 목록 36/48, 상세 헤더 64."
            : "현재 DDS Avatar입니다. 원형 24/36/48/64와 크기별 이니셜 글자입니다."
      }
    >
      <FlexSection title="크기" note="24 / 36 / 48 / 64 유지 — A·B 같다. 이니셜 글자는 원 크기를 따라갑니다.">
        <FlexState label="small · medium · large · xlarge">
          {SIZES.map(([size, px]) => <Person key={size} size={size} name={`편도걸 ${px}`} />)}
        </FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={2} note="이미지가 없거나 실패하면 같은 자리에 이니셜이 남습니다(콘솔 오류를 피하려고 실패 이미지는 그리지 않음). 코너 표식은 NotificationBadge dot을 Avatar.Badge에 얹습니다.">
        <FlexState label="fallback · 이미지 없음·실패"><Person size="large" name="이서준" /></FlexState>
        <FlexState label="badge · 새 활동"><Person size="large" name="김하늘" dot /></FlexState>
      </FlexSection>

      <FlexSection
        title={isB ? "목록 leading 슬롯" : "목록 행"}
        note={
          isB
            ? "사람은 원형 Avatar, 문서는 사각 썸네일(r8), 도메인 값은 코드 표식. 셋 다 36px 칸에 맞춰 본문 시작선을 같게 둡니다."
            : isA
              ? "객체 목록은 Avatar 36 + 이름 + 약한 부서·직함. leading 간격 12, 행 64."
              : "현재 List가 없어 앱이 flex로 조합합니다(간격 8, 높이는 내용대로)."
        }
      >
        <FlexState label={isB ? "사람 · 문서 · 도메인" : "객체 목록"} block>
          <Surface>
            <Row leading={<Person name="편도걸" />} title="편도걸" meta="디자인시스템 · 리드" />
            {isB ? (
              <>
                <Row leading={<Thumb />} title="컴포넌트 디자인 기록" meta="문서 · 10월 8일 수정" />
                <Row leading={<CodeMark code="FE" />} title="프런트엔드 플랫폼" meta="조직 코드 · 구성원 12명" />
              </>
            ) : (
              <>
                <Row leading={<Person name="김하늘" />} title="김하늘" meta="제품 디자인 · 매니저" />
                <Row leading={<Person name="이서준" />} title="이서준" meta="프런트엔드 · 엔지니어" />
              </>
            )}
          </Surface>
        </FlexState>
        {isA && (
          <FlexState label="선택 행 · Avatar 24" block>
            <Surface>
              <Row tall={false} leading={<Person size="small" name="박지민" />} title="박지민" />
            </Surface>
          </FlexState>
        )}
      </FlexSection>

      <FlexSpec v={v} roles={["list-row-2", "list-row-1", "list-inset", "list-leading-gap"]} extra={[
        ["크기", "24 / 36 / 48 / 64px", "D 현재 값(A·B 공통)"],
        ["이니셜 글자", "11 / 13 / 16 / 20px bold", "D 현재 값"],
        ["외곽선", "1px stroke-neutral-weak", "D 현재 값 — 사진과 fallback 면적 일치"],
        ...(isB ? [
          ["썸네일 leading", "36px · r8 · bg-neutral-weak", "C 같은 행 Avatar 크기 · 반경은 D radius-r2"],
          ["도메인 표식", "Badge large outline 24px", "D 현재 Badge 재사용 · 글자 고정폭"],
        ] as const : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
