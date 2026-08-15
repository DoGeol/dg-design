import * as React from "react";

/** 마지막 입력 뒤 이만큼 지나면 버퍼를 비운다 — 네이티브 select와 같은 관례. */
const RESET_MS = 1000;

export interface Typeahead {
  /** 문자 하나를 밀어 넣고 누적 버퍼를 돌려준다. */
  push: (char: string) => string;
  /** 이어 치는 중인지 — Space를 열기로 볼지 문자로 볼지 가른다. */
  hasBuffer: () => boolean;
}

export function useTypeahead(): Typeahead {
  const buffer = React.useRef("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return React.useMemo(
    () => ({
      push(char) {
        clearTimeout(timer.current);
        buffer.current += char;
        timer.current = setTimeout(() => {
          buffer.current = "";
        }, RESET_MS);
        return buffer.current;
      },
      hasBuffer: () => buffer.current !== "",
    }),
    [],
  );
}
