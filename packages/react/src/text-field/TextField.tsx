import "./text-field.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";
import { mergeRefs } from "../internal/merge-refs";

const textField = cva("dds-text-field", {
  variants: {
    size: {
      medium: "dds-text-field--size_medium",
      large: "dds-text-field--size_large",
    },
    // box·line은 모바일 밀도 안에서만 외관이 바뀐다(CSS). 그 밖에서는 outline으로 그린다.
    variant: {
      outline: "dds-text-field--variant_outline",
      box: "dds-text-field--variant_box",
      line: "dds-text-field--variant_line",
    },
  },
  defaultVariants: {
    size: "medium",
    variant: "outline",
  },
});

/** textarea·checkbox 류를 배제한, 한 줄 입력에 쓰는 네이티브 input type만 허용 */
export type TextFieldType = "text" | "email" | "password" | "tel" | "url" | "search" | "number";

export interface TextFieldProps
  // HTML `prefix`(RDFa 속성)와 이름이 겹쳐 Omit으로 덮어쓴다.
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "prefix">,
    VariantProps<typeof textField> {
  type?: TextFieldType;
  /** 입력 앞 장식(아이콘·단위 등). prefix/suffix 중 하나라도 있으면 wrapper div가 생기고
   * className은 wrapper에 붙는다. 둘 다 없으면 DOM은 input 하나 그대로다. */
  prefix?: React.ReactNode;
  /** 입력 뒤 장식. prefix와 같은 규칙. */
  suffix?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      size,
      variant,
      prefix,
      suffix,
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
    const innerRef = React.useRef<HTMLInputElement>(null);

    const hasAffix = prefix != null || suffix != null;
    const inputProps = {
      type,
      id: resolvedId,
      "aria-describedby": resolvedDescribedBy,
      "aria-invalid": resolvedInvalid,
    };

    if (!hasAffix) {
      return (
        <input
          {...inputProps}
          ref={ref}
          className={clsx(textField({ size, variant }), className)}
          {...props}
        />
      );
    }

    // 장식 영역을 눌러도 입력에 포커스가 가게 한다. 안의 버튼·링크 클릭은 건드리지 않도록
    // wrapper·affix 자체를 누른 경우만 가로챈다.
    const focusInput = (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target === event.currentTarget || target.classList.contains("dds-text-field__affix")) {
        event.preventDefault();
        innerRef.current?.focus();
      }
    };

    return (
      <div
        // 베이스 .dds-text-field는 :read-only가 div에도 매치돼 wrapper에 쓰지 않고 size 클래스만 공유한다.
        className={clsx(
          "dds-text-field__wrapper",
          `dds-text-field--size_${size ?? "medium"}`,
          `dds-text-field--variant_${variant ?? "outline"}`,
          className,
        )}
        onMouseDown={focusInput}
      >
        {prefix != null ? (
          <span className="dds-text-field__affix dds-text-field__prefix">{prefix}</span>
        ) : null}
        <input
          {...inputProps}
          ref={mergeRefs(ref, innerRef)}
          className="dds-text-field__input"
          {...props}
        />
        {suffix != null ? (
          <span className="dds-text-field__affix dds-text-field__suffix">{suffix}</span>
        ) : null}
      </div>
    );
  },
);
TextField.displayName = "TextField";
