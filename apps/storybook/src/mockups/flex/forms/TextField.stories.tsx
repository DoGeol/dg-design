import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, TextField } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/TextField", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** B 모바일의 묶인 폼 — 내부 라벨 box. Field 연결(label·description·aria)은 그대로다. */
function InboxField({ label, value }: { label: string; value: string }) {
  return (
    <Field.Root className="fx-inbox" style={full}>
      <Field.Label>{label}</Field.Label>
      <TextField defaultValue={value} />
    </Field.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  return (
    <FlexPage
      v={v}
      title="TextField"
      summary={
        isB
          ? "묶인 폼은 box, 단독·분절 입력은 line으로 씁니다. 모바일 묶음은 내부 라벨 box입니다(M024)."
          : v.variant === "a"
            ? "외부 라벨 outline을 기본으로 두고 반경 6px(데스크톱)·16px(모바일)을 씁니다. box·line은 후보입니다."
            : "현재 DDS 입력입니다. 외부 라벨 outline 한 가지 형태입니다."
      }
    >
      <FlexSection title="상태" columns={2} note="medium 기준입니다. pressed는 입력에 해당하지 않습니다.">
        <FlexState label="filled"><TextField aria-label="이름" defaultValue="편도걸" style={full} /></FlexState>
        <FlexState label="hover" force="hover"><TextField aria-label="이름" defaultValue="편도걸" style={full} /></FlexState>
        <FlexState label="focus" force="focus"><TextField aria-label="이름" defaultValue="편도걸" style={full} /></FlexState>
        <FlexState label="error"><TextField aria-label="이메일" aria-invalid defaultValue="dogeol@" style={full} /></FlexState>
        <FlexState label="disabled"><TextField aria-label="이름" disabled defaultValue="편도걸" style={full} /></FlexState>
        <FlexState label="readonly"><TextField aria-label="계정 ID" readOnly defaultValue="dogeol" style={full} /></FlexState>
        <FlexState label="prefix 아이콘"><TextField aria-label="검색" prefix={<SearchIcon />} placeholder="제목으로 검색" /></FlexState>
        <FlexState label="suffix 단위"><TextField aria-label="수량" suffix="개" defaultValue="12" inputMode="numeric" /></FlexState>
      </FlexSection>

      <FlexSection
        title="폼 묶음"
        note={
          isB
            ? mobile ? "M024 box — 작은 내부 라벨과 값이 한 면에 있습니다." : "여러 필드가 모인 폼은 box(낮은 중성 표면)입니다."
            : "외부 라벨 + outline. 필드 사이 간격은 field-gap 역할입니다."
        }
      >
        <FlexState label="발행 정보" block>
          <div style={{ display: "grid", gap: "var(--fx-field-gap, 16px)" }}>
            {isB && mobile ? (
              <>
                <InboxField label="제목" value="컴포넌트 디자인 기록" />
                <InboxField label="한 줄 설명" value="제품을 만드는 과정" />
              </>
            ) : (
              <>
                <Field.Root style={full}>
                  <Field.Label>제목</Field.Label>
                  <TextField className={isB ? "fx-box" : undefined} defaultValue="컴포넌트 디자인 기록" />
                </Field.Root>
                <Field.Root style={full}>
                  <Field.Label>한 줄 설명</Field.Label>
                  <TextField className={isB ? "fx-box" : undefined} defaultValue="제품을 만드는 과정" />
                  <Field.Description>목록과 검색 결과에 보입니다.</Field.Description>
                </Field.Root>
              </>
            )}
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection
        title="단독 입력"
        note={isB ? "한 가지 내용에 집중하는 입력은 line입니다(M024)." : v.variant === "a" ? "A의 line은 후보 — 기본은 outline입니다." : "현재는 outline뿐입니다."}
      >
        <FlexState label={isB ? "line" : "outline"} block>
          <Field.Root style={full}>
            <Field.Label>메모</Field.Label>
            <TextField className={isB ? "fx-line" : undefined} defaultValue="다음 주 배포 전에 확인" />
          </Field.Root>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["field-height", "field-radius", "field-inset", "field-font", "field-gap"]} extra={[
        ["focus", "테두리 1px + 안쪽 1px", "입력류 계약 유지 — 크기 변화 없음"],
        ...(isB ? [["box 표면", "bg-neutral-weak + stroke-neutral 1px", "M024 box · 경계는 D(현재 입력 계약) — WCAG 1.4.11"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={760} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
