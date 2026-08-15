import "./dropdown-menu.css";

import type { Placement } from "@floating-ui/dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { pushDialog } from "../dialog/dialog-stack";
import { usePresence } from "../dialog/use-presence";
import { mergeRefs } from "../internal/merge-refs";
import { useControllableState } from "../internal/use-controllable-state";
import {
  DropdownMenuContext,
  useDropdownMenuContext,
  type DropdownMenuContextValue,
} from "./dropdown-menu-context";
import { focusMenuItem, getMenuItems, moveMenuFocus } from "./roving-focus";
import { useMenuPosition } from "./use-menu-position";

/**
 * 열려 있는 메뉴는 하나뿐이다 — 다이얼로그와 달리 메뉴는 쌓이지 않는다.
 * 다른 메뉴가 열리면 여기 등록된 닫기를 먼저 호출한다.
 */
let openMenu: (() => void) | null = null;

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
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

  const triggerId = React.useId();
  const [triggerNode, setTriggerNode] = React.useState<HTMLElement | null>(null);
  const [contentNode, setContentNode] = React.useState<HTMLElement | null>(null);

  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    if (!present) return;
    const element = document.createElement("div");
    document.body.appendChild(element);
    setContainer(element);
    return () => {
      element.remove();
      setContainer(null);
    };
  }, [present]);

  useMenuPosition(triggerNode, contentNode, isOpen, placement);

  const closeRef = React.useRef<() => void>(() => {});
  closeRef.current = () => setOpen(false);
  const close = React.useMemo(() => () => closeRef.current(), []);

  React.useEffect(() => {
    if (!isOpen) return;
    // 아직 우리를 등록하기 전이라 여기 남아 있는 것은 반드시 다른 메뉴다.
    openMenu?.();
    openMenu = close;
    return () => {
      if (openMenu === close) openMenu = null;
    };
  }, [isOpen, close]);

  // 비모달로 스택에 올라 ESC 순서에만 참여한다 — 배경 inert도, 스크롤 잠금도 만들지 않는다.
  React.useEffect(() => {
    if (!isOpen || !container) return;
    return pushDialog({ container, onEscape: close, modal: false });
  }, [isOpen, container, close]);

  // 바깥 클릭 닫힘. mousedown 단계에서 판정하되 트리거는 제외한다 — 트리거에서 닫으면
  // 이어지는 click이 다시 열어 토글이 먹통이 된다. 트리거 재클릭은 Trigger의 토글이 처리한다.
  React.useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (contentRef.current?.contains(target)) return;
      if (triggerNode?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen, triggerNode, contentRef, close]);

  // 열리면 첫 항목으로 들어가고, 닫힐 때 포커스가 아직 메뉴 안에 있으면 트리거로 돌려준다.
  // 바깥 클릭처럼 포커스가 이미 다른 곳으로 옮겨간 경우는 뺏지 않는다.
  React.useEffect(() => {
    if (!isOpen || !contentNode) return;
    focusMenuItem(getMenuItems(contentNode), 0);
    return () => {
      if (contentNode.contains(document.activeElement)) triggerNode?.focus();
    };
  }, [isOpen, contentNode, triggerNode]);

  const value = React.useMemo<DropdownMenuContextValue>(
    () => ({
      open: isOpen,
      present,
      container,
      contentRef,
      triggerNode,
      setTriggerNode,
      setContentNode,
      triggerId,
      placement,
      setOpen,
    }),
    [
      isOpen,
      present,
      container,
      contentRef,
      triggerNode,
      setTriggerNode,
      setContentNode,
      triggerId,
      placement,
      setOpen,
    ],
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
          if (moveMenuFocus(context.contentRef.current, event.key)) event.preventDefault();
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
        role="menuitem"
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
 * 로직(상태·presence·비모달 스택·roving·floating 배치)은 같은 폴더의 훅 파일에 있고
 * 여기는 조립과 스타일만 맡는다.
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
};
