import * as React from "react";

import type { Overlay } from "../internal/use-overlay";

export interface PopoverContextValue extends Overlay {
  triggerId: string;
}

export const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined);

export function usePopoverContext(component: string): PopoverContextValue {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error(`${component}은 Popover.Root 안에서만 쓸 수 있다.`);
  return context;
}
