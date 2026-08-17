import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "@dg-design/react";

const INTENTS = ["brand", "neutral", "critical", "positive", "warning", "informative"] as const;

const meta = {
  title: "Alert",
  component: Alert,
  argTypes: {
    intent: { control: "radio", options: INTENTS },
  },
  args: {
    intent: "neutral",
    title: "알림 제목",
    description: "알림 본문 텍스트입니다.",
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

/** intent/title/description/onClose를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

/**
 * intent(6) x 닫기 유무(2) 그리드. live region 정책(critical만 role="alert", 나머지
 * role="status")과 intent별 아이콘·색을 한 화면에서 육안 확인할 수 있다.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        maxWidth: 480,
      }}
    >
      {INTENTS.map((intent) => (
        <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Alert intent={intent} title={`${intent} 알림`} description="닫기 버튼 없음" />
          <Alert
            intent={intent}
            title={`${intent} 알림`}
            description="닫기 버튼 있음"
            onClose={() => {}}
          />
        </div>
      ))}
    </div>
  ),
};
