import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Field } from "@dg-design/react";
import * as React from "react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Checkbox", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const fieldset = { display: "flex", flexDirection: "column", gap: 12, margin: 0, padding: 0, border: 0, minWidth: 0 } as const;
const legend = { padding: 0, marginBottom: 12, fontWeight: 700 } as const;

const ALERTS = [
  { id: "comment", label: "새 댓글" },
  { id: "mention", label: "나를 언급한 글" },
  { id: "release", label: "배포 완료" },
] as const;

/** 전체 선택이 하위 항목에 따라 checked·indeterminate로 바뀌는 그룹 */
function AlertGroup() {
  const [on, setOn] = React.useState<Record<string, boolean>>({ comment: true, mention: true, release: false });
  const count = ALERTS.filter((a) => on[a.id]).length;
  const all = count === ALERTS.length;
  return (
    <fieldset style={fieldset}>
      <legend style={legend}>이메일 알림</legend>
      <Checkbox
        checked={all}
        indeterminate={count > 0 && !all}
        onChange={() => setOn(Object.fromEntries(ALERTS.map((a) => [a.id, !all])))}
      >
        전체 선택
      </Checkbox>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 24 }}>
        {ALERTS.map((a) => (
          <Checkbox key={a.id} checked={on[a.id]} onChange={(e) => setOn({ ...on, [a.id]: e.target.checked })}>
            {a.label}
          </Checkbox>
        ))}
      </div>
    </fieldset>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage
      title="Checkbox"
      summary="여러 개를 고를 수 있는 선택입니다. 부분 선택은 indeterminate로 표시하고, 그룹은 fieldset·legend로 묶습니다."
    >
      <MockupSection title="값" columns={3}>
        <MockupState label="unchecked"><Checkbox>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="checked"><Checkbox defaultChecked>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="indeterminate"><Checkbox indeterminate>전체 선택</Checkbox></MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={4} note="medium 기준입니다. unchecked는 pressed 반응이 없습니다.">
        <MockupState label="hover · unchecked" force="hover"><Checkbox>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="hover · checked" force="hover"><Checkbox defaultChecked>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="pressed · checked" force="pressed"><Checkbox defaultChecked>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="focus" force="focus"><Checkbox defaultChecked>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="disabled · unchecked"><Checkbox disabled>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="disabled · checked"><Checkbox disabled defaultChecked>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="disabled · indeterminate"><Checkbox disabled indeterminate>전체 선택</Checkbox></MockupState>
        <MockupState label="error · unchecked"><Checkbox aria-invalid>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="error · hover" force="hover"><Checkbox aria-invalid>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="error · checked"><Checkbox aria-invalid defaultChecked>약관에 동의합니다</Checkbox></MockupState>
        <MockupState label="label 없음"><Checkbox aria-label="이 행 선택" defaultChecked /></MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={2}>
        <MockupState label="medium · 박스 16">
          <Checkbox size="medium">기억하기</Checkbox>
          <Checkbox size="medium" defaultChecked>기억하기</Checkbox>
        </MockupState>
        <MockupState label="large · 박스 20">
          <Checkbox size="large">기억하기</Checkbox>
          <Checkbox size="large" defaultChecked>기억하기</Checkbox>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="그룹 · 전체 선택(indeterminate)">
          <AlertGroup />
        </MockupState>
        <MockupState label="필수 동의 · 오류 문구">
          <Field.Root>
            <Checkbox>서비스 이용약관에 동의합니다 (필수)</Checkbox>
            <Field.ErrorMessage>필수 약관에 동의해야 가입할 수 있습니다.</Field.ErrorMessage>
          </Field.Root>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["박스 medium / large", "16 / 20px", "--dds-dimension-x4 / x5"],
        ["radius medium / large", "4 / 6px", "--dds-radius-r1 / r1_5"],
        ["박스–라벨 간격", "8px", "--dds-dimension-x2"],
        ["라벨 medium / large", "14·19 / 18·24px · #252629", "--dds-font-size-t4 / t6, --dds-color-fg-neutral"],
        ["테두리 (unchecked)", "1px #6D6F72", "--dds-color-stroke-neutral"],
        ["error 테두리 (unchecked)", "1px #C7272D · aria-invalid 또는 Field 오류일 때. checked·disabled는 그대로", "--dds-color-stroke-critical"],
        ["checked·indeterminate 배경 / hover / pressed", "#1550A9 / #0B397E / #042454", "--dds-color-bg-brand-solid(-hover/-pressed)"],
        ["체크·대시 아이콘", "#FFFFFF stroke 1.5, 박스의 70%", "--dds-color-fg-brand-contrast"],
        ["unchecked hover", "rgb(16 18 20 / 0.06)", "--dds-color-bg-transparent-hover"],
        ["focus ring", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["disabled", "배경 #E5E8EB · 테두리 #E5E8EB · 아이콘·라벨 #8A8C8F", "--dds-color-bg-disabled / stroke-neutral-weak / fg-disabled"],
        ["그룹 항목 간격", "12px (스토리 조합)", "--dds-dimension-x3"],
      ]} />
    </MockupPage>
  ),
};
