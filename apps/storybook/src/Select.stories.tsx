import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Select } from "@dg-design/react";

// DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 Select 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Select",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/** functional·VR 스토리가 공유하는 옵션 구성 — 6개 + disabled 1 + Group 1. */
function DemoOptions() {
  return (
    <>
      <Select.Group>
        <Select.Label>과일</Select.Label>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
        <Select.Option value="durian" disabled>
          Durian (품절)
        </Select.Option>
      </Select.Group>
      <Select.Option value="melon">Melon</Select.Option>
      <Select.Option value="peach">Peach</Select.Option>
    </>
  );
}

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`select--functional-demo`)를 쓴다 —
 * 옵션 6개·disabled 1개·Group 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Select.Root name="fruit" onValueChange={(value) => console.log(value)}>
        <Select.Trigger placeholder="과일을 고르세요" />
        <Select.Content>
          <DemoOptions />
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

/**
 * Field 조합 데모. 기능 테스트가 `select--with-field-demo`로 라벨 클릭 포커스와
 * ErrorMessage에 따른 invalid 표시를 검증한다.
 */
export const WithFieldDemo: StoryObj<typeof meta> = {
  name: "Field composition",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24, maxWidth: 320 }}>
      <Field.Root>
        <Field.Label>좋아하는 과일</Field.Label>
        <Select.Root defaultValue="banana">
          <Select.Trigger placeholder="과일을 고르세요" />
          <Select.Content>
            <DemoOptions />
          </Select.Content>
        </Select.Root>
        <Field.Description>하나만 고를 수 있습니다.</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>배송 과일</Field.Label>
        <Select.Root>
          <Select.Trigger size="large" placeholder="과일을 고르세요" />
          <Select.Content>
            <DemoOptions />
          </Select.Content>
        </Select.Root>
        <Field.ErrorMessage>과일을 골라주세요.</Field.ErrorMessage>
      </Field.Root>
    </div>
  ),
};

/**
 * VR용 열림 고정 스토리. 패널은 body 직속 portal이라 `#storybook-root` 스크린샷 안에 들어오도록
 * 래퍼를 뷰포트 높이로 채운다(DropdownMenu StateMatrixStory와 같은 이유).
 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "Open state (VR)",
  render: () => (
    <div style={{ minHeight: "100vh", padding: 24, boxSizing: "border-box", maxWidth: 320 }}>
      <Select.Root open defaultValue="cherry">
        <Select.Trigger placeholder="과일을 고르세요" />
        <Select.Content>
          <DemoOptions />
        </Select.Content>
      </Select.Root>
    </div>
  ),
};
