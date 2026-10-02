import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, RadioGroup } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/RadioGroup", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 실제 화면처럼 흰 표면에 올린다 — 칸 배경(#F3F5F9)이 neutral-weak와 같아 연한 요소가 묻힌다. */
const surface = { background: "var(--dds-color-bg-layer-default)", borderRadius: 12, padding: 20, boxSizing: "border-box", width: "100%" } as const;

const VISIBILITY = [
  { value: "public", label: "전체 공개" },
  { value: "link", label: "링크가 있는 사람" },
  { value: "private", label: "나만 보기" },
] as const;

function Visibility({ orientation }: { orientation: "vertical" | "horizontal" }) {
  return (
    <RadioGroup.Root aria-label="공개 범위" defaultValue="public" orientation={orientation}>
      {VISIBILITY.map((v) => <RadioGroup.Item key={v.value} value={v.value}>{v.label}</RadioGroup.Item>)}
    </RadioGroup.Root>
  );
}

/** 강제 상태 칸은 대상 요소가 하나여야 해서 항목 하나짜리 그룹으로 그린다. */
function One({ checked, disabled, invalid }: { checked?: boolean; disabled?: boolean; invalid?: boolean }) {
  return (
    <RadioGroup.Root aria-label="공개 범위" defaultValue={checked ? "public" : undefined} disabled={disabled} aria-invalid={invalid}>
      <RadioGroup.Item value="public">전체 공개</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

function Period({ size }: { size: "small" | "medium" | "large" }) {
  return (
    <RadioGroup.Root aria-label="기간" variant="segmented" size={size} defaultValue="week">
      <RadioGroup.Item value="day">일간</RadioGroup.Item>
      <RadioGroup.Item value="week">주간</RadioGroup.Item>
      <RadioGroup.Item value="month">월간</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage
      title="RadioGroup"
      summary="여러 선택지 중 하나를 고릅니다. 기본형은 세로·가로 배치, segmented는 보기 전환처럼 짧은 선택지에 씁니다."
    >
      <MockupSection title="배치" columns={2} note="화살표 키는 배치 방향 축으로만 이동합니다.">
        <MockupState label="vertical · 간격 12"><Visibility orientation="vertical" /></MockupState>
        <MockupState label="horizontal · 간격 16"><Visibility orientation="horizontal" /></MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={4} note="기본형 기준입니다. unchecked는 pressed 반응이 없습니다.">
        <MockupState label="unchecked"><One /></MockupState>
        <MockupState label="checked"><One checked /></MockupState>
        <MockupState label="hover · unchecked" force="hover"><One /></MockupState>
        <MockupState label="hover · checked" force="hover"><One checked /></MockupState>
        <MockupState label="pressed · checked" force="pressed"><One checked /></MockupState>
        <MockupState label="focus" force="focus"><One checked /></MockupState>
        <MockupState label="disabled · unchecked"><One disabled /></MockupState>
        <MockupState label="disabled · checked"><One disabled checked /></MockupState>
        <MockupState label="error · unchecked"><One invalid /></MockupState>
        <MockupState label="error · hover" force="hover"><One invalid /></MockupState>
        <MockupState label="error · checked"><One invalid checked /></MockupState>
      </MockupSection>

      <MockupSection title="segmented" columns={3} note="가로 고정입니다. 크기는 segmented에만 적용됩니다. 트랙이 #F3F5F9라 흰 표면 위에 둡니다.">
        <MockupState label="small · 28"><div style={surface}><Period size="small" /></div></MockupState>
        <MockupState label="medium · 36"><div style={surface}><Period size="medium" /></div></MockupState>
        <MockupState label="large · 44"><div style={surface}><Period size="large" /></div></MockupState>
        <MockupState label="focus" force="focus">
          <div style={surface}>
            <RadioGroup.Root aria-label="기간" variant="segmented" defaultValue="week">
              <RadioGroup.Item value="week">주간</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
        </MockupState>
        <MockupState label="disabled · 그룹 전체" span={2}>
          <div style={surface}>
            <RadioGroup.Root aria-label="기간" variant="segmented" defaultValue="week" disabled>
              <RadioGroup.Item value="day">일간</RadioGroup.Item>
              <RadioGroup.Item value="week">주간</RadioGroup.Item>
              <RadioGroup.Item value="month">월간</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="Field · 라벨과 설명">
          <Field.Root>
            <Field.Label>글 공개 범위</Field.Label>
            <Field.Description>발행 후에도 바꿀 수 있습니다.</Field.Description>
            <RadioGroup.Root defaultValue="link">
              {VISIBILITY.map((v) => <RadioGroup.Item key={v.value} value={v.value}>{v.label}</RadioGroup.Item>)}
            </RadioGroup.Root>
          </Field.Root>
        </MockupState>
        <MockupState label="Field · 오류(선택 없음)">
          <Field.Root>
            <Field.Label>배송 방법</Field.Label>
            <RadioGroup.Root orientation="horizontal">
              <RadioGroup.Item value="parcel">택배</RadioGroup.Item>
              <RadioGroup.Item value="quick">퀵서비스</RadioGroup.Item>
              <RadioGroup.Item value="pickup">방문 수령</RadioGroup.Item>
            </RadioGroup.Root>
            <Field.ErrorMessage>배송 방법을 선택해 주십시오.</Field.ErrorMessage>
          </Field.Root>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["원 크기 · radius", "16px · full", "--dds-dimension-x4, --dds-radius-r-full"],
        ["테두리 (unchecked)", "2px #6D6F72", "--dds-dimension-x0_5, --dds-color-stroke-neutral"],
        ["error 테두리 (unchecked)", "2px #C7272D · 그룹의 aria-invalid 또는 Field 오류일 때. checked·disabled는 그대로", "--dds-color-stroke-critical"],
        ["checked 배경 / hover / pressed", "#1550A9 / #0B397E / #042454", "--dds-color-bg-brand-solid(-hover/-pressed)"],
        ["checked 점", "원의 45% · #FFFFFF", "--dds-color-fg-brand-contrast"],
        ["unchecked hover", "rgb(16 18 20 / 0.06)", "--dds-color-bg-transparent-hover"],
        ["원–라벨 간격 · 라벨", "8px · 14·19px #252629", "--dds-dimension-x2, --dds-font-size-t4, --dds-color-fg-neutral"],
        ["항목 간격 vertical / horizontal", "12 / 16px", "--dds-dimension-x3 / x4"],
        ["focus ring", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["disabled", "배경 #E5E8EB · 테두리 #E5E8EB · 점·라벨 #8A8C8F", "--dds-color-bg-disabled / stroke-neutral-weak / fg-disabled"],
        ["segmented 높이 small / medium / large", "28 / 36 / 44px (토큰 아님)", "—"],
        ["segmented 트랙", "#F3F5F9 · 안쪽 여백 2px · radius full", "--dds-color-bg-neutral-weak, --dds-dimension-x0_5"],
        ["segmented 항목 패딩 · 글자", "10·12·16px · 12·13·14px", "--dds-dimension-x2_5/x3/x4, --dds-font-size-t2/t3/t4"],
        ["segmented 선택 항목", "#FFFFFF · shadow 0 1px 3px rgba(0,0,0,.1) · bold #252629", "--dds-color-bg-layer-default, --dds-font-weight-bold"],
        ["segmented 미선택 글자 / hover", "#6D6F72 / #252629", "--dds-color-fg-neutral-weak / fg-neutral"],
      ]} />
    </MockupPage>
  ),
};
