import "./field.css";

import type { ZonedDateTime } from "@internationalized/date";
import * as React from "react";

import { TextField } from "../../text-field/TextField";
import { parseDatePickerInput, serializeDatePickerValue } from "../model";
import type { DatePickerErrorCode, DatePickerKind, DatePickerResult, DatePickerValue } from "../model";
import {
  dateInputPlaceholder, formatDateInput, formatOffset, formatTimeInput, normalizeDateInput,
  normalizeTimeInput, timeInputPlaceholder,
} from "./format";

export interface DatePickerFieldProps {
  kind: DatePickerKind;
  value: DatePickerValue | null;
  locale: string;
  hourCycle?: 12 | 24;
  timeZone?: string;
  label: string;
  timeLabel?: string;
  id?: string;
  description?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: React.ReactNode;
  errorMessages?: Partial<Record<DatePickerErrorCode, string>>;
  onDraftChange: (result: DatePickerResult<DatePickerValue | null>) => void;
  onCommit?: (value: DatePickerValue | null) => void;
  commitOnBlur?: boolean;
  resetKey?: number;
}

function defaultError(code: DatePickerErrorCode, locale: string) {
  const ko = locale.toLowerCase().startsWith("ko");
  const labels: Partial<Record<DatePickerErrorCode, [string, string]>> = {
    "incomplete-input": ["날짜와 시간을 끝까지 입력하세요.", "Complete the date and time."],
    "invalid-input": ["올바른 날짜와 시간을 입력하세요.", "Enter a valid date and time."],
    "nonexistent-time": ["이 시간대에 존재하지 않는 시각입니다.", "This time does not exist in the selected time zone."],
    "ambiguous-time": ["시간대 전환으로 두 시각이 있습니다. 오프셋을 고르세요.", "Choose one of the two time zone offsets."],
    "invalid-time-zone": ["시간대를 확인하세요.", "Check the time zone."],
  };
  return labels[code]?.[ko ? 0 : 1] ?? (ko ? "선택할 수 없는 값입니다." : "This value cannot be selected.");
}

