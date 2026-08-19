import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Card } from "@dg-design/react";

const meta = {
  title: "Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * asChild로 렌더 엘리먼트를 바꿔도(div → a) dds-card 클래스가 그대로 유지되는지 확인용.
 * Card는 padding/border/radius만 제공하는 단일 요소라 asChild 여부가 유일한 구조적 축이다.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Card style={{ width: 200 }}>기본 div 카드</Card>
      <Card asChild style={{ width: 200 }}>
        <a href="#" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
          asChild로 렌더한 a 카드
        </a>
      </Card>
    </div>
  ),
};

/**
 * 어드민 통계 카드 조합. Card는 compound 슬롯이 없어(제목·본문·푸터 없음) 내부 구조는
 * 전부 소비자 마크업이다 — 라벨·수치·증감 뱃지를 자유롭게 쌓아 보여준다.
 */
export const FunctionalDemo: Story = {
  name: "Functional demo",
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Card style={{ width: 200 }}>
        <p style={{ font: "500 13px sans-serif", color: "#666", margin: "0 0 8px" }}>전체 사용자</p>
        <p style={{ font: "700 28px sans-serif", margin: "0 0 8px" }}>1,204</p>
        <Badge intent="positive" variant="weak">
          +12% 전월 대비
        </Badge>
      </Card>
      <Card style={{ width: 200 }}>
        <p style={{ font: "500 13px sans-serif", color: "#666", margin: "0 0 8px" }}>이번 달 신규</p>
        <p style={{ font: "700 28px sans-serif", margin: "0 0 8px" }}>89</p>
        <Badge intent="positive" variant="weak">
          +5% 전월 대비
        </Badge>
      </Card>
      <Card style={{ width: 200 }}>
        <p style={{ font: "500 13px sans-serif", color: "#666", margin: "0 0 8px" }}>활성 세션</p>
        <p style={{ font: "700 28px sans-serif", margin: "0 0 8px" }}>342</p>
        <Badge intent="critical" variant="weak">
          -3% 전월 대비
        </Badge>
      </Card>
    </div>
  ),
};
