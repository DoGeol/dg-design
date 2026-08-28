import "./collapsible.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

import { mergeRefs } from "../internal/merge-refs";
import { useControllableState } from "../internal/use-controllable-state";

interface CollapsibleContextValue {
  open: boolean;
  disabled: boolean;
  contentId: string;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined);

function useCollapsibleContext(component: string): CollapsibleContextValue {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error(`${component}은 Collapsible.Root 안에서만 쓸 수 있다.`);
  return context;
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface CollapsibleRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** controlled 열림 상태. `undefined`도 controlled 값으로 취급하려면 prop을 명시한다. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const CollapsibleRoot = React.forwardRef<HTMLDivElement, CollapsibleRootProps>((props, ref) => {
  const { className, open: openProp, defaultOpen = false, onOpenChange, disabled = false, ...rest } =
    props;
  // `false`가 유효한 controlled 값이라 존재 여부로만 controlled를 판별한다.
  const [open, setOpen] = useControllableState({
    value: openProp,
    controlled: "open" in props,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const generatedId = React.useId();
  const context = React.useMemo(
    () => ({ open, disabled, contentId: `${generatedId}-content`, setOpen }),
    [disabled, generatedId, open, setOpen],
  );

  return (
    <CollapsibleContext.Provider value={context}>
      <div
        {...rest}
        ref={ref}
        className={clsx("dds-collapsible", className)}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
      />
    </CollapsibleContext.Provider>
  );
});
CollapsibleRoot.displayName = "Collapsible.Root";

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** true면 자식 하나를 Trigger로 사용한다. */
  asChild?: boolean;
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ asChild, className, disabled: disabledProp, onClick, ...props }, ref) => {
    const context = useCollapsibleContext("Collapsible.Trigger");
    const disabled = context.disabled || Boolean(disabledProp);
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        {...props}
        ref={ref}
        type={asChild ? undefined : "button"}
        className={clsx("dds-collapsible__trigger", className)}
        aria-expanded={context.open}
        aria-controls={context.contentId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-state={context.open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (event.defaultPrevented || disabled) return;
          context.setOpen(!context.open);
        }}
      />
    );
  },
);
CollapsibleTrigger.displayName = "Collapsible.Trigger";

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, style, ...props }, ref) => {
    const context = useCollapsibleContext("Collapsible.Content");
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = React.useState<number>();
    const setRef = React.useMemo(() => mergeRefs(ref, contentRef), [ref]);

    useIsomorphicLayoutEffect(() => {
      const element = contentRef.current;
      if (!element) return;

      const updateHeight = () => setHeight(element.scrollHeight);
      updateHeight();

      // jsdom과 일부 non-browser renderer에는 ResizeObserver가 없다. 높이는 한 번 측정해
      // CSS 변수에 넣고, 브라우저에서만 이후 콘텐츠 변화를 관찰한다.
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(updateHeight);
      observer.observe(element);
      return () => observer.disconnect();
    }, []);

    const contentStyle = {
      ...style,
      "--dds-collapsible-content-height": height === undefined ? undefined : `${height}px`,
    } as React.CSSProperties;

    return (
      <div
        {...props}
        ref={setRef}
        id={context.contentId}
        className={clsx("dds-collapsible__content", className)}
        style={contentStyle}
        aria-hidden={!context.open}
        inert={!context.open || undefined}
        data-state={context.open ? "open" : "closed"}
        data-disabled={context.disabled || undefined}
      />
    );
  },
);
CollapsibleContent.displayName = "Collapsible.Content";

/** 단일 영역을 열고 닫는 compound primitive. */
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
};
