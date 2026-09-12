import "./radio-group.css";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";
import { mergeRefs } from "../internal/merge-refs";
import { useControllableState } from "../internal/use-controllable-state";
import { useSelectionIndicator } from "../internal/use-selection-indicator";
import { RadioGroupContext } from "./radio-group-context";

const radioGroup = cva("dds-radio-group", {
  variants: {
    variant: {
      default: "dds-radio-group--variant_default",
      segmented: "dds-radio-group--variant_segmented",
    },
    orientation: {
      vertical: "dds-radio-group--orientation_vertical",
      horizontal: "dds-radio-group--orientation_horizontal",
    },
    size: {
      small: "dds-radio-group--size_small",
      medium: "dds-radio-group--size_medium",
      large: "dds-radio-group--size_large",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "vertical",
  },
});

export interface RadioGroupRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  variant?: "default" | "segmented";
  size?: "small" | "medium" | "large";
  /** 기본값 "auto" — 포인터로 누른 선택에서만 기본형 점이 페이드하고 segmented 배경이 이동한다.
   * 키보드·외부 값 변경·초기 렌더·resize는 언제나 즉시. 항목이 아주 많은 화면은 "none". */
  motion?: "auto" | "none";
}

/**
 * 화살표 이동·선택은 네이티브 radio(name 공유)에 위임한다. 브라우저는 두 축 모두에
 * 반응하므로, orientation의 반대 축 키만 keydown에서 preventDefault해 축을 제한한다.
 * disabled 항목은 네이티브가 자동으로 건너뛴다 — roving-focus 유틸은 쓰지 않는다.
 */
export const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioGroupRootProps>((props, ref) => {
  const {
    className,
    value,
    defaultValue,
    onValueChange,
    name,
    orientation = "vertical",
    variant = "default",
    size = "medium",
    disabled = false,
    motion = "auto",
    onKeyDown,
    onClick,
    onTransitionEnd,
    children,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = props;

  // segmented는 horizontal 강제 — vertical + segmented는 타입에서 막지 않고 런타임 경고 없이 horizontal로 렌더.
  // default variant는 size 무시(현행 유지).
  const resolvedOrientation = variant === "segmented" ? "horizontal" : orientation;
  const resolvedSize = variant === "segmented" ? size : undefined;

  const generatedName = React.useId();
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

  // 포인터로 누른 선택만 움직인다. radio는 change 직전에 항상 click이 먼저 오고(실측),
  // 키보드 화살표·프로그램 click은 detail=0으로 도착한다 — 그 한 가지로 갈린다.
  const pointerSelectRef = React.useRef(false);
  // 실제 값 변경 시점에 찍는다. 선택이 바뀌지 않는 클릭은 아무것도 남기지 않고,
  // 소비자가 늦게 controlled 값을 바꾸면 그 변경은 프로그램 변경으로 처리된다.
  const animateNextRef = React.useRef(false);
  const [pointerMotion, setPointerMotion] = React.useState(false);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      pointerSelectRef.current = event.detail > 0 && !event.defaultPrevented;
    },
    [onClick],
  );

  const selectValue = React.useCallback(
    (next: string) => {
      const animate = pointerSelectRef.current && motion === "auto";
      animateNextRef.current = animate;
      setPointerMotion(animate);
      setCurrent(next);
    },
    [motion, setCurrent],
  );

  // 전환이 끝나면 모션 허용을 내린다 — 포인터 뒤의 키보드·프로그램 변경에 남지 않는다.
  const handleTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      onTransitionEnd?.(event);
      setPointerMotion(false);
    },
    [onTransitionEnd],
  );

  const segmented = variant === "segmented";
  const indicator = useSelectionIndicator<HTMLDivElement>({
    enabled: segmented,
    value: current,
    animateNextRef,
  });

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const crossAxisKeys =
        resolvedOrientation === "horizontal" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
      if (crossAxisKeys.includes(event.key)) event.preventDefault();
    },
    [onKeyDown, resolvedOrientation],
  );

  // Field.Root 안이면 context에서 id·invalid·describedby를 받는다. 개별 radio가 아니라
  // 그룹이 받는다 — 오류 설명이 걸릴 대상도, 라벨이 가리킬 대상도 그룹이다.
  // 단독 사용 시 context가 없으니 자체 useId로 id를 만든다.
  const fieldCtx = React.useContext(FieldContext);
  const generatedId = React.useId();
  const resolvedId = id ?? fieldCtx?.inputId ?? generatedId;
  const resolvedDescribedBy =
    [fieldCtx?.describedBy, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
  const resolvedInvalid = ariaInvalid ?? fieldCtx?.invalid ?? false;
  // `<label for>`는 labelable 요소만 연결하므로 div인 그룹에는 안 걸린다 — Field.Label의
  // id를 직접 참조해야 접근 이름이 생긴다.
  const resolvedLabelledBy = ariaLabelledBy ?? fieldCtx?.labelId;

  const registerItem = segmented ? indicator.registerItem : undefined;
  const contextValue = React.useMemo(
    () => ({
      value: current,
      setValue: selectValue,
      name: name ?? generatedName,
      orientation: resolvedOrientation,
      disabled,
      variant,
      registerItem,
    }),
    [
      current,
      selectValue,
      name,
      generatedName,
      resolvedOrientation,
      disabled,
      variant,
      registerItem,
    ],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={segmented ? mergeRefs(ref, indicator.containerRef) : ref}
        role="radiogroup"
        id={resolvedId}
        aria-orientation={resolvedOrientation}
        aria-labelledby={resolvedLabelledBy}
        aria-describedby={resolvedDescribedBy}
        aria-invalid={resolvedInvalid}
        className={clsx(
          radioGroup({
            variant,
            orientation: resolvedOrientation,
            size: resolvedSize,
          }),
          className,
        )}
        data-motion={pointerMotion ? "" : undefined}
        data-indicator={segmented && indicator.measured ? "" : undefined}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* 측정 전(SSR·jsdom)에는 자리를 못 잡으니 숨어 있고, 그동안은 항목 자체 배경이 fallback이다. */}
        {segmented ? (
          <span className="dds-radio-group__indicator" aria-hidden="true" ref={indicator.indicatorRef} />
        ) : null}
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
RadioGroupRoot.displayName = "RadioGroup.Root";

export interface RadioGroupItemProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "name" | "checked" | "onChange" | "value" | "size"
  > {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, disabled: itemDisabled, children, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext);
    if (!ctx) throw new Error("RadioGroup.Item must be used within RadioGroup.Root");

    const disabled = ctx.disabled || itemDisabled || false;
    const isChecked = ctx.value === value;

    // segmented 배경이 따라갈 대상. value가 바뀌면 콜백 정체성이 바뀌어 옛 등록이 먼저 해제된다.
    const { registerItem } = ctx;
    const labelRef = React.useCallback(
      (node: HTMLLabelElement | null) => registerItem?.(value, node),
      [registerItem, value],
    );

    return (
      <label
        ref={labelRef}
        className={clsx("dds-radio", className)}
        data-state={isChecked ? "checked" : "unchecked"}
      >
        <input
          type="radio"
          ref={ref}
          name={ctx.name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={() => ctx.setValue(value)}
          className="dds-radio__input"
          {...props}
        />
        <span className="dds-radio__box" aria-hidden="true">
          <span className="dds-radio__dot" />
        </span>
        {children != null ? <span className="dds-radio__label">{children}</span> : null}
      </label>
    );
  },
);
RadioGroupItem.displayName = "RadioGroup.Item";

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
