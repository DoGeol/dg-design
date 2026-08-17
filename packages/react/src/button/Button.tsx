import "./button.css";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { Spinner } from "../spinner/Spinner";

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
  /** true면 Spinner 표시 + disabled + aria-busy를 함께 켠다. asChild와는 배타적(asChild 우선, loading 무시 + 개발 환경 경고). */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, variant, size, asChild, loading, disabled, children, ...props }, ref) => {
    // asChild면 Slot이 자식 하나만 받아야 해서 Spinner를 얹을 자리가 없다 — loading은 무시한다.
    // 개발 환경 판별(process.env) 없이 항상 경고한다: 이 조합은 언제나 사용 실수이고,
    // 브라우저 라이브러리라 node 타입을 끌어오지 않는다.
    if (loading && asChild) {
      console.warn(
        "Button: `asChild`와 `loading`은 함께 쓸 수 없습니다. `asChild`가 우선하고 `loading`은 무시됩니다.",
      );
    }
    const isLoading = Boolean(loading) && !asChild;
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={clsx(button({ intent, variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        data-loading={isLoading || undefined}
        {...props}
      >
        {/* asChild면 children을 그대로 넘긴다 — Slot은 자식이 하나여야 하는데
            `{false}{children}` 형태도 배열 2개로 세어 Children.only가 실패한다. */}
        {isLoading ? (
          <>
            <Spinner className="dds-button__spinner" aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
