import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Button", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Button" summary="저장·확정은 brand solid, 취소·닫기는 neutral weak, 되돌릴 수 없는 삭제는 critical입니다.">
      <MockupSection title="위계" note="한 화면의 주요 액션은 brand solid 하나만 둡니다.">
        <MockupState label="brand · solid"><Button>저장</Button></MockupState>
        <MockupState label="neutral · weak"><Button intent="neutral" variant="weak">취소</Button></MockupState>
        <MockupState label="critical · solid"><Button intent="critical">삭제</Button></MockupState>
        <MockupState label="brand · weak"><Button variant="weak">초안 저장</Button></MockupState>
        <MockupState label="neutral · ghost"><Button intent="neutral" variant="ghost">닫기</Button></MockupState>
        <MockupState label="critical · ghost (undo 있음)"><Button intent="critical" variant="ghost">목록에서 제거</Button></MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={5} note="brand solid · medium 기준입니다.">
        <MockupState label="default"><Button>저장</Button></MockupState>
        <MockupState label="hover" force="hover"><Button>저장</Button></MockupState>
        <MockupState label="pressed" force="pressed"><Button>저장</Button></MockupState>
        <MockupState label="focus" force="focus"><Button>저장</Button></MockupState>
        <MockupState label="disabled"><Button disabled>저장</Button></MockupState>
        <MockupState label="loading" span={5}><Button loading>저장</Button><Button intent="neutral" variant="weak" loading>불러오기</Button></MockupState>
      </MockupSection>

      <MockupSection title="크기">
        <MockupState label="small · 36"><Button size="small">저장</Button></MockupState>
        <MockupState label="medium · 40"><Button size="medium">저장</Button></MockupState>
        <MockupState label="large · 52"><Button size="large">저장</Button></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="다이얼로그 하단 · 오른쪽 정렬">
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, width: "100%" }}>
            <Button intent="neutral" variant="weak">취소</Button>
            <Button>변경 사항 저장</Button>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["높이 small / medium / large", "36 / 40 / 52px", "--dds-dimension-x9 / x10 / x13"],
        ["radius small·medium / large", "8 / 12px", "--dds-radius-r2 / r3"],
        ["좌우 패딩 small / medium / large", "12 / 16 / 20px", "--dds-dimension-x3 / x4 / x5"],
        ["글자 small / medium / large", "13 / 14 / 18px · bold", "--dds-font-size-t3 / t4 / t6"],
        ["brand solid 배경 / hover / pressed", "#1550A9 / #0B397E / #042454", "--dds-color-bg-brand-solid(-hover/-pressed)"],
        ["focus ring", "2px #1550A9 outline", "--dds-color-stroke-focus-ring"],
        ["disabled", "배경 #E5E8EB · 글자 #8A8C8F", "--dds-color-bg-disabled / fg-disabled"],
      ]} />
    </MockupPage>
  ),
};
