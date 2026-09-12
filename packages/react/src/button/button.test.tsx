import { fireEvent, render, screen } from "@testing-library/react";
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

/** 프레임·좌표는 jsdom이 판정할 수 없어 브라우저 기능 테스트가 맡는다 — 구조와 배선만 본다. */
describe("Button 로딩 전환", () => {
  const content = () => button().querySelector<HTMLElement>('[data-layer="content"]')!;
  const spinnerLayer = () => button().querySelector<HTMLElement>('[data-layer="spinner"]')!;

  it("children은 항상 같은 래퍼에 남고 Spinner는 레이어 안에 얹힌다", () => {
    const { rerender } = render(<Button>저장</Button>);

    expect(content().textContent).toBe("저장");
    expect(spinnerLayer().getAttribute("aria-hidden")).toBe("true");
    expect(spinnerLayer().querySelector(".dds-button__spinner")).toBeNull();

    const wrapper = content();
    rerender(<Button loading>저장</Button>);
    // 같은 래퍼 노드가 유지돼야 전환이 현재 opacity에서 이어진다.
    expect(content()).toBe(wrapper);
    expect(content().textContent).toBe("저장");
    expect(spinnerLayer().querySelector(".dds-button__spinner")).not.toBeNull();
  });

  it("로딩이 풀리면 전환이 끝난 뒤에 Spinner를 내린다", () => {
    const { rerender } = render(<Button loading>저장</Button>);
    expect(spinnerLayer().querySelector(".dds-button__spinner")).not.toBeNull();

    rerender(<Button>저장</Button>);
    // 의미 상태는 즉시 — 기다리는 건 장식뿐이다.
    expect((button() as HTMLButtonElement).disabled).toBe(false);
    expect(button().hasAttribute("aria-busy")).toBe(false);
    expect(spinnerLayer().querySelector(".dds-button__spinner")).not.toBeNull();

    // 전환 종료는 사용자 인터랙션이 아니라 브라우저 생명주기 이벤트라 user-event에 대응이 없다.
    fireEvent.transitionEnd(content());
    expect(spinnerLayer().querySelector(".dds-button__spinner")).toBeNull();
  });

  it("로딩 중에도 접근 이름과 아이콘+라벨 구성이 유지된다", () => {
    render(
      <Button loading>
        <span data-testid="icon">★</span>
        저장
      </Button>,
    );

    // 래퍼를 씌워도 접근 이름은 children 그대로다(로딩 중에도 라벨이 트리에 남는다).
    expect(screen.getByRole("button", { name: /저장/ })).toBe(button());
    expect(content().contains(screen.getByTestId("icon"))).toBe(true);
    expect(content().textContent).toBe("★저장");
  });

  it("loading을 풀어도 disabled prop은 그대로 남는다", () => {
    const { rerender } = render(
      <Button loading disabled>
        저장
      </Button>,
    );
    expect((button() as HTMLButtonElement).disabled).toBe(true);

    rerender(<Button disabled>저장</Button>);
    expect((button() as HTMLButtonElement).disabled).toBe(true);
    expect(button().hasAttribute("aria-busy")).toBe(false);
  });

  it('motion="none"이면 전환을 끄고 Spinner도 바로 내린다 (DOM에 motion은 안 샌다)', () => {
    const { rerender } = render(
      <Button loading motion="none">
        저장
      </Button>,
    );
    expect(button().hasAttribute("data-motion")).toBe(false);
    expect(button().hasAttribute("motion")).toBe(false);
    expect(spinnerLayer().querySelector(".dds-button__spinner")).not.toBeNull();

    rerender(
      <Button motion="none">저장</Button>,
    );
    expect(spinnerLayer().querySelector(".dds-button__spinner")).toBeNull();
  });

  it("기본은 전환을 켜고 사용자 onTransitionEnd도 보존한다", () => {
    const onTransitionEnd = vi.fn();
    render(<Button onTransitionEnd={onTransitionEnd}>저장</Button>);

    expect(button().getAttribute("data-motion")).toBe("");
    fireEvent.transitionEnd(content());
    expect(onTransitionEnd).toHaveBeenCalledTimes(1);
  });

  it("asChild 경로에는 래퍼도 레이어도 붙지 않는다", () => {
    render(
      <Button asChild>
        <a href="/docs">문서</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "문서" });
    expect(link.querySelector("[data-layer]")).toBeNull();
    expect(link.hasAttribute("data-motion")).toBe(false);
    expect(link.textContent).toBe("문서");
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
