import clsx from "clsx";
import * as React from "react";

import { optionLabel, type OptionLabelProps, OPTION_ROLE, VALUE_ATTR } from "../internal/select-core";
import { useMultiSelectContext } from "./multi-select-context";

export interface MultiSelectOptionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    OptionLabelProps {
  value: string;
}

export const MultiSelectOption = React.forwardRef<HTMLButtonElement, MultiSelectOptionProps>(
  ({ className, value, label, textValue, children, onClick, ...props }, ref) => {
    const context = useMultiSelectContext("MultiSelect.Option");
    const { registerOption, search } = context;
    const disabled = (props as { disabled?: boolean }).disabled === true;
    React.useEffect(
      () => registerOption({ value, ...optionLabel({ label, textValue, children }), disabled }),
      [registerOption, value, label, textValue, children, disabled],
    );

    return (
      <button
        ref={ref}
        type="button"
        role={OPTION_ROLE}
        aria-selected={context.value.includes(value)}
        tabIndex={-1}
        // 필터에서 떨어져도 언마운트하지 않는다 — 등록 목록과 활성 이동 기준이 흔들린다.
        hidden={search?.hidden.has(value) || undefined}
        id={search?.mode === "trigger" ? search.optionId(value) : undefined}
        data-active={
          search?.mode === "trigger" && search.activeValue === value ? "" : undefined
        }
        // 활성 표시가 aria-activedescendant뿐이라 DOM 포커스는 입력에 붙들어 둔다.
        onMouseDown={
          search?.mode === "trigger" ? (event) => event.preventDefault() : undefined
        }
        {...{ [VALUE_ATTR]: value }}
        className={clsx("dds-select__option", className)}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          // 토글만 하고 닫지 않는다 — 연달아 여러 개를 고르는 것이 이 컴포넌트의 존재 이유다.
          context.toggleValue(value);
        }}
        {...props}
      >
        <svg
          className="dds-select__check"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="dds-select__option-label">{children}</span>
      </button>
    );
  },
);
MultiSelectOption.displayName = "MultiSelect.Option";
