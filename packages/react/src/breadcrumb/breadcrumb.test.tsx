import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb.Root", () => {
  it("기본 aria-label은 '이동 경로'이고 nav로 렌더된다", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List />
      </Breadcrumb.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "이동 경로" });
    expect(nav.tagName).toBe("NAV");
  });

  it("aria-label을 직접 넘기면 기본값 대신 그 값을 쓴다", () => {
    render(
      <Breadcrumb.Root aria-label="장바구니 경로">
        <Breadcrumb.List />
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "장바구니 경로" })).toBeTruthy();
  });
});

describe("Breadcrumb 구조", () => {
  it("List는 ol, Item은 li로 렌더된다", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">홈</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]?.tagName).toBe("LI");
  });
});

describe("Breadcrumb.Link", () => {
  it("기본 요소는 a다", () => {
    render(<Breadcrumb.Link href="/admin">관리자</Breadcrumb.Link>);
    expect(screen.getByRole("link", { name: "관리자" }).tagName).toBe("A");
  });

  it("asChild면 지정한 요소로 교체되면서 클래스는 유지된다", () => {
    render(
      <Breadcrumb.Link asChild>
        <button type="button" data-testid="router-link">
          관리자
        </button>
      </Breadcrumb.Link>,
    );
    const el = screen.getByTestId("router-link");
    expect(el.tagName).toBe("BUTTON");
    expect(el.classList.contains("dds-breadcrumb__link")).toBe(true);
  });

  it("className은 기존 클래스 뒤에 병합된다", () => {
    render(
      <Breadcrumb.Link href="/" className="custom">
        홈
      </Breadcrumb.Link>,
    );
    expect(screen.getByRole("link", { name: "홈" }).classList.contains("custom")).toBe(true);
  });
});

describe("Breadcrumb.Page", () => {
  it("aria-current=page를 갖고 span으로 렌더된다(링크가 아니다)", () => {
    render(<Breadcrumb.Page>사용자</Breadcrumb.Page>);
    const page = screen.getByText("사용자");
    expect(page.tagName).toBe("SPAN");
    expect(page.getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "사용자" })).toBeNull();
  });
});

describe("Breadcrumb.Separator", () => {
  it("aria-hidden이고 기본 기호는 '/'다", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Separator data-testid="sep" />
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    const sep = screen.getByTestId("sep");
    expect(sep.getAttribute("aria-hidden")).toBe("true");
    expect(sep.textContent).toBe("/");
  });

  it("children을 주면 기본 기호 대신 그것을 렌더한다", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Separator data-testid="sep">{">"}</Breadcrumb.Separator>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByTestId("sep").textContent).toBe(">");
  });
});
