import "./separator.css";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const separator = cva("dds-separator", {
  variants: {
    orientation: {
      horizontal: "dds-separator--orientation_horizontal",
      vertical: "dds-separator--orientation_vertical",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      role,
      "aria-hidden": ariaHidden,
      "aria-orientation": ariaOrientation,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      role={role ?? (decorative ? undefined : "separator")}
      aria-hidden={ariaHidden ?? (decorative ? true : undefined)}
      aria-orientation={ariaOrientation ?? (decorative ? undefined : orientation)}
      className={clsx(separator({ orientation }), className)}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";
