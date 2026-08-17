import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

const button = () => screen.getByRole("button");

describe("Button 변형", () => {
  it("기본값은 brand·solid·medium이다", () => {
    render(<Button>확인</Button>);

    expect(button().classList.contains("dds-button")).toBe(true);
    expect(button().classList.contains("dds-button--intent_brand")).toBe(true);
    expect(button().classList.contains("dds-button--variant_solid")).toBe(true);
    expect(button().classList.contains("dds-button--size_medium")).toBe(true);
  });

  it("intent·variant·size가 각각 클래스로 나간다", () => {
    const { rerender } = render(
      <Button intent="neutral" variant="ghost" size="large">
        확인
      </Button>,
    );
    expect(button().classList.contains("dds-button--intent_neutral")).toBe(true);
    expect(button().classList.contains("dds-button--variant_ghost")).toBe(true);
    expect(button().classList.contains("dds-button--size_large")).toBe(true);

    rerender(
      <Button intent="brand" variant="weak" size="small">
        확인
      </Button>,
    );
    expect(button().classList.contains("dds-button--intent_brand")).toBe(true);
    expect(button().classList.contains("dds-button--variant_weak")).toBe(true);
    expect(button().classList.contains("dds-button--size_small")).toBe(true);
  });

  it("critical intent로 파괴적 액션을 표현한다", () => {
    render(<Button intent="critical">삭제</Button>);
    expect(button().classList.contains("dds-button--intent_critical")).toBe(true);
  });

  it("className은 변형 클래스와 합쳐진다", () => {
    render(<Button className="my-btn">확인</Button>);

    expect(button().classList.contains("my-btn")).toBe(true);
    expect(button().classList.contains("dds-button--intent_brand")).toBe(true);
  });
});

describe("Button 동작", () => {
  it("클릭이 전달된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);

    await user.click(button());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled면 클릭이 막힌다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        확인
      </Button>,
    );

    await user.click(button());
    expect(onClick).not.toHaveBeenCalled();
    expect((button() as HTMLButtonElement).disabled).toBe(true);
  });

  it("ref가 실제 button 엘리먼트를 가리킨다", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>확인</Button>);

    expect(ref.current).toBe(button());
  });

  it("type을 안 주면 브라우저 기본(submit)을 그대로 둔다", () => {
    // 폼 안에서 제출 버튼으로 쓰는 흔한 용법을 막지 않는다 — 필요하면 소비자가 type을 준다.
    render(<Button>확인</Button>);
    expect(button().getAttribute("type")).toBeNull();
  });
});

describe("Button loading", () => {
  it("loading이면 disabled·aria-busy·스피너를 함께 켠다", () => {
    render(<Button loading>저장</Button>);

    expect((button() as HTMLButtonElement).disabled).toBe(true);
    expect(button().getAttribute("aria-busy")).toBe("true");
    expect(button().querySelector(".dds-button__spinner")).not.toBeNull();
  });

  it("loading이 아니면 aria-busy·스피너가 없다", () => {
    render(<Button>저장</Button>);

    expect(button().hasAttribute("aria-busy")).toBe(false);
    expect(button().querySelector(".dds-button__spinner")).toBeNull();
  });

  it("loading 중 클릭이 막힌다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        저장
      </Button>,
    );

    await user.click(button());
    expect(onClick).not.toHaveBeenCalled();
  });

  it("asChild와 loading을 함께 쓰면 경고하고 loading을 무시한다", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Button asChild loading>
        <a href="/docs">문서</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "문서" });
    expect(link.hasAttribute("aria-busy")).toBe(false);
    expect(link.querySelector(".dds-button__spinner")).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
  });
});

describe("Button asChild", () => {
  it("asChild면 자식 엘리먼트로 렌더하고 클래스를 넘긴다", () => {
    render(
      <Button asChild intent="neutral" variant="ghost">
        <a href="/docs">문서</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "문서" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.classList.contains("dds-button--intent_neutral")).toBe(true);
    expect(link.classList.contains("dds-button--variant_ghost")).toBe(true);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
