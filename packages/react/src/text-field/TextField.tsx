import "./text-field.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";

const textField = cva("dds-text-field", {
  variants: {
    size: {
      medium: "dds-text-field--size_medium",
      large: "dds-text-field--size_large",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

/** textarea·checkbox 류를 배제한, 한 줄 입력에 쓰는 네이티브 input type만 허용 */
export type TextFieldType = "text" | "email" | "password" | "tel" | "url" | "search" | "number";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof textField> {
  type?: TextFieldType;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      size,
      type = "text",
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    // Field.Root 안이면 context에서 id·invalid·describedby를 받는다. 단독 사용 시
    // context가 없으니 자체 useId로 id를 만든다 (스펙: 단독 사용도 동작해야 함).
    const fieldCtx = React.useContext(FieldContext);
    const generatedId = React.useId();

    const resolvedId = id ?? fieldCtx?.inputId ?? generatedId;
    const resolvedDescribedBy =
      [fieldCtx?.describedBy, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
    const resolvedInvalid = ariaInvalid ?? fieldCtx?.invalid ?? false;

    return (
      <input
        type={type}
        ref={ref}
        id={resolvedId}
        aria-describedby={resolvedDescribedBy}
        aria-invalid={resolvedInvalid}
        className={clsx(textField({ size }), className)}
        {...props}
      />
    );
  },
);
TextField.displayName = "TextField";
