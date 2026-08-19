import "./tabs.css";

import clsx from "clsx";
import * as React from "react";

import { mergeRefs } from "../internal/merge-refs";
import { moveFocus } from "../internal/roving-focus";
import { useControllableState } from "../internal/use-controllable-state";
import { contentId, TabsContext, triggerId, useTabsContext } from "./tabs-context";

/** 항목의 role — roving 조회와 aria가 같은 값을 쓴다. */
const TAB_ROLE = "tab";

/** roving-focus는 세로 축 키를 받는다 — 가로 고정인 탭은 좌우를 그 키로 옮겨 재사용한다. */
const KEY_ALIAS: Record<string, string | undefined> = {
  ArrowRight: "ArrowDown",
  ArrowLeft: "ArrowUp",
  Home: "Home",
  End: "End",
};

export interface TabsRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** controlled 값. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>((props, ref) => {
  const { className, value, defaultValue, onValueChange, children, ...rest } = props;

  const handleChange = React.useCallback(
    (next: string | undefined) => {
      if (next !== undefined) onValueChange?.(next);
    },
    [onValueChange],
  );
  // `undefined`가 "선택 없음"이라 값이 아니라 prop 존재 여부로 controlled를 가른다.
  const [current, setCurrent] = useControllableState<string | undefined>({
    value,
    controlled: "value" in props,
    defaultValue,
    onChange: handleChange,
  });

  const baseId = React.useId();
  const context = React.useMemo(
    () => ({ value: current, setValue: setCurrent as (next: string) => void, baseId }),
    [current, setCurrent, baseId],
  );

  return (
    <TabsContext.Provider value={context}>
      <div {...rest} ref={ref} className={clsx("dds-tabs", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = "Tabs.Root";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const setRef = React.useMemo(() => mergeRefs(ref, listRef), [ref]);

    return (
      <div
        {...props}
        ref={setRef}
        role="tablist"
        aria-orientation="horizontal"
        className={clsx("dds-tabs__list", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          const aliased = KEY_ALIAS[event.key];
          // 포커스만 옮기면 된다 — 활성화는 Trigger의 focus 핸들러가 맡는다(automatic).
          if (aliased && moveFocus(listRef.current, TAB_ROLE, aliased)) event.preventDefault();
        }}
      />
    );
  },
);
TabsList.displayName = "Tabs.List";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 같은 값의 Tabs.Content와 짝지어진다. */
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, onClick, onFocus, ...props }, ref) => {
    const context = useTabsContext("Tabs.Trigger");
    const selected = context.value === value;

    return (
      <button
        {...props}
        ref={ref}
        type="button"
        role="tab"
        id={triggerId(context.baseId, value)}
        aria-selected={selected}
        aria-controls={contentId(context.baseId, value)}
        disabled={disabled}
        // 선택이 없을 때만 전부 tabIndex 0 — 어느 탭이든 포커스되는 순간 automatic
        // 활성화가 일어나 tab stop이 하나로 복구된다.
        tabIndex={selected || context.value === undefined ? 0 : -1}
        data-state={selected ? "active" : "inactive"}
        className={clsx("dds-tabs__trigger", className)}
        onFocus={(event) => {
          onFocus?.(event);
          // automatic 활성화: 포커스가 닿는 것이 곧 활성화다(화살표·Home/End·클릭 공통).
          if (!event.defaultPrevented) context.setValue(value);
        }}
        onClick={(event) => {
          onClick?.(event);
          // Safari는 버튼 클릭에 포커스를 주지 않아 focus 핸들러만으로는 부족하다.
          if (!event.defaultPrevented) context.setValue(value);
        }}
      />
    );
  },
);
TabsTrigger.displayName = "Tabs.Trigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 같은 값의 Tabs.Trigger와 짝지어진다. */
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = useTabsContext("Tabs.Content");
    const selected = context.value === value;

    return (
      <div
        {...props}
        ref={ref}
        role="tabpanel"
        id={contentId(context.baseId, value)}
        aria-labelledby={triggerId(context.baseId, value)}
        // 언마운트가 아니라 hidden — 패널 안 폼 상태가 탭을 오가도 살아남는다.
        hidden={!selected}
        // 패널에 포커스 가능한 요소가 없어도 키보드로 스크롤할 수 있어야 한다.
        tabIndex={0}
        data-state={selected ? "active" : "inactive"}
        className={clsx("dds-tabs__content", className)}
      />
    );
  },
);
TabsContent.displayName = "Tabs.Content";

/**
 * compound: Tabs.Root/List/Trigger/Content. 오버레이가 아니라 use-overlay를 쓰지 않고
 * roving-focus만 재사용한다. 활성화는 automatic(APG tabs) — manual 모드는 없다.
 */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
