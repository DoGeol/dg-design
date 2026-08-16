import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, HoverCard } from "@dg-design/react";

// DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 HoverCard 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "HoverCard",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/**
 * 열림 고정 데모. VR과 기능 테스트(Playwright)가 이 스토리 id(`hovercard--functional-demo`)를 쓴다 —
 * defaultOpen이라 로드 즉시 arrow 포함 열림 상태를 캡처할 수 있고(VR), 그 뒤로도 실제 hover 스케줄
 * (openDelay 700ms/closeDelay 300ms)이 살아 있어 트리거→콘텐츠 이동 유지·이탈 닫힘·ESC를 실제
 * hover로 검증할 수 있다(Playwright). 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 64,
        display: "flex",
        alignItems: "center",
      }}
    >
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger asChild>
          <Button variant="weak" intent="neutral">
            @dogeol
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div style={{ display: "flex", gap: 12, width: 240 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#c9d1d1",
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <strong style={{ font: "600 14px sans-serif" }}>도겔</strong>
              <p style={{ margin: 0, font: "400 13px sans-serif", color: "#666" }}>
                Dogeol Design System을 만듭니다. 트리거에서 콘텐츠로 포인터를 옮겨도 열림이
                유지됩니다.
              </p>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>
  ),
};
