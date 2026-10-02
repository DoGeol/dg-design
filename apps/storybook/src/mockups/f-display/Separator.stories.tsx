import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button, Card, Separator } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Separator", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak: React.CSSProperties = { color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" };
const row: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--dds-dimension-x3) var(--dds-dimension-x4)" };

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const BOLD = "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z";
const ITALIC = "M14 5h-4M14 19h-4M14 5l-4 14";
const LINK = "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1";
const LIST = "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01";

function ToolButton({ label, d }: { label: string; d: string }) {
  return <Button intent="neutral" variant="ghost" size="small" aria-label={label} style={{ paddingInline: "var(--dds-dimension-x2)" }}><Icon d={d} /></Button>;
}

const SETTINGS = [
  ["이메일 알림", "켜짐"],
  ["보고서 발송 주기", "매주 월요일"],
  ["시간대", "서울 (UTC+9)"],
] as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Separator" summary="같은 면 안에서 내용 묶음을 나누는 1px 선입니다. 기본은 장식용이라 보조기기가 읽지 않습니다.">
      <MockupSection title="방향" columns={2}>
        <MockupState label="horizontal · 부모 폭 100%">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x3)", width: "100%" }}>
            <span>기본 정보</span>
            <Separator />
            <span>결제 정보</span>
          </div>
        </MockupState>
        <MockupState label="vertical · 부모 높이에 맞춰 늘어남">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x3)", height: 20 }}>
            <span>공개 문서</span>
            <Separator orientation="vertical" />
            <span style={weak}>2026.10.02 수정</span>
            <Separator orientation="vertical" />
            <span style={weak}>조회 1,204</span>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="의미" columns={2} note="목록 끝·영역 경계처럼 구조가 바뀌는 지점에만 decorative={false}를 줍니다.">
        <MockupState label="decorative (기본) · aria-hidden"><div style={{ width: "100%" }}><Separator /></div></MockupState>
        <MockupState label="semantic · role=separator"><div style={{ width: "100%" }}><Separator decorative={false} /></div></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="목록 안 · 행 사이">
          <Card style={{ padding: 0, width: "100%" }}>
            {SETTINGS.map(([k, v], i) => (
              <React.Fragment key={k}>
                {i > 0 && <Separator />}
                <div style={row}><span>{k}</span><span style={weak}>{v}</span></div>
              </React.Fragment>
            ))}
          </Card>
        </MockupState>
        <MockupState label="툴바 안 · 버튼 묶음 사이 (vertical)">
          <div role="toolbar" aria-label="서식" style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x1)", height: 36, padding: "0 var(--dds-dimension-x1)", border: "1px solid var(--dds-color-stroke-neutral-weak)", borderRadius: "var(--dds-radius-r2)", background: "var(--dds-color-bg-layer-default)" }}>
            <ToolButton label="굵게" d={BOLD} />
            <ToolButton label="기울임" d={ITALIC} />
            <div style={{ alignSelf: "stretch", display: "flex", padding: "var(--dds-dimension-x2) var(--dds-dimension-x1)" }}>
              <Separator orientation="vertical" />
            </div>
            <ToolButton label="링크" d={LINK} />
            <ToolButton label="목록" d={LIST} />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["두께", "1px", undefined],
        ["색", "#E5E8EB", "--dds-color-stroke-neutral-weak"],
        ["horizontal", "width 100%, height 1px", undefined],
        ["vertical", "width 1px, align-self: stretch (부모 높이)", undefined],
        ["목록 행 패딩", "12 × 16px", "--dds-dimension-x3 / x4"],
        ["툴바 안 세로선 여백", "위아래 8px, 좌우 4px", "--dds-dimension-x2 / x1"],
        ["접근성", "기본 aria-hidden, decorative={false}면 role=separator + aria-orientation", undefined],
      ]} />
    </MockupPage>
  ),
};
