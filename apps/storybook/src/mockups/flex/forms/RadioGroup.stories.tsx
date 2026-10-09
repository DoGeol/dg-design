import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, RadioGroup } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/RadioGroup", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const VIEWS = [
  { value: "week", title: "주 단위", desc: "한 주 근무를 날짜별로 봅니다." },
  { value: "month", title: "월 단위", desc: "한 달 일정을 달력으로 봅니다." },
  { value: "list", title: "목록", desc: "근무 기록을 시간순으로 봅니다." },
] as const;

/** 상태 칸 하나 — 라디오 하나만 둔다(force가 칸 전체에 걸린다). */
function One({ checked, disabled, invalid }: { checked?: boolean; disabled?: boolean; invalid?: boolean }) {
  return (
    <RadioGroup.Root aria-label="알림" defaultValue={checked ? "on" : undefined} aria-invalid={invalid || undefined}>
      <RadioGroup.Item value="on" disabled={disabled}>즉시</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const touch = mobile && v.variant !== "current";
  return (
    <FlexPage
      v={v}
      title="RadioGroup"
      summary={
        isB
          ? "일반 radio는 브랜드 그대로 두고, 설정 화면에는 약한 중성 행 + 중성 선택점 + 브랜드 저장 CTA 조합을 더합니다(DS026)."
          : v.variant === "a"
            ? "브랜드 원과 점을 유지합니다. segmented는 pill 외에 바깥 r12·안쪽 r10 외형을 같은 variant의 옵션으로 비교합니다."
            : "현재 DDS RadioGroup입니다. 브랜드 원형 radio와 pill segmented가 있습니다."
      }
    >
      <FlexSection title="일반 radio · 상태" columns={3} note="원 16px · 선택은 브랜드 채움 + 점입니다. 세 안 모두 같습니다.">
        <FlexState label="unchecked"><One /></FlexState>
        <FlexState label="checked"><One checked /></FlexState>
        <FlexState label="hover" force="hover"><One /></FlexState>
        <FlexState label="checked · hover" force="hover"><One checked /></FlexState>
        <FlexState label="checked · focus" force="focus"><One checked /></FlexState>
        <FlexState label="pressed" force="pressed"><One checked /></FlexState>
        <FlexState label="disabled"><One disabled /></FlexState>
        <FlexState label="checked · disabled"><One checked disabled /></FlexState>
        <FlexState label="error"><One invalid /></FlexState>
      </FlexSection>

      <FlexSection
        title="설정 화면 · 보기 방식"
        note={
          isB
            ? "행 표면은 bg-neutral-weak, 선택점은 neutral solid입니다. 강조는 저장 CTA 하나에만 둡니다."
            : v.variant === "a"
              ? "A는 기존 radio 목록을 유지합니다. 설정 행 표면은 없습니다."
              : "현재 없음 — 설정 행 조합이 없어 radio 목록과 버튼을 나란히 둡니다."
        }
      >
        <FlexState label={isB ? "설정 행 + 저장 CTA" : "radio 목록 + 저장"} block>
          <div style={{ display: "grid", gap: "var(--fx-group-gap, 24px)" }}>
            <Field.Root>
              <Field.Label>근무 보기 방식</Field.Label>
              <RadioGroup.Root defaultValue="week" className={isB ? "fx-setting-rows" : undefined}>
                {VIEWS.map((item) => (
                  <RadioGroup.Item key={item.value} value={item.value} className={item.value === "month" && isB ? "mk-hover" : undefined}>
                    <span className="fx-row-text"><b>{item.title}</b><span>{item.desc}</span></span>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </Field.Root>
            <div style={{ display: "flex", justifyContent: mobile ? "stretch" : "flex-end" }}>
              <Button className="fx-cta" size={v.variant === "current" ? "large" : "medium"} style={mobile ? { flex: 1 } : undefined}>저장</Button>
            </div>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection
        title="segmented"
        note={
          v.variant === "a"
            ? "A 외형 옵션 — 바깥 r12, 안쪽 r10(바깥 − inset 2)입니다. pill은 그대로 남깁니다."
            : "pill 외형입니다. B는 측정이 없어 현재 외형을 유지합니다."
        }
      >
        <FlexState label={touch ? "large · 44" : "medium · 36"}>
          <RadioGroup.Root variant="segmented" size={touch ? "large" : "medium"} defaultValue="list" aria-label="보기" className={v.variant === "a" ? "fx-seg-square" : undefined}>
            <RadioGroup.Item value="list">목록</RadioGroup.Item>
            <RadioGroup.Item value="board">보드</RadioGroup.Item>
            <RadioGroup.Item value="calendar">달력</RadioGroup.Item>
          </RadioGroup.Root>
        </FlexState>
        <FlexState label="selected + focus">
          <RadioGroup.Root variant="segmented" size={touch ? "large" : "medium"} defaultValue="board" aria-label="보기" className={v.variant === "a" ? "fx-seg-square" : undefined}>
            <RadioGroup.Item value="list">목록</RadioGroup.Item>
            <RadioGroup.Item value="board" className="mk-focus">보드</RadioGroup.Item>
          </RadioGroup.Root>
        </FlexState>
      </FlexSection>

      <FlexSpec
        v={v}
        roles={isB ? ["setting-row-height", "setting-row-radius", "field-gap", "list-inset", "cta-height"] : ["setting-row-height", "cta-height"]}
        extra={[
          ["radio 원 · 라벨 간격", "16 · 8px", "D 현재 DDS 값 유지"],
          ["segmented 높이", "28 / 36 / 44px", touch ? "D 유지 — 모바일은 large 44(C 터치 44 이상)" : "D 현재 DDS 값 유지"],
          ["segmented 반경", v.variant === "a" ? "바깥 12 · 안쪽 10px" : "pill", v.variant === "a" ? "C A 문서 — inset 2와 함께" : "D 현재 DDS 값 유지"],
          ...(isB ? [
            ["설정 행 선택점", "bg-neutral-solid + fg-neutral-contrast", "B DS026 중성 선택 #556373"],
            ["설정 행 표면", "bg-neutral-weak · hover -hover", "B DS026 라디오 행 #F7F7F7"],
          ] as const : []),
        ]}
      />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={820} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={820} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
