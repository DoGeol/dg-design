import "./field.css";

import clsx from "clsx";
import * as React from "react";

import { FieldContext, type FieldContextValue } from "./field-context";

export interface FieldRootProps extends React.HTMLAttributes<HTMLDivElement> {}

const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, children, ...props }, ref) => {
    const baseId = React.useId();
    const inputId = `${baseId}-input`;
    const labelId = `${baseId}-label`;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;

    // description·error id는 실제로 마운트된 것만 담는다 (렌더 안 된 것은 aria-describedby에 안 나감).
    // Set이라 StrictMode의 effect 이중 실행(mount→unmount→mount)에도 최종 상태가 안정적이다.
    const [registeredIds, setRegisteredIds] = React.useState<ReadonlySet<string>>(
      () => new Set(),
    );

    const register = React.useCallback((id: string) => {
      setRegisteredIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
      return () => {
        setRegisteredIds((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      };
    }, []);

    const describedBy = registeredIds.size > 0 ? Array.from(registeredIds).join(" ") : undefined;
    const invalid = registeredIds.has(errorId);

    const value = React.useMemo<FieldContextValue>(
      () => ({ inputId, labelId, descriptionId, errorId, describedBy, invalid, register }),
      [inputId, labelId, descriptionId, errorId, describedBy, invalid, register],
    );

    return (
      <FieldContext.Provider value={value}>
        <div ref={ref} className={clsx("dds-field", className)} {...props}>
          {children}
        </div>
      </FieldContext.Provider>
    );
  },
);
FieldRoot.displayName = "Field.Root";

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, htmlFor, id, ...props }, ref) => {
    const ctx = React.useContext(FieldContext);
    return (
      <label
        ref={ref}
        id={id ?? ctx?.labelId}
        htmlFor={htmlFor ?? ctx?.inputId}
        className={clsx("dds-field__label", className)}
        {...props}
      />
    );
  },
);
FieldLabel.displayName = "Field.Label";

export interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const ctx = React.useContext(FieldContext);
    const resolvedId = id ?? ctx?.descriptionId;

    React.useEffect(() => {
      if (!ctx || !resolvedId) return;
      return ctx.register(resolvedId);
    }, [ctx, resolvedId]);

    return (
      <p ref={ref} id={resolvedId} className={clsx("dds-field__description", className)} {...props} />
    );
  },
);
FieldDescription.displayName = "Field.Description";

export interface FieldErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FieldErrorMessage = React.forwardRef<HTMLParagraphElement, FieldErrorMessageProps>(
  ({ className, id, role = "alert", ...props }, ref) => {
    const ctx = React.useContext(FieldContext);
    const resolvedId = id ?? ctx?.errorId;

    React.useEffect(() => {
      if (!ctx || !resolvedId) return;
      return ctx.register(resolvedId);
    }, [ctx, resolvedId]);

    return (
      <p
        ref={ref}
        id={resolvedId}
        role={role}
        className={clsx("dds-field__error-message", className)}
        {...props}
      />
    );
  },
);
FieldErrorMessage.displayName = "Field.ErrorMessage";

/**
 * compound: Field.Root/Label/Description/ErrorMessage.
 * Root가 id·invalid·describedby를 context로 전파 — 실제 렌더된 서브컴포넌트만
 * aria-describedby에 반영된다. role="alert"는 표준 관행(암묵적 aria-live=assertive)이라
 * 별도 aria-live를 얹지 않는다.
 */
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  ErrorMessage: FieldErrorMessage,
};
