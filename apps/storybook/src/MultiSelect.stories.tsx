import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, MultiSelect } from "@dg-design/react";
import type * as React from "react";

// Select와 같은 이유로 component를 지정하지 않는다 — barrel엔 MultiSelect 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "MultiSelect",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/** functional·state-matrix 스토리가 공유하는 옵션 구성 — Select DemoOptions와 동형. */
function DemoOptions() {
  return (
    <>
      <MultiSelect.Group>
        <MultiSelect.Label>과일</MultiSelect.Label>
        <MultiSelect.Option value="apple">Apple</MultiSelect.Option>
        <MultiSelect.Option value="banana">Banana</MultiSelect.Option>
        <MultiSelect.Option value="cherry">Cherry</MultiSelect.Option>
        <MultiSelect.Option value="durian" disabled>
          Durian (품절)
        </MultiSelect.Option>
      </MultiSelect.Group>
      <MultiSelect.Option value="melon">Melon</MultiSelect.Option>
      <MultiSelect.Option value="peach">Peach</MultiSelect.Option>
    </>
  );
}

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`multiselect--functional-demo`)를 쓴다 —
 * 옵션 6개·disabled 1개·Group 구성은 Select와 맞춘다.
 * 닫힌 채로 빈 선택에서 시작한다 — 기능 테스트가 "열기 → 2개 선택 → 요약 문구" 흐름을
 * 처음부터 검증한다. 선택 상태별 외관의 VR은 StateMatrix가 맡는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <MultiSelect.Root
        name="fruit"
      >
        <MultiSelect.Trigger placeholder="과일을 고르세요" />
        <MultiSelect.Content>
          <DemoOptions />
        </MultiSelect.Content>
      </MultiSelect.Root>
    </div>
  ),
};

function MatrixCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}
    >
      <span style={{ font: "500 12px sans-serif", color: "#666" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

/**
 * 트리거 요약 문구 3분기(0개→placeholder·1개→라벨·2개+→"n개 선택됨") + disabled·invalid를
 * 닫힌 트리거 5개로 한 장에 늘어놓는다. Content는 닫혀 있어도(마운트되지 않아도) collectOptions가
 * Root children 엘리먼트 트리를 읽어 라벨을 채우므로 요약 문구는 그대로 나온다.
 */
function StateMatrixGrid() {
  return (
    <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
      <MatrixCell label="0개 선택">
        <MultiSelect.Root>
          <MultiSelect.Trigger placeholder="과일을 고르세요" />
          <MultiSelect.Content>
            <DemoOptions />
          </MultiSelect.Content>
        </MultiSelect.Root>
      </MatrixCell>
      <MatrixCell label="1개 선택">
        <MultiSelect.Root defaultValue={["apple"]}>
          <MultiSelect.Trigger placeholder="과일을 고르세요" />
          <MultiSelect.Content>
            <DemoOptions />
          </MultiSelect.Content>
        </MultiSelect.Root>
      </MatrixCell>
      <MatrixCell label="다수 선택">
        <MultiSelect.Root defaultValue={["apple", "banana", "cherry"]}>
          <MultiSelect.Trigger placeholder="과일을 고르세요" />
          <MultiSelect.Content>
            <DemoOptions />
          </MultiSelect.Content>
        </MultiSelect.Root>
      </MatrixCell>
      <MatrixCell label="disabled">
        <MultiSelect.Root defaultValue={["apple"]}>
          <MultiSelect.Trigger placeholder="과일을 고르세요" disabled />
          <MultiSelect.Content>
            <DemoOptions />
          </MultiSelect.Content>
        </MultiSelect.Root>
      </MatrixCell>
      <MatrixCell label="invalid">
        <Field.Root>
          <MultiSelect.Root defaultValue={["apple"]}>
            <MultiSelect.Trigger placeholder="과일을 고르세요" />
            <MultiSelect.Content>
              <DemoOptions />
            </MultiSelect.Content>
          </MultiSelect.Root>
          <Field.ErrorMessage>과일을 골라주세요.</Field.ErrorMessage>
        </Field.Root>
      </MatrixCell>
    </div>
  );
}

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <StateMatrixGrid />,
};
