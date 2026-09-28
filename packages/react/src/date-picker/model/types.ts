import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";
import type { ReactNode } from "react";

export interface DatePickerValueMap {
  date: CalendarDate;
  "local-date-time": CalendarDateTime;
  "zoned-date-time": ZonedDateTime;
}
export type DatePickerKind = keyof DatePickerValueMap;
export type DatePickerValue = DatePickerValueMap[DatePickerKind];
export interface DatePickerRange<T extends DatePickerValue = DatePickerValue> {
  start: T;
  end: T;
}
export interface DatePickerPreset<T> {
  id: string;
  label: string;
  getValue: () => T;
}
export type DatePickerErrorCode =
  | "required" | "invalid-input" | "incomplete-input" | "invalid-value-kind"
  | "unsupported-calendar" | "unsupported-precision" | "invalid-time-zone"
  | "time-zone-mismatch" | "nonexistent-time" | "ambiguous-time"
  | "before-minimum" | "after-maximum" | "unavailable-date"
  | "reversed-range" | "invalid-constraint" | "invalid-preset";
export interface DatePickerValidationError {
  code: DatePickerErrorCode;
  endpoint?: "start" | "end";
  date?: CalendarDate;
  cause?: DatePickerErrorCode;
}
export type DatePickerResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: DatePickerValidationError; candidates?: readonly ZonedDateTime[] };
export interface DatePickerConstraints<T extends DatePickerValue = DatePickerValue> {
  minValue?: T;
  maxValue?: T;
  timeZone?: string;
  required?: boolean;
  isDateUnavailable?: (date: CalendarDate) => boolean;
}
export type DatePickerStateProps<T> = {
  value: T | null | undefined;
  defaultValue?: never;
  onValueChange?: (value: T | null) => void;
} | {
  value?: never;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
};
export interface DatePickerCommonProps {
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  locale?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  errorMessages?: Partial<Record<DatePickerErrorCode, string>>;
}
type KindProps<K extends DatePickerKind, T> = DatePickerCommonProps &
  Omit<DatePickerConstraints<DatePickerValueMap[K]>, "timeZone"> &
  DatePickerStateProps<T> & {
    kind: K;
    presets?: readonly DatePickerPreset<T>[];
  } & (K extends "zoned-date-time" ? { timeZone: string } : { timeZone?: never });
export type DatePickerProps = {
  [K in DatePickerKind]: KindProps<K, DatePickerValueMap[K]> & { name?: string };
}[DatePickerKind];
export type DateRangePickerProps = {
  [K in DatePickerKind]: KindProps<K, DatePickerRange<DatePickerValueMap[K]>> & {
    startName?: string;
    endName?: string;
    startId?: string;
    endId?: string;
    startLabel?: string;
    endLabel?: string;
  };
}[DatePickerKind];
