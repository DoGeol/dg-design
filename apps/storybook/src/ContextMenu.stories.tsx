import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenu } from "@dg-design/react";

// DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 ContextMenu 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "ContextMenu",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`contextmenu--functional-demo`)를 쓴다 —
 * 우클릭 대상 영역·항목 4개·disabled 1개·Separator·Label 구성을 바꾸지 않는다.
 * 여는 경로가 실제 `contextmenu` 이벤트(우클릭 좌표)뿐이라 DropdownMenu처럼 defaultOpen으로
 * 미리 열어둘 수 없다 — 닫힌 채로 시작해 우클릭으로 여는 것 자체가 검증 대상이다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 320,
            height: 200,
            border: "1px dashed #999",
            borderRadius: 8,
            font: "500 14px sans-serif",
            color: "#666",
          }}
        >
          여기를 우클릭하세요
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>파일</ContextMenu.Label>
          <ContextMenu.Item onSelect={() => console.log("새 문서")}>
            새 문서
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={() => console.log("복제")}>
            복제
          </ContextMenu.Item>
          <ContextMenu.Item disabled>내보내기</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => console.log("삭제")}>
            삭제
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </div>
  ),
};
