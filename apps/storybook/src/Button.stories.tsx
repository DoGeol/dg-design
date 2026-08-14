import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@dg-design/react";

const INTENTS = ["brand", "neutral"] as const;
const VARIANTS = ["solid", "weak", "ghost"] as const;
const SIZES = ["small", "medium", "large"] as const;

const meta = {
  title: "Button",
  component: Button,
  argTypes: {
    intent: { control: "radio", options: INTENTS },
    variant: { control: "radio", options: VARIANTS },
    size: { control: "radio", options: SIZES },
    disabled: { control: "boolean" },
  },
  args: {
    intent: "brand",
    variant: "solid",
    size: "medium",
    disabled: false,
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/** intent/variant/size/disabled를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

/**
 * intent(2) x variant(3) 그리드. 각 셀은 size(3) 행을 담은 3x3 서브 그리드라
 * 18조합 전체를 한 화면에서 육안 확인할 수 있다.
 */
function CombinationGrid({ disabled = false }: { disabled?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {INTENTS.map((intent) => (
        <section key={intent}>
          <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>
            intent: {intent}
          </h2>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th />
                {VARIANTS.map((variant) => (
                  <th
                    key={variant}
                    style={{
                      font: "500 12px sans-serif",
                      padding: 8,
                      textAlign: "left",
                    }}
                  >
                    {variant}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <th
                    style={{
                      font: "500 12px sans-serif",
                      padding: 8,
                      textAlign: "right",
                    }}
                  >
                    {size}
                  </th>
                  {VARIANTS.map((variant) => (
                    <td key={variant} style={{ padding: 8 }}>
                      <Button
                        intent={intent}
                        variant={variant}
                        size={size}
                        disabled={disabled}
                      >
                        Button
                      </Button>
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

/** intent(2) x variant(3) x size(3) = 18조합 전체 그리드 */
export const AllCombinations: Story = {
  render: () => <CombinationGrid />,
};

/** disabled 상태 18조합 — hover해도 색이 바뀌지 않는지 육안 확인용 */
export const Disabled: Story = {
  render: () => <CombinationGrid disabled />,
};
