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
