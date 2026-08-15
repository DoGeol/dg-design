import type { Placement } from "@floating-ui/dom";
import * as React from "react";

import { pushDialog } from "../dialog/dialog-stack";
import { usePresence } from "../dialog/use-presence";
import { useControllableState } from "./use-controllable-state";
import { useOverlayPosition } from "./use-overlay-position";

/**
 * 열려 있는 팝오버는 하나뿐이다 — 다이얼로그와 달리 팝오버는 쌓이지 않는다.
 * 다른 팝오버가 열리면 여기 등록된 닫기를 먼저 호출한다. 메뉴와 셀렉트가 같은 자리를 쓴다.
 */
let openOverlay: (() => void) | null = null;

export interface UseOverlayOptions {
  open?: boolean;
  defaultOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  placement: Placement;
  /** 패널 min-width를 트리거 너비 이상으로 (Select). */
  matchTriggerWidth?: boolean;
  /** 패널이 마운트된 뒤 포커스를 어디로 넣을지 — 오버레이마다 다르다. */
  onOpenFocus: (content: HTMLElement) => void;
}

export interface Overlay {
  /** 논리 상태. 퇴장 애니메이션 중에는 false지만 아직 마운트돼 있다. */
  open: boolean;
  setOpen: (next: boolean) => void;
  /** 실제 마운트 여부(퇴장 애니메이션 포함). */
  present: boolean;
  /** body 직속 portal 컨테이너. 마운트 전에는 null. */
  container: HTMLElement | null;
  /** presence가 퇴장 완료를 기다릴 요소 — Content가 붙인다. */
  contentRef: React.RefObject<HTMLElement | null>;
  /** floating 기준 요소. 위치 계산 effect의 의존성이라 ref가 아니라 상태다. */
  triggerNode: HTMLElement | null;
  setTriggerNode: (node: HTMLElement | null) => void;
  setContentNode: (node: HTMLElement | null) => void;
}

/**
 * 팝오버 Root의 공통 배선: 열림 상태·presence·portal 컨테이너·floating 배치·
 * 단일 열림·비모달 스택 등록·바깥 클릭 닫힘·열림 포커스와 복귀.
 * DropdownMenu와 Select가 이 훅 하나를 공유하고 role과 초기 포커스만 달리 준다.
 */
export function useOverlay({
  open,
  defaultOpen,
  onOpenChange,
  placement,
  matchTriggerWidth,
  onOpenFocus,
}: UseOverlayOptions): Overlay {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

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

  useOverlayPosition(triggerNode, contentNode, isOpen, placement, matchTriggerWidth);

  const closeRef = React.useRef<() => void>(() => {});
  closeRef.current = () => setOpen(false);
  const close = React.useMemo(() => () => closeRef.current(), []);

  React.useEffect(() => {
    if (!isOpen) return;
    // 아직 우리를 등록하기 전이라 여기 남아 있는 것은 반드시 다른 팝오버다.
    openOverlay?.();
    openOverlay = close;
    return () => {
      if (openOverlay === close) openOverlay = null;
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

  const focusRef = React.useRef(onOpenFocus);
  focusRef.current = onOpenFocus;

  // 열리면 지정된 항목으로 들어가고, 닫힐 때 포커스가 아직 패널 안에 있으면 트리거로 돌려준다.
  // 바깥 클릭처럼 포커스가 이미 다른 곳으로 옮겨간 경우는 뺏지 않는다.
  React.useEffect(() => {
    if (!isOpen || !contentNode) return;
    focusRef.current(contentNode);
    return () => {
      if (contentNode.contains(document.activeElement)) triggerNode?.focus();
    };
  }, [isOpen, contentNode, triggerNode]);

  return React.useMemo(
    () => ({
      open: isOpen,
      setOpen,
      present,
      container,
      contentRef,
      triggerNode,
      setTriggerNode,
      setContentNode,
    }),
    [isOpen, setOpen, present, container, contentRef, triggerNode],
  );
}
