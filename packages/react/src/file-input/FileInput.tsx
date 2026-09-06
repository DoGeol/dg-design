import "./file-input.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

import { FieldContext } from "../field/field-context";
import { FileInputContext, useFileInputContext } from "./file-input-context";
import { validateFiles, type FileRejectReason, type RejectedFile } from "./file-validation";

export type { FileRejectReason, RejectedFile };

export interface FileInputRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** MIME("image/png")·와일드카드("image/*")·확장자(".png") 콤마 구분. 생략 시 전부 허용. */
  accept?: string;
  multiple?: boolean;
  /** 바이트 단위 최대 크기. */
  maxSize?: number;
  /** 한 번의 선택/드롭에서 통과할 수 있는 최대 개수. `multiple`이 아니면 암묵적으로 1. */
  maxFiles?: number;
  disabled?: boolean;
  /** 주면 네이티브 폼 제출에 통과분 파일이 실리도록 hidden input에 name을 붙인다. */
  name?: string;
  /** 통과분과 거부분을 한 번에 받는다 — 거부 사유는 코드뿐, 문구는 소비자 몫. */
  onFilesChange?: (files: File[], rejected: RejectedFile[]) => void;
}

export const FileInputRoot = React.forwardRef<HTMLDivElement, FileInputRootProps>(
  (
    {
      className,
      accept,
      multiple,
      maxSize,
      maxFiles,
      disabled = false,
      name,
      onFilesChange,
      children,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const fieldCtx = React.useContext(FieldContext);
    const generatedId = React.useId();
    const inputId = fieldCtx?.inputId ?? generatedId;

    const onFilesChangeRef = React.useRef(onFilesChange);
    onFilesChangeRef.current = onFilesChange;

    const assignFiles = React.useCallback(
      (fileList: FileList | File[]) => {
        const result = validateFiles(fileList, { accept, maxSize, maxFiles, multiple });

        // hidden input을 통과분으로 동기화 — name 제출·rejected 파일이 폼에 안 실리게 한다.
        // 클릭 선택 경로도 같은 input이라 이 재대입이 그대로 최종 상태가 된다.
        // jsdom(테스트 환경)은 DataTransfer를 구현하지 않는다 — 없으면 동기화만 건너뛴다.
        const el = inputRef.current;
        if (el && typeof DataTransfer !== "undefined") {
          const dt = new DataTransfer();
          for (const file of result.files) dt.items.add(file);
          el.files = dt.files;
        }

        onFilesChangeRef.current?.(result.files, result.rejected);
      },
      [accept, maxSize, maxFiles, multiple],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files) assignFiles(event.currentTarget.files);
    };

    const openFilePicker = React.useCallback(() => {
      if (disabled) return;
      inputRef.current?.click();
    }, [disabled]);

    const contextValue = React.useMemo(
      () => ({
        disabled,
        openFilePicker,
        assignFiles,
        describedBy: fieldCtx?.describedBy,
        invalid: fieldCtx?.invalid ?? false,
      }),
      [disabled, openFilePicker, assignFiles, fieldCtx?.describedBy, fieldCtx?.invalid],
    );

    return (
      <FileInputContext.Provider value={contextValue}>
        <div ref={ref} className={clsx("dds-file-input", className)} {...props}>
          <input
            ref={inputRef}
            type="file"
            id={inputId}
            name={name}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleChange}
            hidden
          />
          {children}
        </div>
      </FileInputContext.Provider>
    );
  },
);
FileInputRoot.displayName = "FileInput.Root";

