import type { VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { Chip } from "../chip/Chip";
import { ChevronDownIcon } from "../icon/chevron-down-icon";
import { mergeRefs } from "../internal/merge-refs";
import { moveFocus } from "../internal/roving-focus";
import { nodeToText, OPTION_ROLE, selectTrigger, type OptionEntry } from "../internal/select-core";
import { useControllableState } from "../internal/use-controllable-state";
import { Spinner } from "../spinner/Spinner";
import { useMultiSelectContext } from "./multi-select-context";

/** 목록 맨 아래 "만들기" 항목의 내부 값. 실제 옵션 값과 겹칠 수 없는 제어 문자로 시작한다. */
export const CREATE_VALUE = "\u0000dds-create";

export type MultiSelectFilterOption = OptionEntry;
export type MultiSelectFilter = (option: MultiSelectFilterOption, query: string) => boolean;
export type MultiSelectCreate = (
  query: string,
) => Promise<{ value: string; label: React.ReactNode } | void>;

/** 기본 필터·정확 일치 판정이 공유하는 정규화 — 소비자의 태그 이름 규칙과 같은 NFKC 소문자. */
function normalize(text: string): string {
  return text.normalize("NFKC").toLowerCase();
}

export const defaultFilter: MultiSelectFilter = (option, query) =>
  normalize(option.text).includes(normalize(query));

const NO_HIDDEN: ReadonlySet<string> = new Set();

export interface MultiSelectSearchOptions {
  mode: "trigger" | "content";
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  filter?: MultiSelectFilter | null;
  onCreate?: MultiSelectCreate;
  createLabel?: (query: string) => React.ReactNode;
  createErrorLabel?: (error: unknown, query: string) => React.ReactNode;
  searchProps?: React.InputHTMLAttributes<HTMLInputElement>;
  options: OptionEntry[];
  contentId: string;
  open: boolean;
  /** 이미 있으면 그대로 두고 없으면 뒤에 붙인다 — 생성 결과는 토글이 아니다. */
  addValue: (value: string) => void;
  toggleValue: (value: string) => void;
}

export interface MultiSelectSearchState {
  mode: "trigger" | "content";
  query: string;
  setQuery: (value: string) => void;
  /** 필터에서 떨어진 값 — Option이 언마운트 대신 hidden으로 숨는다. */
  hidden: ReadonlySet<string>;
  activeValue: string | undefined;
  /** 방향키 이동. 만들기 항목까지 한 바퀴 순환한다. */
  moveActive: (delta: 1 | -1) => void;
  setActiveValue: (value: string | undefined) => void;
  /** Enter·클릭 확정. 만들기 항목이면 생성 흐름을 탄다. */
  activate: (value: string) => void;
  optionId: (value: string) => string;
  showCreate: boolean;
  createNode: React.ReactNode;
  createPending: boolean;
  createErrorNode: React.ReactNode;
  /** onCreate가 resolve로 준 옵션 — 소비자가 목록에 넣기 전에도 칩 라벨이 나온다. */
  createdOptions: OptionEntry[];
  searchProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const NO_SEARCH_PROPS: React.InputHTMLAttributes<HTMLInputElement> = {};

/**
 * 검색·생성 상태 전부. search prop이 없으면 Root가 아예 호출하지 않으므로
 * 기존 모드에는 이 파일의 어떤 코드도 관여하지 않는다.
 */
export function useMultiSelectSearch({
  mode,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  filter,
  onCreate,
  createLabel,
  createErrorLabel,
  searchProps = NO_SEARCH_PROPS,
  options,
  contentId,
  open,
  addValue,
  toggleValue,
}: MultiSelectSearchOptions): MultiSelectSearchState {
  const [query, setQuery] = useControllableState({
    value: searchValue,
    defaultValue: defaultSearchValue,
    onChange: onSearchChange,
  });
  const [activeValue, setActiveValue] = React.useState<string | undefined>(undefined);
  const [createPending, setCreatePending] = React.useState(false);
  const [createError, setCreateError] = React.useState<unknown>(null);
  const [createdOptions, setCreatedOptions] = React.useState<OptionEntry[]>([]);

  const activeFilter = filter === undefined ? defaultFilter : filter;
  const hidden = React.useMemo(() => {
    if (activeFilter === null) return NO_HIDDEN;
    const next = new Set<string>();
    for (const option of options) {
      if (!activeFilter(option, query)) next.add(option.value);
    }
    return next;
  }, [activeFilter, options, query]);

  const visible = React.useMemo(
    () => options.filter((option) => !option.disabled && !hidden.has(option.value)),
    [options, hidden],
  );

  const showCreate =
    onCreate !== undefined &&
    createLabel !== undefined &&
    query !== "" &&
    !visible.some((option) => normalize(option.text) === normalize(query));

  const candidates = React.useMemo(() => {
    const values = visible.map((option) => option.value);
    return showCreate ? [...values, CREATE_VALUE] : values;
  }, [visible, showCreate]);
  const candidatesRef = React.useRef(candidates);
  candidatesRef.current = candidates;

  // 활성 항목은 후보 목록을 따라간다. 사라진 항목이나 "만들기" 항목을 가리킨 채 남으면
  // Enter가 엉뚱한 것을 고른다. 옵션 텍스트는 등록 뒤에야 채워지므로 ref로 한 번 읽으면
  // 첫 질의에서 "만들기"만 후보로 잡히는 순간의 값이 굳는다 — candidates 자체를 의존성으로 둔다.
  React.useEffect(() => {
    if (mode !== "trigger") return;
    setActiveValue((prev) => {
      if (!open) return undefined;
      if (prev !== undefined && prev !== CREATE_VALUE && candidates.includes(prev)) return prev;
      return candidates[0];
    });
  }, [mode, open, candidates]);

  React.useEffect(() => setCreateError(null), [query]);

  const optionId = React.useCallback(
    (value: string) => `${contentId}-opt-${encodeURIComponent(value)}`,
    [contentId],
  );

  React.useEffect(() => {
    if (!open || activeValue === undefined) return;
    document.getElementById(optionId(activeValue))?.scrollIntoView?.({ block: "nearest" });
  }, [open, activeValue, optionId]);

  const moveActive = React.useCallback((delta: 1 | -1) => {
    const list = candidatesRef.current;
    if (list.length === 0) return;
    setActiveValue((current) => {
      const index = current === undefined ? -1 : list.indexOf(current);
      if (index === -1) return delta === 1 ? list[0] : list[list.length - 1];
      return list[(index + delta + list.length) % list.length];
    });
  }, []);

  const runCreate = React.useCallback(async () => {
    if (!onCreate || createPending) return;
    const pendingQuery = query;
    setCreatePending(true);
    setCreateError(null);
    try {
      const created = await onCreate(pendingQuery);
      // void면 아무것도 하지 않는다 — 소비자가 옵션 목록만 갱신하는 흐름.
      if (created) {
        setCreatedOptions((prev) =>
          prev.some((entry) => entry.value === created.value)
            ? prev
            : [
                ...prev,
                {
                  value: created.value,
                  label: created.label,
                  text: nodeToText(created.label),
                  disabled: false,
                },
              ],
        );
        addValue(created.value);
        setQuery("");
      }
    } catch (error) {
      setCreateError(error);
    } finally {
      setCreatePending(false);
    }
  }, [onCreate, createPending, query, addValue, setQuery]);

  const activate = React.useCallback(
    (value: string) => {
      if (value === CREATE_VALUE) {
        void runCreate();
        return;
      }
      toggleValue(value);
    },
    [runCreate, toggleValue],
  );

  return {
    mode,
    query,
    setQuery,
    hidden,
    activeValue,
    moveActive,
    setActiveValue,
    activate,
    optionId,
    showCreate,
    createNode: showCreate && createLabel ? createLabel(query) : null,
    createPending,
    createErrorNode:
      createError !== null && createErrorLabel ? createErrorLabel(createError, query) : null,
    createdOptions,
    searchProps,
  };
}

export function MultiSelectCaret() {
  return <ChevronDownIcon size={16} className="dds-select__caret" />;
}

export interface MultiSelectSearchTriggerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value">,
    Pick<VariantProps<typeof selectTrigger>, "size"> {
  placeholder?: React.ReactNode;
  /** 칩 제거 버튼의 접근 이름. 기본은 라벨 텍스트 — 문구는 소비자 소유다. */
  formatRemoveLabel?: (option: { value: string; label: React.ReactNode }) => string;
  disabled?: boolean;
}

/**
 * search="trigger"의 트리거. 역할이 button에서 combobox 입력을 품은 컨테이너로 바뀐다.
 * DOM 포커스는 입력에 머물고 활성 옵션은 aria-activedescendant로만 가리킨다 —
 * 입력을 떠나면 타이핑이 끊기기 때문이다.
 */
export const MultiSelectSearchTrigger = React.forwardRef<
  HTMLDivElement,
  MultiSelectSearchTriggerProps
>(({ className, size, placeholder, formatRemoveLabel, disabled, onClick, ...props }, ref) => {
  const context = useMultiSelectContext("MultiSelect.Trigger");
  const search = context.search as MultiSelectSearchState;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const setRef = React.useMemo(
    () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLDivElement>),
    [ref, context.setTriggerNode],
  );
  const removeLabel =
    formatRemoveLabel ?? ((option) => nodeToText(option.label) || option.value);

  const labelOf = (value: string) =>
    context.options.find((option) => option.value === value)?.label ?? value;

  return (
    <div
      ref={setRef}
      data-state={context.open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      className={clsx(selectTrigger({ size }), "dds-multi-select__trigger--search", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        // 칩·제거 버튼·입력을 뺀 빈 자리만 토글이다 — 입력을 누를 때 닫히면 타이핑이 안 된다.
        if ((event.target as HTMLElement).closest("input,button")) return;
        context.setOpen(!context.open);
        inputRef.current?.focus();
      }}
      {...props}
    >
      {context.value.map((value) => (
        <Chip
          key={value}
          size={size === "xsmall" ? "small" : undefined}
          disabled={disabled}
          removeLabel={removeLabel({ value, label: labelOf(value) })}
          onRemove={() => {
            // 다음·이전 칩이 없으면 Chip이 초점을 두지 않는다 — 검색 입력으로 돌려 타이핑을 잇는다.
            if (context.value.length === 1) inputRef.current?.focus();
            context.toggleValue(value);
          }}
        >
          {labelOf(value)}
        </Chip>
      ))}
      <input
        ref={inputRef}
        id={context.triggerId}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          context.open && search.activeValue !== undefined
            ? search.optionId(search.activeValue)
            : undefined
        }
        aria-invalid={context.invalid}
        aria-describedby={context.describedBy}
        disabled={disabled}
        className="dds-multi-select__search"
        placeholder={context.value.length === 0 ? nodeToText(placeholder) : undefined}
        value={search.query}
        onChange={(event) => {
          search.setQuery(event.target.value);
          if (!context.open) context.setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!context.open) context.setOpen(true);
            else search.moveActive(event.key === "ArrowDown" ? 1 : -1);
            return;
          }
          if (event.key === "Enter" && context.open && search.activeValue !== undefined) {
            event.preventDefault();
            search.activate(search.activeValue);
            return;
          }
          // 빈 입력의 Backspace는 마지막 칩을 뗀다 — 네이티브 태그 입력의 관례.
          if (event.key === "Backspace" && search.query === "" && context.value.length > 0) {
            event.preventDefault();
            context.toggleValue(context.value[context.value.length - 1] as string);
          }
        }}
        {...search.searchProps}
      />
      <MultiSelectCaret />
    </div>
  );
});
MultiSelectSearchTrigger.displayName = "MultiSelect.Trigger";

