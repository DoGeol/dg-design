import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Tabs, TextField } from "@dg-design/react";

// RadioGroup과 같은 이유로 component를 지정하지 않는다 — barrel엔 Tabs 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Tabs",
} satisfies Meta;

export default meta;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`tabs--functional-demo`)를 쓴다 —
 * 탭 3개·패널마다 입력 하나 구성을 바꾸지 않는다. 비활성 Content가 언마운트가 아니라
 * hidden으로 남는다는 계약(폼 상태 보존)을 입력에 값을 채운 채 탭을 오가며 확인하는 용도다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <Tabs.Root defaultValue="basic">
        <Tabs.List aria-label="사용자 설정">
          <Tabs.Trigger value="basic">기본 정보</Tabs.Trigger>
          <Tabs.Trigger value="contact">연락처</Tabs.Trigger>
          <Tabs.Trigger value="permission">권한</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="basic">
          <Field.Root>
            <Field.Label>이름</Field.Label>
            <TextField placeholder="홍길동" />
          </Field.Root>
        </Tabs.Content>
        <Tabs.Content value="contact">
          <Field.Root>
            <Field.Label>이메일</Field.Label>
            <TextField placeholder="you@example.com" />
          </Field.Root>
        </Tabs.Content>
        <Tabs.Content value="permission">
          <Field.Root>
            <Field.Label>역할</Field.Label>
            <TextField placeholder="관리자" />
          </Field.Root>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  ),
};

/** VR 기준. FunctionalDemo와 안 겹치게 폼 없이 트리거·패널 시각만 담은 단순 3탭 구성. */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Tabs.Root defaultValue="a">
        <Tabs.List aria-label="상태 확인용 탭">
          <Tabs.Trigger value="a">탭 A</Tabs.Trigger>
          <Tabs.Trigger value="b">탭 B</Tabs.Trigger>
          <Tabs.Trigger value="c">탭 C</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A 패널 내용</Tabs.Content>
        <Tabs.Content value="b">B 패널 내용</Tabs.Content>
        <Tabs.Content value="c">C 패널 내용</Tabs.Content>
      </Tabs.Root>
    </div>
  ),
};
