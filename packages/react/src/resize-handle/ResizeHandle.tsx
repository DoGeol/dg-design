import "./resize-handle.css";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import {
  type UseResizeHandleOptions,
  type UseResizeHandleReturn,
  useResizeHandle,
} from "./use-resize-handle";

const resizeHandle = cva("dds-resize-handle", {
  variants: {
    orientation: {
      vertical: "dds-resize-handle--orientation_vertical",
      horizontal: "dds-resize-handle--orientation_horizontal",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface ResizeHandleProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "value" | "defaultValue" | "onChange" | "onReset"
    >,
    UseResizeHandleOptions {
  /** 정적 렌더링 또는 외부 제어용 드래깅 상태 속성 */
  "data-dragging"?: boolean | string;
}

export const ResizeHandle = React.forwardRef<HTMLDivElement, ResizeHandleProps>(
  (
    {
      className,
      orientation = "vertical",
      value,
      min,
      max,
      step = 1,
      onValueChange,
      onReset,
      disabled = false,
      style,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onDoubleClick,
      onKeyDown,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "data-dragging": controlledDragging,
      ...props
    },
    ref,
  ) => {
    const { handleProps, isDragging } = useResizeHandle({
      orientation,
      value,
      min,
      max,
      step,
      onValueChange,
      onReset,
      disabled,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    });

    const draggingAttr = controlledDragging !== undefined ? controlledDragging : isDragging ? "" : undefined;

    return (
      <div
        ref={ref}
        {...props}
        {...handleProps}
        data-dragging={draggingAttr}
        className={clsx(resizeHandle({ orientation }), className)}
        style={style}
        onPointerDown={(event) => {
          handleProps.onPointerDown?.(event);
          onPointerDown?.(event);
        }}
        onPointerMove={(event) => {
          handleProps.onPointerMove?.(event);
          onPointerMove?.(event);
        }}
        onPointerUp={(event) => {
          handleProps.onPointerUp?.(event);
          onPointerUp?.(event);
        }}
        onPointerCancel={(event) => {
          handleProps.onPointerCancel?.(event);
          onPointerCancel?.(event);
        }}
        onDoubleClick={(event) => {
          handleProps.onDoubleClick?.(event);
          onDoubleClick?.(event);
        }}
        onKeyDown={(event) => {
          handleProps.onKeyDown?.(event);
          onKeyDown?.(event);
        }}
      />
    );
  },
);

ResizeHandle.displayName = "ResizeHandle";

export { useResizeHandle, type UseResizeHandleOptions, type UseResizeHandleReturn };
