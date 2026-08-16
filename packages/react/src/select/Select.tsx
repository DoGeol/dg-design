import "./select.css";

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
  matchOption,
  nodeToText,
  OPTION_ROLE,
  useOptionRegistry,
  useTypeahead,
  VALUE_ATTR,
  type OptionEntry,
} from "../internal/select-core";
import { useControllableState } from "../internal/use-controllable-state";
import { useOverlay } from "../internal/use-overlay";
import {
  SelectContext,
  SelectGroupContext,
  useSelectContext,
  type SelectContextValue,
} from "./select-context";

export interface SelectRootProps {
  /** controlled 값. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** 주면 같은 값의 hidden input을 렌더해 네이티브 폼 제출에 실린다. */
  name?: string;
  children?: React.ReactNode;
}

function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  name,
  children,
}: SelectRootProps) {
  const [selectedValue, setValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as ((next: string | undefined) => void) | undefined,
  });

  const { options, registerOption } = useOptionRegistry(children, SelectOption);

  // 열릴 때는 선택된 옵션으로 들어간다(없으면 첫 옵션) — 네이티브 select와 같은 자리.
  const focusSelectedOption = (content: HTMLElement) => {
    const items = getItems(content, OPTION_ROLE);
    const index = items.findIndex((item) => item.getAttribute(VALUE_ATTR) === selectedValue);
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

  const context = React.useMemo<SelectContextValue>(
    () => ({
      ...overlay,
      triggerId,
      describedBy: fieldCtx?.describedBy,
      invalid: fieldCtx?.invalid ?? false,
      value: selectedValue,
      setValue: setValue as (next: string) => void,
      options,
      registerOption,
      typeahead,
    }),
    [
      overlay,
      triggerId,
      fieldCtx?.describedBy,
      fieldCtx?.invalid,
      selectedValue,
      setValue,
      options,
      registerOption,
      typeahead,
    ],
  );

  return (
    <SelectContext.Provider value={context}>
      {children}
      {name === undefined ? null : <input type="hidden" name={name} value={selectedValue ?? ""} />}
    </SelectContext.Provider>
  );
}
SelectRoot.displayName = "Select.Root";

const trigger = cva("dds-select__trigger", {
  variants: {
    size: {
      medium: "dds-select__trigger--size_medium",
      large: "dds-select__trigger--size_large",
    },
  },
  defaultVariants: { size: "medium" },
});

export interface SelectTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    VariantProps<typeof trigger> {
  /** 값이 없을 때 보여줄 내용. 회색으로 표시된다. */
  placeholder?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size, placeholder, children, id, onClick, onKeyDown, ...props }, ref) => {
    const context = useSelectContext("Select.Trigger");
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLButtonElement>),
      [ref, context.setTriggerNode],
    );
    const selected = context.options.find((option) => option.value === context.value);

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
          // Enter·Space는 버튼의 네이티브 click이 그대로 열기만 한다 — 값은 안 바뀐다.
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            context.setOpen(true);
            return;
          }
          // 닫힌 상태의 문자 키만 값을 직접 바꾼다(네이티브 관례). Space는 열기 쪽이다.
          if (!isTypeaheadKey(event) || event.key === " ") return;
          const match = matchOption(
            context.options,
            context.typeahead.push(event.key),
            context.value,
          );
          if (match) {
            event.preventDefault();
            context.setValue(match.value);
          }
        }}
        {...props}
      >
        <span className="dds-select__value" data-placeholder={selected ? undefined : ""}>
          {children ?? selected?.label ?? placeholder}
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
SelectTrigger.displayName = "Select.Trigger";

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const context = useSelectContext("Select.Content");
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
        aria-labelledby={context.triggerId}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-select__content", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
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
SelectContent.displayName = "Select.Content";

export interface SelectOptionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

const SelectOption = React.forwardRef<HTMLButtonElement, SelectOptionProps>(
  ({ className, value, children, onClick, ...props }, ref) => {
    const context = useSelectContext("Select.Option");
    const selected = context.value === value;
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
        aria-selected={selected}
        tabIndex={-1}
        {...{ [VALUE_ATTR]: value }}
        className={clsx("dds-select__option", className)}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          context.setValue(value);
          context.setOpen(false);
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
SelectOption.displayName = "Select.Option";

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    const labelId = React.useId();
    return (
      <SelectGroupContext.Provider value={labelId}>
        <div
          ref={ref}
          role="group"
          aria-labelledby={labelId}
          className={clsx("dds-select__group", className)}
          {...props}
        >
          {children}
        </div>
      </SelectGroupContext.Provider>
    );
  },
);
SelectGroup.displayName = "Select.Group";

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, id, ...props }, ref) => {
    const groupLabelId = React.useContext(SelectGroupContext);
    return (
      <div
        ref={ref}
        id={id ?? groupLabelId}
        className={clsx("dds-select__label", className)}
        {...props}
      />
    );
  },
);
SelectLabel.displayName = "Select.Label";

/**
 * compound: Select.Root/Trigger/Content/Option/Group/Label.
 * 오버레이 배선·roving·옵션 수집·열린 상태 키보드는 `internal/`(use-overlay·select-core)에 있고,
 * 여기 남는 것은 단일 값 상태·닫힌 상태 typeahead·트리거 외관이다.
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
  Group: SelectGroup,
  Label: SelectLabel,
};
