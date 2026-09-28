import { CalendarDate, CalendarDateTime, parseZonedDateTime } from "@internationalized/date";
import { DateRangePicker } from "@dg-design/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "DateRangePicker", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => <DateRangePicker kind="date" locale="ko-KR" label="여행 기간"
    startLabel="시작일" endLabel="종료일" startName="tripStart" endName="tripEnd"
    defaultValue={{ start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 10, 2) }}
    isDateUnavailable={(date) => date.month === 10 && date.day === 4}
    presets={[{ id: "week", label: "7일", getValue: () => ({
      start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 10, 3),
    }) }]} />,
};

export const LocalDateTimeRange: StoryObj<typeof meta> = {
  name: "Local date and time range",
  render: () => <DateRangePicker kind="local-date-time" locale="en-US" label="Event window"
    defaultValue={{
      start: new CalendarDateTime(2026, 9, 27, 9, 0),
      end: new CalendarDateTime(2026, 9, 27, 17, 0),
    }} />,
};

export const ZonedDateTimeRange: StoryObj<typeof meta> = {
  name: "Zoned date and time range",
  render: () => <DateRangePicker kind="zoned-date-time" locale="en-US" label="New York window"
    timeZone="America/New_York" defaultValue={{
      start: parseZonedDateTime("2026-11-01T01:15:00-04:00[America/New_York]"),
      end: parseZonedDateTime("2026-11-01T01:30:00-05:00[America/New_York]"),
    }} />,
};

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <div style={{ display: "grid", gap: 24, maxWidth: 600 }}>
    <DateRangePicker kind="date" locale="ko-KR" label="빈 기간" defaultValue={null} />
    <DateRangePicker kind="date" locale="ko-KR" label="선택한 기간" defaultValue={{
      start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 10, 2),
    }} />
    <DateRangePicker kind="local-date-time" locale="en-US" label="Timed range" defaultValue={{
      start: new CalendarDateTime(2026, 9, 27, 9, 0), end: new CalendarDateTime(2026, 9, 27, 17, 0),
    }} />
  </div>,
};
