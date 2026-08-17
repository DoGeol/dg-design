import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@dg-design/react";

const SIZES = ["small", "medium"] as const;

const meta = {
  title: "Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "radio", options: SIZES },
  },
  args: {
    size: "medium",
    "aria-label": "로딩 중",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/** size를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

/**
 * size(2) 매트릭스. aria-label을 줘 role="status"까지 함께 노출한다 — 라벨 없는 기본값은
 * aria-hidden(장식)으로 빠지는 분기라 여기선 "의미 있는 로딩 상태" 쪽을 보여준다.
 * 무한 회전 애니메이션은 playwright.config.ts의 reducedMotion:"reduce" +
 * expect.toHaveScreenshot.animations:"disabled"로 이미 정지된 채 캡처된다.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "center", padding: 24 }}>
      {SIZES.map((size) => (
        <div
          key={size}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <Spinner size={size} aria-label="로딩 중" />
          <span style={{ font: "500 12px sans-serif" }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};
