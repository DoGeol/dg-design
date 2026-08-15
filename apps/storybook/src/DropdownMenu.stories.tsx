import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog, DropdownMenu } from "@dg-design/react";

// Dialog와 같은 이유로 component를 지정하지 않는다 — barrel엔 DropdownMenu 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "DropdownMenu",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

function DemoMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button>메뉴 열기</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>파일</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={() => console.log("새 문서")}>새 문서</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => console.log("복제")}>복제</DropdownMenu.Item>
        <DropdownMenu.Item disabled>내보내기</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => console.log("삭제")}>삭제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`dropdownmenu--functional-demo`)를 쓴다 —
 * 트리거·항목 4개·disabled 1개·Separator·Label 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <DemoMenu />
    </div>
  ),
};

/**
 * Dialog 안 메뉴. 기능 테스트가 `dropdownmenu--in-dialog-demo`로 ESC 1회에 메뉴만 닫히는지
 * (= 비모달 스택 등록) 검증한다.
 */
export const InDialogDemo: StoryObj<typeof meta> = {
  name: "In dialog demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>다이얼로그 열기</Button>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>문서 설정</Dialog.Title>
          <Dialog.Description>ESC 한 번은 메뉴만 닫는다.</Dialog.Description>
          <DemoMenu />
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

/**
 * VR용 열림 고정 스토리. 메뉴는 body 직속 portal이라 `#storybook-root` 스크린샷 안에 들어오도록
 * 래퍼를 뷰포트 높이로 채운다(Dialog StateMatrixStory와 같은 이유).
 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "Open state (VR)",
  render: () => (
    <div style={{ minHeight: "100vh", padding: 24, boxSizing: "border-box" }}>
      <DropdownMenu.Root open>
        <DropdownMenu.Trigger asChild>
          <Button>메뉴 열기</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>파일</DropdownMenu.Label>
          <DropdownMenu.Item>새 문서</DropdownMenu.Item>
          <DropdownMenu.Item>복제</DropdownMenu.Item>
          <DropdownMenu.Item disabled>내보내기</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>삭제</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  ),
};
