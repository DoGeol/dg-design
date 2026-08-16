import "./radio-group.css";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { useControllableState } from "../internal/use-controllable-state";
import { RadioGroupContext } from "./radio-group-context";

const radioGroup = cva("dds-radio-group", {
  variants: {
    orientation: {
      vertical: "dds-radio-group--orientation_vertical",
      horizontal: "dds-radio-group--orientation_horizontal",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface RadioGroupRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
}

/**
 * 화살표 이동·선택은 네이티브 radio(name 공유)에 위임한다. 브라우저는 두 축 모두에
 * 반응하므로, orientation의 반대 축 키만 keydown에서 preventDefault해 축을 제한한다.
 * disabled 항목은 네이티브가 자동으로 건너뛴다 — roving-focus 유틸은 쓰지 않는다.
 */
const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioGroupRootProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      name,
      orientation = "vertical",
      disabled = false,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedName = React.useId();
    const handleChange = React.useCallback(
      (next: string | undefined) => {
        if (next !== undefined) onValueChange?.(next);
      },
      [onValueChange],
    );
    const [current, setCurrent] = useControllableState<string | undefined>({
      value,
      defaultValue,
      onChange: handleChange,
    });

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const crossAxisKeys =
          orientation === "horizontal" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
        if (crossAxisKeys.includes(event.key)) event.preventDefault();
      },
      [onKeyDown, orientation],
    );

    const contextValue = React.useMemo(
      () => ({
        value: current,
        setValue: setCurrent,
        name: name ?? generatedName,
        orientation,
        disabled,
      }),
      [current, setCurrent, name, generatedName, orientation, disabled],
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          {...props}
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          className={clsx(radioGroup({ orientation }), className)}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroupRoot.displayName = "RadioGroup.Root";

export interface RadioGroupItemProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "name" | "checked" | "onChange" | "value" | "size"
  > {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, disabled: itemDisabled, children, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext);
    if (!ctx) throw new Error("RadioGroup.Item must be used within RadioGroup.Root");

    const disabled = ctx.disabled || itemDisabled || false;

    return (
      <label className={clsx("dds-radio", className)}>
        <input
          type="radio"
          ref={ref}
          name={ctx.name}
          value={value}
          checked={ctx.value === value}
          disabled={disabled}
          onChange={() => ctx.setValue(value)}
          className="dds-radio__input"
          {...props}
        />
        <span className="dds-radio__box" aria-hidden="true">
          <span className="dds-radio__dot" />
        </span>
        {children != null ? <span className="dds-radio__label">{children}</span> : null}
      </label>
    );
  },
);
RadioGroupItem.displayName = "RadioGroup.Item";

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
