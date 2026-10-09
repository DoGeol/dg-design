import "./filter-toolbox.css";
import clsx from "clsx";
import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

/** 묶음 이름은 필수다 — 칩만 늘어선 group은 무엇을 거르는지 읽히지 않는다. */
export type FilterToolboxRootProps = Omit<DivProps, "role" | "aria-label" | "aria-labelledby"> &
  ({ "aria-label": string; "aria-labelledby"?: undefined } | { "aria-labelledby": string; "aria-label"?: undefined });

/**
 * 필터 도구 묶음의 껍데기 — 적용 조건(칩)·결과 수·초기화를 한 줄에 둔다.
 * 문구와 초기화 행동은 앱 소유다. 고정 필터는 값만 바꾸는 칩(Select variant="chip"),
 * 추가한 필터만 제거 버튼이 있는 Chip을 쓴다.
 */
export const FilterToolboxRoot = React.forwardRef<HTMLDivElement, FilterToolboxRootProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={clsx("dds-filter-toolbox", className)} {...props} />
  ),
);
FilterToolboxRoot.displayName = "FilterToolbox.Root";

export const FilterToolboxChips = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("dds-filter-toolbox__chips", className)} {...props} />
));
FilterToolboxChips.displayName = "FilterToolbox.Chips";

/** 결과 수. 바뀔 때 읽히도록 status다. */
export const FilterToolboxCount = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} role="status" className={clsx("dds-filter-toolbox__count", className)} {...props} />
  ),
);
FilterToolboxCount.displayName = "FilterToolbox.Count";

export const FilterToolboxActions = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("dds-filter-toolbox__actions", className)} {...props} />
));
FilterToolboxActions.displayName = "FilterToolbox.Actions";

export const FilterToolbox = {
  Root: FilterToolboxRoot,
  Chips: FilterToolboxChips,
  Count: FilterToolboxCount,
  Actions: FilterToolboxActions,
};
