import "./tabs.css";

import clsx from "clsx";
import * as React from "react";

import { mergeRefs } from "../internal/merge-refs";
import { moveFocus } from "../internal/roving-focus";
import { useControllableState } from "../internal/use-controllable-state";
import { useSelectionIndicator } from "../internal/use-selection-indicator";
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
  /** px 단위 브레이크포인트. 지정 시 이상에서 List 숨김 및 Content 전체 표시 */
  responsive?: number;
  /** 기본값 "auto" — 포인터로 고른 탭에서만 활성 밑줄이 150ms 이동한다.
   * 키보드·프로그램 선택·초기 렌더·resize는 언제나 즉시. */
  motion?: "auto" | "none";
}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>((props, ref) => {
  const { className, value, defaultValue, onValueChange, responsive, motion = "auto", children, style, ...rest } =
    props;

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

  const [isWide, setIsWide] = React.useState(false);

  React.useEffect(() => {
    if (responsive === undefined || typeof window === "undefined" || !window.matchMedia) {
      setIsWide(false);
      return;
    }

    const mql = window.matchMedia(`(min-width: ${responsive}px)`);
    setIsWide(mql.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsWide(event.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, [responsive]);

  // automatic 활성화는 focus에서 일어나 click보다 이르다 — 입력 방식은 pointerdown에서 기록해야
  // 늦지 않는다. 실제 값이 바뀌는 순간에만 찍고 배치 직후 지우므로, 늦게 온 controlled 변경이나
  // 선택이 안 바뀌는 클릭에는 번지지 않는다.
  const pointerIntentRef = React.useRef(false);
  const animateNextRef = React.useRef(false);
  const selectValue = React.useCallback(
    (next: string) => {
      animateNextRef.current = pointerIntentRef.current && motion === "auto";
      setCurrent(next);
    },
    [motion, setCurrent],
  );

  const indicator = useSelectionIndicator<HTMLDivElement>({
    // wide에서는 List가 display:none이라 잴 수도, 보일 수도 없다.
    enabled: !isWide,
    value: current,
    animateNextRef,
    axis: "horizontal",
  });

  const baseId = React.useId();
  const indicatorWiring = React.useMemo(
    () => ({
      listRef: indicator.containerRef,
      elementRef: indicator.indicatorRef,
      registerTrigger: indicator.registerItem,
      active: indicator.measured && !isWide,
    }),
    [indicator.containerRef, indicator.indicatorRef, indicator.registerItem, indicator.measured, isWide],
  );
  const context = React.useMemo(
    () => ({
      value: current,
      setValue: selectValue,
      baseId,
      responsive,
      isWide,
      pointerIntentRef,
      indicator: indicatorWiring,
    }),
    [current, selectValue, baseId, responsive, isWide, indicatorWiring],
  );

  const rootStyle: React.CSSProperties = {
    ...style,
    ...(responsive !== undefined ? { ["--dds-tabs-breakpoint" as string]: `${responsive}px` } : {}),
  };

  return (
    <TabsContext.Provider value={context}>
      <div
        {...rest}
        ref={ref}
        data-responsive={responsive !== undefined ? "" : undefined}
        data-wide={isWide ? "" : undefined}
        style={rootStyle}
        className={clsx("dds-tabs", className)}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = "Tabs.Root";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (
    { className, onKeyDown, onPointerDown, onPointerCancel, onClick, children, ...props },
    ref,
  ) => {
    // Root 밖에서도 죽지 않게 직접 읽는다 — 밑줄 배선은 전부 선택적이다.
    const context = React.useContext(TabsContext);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const indicator = context?.indicator;
    const setRef = React.useMemo(
      () => mergeRefs(ref, listRef, indicator?.listRef),
      [ref, indicator?.listRef],
    );
    const pointerIntentRef = context?.pointerIntentRef;

    return (
      <div
        {...props}
        ref={setRef}
        role="tablist"
        aria-orientation="horizontal"
        data-indicator={indicator?.active ? "" : undefined}
        className={clsx("dds-tabs__list", className)}
        onKeyDown={(event) => {
          // 키보드가 시작되는 순간 포인터 의도를 내린다 — moveFocus가 부르는 automatic
          // 활성화보다 먼저 지워야 화살표 이동이 애니메이션을 얻지 않는다.
          if (pointerIntentRef) pointerIntentRef.current = false;
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          const aliased = KEY_ALIAS[event.key];
          // 포커스만 옮기면 된다 — 활성화는 Trigger의 focus 핸들러가 맡는다(automatic).
          if (aliased && moveFocus(listRef.current, TAB_ROLE, aliased)) event.preventDefault();
        }}
        onPointerDown={(event) => {
          if (pointerIntentRef) pointerIntentRef.current = true;
          onPointerDown?.(event);
        }}
        // click은 focus 활성화(그리고 Safari의 click 활성화)보다 뒤라 여기서 정리해도 늦지 않는다.
        onClick={(event) => {
          onClick?.(event);
          if (pointerIntentRef) pointerIntentRef.current = false;
        }}
        onPointerCancel={(event) => {
          if (pointerIntentRef) pointerIntentRef.current = false;
          onPointerCancel?.(event);
        }}
      >
        {/* 자리를 잡기 전에는 숨어 있고, 그동안은 활성 Trigger의 border-bottom이 fallback이다. */}
        {indicator ? (
          <span className="dds-tabs__indicator" aria-hidden="true" ref={indicator.elementRef} />
        ) : null}
        {children}
      </div>
    );
  },
);
TabsList.displayName = "Tabs.List";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 같은 값의 Tabs.Content와 짝지어진다. */
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, onClick, onFocus, ...props }, ref) => {
    const context = useTabsContext("Tabs.Trigger");
    const selected = context.value === value;

    // 밑줄이 따라갈 대상. value가 바뀌면 콜백 정체성이 바뀌어 옛 등록이 먼저 해제된다.
    const registerTrigger = context.indicator?.registerTrigger;
    const registerRef = React.useCallback(
      (node: HTMLButtonElement | null) => registerTrigger?.(value, node),
      [registerTrigger, value],
    );
    const setRef = React.useMemo(() => mergeRefs(ref, registerRef), [ref, registerRef]);

    return (
      <button
        {...props}
        ref={setRef}
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

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, tabIndex, ...props }, ref) => {
    const context = useTabsContext("Tabs.Content");
    const selected = context.value === value;
    const isHidden = context.isWide ? false : !selected;

    // wide 모드는 List가 display:none으로 숨어 트리거가 없다 — role="tabpanel"·
    // aria-labelledby를 유지하면 존재하지 않는 트리거를 가리키는 고아 tabpanel이 된다.
    // 일반 div로 내려 접근성 트리에서 tab 관계를 끊는다.
    const wideProps = context.isWide
      ? {}
      : {
          role: "tabpanel" as const,
          "aria-labelledby": triggerId(context.baseId, value),
          "data-state": selected ? "active" : "inactive",
        };
    // Allow consumers to override tabIndex. Default is 0 (only in narrow/tabpanel mode)
    // so panels remain keyboard accessible when they have no focusable children (APG).
    // wide 모드에서는 소비자가 명시하지 않는 한 붙이지 않는다 — 일반 div라 탭 정지점이 아니다.
    const resolvedTabIndex = tabIndex ?? (context.isWide ? undefined : 0);

    return (
      <div
        {...props}
        {...wideProps}
        ref={ref}
        id={contentId(context.baseId, value)}
        // 언마운트가 아니라 hidden — 패널 안 폼 상태가 탭을 오가도 살아남는다.
        // wide 모드에서는 hidden을 해제하여 모든 패널을 표시한다.
        hidden={isHidden}
        tabIndex={resolvedTabIndex}
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
