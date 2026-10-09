import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, Popover, Select, TextField } from "@dg-design/react";
import type * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { PropertyButton, PropertyField, PropertyGroup, PropertySelect } from "../proto/PropertyField";

const meta = { title: "Mockups/Flex/NewKinds/PropertyField", parameters: { layout: "fullscreen" } } satisfies Meta;
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

/** A는 상자 하나, B는 묶음 행. 상태 칸 하나에 대상 하나. */
function One({ isB, children }: { isB: boolean; children: React.ReactNode }) {
  return isB ? <PropertyGroup label="발행 설정">{children}</PropertyGroup> : <>{children}</>;
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const mobile = v.density === "mobile";
  const layout = isB ? "row" : "box";
  const mobileReserve = mobile ? 190 : 130;

  if (current) {
    return (
      <FlexPage v={v} title="PropertyField" summary="현재 없음 — 우회. 값 선택은 외부 라벨 + Select 트리거, 또는 읽기 전용 TextField + 변경 버튼으로 만듭니다.">
        <FlexSection title="값 선택 트리거" note="현재 없음 — 우회. 속성 행처럼 라벨·값을 한 줄에 두는 형태가 없습니다.">
          <FlexState label="우회 1 · Field + Select" block>
            <Field.Root style={full}>
              <Field.Label>공개 범위</Field.Label>
              <Select.Root defaultValue="public">
                <Select.Trigger />
                <Select.Content>{VISIBILITY.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}</Select.Content>
              </Select.Root>
            </Field.Root>
          </FlexState>
          <FlexState label="우회 2 · readonly TextField + 변경 버튼" block>
            <Field.Root style={full}>
              <Field.Label>발행 시각</Field.Label>
              <div style={{ display: "flex", gap: 8 }}>
                <TextField readOnly defaultValue="10월 12일 오전 9:00" style={{ flex: 1 }} />
                <Button intent="neutral" variant="weak">변경</Button>
              </div>
            </Field.Root>
          </FlexState>
          <FlexState label="열림 · 같은 Select 패널" block>
            <Field.Root style={full}>
              <Field.Label>카테고리</Field.Label>
              <Select.Root defaultValue="ds" open>
                <Select.Trigger />
                <Select.Content>{CATEGORY.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}</Select.Content>
              </Select.Root>
            </Field.Root>
            <FlexReserve height={mobileReserve} />
          </FlexState>
        </FlexSection>
        <FlexSpec v={v} roles={["field-height", "field-radius", "field-inset"]} extra={[["라벨", "필드 위 14 bold", "D Field.Label"]]} />
      </FlexPage>
    );
  }

  return (
    <FlexPage
      v={v}
      title="PropertyField"
      summary={
        isB
          ? mobile
            ? "모바일 폼의 동등한 입력 종류입니다. 묶음 표면 안 56 행에 라벨 왼쪽, 값 오른쪽, caret을 둡니다(M026)."
            : "라벨 열과 값 트리거를 한 행에 둡니다. 행은 테두리 없이 hover 표면만 있고, 선택은 DDS Select가 합니다."
          : mobile
            ? "필드와 같은 56/r16 상자 안에 작은 라벨을 위, 값을 아래 둡니다(내부 라벨 후보)."
            : "필드와 같은 40/r6 상자 안에 라벨·값·caret을 한 줄로 둡니다. 텍스트 입력이 아니라 선택 트리거입니다."
      }
    >
      <FlexSection title="상태" columns={mobile ? 1 : 2} note="라벨은 버튼 밖(label for)이고 상자 전체가 누름 영역입니다. pressed는 열림으로 대신합니다.">
        <FlexState label="값 있음" block><One isB={isB}><PropertyField layout={layout} label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="public" /></PropertyField></One></FlexState>
        <FlexState label="placeholder" block><One isB={isB}><PropertyField layout={layout} label="카테고리"><PropertySelect options={CATEGORY} placeholder="선택하십시오" /></PropertyField></One></FlexState>
        <FlexState label="hover" force="hover" block><One isB={isB}><PropertyField layout={layout} label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="public" /></PropertyField></One></FlexState>
        <FlexState label={isB ? "focus · 안쪽 2px 링" : "focus · 테두리 1px + 안쪽 1px"} force="focus" block><One isB={isB}><PropertyField layout={layout} label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="public" /></PropertyField></One></FlexState>
        <FlexState label="error" block><One isB={isB}><PropertyField layout={layout} label="카테고리" error="카테고리를 고르십시오."><PropertySelect options={CATEGORY} placeholder="선택하십시오" /></PropertyField></One></FlexState>
        <FlexState label="disabled" block><One isB={isB}><PropertyField layout={layout} label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="private" disabled /></PropertyField></One></FlexState>
      </FlexSection>

      <FlexSection title="열림" note="DDS Select 패널을 그대로 엽니다. 트리거 폭은 상자 전체가 아니라 값 영역 기준입니다.">
        <FlexState label="Select 열림" block>
          <One isB={isB}><PropertyField layout={layout} label="카테고리"><PropertySelect options={CATEGORY} defaultValue="ds" open /></PropertyField></One>
          <FlexReserve height={mobileReserve} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title={isB ? "속성 묶음" : "여러 속성"}
        note={isB ? (mobile ? "M026 — 한 표면 안에 행을 쌓고 구분선은 안쪽 여백에서 시작합니다." : "패널 옆 속성 열처럼 라벨 열을 맞춥니다.") : "필드 간격(field-gap)으로 상자를 쌓습니다."}
      >
        <FlexState label="발행 설정" block>
          {isB ? (
            <PropertyGroup label="발행 설정">
              <PropertyField layout="row" label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="link" /></PropertyField>
              <PropertyField layout="row" label="카테고리"><PropertySelect options={CATEGORY} defaultValue="ds" /></PropertyField>
              <PropertyField layout="row" label="발행 시각">
                <Popover.Root>
                  <Popover.Trigger asChild><PropertyButton>10월 12일 오전 9:00</PropertyButton></Popover.Trigger>
                  <Popover.Content>날짜 선택은 DatePicker를 씁니다.</Popover.Content>
                </Popover.Root>
              </PropertyField>
            </PropertyGroup>
          ) : (
            <div style={{ display: "grid", gap: "var(--fx-field-gap, 12px)" }}>
              <PropertyField layout="box" label="공개 범위"><PropertySelect options={VISIBILITY} defaultValue="link" /></PropertyField>
              <PropertyField layout="box" label="카테고리"><PropertySelect options={CATEGORY} defaultValue="ds" /></PropertyField>
              <PropertyField layout="box" label="발행 시각">
                <Popover.Root>
                  <Popover.Trigger asChild><PropertyButton>10월 12일 오전 9:00</PropertyButton></Popover.Trigger>
                  <Popover.Content>날짜 선택은 DatePicker를 씁니다.</Popover.Content>
                </Popover.Root>
              </PropertyField>
            </div>
          )}
        </FlexState>
      </FlexSection>

      <FlexSpec
        v={v}
        roles={isB ? (mobile ? ["field-inset", "setting-row-height", "setting-row-radius"] : ["field-height", "field-inset"]) : ["field-height", "field-radius", "field-inset"]}
        extra={[
          ["라벨", isB ? (mobile ? "왼쪽 · 본문색 16" : "왼쪽 1/3 열 · 약한 글자 14") : (mobile ? "위 · 12 약한 글자" : "왼쪽 · 약한 글자 14"), isB ? "B M026 속성 행 배치, 글자는 D" : "C 내부 라벨 후보"],
          ["값", isB && mobile ? "오른쪽 정렬 · 약한 글자" : "왼쪽 정렬 · 본문색", isB ? "B M026" : "D Select 값"],
          ["focus", isB ? "행 안쪽 2px 링" : "테두리 1px + 안쪽 1px", isB ? "테두리 없는 행 — 비입력 링" : "입력류 계약"],
          ...(isB ? [["행 구분선", "1px · 안쪽 여백에서 시작", "D 경계 1px"] as const] : []),
        ]}
      />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
