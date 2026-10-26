import "./toggle-group.css";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { mergeProps, useToggleButtonGroup, useToggleButtonGroupItem } from "react-aria";
import { useToggleGroupState, type ToggleGroupState } from "react-stately";

import { CheckIcon } from "../icon/check-icon";
import { mergeRefs } from "../internal/merge-refs";

const toggleGroupRoot = cva("dds-toggle-group", {
  variants: {
    orientation: {
      horizontal: "dds-toggle-group--orientation_horizontal",
      vertical: "dds-toggle-group--orientation_vertical",
    },
    size: {
      small: "dds-toggle-group--size_small",
      medium: "dds-toggle-group--size_medium",
      large: "dds-toggle-group--size_large",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "medium",
  },
});

const toggleGroupItem = cva("dds-toggle-group-item", {
  variants: {
    size: {
      small: "dds-toggle-group-item--size_small",
      medium: "dds-toggle-group-item--size_medium",
      large: "dds-toggle-group-item--size_large",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

type AccessibleNameProps =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-labelledby": string; "aria-label"?: string };

type DivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange" | "role" | "aria-label" | "aria-labelledby"
>;

interface ToggleGroupRootCommonProps extends DivProps {
  size?: "small" | "medium" | "large";
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

export type ToggleGroupSingleProps = ToggleGroupRootCommonProps &
  AccessibleNameProps & {
    type: "single";
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    disallowEmptySelection?: boolean;
  };

export type ToggleGroupMultipleProps = ToggleGroupRootCommonProps &
  AccessibleNameProps & {
    type: "multiple";
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[]) => void;
    disallowEmptySelection?: boolean;
  };

export type ToggleGroupRootProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

interface ToggleGroupContextValue {
  state: ToggleGroupState;
  size: "small" | "medium" | "large";
  orientation: "horizontal" | "vertical";
  disabled: boolean;
  registerItem?: (value: string) => () => void;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

export const ToggleGroupRoot = React.forwardRef<HTMLDivElement, ToggleGroupRootProps>(
  (props, ref) => {
    const {
      type,
      size = "medium",
      orientation = "horizontal",
      disabled = false,
      className,
      children,
      value,
      defaultValue,
      onValueChange,
      disallowEmptySelection: disallowEmptySelectionProp,
      ...rest
    } = props;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const itemValuesRef = React.useRef<Map<string, number>>(new Map());

    // 제어/비제어 값 변경 추적용 ref (값 변경 시에만 콜백 1회 호출)
    const lastSingleValueRef = React.useRef<string | null | undefined>(
      type === "single"
        ? value !== undefined
          ? value
          : (defaultValue ?? null)
        : undefined,
    );
    const lastMultipleValuesRef = React.useRef<string[] | undefined>(
      type === "multiple"
        ? value !== undefined
          ? [...value]
          : [...(defaultValue ?? [])]
        : undefined,
    );

    React.useEffect(() => {
      if (type === "single" && value !== undefined) {
        lastSingleValueRef.current = value;
      } else if (type === "multiple" && value !== undefined) {
        lastMultipleValuesRef.current = [...value];
      }
    }, [type, value]);

    const handleSelectionChange = React.useCallback(
      (keys: Set<React.Key>) => {
        if (type === "single") {
          const nextValue = keys.size > 0 ? String([...keys][0]) : null;
          if (nextValue !== lastSingleValueRef.current) {
            lastSingleValueRef.current = nextValue;
            onValueChange?.(nextValue);
          }
        } else {
          let orderedValues: string[];
          if (rootRef.current) {
            // 중복 없이 Item DOM 순서 보장
            const itemEls = Array.from(
              rootRef.current.querySelectorAll<HTMLButtonElement>("[data-dds-toggle-group-item]"),
            );
            orderedValues = itemEls
              .map((el) => el.getAttribute("data-value"))
              .filter((v): v is string => v !== null && keys.has(v));
          } else {
            orderedValues = Array.from(keys).map(String);
          }
          const prev = lastMultipleValuesRef.current ?? [];
          const changed =
            prev.length !== orderedValues.length ||
            prev.some((v, idx) => v !== orderedValues[idx]);
          if (changed) {
            lastMultipleValuesRef.current = orderedValues;
            (onValueChange as ((val: string[]) => void) | undefined)?.(orderedValues);
          }
        }
      },
      [type, onValueChange],
    );

    const disallowEmptySelection =
      type === "single"
        ? (disallowEmptySelectionProp ?? true)
        : (disallowEmptySelectionProp ?? false);

    const selectedKeys = React.useMemo(() => {
      if (type === "single") {
        return value !== undefined ? (value != null ? [value] : []) : undefined;
      }
      return value !== undefined ? value : undefined;
    }, [type, value]);

    const defaultSelectedKeys = React.useMemo(() => {
      if (type === "single") {
        return defaultValue !== undefined
          ? defaultValue != null
            ? [defaultValue]
            : []
          : undefined;
      }
      return defaultValue !== undefined ? defaultValue : undefined;
    }, [type, defaultValue]);

    const state = useToggleGroupState({
      selectionMode: type,
      disallowEmptySelection,
      isDisabled: disabled,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange: handleSelectionChange,
    });

    const { groupProps } = useToggleButtonGroup(
      {
        orientation,
        isDisabled: disabled,
        "aria-label": props["aria-label"],
        "aria-labelledby": props["aria-labelledby"],
      },
      state,
      rootRef,
    );

    // DDS 보완: Home / End 키로 첫/마지막 활성 Item 초점 이동
    const handleKeyDownCapture = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Home" || event.key === "End") {
          if (!rootRef.current) return;
          const items = Array.from(
            rootRef.current.querySelectorAll<HTMLButtonElement>(
              'button[data-dds-toggle-group-item]:not([disabled]):not([aria-disabled="true"])',
            ),
          );
          if (items.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            if (event.key === "Home") {
              items[0]?.focus();
            } else {
              items[items.length - 1]?.focus();
            }
          }
        }
      },
      [],
    );

    // 중복 Item value 경고: 브라우저 라이브러리라 process.env 없이 직접 경고한다.
    const registerItem = React.useCallback((value: string) => {
      const currentCount = itemValuesRef.current.get(value) ?? 0;
      const nextCount = currentCount + 1;
      itemValuesRef.current.set(value, nextCount);
      if (nextCount > 1) {
        console.warn(
          `[ToggleGroup] Duplicate item value "${value}" detected. ToggleGroup.Item values must be unique.`,
        );
      }
      return () => {
        const c = itemValuesRef.current.get(value) ?? 1;
        if (c <= 1) {
          itemValuesRef.current.delete(value);
        } else {
          itemValuesRef.current.set(value, c - 1);
        }
      };
    }, []);

    if (!props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "[ToggleGroup] An accessible name is required. Please provide either `aria-label` or `aria-labelledby`.",
      );
    }

    const contextValue = React.useMemo<ToggleGroupContextValue>(
      () => ({
        state,
        size,
        orientation,
        disabled,
        registerItem,
      }),
      [state, size, orientation, disabled, registerItem],
    );

    const mergedProps = mergeProps(groupProps, { onKeyDownCapture: handleKeyDownCapture }, rest);

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          {...mergedProps}
          ref={mergeRefs(ref, rootRef)}
          data-orientation={orientation}
          data-size={size}
          className={clsx(
            toggleGroupRoot({
              orientation,
              size,
            }),
            className,
          )}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroupRoot.displayName = "ToggleGroup.Root";

export interface ToggleGroupItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "onChange" | "defaultChecked" | "checked"
  > {
  value: string;
  disabled?: boolean;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  (props, ref) => {
    const { className, value, disabled: itemDisabled, children, onFocus, ...rest } = props;
    const ctx = React.useContext(ToggleGroupContext);
    if (!ctx) {
      throw new Error("ToggleGroup.Item must be used within ToggleGroup.Root");
    }

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const isDisabled = ctx.disabled || itemDisabled || false;

    const { registerItem } = ctx;
    React.useEffect(() => {
      return registerItem?.(value);
    }, [registerItem, value]);

    const { buttonProps, isSelected } = useToggleButtonGroupItem(
      {
        id: value,
        isDisabled,
        "aria-label": props["aria-label"],
        "aria-labelledby": props["aria-labelledby"],
      },
      ctx.state,
      buttonRef,
    );

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLButtonElement>) => {
        onFocus?.(event);
        // 포커스된 Item을 보이는 범위로 스크롤 (jsdom 미구현 방어)
        event.currentTarget.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      },
      [onFocus],
    );

    const mergedProps = mergeProps(buttonProps, rest);

    return (
      <button
        type="button"
        {...mergedProps}
        ref={mergeRefs(ref, buttonRef)}
        disabled={isDisabled}
        aria-disabled={isDisabled ? true : undefined}
        data-disabled={isDisabled ? "" : undefined}
        data-state={isSelected ? "on" : "off"}
        data-selected={isSelected ? "" : undefined}
        data-value={value}
        data-dds-toggle-group-item=""
        onFocus={handleFocus}
        className={clsx(
          toggleGroupItem({
            size: ctx.size,
          }),
          className,
        )}
      >
        <span className="dds-toggle-group-item__mark" aria-hidden="true">
          <CheckIcon size={16} />
        </span>
        {children != null ? (
          <span className="dds-toggle-group-item__label">{children}</span>
        ) : null}
      </button>
    );
  },
);
ToggleGroupItem.displayName = "ToggleGroup.Item";

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};
