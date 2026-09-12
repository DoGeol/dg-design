import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@dg-design/react";
import * as React from "react";

const INTENTS = ["brand", "neutral", "critical"] as const;
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
 * intent(3) x variant(3) 그리드. 각 셀은 size(3) 행을 담은 서브 그리드라
 * 27조합 전체를 한 화면에서 육안 확인할 수 있다.
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

/**
 * 모션 데모: 로딩이 켜지고 꺼질 때 라벨과 중앙 Spinner가 교차하는지, 그동안 버튼 크기가
 * 그대로인지 본다. 처음은 정지 상태(로딩 꺼짐)이고 버튼을 눌러야 바뀐다.
 */
function MotionDemoView() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <div data-testid="motion-button">
        <Button loading={loading}>저장하기</Button>
      </div>

      <div data-testid="motion-icon-button">
        <Button loading={loading} intent="neutral" variant="weak">
          <span aria-hidden="true">★</span>
          즐겨찾기에 추가
        </Button>
      </div>

      <div data-testid="motion-full-button">
        <Button loading={loading} style={{ width: "100%" }}>
          전체 폭 버튼
        </Button>
      </div>

      <div data-testid="motion-none-button">
        <Button loading={loading} motion="none">
          모션 없음
        </Button>
      </div>

      <div data-testid="motion-aschild">
        <Button asChild variant="ghost">
          <a href="#none">링크형 버튼</a>
        </Button>
      </div>

      <button type="button" data-testid="toggle-loading" onClick={() => setLoading((on) => !on)}>
        로딩 토글
      </button>
    </div>
  );
}

export const MotionDemo: StoryObj<typeof meta> = {
  name: "Motion demo",
  render: () => <MotionDemoView />,
};
