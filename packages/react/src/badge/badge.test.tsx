import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("outline variant는 dds-badge--variant_outline 클래스를 붙인다", () => {
    render(<Badge variant="outline">outline</Badge>);
    expect(screen.getByText("outline").classList.contains("dds-badge--variant_outline")).toBe(
      true,
    );
  });

  it.each(["brand", "neutral", "critical", "positive", "warning", "informative"] as const)(
    "outline + intent=%s는 intent 클래스도 함께 붙인다",
    (intent) => {
      render(
        <Badge variant="outline" intent={intent}>
          {intent}
        </Badge>,
      );
      const el = screen.getByText(intent);
      expect(el.classList.contains("dds-badge--variant_outline")).toBe(true);
      expect(el.classList.contains(`dds-badge--intent_${intent}`)).toBe(true);
    },
  );

  it("variant 기본값은 여전히 weak다 (outline 추가로 인한 회귀 없음)", () => {
    render(<Badge>기본</Badge>);
    expect(screen.getByText("기본").classList.contains("dds-badge--variant_weak")).toBe(true);
  });
});
