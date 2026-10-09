import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/Checkbox", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Mark = "off" | "on" | "mixed";
const MARKS: readonly Mark[] = ["off", "on", "mixed"];
const markProps = (m: Mark) => ({ defaultChecked: m === "on", indeterminate: m === "mixed" });

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const touch = mobile && v.variant !== "current";
  const size = touch ? "large" : "medium";
  return (
    <FlexPage
      v={v}
      title="Checkbox"
      summary={
        v.variant === "current"
          ? "현재 DDS Checkbox입니다. 16px/r4, 20px/r6 두 크기이고 선택은 브랜드 채움입니다."
          : "크기·반경·브랜드 선택을 유지합니다. 긴 설명은 첫 줄에 체크를 맞추고, 모바일은 20px 박스와 넓은 라벨 행을 씁니다."
      }
    >
      <FlexSection title="값 × 상태" columns={3} note={`${size} 기준입니다. 선택은 채움+체크, mixed는 가로 표시로 구분합니다.`}>
        {MARKS.map((m) => (
          <FlexState key={`d-${m}`} label={`${m} · default`}><Checkbox size={size} {...markProps(m)}>알림</Checkbox></FlexState>
        ))}
        {MARKS.map((m) => (
          <FlexState key={`h-${m}`} label={`${m} · hover`} force="hover"><Checkbox size={size} {...markProps(m)}>알림</Checkbox></FlexState>
        ))}
        {MARKS.map((m) => (
          <FlexState key={`f-${m}`} label={`${m} · focus`} force="focus"><Checkbox size={size} {...markProps(m)}>알림</Checkbox></FlexState>
        ))}
        {MARKS.map((m) => (
          <FlexState key={`x-${m}`} label={`${m} · disabled`}><Checkbox size={size} disabled {...markProps(m)}>알림</Checkbox></FlexState>
        ))}
        <FlexState label="error · off" span={3}><Checkbox size={size} aria-invalid>약관에 동의합니다</Checkbox></FlexState>
      </FlexSection>

      <FlexSection
        title="긴 설명 항목"
        note={v.variant === "current" ? "현재는 체크가 두 줄의 세로 가운데에 섭니다." : "체크를 첫 줄 옆에 맞춥니다. 설명은 라벨 시작선에 둡니다."}
      >
        <FlexState label="라벨 + 설명 두 줄" block>
          <div className={touch ? "fx-touch-list" : undefined} style={{ display: "grid", gap: touch ? 0 : 12 }}>
            {[
              ["주간 요약 메일", "매주 월요일 오전에 지난주 변경과 남은 일을 보냅니다.", true],
              ["멘션 알림", "누군가 나를 언급하면 바로 알립니다. 방해 금지 시간에는 모아서 보냅니다.", false],
            ].map(([title, desc, on]) => (
              <Checkbox key={String(title)} size={size} defaultChecked={Boolean(on)} className={v.variant === "current" ? undefined : "fx-check-top"}>
                <span className="fx-check-text"><b>{title}</b><span>{desc}</span></span>
              </Checkbox>
            ))}
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["박스 medium / large", "16 r4 / 20 r6", "D 현재 DDS 값 유지"],
        ["라벨 간격", "8px", "D dimension-x2 유지"],
        ["focus", "2px 링 + 2px 간격", "비입력 컨트롤 계약 유지"],
        ...(touch ? [["모바일 행", "large 20 · 행 최소 44px", "C 터치 행 — 박스만 키우지 않음"] as const] : []),
        ...(v.variant === "b" ? [["복수 선택 mark와의 관계", "같은 r4 · 브랜드 채움, 16 / 18px", "C DS017 mark 33÷1.75=18.9 (교차 배율) — 모양은 맞추고 입력 의미는 따로"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={720} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
