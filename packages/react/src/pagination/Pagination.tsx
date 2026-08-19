import "./pagination.css";
// 외관은 ghost/weak Button과 동형 계열(스펙) — 새 CSS를 쓰는 대신 button.css의 검증된
// 클래스를 그대로 얹는다. MultiSelect가 select.css를 재사용하는 것과 같은 방식.
import "../button/button.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

/** Link·Previous·Next가 공유하는 외관 클래스 계산. 활성만 weak, 나머지는 ghost. */
function paginationLinkClass(isActive: boolean | undefined, className: string | undefined) {
  return clsx(
    "dds-pagination__link",
    "dds-button",
    "dds-button--size_medium",
    isActive
      ? "dds-button--intent_brand dds-button--variant_weak"
      : "dds-button--intent_neutral dds-button--variant_ghost",
    className,
  );
}

export interface PaginationRootProps extends React.HTMLAttributes<HTMLElement> {}

const PaginationRoot = React.forwardRef<HTMLElement, PaginationRootProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="페이지네이션"
      className={clsx("dds-pagination", className)}
      {...props}
    />
  ),
);
PaginationRoot.displayName = "Pagination.Root";

export interface PaginationListProps extends React.HTMLAttributes<HTMLUListElement> {}

const PaginationList = React.forwardRef<HTMLUListElement, PaginationListProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={clsx("dds-pagination__list", className)} {...props} />
  ),
);
PaginationList.displayName = "Pagination.List";

export interface PaginationItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={clsx("dds-pagination__item", className)} {...props} />
  ),
);
PaginationItem.displayName = "Pagination.Item";

export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 현재 페이지인지. true면 aria-current="page" + 활성 외관(weak)을 함께 켠다. */
  isActive?: boolean;
  /** 자식 엘리먼트에 링크 스타일만 입힌다 — 라우터 Link로 교체할 때. */
  asChild?: boolean;
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={paginationLinkClass(isActive, className)}
        {...props}
      />
    );
  },
);
PaginationLink.displayName = "Pagination.Link";

/** 저장소에 아이콘 모듈이 없다(Alert 선례) — Previous/Next 전용 방향 아이콘을 로컬로 둔다. */
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 4l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 접근 이름. 기본값 "이전 페이지" — 앱 언어에 맞춰 교체(i18n 관례는 Toast closeLabel 참고). */
  label?: string;
}

// Link와 별도 컴포넌트인 이유: isActive·asChild는 Previous/Next에 없다(스펙에서 asChild
// 실사용 지점을 Link·Breadcrumb.Link로만 한정) — 얇은 anchor로 직접 둔다.
const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ className, label = "이전 페이지", children, ...props }, ref) => (
    <a ref={ref} aria-label={label} className={paginationLinkClass(false, className)} {...props}>
      {children ?? <ChevronLeftIcon />}
    </a>
  ),
);
PaginationPrevious.displayName = "Pagination.Previous";

export interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 접근 이름. 기본값 "다음 페이지". */
  label?: string;
}

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ className, label = "다음 페이지", children, ...props }, ref) => (
    <a ref={ref} aria-label={label} className={paginationLinkClass(false, className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </a>
  ),
);
PaginationNext.displayName = "Pagination.Next";

export interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** sr 전용 텍스트. 기본값 "더 많은 페이지". */
  label?: string;
}

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, label = "더 많은 페이지", children, ...props }, ref) => (
    <span ref={ref} className={clsx("dds-pagination__ellipsis", className)} {...props}>
      <span aria-hidden="true">{children ?? "…"}</span>
      <span className="dds-pagination__sr-only">{label}</span>
    </span>
  ),
);
PaginationEllipsis.displayName = "Pagination.Ellipsis";

/**
 * compound: Pagination.Root/List/Item/Link/Previous/Next/Ellipsis.
 * 생략 계산·페이지 상태는 없다 — List 안에 Item을 몇 개 어떻게 나열할지는 소비자 몫이다.
 */
export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
};
