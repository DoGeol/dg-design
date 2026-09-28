import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { describe, expect, it } from "vitest";
import { dateInputPlaceholder, formatDateInput, normalizeDateInput, normalizeTimeInput } from "./format";

describe("DatePicker input formats", () => {
  it("uses locale date order while accepting canonical ISO", () => {
    const date = new CalendarDate(2026, 9, 27);
    expect(formatDateInput(date, { locale: "en-US" })).toContain("09/27/2026");
    expect(formatDateInput(date, { locale: "ko-KR" })).toContain("2026");
    expect(normalizeDateInput("09/27/2026", { locale: "en-US" })).toEqual({ valid: true, value: "2026-09-27" });
    expect(normalizeDateInput("2026. 09. 27.", { locale: "ko-KR" })).toEqual({ valid: true, value: "2026-09-27" });
    expect(normalizeDateInput("2026-09-27", { locale: "en-US" })).toEqual({ valid: true, value: "2026-09-27" });
    expect(dateInputPlaceholder({ locale: "en-US" })).toContain("YYYY");
  });

  it("preserves incomplete inputs and handles 12/24 hour formats", () => {
    expect(normalizeDateInput("09/27", { locale: "en-US" })).toMatchObject({ valid: false, error: { code: "incomplete-input" } });
    expect(normalizeTimeInput("01:30 PM", { locale: "en-US", hourCycle: 12 })).toEqual({ valid: true, value: "13:30" });
    expect(normalizeTimeInput("13:30", { locale: "en-US", hourCycle: 24 })).toEqual({ valid: true, value: "13:30" });
    expect(normalizeTimeInput("25:90", { locale: "en-US", hourCycle: 24 })).toEqual({ valid: true, value: "25:90" });
    expect(formatDateInput(new CalendarDateTime(2026, 9, 27, 12, 30), { locale: "en-US" })).toContain("09/27/2026");
  });
});
