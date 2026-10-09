import { expect, test, type Locator } from "@playwright/test";

/**
 * 닫기·제거 X의 hover 표시는 원이고, 누르는 영역과 분리한다.
 * Chip은 버튼(칩 높이 정사각) 안쪽 content-box만 칠해 칩 가장자리에 붙지 않는다.
 */
async function plate(target: Locator) {
  await target.hover();
  return target.evaluate((el) => {
    const s = getComputedStyle(el);
    const pad = parseFloat(s.paddingTop);
    return {
      box: (el as HTMLElement).offsetHeight,
      size: (el as HTMLElement).offsetHeight - pad * 2,
      clip: s.backgroundClip,
      radius: s.borderRadius,
      painted: s.backgroundColor !== "rgba(0, 0, 0, 0)",
    };
  });
}

// DensityColumns: 첫 열이 데스크톱, data-dds-density="mobile" 열이 모바일.
const column = { desktop: "#storybook-root section >> nth=0", mobile: '#storybook-root [data-dds-density="mobile"]' };

test("Chip 제거: hover 원은 칩 높이보다 작고 칩 가장자리에서 떨어진다", async ({ page }) => {
  await page.goto("/iframe.html?id=chip--state-matrix&viewMode=story");
  for (const [density, chipHeight, size] of [["desktop", 24, 18], ["mobile", 32, 20]] as const) {
    const p = await plate(page.locator(column[density]).getByRole("button", { name: "디자인 제거" }));
    expect(p).toMatchObject({ box: chipHeight, size, clip: "content-box", radius: "50%", painted: true });
  }
});

test("Alert·Toast 닫기: hover 표시는 원 24", async ({ page }) => {
  await page.goto("/iframe.html?id=alert--state-matrix&viewMode=story");
  expect(await plate(page.locator(".dds-alert__close").first())).toMatchObject({ size: 24, radius: "50%", painted: true });

  await page.goto("/iframe.html?id=toast--state-matrix&viewMode=story");
  expect(await plate(page.locator(".dds-toast__close").first())).toMatchObject({ size: 24, radius: "50%", painted: true });
});
