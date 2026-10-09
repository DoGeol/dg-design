import clsx from "clsx";
import * as React from "react";

import { useControllableState } from "../internal/use-controllable-state";

interface ListSectionContextValue {
  collapsible: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  headingId: string;
}

const ListSectionContext = React.createContext<ListSectionContextValue | null>(null);

export const useListSection = () => React.useContext(ListSectionContext);

export interface ListSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 주면 SectionHeader 제목이 접기 버튼이 되고 접힌 목록은 hidden이다. */
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** 목록 묶음. 묶음 제목과 그 아래 List.Root를 aria로 잇는다(접기면 aria-controls까지). */
export const ListSection = React.forwardRef<HTMLDivElement, ListSectionProps>(
  ({ collapsible = false, open, defaultOpen = true, onOpenChange, className, ...props }, ref) => {
    const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
    const id = React.useId();
    const context = React.useMemo(
      () => ({
        collapsible,
        open: collapsible ? isOpen : true,
        setOpen,
        contentId: `${id}-list`,
        headingId: `${id}-heading`,
      }),
      [collapsible, isOpen, setOpen, id],
    );
    return (
      <ListSectionContext.Provider value={context}>
        <div ref={ref} className={clsx("dds-list-section", className)} {...props} />
      </ListSectionContext.Provider>
    );
  },
);
ListSection.displayName = "List.Section";

export interface ListSectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** 제목 옆 건수. */
  count?: number;
  description?: React.ReactNode;
  /** 오른쪽 행동(추가 등). heading 밖 형제다 — 이름에 대상 종류를 넣는다("초안 추가"). */
  action?: React.ReactNode;
  as?: "h2" | "h3" | "h4";
}

function Chevron() {
  return (
    <svg className="dds-list-section-header__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 목록 묶음 제목 행. Accordion과 달리 본문 disclosure가 아니라 목록 그룹 제목이다. */
export const ListSectionHeader = React.forwardRef<HTMLDivElement, ListSectionHeaderProps>(
  ({ title, count, description, action, as: Heading = "h3", className, ...props }, ref) => {
    const section = useListSection();
    const label = (
      <>
        <span className="dds-list-section-header__title">{title}</span>
        {count !== undefined && (
          <>
            {" "}
            <span className="dds-list-section-header__count">{count}</span>
          </>
        )}
      </>
    );
    return (
      <div ref={ref} className={clsx("dds-list-section-header", className)} {...props}>
        <div className="dds-list-section-header__text">
          <Heading id={section?.headingId} className="dds-list-section-header__heading">
            {section?.collapsible ? (
              <button
                type="button"
                className="dds-list-section-header__toggle"
                aria-expanded={section.open}
                aria-controls={section.contentId}
                onClick={() => section.setOpen(!section.open)}
              >
                <Chevron />
                {label}
              </button>
            ) : (
              label
            )}
          </Heading>
          {description && <p className="dds-list-section-header__description">{description}</p>}
        </div>
        {action && <div className="dds-list-section-header__action">{action}</div>}
      </div>
    );
  },
);
ListSectionHeader.displayName = "List.SectionHeader";
