import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@dg-design/react";
import * as React from "react";

const SIZES = ["medium", "large"] as const;

const meta = {
  title: "Checkbox",
  component: Checkbox,
  argTypes: {
    size: { control: "radio", options: SIZES },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "medium",
    indeterminate: false,
    disabled: false,
    children: "이용약관에 동의합니다",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/** size/indeterminate/disabled를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

type CellState = "unchecked" | "checked" | "indeterminate";
const STATES: CellState[] = ["unchecked", "checked", "indeterminate"];

/**
 * state(unchecked/checked/indeterminate) x disabled(2) 그리드를 size별 섹션으로 나눈다.
 * indeterminate는 DOM 프로퍼티라 defaultChecked=false로 두고 prop만으로 표시한다.
 */
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
                      <Checkbox
                        size={size}
                        disabled={disabled}
                        defaultChecked={state === "checked"}
                        indeterminate={state === "indeterminate"}
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

/** state(3) x size(2) x disabled(2) = 12조합 전체 그리드 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <StateMatrix />,
};

/**
 * 모션 데모: 포인터로 누른 변경만 아이콘이 전환되는지 눈과 브라우저 테스트로 확인한다.
 * 처음은 정지 상태(모두 해제)로 두고, 키보드·버튼·리셋은 즉시 반영되어야 한다.
 */
function MotionDemoView() {
  const [checked, setChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}
      onReset={() => {
        setChecked(false);
        setIndeterminate(false);
      }}
    >
      <div data-testid="motion-auto">
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={(event) => {
            setChecked(event.target.checked);
            setIndeterminate(false);
          }}
        >
          포인터로 누르면 전환
        </Checkbox>
      </div>
      <div data-testid="motion-none">
        <Checkbox motion="none">motion=&quot;none&quot;</Checkbox>
      </div>
      <div data-testid="motion-disabled">
        <Checkbox disabled>비활성</Checkbox>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" data-testid="set-checked" onClick={() => setChecked(true)}>
          프로그램 체크
        </button>
        <button
          type="button"
          data-testid="set-indeterminate"
          onClick={() => setIndeterminate(true)}
        >
          중간 상태
        </button>
        <button type="reset" data-testid="reset">
          리셋
        </button>
      </div>
    </form>
  );
}

export const MotionDemo: StoryObj<typeof meta> = {
  name: "Motion demo",
  render: () => <MotionDemoView />,
};

/** label 텍스트 클릭으로도 토글되는지 확인용 (htmlFor 없이 label 래핑 구조) */
export const WithLabel: Story = {
  args: {
    children: "마케팅 정보 수신에 동의합니다",
  },
};