/** search="content"의 검색 입력. Content의 첫 자식으로 자동 렌더된다. */
export function MultiSelectContentSearch() {
  const context = useMultiSelectContext("MultiSelect.Content");
  const search = context.search as MultiSelectSearchState;

  return (
    <input
      type="text"
      role="searchbox"
      autoComplete="off"
      data-dds-search=""
      className="dds-multi-select__search dds-multi-select__search--content"
      value={search.query}
      onChange={(event) => search.setQuery(event.target.value)}
      onKeyDown={(event) => {
        // 목록의 typeahead·roving이 입력의 타이핑을 가로채지 않게 여기서 끊는다.
        event.stopPropagation();
        if (event.key !== "ArrowDown") return;
        event.preventDefault();
        moveFocus(context.contentRef.current, OPTION_ROLE, "ArrowDown");
      }}
      {...search.searchProps}
    />
  );
}

/**
 * 목록 맨 아래 "만들기" 항목과 실패 문구. 보류 중에는 이 항목만 aria-disabled가 되고
 * 입력·다른 옵션은 그대로 동작한다.
 */
export function MultiSelectCreateItem() {
  const context = useMultiSelectContext("MultiSelect.Content");
  const search = context.search as MultiSelectSearchState;
  const active = search.mode === "trigger" && search.activeValue === CREATE_VALUE;

  return (
    <>
      {search.showCreate ? (
        <button
          type="button"
          role={OPTION_ROLE}
          id={search.optionId(CREATE_VALUE)}
          data-create=""
          data-active={active ? "" : undefined}
          aria-selected={false}
          aria-disabled={search.createPending || undefined}
          tabIndex={-1}
          className="dds-select__option dds-multi-select__option--create"
          onMouseDown={search.mode === "trigger" ? (event) => event.preventDefault() : undefined}
          onClick={() => {
            if (!search.createPending) search.activate(CREATE_VALUE);
          }}
        >
          <span className="dds-select__option-label">{search.createNode}</span>
          {search.createPending ? <Spinner size="small" /> : null}
        </button>
      ) : null}
      {search.createErrorNode === null ? null : (
        <span role="alert" className="dds-multi-select__create-error">
          {search.createErrorNode}
        </span>
      )}
    </>
  );
}
