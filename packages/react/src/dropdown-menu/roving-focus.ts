/**
 * roving tabindex 이동. 항목 순서의 단일 소스는 DOM이라 등록 배열을 두지 않고
 * 매번 Content를 조회한다 — 조건부 렌더로 항목이 바뀌어도 따로 맞출 것이 없다.
 */

/** disabled 항목은 애초에 목록에서 빠지므로 이동이 자연스럽게 건너뛴다. */
const ITEM_SELECTOR = '[role="menuitem"]:not([disabled]):not([data-disabled])';

export function getMenuItems(content: HTMLElement | null | undefined): HTMLElement[] {
  if (!content) return [];
  return Array.from(content.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
}

export function focusMenuItem(items: HTMLElement[], index: number): void {
  const target = items[index];
  if (!target) return;
  for (const item of items) item.tabIndex = -1;
  target.tabIndex = 0;
  target.focus();
}

/** 화살표·Home·End를 처리하고, 소비한 키였으면 true. */
export function moveMenuFocus(content: HTMLElement | null | undefined, key: string): boolean {
  const items = getMenuItems(content);
  if (items.length === 0) return false;

  const current = items.indexOf(document.activeElement as HTMLElement);
  const last = items.length - 1;

  switch (key) {
    case "ArrowDown":
      focusMenuItem(items, current === last || current === -1 ? 0 : current + 1);
      return true;
    case "ArrowUp":
      focusMenuItem(items, current <= 0 ? last : current - 1);
      return true;
    case "Home":
      focusMenuItem(items, 0);
      return true;
    case "End":
      focusMenuItem(items, last);
      return true;
    default:
      return false;
  }
}
