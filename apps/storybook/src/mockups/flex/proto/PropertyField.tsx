import { Field, Select } from "@dg-design/react";
import * as React from "react";

/**
 * PropertyField 프로토타입 — packages/react에 없다. 텍스트 입력이 아니라 값을 고르는 트리거다.
 * 선택 로직은 DDS Select(또는 Popover)를 그대로 쓰고, 여기서는 라벨·값·caret 배치만 정한다.
 * 라벨은 버튼 밖에 있고(Field.Label for), 트리거의 ::after가 상자 전체를 덮어 누름 영역이 된다.
 *
 * layout
 * - "box": 라벨·값·caret이 필드 상자 하나 안에 있다(A). 모바일은 라벨이 값 위로 간다(내부 라벨 후보).
 * - "row": 라벨 열 + 값 트리거(B). 모바일은 PropertyGroup 안의 56 행 — 라벨 왼쪽, 값 오른쪽(M026).
 */
export interface PropertyFieldProps {
  label: React.ReactNode;
  layout: "box" | "row";
  description?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const LabelIdContext = React.createContext<string | undefined>(undefined);

export function PropertyField({ label, layout, description, error, className, children }: PropertyFieldProps) {
  const labelId = React.useId();
  return (
    <Field.Root className={className ? `fx-prop ${className}` : "fx-prop"} data-layout={layout}>
      <div className="fx-prop__box">
        <Field.Label id={labelId} className="fx-prop__label">{label}</Field.Label>
        <LabelIdContext.Provider value={labelId}>{children}</LabelIdContext.Provider>
      </div>
      {description && <Field.Description>{description}</Field.Description>}
      {error && <Field.ErrorMessage>{error}</Field.ErrorMessage>}
    </Field.Root>
  );
}

/** 모바일 B의 묶음 — 약한 중성 표면 하나에 PropertyField 행을 쌓는다. 데스크톱에서는 표면 없이 쌓인다. */
export function PropertyGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div role="group" aria-label={label} className="fx-prop-group">{children}</div>;
}

export interface PropertyOption {
  value: string;
  label: string;
}

/** Select로 여는 값. Field 연결(라벨 for·aria-describedby·invalid)은 Select가 이미 한다. */
export function PropertySelect({ options, placeholder, defaultValue, open, disabled }: {
  options: readonly PropertyOption[];
  placeholder?: string;
  defaultValue?: string;
  open?: boolean;
  disabled?: boolean;
}) {
  return (
    <Select.Root defaultValue={defaultValue} open={open}>
      <Select.Trigger className="fx-prop__trigger" placeholder={placeholder} disabled={disabled} />
      <Select.Content>
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
        ))}
      </Select.Content>
    </Select.Root>
  );
}

function Caret() {
  return (
    <svg className="fx-prop__caret" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Popover·Sheet로 여는 값(날짜·사람 등). `<Popover.Trigger asChild>`에 끼운다.
 * 이름은 "라벨 + 현재 값"으로 읽히게 aria-labelledby를 둘 다 가리킨다.
 */
export const PropertyButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { placeholder?: React.ReactNode }
>(({ children, placeholder, className, ...props }, ref) => {
  const labelId = React.useContext(LabelIdContext);
  const valueId = React.useId();
  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="dialog"
      aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
      className={className ? `fx-prop__trigger ${className}` : "fx-prop__trigger"}
      {...props}
    >
      <span id={valueId} className="fx-prop__value" data-placeholder={children ? undefined : ""}>{children ?? placeholder}</span>
      <Caret />
    </button>
  );
});
PropertyButton.displayName = "PropertyButton";
