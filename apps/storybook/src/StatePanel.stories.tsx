import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, StatePanel } from "@dg-design/react";

const meta = {
  title: "StatePanel",
  component: StatePanel.Root,
} satisfies Meta<typeof StatePanel.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Playground 스토리 */
export const Playground: Story = {
  render: () => (
    <StatePanel.Root>
      <StatePanel.Icon>
        <span style={{ fontSize: "2rem" }}>📦</span>
      </StatePanel.Icon>
      <StatePanel.Title>항목이 없습니다</StatePanel.Title>
      <StatePanel.Description>새 항목을 만들어 시작해보세요.</StatePanel.Description>
      <StatePanel.Actions>
        <Button variant="solid" intent="brand">
          항목 만들기
        </Button>
      </StatePanel.Actions>
    </StatePanel.Root>
  ),
};

/**
 * Empty, Error, Loading 등 다양한 상태 패널 조합을 한 화면에서 확인하는 매트릭스.
 */
export const StateMatrix: Story = {
  name: "State matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        maxWidth: 600,
      }}
    >
      {/* Empty State */}
      <StatePanel.Root>
        <StatePanel.Icon>
          <span style={{ fontSize: "2rem" }}>📂</span>
        </StatePanel.Icon>
        <StatePanel.Title>저장된 프로젝트가 없습니다</StatePanel.Title>
        <StatePanel.Description>
          새 프로젝트를 시작하고 설정을 완료해보세요.
        </StatePanel.Description>
        <StatePanel.Actions>
          <Button variant="solid" intent="brand">
            새 프로젝트
          </Button>
        </StatePanel.Actions>
      </StatePanel.Root>

      {/* Error State */}
      <StatePanel.Root role="alert">
        <StatePanel.Icon>
          <span style={{ fontSize: "2rem" }}>⚠️</span>
        </StatePanel.Icon>
        <StatePanel.Title>데이터를 불러오지 못했습니다</StatePanel.Title>
        <StatePanel.Description>
          네트워크 연결을 확인한 뒤 다시 시도해주세요.
        </StatePanel.Description>
        <StatePanel.Actions>
          <Button variant="weak" intent="neutral">
            다시 시도
          </Button>
        </StatePanel.Actions>
        <StatePanel.Footer>
          <details>
            <summary style={{ cursor: "pointer" }}>기술 상세 정보</summary>
            <div style={{ marginTop: 8, textAlign: "left" }}>
              <code>ERR_CONNECTION_REFUSED (500)</code>
            </div>
          </details>
        </StatePanel.Footer>
      </StatePanel.Root>

      {/* Loading Preset */}
      <StatePanel.Loading label="프로젝트 정보를 불러오는 중입니다..." />
    </div>
  ),
};
