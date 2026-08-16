import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip } from "@dg-design/react";

// DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 Tooltip 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Tooltip",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`tooltip--functional-demo`)를 쓴다 —
 * 단독 트리거 1개 + Provider 그룹 스킵을 체감할 수 있는 긴 지연 트리거 3개 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 48, display: "flex", flexDirection: "column", gap: 32 }}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button>단독 툴팁</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>기본 openDelay(700ms) 하나만 씁니다.</Tooltip.Content>
      </Tooltip.Root>

      <div style={{ display: "flex", gap: 16 }}>
        <Tooltip.Provider>
          <Tooltip.Root openDelay={1500}>
            <Tooltip.Trigger asChild>
              <Button>그룹 A</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>1.5초 지연 — 처음엔 기다려야 열립니다.</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root openDelay={1500}>
            <Tooltip.Trigger asChild>
              <Button>그룹 B</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>A가 열려 있던 직후라면 지연 없이 열립니다.</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root openDelay={1500}>
            <Tooltip.Trigger asChild>
              <Button>그룹 C</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>마찬가지로 그룹 스킵의 대상입니다.</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  ),
};

/**
 * VR용 열림 고정 스토리. 네 방향 배치를 한 화면에 모아 arrow 회전을 라이트·다크에서 확인한다.
 */
export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "Open state (VR)",
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 64,
        display: "flex",
        alignItems: "center",
        gap: 64,
      }}
    >
      <Tooltip.Root open placement="top">
        <Tooltip.Trigger asChild>
          <Button>위</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>top 배치</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root open placement="bottom">
        <Tooltip.Trigger asChild>
          <Button>아래</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>bottom 배치</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root open placement="left">
        <Tooltip.Trigger asChild>
          <Button>왼쪽</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>left 배치</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root open placement="right">
        <Tooltip.Trigger asChild>
          <Button>오른쪽</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>right 배치</Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
};
