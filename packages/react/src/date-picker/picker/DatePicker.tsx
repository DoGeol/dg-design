import "./date-picker.css";

import { CalendarDate, CalendarDateTime, ZonedDateTime, getLocalTimeZone, toCalendarDate, today } from "@internationalized/date";
import * as React from "react";

import { Button } from "../../button/Button";
import { Popover } from "../../popover/Popover";
import { Sheet } from "../../sheet/Sheet";
import { useControllableState } from "../../internal/use-controllable-state";
import { DatePickerCalendar, DateRangePickerCalendar } from "../calendar";
import { DatePickerField } from "../field";
import {
  getDatePickerState, resolveZonedDraft, serializeDatePickerValue, validateDatePickerPreset,
  validateDatePickerRange, validateDatePickerValue,
} from "../model";
import type {
  DatePickerConstraints, DatePickerErrorCode, DatePickerKind, DatePickerPreset,
  DatePickerProps, DatePickerRange, DatePickerResult, DatePickerValidationError, DatePickerValue,
  DateRangePickerProps,
} from "../model";

type Selection = DatePickerValue | DatePickerRange | null;
type PickerProps = DatePickerProps | DateRangePickerProps;

function isRange(value: Selection): value is DatePickerRange {
  return value !== null && "start" in value && "end" in value;
}

function selectionKey(value: Selection) {
  return isRange(value) ? JSON.stringify([serializeDatePickerValue(value.start), serializeDatePickerValue(value.end)])
    : serializeDatePickerValue(value);
}

function errorText(error: DatePickerValidationError | null, props: PickerProps): string | null {
  if (!error) return null;
  const custom = props.errorMessages?.[error.code];
  if (custom) return custom;
  const ko = (props.locale ?? "en-US").toLowerCase().startsWith("ko");
  if (error.code === "invalid-preset" && error.cause && error.cause !== "invalid-preset") {
    const reason = errorText({ code: error.cause, date: error.date }, props);
    return ko ? `빠른 선택을 사용할 수 없습니다: ${reason}` : `Preset unavailable: ${reason}`;
  }
  const names: Partial<Record<DatePickerErrorCode, [string, string]>> = {
    required: ["날짜를 선택하세요.", "Choose a date."],
    "incomplete-input": ["시작과 종료를 모두 입력하세요.", "Enter both start and end."],
    "invalid-input": ["올바른 날짜와 시간을 입력하세요.", "Enter a valid date and time."],
    "before-minimum": ["허용된 시작 시각보다 빠릅니다.", "Before the earliest allowed value."],
    "after-maximum": ["허용된 종료 시각보다 늦습니다.", "After the latest allowed value."],
    "unavailable-date": ["선택할 수 없는 날짜가 포함돼 있습니다.", "The range includes an unavailable date."],
    "reversed-range": ["종료는 시작보다 빠를 수 없습니다.", "End must be after start."],
    "nonexistent-time": ["이 시간대에 존재하지 않는 시각입니다.", "This time does not exist in this time zone."],
    "ambiguous-time": ["두 시각 중 오프셋을 고르세요.", "Choose a time zone offset."],
    "invalid-preset": ["이 빠른 선택은 사용할 수 없습니다.", "This preset cannot be selected."],
  };
  const message = names[error.code]?.[ko ? 0 : 1] ?? (ko ? "선택할 수 없는 값입니다." : "This value cannot be selected.");
  return error.code === "unavailable-date" && error.date
    ? `${message} (${formatValue(error.date, "date", props.locale ?? "en-US")})` : message;
}

function formatValue(value: DatePickerValue, kind: DatePickerKind, locale: string, timeZone?: string) {
  try {
    if (kind === "zoned-date-time" && (!(value instanceof ZonedDateTime) || value.timeZone !== timeZone)) {
      return value.toString();
    }
    const date = value instanceof ZonedDateTime ? value.toDate() : value.toDate("UTC");
    const options: Intl.DateTimeFormatOptions = kind === "date"
      ? { dateStyle: "medium", timeZone: "UTC" }
      : { dateStyle: "medium", timeStyle: "short", timeZone: kind === "zoned-date-time" ? timeZone : "UTC" };
    const formatted = new Intl.DateTimeFormat(locale, options).format(date);
    return kind === "zoned-date-time" ? `${formatted} (${timeZone})` : formatted;
  } catch {
    return value.toString();
  }
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

function useMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(max-width: 47.99rem)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile;
}

