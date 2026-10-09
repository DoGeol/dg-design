import { Button } from "@dg-design/react";
import * as React from "react";

import { CloseIcon } from "../../c-overlay/icons";

/**
 * Chip 프로토타입 — packages/react에 없다(MultiSelect의 비공개 chip만 있다).
 * 상태 Badge와 달리 사용자가 고른 값을 나타낸다. 칩 자체는 초점을 받지 않고, 제거 버튼만 받는다.
 */
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  leading?: React.ReactNode;
  /** 주면 제거 버튼이 붙는다. removeLabel이 접근 이름이다("김도걸 제거"). */
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

export function Chip({ leading, onRemove, removeLabel, disabled, children, className, ...props }: ChipProps) {
  return (
    <span className={className ? `fx-chip ${className}` : "fx-chip"} data-disabled={disabled ? "" : undefined} {...props}>
      {leading && <span className="fx-chip__leading">{leading}</span>}
      <span className="fx-chip__label">{children}</span>
      {onRemove && (
        <button type="button" className="fx-chip__remove" aria-label={removeLabel} disabled={disabled} onClick={onRemove}>
          <CloseIcon size={14} />
        </button>
      )}
    </span>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 켜고 끄는 필터 칩. 제거 버튼을 품지 않는다(button 안 button 금지). */
export const FilterChip = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean }>(
  ({ pressed, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      className={className ? `fx-chip fx-chip--filter ${className}` : "fx-chip fx-chip--filter"}
      {...props}
    >
      {pressed && <Check />}
      {children}
    </button>
  ),
);
FilterChip.displayName = "FilterChip";

export interface FilterToolboxProps {
  /** 묶음의 접근 이름("글 필터"). */
  label: string;
  /** 결과 수 문구. role="status"로 바뀔 때 읽힌다. */
  count: React.ReactNode;
  onReset?: () => void;
  /** 기본값과 같으면 초기화를 끈다. */
  resetDisabled?: boolean;
  children: React.ReactNode;
}

/**
 * 필터 도구 묶음 — 적용 조건(칩)·결과 수·초기화를 한 줄에 둔다.
 * 고정 필터는 제거 버튼 없이 값만 바꾸고, 추가한 필터만 제거 버튼을 단다.
 */
export function FilterToolbox({ label, count, onReset, resetDisabled, children }: FilterToolboxProps) {
  return (
    <div role="group" aria-label={label} className="fx-filter">
      <div className="fx-filter__chips">{children}</div>
      <div className="fx-filter__tail">
        <span className="fx-filter__count" role="status">{count}</span>
        {onReset && (
          <Button size="small" intent="neutral" variant="ghost" disabled={resetDisabled} onClick={onReset}>
            초기화
          </Button>
        )}
      </div>
    </div>
  );
}
