import "./calendar.css";

import { GregorianCalendar, startOfMonth, toCalendarDate, type CalendarDate } from "@internationalized/date";
import * as React from "react";
import { I18nProvider, useLocale } from "react-aria/I18nProvider";
import { useCalendar, useCalendarCell, useCalendarGrid } from "react-aria/useCalendar";
import { useRangeCalendar } from "react-aria/useRangeCalendar";
import { useCalendarState } from "react-stately/useCalendarState";
import { useRangeCalendarState } from "react-stately/useRangeCalendarState";

type CalendarState = Parameters<typeof useCalendarGrid>[1];
type CalendarAria = ReturnType<typeof useCalendar>;

interface CalendarBaseProps {
  locale: string;
  ariaLabel: string;
  visibleMonths?: 1 | 2;
  focusedValue?: CalendarDate | null;
  onFocusChange?: (date: CalendarDate) => void;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateUnavailable?: (date: CalendarDate) => boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export interface DatePickerCalendarProps extends CalendarBaseProps {
  value: CalendarDate | null;
  onChange: (date: CalendarDate) => void;
}

export interface DateRangePickerCalendarProps extends CalendarBaseProps {
  value: { start: CalendarDate; end: CalendarDate } | null;
  onChange: (range: { start: CalendarDate; end: CalendarDate }) => void;
}

function CalendarCell({ date, month, state }: { date: CalendarDate; month: number; state: CalendarState }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, formattedDate, isSelected, isUnavailable, isDisabled,
    isFocused, isOutsideVisibleRange } = useCalendarCell({ date, isOutsideMonth: date.month !== month }, state, ref);
  const range = "highlightedRange" in state ? state.highlightedRange ?? state.value : null;
  const rangeStart = range && toCalendarDate(range.start).compare(date) === 0;
  const rangeEnd = range && toCalendarDate(range.end).compare(date) === 0;
  return (
    <td {...cellProps} className="dds-date-picker-calendar__cell">
      <div
        {...buttonProps}
        ref={ref}
        data-date={date.toString()}
        data-selected={isSelected || undefined}
        data-range-start={rangeStart || undefined}
        data-range-end={rangeEnd || undefined}
        data-unavailable={isUnavailable || undefined}
        data-disabled={isDisabled || undefined}
        data-focused={isFocused || undefined}
        data-outside={isOutsideVisibleRange || date.month !== month || undefined}
        className="dds-date-picker-calendar__day"
      >
        {formattedDate}
      </div>
    </td>
  );
}

