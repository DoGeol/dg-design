import "./select.css";

import type { Placement } from "@floating-ui/dom";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { FieldContext } from "../field/field-context";
import { mergeRefs } from "../internal/merge-refs";
import { focusItem, getItems, moveFocus } from "../internal/roving-focus";
import { useControllableState } from "../internal/use-controllable-state";
import { useOverlay } from "../internal/use-overlay";
import {
  SelectContext,
  SelectGroupContext,
  useSelectContext,
  type SelectContextValue,
} from "./select-context";
import { collectOptions, matchOption, nodeToText, type OptionEntry } from "./select-options";
import { useTypeahead } from "./use-typeahead";

const OPTION_ROLE = "option";
/** 옵션 DOM에서 값을 되읽는 통로 — roving은 DOM 조회라 등록 배열이 없다. */
const VALUE_ATTR = "data-dds-value";

/** 문자 키인지. 조합 키가 눌린 상태는 단축키이므로 typeahead가 아니다. */
function isTypeaheadKey(event: React.KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

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

  const scanned = React.useMemo(() => collectOptions(children, SelectOption), [children]);

  // 스캔은 사용자 컴포넌트로 감싼 옵션을 못 본다 — 마운트 등록분이 그 구멍을 메운다.
  // 등록은 해제하지 않는 스티키 캐시다: 옵션은 닫히면 unmount되는데 그때 지우면
  // 선택 직후 트리거 라벨이 다시 사라진다. value→라벨 표라 stale이어도 무해하다.
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
          const content = context.contentRef.current;
          if (moveFocus(content, OPTION_ROLE, event.key)) {
            event.preventDefault();
            return;
          }
          // 열린 상태의 typeahead는 포커스만 옮긴다 — 값은 Enter·클릭으로 확정한다.
          // Space는 이어 치는 중일 때만 문자다(그 외에는 포커스된 옵션을 고른다).
          if (!isTypeaheadKey(event)) return;
          if (event.key === " " && !context.typeahead.hasBuffer()) return;
          const items = getItems(content, OPTION_ROLE);
          const focused = items.find((item) => item === document.activeElement);
          const match = matchOption(
            context.options,
            context.typeahead.push(event.key),
            focused?.getAttribute(VALUE_ATTR) ?? undefined,
          );
          if (!match) return;
          event.preventDefault();
          focusItem(
            items,
            items.findIndex((item) => item.getAttribute(VALUE_ATTR) === match.value),
          );
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
 * 오버레이 배선과 roving은 DropdownMenu와 공유하는 `internal/`에 있고,
 * 여기 남는 것은 값 상태·typeahead·트리거 외관이다.
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
  Group: SelectGroup,
  Label: SelectLabel,
};
