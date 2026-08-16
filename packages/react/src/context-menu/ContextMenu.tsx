import "../dropdown-menu/dropdown-menu.css";

import type { VirtualElement } from "@floating-ui/dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { pushDialog } from "../internal/dialog-stack";
import { mergeRefs } from "../internal/merge-refs";
import { focusItem, getItems, moveFocus } from "../internal/roving-focus";
import { useControllableState } from "../internal/use-controllable-state";
import { useOverlayPosition } from "../internal/use-overlay-position";
import { usePresence } from "../internal/use-presence";
import {
  ContextMenuContext,
  useContextMenuContext,
  type ContextMenuContextValue,
} from "./context-menu-context";

/** 항목의 role — roving 조회와 aria가 같은 값을 쓴다. DropdownMenu와 동일. */
const ITEM_ROLE = "menuitem";

/**
 * 트리거가 실제 DOM 요소가 아니라 우클릭 지점이라 `useOverlay`(클릭 토글·트리거 기준
 * 배치 전제)를 못 쓴다 — HoverCard가 hover 시맨틱 때문에 primitive를 직접 조립한 것과
 * 같은 이유로, 여기서도 `use-overlay-position`·`use-presence`·`dialog-stack`·
 * `use-controllable-state`를 직접 배선한다.
 */
export interface ContextMenuRootProps {
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function ContextMenuRoot({ open, defaultOpen = false, onOpenChange, children }: ContextMenuRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

  const [triggerNode, setTriggerNode] = React.useState<HTMLElement | null>(null);
  const [contentNode, setContentNode] = React.useState<HTMLElement | null>(null);
  const [virtualRef, setVirtualRef] = React.useState<VirtualElement | null>(null);

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

  // 커서 좌표 기준 배치. bottom-start 계열 고정(스펙) — flip·shift는 훅 내부 미들웨어가 처리.
  useOverlayPosition(virtualRef, contentNode, isOpen, "bottom-start");

  const openAt = React.useCallback(
    (virtualElement: VirtualElement) => {
      setVirtualRef(virtualElement);
      setOpen(true);
    },
    [setOpen],
  );

  // 열리면 첫 항목으로 포커스, 닫히면(포커스가 아직 패널 안이면) 트리거로 돌려준다.
  // DropdownMenu의 onOpenFocus와 같은 idiom.
  React.useEffect(() => {
    if (!isOpen || !contentNode) return;
    focusItem(getItems(contentNode, ITEM_ROLE), 0);
    return () => {
      if (contentNode.contains(document.activeElement)) triggerNode?.focus();
    };
  }, [isOpen, contentNode, triggerNode]);

  // 비모달 스택 등록 — ESC 라우팅만, 배경 inert·스크롤 잠금 없음(DropdownMenu와 동일).
  React.useEffect(() => {
    if (!isOpen || !container) return;
    return pushDialog({ container, onEscape: () => setOpen(false), modal: false });
  }, [isOpen, container, setOpen]);

  // 바깥 클릭 닫힘. 트리거를 다시 우클릭하면 mousedown이 먼저 여기로 잡혀 닫고,
  // 뒤이은 contextmenu가 새 좌표로 다시 연다 — 스펙이 명시적으로 허용한 "닫고 다시 열기".
  React.useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (contentRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen, contentRef, setOpen]);

  const value = React.useMemo<ContextMenuContextValue>(
    () => ({
      open: isOpen,
      present,
      container,
      contentRef,
      triggerNode,
      setTriggerNode,
      setContentNode,
      setOpen,
      openAt,
    }),
    [isOpen, present, container, contentRef, triggerNode, setOpen, openAt],
  );

  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>;
}
ContextMenuRoot.displayName = "ContextMenu.Root";

export interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 자식 요소에 동작만 얹는다 (예: 이미 렌더된 카드·리스트 행). */
  asChild?: boolean;
}

/**
 * **마우스 전용**: `contextmenu` 이벤트(우클릭)로만 연다. Shift+F10·메뉴키·터치 long-press는
 * 구현하지 않는다 — HoverCard와 같은 논리로 이건 보조 경로이고, 메뉴가 제공하는 동작은
 * 화면의 다른 UI(버튼·툴바 등)로도 도달 가능해야 한다는 전제 위에 있다.
 */
const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ asChild, onContextMenu, ...props }, ref) => {
    const context = useContextMenuContext("ContextMenu.Trigger");
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLDivElement>),
      [ref, context.setTriggerNode],
    );
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={setRef}
        onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => {
          onContextMenu?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          const x = event.clientX;
          const y = event.clientY;
          context.openAt({
            getBoundingClientRect: () =>
              ({
                x,
                y,
                width: 0,
                height: 0,
                top: y,
                left: x,
                right: x,
                bottom: y,
              }) as DOMRect,
          });
        }}
        {...props}
      />
    );
  },
);
ContextMenuTrigger.displayName = "ContextMenu.Trigger";

export interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const context = useContextMenuContext("ContextMenu.Content");
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
        data-state={context.open ? "open" : "closed"}
        // 패널·항목 CSS는 DropdownMenu 계열 재사용 — 신규 클래스·토큰 없음.
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
ContextMenuContent.displayName = "ContextMenu.Content";

export interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 선택됐을 때 호출된다. 호출 뒤 메뉴는 항상 닫힌다. */
  onSelect?: () => void;
}

const ContextMenuItem = React.forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  ({ className, onSelect, onClick, ...props }, ref) => {
    const context = useContextMenuContext("ContextMenu.Item");
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
ContextMenuItem.displayName = "ContextMenu.Item";

export interface ContextMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={clsx("dds-dropdown-menu__separator", className)}
      {...props}
    />
  ),
);
ContextMenuSeparator.displayName = "ContextMenu.Separator";

export interface ContextMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuLabel = React.forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("dds-dropdown-menu__label", className)} {...props} />
  ),
);
ContextMenuLabel.displayName = "ContextMenu.Label";

/**
 * compound: ContextMenu.Root/Trigger(asChild)/Content/Item/Separator/Label — DropdownMenu 대칭.
 * 여는 경로만 마우스 우클릭 전용이고, 연 뒤 키보드(roving 화살표·Enter·ESC)는 DropdownMenu와
 * 동일한 `internal/roving-focus`·`internal/dialog-stack`을 그대로 쓴다. 패널·항목 CSS도
 * dropdown-menu.css를 그대로 재사용해 신규 토큰이 없다.
 */
export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
  Label: ContextMenuLabel,
};
