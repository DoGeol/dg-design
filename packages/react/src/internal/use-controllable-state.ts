import * as React from "react";

/**
 * controlled(`value` + `onChange`) / uncontrolled(`defaultValue`) 겸용 상태.
 *
 * 기본은 `value !== undefined`로 모드를 가른다 — 마운트 중 모드가 바뀌면 React의
 * controlled 경고처럼 조용히 uncontrolled로 되돌아간다(별도 방어 없음).
 */
export function useControllableState<T>({
  value,
  controlled = value !== undefined,
  defaultValue,
  onChange,
}: {
  value?: T;
  /**
   * controlled 판정을 직접 넘긴다. `undefined`가 곧 "선택 없음"인 값 타입
   * (Select·RadioGroup의 `string | undefined`)은 prop 존재 여부(`"value" in props`)를
   * 넘겨야 앱이 선택을 지웠을 때 uncontrolled로 되돌아가 stale 값을 보이지 않는다.
   */
  controlled?: boolean;
  defaultValue: T;
  onChange?: (next: T) => void;
}): [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const setState = React.useCallback(
    (next: T) => {
      if (!controlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );

  // controlled면 value가 곧 상태다 — T가 undefined를 포함할 수 있어 캐스트가 필요하다.
  return [controlled ? (value as T) : uncontrolled, setState];
}
