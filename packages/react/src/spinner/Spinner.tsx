import "./spinner.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const spinner = cva("dds-spinner", {
  variants: {
    size: {
      small: "dds-spinner--size_small",
      medium: "dds-spinner--size_medium",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinner> {}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      className,
      size,
      role,
      "aria-hidden": ariaHidden,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    // 접근성 판단(위임): 라벨을 준 경우만 의미 있는 상태로 취급해 role="status"를 붙인다.
    // 라벨 없이 role만 얹으면 빈 live region이 낭독돼 오히려 잡음이다. Button 안에서처럼
    // 라벨 없이 쓰면 장식(aria-hidden)으로 빠진다 — Button이 aria-busy로 의미를 이미 전달한다.
    const hasLabel = ariaLabel != null || ariaLabelledBy != null;

    return (
      <span
        ref={ref}
        role={role ?? (hasLabel ? "status" : undefined)}
        aria-hidden={ariaHidden ?? (hasLabel ? undefined : true)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={clsx(spinner({ size }), className)}
        {...props}
      />
    );
  },
);
Spinner.displayName = "Spinner";
