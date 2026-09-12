import * as React from "react";

export interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  name: string;
  orientation: "vertical" | "horizontal";
  disabled: boolean;
  variant?: "default" | "segmented";
  /** segmented에서만 채워진다 — 선택 배경이 따라갈 항목 요소를 값으로 등록한다. */
  registerItem?: (value: string, node: HTMLElement | null) => void;
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(
  undefined,
);
