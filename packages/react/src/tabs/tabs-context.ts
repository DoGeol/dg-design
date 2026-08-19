import * as React from "react";

export interface TabsContextValue {
  /** 선택된 탭 값. 어느 Trigger와도 안 맞으면 선택 없음이다. */
  value: string | undefined;
  setValue: (next: string) => void;
  /** Trigger·Content id의 공통 접두사 — SSR 안정성을 위해 useId에서 온다. */
  baseId: string;
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error(`${component}은 Tabs.Root 안에서만 쓸 수 있다.`);
  return context;
}

export const triggerId = (baseId: string, value: string) => `${baseId}-trigger-${value}`;
export const contentId = (baseId: string, value: string) => `${baseId}-content-${value}`;
