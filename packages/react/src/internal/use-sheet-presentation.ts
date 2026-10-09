import * as React from "react";

/** 선택 목록을 띄우는 방식. auto는 앱이 루트에 정한 밀도를 따른다(모바일이면 Sheet). */
export type Presentation = "popover" | "sheet" | "auto";

/** 루트 `data-dds-density`가 mobile인지 — 앱이 바꾸면 따라간다. SSR·첫 렌더는 popover. */
function useMobileDensity(enabled: boolean): boolean {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const read = () => setMobile(root.dataset.ddsDensity === "mobile");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-dds-density"] });
    return () => observer.disconnect();
  }, [enabled]);
  return enabled && mobile;
}

export function useSheetPresentation(presentation: Presentation): boolean {
  const mobile = useMobileDensity(presentation === "auto");
  return presentation === "sheet" || mobile;
}
