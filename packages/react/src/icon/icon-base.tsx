import "./icon.css";

import clsx from "clsx";
import * as React from "react";

type ReservedSvgKeys =
  | "children"
  | "viewBox"
  | "strokeWidth"
  | "fill"
  | "role"
  | "tabIndex"
  | `aria-${string}`
  | `on${string}`;

export interface IconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, ReservedSvgKeys> {
  /** 시각 크기 (px). 16, 20, 24 중 하나. 기본값 20. */
  size?: 16 | 20 | 24;
  /**
   * 접근 이름.
   * 비어 있지 않은 문자열이면 `role="img"`와 `aria-label`이 설정된다.
   * 생략되거나 공백 문자열이면 `aria-hidden="true"`와 `focusable="false"`가 설정된다.
   */
  label?: string;
}

export interface InternalIconBaseProps extends IconProps {
  children?: React.ReactNode;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
}

export const IconBase = React.forwardRef<SVGSVGElement, InternalIconBaseProps>(
  (
    {
      size = 20,
      label,
      className,
      style,
      fill = "none",
      stroke = "currentColor",
      strokeWidth = "var(--dds-stroke-icon-width, 2)",
      children,
      ...props
    },
    ref,
  ) => {
    const trimmed = label?.trim();
    const hasLabel = Boolean(trimmed);

    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={hasLabel ? "img" : undefined}
        aria-label={hasLabel ? trimmed : undefined}
        aria-hidden={hasLabel ? undefined : "true"}
        focusable={hasLabel ? undefined : "false"}
        className={clsx("dds-icon", `dds-icon--size_${size}`, className)}
        style={style}
        {...props}
      >
        {children}
      </svg>
    );
  },
);

IconBase.displayName = "IconBase";
