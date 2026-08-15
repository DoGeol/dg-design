import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest는 test.globals: false가 기본이라 testing-library의 자동 cleanup 훅이
// 걸리지 않는다 — 테스트 간 DOM 누적을 막기 위해 명시적으로 연결한다.
afterEach(() => {
  cleanup();
});

// jsdom에는 ResizeObserver·IntersectionObserver가 없어 floating-ui의 autoUpdate가
// 생성자에서 바로 죽는다. 위치 계산은 Playwright·VR이 맡으므로 여기서는 no-op으로 세운다.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

for (const name of ["ResizeObserver", "IntersectionObserver"] as const) {
  if (!(name in globalThis)) {
    Object.defineProperty(globalThis, name, { value: NoopObserver, writable: true });
  }
}
