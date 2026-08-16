import "./switch.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";

const switchRoot = cva("dds-switch", {
  variants: {
    size: {
      medium: "dds-switch--size_medium",
      large: "dds-switch--size_large",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role">,
    VariantProps<typeof switchRoot> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      size,
      children,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    // Field.Root 안이면 context에서 id·invalid·describedby를 받는다. 단독 사용 시
    // context가 없으니 자체 useId로 id를 만든다 (스펙: 단독 사용도 동작해야 함).
    const fieldCtx = React.useContext(FieldContext);
    const generatedId = React.useId();

    const resolvedId = id ?? fieldCtx?.inputId ?? generatedId;
    const resolvedDescribedBy =
      [fieldCtx?.describedBy, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
    const resolvedInvalid = ariaInvalid ?? fieldCtx?.invalid ?? false;

    return (
      <label className={clsx(switchRoot({ size }), className)}>
        <input
          type="checkbox"
          role="switch"
          ref={ref}
          id={resolvedId}
          aria-describedby={resolvedDescribedBy}
          aria-invalid={resolvedInvalid}
          className="dds-switch__input"
          {...props}
        />
        <span className="dds-switch__track" aria-hidden="true">
          <span className="dds-switch__thumb" />
        </span>
        {children != null ? <span className="dds-switch__label">{children}</span> : null}
      </label>
    );
  },
);
Switch.displayName = "Switch";
