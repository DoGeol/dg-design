import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);
const SNAPSHOT_DIR = path.join(HERE, "__screenshots__", process.platform);

/** 매트릭스류 스토리 판별. 없는 컴포넌트는 첫 스토리로 폴백해 커버리지를 보장한다. */
const MATRIX_STORY = /matrix|combination/i;
const THEMES = ["light", "dark"] as const;

type Entry = { id: string; title: string; type?: string };

function targetStories(): Entry[] {
  if (!existsSync(INDEX_JSON)) {
    throw new Error(
      `Storybook 정적 빌드가 없다: ${INDEX_JSON}\n먼저 'pnpm --filter @dg-design/storybook run build'를 실행한다.`,
    );
  }

  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, Entry>;
  };

  const byTitle = new Map<string, Entry[]>();
  for (const entry of Object.values(entries)) {
    if (entry.type && entry.type !== "story") continue;
    const group = byTitle.get(entry.title);
    if (group) group.push(entry);
    else byTitle.set(entry.title, [entry]);
  }

  return [...byTitle.values()].flatMap((group) => {
    const matrix = group.filter((entry) => MATRIX_STORY.test(entry.id));
    return matrix.length > 0 ? matrix : group.slice(0, 1);
  });
}

for (const story of targetStories()) {
  for (const theme of THEMES) {
    test(`${story.id} · ${theme}`, async ({ page }, testInfo) => {
      const snapshot = `${story.id}-${theme}.png`;

      if (testInfo.config.updateSnapshots === "none") {
        test.skip(
          !existsSync(path.join(SNAPSHOT_DIR, snapshot)),
          `기준 이미지 없음 (${process.platform}/${snapshot}) — visual-baseline 워크플로에서 생성한다`,
        );
      } else if (process.platform !== "linux") {
        throw new Error(
          "기준 이미지는 ubuntu CI에서만 생성·갱신한다. 로컬 --update-snapshots는 폰트 차이로 거짓 diff를 만든다.",
        );
      }

      await page.goto(
        `/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`,
      );

      const root = page.locator("#storybook-root");
      await expect(root.locator(":scope > *").first()).toBeVisible();

      // 테마 주입이 조용히 실패하면 다크 스크린샷이 라이트와 같아진다 — 실제 속성으로 확인한다.
      if (theme === "dark") {
        await expect(page.locator("html")).toHaveAttribute(
          "data-dds-theme",
          "dark",
        );
      }

      // Storybook 기본 배경은 흰색 고정이라 다크 스냅샷이 읽히지 않는다.
      await page.addStyleTag({
        content: "body{background:var(--dds-color-bg-layer-default)}",
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
      });

      await expect(root).toHaveScreenshot(snapshot);
    });
  }
}
