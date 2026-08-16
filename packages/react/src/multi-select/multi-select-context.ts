import * as React from "react";

import type { OptionEntry, Typeahead } from "../internal/select-core";
import type { Overlay } from "../internal/use-overlay";

export interface MultiSelectContextValue extends Overlay {
  /** Field 안이면 Field의 inputId — Field.Label의 htmlFor가 트리거 버튼을 가리킨다. */
  triggerId: string;
  describedBy: string | undefined;
  invalid: boolean;
  value: readonly string[];
  /** 이미 있으면 빼고 없으면 뒤에 붙인다 — 패널은 그대로 열려 있다. */
  toggleValue: (next: string) => void;
  /** children 트리 스캔 + 마운트 등록을 합친 목록. 닫혀 있어도 유효하다. */
  options: OptionEntry[];
  registerOption: (entry: OptionEntry) => () => void;
  typeahead: Typeahead;
}

export const MultiSelectContext = React.createContext<MultiSelectContextValue | undefined>(
  undefined,
);

export function useMultiSelectContext(component: string): MultiSelectContextValue {
  const context = React.useContext(MultiSelectContext);
  if (!context) throw new Error(`${component}은 MultiSelect.Root 안에서만 쓸 수 있다.`);
  return context;
}
