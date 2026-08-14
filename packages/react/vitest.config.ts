import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// vite.config.ts(lib 빌드)와 별개 파일 — 테스트는 빌드 산출물 설정과 무관하다.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
