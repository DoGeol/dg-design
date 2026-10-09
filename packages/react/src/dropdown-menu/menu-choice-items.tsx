import clsx from "clsx";
import * as React from "react";

import { useControllableState } from "../internal/use-controllable-state";

/**
 * 메뉴의 체크·라디오 항목. 설정을 여러 개 이어서 바꾸는 흐름이라 골라도 메뉴를 닫지 않는다 —
 * 그래서 메뉴 context가 필요 없고, DropdownMenu와 ContextMenu가 같은 컴포넌트를 쓴다.
 * roving 이동은 각 메뉴의 `MENU_ITEM_ROLES`가 이 role들을 함께 훑는다.
 */
export const MENU_ITEM_ROLES = ["menuitem", "menuitemcheckbox", "menuitemradio"] as const;

function Indicator({ kind }: { kind: "check" | "radio" }) {
  return (
    <svg className="dds-dropdown-menu__indicator" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {kind === "check" ? (
        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <circle cx="8" cy="8" r="3" fill="currentColor" />
      )}
    </svg>
  );
}

type ItemButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "role">;

export interface DropdownMenuCheckboxItemProps extends Omit<ItemButtonProps, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const DropdownMenuCheckboxItem = React.forwardRef<HTMLButtonElement, DropdownMenuCheckboxItemProps>(
  ({ className, checked, defaultChecked = false, onCheckedChange, onClick, children, ...props }, ref) => {
    const [on, setOn] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
    return (
      <button
        ref={ref}
        type="button"
        role="menuitemcheckbox"
        aria-checked={on}
        tabIndex={-1}
        className={clsx("dds-dropdown-menu__item", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOn(!on);
        }}
        {...props}
      >
        <Indicator kind="check" />
        {children}
      </button>
    );
  },
);
DropdownMenuCheckboxItem.displayName = "DropdownMenu.CheckboxItem";

const RadioGroupContext = React.createContext<{ value: string | undefined; setValue: (v: string) => void } | null>(
  null,
);

export interface DropdownMenuRadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  ({ value, defaultValue, onValueChange, ...props }, ref) => {
    const [current, setValue] = useControllableState<string | undefined>({
      value,
      defaultValue,
      onChange: onValueChange as ((v: string | undefined) => void) | undefined,
    });
    const context = React.useMemo(() => ({ value: current, setValue }), [current, setValue]);
    return (
      <RadioGroupContext.Provider value={context}>
        <div ref={ref} role="group" {...props} />
      </RadioGroupContext.Provider>
    );
  },
);
DropdownMenuRadioGroup.displayName = "DropdownMenu.RadioGroup";

export interface DropdownMenuRadioItemProps extends ItemButtonProps {
  value: string;
}

export const DropdownMenuRadioItem = React.forwardRef<HTMLButtonElement, DropdownMenuRadioItemProps>(
  ({ className, value, onClick, children, ...props }, ref) => {
    const group = React.useContext(RadioGroupContext);
    if (!group) throw new Error("DropdownMenu.RadioItem은 DropdownMenu.RadioGroup 안에 둔다");
    return (
      <button
        ref={ref}
        type="button"
        role="menuitemradio"
        aria-checked={group.value === value}
        tabIndex={-1}
        className={clsx("dds-dropdown-menu__item", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) group.setValue(value);
        }}
        {...props}
      >
        <Indicator kind="radio" />
        {children}
      </button>
    );
  },
);
DropdownMenuRadioItem.displayName = "DropdownMenu.RadioItem";
