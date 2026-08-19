import "./breadcrumb.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

export interface BreadcrumbRootProps extends React.HTMLAttributes<HTMLElement> {}

const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbRootProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="이동 경로"
      className={clsx("dds-breadcrumb", className)}
      {...props}
    />
  ),
);
BreadcrumbRoot.displayName = "Breadcrumb.Root";

export interface BreadcrumbListProps extends React.HTMLAttributes<HTMLOListElement> {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={clsx("dds-breadcrumb__list", className)} {...props} />
  ),
);
BreadcrumbList.displayName = "Breadcrumb.List";

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={clsx("dds-breadcrumb__item", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "Breadcrumb.Item";

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 자식 엘리먼트에 링크 스타일만 입힌다 — 라우터 Link로 교체할 때. */
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return <Comp ref={ref} className={clsx("dds-breadcrumb__link", className)} {...props} />;
  },
);
BreadcrumbLink.displayName = "Breadcrumb.Link";

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {}

// 현재 위치 — 링크가 아니라 span이다(자기 자신으로 이동할 필요가 없다는 표준 breadcrumb 관례).
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      className={clsx("dds-breadcrumb__page", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "Breadcrumb.Page";

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLLIElement> {}

// Item과 나란히 List(ol)에 들어가는 li다 — aria-hidden이라 스크린 리더 순회에서 빠진다.
// 기본 기호는 "/"(스펙에서 위임) — 자식으로 아이콘 등으로 교체 가능.
const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      aria-hidden="true"
      className={clsx("dds-breadcrumb__separator", className)}
      {...props}
    >
      {children ?? "/"}
    </li>
  ),
);
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

/**
 * compound: Breadcrumb.Root/List/Item/Link/Page/Separator.
 * 로직 0 — 긴 경로 생략(중간 …)은 소비자 몫이다.
 */
export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
};
