import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "@dg-design/react";

// Select/DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 RadioGroup
// 객체 하나뿐이라 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023).
const meta = {
  title: "RadioGroup",
} satisfies Meta;

export default meta;

const ORIENTATIONS = ["vertical", "horizontal"] as const;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`radiogroup--functional-demo`)를 쓴다 —
 * 항목 3개 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <RadioGroup.Root
        aria-label="배송 방법"
        defaultValue="standard"
        onValueChange={(value) => console.log(value)}
      >
        <RadioGroup.Item value="standard">일반배송</RadioGroup.Item>
        <RadioGroup.Item value="express">빠른배송</RadioGroup.Item>
        <RadioGroup.Item value="pickup">방문수령</RadioGroup.Item>
      </RadioGroup.Root>
    </div>
  ),
};

/** orientation(2) x disabled(2) 그리드 — 각 셀은 3항목 라디오그룹, 두 번째 항목 선택 상태 */
function StateMatrix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {ORIENTATIONS.map((orientation) => (
        <section key={orientation}>
          <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>
            orientation: {orientation}
          </h2>
          <div style={{ display: "flex", gap: 48 }}>
            {[false, true].map((disabled) => (
              <div key={String(disabled)}>
                <h3 style={{ font: "500 12px sans-serif", marginBottom: 8 }}>
                  {disabled ? "disabled" : "enabled"}
                </h3>
                <RadioGroup.Root
                  aria-label={`${orientation} ${disabled ? "disabled" : "enabled"}`}
                  orientation={orientation}
                  disabled={disabled}
                  defaultValue="b"
                >
                  <RadioGroup.Item value="a">A</RadioGroup.Item>
                  <RadioGroup.Item value="b">B</RadioGroup.Item>
                  <RadioGroup.Item value="c">C</RadioGroup.Item>
                </RadioGroup.Root>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <StateMatrix />,
};
