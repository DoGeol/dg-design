import * as React from "react";

export interface UseTableOfContentsActiveIdOptions {
  /** 관찰할 문서 내 대상 요소 id 목록 */
  ids: readonly string[];
  /** 스크롤 컨테이너 요소. 생략하거나 null이면 viewport(window) 기준 */
  root?: HTMLElement | null;
  /** 기준선 오프셋(px). root 상단(또는 viewport 상단)으로부터의 거리 (기본 0) */
  offset?: number;
}

/**
 * 문서 내 제목 요소들의 스크롤 위치를 관찰해 현재 활성화된 id를 반환하는 선택형 훅.
 * SSR 및 첫 렌더에서는 null을 반환하며, 클라이언트 마운트 후 첫 계산을 수행합니다.
 */
export function useTableOfContentsActiveId(
  options: UseTableOfContentsActiveIdOptions,
): string | null {
  const { ids, root = null, offset = 0 } = options;
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // ids 내용 변경 여부를 감지하기 위한 키
  const idsKey = ids.join(",");

  React.useEffect(() => {
    if (ids.length === 0) {
      setActiveId(null);
      return;
    }

    let frameId: number | null = null;

    const calculate = () => {
      // DOM에 존재하는 유효한 요소만 추출 (문서 순서 유지)
      const validElements: { id: string; el: HTMLElement }[] = [];
      for (const id of ids) {
        if (!id) continue;
        const el = document.getElementById(id);
        if (el) {
          validElements.push({ id, el });
        }
      }

      if (validElements.length === 0) {
        setActiveId(null);
        return;
      }

      const baseline =
        root != null ? root.getBoundingClientRect().top + offset : offset;

      let lastPassedId: string | null = null;
      for (const item of validElements) {
        const top = item.el.getBoundingClientRect().top;
        if (top <= baseline) {
          lastPassedId = item.id;
        }
      }

      // 기준선을 지난 제목 중 마지막, 지난 것이 없으면 첫 유효 제목
      const firstValid = validElements[0];
      const nextActiveId = lastPassedId ?? (firstValid ? firstValid.id : null);
      setActiveId(nextActiveId);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        calculate();
      });
    };

    // 첫 마운트 또는 ids/root/offset 변경 시 즉시 첫 계산
    calculate();

    const scrollTarget = root ?? window;
    scrollTarget.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (root != null && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(root);
    }

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      scrollTarget.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver?.disconnect();
    };
  }, [idsKey, root, offset]);

  return activeId;
}
