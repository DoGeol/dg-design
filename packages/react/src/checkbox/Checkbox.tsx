import "./checkbox.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";
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
  (
    {
      className,
      size,
      indeterminate = false,
      children,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Field.Root 안이면 context에서 id·invalid·describedby를 받는다. 단독 사용 시
    // context가 없으니 자체 useId로 id를 만든다 (스펙: 단독 사용도 동작해야 함).
    const fieldCtx = React.useContext(FieldContext);
    const generatedId = React.useId();

    const resolvedId = id ?? fieldCtx?.inputId ?? generatedId;
    const resolvedDescribedBy =
      [fieldCtx?.describedBy, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
    const resolvedInvalid = ariaInvalid ?? fieldCtx?.invalid ?? false;

    return (
      <label className={clsx(checkbox({ size }), className)}>
        <input
          type="checkbox"
          ref={mergeRefs(ref, inputRef)}
          id={resolvedId}
          aria-describedby={resolvedDescribedBy}
          aria-invalid={resolvedInvalid}
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
