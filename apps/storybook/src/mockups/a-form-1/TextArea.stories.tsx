import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, TextArea } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/TextArea", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;
/** 실제 화면처럼 흰 표면에 올린다 — 칸 배경(#F3F5F9)이 neutral-weak와 같아 연한 요소가 묻힌다. */
const surface = { background: "var(--dds-color-bg-layer-default)", borderRadius: 12, padding: 20, boxSizing: "border-box", width: "100%" } as const;

const BIO = "프론트엔드 개발자입니다. 디자인 시스템과 접근성에 관심이 많습니다.";

export const Overview: StoryObj = {
  render: () => (
    <MockupPage
      title="TextArea"
      summary="여러 줄 입력입니다. 기본은 3줄 높이에 세로 크기 조절, autoResize를 켜면 내용만큼 늘어납니다. showCount를 켜면 아래에 글자 수를 보이고, maxLength가 있으면 ‘현재/최대’로 보입니다."
    >
      <MockupSection title="Field 구성" columns={2}>
        <MockupState label="Label + Description">
          <Field.Root style={full}>
            <Field.Label>소개</Field.Label>
            <TextArea placeholder="자신을 소개하는 문장을 적습니다" />
            <Field.Description>프로필 상단에 보입니다.</Field.Description>
          </Field.Root>
        </MockupState>
        <MockupState label="Label + ErrorMessage">
          <Field.Root style={full}>
            <Field.Label>신고 사유</Field.Label>
            <TextArea />
            <Field.ErrorMessage>신고 사유를 입력해 주십시오.</Field.ErrorMessage>
          </Field.Root>
        </MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={4} note="medium · rows 3 기준입니다.">
        <MockupState label="default · empty"><TextArea aria-label="소개" placeholder="자신을 소개하는 문장을 적습니다" /></MockupState>
        <MockupState label="filled"><TextArea aria-label="소개" defaultValue={BIO} /></MockupState>
        <MockupState label="hover" force="hover"><TextArea aria-label="소개" defaultValue={BIO} /></MockupState>
        <MockupState label="focus" force="focus"><TextArea aria-label="소개" defaultValue={BIO} /></MockupState>
        <MockupState label="error"><TextArea aria-label="신고 사유" aria-invalid /></MockupState>
        <MockupState label="disabled"><TextArea aria-label="소개" disabled defaultValue={BIO} /></MockupState>
        <MockupState label="readonly · 흰 표면"><div style={surface}><TextArea aria-label="처리 메모" readOnly defaultValue="2026.10.01 접수, 담당자 배정을 마쳤습니다." /></div></MockupState>
        <MockupState label="autoResize"><TextArea aria-label="소개" autoResize rows={1} defaultValue={`${BIO}\n주말에는 사진을 찍습니다.`} /></MockupState>
      </MockupSection>

      <MockupSection title="글자 수 표시" columns={3} note="showCount는 입력 아래 오른쪽에 12px 글자 수를 둡니다. 스크린 리더에는 설명으로 연결되고 입력할 때마다 읽지는 않습니다.">
        <MockupState label="showCount · maxLength 없음"><TextArea aria-label="소개" showCount defaultValue={BIO} /></MockupState>
        <MockupState label="showCount · maxLength 100"><TextArea aria-label="소개" showCount maxLength={100} defaultValue={BIO} /></MockupState>
        <MockupState label="showCount · error">
          <Field.Root style={full}>
            <Field.Label>신고 사유</Field.Label>
            <TextArea showCount maxLength={100} aria-invalid defaultValue="내용이 너무 짧습니다." />
            <Field.ErrorMessage>10자 이상 입력해 주십시오.</Field.ErrorMessage>
          </Field.Root>
        </MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={2}>
        <MockupState label="medium · 패딩 8/12"><TextArea aria-label="소개" size="medium" defaultValue={BIO} /></MockupState>
        <MockupState label="large · 패딩 12/16"><TextArea aria-label="소개" size="large" defaultValue={BIO} /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="문의 작성">
          <form style={{ ...surface, display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }} onSubmit={(e) => e.preventDefault()}>
            <Field.Root>
              <Field.Label>문의 내용</Field.Label>
              <TextArea rows={5} defaultValue="결제 후 영수증 메일을 받지 못했습니다. 주문 번호는 20261001-0042입니다." />
              <Field.Description>답변은 영업일 기준 1일 안에 이메일로 보내 드립니다.</Field.Description>
            </Field.Root>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button type="button" intent="neutral" variant="weak">취소</Button>
              <Button type="submit">문의 보내기</Button>
            </div>
          </form>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["기본 높이", "rows 3 + 세로 패딩", "rows prop (기본 3)"],
        ["radius medium / large", "8 / 12px", "--dds-radius-r2 / r3"],
        ["패딩 medium / large (상하·좌우)", "8·12 / 12·16px", "--dds-dimension-x2·x3 / x3·x4"],
        ["글자 medium / large", "14·19 / 18·24px · regular", "--dds-font-size-t4 / t6, --dds-line-height-t4 / t6"],
        ["테두리 / hover", "1px #6D6F72 / #252629", "--dds-color-stroke-neutral / fg-neutral"],
        ["배경 · 글자 · placeholder", "#FFFFFF · #252629 · #6D6F72", "--dds-color-bg-layer-default / fg-neutral / fg-neutral-weak"],
        ["focus", "링 없음 · 테두리 2px #1550A9(1px 테두리 + 안쪽 1px 그림자)", "--dds-color-stroke-focus-ring"],
        ["error 테두리", "1px #C7272D · focus 시 2px", "--dds-color-stroke-critical"],
        ["disabled", "배경 #E5E8EB · 글자 #8A8C8F · resize 없음", "--dds-color-bg-disabled / fg-disabled"],
        ["readonly", "배경 #F3F5F9 · 테두리 #E5E8EB · resize 없음", "--dds-color-bg-neutral-weak / stroke-neutral-weak"],
        ["글자 수 (showCount)", "입력 아래 오른쪽 정렬 · 12/16px #6D6F72 · 간격 4px", "--dds-font-size-t2 · fg-neutral-weak · --dds-dimension-x1"],
        ["크기 조절", "기본 vertical, autoResize면 none + field-sizing: content", "autoResize prop"],
      ]} />
    </MockupPage>
  ),
};
