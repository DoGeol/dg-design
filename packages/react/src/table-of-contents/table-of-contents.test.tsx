import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  TableOfContents,
  type TableOfContentsItem,
  useTableOfContentsActiveId,
} from "./TableOfContents";

const sampleItems: TableOfContentsItem[] = [
  { id: "intro", label: "소개", depth: 1 },
  { id: "install", label: "설치 방법", depth: 1 },
  { id: "npm", label: "npm 설치", depth: 2 },
  { id: "pnpm", label: "pnpm 설치", depth: 2 },
  { id: "usage", label: "사용법", depth: 1 },
];

describe("TableOfContents - 렌더링 및 ARIA", () => {
  it("기본 inline 목차를 올바른 nav와 중첩 ol/li 구조로 렌더한다", () => {
    render(<TableOfContents items={sampleItems} label="문서 목차" />);

    const nav = screen.getByRole("navigation", { name: "문서 목차" });
    expect(nav).toBeDefined();
    expect(nav.classList.contains("dds-table-of-contents--inline")).toBe(true);

    const title = screen.getByText("문서 목차");
    expect(title.tagName.toLowerCase()).toBe("p");

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    expect(links[0]!.getAttribute("href")).toBe("#intro");
    expect(links[0]!.textContent).toBe("소개");
    expect(links[2]!.getAttribute("href")).toBe("#npm");
    expect(links[2]!.textContent).toBe("npm 설치");

    // 중첩 ol 확인: depth 2 항목은 부모 li 안의 중첩 ol에 위치
    const parentLi = links[1]!.closest("li");
    const nestedOl = parentLi?.querySelector("ol");
    expect(nestedOl).not.toBeNull();
    expect(nestedOl?.contains(links[2]!)).toBe(true);
    expect(nestedOl?.contains(links[3]!)).toBe(true);
  });

  it("activeId에 해당하는 링크에만 aria-current='location'을 부여한다", () => {
    const { rerender } = render(
      <TableOfContents items={sampleItems} label="문서 목차" activeId="npm" />,
    );

    const npmLink = screen.getByRole("link", { name: "npm 설치" });
    expect(npmLink.getAttribute("aria-current")).toBe("location");

    const introLink = screen.getByRole("link", { name: "소개" });
    expect(introLink.getAttribute("aria-current")).toBeNull();

    // 알 수 없는 activeId인 경우 어떤 링크도 current가 아님
    rerender(
      <TableOfContents items={sampleItems} label="문서 목차" activeId="unknown" />,
    );
    expect(npmLink.getAttribute("aria-current")).toBeNull();
  });

  it("activeId 변경 시에도 이미 포커스된 링크의 초점이 유지된다", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TableOfContents items={sampleItems} label="문서 목차" activeId="intro" />,
    );

    const introLink = screen.getByRole("link", { name: "소개" });
    introLink.focus();
    expect(document.activeElement).toBe(introLink);

    rerender(
      <TableOfContents items={sampleItems} label="문서 목차" activeId="install" />,
    );
    expect(document.activeElement).toBe(introLink);
  });
});

