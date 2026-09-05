import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Tabs } from "./Tabs";

function Basic(props: React.ComponentProps<typeof Tabs.Root> = {}) {
  return (
    <Tabs.Root defaultValue="one" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">첫째</Tabs.Trigger>
        <Tabs.Trigger value="two">둘째</Tabs.Trigger>
        <Tabs.Trigger value="three">셋째</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">첫째 패널</Tabs.Content>
      <Tabs.Content value="two">
        <label htmlFor="memo">메모</label>
        <input id="memo" />
      </Tabs.Content>
      <Tabs.Content value="three">셋째 패널</Tabs.Content>
    </Tabs.Root>
  );
}

const tab = (name: string) => screen.getByRole("tab", { name });
const selected = (name: string) => tab(name).getAttribute("aria-selected");
/** hidden 패널은 접근성 트리에서 빠지므로 보이는 패널만 돌아온다. */
const visiblePanel = () => screen.getByRole("tabpanel");
const memo = () => screen.getByLabelText("메모") as HTMLInputElement;

describe("Tabs 키보드", () => {
  it("화살표로 포커스가 옮겨지는 즉시 그 탭이 활성화된다(automatic)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    await user.click(tab("첫째"));
    expect(visiblePanel().textContent).toBe("첫째 패널");

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tab("둘째"));
    expect(selected("둘째")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("two");

    await user.keyboard("{ArrowLeft}");
    expect(selected("첫째")).toBe("true");
    expect(visiblePanel().textContent).toBe("첫째 패널");
  });

  it("Home/End로 처음·끝 탭이 활성화된다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="two" />);

    await user.click(tab("둘째"));
    await user.keyboard("{End}");
    expect(selected("셋째")).toBe("true");

    await user.keyboard("{Home}");
    expect(selected("첫째")).toBe("true");
    expect(visiblePanel().textContent).toBe("첫째 패널");
  });

  it("양 끝에서 순환한다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValue="three" />);

    await user.click(tab("셋째"));
    await user.keyboard("{ArrowRight}");
    expect(selected("첫째")).toBe("true");

    await user.keyboard("{ArrowLeft}");
    expect(selected("셋째")).toBe("true");
  });

  it("disabled 탭은 화살표 이동에서 건너뛴다", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫째</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            둘째
          </Tabs.Trigger>
          <Tabs.Trigger value="three">셋째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">첫째 패널</Tabs.Content>
        <Tabs.Content value="two">둘째 패널</Tabs.Content>
        <Tabs.Content value="three">셋째 패널</Tabs.Content>
      </Tabs.Root>,
    );

    await user.click(tab("첫째"));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tab("셋째"));
    expect(selected("둘째")).toBe("false");
    expect(visiblePanel().textContent).toBe("셋째 패널");
  });
});

describe("Tabs 상태", () => {
  it("controlled: value가 진실이고 undefined로 되돌리면 선택이 사라진다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic value="one" onValueChange={onValueChange} />);

    await user.click(tab("둘째"));
    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(visiblePanel().textContent).toBe("첫째 패널");

    rerender(<Basic value={undefined} onValueChange={onValueChange} />);
    expect(screen.queryAllByRole("tabpanel")).toHaveLength(0);
    for (const name of ["첫째", "둘째", "셋째"]) expect(selected(name)).toBe("false");
  });

  it("비활성 패널은 hidden으로 남아 내부 입력 값이 보존된다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(tab("둘째"));
    await user.type(memo(), "초안");
    expect(memo().value).toBe("초안");

    await user.click(tab("첫째"));
    expect(memo().value).toBe("초안");
    expect(memo().closest("[role='tabpanel']")?.hasAttribute("hidden")).toBe(true);
  });
});

describe("Tabs 접근성", () => {
  it("tab/tablist/tabpanel과 selected·controls·labelledby가 배선된다", () => {
    render(<Basic />);

    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("horizontal");
    expect(screen.getAllByRole("tab")).toHaveLength(3);

    const active = tab("첫째");
    const panel = visiblePanel();
    expect(active.getAttribute("aria-selected")).toBe("true");
    expect(active.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(active.id);
    expect(panel.getAttribute("tabindex")).toBe("0");
  });

  it("roving tabindex: 활성 탭만 tab stop이다", () => {
    render(<Basic />);

    expect(tab("첫째").getAttribute("tabindex")).toBe("0");
    expect(tab("둘째").getAttribute("tabindex")).toBe("-1");
    expect(tab("셋째").getAttribute("tabindex")).toBe("-1");
  });
});

describe("Tabs responsive", () => {
  let matchMediaListeners: Array<(event: { matches: boolean }) => void> = [];
  let currentMatches = false;

  beforeEach(() => {
    matchMediaListeners = [];
    currentMatches = false;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: currentMatches,
      media: query,
      onchange: null,
      addListener: vi.fn((fn) => matchMediaListeners.push(fn)),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_, fn) => matchMediaListeners.push(fn)),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("responsive prop이 지정되면 data-responsive와 --dds-tabs-breakpoint가 지정된다", () => {
    render(<Basic responsive={768} />);
    const root = screen.getByRole("tablist").parentElement!;
    expect(root.hasAttribute("data-responsive")).toBe(true);
    expect(root.style.getPropertyValue("--dds-tabs-breakpoint")).toBe("768px");
  });

  it("wide 화면(matches: true)이면 Root에 data-wide가 붙고 모든 Content의 hidden이 제거된다", () => {
    currentMatches = true;
    render(<Basic responsive={768} defaultValue="one" />);

    const root = screen.getByRole("tablist").parentElement!;
    expect(root.hasAttribute("data-wide")).toBe(true);

    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(3);
    for (const p of panels) {
      expect(p.hasAttribute("hidden")).toBe(false);
    }
  });

  it("미디어쿼리 change 이벤트로 wide가 되면 hidden이 제거된다", async () => {
    const { act } = await import("@testing-library/react");
    currentMatches = false;
    render(<Basic responsive={768} defaultValue="one" />);

    expect(screen.getByText("첫째 패널").hasAttribute("hidden")).toBe(false);
    expect(screen.getByText("메모").closest("[role='tabpanel']")?.hasAttribute("hidden")).toBe(true);

    act(() => {
      for (const listener of matchMediaListeners) {
        listener({ matches: true });
      }
    });

    const root = screen.getByRole("tablist").parentElement!;
    expect(root.hasAttribute("data-wide")).toBe(true);
    const panelsAfter = screen.getAllByRole("tabpanel");
    expect(panelsAfter).toHaveLength(3);
    for (const p of panelsAfter) {
      expect(p.hasAttribute("hidden")).toBe(false);
    }
  });
});
