import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { SaveStatus, type SaveStatusValue } from "./SaveStatus";

const STATUSES: SaveStatusValue[] = ["saved", "dirty", "saving", "error"];

describe("SaveStatus", () => {
  it.each(STATUSES)("status=%s면 상태별 클래스를 갖는다", (status) => {
    render(
      <SaveStatus status={status} data-testid="status">
        문구
      </SaveStatus>,
    );
    const el = screen.getByTestId("status");
    expect(el.classList.contains("dds-save-status")).toBe(true);
    expect(el.classList.contains(`dds-save-status--status_${status}`)).toBe(true);
  });

  it("error만 role='alert'이고 나머지는 role='status'다", () => {
    const { rerender } = render(
      <SaveStatus status="saved" data-testid="status">
        저장됨
      </SaveStatus>,
    );
    expect(screen.getByTestId("status").getAttribute("role")).toBe("status");

    rerender(
      <SaveStatus status="dirty" data-testid="status">
        변경됨
      </SaveStatus>,
    );
    expect(screen.getByTestId("status").getAttribute("role")).toBe("status");

    rerender(
      <SaveStatus status="saving" data-testid="status">
        저장 중
      </SaveStatus>,
    );
    expect(screen.getByTestId("status").getAttribute("role")).toBe("status");

    rerender(
      <SaveStatus status="error" data-testid="status">
        실패
      </SaveStatus>,
    );
    expect(screen.getByTestId("status").getAttribute("role")).toBe("alert");
    expect(screen.getByTestId("status").hasAttribute("aria-live")).toBe(false);
  });

  it("status가 바뀌어도 같은 DOM 노드(같은 element 참조)를 유지한다", () => {
    const { rerender } = render(
      <SaveStatus status="dirty" data-testid="status">
        변경됨
      </SaveStatus>,
    );
    const first = screen.getByTestId("status");

    rerender(
      <SaveStatus status="saving" data-testid="status">
        저장 중
      </SaveStatus>,
    );
    const second = screen.getByTestId("status");
    expect(second).toBe(first);

    rerender(
      <SaveStatus status="error" data-testid="status">
        실패
      </SaveStatus>,
    );
    const third = screen.getByTestId("status");
    expect(third).toBe(first);
  });

  it("saving 상태는 기본 아이콘으로 Spinner small을 렌더한다", () => {
    render(
      <SaveStatus status="saving" data-testid="status">
        저장 중
      </SaveStatus>,
    );
    const spinner = screen.getByTestId("status").querySelector(".dds-spinner");
    expect(spinner).not.toBeNull();
    expect(spinner?.classList.contains("dds-spinner--size_small")).toBe(true);
  });

  it("icon prop을 주면 기본 아이콘 대신 렌더된다", () => {
    render(
      <SaveStatus status="saved" icon={<span data-testid="custom-icon">✓</span>}>
        저장됨
      </SaveStatus>,
    );
    expect(screen.getByTestId("custom-icon")).not.toBeNull();
  });

  it("children 문구를 렌더한다", () => {
    render(<SaveStatus status="error">저장 실패</SaveStatus>);
    expect(screen.getByText("저장 실패")).not.toBeNull();
  });
});
