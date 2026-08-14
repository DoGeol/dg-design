import "./button.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const button = cva("dds-button", {
  variants: {
    intent: {
      brand: "dds-button--intent_brand",
      neutral: "dds-button--intent_neutral",
    },
    variant: {
      solid: "dds-button--variant_solid",
      weak: "dds-button--variant_weak",
      ghost: "dds-button--variant_ghost",
    },
    size: {
      small: "dds-button--size_small",
      medium: "dds-button--size_medium",
      large: "dds-button--size_large",
    },
  },
  defaultVariants: {
    intent: "brand",
    variant: "solid",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(button({ intent, variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";
