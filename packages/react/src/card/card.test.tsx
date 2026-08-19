import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
  it("기본 렌더는 div에 dds-card 클래스를 붙인다", () => {
    render(<Card>content</Card>);
    const el = screen.getByText("content");
    expect(el.tagName).toBe("DIV");
    expect(el.classList.contains("dds-card")).toBe(true);
  });

  it("asChild면 지정한 요소로 교체되면서 클래스는 유지된다", () => {
    render(
      <Card asChild>
        <section data-testid="section">content</section>
      </Card>,
    );
    const el = screen.getByTestId("section");
    expect(el.tagName).toBe("SECTION");
    expect(el.classList.contains("dds-card")).toBe(true);
  });

  it("className은 기존 클래스 뒤에 병합된다", () => {
    render(<Card className="custom">content</Card>);
    const el = screen.getByText("content");
    expect(el.classList.contains("dds-card")).toBe(true);
    expect(el.classList.contains("custom")).toBe(true);
  });

  it("ref가 실제 DOM 요소로 전달된다", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains("dds-card")).toBe(true);
  });
});
