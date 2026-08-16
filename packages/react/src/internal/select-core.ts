import * as React from "react";

import { focusItem, getItems, moveFocus } from "./roving-focus";

/**
 * 옵션 목록 오버레이(Select·MultiSelect)가 값 타입과 무관하게 공유하는 부분.
 * 값이 하나냐 배열이냐로 갈리는 것(setValue·트리거 라벨·닫힌 상태 typeahead)은
 * 각 컴포넌트가 자기 폴더에 갖는다.
 */

/** 옵션의 ARIA role. roving 조회 셀렉터의 기준이기도 하다. */
export const OPTION_ROLE = "option";
/** 옵션 DOM에서 값을 되읽는 통로 — roving은 DOM 조회라 등록 배열이 없다. */
export const VALUE_ATTR = "data-dds-value";

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

/** 마지막 입력 뒤 이만큼 지나면 버퍼를 비운다 — 네이티브 select와 같은 관례. */
const RESET_MS = 1000;

export interface Typeahead {
  /** 문자 하나를 밀어 넣고 누적 버퍼를 돌려준다. */
  push: (char: string) => string;
  /** 이어 치는 중인지 — Space를 열기로 볼지 문자로 볼지 가른다. */
  hasBuffer: () => boolean;
}

export function useTypeahead(): Typeahead {
  const buffer = React.useRef("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return React.useMemo(
    () => ({
      push(char) {
        clearTimeout(timer.current);
        buffer.current += char;
        timer.current = setTimeout(() => {
          buffer.current = "";
        }, RESET_MS);
        return buffer.current;
      },
      hasBuffer: () => buffer.current !== "",
    }),
    [],
  );
}

/** 문자 키인지. 조합 키가 눌린 상태는 단축키이므로 typeahead가 아니다. */
export function isTypeaheadKey(event: React.KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

/**
 * 열린 패널의 키보드 분기 — 화살표·Home·End roving과 typeahead 포커스 이동.
 * 값을 건드리지 않아 단일/다중 선택이 그대로 공유한다.
 * 키를 소비했으면 true를 돌려준다(preventDefault는 호출자 몫).
 */
export function handleOpenKeyDown(
  event: React.KeyboardEvent,
  content: HTMLElement | null | undefined,
  options: OptionEntry[],
  typeahead: Typeahead,
): boolean {
  if (moveFocus(content, OPTION_ROLE, event.key)) return true;
  // 열린 상태의 typeahead는 포커스만 옮긴다 — 값은 Enter·클릭으로 확정한다.
  // Space는 이어 치는 중일 때만 문자다(그 외에는 포커스된 옵션을 고른다).
  if (!isTypeaheadKey(event)) return false;
  if (event.key === " " && !typeahead.hasBuffer()) return false;

  const items = getItems(content, OPTION_ROLE);
  const focused = items.find((item) => item === document.activeElement);
  const match = matchOption(
    options,
    typeahead.push(event.key),
    focused?.getAttribute(VALUE_ATTR) ?? undefined,
  );
  if (!match) return false;

  focusItem(
    items,
    items.findIndex((item) => item.getAttribute(VALUE_ATTR) === match.value),
  );
  return true;
}

/**
 * children 트리 스캔 + 마운트 등록을 합친 옵션 목록.
 *
 * 스캔만으로는 사용자 컴포넌트로 감싼 옵션을 못 본다(`<MyOptions />`의 children은
 * 렌더 전이라 비어 있다) — 마운트 등록분이 그 구멍을 메운다. 등록은 해제하지 않는
 * 스티키 캐시다: 옵션은 패널이 닫히면 unmount되는데 그때 지우면 선택 직후 트리거
 * 라벨이 다시 사라진다. value→라벨 표라 stale이어도 무해하다.
 */
export function useOptionRegistry(
  children: React.ReactNode,
  optionType: React.ElementType,
): { options: OptionEntry[]; registerOption: (entry: OptionEntry) => () => void } {
  const scanned = React.useMemo(() => collectOptions(children, optionType), [children, optionType]);
  const [registered, setRegistered] = React.useState<ReadonlyMap<string, OptionEntry>>(new Map());

  const registerOption = React.useCallback((entry: OptionEntry) => {
    setRegistered((prev) => {
      const existing = prev.get(entry.value);
      if (existing && existing.label === entry.label && existing.disabled === entry.disabled) {
        return prev;
      }
      return new Map(prev).set(entry.value, entry);
    });
    return () => {};
  }, []);

  const options = React.useMemo(() => {
    const merged = scanned.map((entry) => registered.get(entry.value) ?? entry);
    const known = new Set(scanned.map((entry) => entry.value));
    for (const entry of registered.values()) if (!known.has(entry.value)) merged.push(entry);
    return merged;
  }, [scanned, registered]);

  return { options, registerOption };
}
