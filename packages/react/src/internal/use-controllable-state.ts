import * as React from "react";

/**
 * controlled(`value` + `onChange`) / uncontrolled(`defaultValue`) 겸용 상태.
 *
 * `value`가 `undefined`인지로 모드를 가른다 — 마운트 중 모드가 바뀌면 React의
 * controlled 경고처럼 조용히 uncontrolled로 되돌아간다(별도 방어 없음).
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}): [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const controlled = value !== undefined;
  const setState = React.useCallback(
    (next: T) => {
      if (!controlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );

  return [value !== undefined ? value : uncontrolled, setState];
}
