import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest는 test.globals: false가 기본이라 testing-library의 자동 cleanup 훅이
// 걸리지 않는다 — 테스트 간 DOM 누적을 막기 위해 명시적으로 연결한다.
afterEach(() => {
  cleanup();
});
