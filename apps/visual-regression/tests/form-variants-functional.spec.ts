import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * P6 box·line 계약 — 모바일 밀도에서만 외관이 바뀌고, box도 입력 경계(stroke-neutral)를 지운다면 실패한다.
 * 계산 스타일은 jsdom이 CSS를 해석하지 않아 여기서 읽는다.
 */
const style = (locator: Locator) =>
  locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      top: s.borderTopWidth,
      left: s.borderLeftWidth,
      bottom: s.borderBottomWidth,
      bottomColor: s.borderBottomColor,
      radius: s.borderTopLeftRadius,
      shadow: s.boxShadow,
    };
  });

// 토큰 값을 같은 요소 문맥에서 색으로 풀어 비교한다(다크·밀도 무관).
const token = async (page: Page, name: string) => {
  await page.locator("[data-dds-density='mobile']").waitFor();
  return page.evaluate((n) => {
    const probe = document.createElement("div");
    probe.style.color = `var(${n})`;
    document.querySelector("[data-dds-density='mobile']")!.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  }, name);
};

const columns = (page: Page) => ({
  desktop: page.locator("#storybook-root section").first(),
  mobile: page.locator('#storybook-root [data-dds-density="mobile"]'),
});

test("TextField box·line: 모바일만 바뀌고 데스크톱은 outline", async ({ page }) => {
  await page.goto("/iframe.html?id=textfield--variant-state-matrix&viewMode=story");
  const { desktop, mobile } = columns(page);
  const stroke = await token(page, "--dds-color-stroke-neutral");
  const weakBg = await token(page, "--dds-color-bg-neutral-weak");

  const box = mobile.getByRole("textbox", { name: "default" }).first();
  const boxStyle = await style(box);
  expect(boxStyle.bg).toBe(weakBg);
  expect(boxStyle.top).toBe("1px");
  expect(boxStyle.bottomColor).toBe(stroke);

  // line default는 suffix가 있어 wrapper가 외관을 갖는다
  const lineWrapper = mobile.getByRole("textbox", { name: "default" }).nth(1).locator("..");
  const lineStyle = await style(lineWrapper);
  expect([lineStyle.top, lineStyle.left, lineStyle.bottom, lineStyle.radius]).toEqual(["0px", "0px", "1px", "0px"]);
  expect(lineStyle.bg).toBe("rgba(0, 0, 0, 0)");

  const readonlyLine = mobile.getByRole("textbox", { name: "readonly" }).nth(1);
  expect((await style(readonlyLine)).bg).toBe("rgba(0, 0, 0, 0)");

  const desktopBox = await style(desktop.getByRole("textbox", { name: "default" }).first());
  expect(desktopBox.bg).not.toBe(weakBg);
  expect(desktopBox.top).toBe("1px");
  const desktopLine = await style(desktop.getByRole("textbox", { name: "default" }).nth(1).locator(".."));
  expect(desktopLine.top).toBe("1px");
});

test("TextField line: focus는 아래만 2px", async ({ page }) => {
  await page.goto("/iframe.html?id=textfield--variant-state-matrix&viewMode=story");
  const line = columns(page).mobile.getByRole("textbox", { name: "invalid" }).nth(1);
  await line.focus();
  await page.keyboard.press("End");
  const s = await style(line);
  expect(s.shadow).toContain("inset");
  expect(s.shadow).toMatch(/0px -1px 0px 0px/);
});

test("TextArea box·line: 모바일만 바뀌고 line은 크기 조절 손잡이가 없다", async ({ page }) => {
  await page.goto("/iframe.html?id=textarea--variant-state-matrix&viewMode=story");
  const { desktop, mobile } = columns(page);
  const weakBg = await token(page, "--dds-color-bg-neutral-weak");

  expect((await style(mobile.getByRole("textbox", { name: "box default" }))).bg).toBe(weakBg);
  const line = mobile.getByRole("textbox", { name: "line default" });
  const s = await style(line);
  expect([s.top, s.bottom, s.radius]).toEqual(["0px", "1px", "0px"]);
  expect(await line.evaluate((el) => getComputedStyle(el).resize)).toBe("none");

  expect((await style(desktop.getByRole("textbox", { name: "box default" }))).bg).not.toBe(weakBg);
  expect((await style(desktop.getByRole("textbox", { name: "line default" }))).top).toBe("1px");
});
