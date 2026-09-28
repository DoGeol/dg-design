import { CalendarDate, CalendarDateTime, ZonedDateTime, parseZonedDateTime } from "@internationalized/date";
import { describe, expect, it } from "vitest";
import type { DatePickerProps, DateRangePickerProps } from "./types";
import {
  getDatePickerState,
  parseDatePickerInput,
  parseGregorianDate,
  parseGregorianMinuteDateTime,
  resolveZonedDraft,
  serializeDatePickerValue,
  validateDatePickerPreset,
  validateDatePickerRange,
  validateDatePickerValue,
} from "./index";

describe("DatePicker model", () => {
  it("rejects incomplete and normalized invalid dates before constructing values", () => {
    expect(parseGregorianDate("2024-02-29").valid).toBe(true);
    for (const input of ["2026-09-00", "2023-02-29", "2026-04-31", "2026-13-01", "2026-9-27", ""]) {
      expect(parseGregorianDate(input).valid, input).toBe(false);
    }
    for (const input of ["2026-09-00T12:00", "2026-09-27T24:00", "2026-09-27T12:60", "2026-09-27T12:30:01"]) {
      expect(parseGregorianMinuteDateTime(input).valid, input).toBe(false);
    }
  });

  it("distinguishes nonexistent and duplicate local times without adjustment", () => {
    const gap = resolveZonedDraft(new CalendarDateTime(2026, 3, 8, 2, 30), "America/New_York");
    expect(gap).toMatchObject({ valid: false, error: { code: "nonexistent-time" } });
    const overlap = resolveZonedDraft(new CalendarDateTime(2026, 11, 1, 1, 30), "America/New_York");
    expect(overlap).toMatchObject({ valid: false, error: { code: "ambiguous-time" } });
    if (overlap.valid) throw new Error("expected offset choice");
    expect(overlap.candidates).toHaveLength(2);
    expect(overlap.candidates![1]!.compare(overlap.candidates![0]!)).toBe(3_600_000);
    expect(resolveZonedDraft(new CalendarDateTime(2026, 11, 1, 1, 30), "America/New_York", overlap.candidates![1])).toMatchObject({
      valid: true, value: overlap.candidates![1],
    });
    expect(resolveZonedDraft(new CalendarDateTime(2026, 10, 4, 2, 15), "Australia/Lord_Howe"))
      .toMatchObject({ valid: false, error: { code: "nonexistent-time" } });
  });

  it("roundtrips an explicit overlapping offset and preserves the region", () => {
    const original = parseZonedDateTime("2026-11-01T01:30:00-05:00[America/New_York]");
    const parsed = parseDatePickerInput("zoned-date-time", "2026-11-01T01:30", "America/New_York", original);
    expect(parsed).toMatchObject({ valid: true, value: original });
    expect(serializeDatePickerValue(original)).toBe("2026-11-01T01:30:00-05:00[America/New_York]");
  });

  it("blocks a range containing an unavailable date and stops at year 9999", () => {
    const start = new CalendarDate(2026, 9, 1);
    const end = new CalendarDate(2026, 9, 7);
    expect(validateDatePickerRange("date", { start, end }, { isDateUnavailable: (day) => day.day === 4 }))
      .toMatchObject({ valid: false, error: { code: "unavailable-date", date: new CalendarDate(2026, 9, 4) } });
    expect(validateDatePickerRange("date", { start: end, end: start })).toMatchObject({
      valid: false, error: { code: "reversed-range" },
    });
    expect(validateDatePickerRange("date", {
      start: new CalendarDate(9999, 12, 31), end: new CalendarDate(9999, 12, 31),
    }, { isDateUnavailable: () => false }).valid).toBe(true);
  });

  it("checks minute precision, calendar, time zone and actual instant ordering", () => {
    expect(validateDatePickerValue("local-date-time", new CalendarDateTime(2026, 9, 27, 12, 30, 1)))
      .toMatchObject({ valid: false, error: { code: "unsupported-precision" } });
    const later = parseZonedDateTime("2026-11-01T01:15:00-05:00[America/New_York]");
    const earlier = parseZonedDateTime("2026-11-01T01:45:00-04:00[America/New_York]");
    expect(validateDatePickerRange("zoned-date-time", { start: earlier, end: later }, { timeZone: "America/New_York" }).valid).toBe(true);
    expect(validateDatePickerValue("zoned-date-time", later, { timeZone: "Asia/Seoul" }))
      .toMatchObject({ valid: false, error: { code: "time-zone-mismatch" } });
    expect(validateDatePickerValue("date", new CalendarDate(2026, 9, 27), { minValue: new CalendarDate(2026, 9, 28) }))
      .toMatchObject({ valid: false, error: { code: "before-minimum" } });
  });

  it("evaluates presets when clicked and keeps undefined controlled values empty", () => {
    let calls = 0;
    const preset = { id: "today", label: "Today", getValue: () => { calls += 1; return new CalendarDate(2026, 9, 27); } };
    expect(validateDatePickerPreset("date", preset).valid).toBe(true);
    expect(calls).toBe(1);
    expect(validateDatePickerPreset("date", preset, { maxValue: new CalendarDate(2026, 9, 26) }))
      .toMatchObject({ valid: false, error: { code: "invalid-preset", cause: "after-maximum" } });
    expect(getDatePickerState({ value: undefined, defaultValue: new CalendarDate(2020, 1, 1) }))
      .toEqual({ isControlled: true, value: null });
  });
});

// These assignments are checked by tsc and protect the public discriminated union.
function typeContract() {
  const date = new CalendarDate(2026, 9, 27);
  const local = new CalendarDateTime(2026, 9, 27, 10, 0);
  const zoned = parseZonedDateTime("2026-09-27T10:00:00+09:00[Asia/Seoul]");
  const valid: DatePickerProps = { kind: "date", value: date };
  const validRange: DateRangePickerProps = { kind: "zoned-date-time", timeZone: "Asia/Seoul", value: { start: zoned, end: zoned } };
  // @ts-expect-error A date-only picker cannot receive a local date-time value.
  const mixed: DatePickerProps = { kind: "date", value: local };
  // @ts-expect-error A zoned picker requires an IANA timeZone even when empty.
  const missingZone: DatePickerProps = { kind: "zoned-date-time", value: null };
  // @ts-expect-error Range endpoints must have the same value kind.
  const mixedRange: DateRangePickerProps = { kind: "date", value: { start: date, end: local } };
  return [valid, validRange, mixed, missingZone, mixedRange];
}
void typeContract;
