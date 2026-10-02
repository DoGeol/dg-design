import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker, DateRangePicker } from "@dg-design/react";
import * as React from "react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/DatePicker", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const d = (month: number, day: number) => new CalendarDate(2026, month, day);
const dt = (month: number, day: number, hour: number, minute: number) => new CalendarDateTime(2026, month, day, hour, minute);

/** 열린 패널에서 문구가 같은 버튼을 한 번 눌러 오류 상태를 재현한다(오류는 적용 실패로만 나온다). */
function ClickInPanel({ children, text }: { children: React.ReactNode; text: string }) {
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      Array.from(document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')).find((b) => b.textContent === text)?.click();
    }, 200);
    return () => window.clearTimeout(id);
  }, [text]);
  return <>{children}</>;
}

/** 트리거(neutral weak)가 시안 칸 배경과 같은 색이라 실제 화면처럼 흰 표면 위에 올린다. */
function Surface({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 16, borderRadius: "var(--dds-radius-r2)", background: "var(--dds-color-bg-layer-default)", alignSelf: "stretch" }}>
      {children}
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="DatePicker" summary="닫힌 상태는 라벨과 neutral weak 버튼 하나이고, 누르면 직접 입력 필드와 달력이 든 패널이 열립니다. 모바일(48rem 미만)에서는 하단 Sheet로 열립니다.">
      <MockupSection title="DatePicker · kind" note="date는 날짜를 누르면 바로 확정되고, local-date-time은 적용을 눌러야 확정됩니다.">
        <MockupState label="date · empty"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={null} /></Surface></MockupState>
        <MockupState label="date · selected"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} /></Surface></MockupState>
        <MockupState label="local-date-time · selected"><Surface><DatePicker kind="local-date-time" locale="ko-KR" label="회의 시각" defaultValue={dt(10, 15, 14, 30)} /></Surface></MockupState>
      </MockupSection>

      <MockupSection title="DateRangePicker · kind" columns={2} note="시작과 종료를 모두 고른 뒤 적용을 눌러 확정합니다.">
        <MockupState label="date · range"><Surface><DateRangePicker kind="date" locale="ko-KR" label="숙박 기간" defaultValue={{ start: d(10, 15), end: d(10, 18) }} /></Surface></MockupState>
        <MockupState label="local-date-time · range"><Surface><DateRangePicker kind="local-date-time" locale="ko-KR" label="점검 시간"
            defaultValue={{ start: dt(10, 20, 1, 0), end: dt(10, 20, 5, 0) }} /></Surface></MockupState>
      </MockupSection>

      <MockupSection title="트리거 상태" columns={5} note="트리거는 Button neutral weak medium입니다.">
        <MockupState label="default"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} /></Surface></MockupState>
        <MockupState label="hover" force="hover"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} /></Surface></MockupState>
        <MockupState label="pressed" force="pressed"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} /></Surface></MockupState>
        <MockupState label="focus" force="focus"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} /></Surface></MockupState>
        <MockupState label="disabled"><Surface><DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} disabled /></Surface></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="예약 폼 · 설명 문구 포함">
          <Surface><div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <DatePicker kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)}
              description="방문 하루 전까지 변경할 수 있습니다." minValue={d(10, 5)} />
            <DateRangePicker kind="date" locale="ko-KR" label="숙박 기간" startLabel="체크인" endLabel="체크아웃"
              defaultValue={{ start: d(10, 15), end: d(10, 18) }} description="최대 14박까지 예약할 수 있습니다." />
          </div></Surface>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["라벨", "14px bold #252629 · 트리거와 간격 8px", "--dds-font-size-t4, --dds-dimension-x2"],
        ["트리거", "Button neutral weak medium · 높이 40px · radius 8px · 좌우 16px", "--dds-dimension-x10, --dds-radius-r2"],
        ["트리거 배경 / hover / pressed", "#F3F5F9 / #E5E8EB / #D2D4D7", "--dds-color-bg-neutral-weak(-hover/-pressed)"],
        ["트리거 disabled", "배경 #E5E8EB · 글자 #8A8C8F", "--dds-color-bg-disabled / fg-disabled"],
        ["설명 문구", "#6D6F72", "--dds-color-fg-neutral-weak"],
        ["패널 폭 단일 / 기간", "24rem(384px) / 43rem(688px), 화면 폭 - 2rem 이내", "—"],
        ["패널 패딩 · radius", "16px · 12px", "--dds-dimension-x4, --dds-radius-r3"],
        ["패널 그림자", "0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-shadow-overlay"],
        ["패널 구획 간격", "16px (입력 필드 · 달력 · 빠른 선택 · 버튼)", "--dds-dimension-x4"],
        ["직접 입력 필드", "TextField medium 40px · 필드 사이 12px", "--dds-dimension-x10, x3"],
        ["달력 이동 버튼", "44 × 44px · radius 8px · hover rgb(16 18 20 / .06) · 셰브론 16px", "--dds-radius-r2, --dds-color-bg-transparent-hover"],
        ["요일 머리", "높이 32px · 13px regular", "--dds-font-size-t3"],
        ["날짜 칸", "최소 44 × 44px · radius 8px", "--dds-radius-r2"],
        ["선택한 날짜", "배경 #1550A9 · 글자 #FFFFFF", "--dds-color-bg-brand-solid / fg-brand-contrast"],
        ["기간 사이 날짜", "같은 배경, radius 0 · 시작은 왼쪽만, 종료는 오른쪽만 8px", "--dds-radius-r2"],
        ["다른 달 날짜 / 선택 불가", "#6D6F72 / #8A8C8F", "--dds-color-fg-neutral-weak / fg-disabled"],
        ["날짜 focus", "2px #1550A9 outline, 안쪽 -2px", "--dds-color-stroke-focus-ring"],
        ["오류 문구", "#731115", "--dds-color-fg-critical"],
        ["하단 버튼", "지우기·취소 neutral weak, 적용 brand solid · 간격 8px", "--dds-dimension-x2"],
      ]} />
    </MockupPage>
  ),
};

