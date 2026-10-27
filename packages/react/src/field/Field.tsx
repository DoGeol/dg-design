import "./field.css";

import clsx from "clsx";
import * as React from "react";

import { FieldContext, type FieldContextValue } from "./field-context";

/** 기본 조합은 서버 렌더에서도 사용자 라벨 id를 바로 전달한다. */
function findLabelId(children: React.ReactNode): string | undefined {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{ id?: string; children?: React.ReactNode }>(child)) continue;
    if (child.type === FieldLabel && child.props.id) return child.props.id;
    if (child.type === React.Fragment) {
      const nested = findLabelId(child.props.children);
      if (nested) return nested;
    }
  }
  return undefined;
}

export interface FieldRootProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, children, ...props }, ref) => {
    const baseId = React.useId();
    const inputId = `${baseId}-input`;
    const defaultLabelId = `${baseId}-label`;
    const [customLabelId, setCustomLabelId] = React.useState<string>();
    const labelId = customLabelId ?? findLabelId(children) ?? defaultLabelId;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;

    // description·error id는 실제로 마운트된 것만 담는다 (렌더 안 된 것은 aria-describedby에 안 나감).
    // id와 종류를 함께 보관하므로 사용자 지정 error id도 invalid 판정에 반영된다.
    const [registeredIds, setRegisteredIds] = React.useState<
      ReadonlyMap<string, "description" | "error">
    >(() => new Map());

    const register = React.useCallback((id: string, kind: "description" | "error") => {
      setRegisteredIds((prev) => new Map(prev).set(id, kind));
      return () => {
        setRegisteredIds((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      };
    }, []);

    const describedBy = registeredIds.size > 0 ? Array.from(registeredIds.keys()).join(" ") : undefined;
    const invalid = Array.from(registeredIds.values()).includes("error");

    const value = React.useMemo<FieldContextValue>(
      () => ({ inputId, labelId, defaultLabelId, setCustomLabelId, descriptionId, errorId, describedBy, invalid, register }),
      [inputId, labelId, defaultLabelId, descriptionId, errorId, describedBy, invalid, register],
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

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, htmlFor, id, ...props }, ref) => {
    const ctx = React.useContext(FieldContext);
    const setCustomLabelId = ctx?.setCustomLabelId;
    React.useEffect(() => {
      if (!setCustomLabelId || !id) return;
      setCustomLabelId(id);
      return () => setCustomLabelId((current) => current === id ? undefined : current);
    }, [id, setCustomLabelId]);
    return (
      <label
        ref={ref}
        id={id ?? ctx?.defaultLabelId}
        htmlFor={htmlFor ?? ctx?.inputId}
        className={clsx("dds-field__label", className)}
        {...props}
      />
    );
  },
);
FieldLabel.displayName = "Field.Label";

export interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const ctx = React.useContext(FieldContext);
    const resolvedId = id ?? ctx?.descriptionId;
    const register = ctx?.register;

    React.useEffect(() => {
      if (!register || !resolvedId) return;
      return register(resolvedId, "description");
    }, [register, resolvedId]);

    return (
      <p ref={ref} id={resolvedId} className={clsx("dds-field__description", className)} {...props} />
    );
  },
);
FieldDescription.displayName = "Field.Description";

export interface FieldErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FieldErrorMessage = React.forwardRef<HTMLParagraphElement, FieldErrorMessageProps>(
  ({ className, id, role = "alert", ...props }, ref) => {
    const ctx = React.useContext(FieldContext);
    const resolvedId = id ?? ctx?.errorId;
    const register = ctx?.register;

    React.useEffect(() => {
      if (!register || !resolvedId) return;
      return register(resolvedId, "error");
    }, [register, resolvedId]);

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
