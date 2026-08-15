/**
 * 열린 다이얼로그의 모듈 레벨 싱글턴 스택.
 *
 * 여기서만 하는 일: ESC를 최상단 하나로 라우팅, 스크롤 잠금 refcount,
 * 배경(= body 자식 중 최상단 다이얼로그의 컨테이너가 아닌 것 전부) inert 부여·복원.
 * 중첩 시 "스택상 이전 다이얼로그"도 body 자식이라 같은 규칙에 자동으로 걸린다.
 */

export interface DialogStackEntry {
  /** 이 다이얼로그의 portal 컨테이너. body 직속 자식이어야 한다. */
  container: HTMLElement;
  /** 이 다이얼로그가 최상단일 때 ESC가 호출한다. 무시하고 싶으면 아무것도 하지 않으면 된다. */
  onEscape: () => void;
}

const stack: DialogStackEntry[] = [];
/** 우리가 부여한 inert만 기억한다 — 원래 inert였던 요소는 건드리지도, 복원하지도 않는다. */
const inerted = new Set<HTMLElement>();
let restoreOverflow: string | null = null;

/** 테스트·디버깅용 읽기 전용 뷰. */
export function getDialogStack(): readonly DialogStackEntry[] {
  return stack;
}

export function pushDialog(entry: DialogStackEntry): () => void {
  stack.push(entry);
  if (stack.length === 1) {
    restoreOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
  }
  syncInert();

  let popped = false;
  return () => {
    if (popped) return;
    popped = true;

    const index = stack.indexOf(entry);
    if (index !== -1) stack.splice(index, 1);

    if (stack.length === 0) {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = restoreOverflow ?? "";
      restoreOverflow = null;
    }
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

  const top = stack[stack.length - 1];
  if (!top) return;

  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (child === top.container || child.hasAttribute("inert")) continue;
    child.setAttribute("inert", "");
    inerted.add(child);
  }
}
