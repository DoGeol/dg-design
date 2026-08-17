import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Progress } from "./Progress";

describe("Progress", () => {
  it("role=progressbar로 렌더된다", () => {
    render(<Progress value={40} />);
    expect(screen.getByRole("progressbar")).toBeTruthy();
  });

  it("value·max가 aria-valuenow/min/max에 반영된다", () => {
    render(<Progress value={40} max={80} />);
    const el = screen.getByRole("progressbar");
    expect(el.getAttribute("aria-valuenow")).toBe("40");
    expect(el.getAttribute("aria-valuemin")).toBe("0");
    expect(el.getAttribute("aria-valuemax")).toBe("80");
  });

  it("max 기본값은 100이다", () => {
    render(<Progress value={10} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuemax")).toBe("100");
  });

  it("value 기본값은 0이다", () => {
    render(<Progress />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("음수 value는 0으로 clamp된다", () => {
    render(<Progress value={-20} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("max를 넘는 value는 max로 clamp된다", () => {
    render(<Progress value={150} max={100} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  });

  it("indeterminate면 aria-valuenow가 없다", () => {
    render(<Progress indeterminate />);
    const el = screen.getByRole("progressbar");
    expect(el.hasAttribute("aria-valuenow")).toBe(false);
    expect(el.hasAttribute("data-indeterminate")).toBe(true);
  });

  it("indeterminate가 아니면 data-indeterminate가 없다", () => {
    render(<Progress value={10} />);
    expect(screen.getByRole("progressbar").hasAttribute("data-indeterminate")).toBe(false);
  });

  it("indeterminate가 아니면 인디케이터 width가 백분율로 계산된다", () => {
    const { container } = render(<Progress value={25} max={50} />);
    const indicator = container.querySelector(".dds-progress__indicator") as HTMLElement;
    expect(indicator.style.width).toBe("50%");
  });

  // jsdom 한계: CSS import가 test에서 평가되지 않아(vitest 기본 test.css: false)

});
