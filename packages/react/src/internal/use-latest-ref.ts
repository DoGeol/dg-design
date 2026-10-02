import * as React from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** 이벤트·observer 콜백에서 마지막으로 커밋된 값을 읽는다. */
export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useIsomorphicLayoutEffect(() => { ref.current = value; }, [value]);
  return ref;
}
