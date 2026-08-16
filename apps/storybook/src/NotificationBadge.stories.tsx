import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationBadge } from "@dg-design/react";

const INTENTS = ["critical", "brand"] as const;

const meta = {
  title: "NotificationBadge",
  component: NotificationBadge,
  argTypes: {
    intent: { control: "radio", options: INTENTS },
    count: { control: "number" },
    max: { control: "number" },
    isShowEmpty: { control: "boolean" },
  },
  args: {
    intent: "critical",
    count: 5,
    max: 99,
    isShowEmpty: false,
  },
} satisfies Meta<typeof NotificationBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

/** count/max/isShowEmpty/intent를 컨트롤 패널에서 직접 조작하는 스토리 */
export const Playground: Story = {};

const STATES = [
  { label: "dot", props: {} },
  { label: "count=5", props: { count: 5 } },
  { label: "99+", props: { count: 150 } },
  { label: "isShowEmpty(0)", props: { count: 0, isShowEmpty: true } },
] as const;

/**
 * intent(2) x 렌더 상태(4: dot·count·99+ 상한·isShowEmpty 0) 그리드.
 * VR이 이 스토리 id(`notificationbadge--state-matrix`)를 기준 이미지로 잡는다.
 */
function StateMatrixGrid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {INTENTS.map((intent) => (
        <section key={intent}>
          <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>intent: {intent}</h2>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {STATES.map((state) => (
              <div
                key={state.label}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <NotificationBadge intent={intent} {...state.props} />
                <span style={{ font: "500 12px sans-serif" }}>{state.label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** intent(2) x 상태(4) = 8조합 전체 그리드 */
export const StateMatrix: Story = {
  render: () => <StateMatrixGrid />,
};

/**
 * 부착 데모. Positioner는 스펙에서 제외됐다 — 소비 앱이 직접 `position: relative` 컨테이너
 * 우상단에 `position: absolute`로 배지를 얹는 인라인 패턴을 예시로 보여준다.
 */
export const AttachmentDemo: Story = {
  name: "Attachment demo",
  render: () => (
    <div style={{ display: "flex", gap: 32 }}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>🔔</span>
        <NotificationBadge
          count={5}
          intent="critical"
          style={{ position: "absolute", top: -6, right: -8 }}
        />
      </div>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e2e8f0" }} />
        <NotificationBadge intent="brand" style={{ position: "absolute", top: -4, right: -4 }} />
      </div>
    </div>
  ),
};
