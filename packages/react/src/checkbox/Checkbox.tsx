import "./checkbox.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { mergeRefs } from "../internal/merge-refs";

const checkbox = cva("dds-checkbox", {
  variants: {
    size: {
      medium: "dds-checkbox--size_medium",
      large: "dds-checkbox--size_large",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof checkbox> {
  /** 부분 선택 상태. DOM 프로퍼티라 checked와 별개로 ref를 통해 반영한다. */
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, indeterminate = false, children, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <label className={clsx(checkbox({ size }), className)}>
        <input
          type="checkbox"
          ref={mergeRefs(ref, inputRef)}
          className="dds-checkbox__input"
          {...props}
        />
        <span className="dds-checkbox__box" aria-hidden="true">
          <svg
            className="dds-checkbox__check-icon"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 6.25L4.75 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="dds-checkbox__dash-icon"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        {children != null ? <span className="dds-checkbox__label">{children}</span> : null}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
