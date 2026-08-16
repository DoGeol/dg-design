import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { NotificationBadge } from "./NotificationBadge";

describe("NotificationBadge", () => {
  it("count 생략 시 라벨 없는 dot을 렌더한다", () => {
    render(<NotificationBadge data-testid="badge" />);
    const el = screen.getByTestId("badge");
    expect(el.classList.contains("dds-notification-badge--dot")).toBe(true);
    expect(el.textContent).toBe("");
  });

  it("count=5는 '5'를 렌더한다", () => {
    render(<NotificationBadge count={5} />);
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("count=150, max=99는 '99+'를 렌더한다", () => {
    render(<NotificationBadge count={150} max={99} />);
    expect(screen.getByText("99+")).toBeTruthy();
  });

  it("count=0은 기본적으로 아무것도 렌더하지 않는다", () => {
    const { container } = render(<NotificationBadge count={0} data-testid="badge" />);
    expect(container.innerHTML).toBe("");
    expect(screen.queryByTestId("badge")).toBeNull();
  });

  it("count=0 + isShowEmpty는 '0'을 렌더한다", () => {
    render(<NotificationBadge count={0} isShowEmpty />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("intent 기본값은 critical이다", () => {
    render(<NotificationBadge count={1} />);
    expect(screen.getByText("1").classList.contains("dds-notification-badge--intent_critical")).toBe(
      true,
    );
  });

  it("intent='brand'는 brand 클래스로 전환된다", () => {
    render(<NotificationBadge count={1} intent="brand" />);
    const el = screen.getByText("1");
    expect(el.classList.contains("dds-notification-badge--intent_brand")).toBe(true);
    expect(el.classList.contains("dds-notification-badge--intent_critical")).toBe(false);
  });
});