function MonthGrid({ state, index, locale, showTitle }: { state: CalendarState; index: number; locale: string; showTitle: boolean }) {
  const startDate = startOfMonth(state.visibleRange.start.add({ months: index }));
  const endDate = startDate.add({ months: 1 }).subtract({ days: 1 });
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    { startDate, endDate, weekdayStyle: "short" }, state,
  );
  const monthFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", timeZone: "UTC" }),
    [locale],
  );
  const weekdayFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }),
    [locale],
  );
  const firstWeek = state.getDatesInWeek(0, startDate);
  const title = monthFormatter.format(startDate.toDate("UTC"));
  return (
    <div className="dds-date-picker-calendar__month">
      {showTitle && <h3 className="dds-date-picker-calendar__month-title">{title}</h3>}
      <table {...gridProps} className="dds-date-picker-calendar__grid">
        <thead {...headerProps}>
          <tr>{weekDays.map((day, dayIndex) => <th key={dayIndex} scope="col"
            abbr={firstWeek[dayIndex] ? weekdayFormatter.format(firstWeek[dayIndex].toDate("UTC")) : day}>{day}</th>)}</tr>
        </thead>
        <tbody>
          {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
            <tr key={weekIndex}>
              {state.getDatesInWeek(weekIndex, startDate).map((date, dayIndex) =>
                date ? <CalendarCell key={date.toString()} date={date} month={startDate.month} state={state} />
                  : <td key={dayIndex} />)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarView({ state, aria, locale, visibleMonths = 1 }: {
  state: CalendarState;
  aria: CalendarAria;
  locale: string;
  visibleMonths?: 1 | 2;
}) {
  const korean = locale.toLowerCase().startsWith("ko");
  const previousYearDisabled = state.isDisabled || Boolean(state.minValue &&
    state.visibleRange.end.subtract({ years: 1 }).compare(toCalendarDate(state.minValue)) < 0);
  const nextYearDisabled = state.isDisabled || Boolean(state.maxValue &&
    state.visibleRange.start.add({ years: 1 }).compare(toCalendarDate(state.maxValue)) > 0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    queueMicrotask(() => rootRef.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus());
  }, []);
  return (
    <div {...aria.calendarProps} ref={rootRef} data-range={"highlightedRange" in state || undefined} className="dds-date-picker-calendar">
      <div className="dds-date-picker-calendar__nav">
        <button type="button" onClick={() => state.focusPreviousSection(true)} disabled={previousYearDisabled}
          aria-label={korean ? "이전 연도" : "Previous year"}>«</button>
        <button type="button" onClick={() => state.focusPreviousPage()}
          disabled={state.isDisabled || Boolean(aria.prevButtonProps.isDisabled)}
          aria-label={korean ? "이전 달" : "Previous month"}>{"‹"}</button>
        <h2 className="dds-date-picker-calendar__title" role="status">{aria.title}</h2>
        <button type="button" onClick={() => state.focusNextPage()}
          disabled={state.isDisabled || Boolean(aria.nextButtonProps.isDisabled)}
          aria-label={korean ? "다음 달" : "Next month"}>{"›"}</button>
        <button type="button" onClick={() => state.focusNextSection(true)} disabled={nextYearDisabled}
          aria-label={korean ? "다음 연도" : "Next year"}>»</button>
      </div>
      <div className="dds-date-picker-calendar__months">
        {Array.from({ length: visibleMonths }, (_, index) =>
          <MonthGrid key={index} state={state} index={index} locale={locale} showTitle={visibleMonths > 1} />)}
      </div>
    </div>
  );
}

function SingleCalendar(props: DatePickerCalendarProps) {
  const { locale } = useLocale();
  const { visibleMonths = 1 } = props;
  const state = useCalendarState({
    locale, createCalendar: () => new GregorianCalendar(), visibleDuration: { months: visibleMonths },
    value: props.value, onChange: (date) => { if (date) props.onChange(toCalendarDate(date)); },
    focusedValue: props.focusedValue, onFocusChange: props.onFocusChange,
    minValue: props.minValue, maxValue: props.maxValue,
    isDateUnavailable: props.isDateUnavailable
      ? (date) => props.isDateUnavailable!(toCalendarDate(date)) : undefined,
    isDisabled: props.isDisabled,
    isReadOnly: props.isReadOnly,
  });
  const aria = useCalendar({ "aria-label": props.ariaLabel }, state);
  return <CalendarView state={state} aria={aria} locale={locale} visibleMonths={visibleMonths} />;
}

function RangeCalendar(props: DateRangePickerCalendarProps) {
  const { locale } = useLocale();
  const { visibleMonths = 1 } = props;
  const state = useRangeCalendarState({
    locale, createCalendar: () => new GregorianCalendar(), visibleDuration: { months: visibleMonths },
    value: props.value, onChange: (range) => { if (range) props.onChange({ start: toCalendarDate(range.start), end: toCalendarDate(range.end) }); },
    focusedValue: props.focusedValue, onFocusChange: props.onFocusChange,
    minValue: props.minValue, maxValue: props.maxValue,
    isDateUnavailable: props.isDateUnavailable
      ? (date) => props.isDateUnavailable!(toCalendarDate(date)) : undefined,
    isDisabled: props.isDisabled,
    isReadOnly: props.isReadOnly, allowsNonContiguousRanges: false,
  });
  const ref = React.useRef<HTMLDivElement>(null);
  const aria = useRangeCalendar({ "aria-label": props.ariaLabel }, state, ref);
  return <div ref={ref}><CalendarView state={state} aria={aria} locale={locale} visibleMonths={visibleMonths} /></div>;
}

export function DatePickerCalendar(props: DatePickerCalendarProps) {
  return <I18nProvider locale={props.locale}><SingleCalendar {...props} /></I18nProvider>;
}

export function DateRangePickerCalendar(props: DateRangePickerCalendarProps) {
  return <I18nProvider locale={props.locale}><RangeCalendar {...props} /></I18nProvider>;
}
