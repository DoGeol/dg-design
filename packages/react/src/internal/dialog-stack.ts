/**
 * 열린 오버레이의 모듈 레벨 싱글턴 스택.
 *
 * 여기서만 하는 일: ESC를 최상단 하나로 라우팅, 스크롤 잠금 refcount,
 * 배경(= body 자식 중 최상단 모달의 컨테이너가 아닌 것 전부) inert 부여·복원.
 * 중첩 시 "스택상 이전 다이얼로그"도 body 자식이라 같은 규칙에 자동으로 걸린다.
 *
 * ESC 라우팅은 모달·비모달이 함께 쓰지만, inert와 스크롤 잠금은 모달 엔트리만 만든다 —
 * DropdownMenu 같은 비모달은 배경을 죽이지 않고 ESC 순서에만 끼어든다.
 *
 * 예외로 `registerNotificationLayer`로 등록한 컨테이너는 스택과 무관하게 inert에서 빠진다.
 */

export interface DialogStackEntry {
  /** 이 오버레이의 portal 컨테이너. body 직속 자식이어야 한다. */
  container: HTMLElement;
  /** 이 오버레이가 최상단일 때 ESC가 호출한다. 무시하고 싶으면 아무것도 하지 않으면 된다. */
  onEscape: () => void;
  /** 배경 inert·스크롤 잠금을 만드는지. 비모달은 ESC 라우팅에만 참여한다. */
  modal: boolean;
}

const stack: DialogStackEntry[] = [];
/** 우리가 부여한 inert만 기억한다 — 원래 inert였던 요소는 건드리지도, 복원하지도 않는다. */
const inerted = new Set<HTMLElement>();
/**
 * inert에서 항상 빠지는 알림 레이어(Toast viewport). 모달 안 작업의 결과를 알리는
 * 흐름 때문에 모달이 열려도 조작·낭독이 가능해야 한다.
 *
 * 명시 등록분만 면제한다 — 조건을 조금이라도 넓히면(예: 특정 클래스·속성 기준)
 * 소비 앱의 아무 요소나 모달 격리를 빠져나갈 수 있다.
 */
const notificationLayers = new Set<HTMLElement>();
let restoreOverflow: string | null = null;
let restorePaddingRight: string | null = null;

/** 테스트·디버깅용 읽기 전용 뷰. */
export function getDialogStack(): readonly DialogStackEntry[] {
  return stack;
}

function modalCount(): number {
  return stack.reduce((count, entry) => count + (entry.modal ? 1 : 0), 0);
}

export function pushDialog(entry: DialogStackEntry): () => void {
  stack.push(entry);
  if (stack.length === 1) document.addEventListener("keydown", onKeyDown);
  if (entry.modal && modalCount() === 1) {
    restoreOverflow = document.body.style.overflow;
    restorePaddingRight = document.body.style.paddingRight;
    // 잠금으로 스크롤바가 사라지면 그 폭만큼 페이지가 좌우로 덜컹인다 — 폭을 보정한다.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const current = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${current + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
  }
  syncInert();

  let popped = false;
  return () => {
    if (popped) return;
    popped = true;

    const index = stack.indexOf(entry);
    if (index !== -1) stack.splice(index, 1);

    if (stack.length === 0) document.removeEventListener("keydown", onKeyDown);
    if (entry.modal && modalCount() === 0) {
      document.body.style.overflow = restoreOverflow ?? "";
      document.body.style.paddingRight = restorePaddingRight ?? "";
      restoreOverflow = null;
      restorePaddingRight = null;
    }
    syncInert();
  };
}

/**
 * `container`를 알림 레이어로 등록한다(body 직속 자식). 반환값으로 해제한다.
 * 스택 엔트리가 아니므로 ESC 라우팅·스크롤 잠금에는 관여하지 않는다.
 */
export function registerNotificationLayer(container: HTMLElement): () => void {
  notificationLayers.add(container);
  // 이미 열려 있던 모달이 걸어둔 inert를 즉시 걷어낸다.
  syncInert();

  let unregistered = false;
  return () => {
    if (unregistered) return;
    unregistered = true;
    notificationLayers.delete(container);
    syncInert();
  };
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  stack[stack.length - 1]?.onEscape();
}

function syncInert() {
  for (const element of inerted) element.removeAttribute("inert");
  inerted.clear();

  let topModal = -1;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    if (stack[i]?.modal) {
      topModal = i;
      break;
    }
  }
  if (topModal === -1) return;

  // 최상단 모달 위에 쌓인 비모달(모달 안에서 연 메뉴)도 면제한다 — 그것까지 inert면
  // 다이얼로그 안 메뉴가 열리자마자 조작 불가가 된다.
  const exempt = new Set(stack.slice(topModal).map((entry) => entry.container));
  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (exempt.has(child) || notificationLayers.has(child)) continue;
    if (child.hasAttribute("inert")) continue;
    child.setAttribute("inert", "");
    inerted.add(child);
  }
}
