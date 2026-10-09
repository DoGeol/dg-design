import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import pkg from "./package.json" with { type: "json" };

// 스킬 예제(skill-src)는 소비자처럼 `@dg-design/react/<하위 경로>`로 import한다.
// 테스트는 빌드 없이 돌도록 exports의 dist 경로를 같은 이름의 src 파일로 돌려 놓는다.
const subpathAliases = Object.entries(pkg.exports).flatMap(([key, value]) => {
  if (typeof value !== "object" || !("default" in value) || !key.startsWith("./")) return [];
  const base = fileURLToPath(new URL(value.default.replace("./dist/", "./src/").replace(/\.js$/, ""), import.meta.url));
  const file = [".tsx", ".ts"].map((ext) => base + ext).find(existsSync);
  return file ? [{ find: new RegExp(`^@dg-design/react/${key.slice(2)}$`), replacement: file }] : [];
});

// vite.config.ts(lib 빌드)와 별개 파일 — 테스트는 빌드 산출물 설정과 무관하다.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: subpathAliases },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