describe("TableOfContents - 정규화 및 경계값", () => {
  it("유효 항목이 0개이거나 label이 비어있으면 null을 렌더한다", () => {
    const { container: c1 } = render(
      <TableOfContents items={[]} label="목차" />,
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <TableOfContents items={sampleItems} label="   " />,
    );
    expect(c2.firstChild).toBeNull();
  });

  it("빈 id/label 항목과 중복 id를 처리하고 개발 경고를 출력한다", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const invalidItems: TableOfContentsItem[] = [
      { id: "intro", label: "소개", depth: 1 },
      { id: "", label: "빈 아이디", depth: 1 },
      { id: "valid", label: "   ", depth: 1 },
      { id: "intro", label: "중복 소개", depth: 2 },
      { id: "outro", label: "마무리", depth: 1 },
    ];

    render(<TableOfContents items={invalidItems} label="목차" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]!.textContent).toBe("소개");
    expect(links[1]!.textContent).toBe("마무리");

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("첫 항목 depth가 1이 아니거나 depth를 건너뛰어도 1단계씩 정규화한다", () => {
    const skipItems: TableOfContentsItem[] = [
      { id: "s1", label: "시작 3단계", depth: 3 },
      { id: "s2", label: "건너뜀 6단계", depth: 6 },
      { id: "s3", label: "하위 2단계", depth: 2 },
    ];

    render(<TableOfContents items={skipItems} label="목차" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    // s1은 depth 1로 정규화
    const li1 = links[0]!.closest("li");
    expect(li1?.getAttribute("data-depth")).toBe("1");

    // s2는 이전(1)보다 2단계 이상 깊으므로 prevDepth + 1 = 2로 정규화
    const li2 = links[1]!.closest("li");
    expect(li2?.getAttribute("data-depth")).toBe("2");
  });
});

describe("TableOfContents - Collapsible variant", () => {
  it("기본 비제어형은 닫힌 상태이고 토글 조작을 지원한다", async () => {
    const user = userEvent.setup();
    render(
      <TableOfContents
        variant="collapsible"
        items={sampleItems}
        label="접기 목차"
      />,
    );

    const trigger = screen.getByRole("button", { name: "접기 목차" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    const content = trigger.nextElementSibling;
    expect(content?.getAttribute("aria-hidden")).toBe("true");
    expect(content?.hasAttribute("inert")).toBe(true);

    // 클릭으로 열기
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content?.getAttribute("aria-hidden")).toBe("false");
    expect(content?.hasAttribute("inert")).toBe(false);

    // 키보드 Space로 닫기
    trigger.focus();
    await user.keyboard(" ");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    // 키보드 Enter로 열기
    await user.keyboard("{Enter}");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("내부 링크를 클릭해도 열림 상태가 자동으로 닫히지 않는다", async () => {
    const user = userEvent.setup();
    render(
      <TableOfContents
        variant="collapsible"
        defaultOpen
        items={sampleItems}
        label="접기 목차"
      />,
    );

    const trigger = screen.getByRole("button", { name: "접기 목차" });
    const link = screen.getByRole("link", { name: "소개" });

    await user.click(link);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("프로그램적으로 닫힐 때 내용 안에 초점이 있으면 트리거로 복귀한다", async () => {
    function ControlledTest() {
      const [open, setOpen] = React.useState(true);
      return (
        <div>
          <button type="button" onClick={() => setOpen(false)}>
            외부 닫기
          </button>
          <TableOfContents
            variant="collapsible"
            open={open}
            onOpenChange={setOpen}
            items={sampleItems}
            label="접기 목차"
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<ControlledTest />);

    const link = screen.getByRole("link", { name: "소개" });
    link.focus();
    expect(document.activeElement).toBe(link);

    const closeButton = screen.getByRole("button", { name: "외부 닫기" });
    // focus를 link에 둔 채 외부 닫기 실행 시뮬레이션
    await act(async () => {
      closeButton.click();
    });

    const trigger = screen.getByRole("button", { name: "접기 목차" });
    expect(document.activeElement).toBe(trigger);
  });
});

describe("useTableOfContentsActiveId 훅", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("기준선을 지난 마지막 제목을 활성 id로 판정하고 지난 제목이 없으면 첫 유효 제목을 반환한다", () => {
    const el1 = document.createElement("div");
    el1.id = "h1";
    const el2 = document.createElement("div");
    el2.id = "h2";
    const el3 = document.createElement("div");
    el3.id = "h3";
    document.body.append(el1, el2, el3);

    // 좌표 모킹: offset=80 기준선
    // el1: top=40 (<=80 통과)
    // el2: top=80 (<=80 통과)
    // el3: top=120 (>80 미통과)
    vi.spyOn(el1, "getBoundingClientRect").mockReturnValue({
      top: 40,
    } as DOMRect);
    vi.spyOn(el2, "getBoundingClientRect").mockReturnValue({
      top: 80,
    } as DOMRect);
    vi.spyOn(el3, "getBoundingClientRect").mockReturnValue({
      top: 120,
    } as DOMRect);

    let activeId: string | null = null;
    function HookConsumer() {
      activeId = useTableOfContentsActiveId({
        ids: ["h1", "h2", "h3"],
        offset: 80,
      });
      return <div>active: {activeId}</div>;
    }

    render(<HookConsumer />);
    // el1, el2가 통과했으므로 마지막 통과인 h2가 activeId
    expect(activeId).toBe("h2");

    // 모두 기준선 아래에 있는 경우 첫 유효 제목 h1 반환
    vi.spyOn(el1, "getBoundingClientRect").mockReturnValue({
      top: 100,
    } as DOMRect);
    vi.spyOn(el2, "getBoundingClientRect").mockReturnValue({
      top: 150,
    } as DOMRect);

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      vi.runAllTimers();
    });
    expect(activeId).toBe("h1");

    el1.remove();
    el2.remove();
    el3.remove();
  });

  it("존재하지 않는 id는 무시하며 대상이 없으면 null을 반환한다", () => {
    let activeId: string | null = null;
    function HookConsumer() {
      activeId = useTableOfContentsActiveId({
        ids: ["non-existent-1", "non-existent-2"],
      });
      return <div>active: {activeId}</div>;
    }

    render(<HookConsumer />);
    expect(activeId).toBeNull();
  });

  it("root 엘리먼트가 주어지면 root의 스크롤 및 기준선을 따른다", () => {
    const rootEl = document.createElement("div");
    const h1 = document.createElement("div");
    h1.id = "root-h1";
    const h2 = document.createElement("div");
    h2.id = "root-h2";
    rootEl.append(h1, h2);
    document.body.append(rootEl);

    // root top: 100, offset: 50 -> baseline = 150
    vi.spyOn(rootEl, "getBoundingClientRect").mockReturnValue({
      top: 100,
    } as DOMRect);
    // h1 top: 120 (<=150), h2 top: 180 (>150)
    vi.spyOn(h1, "getBoundingClientRect").mockReturnValue({
      top: 120,
    } as DOMRect);
    vi.spyOn(h2, "getBoundingClientRect").mockReturnValue({
      top: 180,
    } as DOMRect);

    let activeId: string | null = null;
    function RootHookConsumer() {
      activeId = useTableOfContentsActiveId({
        ids: ["root-h1", "root-h2"],
        root: rootEl,
        offset: 50,
      });
      return <div>active: {activeId}</div>;
    }

    render(<RootHookConsumer />);
    expect(activeId).toBe("root-h1");

    // h2도 통과하도록 변경 후 root scroll 이벤트 발생
    vi.spyOn(h2, "getBoundingClientRect").mockReturnValue({
      top: 140,
    } as DOMRect);

    act(() => {
      rootEl.dispatchEvent(new Event("scroll"));
      vi.runAllTimers();
    });
    expect(activeId).toBe("root-h2");

    rootEl.remove();
  });

  it("언마운트 시 이벤트 리스너와 타이머를 정리한다", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <TableOfContents items={sampleItems} label="목차" />,
    );

    function HookConsumer() {
      useTableOfContentsActiveId({ ids: ["intro"] });
      return null;
    }
    const { unmount: unmountHook } = render(<HookConsumer />);
    unmountHook();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
    unmount();
  });
});
