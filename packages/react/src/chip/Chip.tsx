import "./chip.css";
import clsx from "clsx";
import * as React from "react";

import { useControllableState } from "../internal/use-controllable-state";

type ChipRemoveProps =
  | { onRemove?: undefined; removeLabel?: undefined }
  /** removeLabel은 제거 버튼의 접근 이름이다("김도걸 제거"). */
  | { onRemove: () => void; removeLabel: string };

export type ChipProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  ChipRemoveProps & {
    leading?: React.ReactNode;
    disabled?: boolean;
    children: React.ReactNode;
  };

// 제거된 칩은 언마운트되며 초점을 body로 떨어뜨린다 — 그래서 onRemove 전에 옮긴다.
function focusSiblingRemove(button: HTMLButtonElement) {
  const chip = button.closest(".dds-chip");
  const parent = chip?.parentElement;
  if (!parent) return;
  const buttons = Array.from(
    parent.querySelectorAll<HTMLButtonElement>(":scope > .dds-chip > .dds-chip__remove:not(:disabled)"),
  );
  const index = buttons.indexOf(button);
  (buttons[index + 1] ?? buttons[index - 1])?.focus();
}

/**
 * 사용자가 고른 값. 읽기 전용 상태는 Badge다.
 * 칩 자체는 초점을 받지 않고 제거 버튼만 받는다. 제거하면 같은 부모의 다음(없으면 이전) 칩 제거 버튼으로
 * 초점이 간다 — 둘 다 없으면 소비자가 옮긴다.
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ leading, onRemove, removeLabel, disabled, className, children, ...props }, ref) => (
    <span ref={ref} className={clsx("dds-chip", className)} data-disabled={disabled ? "" : undefined} {...props}>
      {leading && <span className="dds-chip__leading">{leading}</span>}
      <span className="dds-chip__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="dds-chip__remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={(event) => {
            focusSiblingRemove(event.currentTarget);
            onRemove();
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  ),
);
Chip.displayName = "Chip";

export interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

/** 켜고 끄는 필터. 켜짐은 색과 체크 아이콘으로 함께 보인다. 제거 버튼을 품지 않는다(button 안 button 금지). */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ pressed, defaultPressed = false, onPressedChange, onClick, className, children, ...props }, ref) => {
    const [on, setOn] = useControllableState({ value: pressed, defaultValue: defaultPressed, onChange: onPressedChange });
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={on}
        className={clsx("dds-chip", "dds-chip--filter", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOn(!on);
        }}
        {...props}
      >
        {on && (
          <svg className="dds-chip__check" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);
FilterChip.displayName = "FilterChip";
