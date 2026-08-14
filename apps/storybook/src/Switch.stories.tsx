import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@dg-design/react";

const SIZES = ["medium", "large"] as const;

const meta = {
  title: "Switch",
  component: Switch,
  argTypes: {
    size: { control: "radio", options: SIZES },
    disabled: { control: "boolean" },
  },
  args: {
    size: "medium",
    disabled: false,
    children: "알림 받기",
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** size/disabled를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

const STATES = ["unchecked", "checked"] as const;

/** state(unchecked/checked) x disabled(2) 그리드를 size별 섹션으로 나눈다. */
function StateMatrix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {SIZES.map((size) => (
        <section key={size}>
          <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>size: {size}</h2>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th />
                {STATES.map((state) => (
                  <th key={state} style={{ font: "500 12px sans-serif", padding: 8, textAlign: "left" }}>
                    {state}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[false, true].map((disabled) => (
                <tr key={String(disabled)}>
                  <th style={{ font: "500 12px sans-serif", padding: 8, textAlign: "right" }}>
                    {disabled ? "disabled" : "enabled"}
                  </th>
                  {STATES.map((state) => (
                    <td key={state} style={{ padding: 8 }}>
                      <Switch
                        size={size}
                        disabled={disabled}
                        defaultChecked={state === "checked"}
                        aria-label={`${size} ${state} ${disabled ? "disabled" : "enabled"}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

/** state(2) x size(2) x disabled(2) = 8조합 전체 그리드 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <StateMatrix />,
};

/** label 텍스트 클릭으로도 토글되는지 확인용 (htmlFor 없이 label 래핑 구조) */
export const WithLabel: Story = {
  args: {
    children: "다크 모드",
  },
};
