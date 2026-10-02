import { CalendarDate, CalendarDateTime, ZonedDateTime, getLocalTimeZone, toCalendarDate, today } from "@internationalized/date";
import * as React from "react";

import { useControllableState } from "../../internal/use-controllable-state";
import {
  getDatePickerState, resolveZonedDraft, serializeDatePickerValue, validateDatePickerPreset,
  validateDatePickerRange, validateDatePickerValue,
} from "../model";
import type {
  DatePickerConstraints, DatePickerKind, DatePickerPreset, DatePickerProps, DatePickerRange,
  DatePickerResult, DatePickerValidationError, DatePickerValue, DateRangePickerProps,
} from "../model";

export type Selection = DatePickerValue | DatePickerRange | null;
export type PickerProps = DatePickerProps | DateRangePickerProps;

export function isRange(value: Selection): value is DatePickerRange {
  return value !== null && "start" in value && "end" in value;
}

function selectionKey(value: Selection) {
  return isRange(value) ? JSON.stringify([serializeDatePickerValue(value.start), serializeDatePickerValue(value.end)])
    : serializeDatePickerValue(value);
}

function withCalendarDate(kind: DatePickerKind, date: CalendarDate, previous: DatePickerValue | null,
  timeZone?: string): DatePickerResult<DatePickerValue> {
  if (kind === "date") return { valid: true, value: date };
  const hour = previous && "hour" in previous ? previous.hour : 0;
  const minute = previous && "minute" in previous ? previous.minute : 0;
  const local = new CalendarDateTime(date.calendar, date.era, date.year, date.month, date.day, hour, minute);
  if (kind === "local-date-time") return { valid: true, value: local };
  return resolveZonedDraft(local, timeZone ?? "", previous instanceof ZonedDateTime ? previous : null);
}

