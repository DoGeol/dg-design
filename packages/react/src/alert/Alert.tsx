import "./alert.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const alert = cva("dds-alert", {
  variants: {
    intent: {
      brand: "dds-alert--intent_brand",
      neutral: "dds-alert--intent_neutral",
      critical: "dds-alert--intent_critical",
      positive: "dds-alert--intent_positive",
      warning: "dds-alert--intent_warning",
      informative: "dds-alert--intent_informative",
    },
  },
  defaultVariants: {
    intent: "neutral",
  },
});

export type AlertIntent = NonNullable<VariantProps<typeof alert>["intent"]>;

// live region 정책(전 컴포넌트 공통, Field.ErrorMessage 선례): critical만 암묵적
// assertive(role="alert"), 나머지는 암묵적 polite(role="status"). aria-live는 따로 얹지 않는다.
const ALERT_ROLE: Record<AlertIntent, "alert" | "status"> = {
  brand: "status",
  neutral: "status",
  critical: "alert",
  positive: "status",
  warning: "status",
  informative: "status",
};

/** intent별 인라인 SVG 아이콘. currentColor로 alert의 fg-{intent}를 물려받는다.
 * 저장소에 아이콘 모듈이 없고 이번에도 만들지 않는다(스펙) — Alert 파일 안에 로컬로만 둔다. */
function AlertIcon({ intent }: { intent: AlertIntent }) {
  switch (intent) {
    case "critical":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7.5 7.5l5 5M12.5 7.5l-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "warning":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2.5l8.2 14.2H1.8L10 2.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M10 8v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="14" r="0.9" fill="currentColor" />
        </svg>
      );
    case "positive":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6.5 10.2l2.3 2.3 4.7-4.7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "informative":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="6.3" r="0.9" fill="currentColor" />
        </svg>
      );
    case "brand":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2l1.7 5.3L17 9l-5.3 1.7L10 16l-1.7-5.3L3 9l5.3-1.7L10 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "neutral":
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4A2.5 2.5 0 0 1 13.5 13H8l-3 3v-3H6.5A2.5 2.5 0 0 1 4 10.5v-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 3l8 8M11 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children" | "role"> {
  intent?: AlertIntent;
  /** 제목. 굵게 렌더된다. */
  title?: React.ReactNode;
  /** 본문. 생략 가능. */
  description?: React.ReactNode;
  /** 지정하면 닫기 버튼이 렌더되고 클릭 시 호출된다. 생략하면 닫기 버튼 없음. */
  onClose?: () => void;
  /** 닫기 버튼 aria-label. */
  closeLabel?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      intent = "neutral",
      title,
      description,
      onClose,
      closeLabel = "닫기",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(alert({ intent }), className)}
        {...props}
        role={ALERT_ROLE[intent]}
      >
        <span className="dds-alert__icon">
          <AlertIcon intent={intent} />
        </span>
        <div className="dds-alert__body">
          {title != null ? <p className="dds-alert__title">{title}</p> : null}
          {description != null ? <p className="dds-alert__description">{description}</p> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            className="dds-alert__close"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
    );
  },
);
Alert.displayName = "Alert";
