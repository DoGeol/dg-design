import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/Button";
import { DotIcon } from "./dot-icon";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CopyIcon,
  DragHandleIcon,
  ExternalLinkIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from "./Icon";

const ALL_ICONS = [
  { name: "CheckIcon", Comp: CheckIcon },
  { name: "ChevronDownIcon", Comp: ChevronDownIcon },
  { name: "ChevronLeftIcon", Comp: ChevronLeftIcon },
  { name: "ChevronRightIcon", Comp: ChevronRightIcon },
  { name: "ChevronUpIcon", Comp: ChevronUpIcon },
  { name: "CloseIcon", Comp: CloseIcon },
  { name: "CopyIcon", Comp: CopyIcon },
  { name: "DragHandleIcon", Comp: DragHandleIcon },
  { name: "ExternalLinkIcon", Comp: ExternalLinkIcon },
  { name: "MenuIcon", Comp: MenuIcon },
  { name: "MinusIcon", Comp: MinusIcon },
  { name: "MoonIcon", Comp: MoonIcon },
  { name: "PlusIcon", Comp: PlusIcon },
  { name: "SearchIcon", Comp: SearchIcon },
  { name: "SettingsIcon", Comp: SettingsIcon },
  { name: "SunIcon", Comp: SunIcon },
] as const;

describe("Icon", () => {
  it("16종 아이콘 모두 24x24 viewBox, ref, className을 올바르게 전달한다", () => {
    for (const { Comp } of ALL_ICONS) {
      const ref = React.createRef<SVGSVGElement>();
      const { container } = render(<Comp ref={ref} className="custom-class" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
      expect(svg?.classList.contains("custom-class")).toBe(true);
      expect(ref.current).toBe(svg);
    }
  });

  it("size prop (16, 20, 24)에 따라 width, height 속성과 크기 클래스를 적용한다", () => {
    const { rerender, container } = render(<CopyIcon size={16} />);
    let svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("16");
    expect(svg?.getAttribute("height")).toBe("16");
    expect(svg?.classList.contains("dds-icon--size_16")).toBe(true);

    rerender(<CopyIcon size={20} />);
    svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("20");
    expect(svg?.getAttribute("height")).toBe("20");
    expect(svg?.classList.contains("dds-icon--size_20")).toBe(true);

    rerender(<CopyIcon size={24} />);
    svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("24");
    expect(svg?.getAttribute("height")).toBe("24");
    expect(svg?.classList.contains("dds-icon--size_24")).toBe(true);
  });

  it("기본 size는 20이다", () => {
    const { container } = render(<CopyIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("20");
    expect(svg?.getAttribute("height")).toBe("20");
    expect(svg?.classList.contains("dds-icon--size_20")).toBe(true);
  });

  it("label이 주어지면 role='img'와 aria-label을 가지며 aria-hidden이 설정되지 않는다", () => {
    render(<SunIcon label="라이트 모드" />);
    const icon = screen.getByRole("img", { name: "라이트 모드" });
    expect(icon).toBeTruthy();
    expect(icon.getAttribute("aria-hidden")).toBeNull();
    expect(icon.getAttribute("focusable")).toBeNull();
  });

  it("label이 생략되면 aria-hidden='true'와 focusable='false'를 갖고 role='img'가 없다", () => {
    const { container } = render(<SunIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("label이 빈 문자열이나 공백이면 장식 아이콘으로 취급된다", () => {
    const { container, rerender } = render(<MoonIcon label="" />);
    let svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
    expect(screen.queryByRole("img")).toBeNull();

    rerender(<MoonIcon label="   " />);
    svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("DragHandleIcon은 점 도형이 fill='currentColor', stroke='none'이다", () => {
    const { container } = render(<DragHandleIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("fill")).toBe("currentColor");
    expect(svg?.getAttribute("stroke")).toBe("none");
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(6);
  });

  it("인접한 같은 아이콘 여러 개가 렌더링되어도 ID 충돌 없이 안전하다", () => {
    const { container } = render(
      <div>
        <CopyIcon label="첫 번째 복사" />
        <CopyIcon label="두 번째 복사" />
        <CopyIcon />
      </div>,
    );
    expect(screen.getByRole("img", { name: "첫 번째 복사" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "두 번째 복사" })).toBeTruthy();
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(3);
    // 내부에 중복되는 ID나 clipPath/mask/title ID가 없어야 한다
    for (const svg of svgs) {
      expect(svg.querySelectorAll("[id]").length).toBe(0);
    }
  });

  it("SSR 마크업(renderToString)이 문제없이 생성된다", () => {
    const html = renderToString(
      <div>
        <SunIcon size={16} />
        <CopyIcon label="복사" size={20} />
      </div>,
    );
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="복사"');
  });

  describe("부모 Button과의 상호작용 및 키보드 접근성", () => {
    it("Tab 키 이동 시 Icon을 건너뛰고 부모 Button에만 머문다", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button type="button">시작</button>
          <Button iconOnly aria-label="코드 복사">
            <CopyIcon size={20} />
          </Button>
          <button type="button">끝</button>
        </div>,
      );

      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "시작" }));

      await user.tab();
      const copyButton = screen.getByRole("button", { name: "코드 복사" });
      expect(document.activeElement).toBe(copyButton);

      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "끝" }));
    });

    it("클릭, Enter, Space가 부모 행동을 정확히 한 번 실행한다", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Button iconOnly aria-label="복사" onClick={onClick}>
          <CopyIcon size={20} />
        </Button>,
      );

      const button = screen.getByRole("button", { name: "복사" });

      // 클릭 시 한 번 실행
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);

      // 키보드 포커스 후 Enter
      button.focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(2);

      // 키보드 Space
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("트리 셰이킹 및 격리 번들 검증", () => {
    it("CopyIcon 컴포넌트는 독립 모듈로 정의되어 있다", () => {
      expect(CopyIcon.displayName).toBe("CopyIcon");
      expect(SunIcon.displayName).toBe("SunIcon");
      expect(SettingsIcon.displayName).toBe("SettingsIcon");
    });
  });

  describe("비공개 DotIcon", () => {
    it("24x24 viewBox에 채운 원을 렌더링하고 기본 label 미지정 시 aria-hidden='true'이다", () => {
      const ref = React.createRef<SVGSVGElement>();
      const { container } = render(<DotIcon ref={ref} size={16} className="test-dot" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
      expect(svg?.getAttribute("fill")).toBe("currentColor");
      expect(svg?.getAttribute("stroke")).toBe("none");
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      expect(svg?.classList.contains("test-dot")).toBe(true);
      expect(ref.current).toBe(svg);
      const circle = svg?.querySelector("circle");
      expect(circle).toBeTruthy();
      expect(circle?.getAttribute("cx")).toBe("12");
      expect(circle?.getAttribute("cy")).toBe("12");
      expect(circle?.getAttribute("r")).toBe("4.5");
    });
  });
});
