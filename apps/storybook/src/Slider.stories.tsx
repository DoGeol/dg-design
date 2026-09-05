import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Slider } from "@dg-design/react";
import * as React from "react";

const meta = {
  title: "Slider",
  component: Slider,
  argTypes: {
    size: { control: "radio", options: ["small", "medium"] },
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    size: "medium",
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 컨트롤 패널에서 조작 가능한 Playground 스토리 */
export const Playground: Story = {
  render: (args) => {
    const [val, setVal] = React.useState(50);
    return (
      <div style={{ maxWidth: 360, padding: 24 }}>
        <Field.Root>
          <Field.Label>조절 값: {val}</Field.Label>
          <Slider {...args} value={val} onChange={(e) => setVal(Number(e.target.value))} />
          <Field.Description>슬라이더를 드래그하여 값을 변경하세요.</Field.Description>
        </Field.Root>
      </div>
    );
  },
};

/**
 * size(small·medium) x 상태(default·disabled) x 값(0·50·100) 매트릭스.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        padding: 24,
        maxWidth: 400,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h4 style={{ margin: 0, fontSize: 14 }}>Medium Size (Default)</h4>
        <Slider size="medium" defaultValue={0} aria-label="값 0" />
        <Slider size="medium" defaultValue={50} aria-label="값 50" />
        <Slider size="medium" defaultValue={100} aria-label="값 100" />
        <Slider size="medium" defaultValue={40} disabled aria-label="비활성화" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h4 style={{ margin: 0, fontSize: 14 }}>Small Size</h4>
        <Slider size="small" defaultValue={0} aria-label="값 0 small" />
        <Slider size="small" defaultValue={50} aria-label="값 50 small" />
        <Slider size="small" defaultValue={100} aria-label="값 100 small" />
        <Slider size="small" defaultValue={40} disabled aria-label="비활성화 small" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h4 style={{ margin: 0, fontSize: 14 }}>With Field</h4>
        <Field.Root>
          <Field.Label>투명도</Field.Label>
          <Slider size="medium" defaultValue={75} />
          <Field.Description>레이어 투명도를 조절합니다.</Field.Description>
        </Field.Root>
      </div>
    </div>
  ),
};
