import "./dialog.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { useControllableState } from "../internal/use-controllable-state";
import { mergeRefs } from "../internal/merge-refs";
import { DialogContext, useDialogContext, type DialogContextValue } from "./dialog-context";
import { pushDialog } from "./dialog-stack";
import { usePresence } from "./use-presence";

export interface DialogRootProps {
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

function DialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  initialFocusRef,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}: DialogRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  // Field.Root와 같은 방식: 실제 마운트된 id만 담아 aria 연결을 렌더분으로 한정한다.
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

  // portal 컨테이너를 다이얼로그마다 하나씩 만든다 — 스택의 inert 판정이 body 자식 단위라,
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
    return pushDialog({ container, onEscape: () => escapeRef.current() });
  }, [isOpen, container]);

  // 열기 직전 포커스를 기억했다가 닫힐 때 되돌린다. 그 사이 대상이 사라졌으면(리스트에서
  // 열고 항목 삭제) body로 폴백한다.
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

  const value = React.useMemo<DialogContextValue>(
    () => ({
      open: isOpen,
      present,
      container,
      contentRef,
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
      titleId,
      descriptionId,
      labelledBy,
      describedBy,
      register,
      setOpen,
      closeOnOverlayClick,
    ],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}
DialogRoot.displayName = "Dialog.Root";

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다 (예: DDS Button을 트리거로). */
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const context = useDialogContext("Dialog.Trigger");
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
DialogTrigger.displayName = "Dialog.Trigger";

export interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onClick, ...props }, ref) => {
    const context = useDialogContext("Dialog.Overlay");
    if (!context.present || !context.container) return null;

    return createPortal(
      <div
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-dialog__overlay", className)}
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
DialogOverlay.displayName = "Dialog.Overlay";

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => {
    const context = useDialogContext("Dialog.Content");
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
        className={clsx("dds-dialog__content", className)}
        {...props}
      />,
      context.container,
    );
  },
);
DialogContent.displayName = "Dialog.Content";

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, id, ...props }, ref) => {
    const context = useDialogContext("Dialog.Title");
    const resolvedId = id ?? context.titleId;
    const register = context.register;

    React.useEffect(() => register(resolvedId), [register, resolvedId]);

    return (
      <h2 ref={ref} id={resolvedId} className={clsx("dds-dialog__title", className)} {...props} />
    );
  },
);
DialogTitle.displayName = "Dialog.Title";

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const context = useDialogContext("Dialog.Description");
    const resolvedId = id ?? context.descriptionId;
    const register = context.register;

    React.useEffect(() => register(resolvedId), [register, resolvedId]);

    return (
      <p
        ref={ref}
        id={resolvedId}
        className={clsx("dds-dialog__description", className)}
        {...props}
      />
    );
  },
);
DialogDescription.displayName = "Dialog.Description";

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const context = useDialogContext("Dialog.Close");
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
DialogClose.displayName = "Dialog.Close";

/**
 * compound: Dialog.Root/Trigger/Overlay/Content/Title/Description/Close.
 * 로직(상태·presence·스택·inert)은 같은 폴더의 훅 파일에 있고 여기는 조립과 스타일만 맡는다.
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