export const OpenDate: StoryObj = {
  render: () => (
    <MockupPage title="DatePicker · 열린 패널 · date" summary="날짜를 누르면 바로 확정되고 패널이 닫힙니다. 10월 5일 이전은 고를 수 없습니다.">
      <MockupSection title="열린 상태 · 데스크톱" columns={1}>
        <MockupState label="open · kind=date · minValue 10월 5일 · 빠른 선택" minHeight={640}>
          <Surface>
            <DatePicker defaultOpen kind="date" locale="ko-KR" label="방문 날짜" defaultValue={d(10, 15)} minValue={d(10, 5)}
              presets={[
                { id: "sat-1", label: "10월 10일 토요일", getValue: () => d(10, 10) },
                { id: "sat-2", label: "10월 17일 토요일", getValue: () => d(10, 17) },
              ]} />
          </Surface>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};

export const OpenDateTime: StoryObj = {
  render: () => (
    <MockupPage title="DatePicker · 열린 패널 · local-date-time" summary="날짜와 시간을 따로 입력하고, 적용을 눌러야 확정합니다.">
      <MockupSection title="열린 상태 · 데스크톱" columns={1}>
        <MockupState label="open · kind=local-date-time" minHeight={680}>
          <Surface>
            <DatePicker defaultOpen kind="local-date-time" locale="ko-KR" label="회의 시각" defaultValue={dt(10, 15, 14, 30)} />
          </Surface>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};

export const OpenRange: StoryObj = {
  render: () => (
    <MockupPage title="DateRangePicker · 열린 패널" summary="데스크톱은 두 달을 나란히 보이고, 시작과 종료 사이를 같은 배경으로 잇습니다.">
      <MockupSection title="열린 상태 · 데스크톱" columns={1}>
        <MockupState label="open · kind=date · 10월 15일–18일 · 10월 24일 예약 마감" minHeight={640}>
          <Surface>
            <DateRangePicker defaultOpen kind="date" locale="ko-KR" label="숙박 기간" startLabel="체크인" endLabel="체크아웃"
              defaultValue={{ start: d(10, 15), end: d(10, 18) }}
              isDateUnavailable={(date) => date.month === 10 && date.day === 24} />
          </Surface>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};

export const OpenRangeError: StoryObj = {
  render: () => (
    <MockupPage title="DateRangePicker · 오류" summary="시작이나 종료가 비어 있는 채로 적용을 누르면 패널 안에 오류 문구를 보이고 닫지 않습니다.">
      <MockupSection title="열린 상태 · 적용 실패" columns={1}>
        <MockupState label="open · 빈 기간에서 적용 → incomplete-input" minHeight={680}>
          <Surface><ClickInPanel text="적용">
            <DateRangePicker defaultOpen kind="date" locale="ko-KR" label="숙박 기간" startLabel="체크인" endLabel="체크아웃"
              defaultValue={null} errorMessages={{ "incomplete-input": "체크인과 체크아웃 날짜를 모두 선택하십시오." }} />
          </ClickInPanel></Surface>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
