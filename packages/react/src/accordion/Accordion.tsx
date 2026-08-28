import "./accordion.css";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { Collapsible } from "../collapsible/Collapsible";
import { mergeRefs } from "../internal/merge-refs";
import { moveFocus } from "../internal/roving-focus";
import { useControllableState } from "../internal/use-controllable-state";
import {
  AccordionItemContext,
  AccordionRootContext,
  type AccordionSize,
  type AccordionVariant,
  useAccordionItemContext,
  useAccordionRootContext,
} from "./accordion-context";

const root = cva("dds-accordion", {
  variants: {
    variant: {
      inline: "dds-accordion--variant_inline",
      separated: "dds-accordion--variant_separated",
    },
    size: {
      medium: "dds-accordion--size_medium",
      large: "dds-accordion--size_large",
    },
  },
  defaultVariants: { variant: "inline", size: "medium" },
});

const item = cva("dds-accordion__item", {
  variants: {
    variant: {
      inline: "dds-accordion__item--variant_inline",
      separated: "dds-accordion__item--variant_separated",
    },
  },
});

const ACCORDION_TRIGGER_ROLE = "button";

export interface AccordionRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** controlled 열린 항목. single 모드에서는 첫 값 하나만 표시한다. */
  values?: string[];
  /** uncontrolled 초기 열린 항목. */
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  /** 여러 항목을 동시에 열 수 있는지. 기본 false. */
  multiple?: boolean;
  disabled?: boolean;
  variant?: AccordionVariant;
  size?: AccordionSize;
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  const {
    className,
    values,
    defaultValues = [],
    onValuesChange,
    multiple = false,
    disabled = false,
    variant = "inline",
    size = "medium",
    children,
    ...rest
  } = props;
  // 빈 배열도 controlled 값이다. prop의 존재로만 모드를 판단해야 외부 reset이 즉시 반영된다.
  const [rawValues, setValues] = useControllableState<string[]>({
    value: values,
    controlled: "values" in props,
    defaultValue: defaultValues,
    onChange: onValuesChange,
  });
  const visibleValues = multiple ? rawValues : rawValues.slice(0, 1);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRef = React.useMemo(() => mergeRefs(ref, rootRef), [ref]);
  const itemCounts = React.useRef(new Map<string, number>());

  const registerItem = React.useCallback((value: string) => {
    const nextCount = (itemCounts.current.get(value) ?? 0) + 1;
    itemCounts.current.set(value, nextCount);
    if (nextCount > 1) {
      console.warn(`Accordion: duplicate Item value \`${value}\` was rendered in the same Root.`);
    }
    return () => {
      const count = itemCounts.current.get(value) ?? 0;
      if (count <= 1) itemCounts.current.delete(value);
      else itemCounts.current.set(value, count - 1);
    };
  }, []);

  const toggle = React.useCallback(
    (value: string) => {
      if (disabled) return;
      if (!multiple) {
        setValues(visibleValues[0] === value ? [] : [value]);
        return;
      }
      setValues(
        visibleValues.includes(value)
          ? visibleValues.filter((current) => current !== value)
          : [...visibleValues, value],
      );
    },
    [disabled, multiple, setValues, visibleValues],
  );

  const context = React.useMemo(
    () => ({
      values: visibleValues,
      multiple,
      disabled,
      variant,
      size,
      rootRef,
      toggle,
      registerItem,
    }),
    [visibleValues, multiple, disabled, variant, size, toggle, registerItem],
  );

  return (
    <AccordionRootContext.Provider value={context}>
      <div
        {...rest}
        ref={mergedRef}
        data-disabled={disabled || undefined}
        className={clsx(root({ variant, size }), className)}
      >
        {children}
      </div>
    </AccordionRootContext.Provider>
  );
});
AccordionRoot.displayName = "Accordion.Root";

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled: itemDisabled = false, children, ...props }, ref) => {
    const rootContext = useAccordionRootContext("Accordion.Item");
    const disabled = rootContext.disabled || itemDisabled;
    const open = rootContext.values.includes(value);
    const itemId = React.useId();
    const triggerId = `${itemId}-trigger`;
    const contentId = `${itemId}-content`;

    React.useEffect(() => rootContext.registerItem(value), [rootContext, value]);

    const context = React.useMemo(
      () => ({ value, open, disabled, triggerId, contentId }),
      [value, open, disabled, triggerId, contentId],
    );

    return (
      <AccordionItemContext.Provider value={context}>
        <Collapsible.Root
          {...props}
          ref={ref}
          open={open}
          disabled={disabled}
          data-state={open ? "open" : "closed"}
          data-disabled={disabled || undefined}
          className={clsx(item({ variant: rootContext.variant }), className)}
          onOpenChange={(nextOpen) => {
            if (nextOpen !== open) rootContext.toggle(value);
          }}
        >
          {children}
        </Collapsible.Root>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "Accordion.Item";

export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  ({ className, asChild, ...props }, ref) => {
    useAccordionItemContext("Accordion.Header");
    const Comp = asChild ? Slot : "h3";
    return <Comp ref={ref} className={clsx("dds-accordion__header", className)} {...props} />;
  },
);
AccordionHeader.displayName = "Accordion.Header";

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, asChild, onKeyDown, ...props }, ref) => {
    const itemContext = useAccordionItemContext("Accordion.Trigger");
    const rootContext = useAccordionRootContext("Accordion.Trigger");

    return (
      <Collapsible.Trigger
        {...props}
        ref={ref}
        asChild={asChild}
        role={ACCORDION_TRIGGER_ROLE}
        id={itemContext.triggerId}
        aria-controls={itemContext.contentId}
        data-accordion-trigger=""
        className={clsx("dds-accordion__trigger", className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.nativeEvent.isComposing) return;
          if (moveFocus(rootContext.rootRef.current, ACCORDION_TRIGGER_ROLE, event.key)) {
            event.preventDefault();
          }
        }}
      />
    );
  },
);
AccordionTrigger.displayName = "Accordion.Trigger";

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, ...props }, ref) => {
    const context = useAccordionItemContext("Accordion.Content");
    return (
      <Collapsible.Content
        {...props}
        ref={ref}
        id={context.contentId}
        role="region"
        aria-labelledby={context.triggerId}
        className={clsx("dds-accordion__content", className)}
      />
    );
  },
);
AccordionContent.displayName = "Accordion.Content";

