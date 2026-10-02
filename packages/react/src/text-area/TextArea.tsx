import "./text-area.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";
import { mergeRefs } from "../internal/merge-refs";
import { useAutoResize } from "./use-auto-resize";

const textArea = cva("dds-text-area", {
  variants: {
    size: {
      medium: "dds-text-area--size_medium",
      large: "dds-text-area--size_large",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textArea> {
  /** true면 입력량에 따라 높이가 늘어난다. 기본 false — 네이티브 rows + resize: vertical. */
  autoResize?: boolean;
  /** true면 textarea 아래에 글자 수를 보인다. maxLength가 있으면 "현재/최대". 켜면 wrapper div가 생긴다. */
  showCount?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      size,
      autoResize = false,
      showCount = false,
      rows = 3,
      id,
      onInput,
      onChange,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    // Field.Root 안이면 context에서 id·invalid·describedby를 받는다. 단독 사용 시
    // context가 없으니 자체 useId로 id를 만든다 (TextField와 동일한 관습).
    const fieldCtx = React.useContext(FieldContext);
    const generatedId = React.useId();
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const { handleInput } = useAutoResize(innerRef, autoResize);

    const countId = React.useId();
    // controlled면 value가 기준, uncontrolled면 onChange로 따라간다.
    const [typedLength, setTypedLength] = React.useState(String(props.defaultValue ?? "").length);
    const count = props.value !== undefined ? String(props.value).length : typedLength;

    const resolvedId = id ?? fieldCtx?.inputId ?? generatedId;
    const resolvedDescribedBy =
      [fieldCtx?.describedBy, ariaDescribedBy, showCount ? countId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;
    const resolvedInvalid = ariaInvalid ?? fieldCtx?.invalid ?? false;

    const textarea = (
      <textarea
        ref={mergeRefs(ref, innerRef)}
        id={resolvedId}
        rows={rows}
        aria-describedby={resolvedDescribedBy}
        aria-invalid={resolvedInvalid}
        className={clsx(
          textArea({ size }),
          autoResize && "dds-text-area--auto-resize",
          className,
        )}
        onInput={(event) => {
          handleInput();
          onInput?.(event);
        }}
        {...props}
        onChange={(event) => {
          setTypedLength(event.target.value.length);
          onChange?.(event);
        }}
      />
    );

    if (!showCount) return textarea;

    // 카운터는 aria-live 없이 describedby로만 연결한다 — 매 타이핑마다 읽히지 않게.
    return (
      <div className="dds-text-area__wrapper">
        {textarea}
        <span id={countId} className="dds-text-area__count">
          {props.maxLength != null ? `${count}/${props.maxLength}` : count}
        </span>
      </div>
    );
  },
);
TextArea.displayName = "TextArea";
