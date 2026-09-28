import { CalendarDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePickerField } from "./DatePickerField";

describe("DatePickerField", () => {
  it("retains invalid raw input and commits a valid date on Enter", async () => {
    const user = userEvent.setup();
    const onDraftChange = vi.fn();
    const onCommit = vi.fn();
    render(<DatePickerField kind="date" value={null} locale="en-US" label="Date"
      onDraftChange={onDraftChange} onCommit={onCommit} commitOnBlur />);
    const input = screen.getByRole("textbox", { name: "Date" });
    await user.type(input, "02/30/2026");
    expect((input as HTMLInputElement).value).toBe("02/30/2026");
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(onCommit).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, "09/27/2026{Enter}");
    expect(onCommit).toHaveBeenCalledWith(new CalendarDate(2026, 9, 27));
  });
});
