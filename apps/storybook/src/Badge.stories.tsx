import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@dg-design/react";

const INTENTS = ["brand", "neutral", "critical", "positive", "warning", "informative"] as const;
const VARIANTS = ["solid", "weak", "outline"] as const;
const SIZES = ["medium", "large"] as const;

const meta = {
  title: "Badge",
  component: Badge,
  argTypes: {
    intent: { control: "radio", options: INTENTS },
    variant: { control: "radio", options: VARIANTS },
    size: { control: "radio", options: SIZES },
    truncate: { control: "boolean" },
  },
  args: {
    intent: "neutral",
    variant: "weak",
    size: "medium",
    truncate: false,
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/** intent/variant/size/truncate를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

/**
 * intent(6) x variant(3) 그리드. 각 셀은 size(2) 행을 담은 2x3 서브 그리드라
 * 36조합 전체를 한 화면에서 육안 확인할 수 있다.
 */
function CombinationGrid() {
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
                      <Badge intent={intent} variant={variant} size={size}>
                        Badge
                      </Badge>
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

/** intent(6) x variant(3) x size(2) = 36조합 전체 그리드 */
export const AllCombinations: Story = {
  render: () => <CombinationGrid />,
};

/** asChild로 <a>에 배지 클래스·스타일을 위임 — 렌더 엘리먼트가 span이 아닌 a인지 확인용 */
export const AsChild: Story = {
  render: () => (
    <Badge asChild intent="brand" variant="solid">
      <a href="#">Link badge</a>
    </Badge>
  ),
};

/** truncate=false(기본, nowrap만) vs true(말줄임)를 좁은 컨테이너에서 비교 */
export const Truncate: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 120 }}>
      <div>
        <p style={{ font: "500 12px sans-serif", marginBottom: 4 }}>truncate: false (기본)</p>
        <Badge intent="informative" variant="weak">
          아주 긴 배지 라벨 텍스트입니다
        </Badge>
      </div>
      <div>
        <p style={{ font: "500 12px sans-serif", marginBottom: 4 }}>truncate: true</p>
        <Badge intent="informative" variant="weak" truncate>
          아주 긴 배지 라벨 텍스트입니다
        </Badge>
      </div>
    </div>
  ),
};
