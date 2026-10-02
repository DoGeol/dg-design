import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Switch } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Switch", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 실제 화면처럼 흰 표면에 올린다 — 칸 배경(#F3F5F9)이 neutral-weak와 같아 연한 요소가 묻힌다. */
const surface = { background: "var(--dds-color-bg-layer-default)", borderRadius: 12, padding: 20, boxSizing: "border-box", width: "100%" } as const;

/** 라벨 왼쪽·스위치 오른쪽 설정 행. Field.Label이 Switch의 input id를 가리킨다. */
function SettingRow({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <Field.Root style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <Field.Label>{label}</Field.Label>
        <Field.Description>{description}</Field.Description>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </Field.Root>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage
      title="Switch"
      summary="즉시 적용되는 켜기·끄기입니다. 저장 버튼이 따로 있는 폼의 선택은 Checkbox를 씁니다."
    >
      <MockupSection title="값" columns={2}>
        <MockupState label="off"><Switch>다크 모드</Switch></MockupState>
        <MockupState label="on"><Switch defaultChecked>다크 모드</Switch></MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={4} note="medium 기준입니다. off는 hover·pressed 반응이 없습니다.">
        <MockupState label="hover · on" force="hover"><Switch defaultChecked>다크 모드</Switch></MockupState>
        <MockupState label="pressed · on" force="pressed"><Switch defaultChecked>다크 모드</Switch></MockupState>
        <MockupState label="focus · off" force="focus"><Switch>다크 모드</Switch></MockupState>
        <MockupState label="focus · on" force="focus"><Switch defaultChecked>다크 모드</Switch></MockupState>
        <MockupState label="disabled · off"><Switch disabled>다크 모드</Switch></MockupState>
        <MockupState label="disabled · on"><Switch disabled defaultChecked>다크 모드</Switch></MockupState>
        <MockupState label="label 없음" span={2}><Switch aria-label="다크 모드" defaultChecked /></MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={2}>
        <MockupState label="medium · 32×20">
          <Switch size="medium">자동 저장</Switch>
          <Switch size="medium" defaultChecked>자동 저장</Switch>
        </MockupState>
        <MockupState label="large · 40×24">
          <Switch size="large">자동 저장</Switch>
          <Switch size="large" defaultChecked>자동 저장</Switch>
        </MockupState>
      </MockupSection>

      <MockupSection title="라벨 배치" columns={3} note="기본은 라벨이 오른쪽이고, labelPlacement=&quot;start&quot;면 왼쪽입니다. 양 끝으로 벌리는 행은 Field.Label을 앞에 둡니다.">
        <MockupState label="라벨 오른쪽 · children">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Switch defaultChecked>새 댓글 알림</Switch>
            <Switch>주간 요약 메일</Switch>
          </div>
        </MockupState>
        <MockupState label="라벨 왼쪽 · labelPlacement=start">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Switch labelPlacement="start" defaultChecked>새 댓글 알림</Switch>
            <Switch labelPlacement="start">주간 요약 메일</Switch>
          </div>
        </MockupState>
        <MockupState label="양 끝 정렬 · Field.Label + 오른쪽 스위치">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <Field.Root style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <Field.Label>새 댓글 알림</Field.Label>
              <Switch defaultChecked />
            </Field.Root>
            <Field.Root style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <Field.Label>주간 요약 메일</Field.Label>
              <Switch />
            </Field.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="알림 설정 · 설명 있는 설정 행">
          <div style={{ ...surface, display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
            <SettingRow label="푸시 알림" description="새 댓글과 멘션을 바로 알려 드립니다." defaultChecked />
            <SettingRow label="방해 금지 시간" description="오후 10시부터 오전 8시까지 알림을 보내지 않습니다." />
            <SettingRow label="마케팅 정보 수신" description="이벤트와 할인 소식을 이메일로 받습니다." />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["트랙 medium / large", "32×20 / 40×24px · radius full", "--dds-dimension-x8×x5 / x10×x6, --dds-radius-r-full"],
        ["썸 medium / large", "16 / 20px · 안쪽 여백 2px", "--dds-dimension-x4 / x5, --dds-dimension-x0_5"],
        ["썸 이동 거리 medium / large", "12 / 16px · 150ms ease-out", "--dds-dimension-x3 / x4, --dds-duration-fast"],
        ["트랙–라벨 간격", "8px", "--dds-dimension-x2"],
        ["라벨 medium / large", "14·19 / 18·24px · #252629", "--dds-font-size-t4 / t6, --dds-color-fg-neutral"],
        ["off 트랙 · 썸", "#D2D4D7 · #FFFFFF", "--dds-color-bg-neutral-weak-pressed / fg-brand-contrast"],
        ["on 트랙 / hover / pressed", "#1550A9 / #0B397E / #042454", "--dds-color-bg-brand-solid(-hover/-pressed)"],
        ["focus ring (트랙)", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["disabled", "트랙 #E5E8EB · 썸·라벨 #8A8C8F", "--dds-color-bg-disabled / fg-disabled"],
        ["labelPlacement=start", "라벨이 왼쪽 · DOM 순서와 접근성 이름은 그대로", "—"],
        ["테두리", "없음 (채움 트랙)", "—"],
      ]} />
    </MockupPage>
  ),
};
