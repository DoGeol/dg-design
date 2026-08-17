import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ContextMenu } from "./ContextMenu";

// jsdom은 documentElement.clientWidth/Height가 항상 0이라 floating-ui의 shift가 뷰포트를
// 0으로 보고 아무 좌표든 padding 경계로 뭉갠다 — 이 파일에서만 실제 뷰포트 크기를 흉내낸다.
Object.defineProperty(document.documentElement, "clientWidth", {
  configurable: true,
  value: 1024,
});
Object.defineProperty(document.documentElement, "clientHeight", {
  configurable: true,
  value: 768,
});

function Basic(
  props: React.ComponentProps<typeof ContextMenu.Root> & { onSelect?: () => void } = {},
) {
  const { onSelect, ...rootProps } = props;
  return (
    <ContextMenu.Root {...rootProps}>
      <ContextMenu.Trigger data-testid="trigger">우클릭 영역</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>작업</ContextMenu.Label>
        <ContextMenu.Item onSelect={onSelect}>복사</ContextMenu.Item>
        <ContextMenu.Item disabled>붙여넣기</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>삭제</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

const items = () => screen.getAllByRole("menuitem");

/** user-event의 포인터 API로 우클릭을 낸다 — mousedown이 button=2면 내부적으로 contextmenu도 함께 디스패치한다. */
async function rightClick(
  user: ReturnType<typeof userEvent.setup>,
  target: Element,
  coords?: { clientX: number; clientY: number },
) {
  await user.pointer({ keys: "[MouseRight]", target, coords });
}

describe("ContextMenu 열기", () => {
  it("우클릭(contextmenu)으로 열리고 브라우저 기본 메뉴를 막는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByTestId("trigger");

    // document는 React 루트보다 위라 이 리스너는 React의 onContextMenu(=preventDefault)
    // 뒤에 버블링으로 도달한다 — 이 시점의 defaultPrevented가 우리 핸들러의 결과다.
    let prevented: boolean | undefined;
    document.addEventListener(
      "contextmenu",
      (event) => {
        prevented = event.defaultPrevented;
      },
      { once: true },
    );

    expect(screen.queryByRole("menu")).toBeNull();
    await rightClick(user, trigger, { clientX: 50, clientY: 60 });

    expect(prevented).toBe(true);
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("커서 좌표가 패널 배치에 반영되고, 재우클릭하면 새 좌표로 재배치된다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByTestId("trigger");

    await rightClick(user, trigger, { clientX: 50, clientY: 60 });
    const content = screen.getByRole("menu");
    await waitFor(() => expect(content.style.left).not.toBe(""));
    expect(parseFloat(content.style.left)).toBeCloseTo(50, 0);
    expect(parseFloat(content.style.top)).toBeGreaterThanOrEqual(60);

    await rightClick(user, trigger, { clientX: 300, clientY: 400 });
    await waitFor(() =>
      expect(parseFloat(screen.getByRole("menu").style.left)).toBeCloseTo(300, 0),
    );
  });

  it("controlled: open prop이 진실이고 onOpenChange만 통지한다", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Basic open={false} onOpenChange={onOpenChange} />);

    await rightClick(user, screen.getByTestId("trigger"), { clientX: 10, clientY: 10 });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("ContextMenu roving tabindex", () => {
  it("열리면 첫 항목이 포커스와 tabIndex 0을 갖는다", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await rightClick(user, screen.getByTestId("trigger"), { clientX: 0, clientY: 0 });

    const first = screen.getByRole("menuitem", { name: "복사" });
    expect(document.activeElement).toBe(first);
    expect(first.tabIndex).toBe(0);
  });

  it("화살표가 순환하고 disabled 항목을 건너뛴다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    // disabled인 "붙여넣기"는 목록에서 빠져 복사 ↔ 삭제 두 개만 순환한다.
    expect(items().map((item) => item.textContent)).toEqual(["복사", "붙여넣기", "삭제"]);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "삭제" }));

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "복사" }));

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "삭제" }));
  });
});

describe("ContextMenu 선택·닫힘", () => {
  it("Enter로 선택하면 onSelect 호출 후 닫힌다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic defaultOpen onSelect={onSelect} />);

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("클릭으로도 선택되고 닫힌다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic defaultOpen onSelect={onSelect} />);

    await user.click(screen.getByRole("menuitem", { name: "복사" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("ESC로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);
    expect(screen.getByRole("menu")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("닫히면 포커스가 body가 아니라 트리거로 돌아온다", async () => {
    // 트리거가 div라 tabIndex 없이는 focus()가 no-op이 되어 포커스가 사라진다.
    // "마우스 전용"은 여는 동작의 예외지 닫힘 복귀는 별개다.
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.keyboard("{Escape}");

    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement).toBe(screen.getByTestId("trigger"));
  });

  it("바깥 클릭으로 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultOpen />);

    await user.click(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("ContextMenu 비모달", () => {
  it("열려도 배경 inert도 스크롤 잠금도 없다", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "scroll";
    const { baseElement } = render(<Basic />);
    const rtlContainer = baseElement.firstElementChild as HTMLElement;

    await rightClick(user, screen.getByTestId("trigger"), { clientX: 0, clientY: 0 });
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(rtlContainer.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("scroll");

    document.body.style.overflow = "";
  });
});
