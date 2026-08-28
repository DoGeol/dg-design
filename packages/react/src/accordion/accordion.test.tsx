import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Accordion } from "./Accordion";

function Item({ value, disabled = false }: { value: string; disabled?: boolean }) {
  return (
    <Accordion.Item value={value} disabled={disabled}>
      <Accordion.Header>
        <Accordion.Trigger>
          <Accordion.Prefix aria-hidden="true">•</Accordion.Prefix>
          <Accordion.Body>
            <Accordion.Title>{value}</Accordion.Title>
            <Accordion.Description>{value} 설명</Accordion.Description>
          </Accordion.Body>
          <Accordion.SuffixIcon aria-hidden="true">⌄</Accordion.SuffixIcon>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        <Accordion.Body>{value} 내용</Accordion.Body>
      </Accordion.Content>
    </Accordion.Item>
  );
}

function Basic(props: React.ComponentProps<typeof Accordion.Root> = {}) {
  return (
    <Accordion.Root {...props}>
      <Item value="첫째" />
      <Item value="둘째" />
      <Item value="셋째" />
    </Accordion.Root>
  );
}

const trigger = (name: string) =>
  screen.getByRole("button", { name: new RegExp(`^${name}${name} 설명$`) });

describe("Accordion 상태", () => {
  it("single uncontrolled: 한 항목만 열리고 다시 누르면 모두 닫힌다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValues={["첫째"]} />);

    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("true");
    await user.click(trigger("둘째"));
    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("false");
    expect(trigger("둘째").getAttribute("aria-expanded")).toBe("true");

    await user.click(trigger("둘째"));
    expect(trigger("둘째").getAttribute("aria-expanded")).toBe("false");
  });

  it("multiple이면 여러 항목을 독립적으로 연다", async () => {
    const user = userEvent.setup();
    render(<Basic multiple defaultValues={["첫째"]} />);

    await user.click(trigger("둘째"));
    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("true");
    expect(trigger("둘째").getAttribute("aria-expanded")).toBe("true");
  });

  it("controlled: 외부 values가 진실이며 다음 값은 정규화해 콜백으로 전달한다", async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();
    const { rerender } = render(
      <Basic values={["첫째", "둘째"]} onValuesChange={onValuesChange} />,
    );

    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("true");
    expect(trigger("둘째").getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger("셋째"));
    expect(onValuesChange).toHaveBeenLastCalledWith(["셋째"]);
    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("true");

    rerender(<Basic values={["둘째"]} onValuesChange={onValuesChange} />);
    expect(trigger("둘째").getAttribute("aria-expanded")).toBe("true");
  });

  it("Root 또는 Item disabled면 토글하지 않는다", async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();
    const { rerender } = render(<Basic disabled onValuesChange={onValuesChange} />);

    await user.click(trigger("첫째"));
    expect(onValuesChange).not.toHaveBeenCalled();

    rerender(
      <Accordion.Root onValuesChange={onValuesChange}>
        <Item value="첫째" disabled />
      </Accordion.Root>,
    );
    await user.click(trigger("첫째"));
    expect(onValuesChange).not.toHaveBeenCalled();
  });

  it("중복 value는 경고하지만 Item별 고유 ID와 ARIA 연결을 유지한다", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <Accordion.Root>
        <Item value="same" />
        <Item value="same" />
      </Accordion.Root>,
    );

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("duplicate Item value `same`"));
    const triggers = screen.getAllByRole("button", { name: /samesame 설명/ });
    const contents = Array.from(container.querySelectorAll<HTMLElement>('[role="region"]'));

    expect(new Set(triggers.map(({ id }) => id)).size).toBe(2);
    expect(new Set(contents.map(({ id }) => id)).size).toBe(2);
    triggers.forEach((trigger) => {
      const content = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
      expect(content?.getAttribute("aria-labelledby")).toBe(trigger.id);
    });

    warn.mockRestore();
  });
});

describe("Accordion 키보드와 접근성", () => {
  it("ArrowUp/Down과 Home/End는 순환하며 disabled를 건너뛴다", async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root>
        <Item value="첫째" />
        <Item value="둘째" disabled />
        <Item value="셋째" />
      </Accordion.Root>,
    );

    await user.click(trigger("첫째"));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(trigger("셋째"));

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(trigger("첫째"));

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(trigger("셋째"));

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(trigger("첫째"));

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(trigger("셋째"));
  });

  it("Enter와 Space는 기본 button 동작으로 토글한다", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    trigger("첫째").focus();
    await user.keyboard("{Enter}");
    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("true");

    await user.keyboard(" ");
    expect(trigger("첫째").getAttribute("aria-expanded")).toBe("false");
  });

  it("trigger와 content의 ARIA가 연결되고 닫힌 콘텐츠는 접근성 트리에서 제외된다", async () => {
    const user = userEvent.setup();
    render(<Basic defaultValues={["첫째"]} />);
    const first = trigger("첫째");
    const region = screen.getByRole("region");

    expect(first.getAttribute("aria-controls")).toBe(region.id);
    expect(region.getAttribute("aria-labelledby")).toBe(first.id);

    await user.click(first);
    expect(screen.queryByRole("region")).toBeNull();
  });
});

describe("Accordion 구성과 스타일 상태", () => {
  it("inline/separated와 medium/large 클래스 및 Header asChild를 전달한다", () => {
    const { rerender } = render(
      <Accordion.Root variant="inline" size="medium">
        <Accordion.Item value="one">
          <Accordion.Header asChild>
            <h2>맞춤 헤더</h2>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(screen.getByRole("heading", { name: "맞춤 헤더" }).tagName).toBe("H2");
    const inlineRoot = screen.getByText("맞춤 헤더").closest(".dds-accordion");
    expect(inlineRoot?.classList.contains("dds-accordion--variant_inline")).toBe(true);
    expect(inlineRoot?.classList.contains("dds-accordion--size_medium")).toBe(true);

    rerender(<Basic variant="separated" size="large" />);
    const separatedRoot = trigger("첫째").closest(".dds-accordion");
    expect(separatedRoot?.classList.contains("dds-accordion--variant_separated")).toBe(true);
    expect(separatedRoot?.classList.contains("dds-accordion--size_large")).toBe(true);
  });
});
