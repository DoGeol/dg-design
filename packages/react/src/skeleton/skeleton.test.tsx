import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("기본 radius는 medium이다", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton").classList.contains("dds-skeleton--radius_medium")).toBe(
      true,
    );
  });

  it.each(["none", "small", "medium", "full"] as const)(
    "radius=%s는 대응하는 radius 클래스를 붙인다",
    (radius) => {
      render(<Skeleton radius={radius} data-testid={`skeleton-${radius}`} />);

      const skeleton = screen.getByTestId(`skeleton-${radius}`);
      expect(skeleton.classList.contains(`dds-skeleton--radius_${radius}`)).toBe(true);
    },
  );

  it("임의의 크기·네이티브 div 속성·className·style을 보존한다", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        id="loading-card"
        title="로딩 중"
        className="custom-skeleton"
        style={{ width: "13rem", height: "2.5rem" }}
      />,
    );

    const skeleton = screen.getByTestId("skeleton") as HTMLDivElement;
    expect(skeleton.id).toBe("loading-card");
    expect(skeleton.title).toBe("로딩 중");
    expect(skeleton.classList.contains("dds-skeleton")).toBe(true);
    expect(skeleton.classList.contains("custom-skeleton")).toBe(true);
    expect(skeleton.style.width).toBe("13rem");
    expect(skeleton.style.height).toBe("2.5rem");
  });

  it("기본적으로 aria-hidden=true이고 명시한 값은 보존한다", () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").getAttribute("aria-hidden")).toBe("true");

    rerender(<Skeleton aria-hidden={false} data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").getAttribute("aria-hidden")).toBe("false");
  });

  it("사용자가 전달한 role은 추가하지 않거나 덮어쓰지 않는다", () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").getAttribute("role")).toBeNull();

    rerender(<Skeleton role="status" data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton").getAttribute("role")).toBe("status");
  });

  it("ref가 루트 div를 가리킨다", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains("dds-skeleton")).toBe(true);
  });
});
