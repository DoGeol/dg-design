import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Surfaces/Separator", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;
const box = { border: "1px solid var(--dds-color-stroke-neutral-weak)", borderRadius: "var(--dds-radius-r3)", overflow: "hidden" } as const;
const row = { padding: "12px 16px" } as const;

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  return (
    <FlexPage
      v={v}
      title="Separator"
      summary={
        v.variant === "current"
          ? "현재 Separator는 수평·수직 1px(stroke-neutral-weak) 한 가지입니다."
          : "치수·조합 모두 현재와 같습니다. 간격만으로 구분이 부족할 때만 긋고, 폼 필드마다 반복하지 않습니다."
      }
    >
      <FlexSection title="전체 폭 · 시작선 inset" columns={mobile ? 1 : 2} note="면의 끝까지 나눌 때는 전체 폭, 같은 묶음 안의 행은 텍스트 시작선에 맞춘 inset입니다.">
        <FlexState label="전체 폭" block>
          <div style={box}>
            <div style={row}>공개 범위</div>
            <Separator />
            <div style={row}>담당자</div>
          </div>
        </FlexState>
        <FlexState label="inset 16" block>
          <div style={box}>
            <div style={row}>공개 범위</div>
            <Separator style={{ marginInlineStart: 16, width: "auto" }} />
            <div style={row}>담당자</div>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection title="수직 · 실제 열 구분" note={mobile ? "열이 위아래로 쌓이면 수평선으로 바꾸거나 없앱니다." : "작업형 Dialog의 Aside처럼 실제 열을 나눌 때만 씁니다."}>
        <FlexState label={mobile ? "쌓인 열 · 수평" : "본문 | Aside"} block>
          <div style={{ ...box, display: "flex", flexDirection: mobile ? "column" : "row" }}>
            <div style={{ ...row, flex: 1 }}><strong>본문</strong><p style={weak}>검토 메모와 담당자</p></div>
            <Separator orientation={mobile ? "horizontal" : "vertical"} />
            <div style={{ ...row, flex: 1 }}><strong>활동</strong><p style={weak}>요청 · 확인 · 수정</p></div>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["두께 · 색", "1px · stroke-neutral-weak", v.variant === "current" ? "DDS 선언값" : "D 현재 값 — A·B 동일"],
        ["의미", "기본 decorative, 의미 있으면 decorative={false}", "현재 API 유지"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={420} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={420} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
