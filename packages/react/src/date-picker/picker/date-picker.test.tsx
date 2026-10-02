import { CalendarDate, CalendarDateTime, parseZonedDateTime } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatePicker, DateRangePicker } from "./DatePicker";

describe("DatePicker", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("commits a single calendar date immediately and returns focus", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker kind="date" label="Appointment" defaultValue={new CalendarDate(2026, 9, 1)} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: /Appointment/ });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.click(document.querySelector('[data-date="2026-09-27"]')!);
    expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2026, 9, 27));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("requires Apply for a range and Cancel preserves the committed value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker kind="date" label="Trip" defaultValue={null} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: /Trip/ });
    await user.click(trigger);
    const start = screen.getByRole("textbox", { name: "Start" });
    const end = screen.getByRole("textbox", { name: "End" });
    await user.type(start, "09/27/2026");
    await user.type(end, "09/30/2026");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(trigger);
    expect((screen.getByRole("textbox", { name: "Start" }) as HTMLInputElement).value).toBe("");
    await user.type(screen.getByRole("textbox", { name: "Start" }), "09/27/2026");
    await user.type(screen.getByRole("textbox", { name: "End" }), "09/30/2026");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onValueChange).toHaveBeenCalledWith({ start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 9, 30) });
  });

  it("commits direct single-date entry only once on Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker kind="date" label="Date" defaultValue={null} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Date/ }));
    await user.type(screen.getByRole("textbox", { name: "Date" }), "09/27/2026{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2026, 9, 27));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("lets a user move from a valid date draft to a different calendar day", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker kind="date" label="Date" defaultValue={new CalendarDate(2026, 9, 1)} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Date/ }));
    const input = screen.getByRole("textbox", { name: "Date" });
    await user.clear(input);
    await user.type(input, "09/27/2026");
    await user.click(document.querySelector('[data-date="2026-09-28"]')!);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2026, 9, 28));
  });

  it("commits valid direct entry when focus leaves the picker", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker kind="date" label="Date" defaultValue={null} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Date/ }));
    await user.type(screen.getByRole("textbox", { name: "Date" }), "09/27/2026");
    await user.click(document.body);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(new CalendarDate(2026, 9, 27));
  });

  it("keeps a range preset as draft until Apply and rejects an invalid preset", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const valid = { start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 9, 30) };
    render(<DateRangePicker kind="date" label="Trip" defaultValue={null} onValueChange={onValueChange}
      minValue={new CalendarDate(2026, 9, 25)} presets={[
        { id: "trip", label: "Trip preset", getValue: () => valid },
        { id: "old", label: "Old preset", getValue: () => ({ start: new CalendarDate(2026, 9, 1), end: new CalendarDate(2026, 9, 2) }) },
      ]} />);
    await user.click(screen.getByRole("button", { name: /Trip/ }));
    await user.click(screen.getByRole("button", { name: "Old preset" }));
    expect(screen.getByRole("alert").textContent).toMatch(/preset|selected/i);
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Trip preset" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onValueChange).toHaveBeenCalledWith(valid);
  });

  it("renders zoned values and uses a mobile Sheet with Apply for local time", async () => {
    const zoned = parseZonedDateTime("2026-11-01T01:30:00-05:00[America/New_York]");
    const { unmount } = render(<DatePicker kind="zoned-date-time" timeZone="America/New_York"
      label="Meeting" defaultValue={zoned} />);
    expect(screen.getByRole("button", { name: /Meeting/ }).textContent).toContain("America/New_York");
    unmount();

    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker kind="local-date-time" label="Time" defaultValue={new CalendarDateTime(2026, 9, 27, 10, 0)}
      onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Time/ }));
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keeps both offset decisions when a selected range has two ambiguous endpoints", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker kind="zoned-date-time" timeZone="America/New_York" locale="en-US"
      label="Fall back range" onValueChange={onValueChange} defaultValue={{
        start: parseZonedDateTime("2026-10-31T01:15:00-04:00[America/New_York]"),
        end: parseZonedDateTime("2026-11-02T01:30:00-05:00[America/New_York]"),
      }} />);
    await user.click(screen.getByRole("button", { name: /Fall back range/ }));
    const day = document.querySelector('[data-date="2026-11-01"]')!;
    await user.click(day);
    await user.click(day);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getAllByRole("radio")[0]!);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    await user.click(screen.getAllByRole("radio")[1]!);
    expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(false);
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("replaces an open draft when a controlled value changes externally", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const first = new CalendarDate(2026, 9, 27);
    const second = new CalendarDate(2026, 10, 2);
    const { rerender } = render(<DatePicker kind="date" label="Controlled" value={first} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Controlled/ }));
    expect((screen.getByRole("textbox", { name: "Controlled" }) as HTMLInputElement).value).toContain("09/27/2026");
    rerender(<DatePicker kind="date" label="Controlled" value={second} onValueChange={onValueChange} />);
    expect((screen.getByRole("textbox", { name: "Controlled" }) as HTMLInputElement).value).toContain("10/02/2026");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("opens from defaultOpen with the committed draft restored and reports changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DatePicker kind="date" label="Open" defaultOpen defaultValue={new CalendarDate(2026, 9, 27)} onOpenChange={onOpenChange} />);
    expect((screen.getByRole("textbox", { name: "Open" }) as HTMLInputElement).value).toContain("09/27/2026");
    await user.click(document.querySelector('[data-date="2026-09-20"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("follows a controlled open prop and restores the draft on each reopen", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const value = new CalendarDate(2026, 9, 27);
    const ui = (open: boolean) => <DatePicker kind="date" label="Ctl" value={value} open={open} onOpenChange={onOpenChange} />;
    const { rerender } = render(ui(false));
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: /Ctl/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(ui(true));
    const input = screen.getByRole("textbox", { name: "Ctl" }) as HTMLInputElement;
    expect(input.value).toContain("09/27/2026");
    await user.clear(input);
    rerender(ui(false));
    rerender(ui(true));
    expect((screen.getByRole("textbox", { name: "Ctl" }) as HTMLInputElement).value).toContain("09/27/2026");
  });
});
