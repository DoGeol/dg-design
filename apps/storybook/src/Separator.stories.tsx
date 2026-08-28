import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@dg-design/react";

const meta = {
  title: "Separator",
  component: Separator,
  args: { orientation: "horizontal", decorative: true },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FunctionalDemo: Story = {
  name: "Functional demo",
  render: (args) => (
    <div style={{ display: "grid", gap: 16, maxWidth: 360, padding: 24 }}>
      <span>위 내용</span>
      <Separator {...args} />
      <span>아래 내용</span>
    </div>
  ),
};

export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "grid", gap: 32, maxWidth: 360, padding: 24 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <span>Decorative horizontal</span>
        <Separator />
        <span>Semantic horizontal</span>
        <Separator decorative={false} />
      </div>
      <div style={{ display: "flex", height: 48, alignItems: "center", gap: 16 }}>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
        <Separator orientation="vertical" decorative={false} />
        <span>Semantic</span>
      </div>
    </div>
  ),
};
