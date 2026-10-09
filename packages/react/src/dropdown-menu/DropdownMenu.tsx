import "../internal/overlay-motion.css";
import "./dropdown-menu.css";

import type { Placement } from "@floating-ui/dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { mergeRefs } from "../internal/merge-refs";
import { focusItem, getItems, moveFocus } from "../internal/roving-focus";
import { useOverlay } from "../internal/use-overlay";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  MENU_ITEM_ROLES,
} from "./menu-choice-items";
import {
  DropdownMenuContext,
  useDropdownMenuContext,
  type DropdownMenuContextValue,
} from "./dropdown-menu-context";

/** 일반 항목의 role. roving 조회는 체크·라디오 항목까지 `MENU_ITEM_ROLES`로 훑는다. */
const ITEM_ROLE = "menuitem";

export interface DropdownMenuRootProps {
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** floating 배치. 공간이 부족하면 flip이 알아서 뒤집는다. */
  placement?: Placement;
  /** ESC로 닫히는지. */
  closeOnEscape?: boolean;
  /** 바깥 클릭으로 닫히는지. */
  closeOnOutsideClick?: boolean;
  children?: React.ReactNode;
}

export function DropdownMenuRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  closeOnEscape = true,
  closeOnOutsideClick = true,
  children,
}: DropdownMenuRootProps) {
  // 초기 포커스는 Content가 아니라 첫 활성 항목 — APG menu button 표준.
  // 단 ArrowUp으로 열었을 때는 마지막 항목이다(같은 표준).
  const openToLastRef = React.useRef(false);
  const focusInitialItem = React.useCallback((content: HTMLElement) => {
    const items = getItems(content, MENU_ITEM_ROLES);
    focusItem(items, openToLastRef.current ? items.length - 1 : 0);
    openToLastRef.current = false;
  }, []);

  const overlay = useOverlay({
    open,
    defaultOpen,
    onOpenChange,
    placement,
    closeOnEscape,
    closeOnOutsideClick,
    onOpenFocus: focusInitialItem,
  });
  const triggerId = React.useId();
  const contentId = `${triggerId}-content`;

  const value = React.useMemo<DropdownMenuContextValue>(
    () => ({ ...overlay, triggerId, contentId, placement, openToLastRef }),
    [overlay, triggerId, contentId, placement],
  );

  return <DropdownMenuContext.Provider value={value}>{children}</DropdownMenuContext.Provider>;
}
DropdownMenuRoot.displayName = "DropdownMenu.Root";

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다 (예: DDS Button을 트리거로). */
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild, onClick, onKeyDown, ...props }, ref) => {
    const context = useDropdownMenuContext("DropdownMenu.Trigger");
    // 매 렌더 새 콜백 ref를 넘기면 React가 null→node로 다시 호출해 상태가 왕복한다.
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLButtonElement>),
      [ref, context.setTriggerNode],
    );
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={setRef}
        id={context.triggerId}
        type={asChild ? undefined : "button"}
        aria-haspopup="menu"
        aria-controls={context.open ? context.contentId : undefined}
        aria-expanded={context.open}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.setOpen(!context.open);
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            // APG menu button: ArrowDown은 첫 항목, ArrowUp은 마지막 항목으로 연다.
            context.openToLastRef.current = event.key === "ArrowUp";
            context.setOpen(true);
          }
        }}
        {...props}
      />
    );
  },
);
DropdownMenuTrigger.displayName = "DropdownMenu.Trigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const context = useDropdownMenuContext("DropdownMenu.Content");
    const setRef = React.useMemo(
      () =>
        mergeRefs(
          ref,
          context.contentRef as React.RefObject<HTMLDivElement | null>,
          context.setContentNode as React.Ref<HTMLDivElement>,
        ),
      [ref, context.contentRef, context.setContentNode],
    );
    if (!context.present || !context.container) return null;

    return createPortal(
      <div
        ref={setRef}
        id={context.contentId}
        role="menu"
        aria-labelledby={context.triggerId}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-dropdown-menu__content", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (moveFocus(context.contentRef.current, MENU_ITEM_ROLES, event.key)) event.preventDefault();
        }}
        {...props}
      />,
      context.container,
    );
  },
);
DropdownMenuContent.displayName = "DropdownMenu.Content";

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 선택됐을 때 호출된다. 호출 뒤 메뉴는 항상 닫힌다. */
  onSelect?: () => void;
  /** critical은 삭제 같은 파괴적 동작 — 글자·하이라이트가 critical 색을 쓴다. */
  intent?: "neutral" | "critical";
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, intent = "neutral", onSelect, onClick, ...props }, ref) => {
    const context = useDropdownMenuContext("DropdownMenu.Item");
    return (
      <button
        ref={ref}
        type="button"
        role={ITEM_ROLE}
        tabIndex={-1}
        className={clsx(
          "dds-dropdown-menu__item",
          intent === "critical" && "dds-dropdown-menu__item--intent_critical",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          onSelect?.();
          context.setOpen(false);
        }}
        {...props}
      />
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenu.Item";

export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={clsx("dds-dropdown-menu__separator", className)}
      {...props}
    />
  ),
);
DropdownMenuSeparator.displayName = "DropdownMenu.Separator";

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("dds-dropdown-menu__label", className)} {...props} />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenu.Label";

export interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={clsx("dds-dropdown-menu__shortcut", className)} {...props} />
  ),
);
DropdownMenuShortcut.displayName = "DropdownMenu.Shortcut";

export { DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem };
export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
} from "./menu-choice-items";

/**
 * compound: DropdownMenu.Root/Trigger/Content/Item/CheckboxItem/RadioGroup/RadioItem/Separator/Label/Shortcut.
 * 로직(상태·presence·비모달 스택·roving·floating 배치)은 Select와 공유하는
 * `internal/use-overlay`·`internal/roving-focus`에 있고 여기는 조립과 스타일만 맡는다.
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
  Shortcut: DropdownMenuShortcut,
};
