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
  /** 기본값 "auto" — 로딩이 바뀔 때 라벨과 중앙 Spinner가 150ms 교차 페이드한다.
   * "none"이면 즉시 바뀐다(폭 안정화는 그대로). asChild 경로에는 해당 없음. */
  motion?: "auto" | "none";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      intent,
      variant,
      size,
      asChild,
      loading,
      motion = "auto",
      disabled,
      children,
      onTransitionEnd,
      ...props
    },
    ref,
  ) => {
    // asChild면 Slot이 자식 하나만 받아야 해서 Spinner를 얹을 자리가 없다 — loading은 무시한다.
    // 개발 환경 판별(process.env) 없이 항상 경고한다: 이 조합은 언제나 사용 실수이고,
    // 브라우저 라이브러리라 node 타입을 끌어오지 않는다.
    if (loading && asChild) {
      console.warn(
        "Button: `asChild`와 `loading`은 함께 쓸 수 없습니다. `asChild`가 우선하고 `loading`은 무시됩니다.",
      );
    }

    const classes = clsx(button({ intent, variant, size }), className);
    const isLoading = Boolean(loading) && !asChild;

    // 사라지는 동안에도 같은 레이어가 남아야 opacity 전환이 현재 값에서 이어진다 — 전환이
    // 끝나면(또는 애초에 모션이 없으면) 내린다. 로딩을 한 번도 안 쓴 버튼에는 아무것도 안 붙는다.
    const [spinnerMounted, setSpinnerMounted] = React.useState(isLoading);
    if (isLoading && !spinnerMounted) setSpinnerMounted(true);
    if (!isLoading && spinnerMounted && motion === "none") setSpinnerMounted(false);

    if (asChild) {
      // asChild는 Slot 경로 그대로 — 래퍼도 레이어도 얹지 않는다. Slot은 자식이 하나여야 하는데
      // `{false}{children}` 형태도 배열 2개로 세어 Children.only가 실패한다.
      // Slot의 props 타입에는 disabled가 없다(자식으로 그대로 흘려보낼 뿐) — 예전처럼 느슨하게 넘긴다.
      const Comp = Slot as React.ElementType;
      return (
        <Comp
          ref={ref}
          className={classes}
          disabled={disabled}
          onTransitionEnd={onTransitionEnd}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        data-loading={isLoading || undefined}
        data-motion={motion === "auto" ? "" : undefined}
        {...props}
        onTransitionEnd={(event) => {
          onTransitionEnd?.(event);
          if (!isLoading) setSpinnerMounted(false);
        }}
      >
        {/* 래퍼가 children의 자리를 그대로 잡아 로딩 중에도 버튼 크기가 바뀌지 않는다.
            레이어는 클래스 없이 data 속성으로 구분한다 — 색 스냅샷은 dds- 클래스만 훑는다. */}
        <span data-layer="content">{children}</span>
        <span data-layer="spinner" aria-hidden="true">
          {spinnerMounted ? <Spinner className="dds-button__spinner" aria-hidden="true" /> : null}
        </span>
      </button>
    );
  },
);
Button.displayName = "Button";
