import "../sheet/sheet.css";
import clsx from "clsx";
import * as React from "react";

/**
 * Select·MultiSelect 목록을 하단 Sheet로 띄우는 껍데기. 상태·포커스·닫힘은 그대로 useOverlay가 맡고
 * (modal로 등록해 배경 inert·스크롤 잠금), 여기는 Sheet 외관과 dialog 의미만 입힌다.
 * Overlay 클릭은 패널 바깥 mousedown이라 useOverlay의 바깥 클릭 닫힘이 처리한다.
 */
export const SelectSheet = React.forwardRef<
  HTMLDivElement,
  { open: boolean; title?: React.ReactNode; labelledBy: string; children: React.ReactNode }
>(({ open, title, labelledBy, children }, ref) => {
  const titleId = React.useId();
  const state = open ? "open" : "closed";
  return (
    <>
      <div className="dds-sheet__overlay" data-state={state} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : labelledBy}
        tabIndex={-1}
        data-state={state}
        data-side="bottom"
        className={clsx("dds-sheet__content", "dds-sheet--side_bottom", "dds-sheet--size_fit", "dds-select__sheet")}
      >
        {title ? (
          <h2 id={titleId} className="dds-sheet__title">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </>
  );
});
SelectSheet.displayName = "SelectSheet";
