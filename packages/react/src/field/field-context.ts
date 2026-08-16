import * as React from "react";

export interface FieldContextValue {
  /** Field.Label의 htmlFor, TextField의 id 기본값 */
  inputId: string;
  /**
   * Field.Label이 자기 <label>에 붙이는 고정 id.
   * `<label for>`는 labelable 요소에만 걸리므로, RadioGroup처럼 컨트롤이 div인 경우
   * 이 id를 `aria-labelledby`로 참조해야 접근 이름이 생긴다.
   */
  labelId: string;
  /** Field.Description이 자기 <p>에 붙이는 고정 id */
  descriptionId: string;
  /** Field.ErrorMessage가 자기 <p>에 붙이는 고정 id */
  errorId: string;
  /** 실제로 마운트된 Description·ErrorMessage id만 공백으로 조인한 값 */
  describedBy: string | undefined;
  /** ErrorMessage가 마운트돼 있으면 true — 별도 상태가 아니라 registeredIds에서 파생 */
  invalid: boolean;
  /** id를 등록하고, 언마운트 시 호출할 해제 함수를 돌려준다 */
  register: (id: string) => () => void;
}

export const FieldContext = React.createContext<FieldContextValue | undefined>(undefined);
