import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./Alert";

describe("Alert", () => {
  it.each(["brand", "neutral", "critical", "positive", "warning", "informative"] as const)(
    "intent=%s는 dds-alert--intent_%s 클래스를 붙인다",
    (intent) => {
      render(<Alert intent={intent} title={intent} />);
      const el = screen.getByText(intent).closest(".dds-alert");
      expect(el?.classList.contains(`dds-alert--intent_${intent}`)).toBe(true);
    },
  );

  it("intent 기본값은 neutral이다", () => {
    render(<Alert title="기본" />);
    const el = screen.getByText("기본").closest(".dds-alert");
    expect(el?.classList.contains("dds-alert--intent_neutral")).toBe(true);
  });

  it("intent=critical은 role=alert(암묵적 assertive)다", () => {
    render(<Alert intent="critical" title="위험" />);
    expect(screen.queryByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it.each(["brand", "neutral", "positive", "warning", "informative"] as const)(
    "intent=%s는 role=status(암묵적 polite)다",
    (intent) => {
      render(<Alert intent={intent} title={intent} />);
      expect(screen.queryByRole("status")).toBeTruthy();
      expect(screen.queryByRole("alert")).toBeNull();
    },
  );

  it("aria-live를 따로 얹지 않는다 (role의 암묵값에만 의존)", () => {
    render(<Alert intent="critical" title="위험" />);
    expect(screen.getByRole("alert").getAttribute("aria-live")).toBeNull();
  });

  it("onClose를 넘기지 않으면 닫기 버튼이 없다", () => {
    render(<Alert title="알림" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("onClose를 넘기면 닫기 버튼이 렌더되고 클릭 시 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Alert title="알림" onClose={onClose} />);

    const closeButton = screen.getByRole("button", { name: "닫기" });
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closeLabel로 닫기 버튼의 aria-label을 바꿀 수 있다", () => {
    render(<Alert title="알림" onClose={() => {}} closeLabel="알림 닫기" />);
    expect(screen.queryByRole("button", { name: "알림 닫기" })).toBeTruthy();
  });

  it("아이콘 svg는 aria-hidden이라 접근성 트리에 노출되지 않는다", () => {
    const { container } = render(<Alert intent="warning" title="경고" />);
    const icon = container.querySelector(".dds-alert__icon svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("title·description을 함께 렌더한다", () => {
    render(<Alert title="제목" description="본문 내용" />);
    expect(screen.queryByText("제목")).toBeTruthy();
    expect(screen.queryByText("본문 내용")).toBeTruthy();
  });

  it("role은 소비자가 덮어쓸 수 없다 (politeness prop 미제공)", () => {
    // @ts-expect-error — AlertProps는 role을 타입에서 제거했다
    render(<Alert intent="critical" title="위험" role="status" />);
    expect(screen.queryByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
