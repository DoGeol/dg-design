import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Badge, Button, Card, Separator, Skeleton, StatePanel } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Card", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const label: React.CSSProperties = { margin: 0, fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)", color: "var(--dds-color-fg-neutral-weak)" };
const title: React.CSSProperties = { margin: 0, fontSize: "var(--dds-font-size-t5)", lineHeight: "var(--dds-line-height-t5)", fontWeight: "var(--dds-font-weight-bold)" };
const body: React.CSSProperties = { margin: 0, wordBreak: "keep-all", fontSize: "var(--dds-font-size-t4)", lineHeight: "var(--dds-line-height-t4)", color: "var(--dds-color-fg-neutral-weak)" };
const stack: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x2)" };
const fill: React.CSSProperties = { width: "100%" };

function StatCard({ name, value, delta, intent }: { name: string; value: string; delta: string; intent: "positive" | "critical" }) {
  return (
    <Card style={stack}>
      <p style={label}>{name}</p>
      <p style={{ margin: 0, fontSize: "var(--dds-font-size-t10)", lineHeight: "var(--dds-line-height-t10)", fontWeight: "var(--dds-font-weight-bold)" }}>{value}</p>
      <div><Badge intent={intent}>{delta}</Badge></div>
    </Card>
  );
}

function ActionCard() {
  return (
    <Card style={{ ...stack, gap: "var(--dds-dimension-x4)" }}>
      <div style={stack}>
        <p style={title}>팀 플랜으로 전환</p>
        <p style={body}>멤버 초대와 권한 관리를 쓸 수 있습니다. 남은 체험 기간은 14일입니다.</p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--dds-dimension-x2)" }}>
        <Button intent="neutral" variant="weak" size="small">나중에</Button>
        <Button size="small">플랜 변경</Button>
      </div>
    </Card>
  );
}

const MEMBERS = [
  { name: "편도걸", role: "관리자", joined: "2026.03.14" },
  { name: "김하늘", role: "편집자", joined: "2026.06.02" },
  { name: "이서준", role: "뷰어", joined: "2026.09.21" },
];

function ListCard() {
  return (
    <Card style={{ ...stack, gap: 0, padding: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--dds-dimension-x4)" }}>
        <p style={title}>멤버</p>
        <Button intent="neutral" variant="ghost" size="small">전체 보기</Button>
      </div>
      <Separator />
      {MEMBERS.map((m, i) => (
        <React.Fragment key={m.name}>
          {i > 0 && <Separator />}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--dds-dimension-x3)", padding: "var(--dds-dimension-x3) var(--dds-dimension-x4)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x0_5)", minWidth: 0 }}>
              <span style={{ fontWeight: "var(--dds-font-weight-bold)" }}>{m.name}</span>
              <span style={label}>{m.joined} 합류</span>
            </div>
            <Badge intent={i === 0 ? "brand" : "neutral"}>{m.role}</Badge>
          </div>
        </React.Fragment>
      ))}
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card style={{ ...stack, gap: "var(--dds-dimension-x3)" }} aria-busy="true">
      <Skeleton style={{ width: 96, height: 16 }} />
      <Skeleton style={{ width: 140, height: 32 }} />
      <Skeleton radius="full" style={{ width: 80, height: 20 }} />
    </Card>
  );
}

function EmptyCard() {
  return (
    <Card>
      {/* StatePanel의 회색 면을 지워 카드 면 하나로 보이게 한다 — 카드 안 빈 상태 */}
      <StatePanel.Root role="status" minHeight={160} style={{ background: "transparent", padding: "var(--dds-dimension-x4) 0" }}>
        <StatePanel.Icon>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v6H3v-6z" />
          </svg>
        </StatePanel.Icon>
        <StatePanel.Title>아직 받은 문의가 없습니다</StatePanel.Title>
        <StatePanel.Description>문의 양식을 공유하면 이곳에 표시됩니다.</StatePanel.Description>
        <StatePanel.Actions><Button size="small" variant="weak">양식 링크 복사</Button></StatePanel.Actions>
      </StatePanel.Root>
    </Card>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Card" summary="정보를 한 덩어리로 묶는 면입니다. 테두리·radius·패딩만 제공하고 내부 구성은 화면이 정합니다.">
      <MockupSection title="종류" note="Card는 슬롯이 없는 단일 요소입니다. 제목·본문·액션은 소비자 마크업입니다.">
        <MockupState label="정보 카드"><div style={fill}><StatCard name="이번 달 방문자" value="12,480" delta="전월 대비 12% 증가" intent="positive" /></div></MockupState>
        <MockupState label="액션 카드"><div style={fill}><ActionCard /></div></MockupState>
        <MockupState label="목록 카드 · padding 0"><div style={fill}><ListCard /></div></MockupState>
      </MockupSection>

      <MockupSection title="상태" note="Card 자체에는 hover·focus·disabled가 없습니다. 상태는 내부 콘텐츠로 표현합니다.">
        <MockupState label="default"><div style={fill}><StatCard name="활성 세션" value="342" delta="전월 대비 3% 감소" intent="critical" /></div></MockupState>
        <MockupState label="loading · Skeleton"><div style={fill}><LoadingCard /></div></MockupState>
        <MockupState label="empty · StatePanel"><div style={fill}><EmptyCard /></div></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="대시보드 요약 · 3열 그리드, 간격 16">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--dds-dimension-x4)", width: "100%" }}>
            <StatCard name="전체 사용자" value="1,204" delta="전월 대비 12% 증가" intent="positive" />
            <StatCard name="이번 달 신규" value="89" delta="전월 대비 5% 증가" intent="positive" />
            <StatCard name="해지 요청" value="7" delta="전월 대비 2건 증가" intent="critical" />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["radius", "12px", "--dds-radius-r3"],
        ["패딩", "16px (목록 카드는 0으로 덮고 행이 패딩을 가짐)", "--dds-dimension-x4"],
        ["테두리", "1px #E5E8EB", "--dds-color-stroke-neutral-weak"],
        ["배경", "#FFFFFF", "--dds-color-bg-layer-default"],
        ["그림자", "없음 (오버레이만 shadow를 씀)", undefined],
        ["카드 안 빈 상태", "StatePanel 배경 transparent, 위아래 16px", "--dds-dimension-x4"],
        ["카드 사이 간격", "16px", "--dds-dimension-x4"],
        ["제목 / 본문 / 보조", "16 bold / 14 regular / 13 regular", "--dds-font-size-t5 / t4 / t3"],
        ["보조 글자색", "#6D6F72", "--dds-color-fg-neutral-weak"],
        ["목록 행 구분", "Separator 1px #E5E8EB, 행 패딩 12 × 16px", "--dds-dimension-x3 / x4"],
      ]} />
    </MockupPage>
  ),
};
