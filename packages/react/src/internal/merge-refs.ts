import * as React from "react";

/** forwardRef의 외부 ref와 컴포넌트 내부 ref(예: indeterminate effect용)를 하나로 합친다. */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.RefObject<T | null>).current = node;
    }
  };
}
