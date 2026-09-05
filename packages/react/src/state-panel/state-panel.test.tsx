import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { StatePanel } from "./StatePanel";

describe("StatePanel", () => {
  it("Root 밖에서 서브컴포넌트들을 렌더해도 에러 없이 렌더된다", () => {
    expect(() => {
      render(
        <div>
          <StatePanel.Icon data-testid="icon">아이콘</StatePanel.Icon>
          <StatePanel.Title data-testid="title">제목</StatePanel.Title>
          <StatePanel.Description data-testid="desc">설명</StatePanel.Description>
          <StatePanel.Actions data-testid="actions">행동</StatePanel.Actions>
          <StatePanel.Footer data-testid="footer">푸터</StatePanel.Footer>
        </div>,
      );
    }).not.toThrow();

    expect(screen.getByTestId("icon").classList.contains("dds-state-panel__icon")).toBe(true);
    expect(screen.getByTestId("title").classList.contains("dds-state-panel__title")).toBe(true);
    expect(screen.getByTestId("desc").classList.contains("dds-state-panel__description")).toBe(true);
    expect(screen.getByTestId("actions").classList.contains("dds-state-panel__actions")).toBe(true);
    expect(screen.getByTestId("footer").classList.contains("dds-state-panel__footer")).toBe(true);
  });

  it("Loading preset은 role='status'와 aria-live='polite'를 가지고 Spinner와 라벨을 렌더한다", () => {
    render(<StatePanel.Loading label="데이터를 불러오는 중입니다" />);

    const statusPanel = screen.getByRole("status");
    expect(statusPanel.getAttribute("aria-live")).toBe("polite");
    expect(screen.getByText("데이터를 불러오는 중입니다")).not.toBeNull();
    // Spinner가 렌더되는지 확인
    const spinner = statusPanel.querySelector(".dds-spinner");
    expect(spinner).not.toBeNull();
  });

  it("Root의 minHeight prop을 number 또는 string으로 지정하면 스타일에 반영된다", () => {
    const { rerender } = render(
      <StatePanel.Root minHeight={300} data-testid="root">
        <StatePanel.Title>제목</StatePanel.Title>
      </StatePanel.Root>,
    );
    expect((screen.getByTestId("root") as HTMLElement).style.minHeight).toBe("300px");

    rerender(
      <StatePanel.Root minHeight="20rem" data-testid="root">
        <StatePanel.Title>제목</StatePanel.Title>
      </StatePanel.Root>,
    );
    expect((screen.getByTestId("root") as HTMLElement).style.minHeight).toBe("20rem");
  });

  it("Title에 asChild를 주면 슬롯 요소로 태그가 변경된다", () => {
    render(
      <StatePanel.Title asChild>
        <h1>커스텀 레벨 1 제목</h1>
      </StatePanel.Title>,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.tagName).toBe("H1");
    expect(heading.textContent).toBe("커스텀 레벨 1 제목");
    expect(heading.classList.contains("dds-state-panel__title")).toBe(true);
  });

  it("소비자가 Root에 role='alert'을 지정할 수 있다", () => {
    render(
      <StatePanel.Root role="alert">
        <StatePanel.Title>오류 발생</StatePanel.Title>
        <StatePanel.Description>네트워크 오류가 발생했습니다.</StatePanel.Description>
      </StatePanel.Root>,
    );

    expect(screen.getByRole("alert")).not.toBeNull();
  });

  it("전체 compound 구조를 조립할 수 있다", () => {
    render(
      <StatePanel.Root>
        <StatePanel.Icon>
          <span data-testid="custom-icon">⚠️</span>
        </StatePanel.Icon>
        <StatePanel.Title>빈 상태</StatePanel.Title>
        <StatePanel.Description>표시할 내용이 없습니다.</StatePanel.Description>
        <StatePanel.Actions>
          <button type="button">새로고침</button>
        </StatePanel.Actions>
        <StatePanel.Footer>
          <details>
            <summary>기술 정보</summary>
            에러 코드: 404
          </details>
        </StatePanel.Footer>
      </StatePanel.Root>,
    );

    expect(screen.getByText("빈 상태")).not.toBeNull();
    expect(screen.getByText("표시할 내용이 없습니다.")).not.toBeNull();
    expect(screen.getByRole("button", { name: "새로고침" })).not.toBeNull();
    expect(screen.getByText("기술 정보")).not.toBeNull();
  });
});
