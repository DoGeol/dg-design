import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, TextField } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/TextField", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const full = { width: "100%" } as const;
/** 실제 화면처럼 흰 표면에 올린다 — 칸 배경(#F3F5F9)이 neutral-weak와 같아 연한 요소가 묻힌다. */
const surface = { background: "var(--dds-color-bg-layer-default)", borderRadius: 12, padding: 20, boxSizing: "border-box", width: "100%" } as const;


export const Overview: StoryObj = {
  render: () => (
    <MockupPage
      title="TextField"
      summary="한 줄 입력입니다. 라벨·설명·오류는 Field로 묶고, 오류 문구가 있으면 테두리가 critical로 바뀝니다. 입력 앞뒤에는 prefix·suffix로 아이콘이나 단위를 붙일 수 있습니다."
    >
      <MockupSection title="Field 구성" columns={2} note="Field.Root 안에서 id·aria-describedby·aria-invalid가 자동으로 연결됩니다.">
        <MockupState label="Label + Description">
          <Field.Root style={full}>
            <Field.Label>표시 이름</Field.Label>
            <TextField placeholder="이름을 입력합니다" />
            <Field.Description>프로필과 댓글에 보입니다.</Field.Description>
          </Field.Root>
        </MockupState>
        <MockupState label="Label + ErrorMessage">
          <Field.Root style={full}>
            <Field.Label>이메일</Field.Label>
            <TextField type="email" defaultValue="dogeol@" />
            <Field.ErrorMessage>이메일 형식이 올바르지 않습니다.</Field.ErrorMessage>
          </Field.Root>
        </MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={4} note="medium 기준입니다. pressed는 입력 요소에 해당하지 않습니다.">
        <MockupState label="default · empty"><TextField aria-label="이름" placeholder="이름을 입력합니다" /></MockupState>
        <MockupState label="filled"><TextField aria-label="이름" defaultValue="편도걸" /></MockupState>
        <MockupState label="hover" force="hover"><TextField aria-label="이름" defaultValue="편도걸" /></MockupState>
        <MockupState label="focus" force="focus"><TextField aria-label="이름" defaultValue="편도걸" /></MockupState>
        <MockupState label="error"><TextField aria-label="이메일" aria-invalid defaultValue="dogeol@" /></MockupState>
        <MockupState label="disabled"><TextField aria-label="이름" disabled defaultValue="편도걸" /></MockupState>
        <MockupState label="disabled · empty"><TextField aria-label="이름" disabled placeholder="이름을 입력합니다" /></MockupState>
        <MockupState label="readonly · 흰 표면"><div style={surface}><TextField aria-label="계정 ID" readOnly defaultValue="dogeol" /></div></MockupState>
      </MockupSection>

      <MockupSection title="접두 · 접미" columns={4} note="prefix·suffix가 있으면 테두리·배경·상태를 감싸는 쪽이 갖고, 안쪽 입력은 비웁니다. 장식은 입력과 8px 떨어집니다.">
        <MockupState label="prefix · 단위"><TextField aria-label="금액" prefix="₩" placeholder="0" inputMode="numeric" /></MockupState>
        <MockupState label="suffix · 단위"><TextField aria-label="수량" suffix="개" defaultValue="12" inputMode="numeric" /></MockupState>
        <MockupState label="prefix + suffix"><TextField aria-label="금액" prefix="₩" suffix="원" defaultValue="39,000" inputMode="numeric" /></MockupState>
        <MockupState label="prefix · 아이콘"><TextField aria-label="검색어" type="search" prefix={<SearchIcon />} placeholder="주문 검색" /></MockupState>
        <MockupState label="hover" force="hover"><TextField aria-label="금액" prefix="₩" suffix="원" defaultValue="39,000" /></MockupState>
        <MockupState label="focus" force="focus"><TextField aria-label="금액" prefix="₩" suffix="원" defaultValue="39,000" /></MockupState>
        <MockupState label="error"><TextField aria-label="금액" prefix="₩" suffix="원" aria-invalid defaultValue="-100" /></MockupState>
        <MockupState label="disabled"><TextField aria-label="금액" prefix="₩" suffix="원" disabled defaultValue="39,000" /></MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={2} note="입력류에는 small(36)이 없습니다.">
        <MockupState label="medium · 40"><TextField aria-label="검색어" size="medium" placeholder="검색어를 입력합니다" /></MockupState>
        <MockupState label="large · 52"><TextField aria-label="검색어" size="large" placeholder="검색어를 입력합니다" /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="계정 정보 폼 · 저장 버튼과 같은 높이(40)">
          <form style={{ ...surface, display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }} onSubmit={(e) => e.preventDefault()}>
            <Field.Root>
              <Field.Label>표시 이름</Field.Label>
              <TextField defaultValue="편도걸" />
              <Field.Description>프로필과 댓글에 보입니다.</Field.Description>
            </Field.Root>
            <Field.Root>
              <Field.Label>연락용 이메일</Field.Label>
              <TextField type="email" defaultValue="dogeol@" />
              <Field.ErrorMessage>이메일 형식이 올바르지 않습니다.</Field.ErrorMessage>
            </Field.Root>
            <Field.Root>
              <Field.Label>월 예산</Field.Label>
              <TextField prefix="₩" suffix="원" defaultValue="500,000" inputMode="numeric" />
              <Field.Description>쉼표 없이 숫자만 입력해도 됩니다.</Field.Description>
            </Field.Root>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button type="button" intent="neutral" variant="weak">취소</Button>
              <Button type="submit">변경 사항 저장</Button>
            </div>
          </form>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["높이 medium / large", "40 / 52px", "--dds-dimension-x10 / x13"],
        ["radius medium / large", "8 / 12px", "--dds-radius-r2 / r3"],
        ["좌우 패딩 medium / large", "12 / 16px", "--dds-dimension-x3 / x4"],
        ["글자 medium / large", "14·19 / 18·24px · regular", "--dds-font-size-t4 / t6, --dds-line-height-t4 / t6"],
        ["테두리 / hover", "1px #6D6F72 / #252629", "--dds-color-stroke-neutral / fg-neutral"],
        ["배경 · 글자 · placeholder", "#FFFFFF · #252629 · #6D6F72", "--dds-color-bg-layer-default / fg-neutral / fg-neutral-weak"],
        ["focus", "링 없음 · 테두리 2px #1550A9(1px 테두리 + 안쪽 1px 그림자)", "--dds-color-stroke-focus-ring"],
        ["error 테두리", "1px #C7272D · focus 시 2px", "--dds-color-stroke-critical"],
        ["disabled", "배경 #E5E8EB · 글자 #8A8C8F · 테두리 1px #E5E8EB", "--dds-color-bg-disabled / fg-disabled / stroke-neutral-weak"],
        ["readonly", "배경 #F3F5F9 · 테두리 #E5E8EB", "--dds-color-bg-neutral-weak / stroke-neutral-weak"],
        ["prefix · suffix", "입력과 간격 8px · #6D6F72 · 아이콘은 16px · disabled는 #8A8C8F", "--dds-dimension-x2 · --dds-color-fg-neutral-weak / fg-disabled"],
        ["Field 세로 간격", "6px", "--dds-dimension-x1_5"],
        ["Field 라벨", "14px bold #252629", "--dds-font-size-t4, --dds-font-weight-bold, --dds-color-fg-neutral"],
        ["Field 설명 / 오류", "13px #6D6F72 / #731115", "--dds-font-size-t3, --dds-color-fg-neutral-weak / fg-critical"],
      ]} />
    </MockupPage>
  ),
};
