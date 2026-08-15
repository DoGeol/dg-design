import * as React from "react";

export interface OptionEntry {
  value: string;
  /** 트리거에 그대로 다시 그릴 표시 내용. */
  label: React.ReactNode;
  /** typeahead 매칭용 평문. */
  text: string;
  disabled: boolean;
}

export function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (React.isValidElement(node)) {
    return nodeToText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

/**
 * Root의 children 트리를 훑어 value → 라벨 표를 만든다.
 *
 * 마운트된 DOM이 아니라 엘리먼트 트리를 읽는 이유: Content는 열렸을 때만 마운트되므로
 * 닫힌 상태·SSR 첫 렌더에서는 옵션이 DOM에 없다. 그때도 트리거에 선택 라벨이 나와야 하고
 * 닫힌 상태 typeahead도 목록을 알아야 한다.
 *
 * 한계: 옵션을 사용자 컴포넌트로 감싸면(`<MyOption/>`이 내부에서 Select.Option을 렌더)
 * 여기서 보이지 않는다. 그 구멍은 Option의 마운트 등록(registerOption)이 메우지만,
 * 등록은 한 번 열린 뒤부터 유효하므로 닫힌 상태의 초기 라벨·typeahead까지 원하면
 * 옵션을 Content 아래에 직접 두는 편이 낫다.
 */
export function collectOptions(
  children: React.ReactNode,
  optionType: React.ElementType,
): OptionEntry[] {
  const entries: OptionEntry[] = [];

  const walk = (node: React.ReactNode): void => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return;
      const props = child.props as {
        value?: string;
        disabled?: boolean;
        children?: React.ReactNode;
      };
      if (child.type === optionType && typeof props.value === "string") {
        entries.push({
          value: props.value,
          label: props.children,
          text: nodeToText(props.children),
          disabled: props.disabled === true,
        });
        return;
      }
      walk(props.children);
    });
  };

  walk(children);
  return entries;
}

/**
 * typeahead 버퍼로 다음 옵션을 고른다.
 *
 * 버퍼가 한 글자면 현재 항목 다음부터 찾아 같은 글자를 연타할 때 순환하고,
 * 이어 치는 중이면 현재 항목부터 찾아 이미 맞은 항목이 계속 유지된다(네이티브·Radix 관례).
 */
export function matchOption(
  options: OptionEntry[],
  buffer: string,
  currentValue: string | undefined,
): OptionEntry | undefined {
  if (options.length === 0 || buffer === "") return undefined;

  const query = buffer.toLowerCase();
  const currentIndex = options.findIndex((option) => option.value === currentValue);
  const start = buffer.length === 1 ? currentIndex + 1 : Math.max(currentIndex, 0);

  for (let step = 0; step < options.length; step += 1) {
    const option = options[(start + step) % options.length];
    if (!option || option.disabled) continue;
    if (option.text.toLowerCase().startsWith(query)) return option;
  }
  return undefined;
}
