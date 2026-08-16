// 외관은 Select와 완전히 같다 — 다중 선택은 값 모양과 닫힘 정책만 다르므로 CSS를 새로 쓰지 않는다.
import "../select/select.css";

import type { Placement } from "@floating-ui/dom";
import { cva, type VariantProps } from "class-variance-authority";
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
  children?: React.ReactNode;
}

function MultiSelectRoot({
  value,
  defaultValue = NO_VALUES,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  name,
  children,
}: MultiSelectRootProps) {
  const [selectedValues, setValue] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const { options, registerOption } = useOptionRegistry(children, MultiSelectOption);

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

  // 열릴 때는 선택된 것 중 첫 옵션으로(없으면 첫 옵션) — Select와 같은 자리.
  const focusSelectedOption = (content: HTMLElement) => {
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
    onOpenFocus: focusSelectedOption,
  });

  const fieldCtx = React.useContext(FieldContext);
  const generatedId = React.useId();
  const triggerId = fieldCtx?.inputId ?? generatedId;
  const typeahead = useTypeahead();

  const context = React.useMemo<MultiSelectContextValue>(
    () => ({
      ...overlay,
      triggerId,
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
      triggerId,
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

const trigger = cva("dds-select__trigger", {
  variants: {
    size: {
      medium: "dds-select__trigger--size_medium",
      large: "dds-select__trigger--size_large",
    },
  },
  defaultVariants: { size: "medium" },
});

export interface MultiSelectTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    VariantProps<typeof trigger> {
  /** 선택이 없을 때 보여줄 내용. 회색으로 표시된다. */
  placeholder?: React.ReactNode;
}

/**
 * 트리거는 요약 텍스트 한 줄이다(칩 나열 아님) — 선택이 늘어도 높이가 고정된다.
 * 라벨을 못 찾는 경우(옵션을 사용자 컴포넌트로 감싸 스캔에 안 잡힐 때)는 값 문자열로 떨어진다.
 */
function summarize(
  value: readonly string[],
  options: { value: string; label: React.ReactNode }[],
  placeholder: React.ReactNode,
): React.ReactNode {
  if (value.length === 0) return placeholder;
  if (value.length === 1) {
    return options.find((option) => option.value === value[0])?.label ?? value[0];
  }
  return `${value.length}개 선택됨`;
}

const MultiSelectTrigger = React.forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  ({ className, size, placeholder, children, id, onClick, onKeyDown, ...props }, ref) => {
    const context = useMultiSelectContext("MultiSelect.Trigger");
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLButtonElement>),
      [ref, context.setTriggerNode],
    );
    const empty = context.value.length === 0;

    return (
      <button
        ref={setRef}
        type="button"
        id={id ?? context.triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={context.open}
        aria-invalid={context.invalid}
        aria-describedby={context.describedBy}
        data-state={context.open ? "open" : "closed"}
        className={clsx(trigger({ size }), className)}
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
          {children ?? summarize(context.value, context.options, placeholder)}
        </span>
        <svg
          className="dds-select__caret"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  },
);
MultiSelectTrigger.displayName = "MultiSelect.Trigger";

export interface MultiSelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const MultiSelectContent = React.forwardRef<HTMLDivElement, MultiSelectContentProps>(
  ({ className, onKeyDown, ...props }, ref) => {
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
      />,
      context.container,
    );
  },
);
MultiSelectContent.displayName = "MultiSelect.Content";

export interface MultiSelectOptionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

const MultiSelectOption = React.forwardRef<HTMLButtonElement, MultiSelectOptionProps>(
  ({ className, value, children, onClick, ...props }, ref) => {
    const context = useMultiSelectContext("MultiSelect.Option");
    const { registerOption } = context;
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
