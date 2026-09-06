// 외관은 Select와 완전히 같다 — 다중 선택은 값 모양과 닫힘 정책만 다르므로 CSS를 새로 쓰지 않는다.
import "../select/select.css";
// 검색 모드에서만 쓰는 칩·검색 입력·만들기 항목. 기존 모드에는 걸리는 규칙이 없다.
import "./multi-select.css";

import type { Placement } from "@floating-ui/dom";
import type { VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { FieldContext } from "../field/field-context";
import { mergeRefs } from "../internal/merge-refs";
import { focusItem, getItems } from "../internal/roving-focus";
import {
  handleOpenKeyDown,
  isTypeaheadKey,
  nodeToText,
  OPTION_ROLE,
  useOptionRegistry,
  useTypeahead,
  VALUE_ATTR,
} from "../internal/select-core";
import { useControllableState } from "../internal/use-controllable-state";
import { useOverlay } from "../internal/use-overlay";
import { Select } from "../select/Select";
import {
  MultiSelectContext,
  useMultiSelectContext,
  type MultiSelectContextValue,
} from "./multi-select-context";
import {
  MultiSelectCaret,
  MultiSelectContentSearch,
  MultiSelectCreateItem,
  MultiSelectSearchTrigger,
  triggerCva,
  useMultiSelectSearch,
  type MultiSelectCreate,
  type MultiSelectFilter,
} from "./multi-select-search";

/** defaultValue 미지정 시 렌더마다 새 배열이 생기지 않도록 고정 참조를 쓴다. */
const NO_VALUES: string[] = [];

export interface MultiSelectRootProps {
  /** controlled 값. 선택 순서대로 쌓인다. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** 주면 선택 개수만큼 hidden input을 렌더해 네이티브 폼 제출에 실린다. */
  name?: string;
  /** ESC로 닫히는지. */
  closeOnEscape?: boolean;
  /** 바깥 클릭으로 닫히는지. */
  closeOnOutsideClick?: boolean;
  /**
   * 검색 입력 자리. `"trigger"`는 트리거 안에 칩 + combobox 입력을,
   * `"content"`는 패널 첫 자식에 searchbox를 놓는다. 기본은 검색 없음(현행).
   */
  search?: "trigger" | "content";
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  /** 검색 입력에 그대로 얹을 속성 — placeholder·aria-label 같은 문구는 소비자 소유다. */
  searchProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** 기본은 라벨 텍스트의 NFKC 소문자 포함 비교. `null`이면 필터하지 않는다(서버 검색). */
  filter?: MultiSelectFilter | null;
  /** resolve가 옵션을 주면 선택에 추가하고 질의를 비운다. void면 아무것도 하지 않는다. */
  onCreate?: MultiSelectCreate;
  /** `onCreate`와 함께 줄 때만 "만들기" 항목이 생긴다 — 문구는 소비자 소유다. */
  createLabel?: (query: string) => React.ReactNode;
  /** 없으면 실패해도 문구를 띄우지 않고 항목만 복구한다. */
  createErrorLabel?: (error: unknown, query: string) => React.ReactNode;
  children?: React.ReactNode;
}

export function MultiSelectRoot({
  value,
  defaultValue = NO_VALUES,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  closeOnEscape = true,
  closeOnOutsideClick = true,
  name,
  search,
  searchValue,
  defaultSearchValue,
  onSearchChange,
  searchProps,
  filter,
  onCreate,
  createLabel,
  createErrorLabel,
  children,
}: MultiSelectRootProps) {
  const [selectedValues, setValue] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const { options: registered, registerOption } = useOptionRegistry(children, MultiSelectOption);

  const toggleValue = React.useCallback(
    (next: string) => {
      setValue(
        selectedValues.includes(next)
          ? selectedValues.filter((item) => item !== next)
          : [...selectedValues, next],
      );
    },
    [selectedValues, setValue],
  );

  const addValue = React.useCallback(
    (next: string) => {
      if (!selectedValues.includes(next)) setValue([...selectedValues, next]);
    },
    [selectedValues, setValue],
  );

  // 열릴 때는 선택된 것 중 첫 옵션으로(없으면 첫 옵션) — Select와 같은 자리.
  // 검색 모드는 DOM 포커스가 입력에 있어야 하므로 여기로 오지 않는다.
  const focusSelectedOption = (content: HTMLElement) => {
    if (search === "trigger") return;
    if (search === "content") {
      const input = content.querySelector<HTMLElement>("[data-dds-search]");
      if (input) {
        input.focus();
        return;
      }
    }
    const items = getItems(content, OPTION_ROLE);
    const index = items.findIndex((item) => {
      const itemValue = item.getAttribute(VALUE_ATTR);
      return itemValue !== null && selectedValues.includes(itemValue);
    });
    focusItem(items, index === -1 ? 0 : index);
  };

  const overlay = useOverlay({
    open,
    defaultOpen,
    onOpenChange,
    placement,
    matchTriggerWidth: true,
    closeOnEscape,
    closeOnOutsideClick,
    onOpenFocus: focusSelectedOption,
  });

  const fieldCtx = React.useContext(FieldContext);
  const generatedId = React.useId();
  const triggerId = fieldCtx?.inputId ?? generatedId;
  const contentId = `${generatedId}-content`;
  const typeahead = useTypeahead();

  // search가 없어도 훅 순서를 지키려고 항상 부르되, filter를 꺼서 아무 일도 하지 않게 둔다.
  const searchState = useMultiSelectSearch({
    mode: search ?? "content",
    searchValue,
    defaultSearchValue,
    onSearchChange,
    searchProps,
    filter: search === undefined ? null : filter,
    onCreate,
    createLabel,
    createErrorLabel,
    options: registered,
    contentId,
    open: overlay.open,
    addValue,
    toggleValue,
  });
  const { createdOptions } = searchState;

  // onCreate가 돌려준 옵션은 소비자가 목록에 넣기 전에도 칩 라벨로 쓰인다.
  const options = React.useMemo(
    () =>
      createdOptions.length === 0
        ? registered
        : [
            ...registered,
            ...createdOptions.filter(
              (entry) => !registered.some((option) => option.value === entry.value),
            ),
          ],
    [registered, createdOptions],
  );

  const context = React.useMemo<MultiSelectContextValue>(
    () => ({
      ...overlay,
      search: search === undefined ? undefined : searchState,
      triggerId,
      contentId,
      describedBy: fieldCtx?.describedBy,
      invalid: fieldCtx?.invalid ?? false,
      value: selectedValues,
      toggleValue,
      options,
      registerOption,
      typeahead,
    }),
    [
      overlay,
      search,
      searchState,
      triggerId,
      contentId,
      fieldCtx?.describedBy,
      fieldCtx?.invalid,
      selectedValues,
      toggleValue,
      options,
      registerOption,
      typeahead,
    ],
  );

  return (
    <MultiSelectContext.Provider value={context}>
      {children}
      {name === undefined
        ? null
        : selectedValues.map((item) => (
            <input key={item} type="hidden" name={name} value={item} />
          ))}
    </MultiSelectContext.Provider>
  );
}
MultiSelectRoot.displayName = "MultiSelect.Root";

export interface MultiSelectTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    VariantProps<typeof triggerCva> {
  /** 선택이 없을 때 보여줄 내용. 회색으로 표시된다. */
  placeholder?: React.ReactNode;
  /** 2개 이상 선택됐을 때의 요약 문구. 앱 언어에 맞춰 바꾼다. */
  formatCount?: (count: number) => React.ReactNode;
  /** `search="trigger"`에서만 쓴다 — 칩 제거 버튼의 접근 이름. */
  formatRemoveLabel?: (option: { value: string; label: React.ReactNode }) => string;
}

/**
 * 트리거는 요약 텍스트 한 줄이다(칩 나열 아님) — 선택이 늘어도 높이가 고정된다.
 * 라벨을 못 찾는 경우(옵션을 사용자 컴포넌트로 감싸 스캔에 안 잡힐 때)는 값 문자열로 떨어진다.
 */
function summarize(
  value: readonly string[],
  options: { value: string; label: React.ReactNode }[],
  placeholder: React.ReactNode,
  formatCount: (count: number) => React.ReactNode,
): React.ReactNode {
  if (value.length === 0) return placeholder;
  if (value.length === 1) {
    return options.find((option) => option.value === value[0])?.label ?? value[0];
  }
  return formatCount(value.length);
}

export const MultiSelectTrigger = React.forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  (
    {
      className,
      size,
      placeholder,
      formatCount = (count) => `${count}개 선택됨`,
      formatRemoveLabel,
      children,
      id,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const context = useMultiSelectContext("MultiSelect.Trigger");
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLButtonElement>),
      [ref, context.setTriggerNode],
    );
    const empty = context.value.length === 0;

    // 검색 모드의 트리거는 button이 아니라 combobox 입력을 품은 컨테이너다.
    if (context.search?.mode === "trigger") {
      return (
        <MultiSelectSearchTrigger
          ref={ref as unknown as React.Ref<HTMLDivElement>}
          className={className}
          size={size}
          placeholder={placeholder}
          formatRemoveLabel={formatRemoveLabel}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLDivElement>}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }

    return (
      <button
        ref={setRef}
        type="button"
        id={id ?? context.triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={context.open ? context.contentId : undefined}
        aria-expanded={context.open}
        aria-invalid={context.invalid}
        aria-describedby={context.describedBy}
        data-state={context.open ? "open" : "closed"}
        className={clsx(triggerCva({ size }), className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.setOpen(!context.open);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || context.open) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            context.setOpen(true);
            return;
          }
          // 닫힌 상태 문자 키는 열기만 한다 — 다중 값에는 "문자 키가 값을 바로 바꾼다"는
          // 네이티브 관례가 없다. Space·Enter는 버튼의 네이티브 click이 이미 연다.
          if (isTypeaheadKey(event) && event.key !== " ") {
            event.preventDefault();
            context.setOpen(true);
          }
        }}
        {...props}
      >
        <span className="dds-select__value" data-placeholder={empty ? "" : undefined}>
          {children ?? summarize(context.value, context.options, placeholder, formatCount)}
        </span>
        <MultiSelectCaret />
      </button>
    );
  },
);
MultiSelectTrigger.displayName = "MultiSelect.Trigger";

