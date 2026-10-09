import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/Button", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  return (
    <FlexPage
      v={v}
      title="Button"
      summary={
        v.variant === "b"
          ? "브랜드 CTA 하나와 중성 보조 행동을 구분합니다. 반경은 측정값 6px(데스크톱)을 그대로 씁니다."
          : v.variant === "a"
            ? "기존 세 크기를 유지하고 반경 8px, 역할상 필요할 때 CTA 48px을 더합니다."
            : "현재 DDS 버튼입니다. CTA 역할 크기는 없고 large 52px을 씁니다."
      }
    >
      <FlexSection title="위계" columns={2} note="저장·확정은 brand solid, 취소·닫기는 neutral weak, 삭제는 critical입니다.">
        <FlexState label="brand · solid"><Button>저장</Button></FlexState>
        <FlexState label="neutral · weak"><Button intent="neutral" variant="weak">취소</Button></FlexState>
        <FlexState label="neutral · ghost"><Button intent="neutral" variant="ghost">더 보기</Button></FlexState>
        <FlexState label="critical · solid"><Button intent="critical">삭제</Button></FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={3} note="brand solid · medium 기준입니다.">
        <FlexState label="hover" force="hover"><Button>저장</Button></FlexState>
        <FlexState label="focus" force="focus"><Button>저장</Button></FlexState>
        <FlexState label="pressed" force="pressed"><Button>저장</Button></FlexState>
        <FlexState label="disabled"><Button disabled>저장</Button></FlexState>
        <FlexState label="loading · 폭 유지"><Button loading>저장</Button></FlexState>
      </FlexSection>

      <FlexSection title="크기" columns={3}>
        <FlexState label="small"><Button size="small">저장</Button></FlexState>
        <FlexState label="medium"><Button size="medium">저장</Button></FlexState>
        <FlexState label="large"><Button size="large">저장</Button></FlexState>
      </FlexSection>

      <FlexSection
        title={mobile ? "주요 CTA · 화면 하단" : "주요 CTA · 페이지 헤더"}
        note={v.variant === "current" ? "현재는 large 버튼으로 대신합니다." : "역할 크기 .fx-cta — 일반 버튼과 같은 강조로 두지 않습니다."}
      >
        <FlexState label={mobile ? "하단 고정 행동" : "헤더 오른쪽"} block>
          <div style={{ display: "flex", justifyContent: mobile ? "stretch" : "flex-end", gap: 8 }}>
            {!mobile && <Button intent="neutral" variant="weak">임시 저장</Button>}
            <Button className="fx-cta" size={v.variant === "current" ? "large" : "medium"} style={mobile ? { flex: 1 } : undefined}>
              발행하기
            </Button>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["button-radius", "cta-height"]} extra={[
        ["높이 small / medium / large", "36 / 40 / 52px", "현재 DDS 유지(A·B 공통)"],
        ["focus", "2px 링 + 2px 간격", "비입력 컨트롤 계약 유지"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
