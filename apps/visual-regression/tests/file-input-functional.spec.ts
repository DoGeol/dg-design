import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JSON = path.resolve(
  HERE,
  "../../storybook/storybook-static/index.json",
);

const FUNCTIONAL_DEMO = "fileinput--functional-demo";

/** FileInput 스토리는 병렬 태스크가 만드는 중이라 로컬엔 아직 없을 수 있다 — 실패 대신 스킵. */
function hasStory(id: string): boolean {
  if (!existsSync(INDEX_JSON)) return false;
  const { entries } = JSON.parse(readFileSync(INDEX_JSON, "utf8")) as {
    entries: Record<string, unknown>;
  };
  return id in entries;
}

test.describe("FileInput 기능", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasStory(FUNCTIONAL_DEMO), `스토리 없음: ${FUNCTIONAL_DEMO}`);
    await page.goto(`/iframe.html?id=${FUNCTIONAL_DEMO}&viewMode=story`);
  });

  test("드롭 — DataTransfer로 드롭하면 통과분이 Preview에 반영된다", async ({
    page,
  }) => {
    const dropzone = page
      .locator("#storybook-root .dds-file-input__dropzone")
      .first();
    await expect(dropzone).toBeVisible();

    // 실제 OS 드래그는 못 흉내 내니 Playwright 권장 방식대로 DataTransfer를 브라우저
    // 컨텍스트에서 만들어 'drop' 이벤트에 실어 보낸다.
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      const file = new File(["fake-image-bytes"], "photo.png", {
        type: "image/png",
      });
      dt.items.add(file);
      return dt;
    });

    await dropzone.dispatchEvent("drop", { dataTransfer });

    await expect(
      page.locator("#storybook-root").getByText("photo.png"),
    ).toBeVisible();
  });

  test("Dropzone에 포커스 후 Enter — 숨은 input의 파일 선택 창이 열린다", async ({
    page,
  }) => {
    const dropzone = page
      .locator("#storybook-root .dds-file-input__dropzone")
      .first();
    await dropzone.focus();

    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      dropzone.press("Enter"),
    ]);

    expect(chooser).toBeTruthy();
  });

  test("Trigger만 쓰는 cover-field 형태 — 버튼 클릭으로도 파일 선택 창이 열린다", async ({
    page,
  }) => {
    const trigger = page
      .locator("#storybook-root")
      .getByRole("button", { name: "이미지 선택" });
    await expect(trigger).toBeVisible();

    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      trigger.click(),
    ]);

    expect(chooser).toBeTruthy();
  });
});
