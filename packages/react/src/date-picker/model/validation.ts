import {
  CalendarDate, CalendarDateTime, ZonedDateTime, parseZonedDateTime, toCalendarDate,
} from "@internationalized/date";
import type {
  DatePickerConstraints, DatePickerKind, DatePickerPreset, DatePickerRange,
  DatePickerResult, DatePickerValidationError, DatePickerValue, DatePickerValueMap,
} from "./types";
import { isValidTimeZone } from "./values";

function invalid(code: DatePickerValidationError["code"]): DatePickerResult<never> {
  return { valid: false, error: { code } };
}

export function validateDatePickerValueShape(
  kind: DatePickerKind, value: DatePickerValue, timeZone?: string,
): DatePickerValidationError | null {
  const constructor = { date: CalendarDate, "local-date-time": CalendarDateTime,
    "zoned-date-time": ZonedDateTime }[kind];
  if (!(value instanceof constructor)) return { code: "invalid-value-kind" };
  if (value.calendar.identifier !== "gregory") return { code: "unsupported-calendar" };
  if (!value.calendar.getEras().includes(value.era) ||
    !Number.isInteger(value.year) || value.year < 1 || value.year > 9999 ||
    !Number.isInteger(value.month) || value.month < 1 || value.month > 12 ||
    !Number.isInteger(value.day) || value.day < 1 || value.day > value.calendar.getDaysInMonth(value)) {
    return { code: "invalid-input" };
  }
  if ("hour" in value) {
    if (value.second !== 0 || value.millisecond !== 0) return { code: "unsupported-precision" };
    if (!Number.isInteger(value.hour) || value.hour < 0 || value.hour > 23 ||
      !Number.isInteger(value.minute) || value.minute < 0 || value.minute > 59) {
      return { code: "invalid-input" };
    }
  }
  if (value instanceof ZonedDateTime) {
    if (!isValidTimeZone(timeZone)) return { code: "invalid-time-zone" };
    if (value.timeZone !== timeZone) return { code: "time-zone-mismatch" };
    try {
      // An explicit offset validates the instant without auto-selecting an overlap occurrence.
      parseZonedDateTime(value.toString(), "reject");
    } catch {
      return { code: "invalid-input" };
    }
  }
  return null;
}

function validateConstraints(
  kind: DatePickerKind, constraints: DatePickerConstraints,
): DatePickerValidationError | null {
  if (kind === "zoned-date-time" && !isValidTimeZone(constraints.timeZone)) {
    return { code: "invalid-time-zone" };
  }
  for (const bound of [constraints.minValue, constraints.maxValue]) {
    if (!bound) continue;
    const error = validateDatePickerValueShape(kind, bound, constraints.timeZone);
    if (error) return { code: "invalid-constraint", cause: error.code };
  }
  if (constraints.minValue && constraints.maxValue &&
    constraints.minValue.compare(constraints.maxValue) > 0) {
    return { code: "invalid-constraint", cause: "reversed-range" };
  }
  return null;
}

export function validateDatePickerValue<K extends DatePickerKind>(
  kind: K, value: DatePickerValueMap[K] | null,
  constraints: DatePickerConstraints<DatePickerValueMap[K]> = {},
): DatePickerResult<DatePickerValueMap[K] | null> {
  const constraintError = validateConstraints(kind, constraints);
  if (constraintError) return { valid: false, error: constraintError };
  if (value === null) return constraints.required ? invalid("required") : { valid: true, value };
  const error = validateDatePickerValueShape(kind, value, constraints.timeZone);
  if (error) return { valid: false, error };
  if (constraints.minValue && value.compare(constraints.minValue) < 0) return invalid("before-minimum");
  if (constraints.maxValue && value.compare(constraints.maxValue) > 0) return invalid("after-maximum");
  const date = toCalendarDate(value);
  if (constraints.isDateUnavailable?.(date)) {
    return { valid: false, error: { code: "unavailable-date", date } };
  }
  return { valid: true, value };
}

export function validateDatePickerRange<K extends DatePickerKind>(
  kind: K, value: DatePickerRange<DatePickerValueMap[K]> | null,
  constraints: DatePickerConstraints<DatePickerValueMap[K]> = {},
): DatePickerResult<DatePickerRange<DatePickerValueMap[K]> | null> {
  const constraintError = validateConstraints(kind, constraints);
  if (constraintError) return { valid: false, error: constraintError };
  if (value === null) return constraints.required ? invalid("required") : { valid: true, value };
  // Check bounds and shapes first; the inclusive scan below checks unavailability only once per day.
  const { isDateUnavailable, ...endpointConstraints } = constraints;
  for (const endpoint of ["start", "end"] as const) {
    if (!value[endpoint]) return { valid: false, error: { code: "incomplete-input", endpoint } };
    const result = validateDatePickerValue(kind, value[endpoint], endpointConstraints);
    if (!result.valid) return { ...result, error: { ...result.error, endpoint } };
  }
  if (value.start.compare(value.end) > 0) return invalid("reversed-range");
  if (isDateUnavailable) {
    const end = toCalendarDate(value.end);
    for (let date = toCalendarDate(value.start); ; date = date.add({ days: 1 })) {
      if (isDateUnavailable(date)) return { valid: false, error: { code: "unavailable-date", date } };
      // CalendarDate saturates at its maximum year; exit before incrementing the terminal day.
      if (date.compare(end) >= 0) break;
    }
  }
  return { valid: true, value };
}

export function validateDatePickerPreset<K extends DatePickerKind>(
  kind: K, preset: DatePickerPreset<DatePickerValueMap[K]>,
  constraints?: DatePickerConstraints<DatePickerValueMap[K]>,
): DatePickerResult<DatePickerValueMap[K]>;
export function validateDatePickerPreset<K extends DatePickerKind>(
  kind: K, preset: DatePickerPreset<DatePickerRange<DatePickerValueMap[K]>>,
  constraints: DatePickerConstraints<DatePickerValueMap[K]> | undefined, range: true,
): DatePickerResult<DatePickerRange<DatePickerValueMap[K]>>;
export function validateDatePickerPreset(
  kind: DatePickerKind, preset: DatePickerPreset<DatePickerValue | DatePickerRange>,
  constraints: DatePickerConstraints = {}, range = false,
): DatePickerResult<DatePickerValue | DatePickerRange> {
  try {
    const value = preset.getValue();
    if (value == null) return invalid("invalid-preset");
    const result = range
      ? validateDatePickerRange(kind, value as DatePickerRange, constraints)
      : validateDatePickerValue(kind, value as DatePickerValue, constraints);
    if (!result.valid) return { ...result, error: { ...result.error, cause: result.error.code, code: "invalid-preset" } };
    return { valid: true, value };
  } catch {
    return invalid("invalid-preset");
  }
}
