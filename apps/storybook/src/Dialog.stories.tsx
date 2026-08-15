import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog, Field, TextField } from "@dg-design/react";
import * as React from "react";

// component를 지정하지 않는다 — Dialog.Root의 컴포넌트 타입은 barrel에 노출돼 있지 않아
// (barrel엔 Dialog 객체 하나만) 선언 파일에서 이름을 붙일 수 없다. 모든 스토리가 render를 쓴다.
const meta = {
  title: "Dialog",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`dialog--functional-demo`)를 쓴다 —
 * 트리거·오버레이·닫기 버튼 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>다이얼로그 열기</Button>
        </Dialog.Trigger>
        <Dialog.Overlay data-testid="overlay" />
        <Dialog.Content>
          <Dialog.Title>구독을 해지할까요?</Dialog.Title>
          <Dialog.Description>
            해지하면 다음 결제일부터 요금이 청구되지 않습니다.
          </Dialog.Description>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button variant="weak" intent="neutral">
                취소
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button>해지하기</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ),
};

/** 중첩 2단. 기능 테스트가 `dialog--nested-demo`로 ESC 최상단 라우팅을 검증한다. */
export const NestedDemo: StoryObj<typeof meta> = {
  name: "Nested demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>바깥 다이얼로그</Button>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>바깥</Dialog.Title>
          <Dialog.Description>여기서 두 번째 다이얼로그를 연다.</Dialog.Description>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="weak">안쪽 다이얼로그</Button>
            </Dialog.Trigger>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>안쪽</Dialog.Title>
              <Dialog.Description>ESC는 이 다이얼로그만 닫는다.</Dialog.Description>
              <Dialog.Close asChild>
                <Button variant="weak" intent="neutral">
                  닫기
                </Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Close asChild>
            <Button variant="weak" intent="neutral">
              닫기
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ),
};

/** 폼 데모 — initialFocusRef로 첫 입력에 포커스를 준다. */
function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} initialFocusRef={nameRef}>
      <Dialog.Trigger asChild>
        <Button>프로필 편집</Button>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>프로필 편집</Dialog.Title>
        <Dialog.Description>변경사항은 저장을 눌러야 반영됩니다.</Dialog.Description>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Field.Root>
            <Field.Label>이름</Field.Label>
            <TextField ref={nameRef} defaultValue="편도걸" />
          </Field.Root>
          <Field.Root>
            <Field.Label>이메일</Field.Label>
            <TextField type="email" defaultValue="dg@example.com" />
            <Field.Description>회사 이메일만 허용됩니다.</Field.Description>
          </Field.Root>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button type="button" variant="weak" intent="neutral">
                취소
              </Button>
            </Dialog.Close>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export const FormDemo: StoryObj<typeof meta> = {
  name: "Form demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <FormDialog />
    </div>
  ),
};

/**
 * VR용 열림 고정 스토리. 시각 회귀는 `#storybook-root` 요소 스크린샷을 찍는데
 * 다이얼로그는 body 직속 portal이라, 래퍼를 뷰포트 높이로 채워 캡처 영역 안에 들어오게 한다.
 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "Open state (VR)",
  render: () => (
    <div style={{ minHeight: "100vh", padding: 24, boxSizing: "border-box" }}>
      <Dialog.Root open>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>구독을 해지할까요?</Dialog.Title>
          <Dialog.Description>
            해지하면 다음 결제일부터 요금이 청구되지 않습니다.
          </Dialog.Description>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="weak" intent="neutral">
              취소
            </Button>
            <Button>해지하기</Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ),
};
