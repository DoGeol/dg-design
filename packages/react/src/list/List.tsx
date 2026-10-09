import "./list.css";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

import { ListSection, ListSectionHeader, useListSection } from "./list-section";

export { ListSection, ListSectionHeader };
export type { ListSectionProps, ListSectionHeaderProps } from "./list-section";

/**
 * 객체 목록. 행마다 독립 행동이 둘 이상일 수 있어 listbox·grid 의미를 붙이지 않는다.
 * `list-style: none`이면 Safari가 목록 의미를 지워서 role을 다시 단다.
 */
export const ListRoot = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    const section = useListSection();
    return (
      <ul
        ref={ref}
        role="list"
        id={section?.contentId}
        aria-labelledby={props["aria-label"] ? undefined : section?.headingId}
        hidden={section ? !section.open : undefined}
        className={clsx("dds-list", className)}
        {...props}
      />
    );
  },
);
ListRoot.displayName = "List.Root";

const ItemContext = React.createContext<{ current: boolean }>({ current: false });

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 지금 열린 객체. 행 Action(정적 행이면 Title)에 aria-current="true"가 붙는다. */
  current?: boolean;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(({ current = false, className, ...props }, ref) => {
  const context = React.useMemo(() => ({ current }), [current]);
  return (
    <ItemContext.Provider value={context}>
      <li ref={ref} data-current={current ? "" : undefined} className={clsx("dds-list__item", className)} {...props} />
    </ItemContext.Provider>
  );
});
ListItem.displayName = "List.Item";

type ActionProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

/**
 * 행의 기본 행동(이동이면 링크, 그 자리 행동이면 버튼). `::after`가 행 전체를 덮어 누름 영역이 된다.
 * 이름은 전체 제목이다 — 말줄임은 CSS로만 한다.
 */
export const ListAction = React.forwardRef<HTMLElement, ActionProps>(({ asChild, href, className, ...props }, ref) => {
  const { current } = React.useContext(ItemContext);
  const shared = {
    className: clsx("dds-list__title", "dds-list__action", className),
    "aria-current": current ? ("true" as const) : undefined,
  };
  if (asChild) return <Slot ref={ref} {...shared} {...props} />;
  if (href !== undefined) {
    return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...shared} {...props} />;
  }
  return <button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...shared} {...props} />;
});
ListAction.displayName = "List.Action";

/** 기본 행동이 없는 행의 제목. */
export const ListTitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const { current } = React.useContext(ItemContext);
    return (
      <span
        ref={ref}
        aria-current={current ? "true" : undefined}
        className={clsx("dds-list__title", className)}
        {...props}
      />
    );
  },
);
ListTitle.displayName = "List.Title";

function slot(name: string, displayName: string) {
  const Component = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => <span ref={ref} className={clsx(`dds-list__${name}`, className)} {...props} />,
  );
  Component.displayName = displayName;
  return Component;
}

export const ListLeading = slot("leading", "List.Leading");
export const ListMeta = slot("meta", "List.Meta");
/** 상태 Badge·보조 메뉴 버튼. 행 Action 위에 놓인 형제라 링크 안에 버튼이 중첩되지 않는다. 행동이 둘을 넘으면 메뉴로 모은다. */
export const ListTrailing = slot("trailing", "List.Trailing");

export const List = {
  Root: ListRoot,
  Section: ListSection,
  SectionHeader: ListSectionHeader,
  Item: ListItem,
  Leading: ListLeading,
  Action: ListAction,
  Title: ListTitle,
  Meta: ListMeta,
  Trailing: ListTrailing,
};
