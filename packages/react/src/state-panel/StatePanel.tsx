import "./state-panel.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

import { Spinner } from "../spinner/Spinner";

export interface StatePanelRootProps extends React.HTMLAttributes<HTMLDivElement> {
  minHeight?: number | string;
}

const StatePanelRoot = React.forwardRef<HTMLDivElement, StatePanelRootProps>(
  ({ className, minHeight, style, children, ...props }, ref) => {
    const computedStyle = React.useMemo(() => {
      if (minHeight === undefined) return style;
      const formattedMinHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
      return { ...style, minHeight: formattedMinHeight };
    }, [minHeight, style]);

    return (
      <div
        ref={ref}
        className={clsx("dds-state-panel", className)}
        style={computedStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);
StatePanelRoot.displayName = "StatePanel.Root";

export interface StatePanelIconProps extends React.HTMLAttributes<HTMLDivElement> {}

const StatePanelIcon = React.forwardRef<HTMLDivElement, StatePanelIconProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={clsx("dds-state-panel__icon", className)} {...props} />;
  },
);
StatePanelIcon.displayName = "StatePanel.Icon";

export interface StatePanelTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const StatePanelTitle = React.forwardRef<HTMLHeadingElement, StatePanelTitleProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "h2";
    return <Comp ref={ref} className={clsx("dds-state-panel__title", className)} {...props} />;
  },
);
StatePanelTitle.displayName = "StatePanel.Title";

export interface StatePanelDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const StatePanelDescription = React.forwardRef<
  HTMLParagraphElement,
  StatePanelDescriptionProps
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={clsx("dds-state-panel__description", className)} {...props} />;
});
StatePanelDescription.displayName = "StatePanel.Description";

export interface StatePanelActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const StatePanelActions = React.forwardRef<HTMLDivElement, StatePanelActionsProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={clsx("dds-state-panel__actions", className)} {...props} />;
  },
);
StatePanelActions.displayName = "StatePanel.Actions";

export interface StatePanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const StatePanelFooter = React.forwardRef<HTMLDivElement, StatePanelFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={clsx("dds-state-panel__footer", className)} {...props} />;
  },
);
StatePanelFooter.displayName = "StatePanel.Footer";

export interface StatePanelLoadingProps
  extends Omit<StatePanelRootProps, "children" | "role" | "aria-live"> {
  label: React.ReactNode;
}

const StatePanelLoading = React.forwardRef<HTMLDivElement, StatePanelLoadingProps>(
  ({ label, ...props }, ref) => {
    return (
      <StatePanelRoot ref={ref} role="status" aria-live="polite" {...props}>
        <StatePanelIcon>
          <Spinner size="medium" />
        </StatePanelIcon>
        <StatePanelDescription>{label}</StatePanelDescription>
      </StatePanelRoot>
    );
  },
);
StatePanelLoading.displayName = "StatePanel.Loading";

/**
 * compound: StatePanel.Root/Icon/Title/Description/Actions/Footer + preset Loading.
 * context 없음 — 서브컴포넌트는 Root 밖에서 써도 에러 없이 렌더된다.
 * role 기본값은 없으며 소비자가 status/alert를 지정한다.
 */
export const StatePanel = {
  Root: StatePanelRoot,
  Icon: StatePanelIcon,
  Title: StatePanelTitle,
  Description: StatePanelDescription,
  Actions: StatePanelActions,
  Footer: StatePanelFooter,
  Loading: StatePanelLoading,
};
