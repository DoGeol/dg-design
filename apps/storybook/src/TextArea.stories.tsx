import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, TextArea } from "@dg-design/react";
import * as React from "react";

const SIZES = ["medium", "large"] as const;

const meta = {
  title: "TextArea",
  component: TextArea,
  argTypes: {
    size: { control: "radio", options: SIZES },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    autoResize: { control: "boolean" },
  },
  args: {
    size: "medium",
    placeholder: "자기소개를 입력하세요",
  },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

/** size/disabled/readOnly/autoResize를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {
  args: { "aria-label": "자기소개" },
};

// TextField.stories.tsx와 동형 — hover·focus는 실제 포인터/포커스가 있어야 하는
// 상호작용 상태라 정적 그리드 셀로는 못 찍는다(포커스는 문서 전체에 하나뿐). 대신
// invalid·disabled·readonly 3종 + 기본을 4셀로 렌더한다(TextField 관례 그대로).
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
                    <TextArea
                      size={size}
                      placeholder="자기소개를 입력하세요"
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
        <Field.Label>자기소개</Field.Label>
        <TextArea placeholder="자유롭게 작성해주세요" />
        <Field.Description>200자 이내로 작성해주세요.</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>피드백</Field.Label>
        <TextArea />
        <Field.ErrorMessage>필수 항목입니다.</Field.ErrorMessage>
      </Field.Root>
    </div>
  ),
};

/**
 * autoResize=false(고정 rows + 수동 resize handle) vs true(입력량 따라 자동 확장) 비교.
 * true 쪽은 defaultValue를 여러 줄로 채워 마운트 시점부터 늘어난 높이를 보여준다.
 */
export const AutoResize: StoryObj<typeof meta> = {
  name: "Auto resize",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
      <div>
        <h3 style={{ font: "600 14px sans-serif", marginBottom: 8 }}>
          autoResize=false (rows=3 + 수동 resize)
        </h3>
        <TextArea
          aria-label="고정 크기"
          placeholder="여러 줄을 입력해도 높이는 그대로, 우측 하단 핸들로 직접 늘려야 합니다"
        />
      </div>
      <div>
        <h3 style={{ font: "600 14px sans-serif", marginBottom: 8 }}>autoResize=true</h3>
        <TextArea
          aria-label="자동 확장"
          autoResize
          defaultValue={"입력할수록\n높이가 자동으로\n늘어납니다."}
        />
      </div>
    </div>
  ),
};
