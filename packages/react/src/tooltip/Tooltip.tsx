import "./tooltip.css";

import type { Placement } from "@floating-ui/dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { mergeRefs } from "../internal/merge-refs";
import { useControllableState } from "../internal/use-controllable-state";
import { usePresence } from "../internal/use-presence";
import { TooltipContext, useTooltipContext, type TooltipContextValue } from "./tooltip-context";
import {
  TooltipGroupContext,
  useTooltipGroup,
  type TooltipGroupContextValue,
} from "./tooltip-group-context";
import { useTooltipPosition } from "./use-tooltip-position";
import { useTooltipSchedule } from "./use-tooltip-schedule";

const DEFAULT_OPEN_DELAY = 700;
const DEFAULT_CLOSE_DELAY = 150;
const DEFAULT_SKIP_DELAY = 300;

export interface TooltipProviderProps {
  /** 마지막 툴팁이 닫힌 뒤 그룹 스킵(openDelay 생략)을 유지할 유예 시간(ms). */
  skipDelayDuration?: number;
  children?: React.ReactNode;
}

/**
 * 지연 그룹 스코프. 안에서 툴팁 하나가 열리면 다른 트리거로 이동할 때 openDelay를 생략한다.
 * Provider 없이 `Tooltip.Root`만 써도 에러 없이 단독 지연(항상 openDelay 적용)으로 동작한다.
 */
function TooltipProvider({ children, skipDelayDuration = DEFAULT_SKIP_DELAY }: TooltipProviderProps) {
  const skippedRef = React.useRef(false);
  const graceTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  // 열려 있는 툴팁 수. 떠나는 툴팁의 closeDelay가 뒤늦게 끝나도 다른 툴팁이 아직
  // 열려 있으면 유예를 시작하면 안 된다 — 그러면 열린 채로 스킵이 풀린다.
  const openCount = React.useRef(0);

  React.useEffect(() => () => clearTimeout(graceTimer.current), []);

  const value = React.useMemo<TooltipGroupContextValue>(
    () => ({
      isSkipped: () => skippedRef.current,
      onOpen: () => {
        clearTimeout(graceTimer.current);
        openCount.current += 1;
        skippedRef.current = true;
      },
      onClose: () => {
        openCount.current = Math.max(0, openCount.current - 1);
        if (openCount.current > 0) return;
        clearTimeout(graceTimer.current);
        graceTimer.current = setTimeout(() => {
          skippedRef.current = false;
        }, skipDelayDuration);
      },
    }),
    [skipDelayDuration],
  );

  return <TooltipGroupContext.Provider value={value}>{children}</TooltipGroupContext.Provider>;
}
TooltipProvider.displayName = "Tooltip.Provider";

export interface TooltipRootProps {
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** floating 배치. 공간이 부족하면 flip이 알아서 뒤집는다. */
  placement?: Placement;
  /** hover/focus 진입 후 열리기까지의 지연(ms). 그룹 스킵 시 무시된다. */
  openDelay?: number;
  /** 이탈 후 닫히기까지의 지연(ms). blur·ESC는 이 값 없이 즉시 닫힌다. */
  closeDelay?: number;
  children?: React.ReactNode;
}

function TooltipRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "top",
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  children,
}: TooltipRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

  const [triggerNode, setTriggerNode] = React.useState<HTMLElement | null>(null);
  const [contentNode, setContentNode] = React.useState<HTMLElement | null>(null);
  const [arrowNode, setArrowNode] = React.useState<HTMLElement | null>(null);

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

  useTooltipPosition(triggerNode, contentNode, arrowNode, isOpen, placement);

  const group = useTooltipGroup();
  const { scheduleOpen, scheduleClose, closeImmediate } = useTooltipSchedule(
    setOpen,
    openDelay,
    closeDelay,
    group,
  );

  // 다이얼로그 스택에 등록하지 않는다 — 툴팁은 ESC 라우팅 대상이 아니라 열려 있을 때만
  // 붙는 자체 리스너로 처리한다(스펙 명시).
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeImmediate();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeImmediate]);

  const triggerId = React.useId();
  const contentId = React.useId();

  const value = React.useMemo<TooltipContextValue>(
    () => ({
      open: isOpen,
      present,
      container,
      contentRef,
      triggerNode,
      setTriggerNode,
      setContentNode,
      setArrowNode,
      triggerId,
      contentId,
      placement,
      scheduleOpen,
      scheduleClose,
      closeImmediate,
    }),
    [
      isOpen,
      present,
      container,
      contentRef,
      triggerNode,
      triggerId,
      contentId,
      placement,
      scheduleOpen,
      scheduleClose,
      closeImmediate,
    ],
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}
TooltipRoot.displayName = "Tooltip.Root";

export interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다 (예: DDS Button을 트리거로). */
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const context = useTooltipContext("Tooltip.Trigger");
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
        // 열려 있을 때만 연결한다(Radix 관례) — 닫힌 트리거가 존재하지 않는 콘텐츠를 참조하지 않도록.
        aria-describedby={context.open ? context.contentId : undefined}
        onMouseEnter={(event: React.MouseEvent<HTMLButtonElement>) => {
          onMouseEnter?.(event);
          if (!event.defaultPrevented) context.scheduleOpen();
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLButtonElement>) => {
          onMouseLeave?.(event);
          if (!event.defaultPrevented) context.scheduleClose();
        }}
        // focus-visible이 아니라 :focus 기반 — 탭 포커스도 연다(스펙이 의도적으로 선택).
        onFocus={(event: React.FocusEvent<HTMLButtonElement>) => {
          onFocus?.(event);
          if (!event.defaultPrevented) context.scheduleOpen();
        }}
        onBlur={(event: React.FocusEvent<HTMLButtonElement>) => {
          onBlur?.(event);
          if (!event.defaultPrevented) context.closeImmediate();
        }}
        {...props}
      />
    );
  },
);
TooltipTrigger.displayName = "Tooltip.Trigger";

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** 안에 포커스 가능한 요소를 넣지 않는다 — 비인터랙티브 전제다. 상호작용 콘텐츠는 Popover를 쓴다. */
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = useTooltipContext("Tooltip.Content");
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
        role="tooltip"
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-tooltip__content", className)}
        {...props}
      >
        {children}
        <div ref={context.setArrowNode} className="dds-tooltip__arrow" />
      </div>,
      context.container,
    );
  },
);
TooltipContent.displayName = "Tooltip.Content";

/**
 * compound: Tooltip.Provider(지연 그룹)/Root/Trigger(asChild)/Content(+arrow).
 * hover(mouseenter/leave)와 focus(:focus)로 열리고, blur·ESC는 즉시·mouseleave는
 * closeDelay 뒤 닫힌다. 위치는 floating-ui, 클릭 중심인 `internal/use-overlay`와는
 * 배선이 달라 이 폴더 안에서 자체 훅으로 뒀다.
 */
export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
