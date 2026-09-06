import * as React from "react";

export interface FileInputContextValue {
  disabled: boolean;
  /** Dropzone/Trigger가 클릭·Enter·Space에서 호출 — disabled면 내부에서 무시한다. */
  openFilePicker: () => void;
  /** 드롭으로 받은 FileList를 Root의 검증 파이프라인에 태운다(클릭 선택과 같은 경로). */
  assignFiles: (fileList: FileList | File[]) => void;
  /** Field.Root 안이면 등록된 Description·ErrorMessage id. */
  describedBy: string | undefined;
  /** Field.ErrorMessage가 마운트돼 있으면 true. */
  invalid: boolean;
}

export const FileInputContext = React.createContext<FileInputContextValue | undefined>(undefined);

export function useFileInputContext(component: string): FileInputContextValue {
  const context = React.useContext(FileInputContext);
  if (!context) throw new Error(`${component}은 FileInput.Root 안에서만 쓸 수 있다.`);
  return context;
}
