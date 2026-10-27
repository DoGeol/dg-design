import "./alert.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { CriticalIcon } from "../icon/critical-icon";
import { IconBase } from "../icon/icon-base";
import { InfoIcon } from "../icon/info-icon";
import { PositiveIcon } from "../icon/positive-icon";
import { WarningIcon } from "../icon/warning-icon";

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

/** intent별 아이콘. currentColor로 alert의 fg-{intent}를 물려받는다.
 * 상태 4종은 공개 아이콘 세트(`react/icon`)를 그대로 쓰고, 상태가 아닌 brand·neutral 글리프만 여기 둔다. */
const SparkleGlyph = () => (
  <IconBase>
    <path d="M12 2.4l2.04 6.36 6.36 2.04-6.36 2.04L12 19.2l-2.04-6.36L3.6 10.8l6.36-2.04Z" />
  </IconBase>
);

const MessageGlyph = () => (
  <IconBase>
    <path d="M4.8 7.8a3 3 0 0 1 3-3h8.4a3 3 0 0 1 3 3v4.8a3 3 0 0 1-3 3H9.6l-3.6 3.6v-3.6H7.8a3 3 0 0 1-3-3Z" />
  </IconBase>
);

function AlertIcon({ intent }: { intent: AlertIntent }) {
  switch (intent) {
    case "critical":
      return <CriticalIcon />;
    case "warning":
      return <WarningIcon />;
    case "positive":
      return <PositiveIcon />;
    case "informative":
      return <InfoIcon />;
    case "brand":
      return <SparkleGlyph />;
    case "neutral":
    default:
      return <MessageGlyph />;
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
  /** 액션 슬롯. description 아래 가로 flex로 렌더된다. 없으면 DOM 없음. */
  actions?: React.ReactNode;
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
      actions,
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
          {actions != null ? <div className="dds-alert__actions">{actions}</div> : null}
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
