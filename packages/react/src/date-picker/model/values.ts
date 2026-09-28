import {
  CalendarDateTime, parseDate, parseTime, toCalendarDateTime, toZoned,
  type CalendarDate, type ZonedDateTime,
} from "@internationalized/date";
import type {
  DatePickerKind, DatePickerResult, DatePickerValue, DatePickerValueMap,
} from "./types";

export function parseGregorianDate(text: string): DatePickerResult<CalendarDate> {
  if (!text) return { valid: false, error: { code: "incomplete-input" } };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return { valid: false, error: { code: "invalid-input" } };
  }
  try {
    return { valid: true, value: parseDate(text) };
  } catch {
    return { valid: false, error: { code: "invalid-input" } };
  }
}

export function parseGregorianMinuteDateTime(text: string): DatePickerResult<CalendarDateTime> {
  if (!text) return { valid: false, error: { code: "incomplete-input" } };
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/.exec(text);
  if (!match) return { valid: false, error: { code: "invalid-input" } };
  // parseDateTime accepts day zero; validate the date separately before constructing.
  const date = parseGregorianDate(match[1]!);
  if (!date.valid) return date;
  try {
    const time = parseTime(match[2]!);
    const value = date.value;
    return {
      valid: true,
      value: new CalendarDateTime(value.calendar, value.era, value.year, value.month,
        value.day, time.hour, time.minute),
    };
  } catch {
    return { valid: false, error: { code: "invalid-input" } };
  }
}

export function isValidTimeZone(timeZone: string | undefined): timeZone is string {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    // Intl also accepts fixed offsets; the picker contract requires a named zone.
    return !/^[+-]/.test(timeZone);
  } catch {
    return false;
  }
}

export function getZonedCandidates(
  local: CalendarDateTime, timeZone: string,
): readonly ZonedDateTime[] {
  return (["earlier", "later"] as const)
    .map((choice) => toZoned(local, timeZone, choice))
    .filter((value) => toCalendarDateTime(value).compare(local) === 0)
    .filter((value, index, all) => all.findIndex((other) => other.compare(value) === 0) === index);
}

export function resolveZonedDraft(
  local: CalendarDateTime, timeZone: string, preferredValue?: ZonedDateTime | null,
): DatePickerResult<ZonedDateTime> {
  if (!isValidTimeZone(timeZone)) return { valid: false, error: { code: "invalid-time-zone" } };
  const candidates = getZonedCandidates(local, timeZone);
  if (!candidates.length) return { valid: false, error: { code: "nonexistent-time" } };
  if (candidates.length === 1) return { valid: true, value: candidates[0]! };
  const preserved = preferredValue?.timeZone === timeZone
    ? candidates.find((candidate) => candidate.compare(preferredValue) === 0)
    : undefined;
  if (preserved) return { valid: true, value: preserved };
  return { valid: false, error: { code: "ambiguous-time" }, candidates };
}

export function parseDatePickerInput<K extends DatePickerKind>(
  kind: K, text: string, timeZone?: string, preferredValue?: DatePickerValue | null,
): DatePickerResult<DatePickerValueMap[K]>;
export function parseDatePickerInput(
  kind: DatePickerKind, text: string, timeZone?: string, preferredValue?: DatePickerValue | null,
): DatePickerResult<DatePickerValue> {
  if (kind === "date") return parseGregorianDate(text);
  const parsed = parseGregorianMinuteDateTime(text);
  if (!parsed.valid || kind === "local-date-time") return parsed;
  if (!timeZone) return { valid: false, error: { code: "invalid-time-zone" } };
  return resolveZonedDraft(parsed.value, timeZone,
    preferredValue && "timeZone" in preferredValue ? preferredValue : undefined);
}

export function serializeDatePickerValue(value: DatePickerValue | null): string {
  return value?.toString() ?? "";
}

export function getDatePickerState<T>(props: { value?: T | null; defaultValue?: T | null }) {
  const isControlled = Object.prototype.hasOwnProperty.call(props, "value");
  return { isControlled, value: (isControlled ? props.value : props.defaultValue) ?? null };
}
