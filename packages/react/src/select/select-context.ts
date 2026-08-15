import * as React from "react";

import type { Overlay } from "../internal/use-overlay";
import type { OptionEntry } from "./select-options";
import type { Typeahead } from "./use-typeahead";

export interface SelectContextValue extends Overlay {
  /** Field 안이면 Field의 inputId — Field.Label의 htmlFor가 트리거 버튼을 가리킨다. */
  triggerId: string;
  describedBy: string | undefined;
  invalid: boolean;
  value: string | undefined;
  setValue: (next: string) => void;
  /** children 트리 스캔 + 마운트 등록의 병합 목록. 닫혀 있어도 유효하다. */
  options: OptionEntry[];
  /** Option이 마운트 시 자기 라벨을 등록한다 — 사용자 컴포넌트로 감싸 스캔에 안 잡혀도 트리거 라벨이 맞도록. */
  registerOption: (entry: OptionEntry) => () => void;
  typeahead: Typeahead;
}

export const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

export function useSelectContext(component: string): SelectContextValue {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error(`${component}은 Select.Root 안에서만 쓸 수 있다.`);
  return context;
}

/** Group이 만든 라벨 id — Label이 자기 id로 받아 aria-labelledby를 완성한다. */
export const SelectGroupContext = React.createContext<string | undefined>(undefined);
