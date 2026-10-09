import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, Switch } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/Switch", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

/** 설정 행 — 왼쪽 라벨·설명, 오른쪽 스위치. Field가 라벨·설명을 스위치에 연결한다. */
function Row({ label, desc, size, checked, onChange, className }: {
  label: string;
  desc: string;
  size: "medium" | "large";
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}) {
  return (
    <Field.Root className={className}>
      <Field.Label>{label}</Field.Label>
      <Field.Description>{desc}</Field.Description>
      <Switch size={size} checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} />
    </Field.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const size = mobile && v.variant !== "current" ? "large" : "medium";
  const [weekend, setWeekend] = React.useState(false);
  const [hours, setHours] = React.useState(true);
  const dirty = weekend !== false || hours !== true;
  const rowClass = isB ? "fx-switch-row fx-setting-row" : "fx-switch-row";
  return (
    <FlexPage
      v={v}
      title="Switch"
      summary={
        isB
          ? "컨트롤 모양은 그대로 두고, 토글 값이 바꾸는 화면 결과(미리보기)와 저장 경계를 한 조합으로 보입니다."
          : v.variant === "a"
            ? "pill track·thumb 비율을 유지하고 설정 행 오른쪽에 둡니다. 라벨·설명은 왼쪽입니다."
            : "현재 DDS Switch입니다. 32×20 / 40×24, 라벨은 오른쪽 또는 왼쪽에 붙습니다."
      }
    >
      <FlexSection title="상태" columns={3} note={`${size} 기준입니다. thumb 위치와 색을 함께 씁니다.`}>
        <FlexState label="off"><Switch size={size} aria-label="알림" /></FlexState>
        <FlexState label="on"><Switch size={size} aria-label="알림" defaultChecked /></FlexState>
        <FlexState label="on · hover" force="hover"><Switch size={size} aria-label="알림" defaultChecked /></FlexState>
        <FlexState label="off · focus" force="focus"><Switch size={size} aria-label="알림" /></FlexState>
        <FlexState label="on · pressed" force="pressed"><Switch size={size} aria-label="알림" defaultChecked /></FlexState>
        <FlexState label="on · disabled"><Switch size={size} aria-label="알림" defaultChecked disabled /></FlexState>
      </FlexSection>

      <FlexSection
        title="설정 화면 · 근무표 보기"
        note={
          isB
            ? "토글을 바꾸면 미리보기가 즉시 바뀌고, 저장 전 변경이 있으면 저장 CTA가 활성입니다."
            : v.variant === "a"
              ? "라벨·설명 왼쪽, 스위치 오른쪽 설정 행입니다. 결과 미리보기는 없습니다."
              : "현재 없음 — 설정 행 조합이 없어 라벨을 스위치 오른쪽에 붙입니다."
        }
      >
        <FlexState label={isB ? "설정 행 + 미리보기 + 저장" : v.variant === "a" ? "설정 행" : "라벨 붙은 스위치"} block>
          <div style={{ display: "grid", gap: "var(--fx-field-gap, 16px)" }}>
            {isB && (
              <div className="fx-preview" aria-label="미리보기">
                {DAYS.filter((day) => weekend || (day !== "토" && day !== "일")).map((day) => (
                  <span key={day} className="fx-preview-day">
                    <b>{day}</b>
                    {hours && <span>9–18</span>}
                  </span>
                ))}
              </div>
            )}
            {v.variant === "current" ? (
              <>
                <Switch size={size} checked={weekend} onChange={(e) => setWeekend(e.currentTarget.checked)}>주말 표시</Switch>
                <Switch size={size} checked={hours} onChange={(e) => setHours(e.currentTarget.checked)}>근무 시간 표시</Switch>
              </>
            ) : (
              <>
                <Row className={rowClass} size={size} label="주말 표시" desc="토요일과 일요일 열을 보입니다." checked={weekend} onChange={setWeekend} />
                <Row className={rowClass} size={size} label="근무 시간 표시" desc="날짜 아래에 근무 시간을 적습니다." checked={hours} onChange={setHours} />
              </>
            )}
            {isB && (
              <div className="fx-save-bar">
                <span className="fx-note">{dirty ? "저장하지 않은 변경이 있습니다." : "변경 사항이 없습니다."}</span>
                <Button className="fx-cta" disabled={!dirty} style={mobile ? { flex: 1 } : undefined}>저장</Button>
              </div>
            )}
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={isB ? ["setting-row-height", "setting-row-radius", "list-inset", "field-gap"] : ["field-gap"]} extra={[
        ["track · thumb medium / large", "32×20 · 16 / 40×24 · 20", "D 현재 DDS 값 유지"],
        ["모바일 크기", size === "large" ? "large 40×24, 행 전체가 조작 영역" : "medium", size === "large" ? "C A 문서 — 시각은 유지하고 조작 영역을 넓힘" : "현재 DDS 값 유지"],
        ...(v.variant === "a" ? [["설정 행 위아래 · 라벨–스위치", "12 · 16px", "C A 문서 — 행 내부 12–16"] as const] : []),
        ...(isB ? [["미리보기 표면", "bg-neutral-weak · 1px stroke-neutral-weak", "C 설정 비전(SV087) 응용 — 결과를 같은 화면에"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
