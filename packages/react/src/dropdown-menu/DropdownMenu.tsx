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
  DropdownMenuContext,
  useDropdownMenuContext,
  type DropdownMenuContextValue,
} from "./dropdown-menu-context";

/** 항목의 role — roving 조회와 aria가 같은 값을 쓴다. */
const ITEM_ROLE = "menuitem";

export interface DropdownMenuRootProps {
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** floating 배치. 공간이 부족하면 flip이 알아서 뒤집는다. */
  placement?: Placement;
  children?: React.ReactNode;
}

function DropdownMenuRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  children,
}: DropdownMenuRootProps) {
  // 초기 포커스는 Content가 아니라 첫 활성 항목 — APG menu button 표준.
  // 단 ArrowUp으로 열었을 때는 마지막 항목이다(같은 표준).
  const openToLastRef = React.useRef(false);
  const focusInitialItem = React.useCallback((content: HTMLElement) => {
    const items = getItems(content, ITEM_ROLE);
    focusItem(items, openToLastRef.current ? items.length - 1 : 0);
    openToLastRef.current = false;
  }, []);

  const overlay = useOverlay({
    open,
    defaultOpen,
    onOpenChange,
    placement,
    onOpenFocus: focusInitialItem,
  });
  const triggerId = React.useId();

  const value = React.useMemo<DropdownMenuContextValue>(
    () => ({ ...overlay, triggerId, placement, openToLastRef }),
    [overlay, triggerId, placement],
  );

  return <DropdownMenuContext.Provider value={value}>{children}</DropdownMenuContext.Provider>;
}
DropdownMenuRoot.displayName = "DropdownMenu.Root";

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다 (예: DDS Button을 트리거로). */
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
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

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
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
        role="menu"
        aria-labelledby={context.triggerId}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-dropdown-menu__content", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (moveFocus(context.contentRef.current, ITEM_ROLE, event.key)) event.preventDefault();
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
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, onSelect, onClick, ...props }, ref) => {
    const context = useDropdownMenuContext("DropdownMenu.Item");
    return (
      <button
        ref={ref}
        type="button"
        role={ITEM_ROLE}
        tabIndex={-1}
        className={clsx("dds-dropdown-menu__item", className)}
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

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
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

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("dds-dropdown-menu__label", className)} {...props} />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenu.Label";

/**
 * compound: DropdownMenu.Root/Trigger/Content/Item/Separator/Label.
 * 로직(상태·presence·비모달 스택·roving·floating 배치)은 Select와 공유하는
 * `internal/use-overlay`·`internal/roving-focus`에 있고 여기는 조립과 스타일만 맡는다.
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
};
