import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Card, Collapsible, Separator, Switch } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Collapsible", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 카드 안에서는 트리거 패딩만큼 당겨 글자 왼쪽 끝을 제목과 맞춘다. */
const pull: React.CSSProperties = { marginInlineStart: "calc(-1 * var(--dds-dimension-x2))" };
const weak: React.CSSProperties = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" };

/** 열리면 위로 돈다 — Trigger의 data-state를 CSS로 읽지 않고 상태를 그대로 받는다. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : undefined }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Demo({ open = false, disabled = false, label = "고급 설정" }: { open?: boolean; disabled?: boolean; label?: string }) {
  return (
    <Collapsible.Root defaultOpen={open} disabled={disabled} style={{ width: "100%" }}>
      <Collapsible.Trigger>
        {label}
        <Chevron open={open} />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ ...weak, padding: "var(--dds-dimension-x2) var(--dds-dimension-x2) 0" }}>저장 위치와 공개 범위를 바꿀 수 있습니다.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

const ITEMS = [
  ["상품 금액", "48,000원"],
  ["배송비", "3,000원"],
  ["쿠폰 할인", "-5,000원"],
] as const;

function OrderSummary() {
  const [open, setOpen] = React.useState(true);
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x3)", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong style={{ fontSize: "var(--dds-font-size-t5)" }}>결제 금액</strong>
        <strong style={{ fontSize: "var(--dds-font-size-t6)" }}>46,000원</strong>
      </div>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger style={pull}>
          금액 상세 {open ? "접기" : "보기"}
          <Chevron open={open} />
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x2)", paddingTop: "var(--dds-dimension-x3)" }}>
            <Separator />
            {ITEMS.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={weak}>{k}</span><span>{v}</span>
              </div>
            ))}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  );
}

function SettingsForm() {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x3)", width: "100%" }}>
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>검색 엔진에 노출</span><Switch defaultChecked />
      </label>
      <Collapsible.Root>
        <Collapsible.Trigger style={pull}>
          고급 설정
          <Chevron open={false} />
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p style={{ ...weak, paddingTop: "var(--dds-dimension-x2)" }}>캐시 기간을 바꿀 수 있습니다.</p>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Collapsible" summary="영역 하나를 열고 닫는 기본 요소입니다. 여러 항목을 묶어 열고 닫을 때는 Accordion을 씁니다.">
      <MockupSection title="열림" columns={2}>
        <MockupState label="closed · Content 높이 0" minHeight={120}><Demo /></MockupState>
        <MockupState label="open · 실측 높이로 전환" minHeight={120}><Demo open /></MockupState>
      </MockupSection>

      <MockupSection title="트리거 상태" columns={5}>
        <MockupState label="default"><Demo /></MockupState>
        <MockupState label="hover" force="hover"><Demo /></MockupState>
        <MockupState label="pressed" force="pressed"><Demo /></MockupState>
        <MockupState label="focus" force="focus"><Demo /></MockupState>
        <MockupState label="disabled"><Demo disabled /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="결제 금액 상세 · open"><OrderSummary /></MockupState>
        <MockupState label="설정 폼 안 · closed"><SettingsForm /></MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["트리거 패딩", "4 × 8px, 아이콘 간격 4px", "--dds-dimension-x1 / x2"],
        ["트리거 radius", "4px", "--dds-radius-r1"],
        ["카드 안 정렬", "트리거를 -8px 당겨 글자를 제목 왼쪽 끝에 맞춤", "--dds-dimension-x2"],
        ["트리거 글자", "상속 (예시 14px)", "--dds-font-size-t4"],
        ["hover / pressed 배경", "rgb(16 18 20 / 0.06) / 0.12", "--dds-color-bg-transparent-hover / -pressed"],
        ["focus ring", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["disabled 글자", "#8A8C8F", "--dds-color-fg-disabled"],
        ["열림 전환", "height 200ms · opacity 150ms ease-out", "--dds-duration-base / -fast, --dds-easing-out"],
        ["닫힘 Content", "height 0, inert (DOM 유지)", undefined],
        ["chevron", "16px stroke 1.75, 열리면 180도", undefined],
      ]} />
    </MockupPage>
  ),
};
