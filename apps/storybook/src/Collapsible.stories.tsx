import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, Collapsible, TextField } from "@dg-design/react";

const meta = { title: "Collapsible" } satisfies Meta;

export default meta;

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => {
    const [open, setOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    return (
      <div style={{ display: "grid", gap: 16, maxWidth: 360, padding: 24 }}>
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger>상세 설정</Collapsible.Trigger>
          <Collapsible.Content>
            <div style={{ display: "grid", gap: 8, paddingTop: 12 }}>
              <TextField aria-label="표시 이름" placeholder="표시 이름을 입력하세요" />
              <span>접은 뒤 다시 열어도 입력한 값이 유지됩니다.</span>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        <Button type="button" variant="weak" intent="neutral" onClick={() => setOpen(false)}>
          외부에서 닫기
        </Button>

        <Collapsible.Root>
          <Collapsible.Trigger asChild>
            <Button variant="weak" intent="neutral">asChild 트리거</Button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div style={{ paddingTop: 12 }}>DDS Button을 Trigger로 합성했습니다.</div>
          </Collapsible.Content>
        </Collapsible.Root>

        <Collapsible.Root>
          <Collapsible.Trigger>동적 콘텐츠</Collapsible.Trigger>
          <Collapsible.Content>
            <div style={{ display: "grid", gap: 8, paddingTop: 12 }}>
              <span>ResizeObserver가 열린 영역의 실제 높이를 다시 측정합니다.</span>
              <Button
                type="button"
                size="small"
                variant="weak"
                intent="neutral"
                onClick={() => setShowMore((current) => !current)}
              >
                콘텐츠 추가
              </Button>
              {showMore ? <span data-testid="collapsible-added-content">추가된 콘텐츠입니다.</span> : null}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        <Collapsible.Root data-testid="collapsible-root-only" />
        <Collapsible.Root>
          <Collapsible.Trigger>Content 없는 Trigger</Collapsible.Trigger>
        </Collapsible.Root>
      </div>
    );
  },
};

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "grid", gap: 24, maxWidth: 360, padding: 24 }}>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>열린 콘텐츠</Collapsible.Trigger>
        <Collapsible.Content><div style={{ paddingTop: 8 }}>실제 높이를 측정해 전환합니다.</div></Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root>
        <Collapsible.Trigger>닫힌 콘텐츠</Collapsible.Trigger>
        <Collapsible.Content><div style={{ paddingTop: 8 }}>DOM은 유지됩니다.</div></Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root disabled defaultOpen>
        <Collapsible.Trigger>비활성 콘텐츠</Collapsible.Trigger>
        <Collapsible.Content><div style={{ paddingTop: 8 }}>사용자 입력으로 바뀌지 않습니다.</div></Collapsible.Content>
      </Collapsible.Root>
    </div>
  ),
};
