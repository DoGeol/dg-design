import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Card, Skeleton } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Skeleton", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 시안 칸 배경이 Skeleton과 같은 neutral-weak라 묻힌다. 실제 화면처럼 흰 표면 위에 둔다. */
const surface = { display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box", padding: 16, borderRadius: 8, background: "var(--dds-color-bg-layer-default)" } as const;
const row = { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--dds-color-stroke-neutral-weak)" } as const;
const lines = { display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 } as const;

function LoadingRow({ titleWidth }: { titleWidth: string }) {
  return (
    <div style={row}>
      <Skeleton radius="full" style={{ width: 36, height: 36 }} />
      <div style={lines}>
        <Skeleton radius="small" style={{ width: titleWidth, height: 14 }} />
        <Skeleton radius="small" style={{ width: "40%", height: 12 }} />
      </div>
      <Skeleton radius="small" style={{ width: 48, height: 20 }} />
    </div>
  );
}

const MEMBERS = [
  { name: "편도걸", initial: "편", meta: "디자인팀 · 오늘 09:12 접속", role: "관리자" },
  { name: "김하늘", initial: "김", meta: "개발팀 · 어제 18:40 접속", role: "편집자" },
  { name: "이서준", initial: "이", meta: "운영팀 · 3일 전 접속", role: "보기 전용" },
];

function CardSkeleton() {
  return (
    <Card style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton style={{ width: "100%", height: 120 }} />
      <Skeleton radius="small" style={{ width: "70%", height: 16 }} />
      <Skeleton radius="small" style={{ width: "100%", height: 12 }} />
      <Skeleton radius="small" style={{ width: "55%", height: 12 }} />
    </Card>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Skeleton" summary="불러올 내용의 자리와 모양을 미리 보입니다. 실제 레이아웃과 같은 크기로 그려 로딩이 끝나도 화면이 밀리지 않게 합니다.">
      <MockupSection title="모양" columns={4}>
        <MockupState label="radius none · 0"><div style={surface}><Skeleton radius="none" style={{ width: 120, height: 48 }} /></div></MockupState>
        <MockupState label="radius small · 8 (텍스트)"><div style={surface}><Skeleton radius="small" style={{ width: 120, height: 14 }} /></div></MockupState>
        <MockupState label="radius medium · 12 (블록)"><div style={surface}><Skeleton style={{ width: 120, height: 48 }} /></div></MockupState>
        <MockupState label="radius full · 원형"><div style={surface}><Skeleton radius="full" style={{ width: 48, height: 48 }} /></div></MockupState>
      </MockupSection>

      <MockupSection title="조합" columns={3} note="카드는 Card 안에 블록 1개와 텍스트 3줄입니다.">
        <MockupState label="텍스트 3줄">
          <div style={surface}>
            <div style={lines}>
              <Skeleton radius="small" style={{ width: "100%", height: 14 }} />
              <Skeleton radius="small" style={{ width: "92%", height: 14 }} />
              <Skeleton radius="small" style={{ width: "60%", height: 14 }} />
            </div>
          </div>
        </MockupState>
        <MockupState label="원형 + 텍스트">
          <div style={{ ...surface, gap: 12 }}>
            <Skeleton radius="full" style={{ width: 48, height: 48 }} />
            <div style={lines}>
              <Skeleton radius="small" style={{ width: "70%", height: 14 }} />
              <Skeleton radius="small" style={{ width: "45%", height: 12 }} />
            </div>
          </div>
        </MockupState>
        <MockupState label="카드"><CardSkeleton /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예 · 멤버 목록" columns={2} note="로딩 중과 로딩 후의 높이와 정렬이 같아야 합니다.">
        <MockupState label="로딩 중">
          <Card style={{ width: "100%", paddingBlock: 4 }} aria-busy="true" aria-label="멤버 목록을 불러오는 중입니다">
            <LoadingRow titleWidth="30%" />
            <LoadingRow titleWidth="24%" />
            <div style={{ ...row, borderBottom: "none" }}>
              <Skeleton radius="full" style={{ width: 36, height: 36 }} />
              <div style={lines}>
                <Skeleton radius="small" style={{ width: "28%", height: 14 }} />
                <Skeleton radius="small" style={{ width: "40%", height: 12 }} />
              </div>
              <Skeleton radius="small" style={{ width: 48, height: 20 }} />
            </div>
          </Card>
        </MockupState>
        <MockupState label="로딩 후">
          <Card style={{ width: "100%", paddingBlock: 4 }}>
            {MEMBERS.map((m, i) => (
              <div key={m.name} style={{ ...row, borderBottom: i === MEMBERS.length - 1 ? "none" : row.borderBottom }}>
                <Avatar.Root size="medium"><Avatar.Fallback>{m.initial}</Avatar.Fallback></Avatar.Root>
                <div style={{ ...lines, gap: 2 }}>
                  <strong style={{ fontSize: 14, lineHeight: "19px" }}>{m.name}</strong>
                  <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--dds-color-fg-neutral-weak)" }}>{m.meta}</span>
                </div>
                <Badge intent={m.role === "관리자" ? "brand" : "neutral"} size="large">{m.role}</Badge>
              </div>
            ))}
          </Card>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["배경", "#F3F5F9", "--dds-color-bg-neutral-weak"],
        ["shimmer", "가운데 #E5E8EB 그라디언트가 1000ms linear로 왼쪽→오른쪽, reduced-motion에서 정지", "--dds-color-bg-neutral-weak-hover / duration-spin"],
        ["radius none / small / medium / full", "0 / 8 / 12 / 9999px (medium은 시안 보정 16 → 12)", "--dds-radius-r2 / r3 / r-full"],
        ["텍스트 줄 높이", "본문 14px · 보조 12px, 줄 간격 8px", "--dds-dimension-x2"],
        ["크기", "컴포넌트에 크기 prop 없음 — 실제 요소와 같은 width·height를 style로 지정", "—"],
        ["접근성", "기본 aria-hidden. 감싸는 영역에 aria-busy와 로딩 문구", "—"],
      ]} />
    </MockupPage>
  ),
};
