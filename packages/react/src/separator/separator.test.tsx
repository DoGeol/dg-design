import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Separator } from "./Separator";

describe("Separator", () => {
  it("기본은 수평 decorative separator다", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator.classList.contains("dds-separator")).toBe(true);
    expect(separator.classList.contains("dds-separator--orientation_horizontal")).toBe(true);
    expect(separator.getAttribute("aria-hidden")).toBe("true");
    expect(separator.getAttribute("role")).toBeNull();
  });

  it("vertical orientation은 대응하는 클래스를 붙인다", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator.classList.contains("dds-separator--orientation_vertical")).toBe(true);
    expect(separator.classList.contains("dds-separator--orientation_horizontal")).toBe(false);
  });

  it("decorative=false면 separator role과 orientation을 노출한다", () => {
    render(<Separator decorative={false} orientation="vertical" />);

    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-hidden")).toBeNull();
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("명시한 role·ARIA 속성은 기본값보다 우선한다", () => {
    render(
      <Separator
        decorative={false}
        role="presentation"
        aria-hidden={false}
        aria-orientation="horizontal"
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId("separator");
    expect(separator.getAttribute("role")).toBe("presentation");
    expect(separator.getAttribute("aria-hidden")).toBe("false");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("decorative에서도 명시한 role을 제거하지 않는다", () => {
    render(<Separator role="presentation" data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator.getAttribute("role")).toBe("presentation");
    expect(separator.getAttribute("aria-hidden")).toBe("true");
  });

  it("className·style·네이티브 속성·ref를 전달한다", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Separator
        ref={ref}
        className="custom-separator"
        style={{ width: "40%", marginInline: "auto" }}
        title="콘텐츠 구분"
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId("separator") as HTMLDivElement;
    expect(separator.classList.contains("custom-separator")).toBe(true);
    expect(separator.style.width).toBe("40%");
    expect(separator.style.marginInline).toBe("auto");
    expect(separator.title).toBe("콘텐츠 구분");
    expect(ref.current).toBe(separator);
  });
});
