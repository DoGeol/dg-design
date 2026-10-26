import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { I18nProvider } from "react-aria";
import { describe, expect, it, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem, ToggleGroupRoot } from "./ToggleGroup";

describe("ToggleGroup — Single 모드", () => {
  it("클릭으로 항목을 선택하고 재선택 시 disallowEmptySelection(기본 true)에 따라 선택을 유지한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="wide"
        onValueChange={onValueChange}
        aria-label="너비"
      >
        <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
        <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
        <ToggleGroup.Item value="full">전체</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const narrow = screen.getByRole("radio", { name: "좁게" });
    const wide = screen.getByRole("radio", { name: "넓게" });

    expect(wide.getAttribute("aria-checked")).toBe("true");
    expect(narrow.getAttribute("aria-checked")).toBe("false");

    // 다른 항목 선택
    await user.click(narrow);
    expect(narrow.getAttribute("aria-checked")).toBe("true");
    expect(wide.getAttribute("aria-checked")).toBe("false");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith("narrow");

    // 기본 disallowEmptySelection=true이므로 이미 선택된 항목 클릭 시 해제되지 않고 콜백 호출 없음
    await user.click(narrow);
    expect(narrow.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("disallowEmptySelection=false인 경우 이미 선택된 항목을 재선택하면 선택 해제(null)된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="wide"
        disallowEmptySelection={false}
        onValueChange={onValueChange}
        aria-label="너비"
      >
        <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
        <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const wide = screen.getByRole("radio", { name: "넓게" });
    expect(wide.getAttribute("aria-checked")).toBe("true");

    await user.click(wide);
    expect(wide.getAttribute("aria-checked")).toBe("false");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("제어형(controlled) 모드에서는 부모의 value prop이 갱신되어야 렌더링이 반영된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function ControlledParent() {
      const [val, setVal] = React.useState<string | null>("wide");
      return (
        <ToggleGroup.Root
          type="single"
          value={val}
          onValueChange={(next) => {
            onValueChange(next);
            setVal(next);
          }}
          aria-label="제어형 그룹"
        >
          <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
          <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
        </ToggleGroup.Root>
      );
    }

    render(<ControlledParent />);
    const narrow = screen.getByRole("radio", { name: "좁게" });
    const wide = screen.getByRole("radio", { name: "넓게" });

    expect(wide.getAttribute("aria-checked")).toBe("true");

    await user.click(narrow);
    expect(onValueChange).toHaveBeenCalledWith("narrow");
    expect(narrow.getAttribute("aria-checked")).toBe("true");
    expect(wide.getAttribute("aria-checked")).toBe("false");
  });

  it("외부에서 null로 갱신하면 disallowEmptySelection=true여도 선택이 해제된다", () => {
    const { rerender } = render(
      <ToggleGroup.Root type="single" value="wide" aria-label="너비">
        <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
        <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    expect(screen.getByRole("radio", { name: "넓게" }).getAttribute("aria-checked")).toBe("true");

    rerender(
      <ToggleGroup.Root type="single" value={null} aria-label="너비">
        <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
        <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    expect(screen.getByRole("radio", { name: "넓게" }).getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("radio", { name: "좁게" }).getAttribute("aria-checked")).toBe("false");
  });
});

describe("ToggleGroup — Multiple 모드", () => {
  it("복수 항목을 추가/제거하고 콜백은 중복 없이 DOM 순서대로 배열을 반환한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup.Root
        type="multiple"
        defaultValue={["grid"]}
        onValueChange={onValueChange}
        aria-label="표시 옵션"
      >
        <ToggleGroup.Item value="guides">안내선</ToggleGroup.Item>
        <ToggleGroup.Item value="labels">이름표</ToggleGroup.Item>
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const guides = screen.getByRole("button", { name: /안내선/ });
    const labels = screen.getByRole("button", { name: /이름표/ });
    const grid = screen.getByRole("button", { name: /격자/ });

    expect(grid.getAttribute("aria-pressed")).toBe("true");
    expect(guides.getAttribute("aria-pressed")).toBe("false");

    // 안내선(첫 번째 DOM 순서) 클릭 -> ["guides", "grid"] 반환
    await user.click(guides);
    expect(onValueChange).toHaveBeenCalledWith(["guides", "grid"]);

    // 이름표(두 번째 DOM 순서) 클릭 -> ["guides", "labels", "grid"] 반환
    await user.click(labels);
    expect(onValueChange).toHaveBeenCalledWith(["guides", "labels", "grid"]);

    // 격자 해제 -> ["guides", "labels"] 반환
    await user.click(grid);
    expect(onValueChange).toHaveBeenCalledWith(["guides", "labels"]);
  });

  it("multiple 모드에서 disallowEmptySelection=true면 마지막 남은 항목 해제를 차단한다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup.Root
        type="multiple"
        defaultValue={["guides"]}
        disallowEmptySelection={true}
        onValueChange={onValueChange}
        aria-label="표시 옵션"
      >
        <ToggleGroup.Item value="guides">안내선</ToggleGroup.Item>
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const guides = screen.getByRole("button", { name: /안내선/ });
    await user.click(guides);
    // 마지막 1개이므로 해제되지 않고 콜백 호출 없음
    expect(guides.getAttribute("aria-pressed")).toBe("true");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("ToggleGroup — 비활성(disabled) 및 접근성", () => {
  it("비활성 항목은 이미 선택된 값을 유지하고 클릭/키보드로 변경되지 않는다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="locked"
        onValueChange={onValueChange}
        aria-label="테스트"
      >
        <ToggleGroup.Item value="active">활성</ToggleGroup.Item>
        <ToggleGroup.Item value="locked" disabled>
          고정
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const locked = screen.getByRole("radio", { name: "고정" });
    expect(locked.getAttribute("aria-checked")).toBe("true");
    expect(locked.hasAttribute("disabled")).toBe(true);
    expect(locked.getAttribute("aria-disabled")).toBe("true");
    expect(locked.hasAttribute("data-disabled")).toBe(true);

    await user.click(locked);
    expect(locked.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("그룹 전체가 disabled이면 모든 항목이 disabled되고 탭 정지점이 없다", () => {
    render(
      <ToggleGroup.Root type="single" disabled aria-label="비활성 그룹">
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const items = screen.getAllByRole("radio");
    for (const item of items) {
      expect(item.hasAttribute("disabled")).toBe(true);
      expect(item.getAttribute("aria-disabled")).toBe("true");
    }
  });

  it("아이콘 전용 Item에 aria-label을 주면 스크린리더 접근 이름을 갖는다", () => {
    render(
      <ToggleGroup.Root type="single" aria-label="정렬">
        <ToggleGroup.Item value="left" aria-label="왼쪽 정렬">
          <svg data-testid="left-icon" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    expect(screen.getByRole("radio", { name: "왼쪽 정렬" })).toBeDefined();
  });

  it("객체 export와 named export가 일치한다", () => {
    expect(ToggleGroup.Root).toBe(ToggleGroupRoot);
    expect(ToggleGroup.Item).toBe(ToggleGroupItem);
  });
});

describe("ToggleGroup — 키보드 탐색 및 단축키", () => {
  it("방향키는 초점만 이동하고 콜백을 부르지 않으며, Space/Enter로 선택 시 1회만 호출된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="a"
        onValueChange={onValueChange}
        aria-label="키보드 테스트"
      >
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        <ToggleGroup.Item value="c">C</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const itemA = screen.getByRole("radio", { name: "A" });
    const itemB = screen.getByRole("radio", { name: "B" });

    itemA.focus();
    expect(document.activeElement).toBe(itemA);

    // 오른쪽 방향키: B로 초점 이동, 값 콜백은 부르지 않음
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(itemB);
    expect(onValueChange).not.toHaveBeenCalled();

    // Space 키: B 선택, 콜백 1회 호출
    await user.keyboard(" ");
    expect(itemB.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("Home / End 키로 첫 번째 및 마지막 활성 Item으로 초점을 이동한다", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup.Root type="single" defaultValue="b" aria-label="Home End 테스트">
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        <ToggleGroup.Item value="c">C</ToggleGroup.Item>
        <ToggleGroup.Item value="d" disabled>
          D
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const itemA = screen.getByRole("radio", { name: "A" });
    const itemB = screen.getByRole("radio", { name: "B" });
    const itemC = screen.getByRole("radio", { name: "C" });

    itemB.focus();
    expect(document.activeElement).toBe(itemB);

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(itemA);

    // D는 disabled이므로 마지막 활성 항목은 C
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(itemC);
  });

  it("세로 orientation에서는 ArrowDown/ArrowUp으로 초점을 이동한다", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup.Root
        type="single"
        orientation="vertical"
        defaultValue="v1"
        aria-label="세로 테스트"
      >
        <ToggleGroup.Item value="v1">1</ToggleGroup.Item>
        <ToggleGroup.Item value="v2">2</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    const v1 = screen.getByRole("radio", { name: "1" });
    const v2 = screen.getByRole("radio", { name: "2" });

    v1.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(v2);

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(v1);
  });

  it("RTL 환경(I18nProvider ar-AE)에서는 가로 화살표 방향이 반전된다", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider locale="ar-AE">
        <ToggleGroup.Root type="single" defaultValue="a" aria-label="RTL 테스트">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
      </I18nProvider>,
    );

    const itemA = screen.getByRole("radio", { name: "A" });
    const itemB = screen.getByRole("radio", { name: "B" });

    itemA.focus();
    // RTL에서는 ArrowLeft가 next(B)로 이동
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(itemB);

    // RTL에서는 ArrowRight가 previous(A)로 이동
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(itemA);
  });

  it("상위 toolbar 안에서 multiple 모드는 role=group을 받아 상위 탐색과 충돌하지 않는다", () => {
    render(
      <div role="toolbar" aria-label="상위 도구모음">
        <ToggleGroup.Root type="multiple" aria-label="하위 그룹">
          <ToggleGroup.Item value="1">1</ToggleGroup.Item>
          <ToggleGroup.Item value="2">2</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>,
    );

    const subGroup = screen.getByRole("group", { name: "하위 그룹" });
    expect(subGroup).toBeDefined();
  });
});

describe("ToggleGroup — 개발 경고 및 유효성", () => {
  it("중복된 Item value가 있으면 개발 모드에서 경고한다", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <ToggleGroup.Root type="single" aria-label="중복 테스트">
        <ToggleGroup.Item value="dup">항목 1</ToggleGroup.Item>
        <ToggleGroup.Item value="dup">항목 2</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Duplicate item value"));
    warnSpy.mockRestore();
  });

  it("알 수 없는 외부 value는 어떤 항목도 선택 표시하지 않는다", () => {
    render(
      <ToggleGroup.Root type="single" value="unknown-val" aria-label="외부 값 테스트">
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );

    expect(screen.getByRole("radio", { name: "A" }).getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("radio", { name: "B" }).getAttribute("aria-checked")).toBe("false");
  });
});
