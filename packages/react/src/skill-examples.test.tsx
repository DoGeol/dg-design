/// <reference types="vite/client" />

import { render } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * 스킬 예제 스모크 — 타입 검사(tsconfig.skill.json)가 못 잡는 런타임 에러·React 경고를 잡는다.
 * 예제 파일이 export한 함수 컴포넌트를 전부 기본 props로 렌더한다. 모양은 보지 않는다.
 */
const modules = import.meta.glob<Record<string, unknown>>("../skill-src/*.tsx", { eager: true });

describe("skill 예제", () => {
  const errors = vi.spyOn(console, "error");
  const warns = vi.spyOn(console, "warn");
  afterEach(() => {
    errors.mockClear();
    warns.mockClear();
  });

  for (const [path, mod] of Object.entries(modules)) {
    for (const [name, Example] of Object.entries(mod)) {
      if (typeof Example !== "function") continue;
      it(`${path.split("/").pop()} ${name}`, () => {
        const Component = Example as React.ComponentType;
        render(<Component />);
        expect(errors).not.toHaveBeenCalled();
        expect(warns).not.toHaveBeenCalled();
      });
    }
  }
});
