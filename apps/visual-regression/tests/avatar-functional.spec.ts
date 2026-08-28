import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(HERE, "../../storybook/storybook-static/index.json");
const STATE_MATRIX = "avatar--state-matrix";

function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as { entries: Record<string, unknown> };
  return id in entries;
}

test.describe("Avatar 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(STATE_MATRIX), `스토리 없음: ${STATE_MATRIX}`);
    await page.goto(`/iframe.html?id=${STATE_MATRIX}&viewMode=story`);
  });

  test("성공 이미지는 loaded가 되고 Image만 보인다", async ({ page }) => {
    const root = page.getByTestId("avatar-success");
    const image = root.getByRole("img", { name: "성공한 프로필 이미지" });
    const fallback = root.locator(".dds-avatar__fallback");

    await expect(root).toHaveAttribute("data-loading-state", "loaded");
    await expect(image).toBeVisible();
    await expect(fallback).toBeHidden();
  });

  test("Image 없는 loading은 fallback을 보이고, 실패 src는 error로 전환한다", async ({ page }) => {
    const loading = page.getByTestId("avatar-loading");
    const failed = page.getByTestId("avatar-error");

    await expect(loading).toHaveAttribute("data-loading-state", "loading");
    await expect(loading.locator(".dds-avatar__image")).toHaveCount(0);
    await expect(loading.locator(".dds-avatar__fallback")).toBeVisible();

    await expect(failed).toHaveAttribute("data-loading-state", "error");
    await expect(failed.locator(".dds-avatar__image")).toBeHidden();
    await expect(failed.locator(".dds-avatar__fallback")).toBeVisible();
  });
});
