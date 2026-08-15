import { defineConfig } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "./tests",
  // {platform}로 기준 이미지를 OS별로 격리한다. 기준은 linux(CI)만 커밋되므로
  // macOS 로컬 실행은 항상 "기준 없음 → 스킵"이 되고, 폰트 차이로 인한 거짓 diff가 원천 차단된다.
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  // 기본값('missing')이면 기준 없는 스토리가 조용히 기록된다. 갱신은 CI 전용 경로로만.
  updateSnapshots: "none",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      scale: "css",
      maxDiffPixelRatio: 0.005,
    },
  },
  webServer: {
    command: `pnpm --filter @dg-design/storybook exec vite preview --outDir storybook-static --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/iframe.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
