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
  /** 기본값 "auto" — 포인터로 누른 변경에서만 아이콘이 150ms 페이드·스케일한다.
   * 키보드·폼 reset·외부 값 변경·최초 렌더는 언제나 즉시. 대량 선택 화면은 "none". */
  motion?: "auto" | "none";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size,
      indeterminate = false,
      motion = "auto",
      children,
      id,
      onClick,
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

    // 포인터로 누른 변경만 모션을 허용한다. label을 눌러도 결국 input click 하나로 도착하므로
    // (실측: PointerEvent detail=1) 여기 한 곳에서만 판단하면 label·input 클릭이 중복되지 않는다.
    // 키보드 활성화는 detail=0이라 같은 자리에서 걸러지고, 그때 남아 있던 모션 상태도 함께 꺼진다.
    // 사용자가 preventDefault로 취소하면 값이 안 바뀌므로 모션도 켜지 않는다.
    const [pointerMotion, setPointerMotion] = React.useState(false);
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      onClick?.(event);
      setPointerMotion(motion === "auto" && event.detail > 0 && !event.defaultPrevented);
    };

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
          onClick={handleClick}
        />
        <span
          className="dds-checkbox__box"
          aria-hidden="true"
          data-motion={pointerMotion ? "" : undefined}
          // 전환이 끝나면 바로 해제한다 — 포인터 뒤의 프로그램 변경·키보드 조작에 모션이 남지 않는다.
          onTransitionEnd={() => setPointerMotion(false)}
        >
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