export function usePickerState(props: PickerProps, range: boolean) {
  const initial = getDatePickerState(props as { value?: Selection; defaultValue?: Selection });
  const [committed, setCommitted] = useControllableState<Selection>({
    value: initial.isControlled ? initial.value : undefined,
    controlled: initial.isControlled,
    defaultValue: initial.isControlled ? null : initial.value,
    onChange: props.onValueChange as (value: Selection) => void,
  });
  const [open, setOpen] = React.useState(false);
  const [start, setStart] = React.useState<DatePickerValue | null>(null);
  const [end, setEnd] = React.useState<DatePickerValue | null>(null);
  const [startError, setStartError] = React.useState<DatePickerValidationError | null>(null);
  const [endError, setEndError] = React.useState<DatePickerValidationError | null>(null);
  const [generalError, setGeneralError] = React.useState<DatePickerValidationError | null>(null);
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate | null>(null);
  const [resetKey, setResetKey] = React.useState(0);
  const [offsetChoices, setOffsetChoices] = React.useState<readonly {
    endpoint: "start" | "end"; values: readonly ZonedDateTime[];
  }[]>([]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const selectionId = selectionKey(committed);
  const lastSelectionIdRef = React.useRef(selectionId);

  const restoreDraft = React.useCallback((value: Selection) => {
    setStart(isRange(value) ? value.start : value);
    setEnd(isRange(value) ? value.end : null);
    setStartError(null);
    setEndError(null);
    setGeneralError(null);
    setOffsetChoices([]);
    setResetKey((previous) => previous + 1);
  }, []);

  React.useEffect(() => {
    if (selectionId === lastSelectionIdRef.current) return;
    lastSelectionIdRef.current = selectionId;
    if (open) restoreDraft(committed);
  }, [selectionId, committed, open, restoreDraft]);

  const handleOpenChange = (next: boolean) => {
    restoreDraft(committed);
    if (next) {
      const currentDate = isRange(committed) ? committed.start : committed;
      setFocusedDate(currentDate ? toCalendarDate(currentDate)
        : today(props.kind === "zoned-date-time" ? props.timeZone : getLocalTimeZone()));
    }
    setOpen(next);
  };

  const constraints: DatePickerConstraints = {
    minValue: props.minValue, maxValue: props.maxValue,
    isDateUnavailable: props.isDateUnavailable, required: props.required,
    timeZone: props.kind === "zoned-date-time" ? props.timeZone : undefined,
  };

  const commit = (value: Selection) => {
    const result = range
      ? validateDatePickerRange(props.kind, value as DatePickerRange | null, constraints)
      : validateDatePickerValue(props.kind, value as DatePickerValue | null, constraints);
    if (!result.valid) { setGeneralError(result.error); return; }
    if (selectionKey(committed) !== selectionKey(value)) setCommitted(value);
    setOpen(false);
    restoreDraft(value);
    queueMicrotask(() => triggerRef.current?.focus());
  };

  const apply = () => {
    if (startError || endError || offsetChoices.length) {
      setGeneralError(startError ?? endError ?? { code: "ambiguous-time" });
      return;
    }
    if (range && (!start || !end)) {
      setGeneralError({ code: "incomplete-input", endpoint: !start ? "start" : "end" });
      return;
    }
    commit(range ? { start: start!, end: end! } : start);
  };

  const setCalendarValue = (date: CalendarDate, endpoint: "start" | "end") => {
    const previous = endpoint === "start" ? start : end;
    const result = withCalendarDate(props.kind, date, previous,
      props.kind === "zoned-date-time" ? props.timeZone : undefined);
    if (result.valid) {
      if (endpoint === "start") { setStart(result.value); setStartError(null); }
      else { setEnd(result.value); setEndError(null); }
      setOffsetChoices((previousChoices) => previousChoices.filter((choice) => choice.endpoint !== endpoint));
      if (!range && props.kind === "date") commit(result.value);
    } else {
      if (endpoint === "start") setStartError(result.error); else setEndError(result.error);
      if (result.candidates?.length) setOffsetChoices((previousChoices) => [
        ...previousChoices.filter((choice) => choice.endpoint !== endpoint),
        { endpoint, values: result.candidates! },
      ]);
    }
  };

  const fieldChange = (endpoint: "start" | "end", result: DatePickerResult<DatePickerValue | null>) => {
    if (endpoint === "start") {
      setStartError(result.valid ? null : result.error);
      if (result.valid) setStart(result.value);
    } else {
      setEndError(result.valid ? null : result.error);
      if (result.valid) setEnd(result.value);
    }
    if (result.valid) {
      setGeneralError(null);
      setOffsetChoices((previousChoices) => previousChoices.filter((choice) => choice.endpoint !== endpoint));
    }
  };

  const handlePreset = (preset: DatePickerPreset<Selection>) => {
    const result = range
      ? validateDatePickerPreset(props.kind, preset as DatePickerPreset<DatePickerRange>, constraints, true)
      : validateDatePickerPreset(props.kind, preset as DatePickerPreset<DatePickerValue>, constraints);
    if (!result.valid) { setGeneralError(result.error); return; }
    const value = result.value;
    setStart(isRange(value) ? value.start : value);
    setEnd(isRange(value) ? value.end : null);
    setGeneralError(null); setStartError(null); setEndError(null); setOffsetChoices([]);
    if (!range && props.kind === "date") commit(value);
  };

  const clear = () => {
    if (range || props.kind !== "date") {
      setStart(null); setEnd(null); setGeneralError(null); setStartError(null); setEndError(null);
      setOffsetChoices([]); setResetKey((key) => key + 1);
    } else commit(null);
  };

  const cancel = () => { triggerRef.current?.focus(); handleOpenChange(false); };
  const chooseOffset = (endpoint: "start" | "end", candidate: ZonedDateTime) => {
    if (endpoint === "start") { setStart(candidate); setStartError(null); }
    else { setEnd(candidate); setEndError(null); }
    setOffsetChoices((previousChoices) => previousChoices.filter((item) => item.endpoint !== endpoint));
    setGeneralError(null);
  };

  return {
    committed, open, start, end, focusedDate, setFocusedDate, resetKey, offsetChoices,
    constraints, triggerRef, error: generalError ?? startError ?? endError,
    startError, endError, handleOpenChange, commit, apply, fieldChange, handlePreset, clear, cancel, chooseOffset,
    onCalendarDateChange: (date: CalendarDate) => { setGeneralError(null); setCalendarValue(date, "start"); },
    onCalendarRangeChange: (dates: { start: CalendarDate; end: CalendarDate }) => {
      setGeneralError(null); setCalendarValue(dates.start, "start"); setCalendarValue(dates.end, "end");
    },
  };
}
