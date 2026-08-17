import "./progress.css";

import clsx from "clsx";
import * as React from "react";

export interface ProgressProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "role" | "aria-valuemin" | "aria-valuemax" | "aria-valuenow"
  > {
  /** 0~max 범위로 clamp된다. indeterminate면 무시. */
  value?: number;
  max?: number;
  /** 진행률을 알 수 없을 때. true면 value를 무시하고 aria-valuenow를 비운다. */
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indeterminate = false, ...props }, ref) => {
    // 범위 밖 값(음수·max 초과)을 방어적으로 clamp — 소비자가 잘못된 값을 넘겨도
    // aria-valuenow가 표준을 벗어나지 않는다.
    const clamped = Math.min(Math.max(value, 0), max);
    const percent = max > 0 ? (clamped / max) * 100 : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : clamped}
        data-indeterminate={indeterminate ? "" : undefined}
        className={clsx("dds-progress", className)}
        {...props}
      >
        <div
          className="dds-progress__indicator"
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    );
  },
);
Progress.displayName = "Progress";
