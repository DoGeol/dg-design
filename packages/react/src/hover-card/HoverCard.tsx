import "../internal/overlay-motion.css";
import "./hover-card.css";

import type { Placement } from "@floating-ui/dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";

import { pushDialog } from "../internal/dialog-stack";
import { mergeRefs } from "../internal/merge-refs";
import { useControllableState } from "../internal/use-controllable-state";
import { useOverlayPosition } from "../internal/use-overlay-position";
import { usePresence } from "../internal/use-presence";
import {
  HoverCardContext,
  useHoverCardContext,
  type HoverCardContextValue,
} from "./hover-card-context";
import { useHoverCardSchedule } from "./use-hover-card-schedule";

const DEFAULT_OPEN_DELAY = 700;
const DEFAULT_CLOSE_DELAY = 300;

export interface HoverCardRootProps {
  /** controlled 모드. 넘기면 `onOpenChange`로만 상태가 바뀐다. */
  open?: boolean;
  /** uncontrolled 모드의 초기값. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** floating 배치. 공간이 부족하면 flip이 알아서 뒤집는다. */
  placement?: Placement;
  /** hover 진입 후 열리기까지의 지연(ms). Tooltip(700)과 같되, 콘텐츠까지 포인터가 이동할
   *  시간을 감안해 closeDelay를 더 길게 잡는다. */
  openDelay?: number;
  /** 이탈 후 닫히기까지의 지연(ms) — 이 안에 트리거→콘텐츠로 포인터가 들어오면 닫힘이 취소된다. */
  closeDelay?: number;
  children?: React.ReactNode;
}

function HoverCardRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  children,
}: HoverCardRootProps) {
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

  // internal/use-overlay-position은 클릭 중심 useOverlay 밖에서도 그대로 쓸 수 있는 일반
  // floating 배치+arrow 훅이라(수정 없이) 그대로 재사용한다 — position만 필요하고 클릭
  // 토글·바깥 클릭 닫힘 같은 useOverlay의 나머지는 hover 시맨틱과 안 맞아 가져오지 않는다.
  useOverlayPosition(triggerNode, contentNode, isOpen, placement, false, arrowNode);

  const { scheduleOpen, scheduleClose, cancelClose, closeImmediate } = useHoverCardSchedule(
    setOpen,
    openDelay,
    closeDelay,
  );

  // 인터랙티브 콘텐츠라 Tooltip의 자체 리스너 대신 Popover처럼 비모달 스택에 올려 ESC 순서에
  // 낀다(스펙 위임 — 인터랙티브 콘텐츠 쪽을 선택) — 배경 inert도 스크롤 잠금도 만들지 않는다.
  React.useEffect(() => {
    if (!isOpen || !container) return;
    return pushDialog({ container, onEscape: closeImmediate, modal: false });
  }, [isOpen, container, closeImmediate]);

  const triggerId = React.useId();
  const contentId = React.useId();

  const value = React.useMemo<HoverCardContextValue>(
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
      scheduleOpen,
      scheduleClose,
      cancelClose,
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
      scheduleOpen,
      scheduleClose,
      cancelClose,
      closeImmediate,
    ],
  );

  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>;
}
HoverCardRoot.displayName = "HoverCard.Root";

export interface HoverCardTriggerProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 자식 요소에 동작만 얹는다 (예: 이미 렌더된 링크·아바타). */
  asChild?: boolean;
}

/**
 * hover 전용 트리거 — mouseenter/leave로만 열고 닫는다. **포커스로 열리지 않고 터치를
 * 지원하지 않는다**(Radix HoverCard 관례: 시각·마우스 사용자 전용 보조 UI). 콘텐츠가 가리키는
 * 정보(링크 미리보기 등)는 트리거 자체가 이미 다른 경로(예: 실제 링크 이동)로 도달 가능해야
 * 한다 — HoverCard는 그 경로에 곁들이는 프리뷰일 뿐, 유일한 경로가 되면 안 된다.
 */
const HoverCardTrigger = React.forwardRef<HTMLAnchorElement, HoverCardTriggerProps>(
  ({ asChild, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const context = useHoverCardContext("HoverCard.Trigger");
    const setRef = React.useMemo(
      () => mergeRefs(ref, context.setTriggerNode as React.Ref<HTMLAnchorElement>),
      [ref, context.setTriggerNode],
    );
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={setRef}
        id={context.triggerId}
        onMouseEnter={(event: React.MouseEvent<HTMLAnchorElement>) => {
          onMouseEnter?.(event);
          if (!event.defaultPrevented) context.scheduleOpen();
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLAnchorElement>) => {
          onMouseLeave?.(event);
          if (!event.defaultPrevented) context.scheduleClose();
        }}
        {...props}
      />
    );
  },
);
HoverCardTrigger.displayName = "HoverCard.Trigger";

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 포인터가 트리거→콘텐츠로 넘어오면(closeDelay 안에 진입) mouseenter가 대기 중인 닫힘을
 * 취소해 열림을 유지한다 — 이게 Tooltip과 정확히 갈라지는 지점(콘텐츠가 인터랙티브해도 된다).
 * autoFocus 없음 — 포커스를 옮기지 않는다(hover 시맨틱을 지키기 위해 의도적으로 뺐다).
 */
const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, onMouseEnter, onMouseLeave, children, ...props }, ref) => {
    const context = useHoverCardContext("HoverCard.Content");
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
        data-state={context.open ? "open" : "closed"}
        className={clsx("dds-hover-card__content", className)}
        onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
          onMouseEnter?.(event);
          if (!event.defaultPrevented) context.cancelClose();
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLDivElement>) => {
          onMouseLeave?.(event);
          if (!event.defaultPrevented) context.scheduleClose();
        }}
        {...props}
      >
        {children}
        <div ref={context.setArrowNode} className="dds-hover-card__arrow" aria-hidden="true" />
      </div>,
      context.container,
    );
  },
);
HoverCardContent.displayName = "HoverCard.Content";

/**
 * compound: HoverCard.Root/Trigger(asChild)/Content(+arrow, 자동 포함 — Popover처럼 별도
 * Arrow 서브컴포넌트 없음). Provider 그룹·Close 버튼 없음(수요 없음, YAGNI). 패널 외관은
 * popover.css 재사용, 위치 계산은 internal/use-overlay-position 재사용, 지연 스케줄은
 * tooltip/use-tooltip-schedule을 이 폴더로 복제·개조했다 — 세 재사용 경계 모두 스펙이 구현
 * 판단으로 위임한 것.
 */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
};
