import type { Placement } from "@floating-ui/dom";
import * as React from "react";

import { pushDialog } from "./dialog-stack";
import { useControllableState } from "./use-controllable-state";
import { useOverlayPosition } from "./use-overlay-position";
import { usePresence } from "./use-presence";

interface OpenOverlay {
  close: () => void;
  /** 조상 판정 대상. 포털 이후에도 살아 있는 ref로 읽는다 — 값 복사는 리렌더에서 상한다. */
  content: React.RefObject<HTMLElement | null>;
}

/**
 * 열려 있는 오버레이 스택 — 형제끼리는 하나만 열리지만(메뉴·셀렉트가 같은 자리를 쓴다)
 * 중첩은 쌓인다. 새로 열리는 오버레이의 트리거를 품은 항목이 나올 때까지만 위에서부터 닫는다:
 * 그보다 위는 형제이고, 그 항목부터 아래는 조상이라 살려 둔다.
 * (다이얼로그 스택과 별개다 — 저쪽은 ESC 라우팅·inert 담당이고 여기는 단일 열림 담당이다.)
 */
const openOverlays: OpenOverlay[] = [];

function closeSiblingsOf(trigger: HTMLElement | null) {
  for (let i = openOverlays.length - 1; i >= 0; i -= 1) {
    const entry = openOverlays[i];
    if (!entry) continue;
    if (trigger && entry.content.current?.contains(trigger)) return;
    // close()가 부르는 상대 effect의 cleanup은 다음 커밋에나 돈다 — 여기서 먼저 빼야 순회가 정확하다.
    openOverlays.splice(i, 1);
    entry.close();
  }
}

/**
 * 우리 위에 쌓인 항목은 전부 자손이다 — 형제는 열릴 때 우리를 닫고 들어오니 위에 남을 수 없다.
 * 자손 패널은 각자 body 직속 portal이라 DOM상 우리 content 바깥이다: 이 확인이 없으면
 * 자손 안을 클릭할 때마다 조상이 "바깥 클릭"으로 판정해 스스로 닫는다.
 */
function isInsideDescendant(entry: OpenOverlay, target: Node): boolean {
  const index = openOverlays.indexOf(entry);
  if (index === -1) return false;
  return openOverlays.slice(index + 1).some((above) => above.content.current?.contains(target));
}

export interface UseOverlayOptions {
  open?: boolean;
  defaultOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  placement: Placement;
  /** 패널 min-width를 트리거 너비 이상으로 (Select). */
  matchTriggerWidth?: boolean;
  /** 패널이 마운트된 뒤 포커스를 어디로 넣을지 — 오버레이마다 다르다. */
  onOpenFocus: (content: HTMLElement) => void;
  /** ESC로 닫히는지. 기본 true — DropdownMenu·Select는 넘기지 않아 기존 동작 그대로다. */
  closeOnEscape?: boolean;
  /** 바깥 클릭으로 닫히는지. 기본 true. */
  closeOnOutsideClick?: boolean;
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
  /** arrow 미들웨어가 위치를 계산할 대상(Popover). 등록 안 하면 arrow 계산은 그냥 스킵된다. */
  setArrowNode: (node: HTMLElement | null) => void;
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
  closeOnEscape = true,
  closeOnOutsideClick = true,
}: UseOverlayOptions): Overlay {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { present, ref: contentRef } = usePresence(isOpen);

  const [triggerNode, setTriggerNodeState] = React.useState<HTMLElement | null>(null);
  // 조상 판정은 트리거를 열림 effect와 같은 커밋에 읽어야 한다 — state 반영은 한 렌더 늦어,
  // 이미 열린 오버레이 안에서 defaultOpen으로 마운트되는 중첩이 조상을 놓친다.
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const setTriggerNode = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
    setTriggerNodeState(node);
  }, []);
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

  useOverlayPosition(triggerNode, contentNode, isOpen, placement, matchTriggerWidth, arrowNode);

  const closeRef = React.useRef<() => void>(() => {});
  closeRef.current = () => setOpen(false);
  const close = React.useMemo(() => () => closeRef.current(), []);

  const entry = React.useMemo<OpenOverlay>(
    () => ({ close, content: contentRef }),
    [close, contentRef],
  );

  React.useEffect(() => {
    if (!isOpen) return;
    closeSiblingsOf(triggerRef.current);
    openOverlays.push(entry);
    return () => {
      const index = openOverlays.indexOf(entry);
      if (index !== -1) openOverlays.splice(index, 1);
    };
  }, [isOpen, entry]);

  // 비모달로 스택에 올라 ESC 순서에만 참여한다 — 배경 inert도, 스크롤 잠금도 만들지 않는다.
  // closeOnEscape가 false면 최상단 자리는 그대로 차지하되 아무 것도 하지 않는다(Dialog와 같은 관례) —
  // 그 아래 오버레이로 ESC가 흘러 내려가지는 않는다.
  React.useEffect(() => {
    if (!isOpen || !container) return;
    return pushDialog({
      container,
      onEscape: () => {
        if (closeOnEscape) close();
      },
      modal: false,
    });
  }, [isOpen, container, close, closeOnEscape]);

  // 바깥 클릭 닫힘. mousedown 단계에서 판정하되 트리거는 제외한다 — 트리거에서 닫으면
  // 이어지는 click이 다시 열어 토글이 먹통이 된다. 트리거 재클릭은 Trigger의 토글이 처리한다.
  React.useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (contentRef.current?.contains(target)) return;
      if (triggerNode?.contains(target)) return;
      if (isInsideDescendant(entry, target)) return;
      close();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen, closeOnOutsideClick, triggerNode, contentRef, close, entry]);

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
      setArrowNode,
    }),
    [isOpen, setOpen, present, container, contentRef, triggerNode],
  );
}
