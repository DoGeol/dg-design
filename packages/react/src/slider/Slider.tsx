import "./slider.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";
import { mergeRefs } from "../internal/merge-refs";

const slider = cva("dds-slider", {
  variants: {
    size: {
      small: "dds-slider--size_small",
      medium: "dds-slider--size_medium",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof slider> {}

function calculateFillPercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  const clamped = Math.min(Math.max(value, min), max);
  const percent = ((clamped - min) / (max - min)) * 100;
  return Number.isFinite(percent) ? percent : 0;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      size,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onChange,
      onInput,
      id,
      style,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const minVal = Number(min);
    const maxVal = Number(max);

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<number>(() => {
      if (defaultValue !== undefined) return Number(defaultValue);
      return (minVal + maxVal) / 2;
    });

    // 브라우저는 값을 step·범위에 맞춰 고치고(defaultValue 7·step 5 → 5) form reset으로도 되돌린다 —
    // 채움은 prop이 아니라 input의 실제 값을 따른다.
    const innerRef = React.useRef<HTMLInputElement>(null);
    const setRef = React.useMemo(() => mergeRefs(ref, innerRef), [ref]);
    React.useEffect(() => {
      const input = innerRef.current;
      if (isControlled || !input) return;
      const sync = () => setUncontrolledValue(input.valueAsNumber);
      sync();
      const form = input.form;
      if (!form) return;
      // reset 이벤트는 값이 되돌려지기 전에 온다 — 한 틱 뒤에 읽는다.
      let timer: ReturnType<typeof setTimeout> | undefined;
      const reset = () => {
        timer = setTimeout(sync);
      };
      form.addEventListener("reset", reset);
      return () => {
        form.removeEventListener("reset", reset);
        clearTimeout(timer);
      };
    }, [isControlled]);

    const currentValue = isControlled ? Number(value) : uncontrolledValue;
    const fillPercent = calculateFillPercent(currentValue, minVal, maxVal);

    const handleInput: React.InputEventHandler<HTMLInputElement> = (event) => {
      onInput?.(event);
      if (!isControlled) {
        setUncontrolledValue(Number(event.currentTarget.value));
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (!isControlled) {
        setUncontrolledValue(Number(event.currentTarget.value));
      }
    };

    // Field.Root 안이면 context에서 id·invalid·describedby를 받는다.
    const fieldCtx = React.useContext(FieldContext);
    const generatedId = React.useId();

    const resolvedId = id ?? fieldCtx?.inputId ?? generatedId;
    const resolvedDescribedBy =
      [fieldCtx?.describedBy, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
    const resolvedInvalid = ariaInvalid ?? fieldCtx?.invalid ?? false;

    const mergedStyle: React.CSSProperties = {
      ...style,
      ["--dds-slider-fill" as string]: `${fillPercent}%`,
    };

    return (
      <input
        type="range"
        ref={setRef}
        id={resolvedId}
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue}
        aria-describedby={resolvedDescribedBy}
        aria-invalid={resolvedInvalid}
        className={clsx(slider({ size }), className)}
        style={mergedStyle}
        onInput={handleInput}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
Slider.displayName = "Slider";
