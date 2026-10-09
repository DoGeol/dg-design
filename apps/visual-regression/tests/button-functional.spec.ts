import { expect, test } from "@playwright/test";

/** xsmall은 보이는 크기 28 그대로, 모바일 밀도에서만 조작 영역이 44로 넓어진다. */
test("Button xsmall: 높이 28, 모바일만 조작 영역 44", async ({ page }) => {
  await page.goto("/iframe.html?id=button--xsmall-touch-demo&viewMode=story");
  for (const density of ["desktop", "mobile"]) {
    const button = page.getByRole("button", { name: `추가 ${density}` });
    expect(await button.evaluate((el) => (el as HTMLElement).offsetHeight)).toBe(28);
    // 중심에서 위아래 21px 지점을 눌렀을 때 버튼이 잡히면 44 영역이 있다(의사요소는 소유 요소로 잡힌다).
    const hits = await button.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return [-21, 21].map((dy) => {
        const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2 + dy);
        return hit !== null && el.contains(hit);
      });
    });
    expect(hits).toEqual(density === "mobile" ? [true, true] : [false, false]);
  }
});
