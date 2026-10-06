import { expect, test } from "@playwright/test";

/**
 * 부유 패널은 다크에서 표면색이 페이지와 같고 어두운 그림자도 묻혀, 테두리가 없으면 경계가
 * 사라진다(docs/decisions/2026-10-06-floating-panel-border.md). 스크린샷 기준은 linux에만 있고
 * 1px 선은 maxDiffPixelRatio 안에 숨을 수 있어, 테두리를 계산값으로 직접 고정한다.
 *
 * ContextMenu는 dropdown-menu, MultiSelect는 select, DatePicker 팝오버는 popover 클래스를
 * 그대로 쓰므로 따로 열지 않는다. Sheet는 화면 안쪽 변 하나에만 선을 긋는다.
 */
const PANELS = [
  { story: "dialog--state-matrix-story", selector: ".dds-dialog__content", edges: 4 },
  { story: "popover--state-matrix-story", selector: ".dds-popover__content", edges: 4 },
  { story: "hovercard--functional-demo", selector: ".dds-hover-card__content", edges: 4 },
  { story: "dropdownmenu--state-matrix-story", selector: ".dds-dropdown-menu__content", edges: 4 },
  { story: "select--state-matrix-story", selector: ".dds-select__content", edges: 4 },
  { story: "sheet--state-matrix", selector: ".dds-sheet__content", edges: 1 },
];

for (const { story, selector, edges } of PANELS) {
  test(`${story} · dark 패널 경계`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story&globals=theme:dark`);
    await expect(page.locator("html")).toHaveAttribute("data-dds-theme", "dark");

    const panels = page.locator(selector);
    await expect(panels.first()).toBeVisible();

    // 선이 있어도 표면과 같은 색이면 없는 것과 같다 — 폭과 색을 함께 본다.
    const visibleEdges = await panels.evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node);
        return (["Top", "Right", "Bottom", "Left"] as const).filter(
          (side) =>
            style[`border${side}Width`] === "1px" &&
            style[`border${side}Color`] !== style.backgroundColor,
        ).length;
      }),
    );
    expect(visibleEdges).toEqual(visibleEdges.map(() => edges));
  });
}
