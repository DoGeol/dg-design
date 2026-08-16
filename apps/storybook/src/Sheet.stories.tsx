import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Sheet } from "@dg-design/react";

// Dialog와 같은 이유로 component를 지정하지 않는다 — barrel엔 Sheet 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Sheet",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

const SIDES = ["left", "right", "top", "bottom"] as const;

/**
 * VR용 4방향 동시 열림 — 스크린샷 한 장에서 side 4종의 진입 정지 상태를 전부 잡는다.
 * 실사용 조합이 아니라 진단용 배치라 모서리 겹침은 허용한다.
 * Overlay는 렌더하지 않는다 — Sheet마다 자기 portal 컨테이너를 만들고(dialog-stack의
 * inert 판정이 body 자식 단위라 컨테이너를 공유하면 자기 자신까지 inert 대상이 되기 때문)
 * body 자식 순서대로 쌓이므로, 전체화면 반투명 오버레이 4장을 같이 그리면 나중에 마운트된
 * Sheet의 오버레이가 앞서 열린 패널들을 전부 덮어버린다.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      {SIDES.map((side) => (
        <Sheet.Root key={side} side={side} open>
          <Sheet.Content>
            <Sheet.Title>{side} 시트</Sheet.Title>
            <Sheet.Description>{`side="${side}"에서 슬라이드해 들어온다.`}</Sheet.Description>
          </Sheet.Content>
        </Sheet.Root>
      ))}
    </div>
  ),
};

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`sheet--functional-demo`)를 쓴다 —
 * 기본 side(right), 트리거·오버레이·닫기 버튼 구성은 Dialog FunctionalDemo와 대칭.
 * 닫힌 채로 시작한다 — 기능 테스트가 트리거 클릭부터 검증하는데 열려 있으면 오버레이가
 * 트리거를 덮는다. 열린 모습의 VR은 StateMatrix가 맡는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Sheet.Root>
        <Sheet.Trigger asChild>
          <Button>시트 열기</Button>
        </Sheet.Trigger>
        <Sheet.Overlay />
        <Sheet.Content>
          <Sheet.Title>배송지 변경</Sheet.Title>
          <Sheet.Description>
            저장하면 다음 주문부터 적용됩니다.
          </Sheet.Description>
          <Sheet.Close asChild>
            <Button variant="weak" intent="neutral">
              닫기
            </Button>
          </Sheet.Close>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  ),
};
