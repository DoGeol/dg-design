import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Popover } from "@dg-design/react";
import * as React from "react";

// DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 Popover 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Popover",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #c9d1d1",
  font: "inherit",
};

function QuickNoteForm({ onSubmit }: { onSubmit?: () => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      style={{ display: "flex", flexDirection: "column", gap: 12, width: 240 }}
    >
      <label style={fieldStyle}>
        제목
        <input name="title" style={inputStyle} />
      </label>
      <label style={fieldStyle}>
        메모
        <textarea name="note" rows={3} style={inputStyle} />
      </label>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Popover.Close asChild>
          <Button type="button" variant="weak" intent="neutral">
            취소
          </Button>
        </Popover.Close>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
}

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`popover--functional-demo`)를 쓴다 —
 * 트리거 + 폼 콘텐츠(제목·메모·취소·저장) 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      return (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button>메모 추가</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Arrow />
            <QuickNoteForm onSubmit={() => setOpen(false)} />
          </Popover.Content>
        </Popover.Root>
      );
    }
    return (
      <div style={{ padding: 24 }}>
        <Demo />
      </div>
    );
  },
};

/** autoFocus=false 데모 — 열려도 포커스가 트리거에 그대로 남는다(참조용 팝오버). */
export const NoAutoFocusDemo: StoryObj<typeof meta> = {
  name: "No autofocus demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Popover.Root autoFocus={false} placement="right">
        <Popover.Trigger asChild>
          <Button variant="weak" intent="neutral">
            도움말
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Arrow />
          <p style={{ margin: 0, maxWidth: 200, fontSize: 14 }}>
            입력을 계속하면서 참고할 수 있도록 포커스를 뺏지 않습니다.
          </p>
        </Popover.Content>
      </Popover.Root>
    </div>
  ),
};

/**
 * VR용 열림 고정 스토리. 패널은 body 직속 portal이라 `#storybook-root` 스크린샷 안에 들어오도록
 * 래퍼를 뷰포트 높이로 채운다(DropdownMenu·Select StateMatrixStory와 같은 이유). arrow 포함.
 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "Open state (VR)",
  render: () => (
    <div style={{ minHeight: "100vh", padding: 24, boxSizing: "border-box" }}>
      <Popover.Root open>
        <Popover.Trigger asChild>
          <Button>메모 추가</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Arrow />
          <QuickNoteForm />
        </Popover.Content>
      </Popover.Root>
    </div>
  ),
};
