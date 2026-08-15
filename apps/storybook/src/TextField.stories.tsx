import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, TextField } from "@dg-design/react";

const SIZES = ["medium", "large"] as const;

const meta = {
  title: "TextField",
  component: TextField,
  argTypes: {
    size: { control: "radio", options: SIZES },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    size: "medium",
    placeholder: "이름을 입력하세요",
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

/** size/disabled/readOnly를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {
  args: { "aria-label": "이름" },
};

type CellState = "default" | "invalid" | "disabled" | "readonly";
const STATES: CellState[] = ["default", "invalid", "disabled", "readonly"];

/** state(기본/invalid/disabled/readonly) x size(2) 그리드 */
function StateMatrix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {SIZES.map((size) => (
        <section key={size}>
          <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>size: {size}</h2>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {STATES.map((state) => (
                  <th key={state} style={{ font: "500 12px sans-serif", padding: 8, textAlign: "left" }}>
                    {state}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {STATES.map((state) => (
                  <td key={state} style={{ padding: 8 }}>
                    <TextField
                      size={size}
                      placeholder="이름을 입력하세요"
                      aria-label={`${size} ${state}`}
                      aria-invalid={state === "invalid"}
                      disabled={state === "disabled"}
                      readOnly={state === "readonly"}
                      defaultValue={state === "readonly" ? "고정값" : undefined}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

/** state(4) x size(2) = 8조합 전체 그리드 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <StateMatrix />,
};

/** Field.Root/Label/Description/ErrorMessage와 조합했을 때의 실사용 데모 */
export const WithField: StoryObj<typeof meta> = {
  name: "Field composition",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 320 }}>
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField placeholder="you@example.com" />
        <Field.Description>회사 이메일만 허용됩니다.</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>비밀번호</Field.Label>
        <TextField type="password" />
        <Field.ErrorMessage>8자 이상 입력해주세요.</Field.ErrorMessage>
      </Field.Root>
      <Field.Root>
        <Field.Label>닉네임 (단독 라벨만)</Field.Label>
        <TextField placeholder="닉네임" />
      </Field.Root>
    </div>
  ),
};
