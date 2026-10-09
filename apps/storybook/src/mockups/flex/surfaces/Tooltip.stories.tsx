import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip } from "@dg-design/react";

import { CopyIcon, InfoIcon } from "../../c-overlay/icons";
import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Surfaces/Tooltip", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const same = v.variant === "current" ? "DDS 선언값" : "D 현재 값 — A·B 동일";
  return (
    <FlexPage
      v={v}
      title="Tooltip"
      summary={
        v.variant === "current"
          ? "현재 Tooltip은 반전 표면(bg-neutral-solid)의 작은 글자(12) 한 가지입니다."
          : "치수·조합 모두 현재와 같습니다. 짧은 부연만 넣고, 긴 설명·링크·버튼은 Popover로 옮깁니다."
      }
    >
      <FlexSection title="열림" columns={mobile ? 1 : 2} note="접근 이름은 aria-label이 맡습니다 — Tooltip은 같은 말을 보여 줄 뿐입니다.">
        <FlexState label="아이콘 버튼 · 이름" block>
          <Tooltip.Root open placement="bottom">
            <Tooltip.Trigger asChild>
              <Button intent="neutral" variant="ghost" iconOnly aria-label="링크 복사"><CopyIcon /></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>링크 복사</Tooltip.Content>
          </Tooltip.Root>
          <FlexReserve height={44} />
        </FlexState>
        <FlexState label="짧은 부연 · 최대 16rem" block>
          <Tooltip.Root open placement="bottom-start">
            <Tooltip.Trigger asChild>
              <Button intent="neutral" variant="ghost" iconOnly aria-label="마감일 설명"><InfoIcon /></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>마감일이 지나면 요청자에게 다시 알립니다.</Tooltip.Content>
          </Tooltip.Root>
          <FlexReserve height={64} />
        </FlexState>
      </FlexSection>

      <FlexSection title="쓰지 않는 곳" note="모바일·터치에서는 Tooltip을 볼 수 없어도 핵심 행동을 이해할 수 있어야 합니다.">
        <FlexState label="옮길 곳" block>긴 설명·링크·버튼 → Popover · 필수 안내 → Field.Description</FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["표면", "p6·8 · r8 · 최대 16rem · bg-neutral-solid", same],
        ["글자", "12 / t2 · fg-neutral-contrast", same],
        ["경계", "없음 — 반전 표면이 경계를 대신함", same],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={480} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={480} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
