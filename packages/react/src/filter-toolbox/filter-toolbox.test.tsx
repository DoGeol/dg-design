import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { FilterChip } from "../chip/Chip";
import { FilterToolbox } from "./FilterToolbox";

describe("FilterToolbox", () => {
  it("Root는 이름 있는 group이고 Count는 status다", () => {
    render(
      <FilterToolbox.Root aria-label="글 필터">
        <FilterToolbox.Chips>
          <FilterChip>내 글</FilterChip>
        </FilterToolbox.Chips>
        <FilterToolbox.Count>12개</FilterToolbox.Count>
        <FilterToolbox.Actions>
          <button type="button">초기화</button>
        </FilterToolbox.Actions>
      </FilterToolbox.Root>,
    );
    const group = screen.getByRole("group", { name: "글 필터" });
    expect(group.contains(screen.getByRole("button", { name: "내 글" }))).toBe(true);
    expect(screen.getByRole("status").textContent).toBe("12개");
    expect(screen.getByRole("status").hasAttribute("aria-live")).toBe(false);
  });

  it("aria-labelledby로도 이름을 준다", () => {
    render(
      <>
        <h2 id="filter-title">필터</h2>
        <FilterToolbox.Root aria-labelledby="filter-title">
          <FilterToolbox.Chips />
        </FilterToolbox.Root>
      </>,
    );
    expect(screen.getByRole("group", { name: "필터" })).toBeTruthy();
  });

  it("이름이 없으면 타입 에러다", () => {
    // @ts-expect-error aria-label·aria-labelledby 둘 다 없음
    render(<FilterToolbox.Root />);
  });
});
