import "./date-picker.css";

import { ZonedDateTime, toCalendarDate } from "@internationalized/date";
import * as React from "react";

import { Button } from "../../button/Button";
import { Popover } from "../../popover/Popover";
import { Sheet } from "../../sheet/Sheet";
import { DatePickerCalendar, DateRangePickerCalendar } from "../calendar";
import { DatePickerField } from "../field";
import { serializeDatePickerValue } from "../model";
import type {
  DatePickerErrorCode, DatePickerKind, DatePickerPreset,
  DatePickerProps, DatePickerValidationError, DatePickerValue,
  DateRangePickerProps,
} from "../model";
import { isRange, usePickerState, type PickerProps, type Selection } from "./use-picker-state";

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
  const mobile = useMobile();
  const generatedId = React.useId();
  const labelId = `${props.id ?? generatedId}-label`;
  const triggerId = `${props.id ?? generatedId}-trigger`;
  const title = typeof props.label === "string" ? props.label : ko ? "날짜 선택" : "Choose date";
  const {
    committed, open, start, end, focusedDate, setFocusedDate, resetKey, offsetChoices,
    constraints, triggerRef, error, startError, endError, handleOpenChange, commit,
    apply, fieldChange, handlePreset, clear, cancel, chooseOffset,
    onCalendarDateChange, onCalendarRangeChange,
  } = usePickerState(props, range);

  const summary = committed === null ? (locale.startsWith("ko") ? "선택 안 함" : "No date selected")
    : isRange(committed)
      ? `${formatValue(committed.start, props.kind, locale, constraints.timeZone)} – ${formatValue(committed.end, props.kind, locale, constraints.timeZone)}`
      : formatValue(committed, props.kind, locale, constraints.timeZone);
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
              onChange={onCalendarRangeChange}
              minValue={props.minValue ? toCalendarDate(props.minValue) : undefined}
              maxValue={props.maxValue ? toCalendarDate(props.maxValue) : undefined}
              isDateUnavailable={props.isDateUnavailable} isDisabled={props.disabled} isReadOnly={props.readOnly} />
          : <DatePickerCalendar locale={locale} ariaLabel={title}
              focusedValue={focusedDate} onFocusChange={setFocusedDate}
              value={start ? toCalendarDate(start) : null}
              onChange={onCalendarDateChange}
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
          <input type="radio" name={`${triggerId}-${choice.endpoint}-offset`}
            onChange={() => chooseOffset(choice.endpoint, candidate)} />{candidate.toString()}
        </label>)}
      </fieldset>)}
      {error && <p className="dds-date-picker__error" role="alert">{errorText(error, props)}</p>}
      <div className="dds-date-picker__actions">
        <Button type="button" variant="weak" intent="neutral" disabled={props.disabled || props.readOnly}
          onClick={clear}>{locale.startsWith("ko") ? "지우기" : "Clear"}</Button>
        {(range || props.kind !== "date") && <>
          <Button type="button" variant="weak" intent="neutral" onClick={cancel}>{locale.startsWith("ko") ? "취소" : "Cancel"}</Button>
          <Button type="button" onClick={apply} disabled={Boolean(startError || endError || offsetChoices.length) || props.disabled || props.readOnly}>{locale.startsWith("ko") ? "적용" : "Apply"}</Button>
        </>}
      </div>
    </div>
  );
  const trigger = <Button ref={triggerRef} type="button" id={triggerId} variant="weak" intent="neutral"
    className="dds-date-picker__trigger" disabled={props.disabled} aria-labelledby={`${labelId} ${triggerId}`}>
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
            <Popover.Content role="dialog" aria-label={title}
              className={`dds-date-picker__popover${range ? " dds-date-picker__popover--range" : ""}`}>
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
