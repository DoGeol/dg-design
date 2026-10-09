import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, Popover, Select, TextField } from "@dg-design/react";
import type * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { PropertyButton, PropertyField, PropertyGroup, PropertySelect } from "../proto/PropertyField";

const meta = { title: "Mockups/Flex/Scenarios/FormTask", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const VISIBILITY = [
  { value: "public", label: "전체 공개" },
  { value: "link", label: "링크가 있는 사람" },
  { value: "private", label: "비공개" },
] as const;
const CATEGORY = [
  { value: "ds", label: "디자인 시스템" },
  { value: "dev", label: "개발" },
  { value: "retro", label: "회고" },
] as const;

const full = { width: "100%" } as const;

/** B 모바일 묶음 입력 — 작은 내부 라벨 + 값(M024). 외관은 forms.css의 .fx-inbox. */
function InboxField({ label, value }: { label: string; value: string }) {
  return (
    <Field.Root className="fx-inbox" style={full}>
      <Field.Label>{label}</Field.Label>
      <TextField defaultValue={value} />
    </Field.Root>
  );
}

function Labeled({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <Field.Root style={full}>
      <Field.Label>{label}</Field.Label>
      {children}
      {error && <Field.ErrorMessage>{error}</Field.ErrorMessage>}
    </Field.Root>
  );
}

function CurrentSelect({ options, value, placeholder, open }: { options: readonly { value: string; label: string }[]; value?: string; placeholder?: string; open?: boolean }) {
  return (
    <Select.Root defaultValue={value} open={open}>
      <Select.Trigger placeholder={placeholder} />
      <Select.Content>{options.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}</Select.Content>
    </Select.Root>
  );
}

function When() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild><PropertyButton>10월 12일 오전 9:00</PropertyButton></Popover.Trigger>
      <Popover.Content>날짜 선택은 DatePicker를 씁니다.</Popover.Content>
    </Popover.Root>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const mobile = v.density === "mobile";
  const gap = { display: "grid", gap: "var(--fx-field-gap, 16px)" } as const;

  const text = isB && mobile ? (
    <div style={gap}>
      <InboxField label="제목" value="컴포넌트 디자인 기록" />
      <InboxField label="한 줄 설명" value="제품을 만드는 과정" />
    </div>
  ) : (
    <div style={gap}>
      <Labeled label="제목"><TextField className={isB ? "fx-box" : undefined} defaultValue="컴포넌트 디자인 기록" /></Labeled>
      <Labeled label="한 줄 설명"><TextField className={isB ? "fx-box" : undefined} defaultValue="제품을 만드는 과정" /></Labeled>
    </div>
  );

  const props = current ? (
    <div style={gap}>
      <Labeled label="공개 범위"><CurrentSelect options={VISIBILITY} value="link" /></Labeled>
      <Labeled label="카테고리" error="카테고리를 고르십시오."><CurrentSelect options={CATEGORY} placeholder="선택하십시오" /></Labeled>
      <Labeled label="발행 시각">
        <div style={{ display: "flex", gap: 8 }}>
          <TextField readOnly defaultValue="10월 12일 오전 9:00" style={{ flex: 1 }} />
          <Button intent="neutral" variant="weak">변경</Button>
        </div>
      </Labeled>
    </div>
  ) : isB ? (
    <PropertyGroup label="발행 설정">
      <PropertyField layout="row" label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="link" /></PropertyField>
      <PropertyField layout="row" label="카테고리" error="카테고리를 고르십시오."><PropertySelect options={CATEGORY} placeholder="선택하십시오" /></PropertyField>
      <PropertyField layout="row" label="발행 시각"><When /></PropertyField>
    </PropertyGroup>
  ) : (
    <div style={gap}>
      <PropertyField layout="box" label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="link" /></PropertyField>
      <PropertyField layout="box" label="카테고리" error="카테고리를 고르십시오."><PropertySelect options={CATEGORY} placeholder="선택하십시오" /></PropertyField>
      <PropertyField layout="box" label="발행 시각"><When /></PropertyField>
    </div>
  );

  const memo = (
    <Labeled label="메모">
      <TextField className={isB ? "fx-line" : undefined} defaultValue="다음 주 배포 전에 확인" />
    </Labeled>
  );

  const cta = (
    <div style={{ display: "flex", justifyContent: mobile ? "stretch" : "flex-end", gap: 8 }}>
      {!mobile && <Button intent="neutral" variant="weak">임시 저장</Button>}
      <Button className="fx-cta" size={current ? "large" : "medium"} style={mobile ? { flex: 1 } : undefined}>발행하기</Button>
    </div>
  );

  return (
    <FlexPage
      v={v}
      title="발행 정보 폼"
      summary={
        isB
          ? "글은 box, 발행 설정은 속성 행 묶음, 메모는 line입니다. 값의 성격(키보드 입력·선택·짧은 메모)마다 표현이 다릅니다."
          : v.variant === "a"
            ? "외부 라벨 outline을 기본으로 두고, 선택 값은 같은 상자 안 라벨의 PropertyField입니다."
            : "현재 DDS 조합입니다. 모든 값이 외부 라벨 + outline이고, 선택은 Select, 날짜는 읽기 전용 입력 + 버튼입니다."
      }
    >
      {!mobile && <FlexState label="헤더 오른쪽 행동" block>{cta}</FlexState>}

      <FlexSection title="글" note={isB ? (mobile ? "M024 내부 라벨 box." : "여러 필드가 모인 묶음은 box입니다.") : "외부 라벨 + outline."}>
        <FlexState label="키보드 입력" block>{text}</FlexState>
      </FlexSection>

      <FlexSection
        title="발행 설정"
        note={current ? "현재 없음 — 우회. 속성 행이 없어 Select와 읽기 전용 입력을 쌓습니다." : isB ? "속성 행 묶음(M026) — 라벨 왼쪽, 값 오른쪽. 오류는 행 아래에 둡니다." : "PropertyField — 필드와 같은 상자 안에 라벨·값·caret."}
      >
        <FlexState label="선택 값 · 카테고리 오류" block>{props}</FlexState>
      </FlexSection>

      <FlexSection title="메모" note={isB ? "한 가지 내용에 집중하는 짧은 입력은 line입니다." : "outline 그대로입니다."}>
        <FlexState label={isB ? "line" : "outline"} block>{memo}</FlexState>
      </FlexSection>

      {mobile && <FlexState label="하단 고정 행동" block>{cta}</FlexState>}

      <FlexSection title="공개 범위 열림" note="모든 열이 같은 DDS Select 패널을 엽니다.">
        <FlexState label="열림" block>
          {current ? (
            <Labeled label="공개 범위"><CurrentSelect options={VISIBILITY} value="link" open /></Labeled>
          ) : isB ? (
            <PropertyGroup label="발행 설정"><PropertyField layout="row" label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="link" open /></PropertyField></PropertyGroup>
          ) : (
            <PropertyField layout="box" label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="link" open /></PropertyField>
          )}
          <FlexReserve height={mobile ? 190 : 130} />
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["field-height", "field-radius", "field-gap", "cta-height", ...(isB && mobile ? (["setting-row-radius"] as const) : [])]} extra={[
        ["글 입력", isB ? (mobile ? "내부 라벨 box" : "box(bg-neutral-weak)") : "외부 라벨 outline", isB ? "B M024 box" : "D 현재 TextField"],
        ["선택 값", current ? "Field + Select / readonly + 버튼" : isB ? "속성 행 묶음" : "PropertyField box", current ? "D 우회" : isB ? "B M026" : "C 내부 라벨 후보"],
        ["메모", isB ? "line(아래 경계)" : "outline", isB ? "B M024 line" : "D"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1000} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={1000} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