export interface AccordionBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionBody = React.forwardRef<HTMLDivElement, AccordionBodyProps>((props, ref) => {
  useAccordionItemContext("Accordion.Body");
  const { className, ...rest } = props;
  return <div ref={ref} className={clsx("dds-accordion__body", className)} {...rest} />;
});
AccordionBody.displayName = "Accordion.Body";

export interface AccordionTitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AccordionTitle = React.forwardRef<HTMLSpanElement, AccordionTitleProps>((props, ref) => {
  useAccordionItemContext("Accordion.Title");
  const { className, ...rest } = props;
  return <span ref={ref} className={clsx("dds-accordion__title", className)} {...rest} />;
});
AccordionTitle.displayName = "Accordion.Title";

export interface AccordionDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AccordionDescription = React.forwardRef<HTMLSpanElement, AccordionDescriptionProps>(
  (props, ref) => {
    useAccordionItemContext("Accordion.Description");
    const { className, ...rest } = props;
    return (
      <span ref={ref} className={clsx("dds-accordion__description", className)} {...rest} />
    );
  },
);
AccordionDescription.displayName = "Accordion.Description";

export interface AccordionPrefixProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AccordionPrefix = React.forwardRef<HTMLSpanElement, AccordionPrefixProps>((props, ref) => {
  useAccordionItemContext("Accordion.Prefix");
  const { className, ...rest } = props;
  return <span ref={ref} className={clsx("dds-accordion__prefix", className)} {...rest} />;
});
AccordionPrefix.displayName = "Accordion.Prefix";

export interface AccordionSuffixIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AccordionSuffixIcon = React.forwardRef<HTMLSpanElement, AccordionSuffixIconProps>(
  (props, ref) => {
    useAccordionItemContext("Accordion.SuffixIcon");
    const { className, ...rest } = props;
    return (
      <span ref={ref} className={clsx("dds-accordion__suffix-icon", className)} {...rest} />
    );
  },
);
AccordionSuffixIcon.displayName = "Accordion.SuffixIcon";

/** 복수 disclosure를 위해 Collapsible의 상태·접근성·height 전환을 조립한 compound API. */
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Body: AccordionBody,
  Title: AccordionTitle,
  Description: AccordionDescription,
  Prefix: AccordionPrefix,
  SuffixIcon: AccordionSuffixIcon,
};
