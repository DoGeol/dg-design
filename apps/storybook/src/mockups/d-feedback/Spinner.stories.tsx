import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Spinner } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Spinner", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { color: "var(--dds-color-fg-neutral-weak)", fontSize: 13 } as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Spinner" summary="끝을 알 수 없는 짧은 대기에 씁니다. 색은 부모 글자색을 따르고, 혼자 쓸 때는 aria-label로 무엇을 기다리는지 알립니다.">
      <MockupSection title="크기">
        <MockupState label="small · 16"><Spinner size="small" aria-label="불러오는 중" /></MockupState>
        <MockupState label="medium · 20 (기본)"><Spinner aria-label="불러오는 중" /></MockupState>
      </MockupSection>

      <MockupSection title="색" note="색 prop이 없습니다. 부모의 color를 그대로 씁니다.">
        <MockupState label="fg-neutral"><span style={{ color: "var(--dds-color-fg-neutral)" }}><Spinner aria-label="불러오는 중" /></span></MockupState>
        <MockupState label="fg-neutral-weak"><span style={{ color: "var(--dds-color-fg-neutral-weak)" }}><Spinner aria-label="불러오는 중" /></span></MockupState>
        <MockupState label="fg-brand"><span style={{ color: "var(--dds-color-fg-brand)" }}><Spinner aria-label="불러오는 중" /></span></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="버튼 안 · Button loading">
          <Button loading>저장</Button>
          <Button intent="neutral" variant="weak" loading>불러오기</Button>
          <Button size="small" variant="weak" loading>새로 고침</Button>
        </MockupState>
        <MockupState label="문구 옆 · 인라인 small">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, ...weak }}>
            <Spinner size="small" aria-hidden="true" />
            검색 결과를 불러오는 중입니다
          </span>
        </MockupState>
        <MockupState label="패널 안 · 목록 영역 가운데" span={2}>
          <Card style={{ width: "100%", height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ color: "var(--dds-color-fg-neutral-weak)" }}><Spinner aria-labelledby="mk-spinner-panel" /></span>
            <span id="mk-spinner-panel" style={weak}>주문 내역을 불러오는 중입니다</span>
          </Card>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["크기 small / medium", "16 / 20px", "--dds-dimension-x4 / x5"],
        ["선 두께", "2px (위쪽 한 변만 투명)", "--dds-dimension-x0_5"],
        ["모양", "원 · radius full", "--dds-radius-r-full"],
        ["색", "currentColor (부모 글자색)", "—"],
        ["회전", "1000ms linear 무한, reduced-motion에서 정지", "--dds-duration-spin / easing-linear"],
        ["접근성", "aria-label·aria-labelledby가 있으면 role=status, 없으면 aria-hidden", "—"],
        ["패널 안 문구", "13px · #6D6F72, 스피너와 간격 12px", "--dds-font-size-t3 / color-fg-neutral-weak"],
      ]} />
    </MockupPage>
  ),
};
