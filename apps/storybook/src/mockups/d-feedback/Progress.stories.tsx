import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Progress } from "@dg-design/react";
import * as React from "react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Progress", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 라벨·퍼센트는 Progress 밖에서 조립한다. 라벨을 aria-labelledby로 잇는다. */
function Labeled({ label, value, indeterminate, hint }: { label: string; value?: number; indeterminate?: boolean; hint?: string }) {
  const id = React.useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, lineHeight: "18px" }}>
        <span id={id} style={{ fontWeight: 700 }}>{label}</span>
        <span style={{ color: "var(--dds-color-fg-neutral-weak)", fontVariantNumeric: "tabular-nums" }}>
          {indeterminate ? "확인하는 중입니다" : `${value}%`}
        </span>
      </div>
      <Progress value={value} indeterminate={indeterminate} aria-labelledby={id} />
      {hint && <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--dds-color-fg-neutral-weak)" }}>{hint}</span>}
    </div>
  );
}

/** 시안 칸 배경이 neutral-weak라 같은 색을 쓰는 요소가 묻힌다. 실제 화면처럼 흰 표면 위에 둔다. */
const surface = { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 8, background: "var(--dds-color-bg-layer-default)" } as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Progress" summary="끝을 아는 작업의 진행률을 보입니다. 라벨과 퍼센트는 막대 위에 따로 두고, 진행률을 모르면 불확정으로 씁니다.">
      <MockupSection title="값" columns={4}>
        <MockupState label="0%"><div style={surface}><Progress value={0} aria-label="업로드" /></div></MockupState>
        <MockupState label="25%"><div style={surface}><Progress value={25} aria-label="업로드" /></div></MockupState>
        <MockupState label="70%"><div style={surface}><Progress value={70} aria-label="업로드" /></div></MockupState>
        <MockupState label="100%"><div style={surface}><Progress value={100} aria-label="업로드" /></div></MockupState>
      </MockupSection>

      <MockupSection title="불확정" columns={2} note="40% 폭 막대가 트랙을 1초에 한 번 왕복합니다. 캡처는 애니메이션을 끈 프레임이라 막대가 왼쪽에 멈춰 있습니다.">
        <MockupState label="indeterminate"><div style={surface}><Progress indeterminate aria-label="파일 확인" /></div></MockupState>
        <MockupState label="indeterminate · 라벨"><div style={surface}><Labeled label="파일 확인" indeterminate /></div></MockupState>
      </MockupSection>

      <MockupSection title="라벨과 퍼센트" columns={2}>
        <MockupState label="진행 중"><div style={surface}><Labeled label="사진 업로드" value={42} hint="12장 중 5장을 올렸습니다." /></div></MockupState>
        <MockupState label="완료"><div style={surface}><Labeled label="사진 업로드" value={100} hint="12장을 모두 올렸습니다." /></div></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="파일 업로드 카드">
          <Card style={{ width: 480, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <strong style={{ fontSize: 16, lineHeight: "22px" }}>계약서를 올리는 중입니다</strong>
              <span style={{ fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>창을 닫아도 업로드는 계속됩니다.</span>
            </div>
            <Labeled label="2026년_임대차계약서.pdf" value={68} hint="24.1MB 중 16.4MB" />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button intent="neutral" variant="weak" size="small">업로드 취소</Button>
            </div>
          </Card>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["트랙 높이", "6px", "--dds-dimension-x1_5"],
        ["radius", "full (트랙·막대 모두)", "--dds-radius-r-full"],
        ["트랙 색", "#F3F5F9", "--dds-color-bg-neutral-weak"],
        ["막대 색", "#1550A9", "--dds-color-bg-brand-solid"],
        ["값 변화", "width 200ms ease-out", "--dds-duration-base / easing-out"],
        ["불확정", "폭 40%, 1000ms linear 무한 왕복, reduced-motion에서 정지", "--dds-duration-spin / easing-linear"],
        ["라벨 / 퍼센트", "13px bold #252629 / 13px #6D6F72 tabular-nums, 막대와 간격 8px", "--dds-font-size-t3 / dimension-x2"],
        ["보조 문구", "12px / 16px · #6D6F72", "--dds-font-size-t2 / color-fg-neutral-weak"],
        ["접근성", "role=progressbar, 라벨은 aria-labelledby, 불확정이면 aria-valuenow 없음", "—"],
      ]} />
    </MockupPage>
  ),
};
