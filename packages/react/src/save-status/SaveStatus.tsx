import "./save-status.css";

import clsx from "clsx";
import * as React from "react";

import { Spinner } from "../spinner/Spinner";

export type SaveStatusValue = "saved" | "dirty" | "saving" | "error";

// live region 정책(alert/Alert.tsx와 동일): error만 암묵적 assertive(role="alert"),
// 나머지는 암묵적 polite(role="status"). aria-live는 따로 얹지 않는다.
const SAVE_STATUS_ROLE: Record<SaveStatusValue, "alert" | "status"> = {
  saved: "status",
  dirty: "status",
  saving: "status",
  error: "alert",
};

/** status별 기본 아이콘. 색 하나로 상태를 나르지 않기 위해 항상 문구와 같이 그린다.
 * 형태는 구현 위임값 — 저장소에 아이콘 모듈이 없어 여기도 인라인 SVG로 간단히 둔다.
 * saving만 null — Spinner는 교차 전환을 위해 자기 레이어에서 따로 그린다. */
function SaveStatusIcon({ status }: { status: SaveStatusValue }) {
  switch (status) {
    case "saved":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8.2l2.8 2.8 6-6.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "dirty":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </svg>
      );
    case "saving":
      return null;
    case "error":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 5v3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11.2" r="0.75" fill="currentColor" />
        </svg>
      );
  }
}

export interface SaveStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: SaveStatusValue;
  /** 문구. DDS는 한국어 기본 문구를 갖지 않으므로 필수. */
  children: React.ReactNode;
  /** 상태별 기본 아이콘을 대체. 미지정 시 status에 따른 기본 아이콘(saving은 Spinner small)이 그려진다. */
  icon?: React.ReactNode;
  /** 기본값 "auto" — 저장 완료(saving → saved)에서만 기본 아이콘이 150ms 교차 페이드한다.
   * 자동 저장이 잦아 깜빡임이 거슬리는 앱은 "none". 전환 도중에 바꿔도 즉시 적용된다. */
  motion?: "auto" | "none";
}

/**
 * 저장 상태 표시 leaf. status가 바뀌어도 같은 DOM 노드(같은 span)를 유지해야
 * 스크린리더 live region이 변경을 읽는다 — status별로 요소를 갈아끼우지 않는다.
 * 소비자가 이 컴포넌트에 `key`를 주고 status에 따라 바꾸면 매번 새 요소로 마운트되어
 * live region이 깨지니 절대 key를 status에 연동하지 말 것.
 */
export const SaveStatus = React.forwardRef<HTMLSpanElement, SaveStatusProps>(
  ({ status, children, icon, motion = "auto", className, ...props }, ref) => {
    // 직전 status 추적 — "완료 피드백"인 saving → saved만 페이드하고 최초 렌더와 나머지 진입은 즉시 그린다.
    // render 중 갱신이지만 같은 status로 다시 렌더되면 no-op이라 StrictMode 이중 렌더에도 결과가 같다.
    // status가 안 바뀐 부모 리렌더가 전환을 중간에 끊지 않게, 갱신 조건도 status 변경뿐이다.
    const renderedStatus = React.useRef(status);
    const previousStatus = React.useRef<SaveStatusValue | null>(null);
    if (renderedStatus.current !== status) {
      previousStatus.current = renderedStatus.current;
      renderedStatus.current = status;
    }

    const crossfade =
      motion === "auto" &&
      icon == null &&
      previousStatus.current === "saving" &&
      status === "saved";

    return (
      <span
        ref={ref}
        role={SAVE_STATUS_ROLE[status]}
        className={clsx("dds-save-status", `dds-save-status--status_${status}`, className)}
        {...props}
      >
        {/* 아이콘은 전부 장식 — 문구가 같은 뜻을 이미 나른다. 레이어를 겹쳐도 낭독이 늘지 않는다. */}
        <span
          className="dds-save-status__icon"
          aria-hidden="true"
          data-crossfade={crossfade ? "" : undefined}
        >
          {icon ?? (
            <>
              {/* 사라지는 동안에도 같은 노드로 남아야 opacity 전환이 현재 값에서 이어진다.
                  다른 status가 오면 crossfade가 꺼지며 이 레이어도 같이 사라진다(전환 즉시 취소). */}
              {(status === "saving" || crossfade) && (
                <span data-layer="spinner">
                  <Spinner size="small" aria-hidden="true" />
                </span>
              )}
              <span data-layer="glyph">
                <SaveStatusIcon status={status} />
              </span>
            </>
          )}
        </span>
        <span className="dds-save-status__label">{children}</span>
      </span>
    );
  },
);
SaveStatus.displayName = "SaveStatus";
