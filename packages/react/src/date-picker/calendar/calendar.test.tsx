import { CalendarDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePickerCalendar, DateRangePickerCalendar } from "./Calendar";

describe("DatePicker calendars", () => {
  it("selects a date by keyboard and exposes a named grid", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<DatePickerCalendar locale="en-US" ariaLabel="Appointment date"
      value={new CalendarDate(2026, 9, 14)} onChange={onChange} />);
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBeTruthy();
    const selected = container.querySelector<HTMLElement>('[data-date="2026-09-14"]')!;
    selected.focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(onChange).toHaveBeenCalledWith(new CalendarDate(2026, 9, 15));
  });

  it("shows two months and prevents a range crossing an unavailable date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<DateRangePickerCalendar locale="ko-KR" ariaLabel="여행 기간"
      value={null} onChange={onChange} focusedValue={new CalendarDate(2026, 9, 14)}
      visibleMonths={2} isDateUnavailable={(date) => date.day === 15} />);
    expect(screen.getAllByRole("grid")).toHaveLength(2);
    expect(container.querySelector('[data-date="2026-09-15"]')?.getAttribute("aria-disabled")).toBe("true");
    await user.click(container.querySelector('[data-date="2026-09-14"]')!);
    await user.click(container.querySelector('[data-date="2026-09-16"]')!);
    expect(onChange).not.toHaveBeenCalled();
  });
});
