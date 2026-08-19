import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination.Link", () => {
  it("isActive면 aria-current=page와 활성(weak) 클래스를 갖는다", () => {
    render(
      <Pagination.Link href="?page=2" isActive>
        2
      </Pagination.Link>,
    );
    const link = screen.getByRole("link", { name: "2" });
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.classList.contains("dds-button--variant_weak")).toBe(true);
    expect(link.classList.contains("dds-button--variant_ghost")).toBe(false);
  });

  it("isActive가 아니면 aria-current가 없고 ghost 클래스를 갖는다", () => {
    render(<Pagination.Link href="?page=3">3</Pagination.Link>);
    const link = screen.getByRole("link", { name: "3" });
    expect(link.getAttribute("aria-current")).toBeNull();
    expect(link.classList.contains("dds-button--variant_ghost")).toBe(true);
  });

  it("기본 요소는 a다", () => {
    render(<Pagination.Link href="?page=1">1</Pagination.Link>);
    expect(screen.getByRole("link", { name: "1" }).tagName).toBe("A");
  });

  it("asChild면 지정한 요소로 교체되면서 클래스·aria-current는 유지된다", () => {
    render(
      <Pagination.Link asChild isActive>
        <button type="button" data-testid="router-link">
          4
        </button>
      </Pagination.Link>,
    );
    const el = screen.getByTestId("router-link");
    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("aria-current")).toBe("page");
    expect(el.classList.contains("dds-pagination__link")).toBe(true);
  });

  it("className은 기존 클래스 뒤에 병합된다", () => {
    render(
      <Pagination.Link href="?page=1" className="custom">
        1
      </Pagination.Link>,
    );
    expect(screen.getByRole("link", { name: "1" }).classList.contains("custom")).toBe(true);
  });
});

describe("Pagination.Previous / Pagination.Next", () => {
  it("기본 요소는 a이고 접근 이름은 각각 이전 페이지 · 다음 페이지다", () => {
    render(
      <>
        <Pagination.Previous href="?page=1" />
        <Pagination.Next href="?page=3" />
      </>,
    );
    const previous = screen.getByRole("link", { name: "이전 페이지" });
    const next = screen.getByRole("link", { name: "다음 페이지" });
    expect(previous.tagName).toBe("A");
    expect(next.tagName).toBe("A");
  });

  it("label prop으로 접근 이름을 교체할 수 있다", () => {
    render(<Pagination.Previous href="?page=1" label="Previous" />);
    expect(screen.getByRole("link", { name: "Previous" })).toBeTruthy();
  });

  it("방향 아이콘은 aria-hidden이라 접근성 트리에 노출되지 않는다", () => {
    render(<Pagination.Previous href="?page=1" />);
    const icon = screen.getByRole("link", { name: "이전 페이지" }).querySelector("svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Pagination.Ellipsis", () => {
  it("시각 기호는 aria-hidden이고 sr 전용 텍스트로 '더 많은 페이지'를 제공한다", () => {
    render(<Pagination.Ellipsis />);
    const symbol = screen.getByText("…");
    expect(symbol.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("더 많은 페이지").classList.contains("dds-pagination__sr-only")).toBe(
      true,
    );
  });

  it("label prop으로 sr 텍스트를 교체할 수 있다", () => {
    render(<Pagination.Ellipsis label="More pages" />);
    expect(screen.getByText("More pages")).toBeTruthy();
  });
});

describe("Pagination.Root", () => {
  it("기본 aria-label은 '페이지네이션'이고 nav로 렌더된다", () => {
    render(
      <Pagination.Root>
        <Pagination.List />
      </Pagination.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "페이지네이션" });
    expect(nav.tagName).toBe("NAV");
  });

  it("aria-label을 직접 넘기면 기본값 대신 그 값을 쓴다", () => {
    render(
      <Pagination.Root aria-label="목록 페이지 이동">
        <Pagination.List />
      </Pagination.Root>,
    );
    expect(screen.getByRole("navigation", { name: "목록 페이지 이동" })).toBeTruthy();
  });
});

describe("Pagination 구조", () => {
  it("List는 ul, Item은 li로 렌더된다", () => {
    render(
      <Pagination.Root>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Link href="?page=1">1</Pagination.Link>
          </Pagination.Item>
        </Pagination.List>
      </Pagination.Root>,
    );
    expect(screen.getByRole("list").tagName).toBe("UL");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
