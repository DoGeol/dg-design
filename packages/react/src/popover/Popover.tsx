import "./popover.css";

import type { Placement } from "@floating-ui/dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { mergeRefs } from "../internal/merge-refs";
import { useOverlay } from "../internal/use-overlay";
import { PopoverContext, usePopoverContext, type PopoverContextValue } from "./popover-context";

export interface PopoverRootProps {
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** floating 배치. 공간이 부족하면 flip이 알아서 뒤집는다. */
  placement?: Placement;
  /**
   * 열릴 때 Content(tabIndex=-1)로 포커스를 옮기고 닫힐 때 트리거로 복귀할지 — Dialog 관례.
   * false면 포커스를 아예 건드리지 않는다(예: 입력 중이던 필드 옆에 뜨는 참조용 팝오버).
   */
  autoFocus?: boolean;
  /** ESC로 닫히는지. */
  closeOnEscape?: boolean;
  /** 바깥 클릭으로 닫히는지. */
  closeOnOutsideClick?: boolean;
  children?: React.ReactNode;
}

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  autoFocus = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  children,
}: PopoverRootProps) {
  const focusContent = React.useCallback(
    (content: HTMLElement) => {
      if (autoFocus) content.focus();
    },
    [autoFocus],
  );

  const overlay = useOverlay({
    open,
    defaultOpen,
    onOpenChange,
    placement,
    onOpenFocus: focusContent,
    closeOnEscape,
    closeOnOutsideClick,
  });
  const triggerId = React.useId();

  const value = React.useMemo<PopoverContextValue>(
    () => ({ ...overlay, triggerId }),
    [overlay, triggerId],
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}
PopoverRoot.displayName = "Popover.Root";

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다 (예: DDS Button을 트리거로). */
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const context = usePopoverContext("Popover.Trigger");
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
        aria-expanded={context.open}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.setOpen(!context.open);
        }}
        {...props}
      />
    );
  },
);
PopoverTrigger.displayName = "Popover.Trigger";

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, ...props }, ref) => {
    const context = usePopoverContext("Popover.Content");
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
        role="group"
        tabIndex={-1}
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-popover__content", className)}
        {...props}
      />,
      context.container,
    );
  },
);
PopoverContent.displayName = "Popover.Content";

export interface PopoverArrowProps extends React.HTMLAttributes<HTMLDivElement> {}

const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ className, ...props }, ref) => {
    const context = usePopoverContext("Popover.Arrow");
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setArrowNode as React.Ref<HTMLDivElement>),
      [ref, context.setArrowNode],
    );
    return (
      <div
        ref={setRef}
        aria-hidden="true"
        className={clsx("dds-popover__arrow", className)}
        {...props}
      />
    );
  },
);
PopoverArrow.displayName = "Popover.Arrow";

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const context = usePopoverContext("Popover.Close");
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
PopoverClose.displayName = "Popover.Close";

/**
 * compound: Popover.Root/Trigger/Content/Arrow/Close.
 * 로직(상태·presence·비모달 스택·floating 배치·단일 열림)은 DropdownMenu·Select와 공유하는
 * `internal/use-overlay`에 있고 여기는 조립과 스타일만 맡는다. Content의 role은 기본 "group" —
 * dialog는 쓰지 않는다(모달 아님, 별도 초점 관리 없음). 소비자가 props로 덮어쓸 수 있다.
 */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
};
