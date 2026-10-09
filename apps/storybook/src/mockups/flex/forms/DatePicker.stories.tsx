import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/DatePicker", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const date = (month: number, day: number) => new CalendarDate(2026, month, day);
const PICKER_QUERY = "47.99rem";
const nativeMatchMedia = typeof window === "undefined" ? undefined : window.matchMedia;

/**
 * DatePicker는 화면 폭(48rem 미만)으로 Popover/Sheet를 고른다. 비교 열 iframe은 데스크톱도 460px라
 * 늘 Sheet가 되므로, 이 시안 문서 안에서만 그 질의를 density에 맞춰 답한다. 자식 effect보다 먼저 걸리게 초기화 시점에 바꾼다.
 */
function PickerViewport({ mobile, children }: { mobile: boolean; children: React.ReactNode }) {
  React.useState(() => {
    if (!nativeMatchMedia) return;
    window.matchMedia = (query: string) =>
      query.includes(PICKER_QUERY)
        ? ({ matches: mobile, media: query, onchange: null, addEventListener() {}, removeEventListener() {},
            addListener() {}, removeListener() {}, dispatchEvent: () => false } as MediaQueryList)
        : nativeMatchMedia.call(window, query);
  });
  React.useEffect(() => () => { if (nativeMatchMedia) window.matchMedia = nativeMatchMedia; }, []);
  return <>{children}</>;
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const field = v.variant === "current" ? undefined : isB ? "fx-date fx-date-box" : "fx-date";
  return (
    <PickerViewport mobile={mobile}>
      <FlexPage
        v={v}
        title="DatePicker"
        summary={
          isB
            ? "inline·Popover·Sheet를 같은 값 모델의 동등한 컨테이너로 봅니다. 트리거는 비키보드 값이라 property(box) 외형입니다."
            : v.variant === "a"
              ? "날짜 트리거를 Field 계열(외부 라벨 + 입력 높이)로 맞추고 달력의 오늘·선택·범위 상태를 구분합니다. 모바일은 기존 Sheet입니다."
              : "현재 DDS DatePicker입니다. 트리거는 neutral weak 버튼이고 48rem 미만에서는 하단 Sheet로 열립니다."
        }
      >
        <FlexSection title="트리거" columns={2} note={v.variant === "current" ? "Button neutral weak medium입니다." : "입력과 같은 높이·반경·여백으로 값을 왼쪽에 둡니다."}>
          <FlexState label="selected" block><DatePicker className={field} kind="date" locale="ko-KR" label="시작일" defaultValue={date(10, 5)} /></FlexState>
          <FlexState label="empty" block><DatePicker className={field} kind="date" locale="ko-KR" label="종료일" defaultValue={null} /></FlexState>
          <FlexState label="disabled" block><DatePicker className={field} kind="date" locale="ko-KR" label="종료일" defaultValue={date(10, 9)} disabled /></FlexState>
          <FlexState label="description" block>
            <DatePicker className={field} kind="date" locale="ko-KR" label="공개일" defaultValue={date(10, 20)} description="오전 9시에 공개됩니다." />
          </FlexState>
        </FlexSection>

        <FlexSpec v={v} roles={mobile ? ["field-height", "field-radius", "sheet-radius", "sheet-inset"] : ["field-height", "field-radius", "field-inset"]} extra={[
          ["Popover 여백 · 반경", "16 · 12px", "D 현재 DDS 값 유지"],
          ["Popover 폭", "최대 24rem(384px)", "D 현재 DDS 값 유지"],
          ["날짜·이동 버튼", "최소 44px", "D 현재 DDS 값 유지"],
          ["트리거", v.variant === "current" ? "Button neutral weak" : isB ? "box(bg-neutral-weak) · 값 왼쪽" : "outline · 값 왼쪽", v.variant === "current" ? "현재 DDS 값 유지" : isB ? "C property 값 = box 조합" : "C A 문서 — Field 계열"],
          ...(isB ? [["컨테이너", "inline · Popover · Sheet 동등", "B M027–029 — inline은 Calendar export 필요"] as const] : []),
        ]} />

        {/* 열린 상태는 맨 끝 — 모바일 Sheet가 문서 아래를 덮으므로 치수표를 위에 둔다. */}
        <FlexSection
          title={mobile ? "열린 상태 · Sheet" : "열린 상태 · Popover"}
          note={
            <>
              {mobile
                ? "iframe 높이가 화면 높이가 아니라 Sheet 높이를 844px 화면의 90dvh(760px)로 고정해 보입니다. "
                : "Popover는 p16·r12 그대로입니다. "}
              {isB ? "inline 컨테이너는 Calendar가 공개 export가 아니라 현재 없음입니다." : "값 모델·검증은 컨테이너와 무관합니다."}
            </>
          }
        >
          <FlexState label="selected · 열림" block>
            <DatePicker className={field} kind="date" locale="ko-KR" label="마감일" defaultValue={date(10, 15)} defaultOpen />
            <FlexReserve height={mobile ? 780 : 470} />
          </FlexState>
        </FlexSection>
      </FlexPage>
    </PickerViewport>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