export interface MultiSelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MultiSelectContent = React.forwardRef<HTMLDivElement, MultiSelectContentProps>(
  ({ className, onKeyDown, children, ...props }, ref) => {
    const context = useMultiSelectContext("MultiSelect.Content");
    const setRef = React.useMemo(
      () =>
        mergeRefs(
          ref,
          context.contentRef as React.RefObject<HTMLDivElement | null>,
          context.setContentNode as React.Ref<HTMLDivElement>,
        ),
      [ref, context.contentRef, context.setContentNode],
    );
    if (!context.present || !context.container) return null;

    return createPortal(
      <div
        ref={setRef}
        id={context.contentId}
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={context.triggerId}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-select__content", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          // 열린 상태 typeahead는 Select와 같다 — 포커스만 옮기고 값은 Enter·클릭이 정한다.
          const handled = handleOpenKeyDown(
            event,
            context.contentRef.current,
            context.options,
            context.typeahead,
          );
          if (handled) event.preventDefault();
        }}
        {...props}
      >
        {context.search?.mode === "content" ? <MultiSelectContentSearch /> : null}
        {children}
        {context.search === undefined ? null : <MultiSelectCreateItem />}
      </div>,
      context.container,
    );
  },
);
MultiSelectContent.displayName = "MultiSelect.Content";

