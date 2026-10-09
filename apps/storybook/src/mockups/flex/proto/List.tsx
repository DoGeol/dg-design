import * as React from "react";

/**
 * 객체 목록 프로토타입 — packages/react에 없다. ul/li 구조라 listbox·표 의미를 강제하지 않는다.
 * 행의 기본 행동은 제목 링크 하나이고, 링크의 ::after가 행 전체를 덮어 누름 영역이 된다.
 * trailing의 보조 버튼은 그 위(z-index)에 따로 놓여 링크 안에 중첩되지 않는다.
 */
export function List({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  // list-style: none이면 Safari가 목록 의미를 지워서 role을 다시 단다.
  return <ul role="list" className={className ? `fx-list ${className}` : "fx-list"} {...props} />;
}

export interface ListItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  /** 두 번째 줄. 있으면 두 줄 행 높이를 쓴다. */
  meta?: React.ReactNode;
  /** 상태 Badge, 보조 메뉴 버튼 등. 버튼은 행 링크와 별개의 초점 대상이다. */
  trailing?: React.ReactNode;
  /** 행의 기본 행동(객체 열기). 없으면 정적인 행이다. */
  href?: string;
}

export function ListItem({ leading, title, meta, trailing, href, className, ...props }: ListItemProps) {
  return (
    <li className={className ? `fx-list__item ${className}` : "fx-list__item"} data-lines={meta ? 2 : 1} {...props}>
      {leading && <span className="fx-list__leading">{leading}</span>}
      <span className="fx-list__main">
        {href ? (
          <a className="fx-list__title fx-list__action" href={href} onClick={(e) => e.preventDefault()}>{title}</a>
        ) : (
          <span className="fx-list__title">{title}</span>
        )}
        {meta && <span className="fx-list__meta">{meta}</span>}
      </span>
      {trailing && <span className="fx-list__trailing">{trailing}</span>}
    </li>
  );
}

function Chevron() {
  return (
    <svg className="fx-section-header__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 제목 옆 건수. 숫자만 주면 "n개"로 읽히게 한다. */
  count?: number;
  /** 오른쪽 행동(추가 등). 제목 버튼과 형제로 둔다. */
  action?: React.ReactNode;
  /** 주면 제목이 접기 버튼이 된다(aria-expanded). controls는 접히는 목록의 id. */
  collapse?: { expanded: boolean; controls: string; onToggle?: () => void };
  as?: "h2" | "h3" | "h4";
}

/** 목록 묶음의 제목 행. Accordion과 달리 본문 disclosure가 아니라 목록 그룹 제목이다. */
export function SectionHeader({ title, description, count, action, collapse, as: Heading = "h3" }: SectionHeaderProps) {
  const label = (
    <>
      <span className="fx-section-header__title">{title}</span>
      {count !== undefined && <span className="fx-section-header__count">{count}</span>}
    </>
  );
  return (
    <div className="fx-section-header">
      <div className="fx-section-header__text">
        <Heading className="fx-section-header__heading">
          {collapse ? (
            <button
              type="button"
              className="fx-section-header__toggle"
              aria-expanded={collapse.expanded}
              aria-controls={collapse.controls}
              onClick={collapse.onToggle}
            >
              <Chevron />
              {label}
            </button>
          ) : (
            label
          )}
        </Heading>
        {description && <p className="fx-section-header__description">{description}</p>}
      </div>
      {action && <div className="fx-section-header__action">{action}</div>}
    </div>
  );
}
