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

/** actions slot과 닫기 버튼이 함께 있는 배너 형태의 스토리 */
export const WithActions: Story = {
  name: "With actions",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480, padding: 24 }}>
      <Alert
        intent="brand"
        title="임시 저장된 내용이 있습니다"
        description="이전에 작성하던 초안을 복원하시겠습니까?"
        actions={
          <>
            <button
              type="button"
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "none",
                background: "var(--dds-color-bg-brand-solid)",
                color: "var(--dds-color-fg-brand-contrast)",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              복원
            </button>
            <button
              type="button"
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "1px solid var(--dds-color-stroke-neutral-weak)",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              폐기
            </button>
          </>
        }
        onClose={() => {}}
      />
    </div>
  ),
};
