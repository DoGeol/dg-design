import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("라벨 없이 쓰면 장식으로 빠진다 (aria-hidden, role 없음)", () => {
    render(<Spinner data-testid="spinner" />);
    const el = screen.getByTestId("spinner");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.getAttribute("role")).toBeNull();
  });

  it("aria-label을 주면 role=status로 낭독 대상이 된다", () => {
    render(<Spinner aria-label="불러오는 중" />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-hidden")).toBeNull();
    expect(el.getAttribute("aria-label")).toBe("불러오는 중");
  });

  it("aria-labelledby만 줘도 role=status가 된다", () => {
    render(
      <>
        <span id="label">진행 중</span>
        <Spinner aria-labelledby="label" data-testid="spinner" />
      </>,
    );
    expect(screen.getByTestId("spinner").getAttribute("role")).toBe("status");
  });

  it("role·aria-hidden을 직접 넘기면 자동 판단보다 우선한다", () => {
    render(<Spinner aria-label="불러오는 중" role="progressbar" data-testid="spinner" />);
    expect(screen.getByTestId("spinner").getAttribute("role")).toBe("progressbar");
  });

  it("size 기본값은 medium이다", () => {
    render(<Spinner data-testid="spinner" />);
    expect(screen.getByTestId("spinner").classList.contains("dds-spinner--size_medium")).toBe(
      true,
    );
  });

  it("size='small'은 small 클래스로 전환된다", () => {
    render(<Spinner size="small" data-testid="spinner" />);
    const el = screen.getByTestId("spinner");
    expect(el.classList.contains("dds-spinner--size_small")).toBe(true);
    expect(el.classList.contains("dds-spinner--size_medium")).toBe(false);
  });

  // jsdom 한계: vitest는 기본적으로 CSS import를 평가하지 않아(test.css: false)

});
