import * as React from "react";

export interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  name: string;
  orientation: "vertical" | "horizontal";
  disabled: boolean;
  variant?: "default" | "segmented";
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(
  undefined,
);
