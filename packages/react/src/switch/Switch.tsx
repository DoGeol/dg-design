import "./switch.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

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
  ({ className, size, children, ...props }, ref) => {
    return (
      <label className={clsx(switchRoot({ size }), className)}>
        <input type="checkbox" role="switch" ref={ref} className="dds-switch__input" {...props} />
        <span className="dds-switch__track" aria-hidden="true">
          <span className="dds-switch__thumb" />
        </span>
        {children != null ? <span className="dds-switch__label">{children}</span> : null}
      </label>
    );
  },
);
Switch.displayName = "Switch";
