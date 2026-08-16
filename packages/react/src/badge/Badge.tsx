import "./badge.css";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const badge = cva("dds-badge", {
  variants: {
    intent: {
      brand: "dds-badge--intent_brand",
      neutral: "dds-badge--intent_neutral",
      critical: "dds-badge--intent_critical",
      positive: "dds-badge--intent_positive",
      warning: "dds-badge--intent_warning",
      informative: "dds-badge--intent_informative",
    },
    variant: {
      solid: "dds-badge--variant_solid",
      weak: "dds-badge--variant_weak",
      outline: "dds-badge--variant_outline",
    },
    size: {
      medium: "dds-badge--size_medium",
      large: "dds-badge--size_large",
    },
    truncate: {
      true: "dds-badge--truncate",
    },
  },
  defaultVariants: {
    intent: "neutral",
    variant: "weak",
    size: "medium",
    truncate: false,
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, intent, variant, size, truncate, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={clsx(badge({ intent, variant, size, truncate }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";
