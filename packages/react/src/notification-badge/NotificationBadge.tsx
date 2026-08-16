import "./notification-badge.css";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const notificationBadge = cva("dds-notification-badge", {
  variants: {
    intent: {
      critical: "dds-notification-badge--intent_critical",
      brand: "dds-notification-badge--intent_brand",
    },
    shape: {
      dot: "dds-notification-badge--dot",
      pill: "dds-notification-badge--pill",
    },
  },
});

export interface NotificationBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  asChild?: boolean;
  /** 알림 개수. 생략하면 라벨 없는 dot으로 렌더된다. */
  count?: number;
  /** 이 값을 넘으면 "{max}+"로 표시한다. */
  max?: number;
  /** count === 0일 때도 "0"을 표시할지 여부. 기본은 미렌더(전체 컴포넌트가 null). */
  isShowEmpty?: boolean;
  intent?: "critical" | "brand";
}

export const NotificationBadge = React.forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  (
    { className, asChild, count, max = 99, isShowEmpty = false, intent = "critical", ...props },
    ref,
  ) => {
    // count === 0 && !isShowEmpty는 컴포넌트 전체를 렌더하지 않는다(빈 span도 아님).
    if (count === 0 && !isShowEmpty) return null;

    const isDot = count === undefined;
    const label = isDot ? undefined : count === 0 ? "0" : count > max ? `${max}+` : String(count);
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={clsx(notificationBadge({ intent, shape: isDot ? "dot" : "pill" }), className)}
        {...props}
      >
        {label}
      </Comp>
    );
  },
);
NotificationBadge.displayName = "NotificationBadge";
