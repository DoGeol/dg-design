import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { List } from "./List";

function Posts({ onMore }: { onMore?: () => void }) {
  return (
    <List.Root aria-label="글">
      <List.Item current>
        <List.Action href="/posts/1">다크 모드 대비 검수 메모</List.Action>
        <List.Meta>접근성 · 10월 5일 수정</List.Meta>
        <List.Trailing>
          <button type="button" onClick={onMore}>
            다크 모드 대비 검수 메모 더 보기
          </button>
        </List.Trailing>
      </List.Item>
      <List.Item>
        <List.Action href="/posts/2">토큰 이름 정리</List.Action>
      </List.Item>
      <List.Item>
        <List.Title>이력서 v2</List.Title>
      </List.Item>
    </List.Root>
  );
}

describe("List 행", () => {
  it("ul은 role=list이고 행은 listitem이다", () => {
    render(<Posts />);
    expect(screen.getByRole("list", { name: "글" }).tagName).toBe("UL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("href가 있으면 링크, current면 aria-current=true", () => {
    render(<Posts />);
    const link = screen.getByRole("link", { name: "다크 모드 대비 검수 메모" });
    expect(link.getAttribute("href")).toBe("/posts/1");
    expect(link.getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("link", { name: "토큰 이름 정리" }).hasAttribute("aria-current")).toBe(false);
  });

  it("href가 없으면 button이고 asChild로 다른 요소를 쓸 수 있다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List.Root>
        <List.Item>
          <List.Action onClick={onClick}>열기</List.Action>
        </List.Item>
        <List.Item>
          <List.Action asChild>
            <a href="/next">다음</a>
          </List.Action>
        </List.Item>
      </List.Root>,
    );
    const button = screen.getByRole("button", { name: "열기" });
    expect(button.getAttribute("type")).toBe("button");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "다음" }).className).toContain("dds-list__action");
  });

  it("Trailing 버튼은 링크 밖 형제이고 탭 순서가 행 링크 → trailing → 다음 행이다", async () => {
    const user = userEvent.setup();
    render(<Posts />);
    const link = screen.getByRole("link", { name: "다크 모드 대비 검수 메모" });
    const more = screen.getByRole("button", { name: "다크 모드 대비 검수 메모 더 보기" });
    expect(link.contains(more)).toBe(false);
    await user.tab();
    expect(document.activeElement).toBe(link);
    await user.tab();
    expect(document.activeElement).toBe(more);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "토큰 이름 정리" }));
  });

  it("정적 행의 current는 Title에 붙는다", () => {
    render(
      <List.Root>
        <List.Item current>
          <List.Title>이력서 v2</List.Title>
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByText("이력서 v2").getAttribute("aria-current")).toBe("true");
  });
});

describe("List.Section", () => {
  function Drafts(props: React.ComponentProps<typeof List.Section>) {
    return (
      <List.Section {...props}>
        <List.SectionHeader title="초안·예약" count={2} action={<button type="button">초안 추가</button>} />
        <List.Root>
          <List.Item>
            <List.Title>첫 초안</List.Title>
          </List.Item>
        </List.Root>
      </List.Section>
    );
  }

  it("접기 없는 Section은 제목이 heading이고 목록 이름이 된다", () => {
    render(<Drafts />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent).toContain("초안·예약");
    expect(screen.queryByRole("button", { name: /초안·예약/ })).toBeNull();
    expect(screen.getByRole("list", { name: /초안·예약/ })).toBeTruthy();
  });

  it("collapsible이면 heading 안 접기 버튼이 목록을 가리키고 누르면 hidden", async () => {
    const user = userEvent.setup();
    render(<Drafts collapsible />);
    const toggle = screen.getByRole("button", { name: /초안·예약/ });
    expect(screen.getByRole("heading").contains(toggle)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const list = screen.getByRole("list");
    expect(toggle.getAttribute("aria-controls")).toBe(list.id);
    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(list.hidden).toBe(true);
  });

  it("action은 heading 밖 형제다", () => {
    render(<Drafts collapsible />);
    expect(screen.getByRole("heading").contains(screen.getByRole("button", { name: "초안 추가" }))).toBe(false);
  });

  it("제어 open·onOpenChange와 비제어 defaultOpen", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { unmount } = render(<Drafts collapsible open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: /초안·예약/ }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("list").hidden).toBe(false);
    unmount();

    render(<Drafts collapsible defaultOpen={false} />);
    expect(screen.getByRole("button", { name: /초안·예약/ }).getAttribute("aria-expanded")).toBe("false");
  });

  it("as로 heading 수준을 고르고 description을 보인다", () => {
    render(
      <List.Section>
        <List.SectionHeader as="h2" title="전체 버전" count={3} description="공개 버전은 하나다" />
        <List.Root />
      </List.Section>,
    );
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("전체 버전 3");
    expect(screen.getByText("공개 버전은 하나다")).toBeTruthy();
  });
});
