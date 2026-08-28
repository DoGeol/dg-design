import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@dg-design/react";

const RADII = ["none", "small", "medium", "full"] as const;

const meta = {
  title: "Skeleton",
  component: Skeleton,
  args: { radius: "medium", style: { width: 160, height: 20 } },
  argTypes: { radius: { control: "radio", options: RADII } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FunctionalDemo: Story = {
  name: "Functional demo",
  render: (args) => <Skeleton {...args} />,
};

export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, padding: 24 }}>
      {RADII.map((radius) => (
        <div key={radius} style={{ display: "grid", gap: 8 }}>
          <span style={{ font: "500 12px sans-serif" }}>{radius}</span>
          <Skeleton radius={radius} style={{ width: radius === "full" ? 72 : 160, height: 24 }} />
        </div>
      ))}
    </div>
  ),
};
