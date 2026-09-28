import type { DatePickerResult, DatePickerValue } from "../model/types";

export interface InputFormat {
  locale: string;
  hourCycle?: 12 | 24;
}

function formatter(format: InputFormat, time = false) {
  return new Intl.DateTimeFormat(format.locale, {
    calendar: "gregory", numberingSystem: "latn", timeZone: "UTC",
    ...(time
      ? { hour: "2-digit", minute: "2-digit", ...(format.hourCycle ? { hour12: format.hourCycle === 12 } : {}) }
      : { year: "numeric", month: "2-digit", day: "2-digit" }),
  });
}

function displayDate(value: DatePickerValue) {
  const date = new Date(0);
  date.setUTCFullYear(value.year, value.month - 1, value.day);
  date.setUTCHours("hour" in value ? value.hour : 0, "minute" in value ? value.minute : 0);
  return date;
}

export function formatDateInput(value: DatePickerValue | null, format: InputFormat) {
  return value ? formatter(format).formatToParts(displayDate(value)).map((part) =>
    part.type === "year" ? part.value.padStart(4, "0") : part.value).join("") : "";
}

export function formatTimeInput(value: DatePickerValue | null, format: InputFormat) {
  return value && "hour" in value ? formatter(format, true).format(displayDate(value)) : "";
}

export function dateInputPlaceholder(format: InputFormat) {
  return formatter(format).formatToParts(new Date(Date.UTC(2006, 10, 22))).map((part) => {
    if (part.type === "year") return "YYYY";
    if (part.type === "month") return "MM";
    if (part.type === "day") return "DD";
    return part.value;
  }).join("");
}

function incomplete(): DatePickerResult<string> {
  return { valid: false, error: { code: "incomplete-input" } };
}
function invalid(): DatePickerResult<string> {
  return { valid: false, error: { code: "invalid-input" } };
}

/** Converts locale order to ISO; the model remains responsible for date validity. */
export function normalizeDateInput(text: string, format: InputFormat): DatePickerResult<string> {
  const trimmed = text.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return { valid: true, value: trimmed };
  if (!/^[\d\s./-]*$/.test(trimmed)) return invalid();
  const values = trimmed.match(/\d+/g) ?? [];
  if (values.length < 3) return incomplete();
  if (values.length > 3) return invalid();
  const order = formatter(format).formatToParts(new Date(Date.UTC(2006, 10, 22)))
    .filter((part) => ["year", "month", "day"].includes(part.type));
  const parts = Object.fromEntries(order.map((part, index) => [part.type, values[index]!]));
  if (parts.year!.length < 4) return incomplete();
  if (parts.year!.length !== 4) return invalid();
  return { valid: true, value: `${parts.year}-${parts.month!.padStart(2, "0")}-${parts.day!.padStart(2, "0")}` };
}

export function normalizeTimeInput(text: string, format: InputFormat): DatePickerResult<string> {
  const timeFormatter = formatter(format, true);
  const usesPeriod = timeFormatter.resolvedOptions().hour12;
  let input = text.trim();
  let period: number | undefined;
  if (usesPeriod) {
    for (const hour of [0, 12]) {
      const token = timeFormatter.formatToParts(new Date(Date.UTC(2000, 0, 1, hour)))
        .find((part) => part.type === "dayPeriod")?.value;
      if (token && input.toLocaleLowerCase(format.locale).includes(token.toLocaleLowerCase(format.locale))) {
        period = hour;
        const index = input.toLocaleLowerCase(format.locale).indexOf(token.toLocaleLowerCase(format.locale));
        input = `${input.slice(0, index)}${input.slice(index + token.length)}`.trim();
        break;
      }
    }
    if (period === undefined) return /^[\d\s:]*$/.test(input) ? incomplete() : invalid();
  }
  const match = /^(\d{1,2}):(\d{2})$/.exec(input);
  if (!match) return /^[\d\s:]*$/.test(input) && input.length < 5 ? incomplete() : invalid();
  let hour = Number(match[1]);
  if (usesPeriod) {
    if (hour < 1 || hour > 12) return invalid();
    hour = hour % 12 + period!;
  }
  return { valid: true, value: `${String(hour).padStart(2, "0")}:${match[2]}` };
}

export function timeInputPlaceholder(format: InputFormat) {
  return formatter(format, true).format(new Date(Date.UTC(2000, 0, 1, 13, 30)));
}

export function formatOffset(offset: number) {
  const minutes = Math.abs(offset / 60_000);
  return `UTC${offset < 0 ? "−" : "+"}${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