export interface FileInputDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FileInputDropzone = React.forwardRef<HTMLDivElement, FileInputDropzoneProps>(
  (
    { className, onClick, onKeyDown, onDragEnter, onDragOver, onDragLeave, onDrop, ...props },
    ref,
  ) => {
    const ctx = useFileInputContext("FileInput.Dropzone");
    // enter/leave는 자식 요소를 넘나들 때도 각각 한 번씩 뜬다 — 카운터로 세지 않으면
    // 자식 진입 시 leave가 먼저 잡혀 data-dragging이 깜빡인다.
    const dragCounter = React.useRef(0);
    const [dragging, setDragging] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      ctx.openFilePicker();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        ctx.openFilePicker();
      }
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
      onDragEnter?.(event);
      if (ctx.disabled) return;
      event.preventDefault();
      dragCounter.current += 1;
      setDragging(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      onDragOver?.(event);
      if (ctx.disabled) return;
      event.preventDefault();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      onDragLeave?.(event);
      if (ctx.disabled) return;
      dragCounter.current = Math.max(0, dragCounter.current - 1);
      if (dragCounter.current === 0) setDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      onDrop?.(event);
      // preventDefault는 disabled와 무관하게 항상 — 안 하면 브라우저가 드롭된 파일을
      // 새 페이지로 열어버린다. disabled는 그다음 실질 처리만 막는다("드롭 무시").
      event.preventDefault();
      dragCounter.current = 0;
      setDragging(false);
      if (ctx.disabled) return;
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) ctx.assignFiles(files);
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={ctx.disabled ? -1 : 0}
        aria-disabled={ctx.disabled || undefined}
        aria-describedby={ctx.describedBy}
        aria-invalid={ctx.invalid || undefined}
        data-dragging={dragging || undefined}
        data-disabled={ctx.disabled || undefined}
        className={clsx("dds-file-input__dropzone", className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      />
    );
  },
);
FileInputDropzone.displayName = "FileInput.Dropzone";

export interface FileInputTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 자식 요소에 동작만 얹는다(예: DDS Button을 트리거로). */
  asChild?: boolean;
}

export const FileInputTrigger = React.forwardRef<HTMLButtonElement, FileInputTriggerProps>(
  ({ className, asChild, onClick, ...props }, ref) => {
    const ctx = useFileInputContext("FileInput.Trigger");
    const Comp = asChild ? Slot : "button";

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      ctx.openFilePicker();
    };

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        // asChild로 버튼 아닌 요소(a 등)를 감싸도 disabled·[disabled] CSS 매칭이 그대로
        // 걸리도록 asChild 여부와 무관하게 둘 다 넣는다(Button.tsx와 동형).
        disabled={ctx.disabled}
        aria-disabled={ctx.disabled || undefined}
        aria-describedby={ctx.describedBy}
        aria-invalid={ctx.invalid || undefined}
        data-disabled={ctx.disabled || undefined}
        className={clsx("dds-file-input__trigger", className)}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
FileInputTrigger.displayName = "FileInput.Trigger";

export interface FileInputPreviewProps extends React.HTMLAttributes<HTMLDivElement> {}

/** 슬롯 — 이미지·파일명은 소비자가 채운다. Root 밖에서도 클래스만 붙는다. */
export const FileInputPreview = React.forwardRef<HTMLDivElement, FileInputPreviewProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={clsx("dds-file-input__preview", className)} {...props} />;
  },
);
FileInputPreview.displayName = "FileInput.Preview";

export interface FileInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

/** 가로 flex 슬롯 — 교체·제거 버튼 자리. Root 밖에서도 클래스만 붙는다. */
export const FileInputActions = React.forwardRef<HTMLDivElement, FileInputActionsProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={clsx("dds-file-input__actions", className)} {...props} />;
  },
);
FileInputActions.displayName = "FileInput.Actions";

/**
 * compound: FileInput.Root(hidden input+검증) / Dropzone(드래그+키보드) / Trigger(asChild) /
 * Preview·Actions(슬롯, context 없음). 업로드 진행·objectURL·미리보기 생성은 소비자 몫.
 */
export const FileInput = {
  Root: FileInputRoot,
  Dropzone: FileInputDropzone,
  Trigger: FileInputTrigger,
  Preview: FileInputPreview,
  Actions: FileInputActions,
};
