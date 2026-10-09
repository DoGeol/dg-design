import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Card } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Surfaces/Card", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" } as const;
const full = { width: "100%" } as const;
/** 링크 카드는 a가 inline이라 block을 준다 — 기존 Card 스토리와 같은 소비자 조합. */
const link = { ...full, display: "block" } as const;

function Summary() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><strong>컴포넌트 디자인 기록</strong><Badge intent="informative">검토 중</Badge></div>
      <p style={weak}>편도걸 · 10월 9일 수정</p>
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const isA = v.variant === "a";
  const basis = v.variant === "current" ? "DDS 선언값" : "D 현재 값 — A·B 동일";
  return (
    <FlexPage
      v={v}
      title="Card"
      summary={
        v.variant === "b"
          ? "치수는 현재 그대로입니다. 객체 목록은 List가 먼저라 카드는 독립 요약에만 씁니다."
          : isA
            ? "기본 r12·p16을 유지합니다. 복잡한 큰 카드만 r16·p24 후보를 검토합니다."
            : "현재 Card는 r12·p16, 약한 1px 테두리, 그림자 없음입니다."
      }
    >
      <FlexSection title="상태" columns={2} note="클릭 카드는 asChild로 링크·버튼이 됩니다. 안에 행동이 여럿이면 카드 전체를 감싸지 않습니다.">
        <FlexState label="정적 요약" block><Card style={full}><Summary /></Card></FlexState>
        <FlexState label="링크 · hover" force="hover" block><Card asChild style={link}><a href="#post"><Summary /></a></Card></FlexState>
        <FlexState label="링크 · focus" force="focus" block><Card asChild style={link}><a href="#post"><Summary /></a></Card></FlexState>
        <FlexState label="버튼 · disabled" block><Card asChild><button type="button" disabled><Summary /></button></Card></FlexState>
      </FlexSection>

      <FlexSection
        title="큰 카드"
        note={isA ? "A 후보 — 복잡한 큰 카드만 r16·p24(.fx-card-large). 기본 카드는 그대로입니다." : "현재 값 그대로입니다(r12·p16). B는 측정 근거가 없어 큰 카드 단계를 만들지 않습니다."}
      >
        <FlexState label={isA ? "r16 · p24 후보" : "r12 · p16"} block>
          <Card className="fx-card-large" style={full}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Summary />
              <p style={{ margin: 0 }}>선택 상태와 hover 구분을 확인했습니다. 다음 주 배포 전에 다시 봅니다.</p>
            </div>
          </Card>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["기본", "r12 · p16 · 1px stroke-neutral-weak · 그림자 없음", basis],
        ["클릭 hover / focus", "테두리 stroke-neutral / 2px 링 + 2px 간격", basis],
        ["큰 카드", isA ? "r16 · p24" : "없음", isA ? "C 연구 후보" : v.variant === "b" ? "D 측정 없음 — 만들지 않음" : "현재 없음"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={560} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
