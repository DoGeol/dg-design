import "../internal/overlay-motion.css";
import "./sheet.css";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { pushDialog } from "../internal/dialog-stack";
import { mergeRefs } from "../internal/merge-refs";
import { useControllableState } from "../internal/use-controllable-state";
import { usePresence } from "../internal/use-presence";
import { SheetContext, useSheetContext, type SheetContextValue, type SheetSide } from "./sheet-context";

const content = cva("dds-sheet__content", {
  variants: {
    side: {
      left: "dds-sheet--side_left",
      right: "dds-sheet--side_right",
      top: "dds-sheet--side_top",
      bottom: "dds-sheet--side_bottom",
    },
  },
});

export interface SheetRootProps {
  /** 슬라이드해 들어오는 방향. 기본 `"right"`. */
  side?: SheetSide;
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 열릴 때 포커스를 받을 요소. 없으면 Content가 받는다. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** ESC로 닫히는지. 중첩이면 최상단 하나에만 적용된다. */
  closeOnEscape?: boolean;
  /** Overlay 클릭으로 닫히는지. */
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}

/**
 * 상태·presence·스택·포커스는 Dialog.Root와 동일한 배선이다 — 차이는 `side` 하나뿐이라
 * 이 컴포넌트는 Dialog.Root를 거의 그대로 복제한다(공유 컨텍스트로 묶으면 Dialog 쪽이
 * Sheet 전용 개념인 side를 몰라도 되는 이점이 사라진다).
 */
function SheetRoot({
  side = "right",
  open,
  defaultOpen = false,
  onOpenChange,
  initialFocusRef,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}: SheetRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  const [registeredIds, setRegisteredIds] = React.useState<ReadonlySet<string>>(() => new Set());
  const register = React.useCallback((id: string) => {
    setRegisteredIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    return () => {
      setRegisteredIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };
  }, []);

  // portal 컨테이너를 시트마다 하나씩 만든다 — 스택의 inert 판정이 body 자식 단위라,
  // Overlay·Content를 body에 직접 꽂으면 자기 오버레이까지 inert 대상이 된다.
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

  const escapeRef = React.useRef<() => void>(() => {});
  escapeRef.current = () => {
    if (closeOnEscape) setOpen(false);
  };

  React.useEffect(() => {
    if (!isOpen || !container) return;
    return pushDialog({ container, onEscape: () => escapeRef.current(), modal: true });
  }, [isOpen, container]);

  // 열기 직전 포커스를 기억했다가 닫힐 때 되돌린다. 그 사이 대상이 사라졌으면 body로 폴백한다.
  const previousFocusRef = React.useRef<Element | null>(null);
  React.useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    return () => {
      const previous = previousFocusRef.current;
      const target =
        previous instanceof HTMLElement && previous.isConnected ? previous : document.body;
      target.focus();
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !container) return;
    (initialFocusRef?.current ?? contentRef.current)?.focus();
  }, [isOpen, container, initialFocusRef, contentRef]);

  const labelledBy = registeredIds.has(titleId) ? titleId : undefined;
  const describedBy = registeredIds.has(descriptionId) ? descriptionId : undefined;

  const value = React.useMemo<SheetContextValue>(
    () => ({
      open: isOpen,
      present,
      container,
      contentRef,
      side,
      titleId,
      descriptionId,
      labelledBy,
      describedBy,
      register,
      setOpen,
      closeOnOverlayClick,
    }),
    [
      isOpen,
      present,
      container,
      contentRef,
      side,
      titleId,
      descriptionId,
      labelledBy,
      describedBy,
      register,
      setOpen,
      closeOnOverlayClick,
    ],
  );

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}
SheetRoot.displayName = "Sheet.Root";

export interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다 (예: DDS Button을 트리거로). */
  asChild?: boolean;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const context = useSheetContext("Sheet.Trigger");
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        aria-haspopup="dialog"
        aria-expanded={context.open}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.setOpen(true);
        }}
        {...props}
      />
    );
  },
);
SheetTrigger.displayName = "Sheet.Trigger";

export interface SheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, onClick, ...props }, ref) => {
    const context = useSheetContext("Sheet.Overlay");
    if (!context.present || !context.container) return null;

    return createPortal(
      <div
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-sheet__overlay", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && context.closeOnOverlayClick) context.setOpen(false);
        }}
        {...props}
      />,
      context.container,
    );
  },
);
SheetOverlay.displayName = "Sheet.Overlay";

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, ...props }, ref) => {
    const context = useSheetContext("Sheet.Content");
    if (!context.present || !context.container) return null;

    return createPortal(
      <div
        ref={mergeRefs(ref, context.contentRef as React.RefObject<HTMLDivElement | null>)}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={context.labelledBy}
        aria-describedby={context.describedBy}
        data-state={context.open ? "open" : "closed"}
        data-side={context.side}
        className={clsx(content({ side: context.side }), className)}
        {...props}
      />,
      context.container,
    );
  },
);
SheetContent.displayName = "Sheet.Content";

export interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, id, ...props }, ref) => {
    const context = useSheetContext("Sheet.Title");
    const resolvedId = id ?? context.titleId;
    const register = context.register;

    React.useEffect(() => register(resolvedId), [register, resolvedId]);

    return (
      <h2 ref={ref} id={resolvedId} className={clsx("dds-sheet__title", className)} {...props} />
    );
  },
);
SheetTitle.displayName = "Sheet.Title";

export interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const context = useSheetContext("Sheet.Description");
    const resolvedId = id ?? context.descriptionId;
    const register = context.register;

    React.useEffect(() => register(resolvedId), [register, resolvedId]);

    return (
      <p
        ref={ref}
        id={resolvedId}
        className={clsx("dds-sheet__description", className)}
        {...props}
      />
    );
  },
);
SheetDescription.displayName = "Sheet.Description";

export interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const context = useSheetContext("Sheet.Close");
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.setOpen(false);
        }}
        {...props}
      />
    );
  },
);
SheetClose.displayName = "Sheet.Close";

/**
 * compound: Sheet.Root/Trigger/Overlay/Content/Title/Description/Close.
 * Dialog와 대칭 — 차이는 `side`에 따라 슬라이드하는 방향뿐이고 모달 스택·presence·
 * 포커스 정책은 전부 동일 로직을 그대로 가져다 쓴다.
 */
export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Overlay: SheetOverlay,
  Content: SheetContent,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
};