export interface MultiSelectOptionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export const MultiSelectOption = React.forwardRef<HTMLButtonElement, MultiSelectOptionProps>(
  ({ className, value, children, onClick, ...props }, ref) => {
    const context = useMultiSelectContext("MultiSelect.Option");
    const { registerOption, search } = context;
    const disabled = (props as { disabled?: boolean }).disabled === true;
    React.useEffect(
      () => registerOption({ value, label: children, text: nodeToText(children), disabled }),
      [registerOption, value, children, disabled],
    );

    return (
      <button
        ref={ref}
        type="button"
        role={OPTION_ROLE}
        aria-selected={context.value.includes(value)}
        tabIndex={-1}
        // 필터에서 떨어져도 언마운트하지 않는다 — 등록 목록과 활성 이동 기준이 흔들린다.
        hidden={search?.hidden.has(value) || undefined}
        id={search?.mode === "trigger" ? search.optionId(value) : undefined}
        data-active={
          search?.mode === "trigger" && search.activeValue === value ? "" : undefined
        }
        // 활성 표시가 aria-activedescendant뿐이라 DOM 포커스는 입력에 붙들어 둔다.
        onMouseDown={
          search?.mode === "trigger" ? (event) => event.preventDefault() : undefined
        }
        {...{ [VALUE_ATTR]: value }}
        className={clsx("dds-select__option", className)}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          // 토글만 하고 닫지 않는다 — 연달아 여러 개를 고르는 것이 이 컴포넌트의 존재 이유다.
          context.toggleValue(value);
        }}
        {...props}
      >
        <svg
          className="dds-select__check"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="dds-select__option-label">{children}</span>
      </button>
    );
  },
);
MultiSelectOption.displayName = "MultiSelect.Option";

/**
 * compound: MultiSelect.Root/Trigger/Content/Option/Group/Label.
 * Group·Label은 Select의 것을 그대로 쓴다 — 둘 다 SelectContext를 읽지 않고
 * 자기들끼리의 라벨 id 컨텍스트만 주고받아 값 타입과 무관하다.
 */
export const MultiSelect = {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Content: MultiSelectContent,
  Option: MultiSelectOption,
  Group: Select.Group,
  Label: Select.Label,
};

export const MultiSelectGroup = Select.Group;
export const MultiSelectLabel = Select.Label;

// 검색·생성 props의 타입은 서브패스(`@dg-design/react/multi-select`)에서도 보여야 한다.
export type {
  MultiSelectCreate,
  MultiSelectFilter,
  MultiSelectFilterOption,
} from "./multi-select-search";
