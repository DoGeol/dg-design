import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "./Avatar";

function TestAvatar(props: Partial<React.ComponentProps<typeof Avatar.Image>> = {}) {
  return (
    <Avatar.Root>
      <Avatar.Image alt="프로필" src="/profile.png" {...props} />
      <Avatar.Fallback>DG</Avatar.Fallback>
    </Avatar.Root>
  );
}

describe("Avatar", () => {
  it("초기에는 loading 상태와 fallback을 표시한다", () => {
    render(<TestAvatar />);
    const image = screen.getByAltText("프로필");
    const fallback = screen.getByText("DG");

    expect(image.getAttribute("data-loading-state")).toBe("loading");
    expect(image.hidden).toBe(true);
    expect(fallback.hidden).toBe(false);
    expect(fallback.parentElement?.getAttribute("data-loading-state")).toBe("loading");
  });

  it("load와 error 이벤트에 맞춰 Image와 Fallback을 전환하고 사용자 이벤트를 보존한다", () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    render(<TestAvatar onLoad={onLoad} onError={onError} />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(image.hidden).toBe(false);
    expect(screen.getByText("DG").hidden).toBe(true);

    act(() => image.dispatchEvent(new Event("error", { bubbles: true })));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(image.hidden).toBe(true);
    expect(screen.getByText("DG").hidden).toBe(false);
  });

  it("src 변경 시 loading으로 되돌린 뒤 새 load와 error 상태를 반영한다", () => {
    const { rerender } = render(<TestAvatar src="/first-profile.png" />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(image.hidden).toBe(false);

    rerender(<TestAvatar src="/second-profile.png" />);
    expect(image.getAttribute("data-loading-state")).toBe("loading");
    expect(image.hidden).toBe(true);
    expect(screen.getByText("DG").hidden).toBe(false);

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(image.hidden).toBe(false);
    expect(screen.getByText("DG").hidden).toBe(true);

    act(() => image.dispatchEvent(new Event("error", { bubbles: true })));
    expect(image.hidden).toBe(true);
    expect(screen.getByText("DG").hidden).toBe(false);
  });

  it.each([
    ["small", "dds-avatar--size_small"],
    ["medium", "dds-avatar--size_medium"],
    ["large", "dds-avatar--size_large"],
    ["xlarge", "dds-avatar--size_xlarge"],
  ] as const)("size=%s 클래스를 적용하고 Badge를 Root 안에 배치한다", (size, className) => {
    render(
      <Avatar.Root size={size}>
        <Avatar.Fallback>DG</Avatar.Fallback>
        <Avatar.Badge data-testid="badge">online</Avatar.Badge>
      </Avatar.Root>,
    );
    const avatar = screen.getByText("DG").parentElement!;
    expect(avatar.classList.contains(className)).toBe(true);
    expect(screen.getByTestId("badge").classList.contains("dds-avatar__badge")).toBe(true);
  });

  it("hydration 뒤 complete 이미지의 natural size로 캐시 결과를 판정한다", () => {
    render(
      <Avatar.Root>
        <Avatar.Image
          alt="캐시된 프로필"
          src="/cached-profile.png"
          ref={(image) => {
            if (!image) return;
            Object.defineProperties(image, {
              complete: { configurable: true, value: true },
              naturalWidth: { configurable: true, value: 20 },
              naturalHeight: { configurable: true, value: 20 },
            });
          }}
        />
        <Avatar.Fallback>DG</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByAltText("캐시된 프로필").hidden).toBe(false);
  });

  it("hydration 뒤 natural size가 0인 complete 이미지는 캐시 error로 판정한다", () => {
    render(
      <Avatar.Root>
        <Avatar.Image
          alt="실패한 캐시 프로필"
          src="/missing-profile.png"
          ref={(image) => {
            if (!image) return;
            Object.defineProperties(image, {
              complete: { configurable: true, value: true },
              naturalWidth: { configurable: true, value: 0 },
              naturalHeight: { configurable: true, value: 0 },
            });
          }}
        />
        <Avatar.Fallback>DG</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = screen.getByAltText("실패한 캐시 프로필");
    expect(image.getAttribute("data-loading-state")).toBe("error");
    expect(image.hidden).toBe(true);
    expect(screen.getByText("DG").hidden).toBe(false);
  });

  it("기본 motion은 none이라 네트워크 load도 페이드 없이 즉시 바뀐다", () => {
    render(<TestAvatar />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(image.hasAttribute("data-fade")).toBe(false);
    expect(screen.getByText("DG").hidden).toBe(true);
  });

  it("Image ref를 소비자에게 전달한다", () => {
    const ref = React.createRef<HTMLImageElement>();
    render(
      <Avatar.Root>
        <Avatar.Image ref={ref} alt="프로필" src="/profile.png" />
        <Avatar.Fallback>DG</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(ref.current).toBe(screen.getByAltText("프로필"));
  });
});

/** 프레임·좌표는 jsdom이 판정할 수 없어 브라우저 기능 테스트가 맡는다 — 상태 배선만 본다. */
describe("Avatar motion=auto", () => {
  function AutoAvatar({
    motion = "auto",
    ...props
  }: Partial<React.ComponentProps<typeof Avatar.Image>> & { motion?: "auto" | "none" } = {}) {
    return (
      <Avatar.Root motion={motion}>
        <Avatar.Image alt="프로필" src="/profile.png" {...props} />
        <Avatar.Fallback>DG</Avatar.Fallback>
      </Avatar.Root>
    );
  }
  const fallback = () => screen.getByText("DG");
  /** jsdom의 rAF는 다음 매크로태스크에 돈다. */
  const nextFrame = () => act(async () => void (await new Promise((r) => setTimeout(r, 20))));

  it("네트워크 load는 시작 프레임을 거쳐 전환하고, 그동안 fallback을 장식으로 남긴다", async () => {
    render(<AutoAvatar />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    // 의미 상태는 전환을 기다리지 않는다.
    expect(image.getAttribute("data-loading-state")).toBe("loaded");
    expect(image.hidden).toBe(false);
    expect(image.getAttribute("data-fade")).toBe("start");
    // 빈 자리가 보이지 않게 fallback은 남기되 접근성 트리에서는 뺀다.
    expect(fallback().hidden).toBe(false);
    expect(fallback().getAttribute("aria-hidden")).toBe("true");

    await nextFrame();
    expect(image.getAttribute("data-fade")).toBe("run");

    act(() => image.dispatchEvent(new Event("transitionend", { bubbles: true })));
    expect(image.hasAttribute("data-fade")).toBe(false);
    expect(fallback().hidden).toBe(true);
    expect(fallback().hasAttribute("aria-hidden")).toBe(false);
  });

  it("캐시 완료 이미지는 페이드 없이 즉시 표시한다(뒤늦은 load 이벤트도 페이드를 켜지 않는다)", async () => {
    render(
      <Avatar.Root motion="auto">
        <Avatar.Image
          alt="캐시된 프로필"
          src="/cached.png"
          ref={(image) => {
            if (!image) return;
            Object.defineProperties(image, {
              complete: { configurable: true, value: true },
              naturalWidth: { configurable: true, value: 20 },
              naturalHeight: { configurable: true, value: 20 },
            });
          }}
        />
        <Avatar.Fallback>DG</Avatar.Fallback>
      </Avatar.Root>,
    );
    const image = screen.getByAltText("캐시된 프로필");

    expect(image.hidden).toBe(false);
    expect(image.hasAttribute("data-fade")).toBe(false);
    expect(fallback().hidden).toBe(true);

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    await nextFrame();
    expect(image.hasAttribute("data-fade")).toBe(false);
  });

  it("오류는 페이드를 취소하고 fallback을 즉시 되돌린다", async () => {
    render(<AutoAvatar />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(image.getAttribute("data-fade")).toBe("start");

    act(() => image.dispatchEvent(new Event("error", { bubbles: true })));
    expect(image.getAttribute("data-loading-state")).toBe("error");
    expect(image.hidden).toBe(true);
    expect(image.hasAttribute("data-fade")).toBe(false);
    expect(fallback().hidden).toBe(false);

    await nextFrame();
    expect(image.hasAttribute("data-fade")).toBe(false);
  });

  it("src를 갈아끼우면 진행 중 페이드를 취소하고 이전 이미지를 남기지 않는다", async () => {
    const { rerender } = render(<AutoAvatar src="/first.png" />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(image.getAttribute("data-fade")).toBe("start");

    rerender(<AutoAvatar src="/second.png" />);
    expect(image.getAttribute("data-loading-state")).toBe("loading");
    expect(image.hidden).toBe(true);
    expect(image.hasAttribute("data-fade")).toBe(false);
    await nextFrame();
    expect(image.hasAttribute("data-fade")).toBe(false);
  });

  it("이전 src의 늦은 load 이벤트는 상태를 덮지 않지만 소비자 콜백은 그대로 부른다", () => {
    const onLoad = vi.fn();
    render(<AutoAvatar src="/current.png" onLoad={onLoad} />);
    const image = screen.getByAltText("프로필");

    // 이전 요청이 늦게 도착한 상황 — 이벤트의 src가 지금 걸린 src와 다르다.
    image.setAttribute("src", "/stale.png");
    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(image.getAttribute("data-loading-state")).toBe("loading");
    expect(image.hasAttribute("data-fade")).toBe(false);
  });

  it("motion을 도중에 꺼도 이미지가 투명하게 남지 않고, DOM에 motion은 새지 않는다", () => {
    const { rerender } = render(<AutoAvatar />);
    const image = screen.getByAltText("프로필");

    act(() => image.dispatchEvent(new Event("load", { bubbles: true })));
    expect(image.getAttribute("data-fade")).toBe("start");

    rerender(<AutoAvatar motion="none" />);
    expect(image.hasAttribute("data-fade")).toBe(false);
    expect(image.hidden).toBe(false);
    expect(fallback().hidden).toBe(true);
    expect(image.parentElement?.hasAttribute("motion")).toBe(false);
  });
});
