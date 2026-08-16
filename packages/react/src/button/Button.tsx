import "./button.css";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const button = cva("dds-button", {
  variants: {
    intent: {
      brand: "dds-button--intent_brand",
      neutral: "dds-button--intent_neutral",
      /** 되돌릴 수 없는 파괴적 액션(삭제·탈퇴)에만. 경고 표시가 아니라 실행 버튼이다. */
      critical: "dds-button--intent_critical",
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
    VariantProps<typeof button> {
  /** 자식 엘리먼트에 버튼 스타일만 입힌다 — 링크를 버튼처럼 보이게 할 때. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={clsx(button({ intent, variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";
