import "./code-block.css";

import clsx from "clsx";
import * as React from "react";

import { CheckIcon } from "../icon/check-icon";
import { CopyIcon } from "../icon/copy-icon";

export type CopyStatus = "idle" | "pending" | "copied" | "error";

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onCopy"> {
  /** 복사할 텍스트 문자열 */
  text: string;
  /** 복사 완료 시 콜백 */
  onCopy?: (success: boolean) => void;
  /** 복사 버튼 레이블을 대체할 커스텀 자식 (기본: "복사" / "복사됨") */
  children?: React.ReactNode;
}

/**
 * 단독 및 블록 헤더에 사용할 수 있는 접근성 준수 복사 버튼.
 * role="status" 실시간 영역과 연결되어 합쇼체 피드백을 전달합니다.
 */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      text,
      onCopy,
      children,
      className,
      disabled = false,
      "aria-label": ariaLabelProp,
      ...rest
    },
    ref,
  ) => {
    const [status, setStatus] = React.useState<CopyStatus>("idle");
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    const feedbackId = React.useId();

    React.useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    const handleCopy = async () => {
      if (status === "pending" || disabled) {
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setStatus("pending");

      try {
        await navigator.clipboard.writeText(text);
        setStatus("copied");
        onCopy?.(true);
        timerRef.current = setTimeout(() => {
          setStatus("idle");
        }, 2000);
      } catch {
        setStatus("error");
        onCopy?.(false);
        timerRef.current = setTimeout(() => {
          setStatus("idle");
        }, 4000);
      }
    };

    const feedbackMessage =
      status === "copied"
        ? "코드를 복사했습니다."
        : status === "error"
          ? "복사하지 못했습니다. 코드를 선택해 직접 복사하십시오."
          : "";

    const resolvedAriaLabel =
      status === "copied" ? "복사됨" : (ariaLabelProp ?? "코드 복사");

    return (
      <>
        <button
          {...rest}
          ref={ref}
          type="button"
          className={clsx("dds-copy-button", className)}
          disabled={disabled || status === "pending"}
          aria-label={resolvedAriaLabel}
          aria-describedby={feedbackId}
          onClick={handleCopy}
          data-status={status}
        >
          <span className="dds-copy-button__icon" aria-hidden="true">
            {status === "copied" ? (
              <CheckIcon size={16} />
            ) : (
              <CopyIcon size={16} />
            )}
          </span>
          <span className="dds-copy-button__text">
            {children ?? (status === "copied" ? "복사됨" : "복사")}
          </span>
        </button>
        <span
          id={feedbackId}
          className="dds-code-block__sr-only"
          role="status"
          aria-atomic="true"
        >
          {feedbackMessage}
        </span>
      </>
    );
  },
);

CopyButton.displayName = "CopyButton";

export interface CodeBlockProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onCopy"> {
  /** 하이라이트된 pre/code 엘리먼트 또는 평문 텍스트 */
  children: React.ReactNode;
  /** 상단 헤더에 표시할 파일명 */
  filename?: string;
  /** 복사 버튼 표시 여부 (기본 true) */
  copyable?: boolean;
  /** 복사할 원본 문자열 (생략 시 children이 단일 문자열일 때 자동 추출) */
  copyText?: string;
  /** 코드 스크롤 영역의 접근 이름 (생략 시 filename 기준 자동 생성) */
  label?: string;
  /** 복사 완료 시 콜백 */
  onCopy?: (success: boolean) => void;
}

/**
 * 가로 스크롤 가능한 코드 블록 영역과 상단 파일명 및 복사 기능을 제공하는 컴포넌트.
 */
export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      children,
      filename,
      copyable = true,
      copyText,
      label,
      onCopy,
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedCopyText =
      copyText ??
      (typeof children === "string"
        ? children
        : typeof children === "number"
          ? String(children)
          : "");

    if (
      copyable &&
      copyText === undefined &&
      typeof children !== "string" &&
      typeof children !== "number"
    ) {
      console.warn(
        "CodeBlock: `copyText`가 지정되지 않았고 children이 문자열이 아닙니다. 복사할 문자열을 `copyText` prop으로 지정해 주십시오.",
      );
    }

    const resolvedLabel = label ?? (filename ? `${filename} 코드` : "코드");
    const showHeader = Boolean(filename || copyable);

    const isPrimitiveChild =
      typeof children === "string" || typeof children === "number";

    return (
      <div {...rest} ref={ref} className={clsx("dds-code-block", className)}>
        {showHeader ? (
          <div
            className={clsx(
              "dds-code-block__header",
              !filename && "dds-code-block__header--copy-only",
            )}
          >
            {filename ? (
              <span className="dds-code-block__filename">{filename}</span>
            ) : null}
            {copyable ? (
              <CopyButton
                text={resolvedCopyText}
                onCopy={onCopy}
                className="dds-code-block__copy-button"
              />
            ) : null}
          </div>
        ) : null}
        <div
          className="dds-code-block__content"
          tabIndex={0}
          role="region"
          aria-label={resolvedLabel}
        >
          {isPrimitiveChild ? (
            <pre className="dds-code-block__pre">
              <code>{children}</code>
            </pre>
          ) : (
            children
          )}
        </div>
      </div>
    );
  },
) as React.ForwardRefExoticComponent<
  CodeBlockProps & React.RefAttributes<HTMLDivElement>
> & {
  CopyButton: typeof CopyButton;
};

CodeBlock.displayName = "CodeBlock";
CodeBlock.CopyButton = CopyButton;
