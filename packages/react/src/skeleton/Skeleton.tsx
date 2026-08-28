import "./skeleton.css";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const skeleton = cva("dds-skeleton", {
  variants: {
    radius: {
      none: "dds-skeleton--radius_none",
      small: "dds-skeleton--radius_small",
      medium: "dds-skeleton--radius_medium",
      full: "dds-skeleton--radius_full",
    },
  },
  defaultVariants: {
    radius: "medium",
  },
});

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: "none" | "small" | "medium" | "full";
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, radius, "aria-hidden": ariaHidden, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden={ariaHidden ?? true}
      className={clsx(skeleton({ radius }), className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";
