import type { Meta, StoryObj } from "@storybook/react-vite";
import { SaveStatus } from "@dg-design/react";
import * as React from "react";

const meta = {
  title: "SaveStatus",
  component: SaveStatus,
  argTypes: {
    status: { control: "radio", options: ["saved", "dirty", "saving", "error"] },
  },
  args: {
    status: "saved",
    children: "저장됨",
  },
} satisfies Meta<typeof SaveStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 컨트롤 패널에서 조작 가능한 Playground 스토리 */
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 24 }}>
      <SaveStatus {...args} />
    </div>
  ),
};

/**
 * 4상태(saved·dirty·saving·error)를 한 화면에서 보는 매트릭스 — 라이트·다크는 VR이 맡는다.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
      <SaveStatus status="saved">저장됨</SaveStatus>
      <SaveStatus status="dirty">변경사항 있음</SaveStatus>
      <SaveStatus status="saving">저장 중…</SaveStatus>
      <SaveStatus status="error">저장 실패</SaveStatus>
    </div>
  ),
};

/**
 * 기능 데모: 같은 SaveStatus 노드가 유지된 채 status만 바뀌는 흐름을 확인한다.
 * 닫힌 상태(오버레이 없음)로 둔다 — VR state-matrix가 우선 캡처 대상이라 트리거를 덮지 않게 한다.
 */
export const FunctionalDemo: Story = {
  name: "Functional demo",
  render: () => {
    function Demo() {
      const [status, setStatus] = React.useState<
        "saved" | "dirty" | "saving" | "error"
      >("saved");

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>
          <SaveStatus status={status}>
            {status === "saved" && "저장됨"}
            {status === "dirty" && "변경사항 있음"}
            {status === "saving" && "저장 중…"}
            {status === "error" && "저장 실패"}
          </SaveStatus>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setStatus("saved")}>
              saved
            </button>
            <button type="button" onClick={() => setStatus("dirty")}>
              dirty
            </button>
            <button type="button" onClick={() => setStatus("saving")}>
              saving
            </button>
            <button type="button" onClick={() => setStatus("error")}>
              error
            </button>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
