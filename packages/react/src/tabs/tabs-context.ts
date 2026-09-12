import * as React from "react";

export interface TabsContextValue {
  /** 선택된 탭 값. 어느 Trigger와도 안 맞으면 선택 없음이다. */
  value: string | undefined;
  setValue: (next: string) => void;
  /** Trigger·Content id의 공통 접두사 — SSR 안정성을 위해 useId에서 온다. */
  baseId: string;
  responsive?: number;
  isWide?: boolean;
  /**
   * 포인터로 누른 선택인지. automatic 활성화는 focus에서 일어나 click보다 이르기 때문에
   * pointerdown에서 기록하고, click·pointercancel·keydown에서 내린다.
   */
  pointerIntentRef?: React.MutableRefObject<boolean>;
  /** 활성 밑줄 배선 — Root가 만들고 List가 붙인다. */
  indicator?: {
    listRef: React.RefObject<HTMLDivElement | null>;
    elementRef: React.RefObject<HTMLElement | null>;
    registerTrigger: (value: string, node: HTMLElement | null) => void;
    /** 자리를 잡았는지. 그전에는 Trigger 자신의 border-bottom이 fallback이다. */
    active: boolean;
  };
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error(`${component}은 Tabs.Root 안에서만 쓸 수 있다.`);
  return context;
}

export const triggerId = (baseId: string, value: string) => `${baseId}-trigger-${value}`;
export const contentId = (baseId: string, value: string) => `${baseId}-content-${value}`;
