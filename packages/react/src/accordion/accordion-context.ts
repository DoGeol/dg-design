import * as React from "react";

export type AccordionVariant = "inline" | "separated";
export type AccordionSize = "medium" | "large";

export interface AccordionRootContextValue {
  values: string[];
  multiple: boolean;
  disabled: boolean;
  variant: AccordionVariant;
  size: AccordionSize;
  rootRef: React.RefObject<HTMLDivElement | null>;
  toggle: (value: string) => void;
  registerItem: (value: string) => () => void;
}

export interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

export const AccordionRootContext = React.createContext<AccordionRootContextValue | undefined>(
  undefined,
);
export const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(
  undefined,
);

export function useAccordionRootContext(component: string): AccordionRootContextValue {
  const context = React.useContext(AccordionRootContext);
  if (!context) throw new Error(`${component}은 Accordion.Root 안에서만 쓸 수 있다.`);
  return context;
}

export function useAccordionItemContext(component: string): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error(`${component}은 Accordion.Item 안에서만 쓸 수 있다.`);
  return context;
}
