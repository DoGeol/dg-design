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

  describe("완료 아이콘 교차 전환", () => {
    /** 아이콘 영역. 전환 여부는 data-crossfade, 사라지는 스피너는 레이어 존재로 본다 —
     * 실제 프레임·opacity는 jsdom이 판정할 수 없어 브라우저 기능 테스트가 맡는다. */
    const icon = (el: HTMLElement) =>
      el.querySelector<HTMLElement>(".dds-save-status__icon")!;
    const spinnerLayer = (el: HTMLElement) => el.querySelectorAll('[data-layer="spinner"]').length;

    it("최초 렌더가 saved여도 전환을 켜지 않는다", () => {
      render(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
      expect(spinnerLayer(el)).toBe(0);
      expect(icon(el).getAttribute("aria-hidden")).toBe("true");
    });

    it("saving → saved면 전환을 켜고 사라지는 Spinner 레이어를 남긴다", () => {
      const { rerender } = render(
        <SaveStatus status="saving" data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");
      const label = el.querySelector(".dds-save-status__label");

      rerender(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(true);
      expect(spinnerLayer(el)).toBe(1);
      // live region DOM identity: 바깥 span도 label 노드도 그대로여야 변경이 낭독된다.
      expect(screen.getByTestId("status")).toBe(el);
      expect(el.querySelector(".dds-save-status__label")).toBe(label);
      expect(screen.getByText("저장됨")).not.toBeNull();
    });

    it("status가 그대로인 리렌더는 전환을 끊지 않는다", () => {
      const { rerender } = render(
        <SaveStatus status="saving" data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");

      rerender(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      rerender(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(true);
      expect(spinnerLayer(el)).toBe(1);
    });

    it("saving → error와 dirty → saved는 전환을 켜지 않는다", () => {
      const { rerender } = render(
        <SaveStatus status="saving" data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");

      rerender(
        <SaveStatus status="error" data-testid="status">
          저장 실패
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
      expect(spinnerLayer(el)).toBe(0);

      rerender(
        <SaveStatus status="dirty" data-testid="status">
          변경됨
        </SaveStatus>,
      );
      rerender(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
    });

    it("전환 도중 dirty가 오면 즉시 취소한다", () => {
      const { rerender } = render(
        <SaveStatus status="saving" data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");

      rerender(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      rerender(
        <SaveStatus status="dirty" data-testid="status">
          변경됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
      expect(spinnerLayer(el)).toBe(0);
      expect(el.classList.contains("dds-save-status--status_dirty")).toBe(true);
    });

    it('motion="none"이면 전환을 켜지 않고 motion은 DOM에 새지 않는다', () => {
      const { rerender } = render(
        <SaveStatus status="saving" motion="none" data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");

      rerender(
        <SaveStatus status="saved" motion="none" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
      expect(spinnerLayer(el)).toBe(0);
      expect(el.hasAttribute("motion")).toBe(false);
    });

    it("전환 도중 motion=none으로 바뀌면 그 자리에서 꺼진다", () => {
      const { rerender } = render(
        <SaveStatus status="saving" data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");

      rerender(
        <SaveStatus status="saved" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(true);

      rerender(
        <SaveStatus status="saved" motion="none" data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
      expect(spinnerLayer(el)).toBe(0);
    });

    it("커스텀 icon은 전환 없이 단일 렌더 경로를 유지한다", () => {
      const custom = <span data-testid="custom-icon">✓</span>;
      const { rerender } = render(
        <SaveStatus status="saving" icon={custom} data-testid="status">
          저장 중
        </SaveStatus>,
      );
      const el = screen.getByTestId("status");

      rerender(
        <SaveStatus status="saved" icon={custom} data-testid="status">
          저장됨
        </SaveStatus>,
      );
      expect(icon(el).hasAttribute("data-crossfade")).toBe(false);
      expect(el.querySelectorAll("[data-layer]").length).toBe(0);
      expect(screen.getByTestId("custom-icon")).not.toBeNull();
    });
  });
});
