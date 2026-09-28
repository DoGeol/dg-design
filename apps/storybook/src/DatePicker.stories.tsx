import { CalendarDate, CalendarDateTime, parseZonedDateTime } from "@internationalized/date";
import { DatePicker } from "@dg-design/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "DatePicker", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => <DatePicker kind="date" locale="ko-KR" label="방문 날짜"
    defaultValue={new CalendarDate(2026, 9, 27)} name="visitDate"
    minValue={new CalendarDate(2026, 9, 1)} maxValue={new CalendarDate(2026, 10, 31)}
    presets={[{ id: "today", label: "9월 27일", getValue: () => new CalendarDate(2026, 9, 27) }]} />,
};

export const LocalDateTime: StoryObj<typeof meta> = {
  name: "Local date and time",
  render: () => <DatePicker kind="local-date-time" locale="en-US" label="Meeting time"
    defaultValue={new CalendarDateTime(2026, 9, 27, 10, 30)} name="meetingTime" />,
};

export const ZonedDateTime: StoryObj<typeof meta> = {
  name: "Zoned date and time",
  render: () => <DatePicker kind="zoned-date-time" locale="en-US" label="New York meeting"
    timeZone="America/New_York" defaultValue={parseZonedDateTime("2026-11-01T01:30:00-05:00[America/New_York]")} />,
};

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <div style={{ display: "grid", gap: 24, maxWidth: 600 }}>
    <DatePicker kind="date" locale="ko-KR" label="빈 날짜" defaultValue={null} />
    <DatePicker kind="date" locale="ko-KR" label="선택한 날짜" defaultValue={new CalendarDate(2026, 9, 27)} />
    <DatePicker kind="local-date-time" locale="en-US" label="Date and time" defaultValue={new CalendarDateTime(2026, 9, 27, 10, 30)} />
    <DatePicker kind="date" locale="en-US" label="Disabled date" defaultValue={null} disabled />
  </div>,
};