function Picker({ props, range }: { props: PickerProps; range: boolean }) {
  const locale = props.locale ?? "en-US";
  const ko = locale.toLowerCase().startsWith("ko");
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
  const mobile = useMobile();
  const generatedId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const labelId = `${props.id ?? generatedId}-label`;
  const triggerId = `${props.id ?? generatedId}-trigger`;
  const title = typeof props.label === "string" ? props.label : ko ? "날짜 선택" : "Choose date";
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

  const summary = committed === null ? (locale.startsWith("ko") ? "선택 안 함" : "No date selected")
    : isRange(committed)
      ? `${formatValue(committed.start, props.kind, locale, constraints.timeZone)} – ${formatValue(committed.end, props.kind, locale, constraints.timeZone)}`
      : formatValue(committed, props.kind, locale, constraints.timeZone);
  const error = generalError ?? startError ?? endError;
  const panel = (
    <div className="dds-date-picker__body">
      <div className="dds-date-picker__fields" role={range ? "group" : undefined}
        aria-label={range ? title : undefined}>
        <DatePickerField kind={props.kind} value={start} locale={locale}
          timeZone={constraints.timeZone} label={range ? ("startLabel" in props ? props.startLabel ?? (ko ? "시작" : "Start") : ko ? "시작" : "Start") : title}
          id={range && "startId" in props ? props.startId : props.id}
          errorMessages={props.errorMessages} disabled={props.disabled} readOnly={props.readOnly}
          required={props.required} resetKey={resetKey}
          commitOnBlur={!range && props.kind === "date"}
          onDraftChange={(result) => fieldChange("start", result)}
          onCommit={(value) => { if (!range && props.kind === "date") commit(value); }} />
        {range && <DatePickerField kind={props.kind} value={end} locale={locale}
          timeZone={constraints.timeZone} label={"endLabel" in props ? props.endLabel ?? (ko ? "종료" : "End") : ko ? "종료" : "End"}
          id={"endId" in props ? props.endId : undefined}
          errorMessages={props.errorMessages} disabled={props.disabled} readOnly={props.readOnly}
          required={props.required} resetKey={resetKey}
          onDraftChange={(result) => fieldChange("end", result)} />}
      </div>
      <div className="dds-date-picker__calendar-scroll">
        {range
          ? <DateRangePickerCalendar locale={locale} ariaLabel={title}
              visibleMonths={mobile ? 1 : 2} focusedValue={focusedDate}
              onFocusChange={setFocusedDate}
              value={start && end ? { start: toCalendarDate(start), end: toCalendarDate(end) } : null}
              onChange={(dates) => { setGeneralError(null); setCalendarValue(dates.start, "start"); setCalendarValue(dates.end, "end"); }}
              minValue={props.minValue ? toCalendarDate(props.minValue) : undefined}
              maxValue={props.maxValue ? toCalendarDate(props.maxValue) : undefined}
              isDateUnavailable={props.isDateUnavailable} isDisabled={props.disabled} isReadOnly={props.readOnly} />
          : <DatePickerCalendar locale={locale} ariaLabel={title}
              focusedValue={focusedDate} onFocusChange={setFocusedDate}
              value={start ? toCalendarDate(start) : null}
              onChange={(date) => { setGeneralError(null); setCalendarValue(date, "start"); }}
              minValue={props.minValue ? toCalendarDate(props.minValue) : undefined}
              maxValue={props.maxValue ? toCalendarDate(props.maxValue) : undefined}
              isDateUnavailable={props.isDateUnavailable} isDisabled={props.disabled} isReadOnly={props.readOnly} />}
      </div>
      {Boolean(props.presets?.length) && <div className="dds-date-picker__presets" aria-label={locale.startsWith("ko") ? "빠른 선택" : "Quick selections"}>
        {props.presets?.map((preset) => <Button key={preset.id} type="button" variant="weak" intent="neutral"
          disabled={props.disabled || props.readOnly} onClick={() => handlePreset(preset as DatePickerPreset<Selection>)}>{preset.label}</Button>)}
      </div>}
      {offsetChoices.map((choice) => <fieldset key={choice.endpoint} className="dds-date-picker__offsets">
        <legend>{locale.startsWith("ko") ? `${choice.endpoint === "start" ? "시작" : "종료"} 시간 오프셋 선택`
          : `Choose ${choice.endpoint} time zone offset`}</legend>
        {choice.values.map((candidate) => <label key={candidate.toString()}>
          <input type="radio" name={`${triggerId}-${choice.endpoint}-offset`} onChange={() => {
            if (choice.endpoint === "start") { setStart(candidate); setStartError(null); }
            else { setEnd(candidate); setEndError(null); }
            setOffsetChoices((previousChoices) => previousChoices.filter((item) => item.endpoint !== choice.endpoint));
            setGeneralError(null);
          }} />{candidate.toString()}
        </label>)}
      </fieldset>)}
      {error && <p className="dds-date-picker__error" role="alert">{errorText(error, props)}</p>}
      <div className="dds-date-picker__actions">
        <Button type="button" variant="weak" intent="neutral" disabled={props.disabled || props.readOnly} onClick={() => {
          if (range || props.kind !== "date") { setStart(null); setEnd(null); setGeneralError(null); setStartError(null); setEndError(null); setOffsetChoices([]); setResetKey((key) => key + 1); }
          else commit(null);
        }}>{locale.startsWith("ko") ? "지우기" : "Clear"}</Button>
        {(range || props.kind !== "date") && <>
          <Button type="button" variant="weak" intent="neutral" onClick={() => { triggerRef.current?.focus(); handleOpenChange(false); }}>{locale.startsWith("ko") ? "취소" : "Cancel"}</Button>
          <Button type="button" onClick={apply} disabled={Boolean(startError || endError || offsetChoices.length) || props.disabled || props.readOnly}>{locale.startsWith("ko") ? "적용" : "Apply"}</Button>
        </>}
      </div>
    </div>
  );
  const trigger = <Button ref={triggerRef} type="button" id={triggerId} variant="weak" intent="neutral"
    disabled={props.disabled} aria-labelledby={`${labelId} ${triggerId}`}>
    {summary}
  </Button>;
  return (
    <div className={`dds-date-picker${props.className ? ` ${props.className}` : ""}`}>
      <span id={labelId} className="dds-date-picker__label">{props.label ?? title}</span>
      {mobile
        ? <Sheet.Root side="bottom" open={open} onOpenChange={handleOpenChange}>
            <Sheet.Trigger asChild>{trigger}</Sheet.Trigger>
            <Sheet.Overlay />
            <Sheet.Content className="dds-date-picker__sheet">
              <Sheet.Title>{title}</Sheet.Title>{panel}
            </Sheet.Content>
          </Sheet.Root>
        : <Popover.Root open={open} onOpenChange={handleOpenChange} placement="bottom-start">
            <Popover.Trigger asChild>{trigger}</Popover.Trigger>
            <Popover.Content role="dialog" aria-label={title} className="dds-date-picker__popover">
              {panel}
            </Popover.Content>
          </Popover.Root>}
      {props.description && <p className="dds-date-picker__description">{props.description}</p>}
      {"name" in props && props.name && !range && <input type="hidden" name={props.name} value={isRange(committed) ? "" : serializeDatePickerValue(committed)} />}
      {range && "startName" in props && props.startName && <input type="hidden" name={props.startName} value={isRange(committed) ? serializeDatePickerValue(committed.start) : ""} />}
      {range && "endName" in props && props.endName && <input type="hidden" name={props.endName} value={isRange(committed) ? serializeDatePickerValue(committed.end) : ""} />}
    </div>
  );
}

export function DatePicker(props: DatePickerProps) { return <Picker props={props} range={false} />; }
export function DateRangePicker(props: DateRangePickerProps) { return <Picker props={props} range />; }
