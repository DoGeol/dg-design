import "./property-field.css";
import clsx from "clsx";
import * as React from "react";

import { FieldDescription, FieldErrorMessage, FieldLabel, FieldRoot } from "../field/Field";
import { FieldContext } from "../field/field-context";

/** 묶음 이름은 필수다 — 모바일에서 한 표면 안의 행들이 무엇의 설정인지 읽혀야 한다. */
export type PropertyFieldGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "aria-label" | "aria-labelledby"> &
  ({ "aria-label": string; "aria-labelledby"?: undefined } | { "aria-labelledby": string; "aria-label"?: undefined });

/** 속성 행 묶음. 데스크톱은 표면 없이 쌓고, 모바일은 약한 중성 표면 하나에 행을 쌓는다. */
export const PropertyFieldGroup = React.forwardRef<HTMLDivElement, PropertyFieldGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={clsx("dds-property-field-group", className)} {...props} />
  ),
);
PropertyFieldGroup.displayName = "PropertyField.Group";

/**
 * 값을 고르는 속성 행 — 라벨 왼쪽, 값 오른쪽. 텍스트 입력이 아니라 선택창을 여는 트리거를 둔다:
 * Select(`Select.Root` + `Select.Trigger`) 또는 Popover·Sheet(`PropertyField.Trigger`).
 * Field.Root 위에 만들어 라벨 for·describedby·invalid 연결을 그대로 쓴다.
 */
export const PropertyFieldRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <FieldRoot ref={ref} className={clsx("dds-property-field", className)} {...props} />
  ),
);
PropertyFieldRoot.displayName = "PropertyField.Root";

export interface PropertyFieldTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 값이 없을 때 보일 내용. */
  placeholder?: React.ReactNode;
}

/**
 * Popover·Sheet로 값을 고르는 트리거. `<Popover.Trigger asChild>`에 끼운다.
 * id가 Field의 control id라 라벨을 눌러도 열린다. 이름은 "라벨 + 현재 값"이다 —
 * button은 라벨이 있으면 내용을 이름에 쓰지 않아 값이 안 읽히기 때문이다.
 */
export const PropertyFieldTrigger = React.forwardRef<HTMLButtonElement, PropertyFieldTriggerProps>(
  ({ placeholder, className, children, id, ...props }, ref) => {
    const field = React.useContext(FieldContext);
    const valueId = React.useId();
    const empty = children === undefined || children === null || children === false;
    return (
      <button
        ref={ref}
        type="button"
        // Popover.Trigger asChild가 자기 id를 내려보내도 라벨 for가 닿게 Field id가 이긴다.
        id={field?.inputId ?? id}
        aria-labelledby={field ? `${field.labelId} ${valueId}` : undefined}
        aria-invalid={field?.invalid || undefined}
        aria-describedby={field?.describedBy}
        className={clsx("dds-property-field__trigger", className)}
        {...props}
      >
        <span id={valueId} className="dds-property-field__value" data-placeholder={empty ? "" : undefined}>
          {empty ? placeholder : children}
        </span>
        <svg className="dds-property-field__caret" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  },
);
PropertyFieldTrigger.displayName = "PropertyField.Trigger";

// 라벨·설명·오류는 Field의 것을 그대로 쓴다(같은 context).
export const PropertyFieldLabel = FieldLabel;
export const PropertyFieldDescription = FieldDescription;
export const PropertyFieldErrorMessage = FieldErrorMessage;

export const PropertyField = {
  Group: PropertyFieldGroup,
  Root: PropertyFieldRoot,
  Label: PropertyFieldLabel,
  Trigger: PropertyFieldTrigger,
  Description: PropertyFieldDescription,
  ErrorMessage: PropertyFieldErrorMessage,
};
