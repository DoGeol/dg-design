import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "@dg-design/react";

const meta = {
  title: "Progress",
  component: Progress,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
    indeterminate: { control: "boolean" },
  },
  args: {
    value: 50,
    max: 100,
    indeterminate: false,
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

/** value/max/indeterminate를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

/**
 * value 0·50·100 + indeterminate 4상태. indeterminate의 왕복 애니메이션도 Spinner와 같이
 * playwright.config.ts의 reducedMotion:"reduce" + animations:"disabled"로 정지 캡처된다.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24, width: 320 }}>
      {[0, 50, 100].map((value) => (
        <div key={value}>
          <p style={{ font: "500 12px sans-serif", marginBottom: 4 }}>value: {value}</p>
          <Progress value={value} />
        </div>
      ))}
      <div>
        <p style={{ font: "500 12px sans-serif", marginBottom: 4 }}>indeterminate</p>
        <Progress indeterminate />
      </div>
    </div>
  ),
};