export function DatePickerField({
  kind, value, locale, hourCycle, timeZone, label, timeLabel, id, description, disabled, readOnly,
  required, error, errorMessages, onDraftChange, onCommit, commitOnBlur = false, resetKey,
}: DatePickerFieldProps) {
  const generatedId = React.useId();
  const baseId = id ?? generatedId;
  const dateId = `${baseId}-date`;
  const timeId = `${baseId}-time`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const format = React.useMemo(() => ({ locale, hourCycle }), [locale, hourCycle]);
  const [dateText, setDateText] = React.useState(() => formatDateInput(value, format));
  const [timeText, setTimeText] = React.useState(() => formatTimeInput(value, format));
  const [localError, setLocalError] = React.useState<DatePickerErrorCode | null>(null);
  const [candidates, setCandidates] = React.useState<readonly ZonedDateTime[]>([]);
  const lastCommitRef = React.useRef<string | null>(null);
  const dateInputRef = React.useRef<HTMLInputElement>(null);
  const internalPointerRef = React.useRef(false);
  const valueKey = serializeDatePickerValue(value);
  const displayKey = `${kind}|${valueKey}|${locale}|${hourCycle ?? ""}|${resetKey ?? ""}`;
  const lastDisplayKeyRef = React.useRef(displayKey);

  React.useEffect(() => {
    if (lastDisplayKeyRef.current === displayKey) return;
    lastDisplayKeyRef.current = displayKey;
    setDateText(formatDateInput(value, format));
    setTimeText(formatTimeInput(value, format));
    setLocalError(null);
    setCandidates([]);
  }, [displayKey, value, format]);

  React.useEffect(() => {
    const panel = dateInputRef.current?.closest('[role="dialog"]');
    if (!panel) return;
    const markPointer = (event: Event) => {
      internalPointerRef.current = panel.contains(event.target as Node) && event.target !== dateInputRef.current;
    };
    document.addEventListener("pointerdown", markPointer, true);
    document.addEventListener("mousedown", markPointer, true);
    return () => {
      document.removeEventListener("pointerdown", markPointer, true);
      document.removeEventListener("mousedown", markPointer, true);
    };
  }, []);

  const evaluate = React.useCallback((dateInput: string, timeInput: string): DatePickerResult<DatePickerValue | null> => {
    if (!dateInput.trim() && (kind === "date" || !timeInput.trim())) return { valid: true, value: null };
    const date = normalizeDateInput(dateInput, format);
    if (!date.valid) return date;
    if (kind === "date") return parseDatePickerInput(kind, date.value);
    const time = normalizeTimeInput(timeInput, format);
    if (!time.valid) return time;
    return parseDatePickerInput(kind, `${date.value}T${time.value}`, timeZone, value);
  }, [kind, format, timeZone, value]);

  const publishDraft = (nextDate: string, nextTime: string) => {
    const result = evaluate(nextDate, nextTime);
    setLocalError(result.valid ? null : result.error.code);
    setCandidates(result.valid ? [] : result.candidates ?? []);
    onDraftChange(result);
    return result;
  };

  const commit = (nextDate: string, nextTime: string) => {
    const result = publishDraft(nextDate, nextTime);
    if (result.valid) onCommit?.(result.value);
  };

  const displayedError = error ?? (localError ? errorMessages?.[localError] ?? defaultError(localError, locale) : null);
  const describedBy = [description ? descriptionId : null, displayedError ? errorId : null]
    .filter(Boolean).join(" ") || undefined;

  return (
    <div className="dds-date-picker-field">
      <div className="dds-date-picker-field__part">
        <label htmlFor={dateId}>{label}</label>
        <TextField
          ref={dateInputRef} id={dateId} value={dateText} type="text"
          placeholder={dateInputPlaceholder(format)} disabled={disabled} readOnly={readOnly}
          required={required} aria-invalid={Boolean(displayedError)} aria-describedby={describedBy}
          onChange={(event) => { const next = event.target.value; lastCommitRef.current = null; setDateText(next); publishDraft(next, timeText); }}
          onKeyDown={(event) => { if (event.key === "Enter" && commitOnBlur) { event.preventDefault(); lastCommitRef.current = `${dateText}|${timeText}`; commit(dateText, timeText); } }}
          onBlur={(event) => {
            const panel = event.currentTarget.closest('[role="dialog"]');
            if (internalPointerRef.current ||
              (panel && event.relatedTarget instanceof Node && panel.contains(event.relatedTarget))) {
              internalPointerRef.current = false;
              return;
            }
            if (commitOnBlur && lastCommitRef.current !== `${dateText}|${timeText}`) commit(dateText, timeText);
          }}
        />
      </div>
      {kind !== "date" && (
        <div className="dds-date-picker-field__part">
          <label htmlFor={timeId}>{timeLabel ?? (locale.startsWith("ko") ? "시간" : "Time")}</label>
          <TextField
            id={timeId} value={timeText} type="text" placeholder={timeInputPlaceholder(format)}
            disabled={disabled} readOnly={readOnly} required={required}
            aria-invalid={Boolean(displayedError)} aria-describedby={describedBy}
            onChange={(event) => { const next = event.target.value; setTimeText(next); publishDraft(dateText, next); }}
          />
          {kind === "zoned-date-time" && timeZone &&
            <span className="dds-date-picker-field__zone">{timeZone}</span>}
        </div>
      )}
      {candidates.length > 1 && (
        <fieldset className="dds-date-picker-field__offsets">
          <legend>{locale.startsWith("ko") ? "시간대 오프셋" : "Time zone offset"}</legend>
          {candidates.map((candidate) => (
            <label key={candidate.toString()} className="dds-date-picker-field__offset">
              <input type="radio" name={`${baseId}-offset`} value={candidate.toString()}
                onChange={() => { setLocalError(null); setCandidates([]); onDraftChange({ valid: true, value: candidate }); }} />
              {formatOffset(candidate.offset)}
            </label>
          ))}
        </fieldset>
      )}
      {description && <p id={descriptionId}>{description}</p>}
      {displayedError && <p id={errorId} role="alert">{displayedError}</p>}
    </div>
  );
}
