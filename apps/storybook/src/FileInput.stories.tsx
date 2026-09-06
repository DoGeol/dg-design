import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, FileInput } from "@dg-design/react";
import * as React from "react";

// MultiSelect·Select와 같은 이유로 component를 지정하지 않는다 — barrel엔 FileInput 객체
// 하나뿐이라 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "FileInput",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

function MatrixCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      <span style={{ font: "500 12px sans-serif", color: "#666" }}>{label}</span>
      {children}
    </div>
  );
}

const dropzoneBody = (
  <>
    <span style={{ fontSize: 24 }}>📎</span>
    <span>파일을 끌어다 놓거나 클릭하세요</span>
  </>
);

/**
 * 기본·dragging·disabled·invalid 4칸. dragging은 실제 드래그 이벤트 대신 `data-dragging`을
 * prop으로 강제한다 — Dropzone은 `{...props}`가 내부 계산값 뒤에 와 소비자 값이 이긴다.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", gap: 24, padding: 24, flexWrap: "wrap" }}>
      <MatrixCell label="기본">
        <FileInput.Root>
          <FileInput.Dropzone>{dropzoneBody}</FileInput.Dropzone>
        </FileInput.Root>
      </MatrixCell>

      <MatrixCell label="dragging (강제)">
        <FileInput.Root>
          <FileInput.Dropzone data-dragging>{dropzoneBody}</FileInput.Dropzone>
        </FileInput.Root>
      </MatrixCell>

      <MatrixCell label="disabled">
        <FileInput.Root disabled>
          <FileInput.Dropzone>{dropzoneBody}</FileInput.Dropzone>
        </FileInput.Root>
      </MatrixCell>

      <MatrixCell label="invalid (Field)">
        <Field.Root>
          <FileInput.Root accept="image/png">
            <FileInput.Dropzone>{dropzoneBody}</FileInput.Dropzone>
          </FileInput.Root>
          <Field.ErrorMessage>PNG 파일만 업로드할 수 있습니다.</Field.ErrorMessage>
        </Field.Root>
      </MatrixCell>
    </div>
  ),
};

function CoverFieldDemo() {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Field.Root>
      <Field.Label>대표 이미지</Field.Label>
      <FileInput.Root
        accept="image/png,image/jpeg"
        maxSize={5 * 1024 * 1024}
        onFilesChange={(files, rejected) => {
          if (files[0]) {
            setFile(files[0]);
            setError(null);
          }
          if (rejected.length > 0) {
            setError(
              rejected[0]?.reason === "size" ? "파일 용량이 너무 큽니다." : "PNG·JPEG만 지원합니다.",
            );
          }
        }}
      >
        <FileInput.Trigger asChild>
          <Button variant="weak" intent="neutral">
            이미지 선택
          </Button>
        </FileInput.Trigger>
        <FileInput.Preview>{file ? <span>{file.name}</span> : <span>선택된 파일 없음</span>}</FileInput.Preview>
        <FileInput.Actions>
          {file ? (
            <Button
              variant="ghost"
              intent="critical"
              onClick={() => setFile(null)}
              type="button"
            >
              제거
            </Button>
          ) : null}
        </FileInput.Actions>
      </FileInput.Root>
      <Field.Description>PNG·JPEG, 5MB 이하.</Field.Description>
      {error ? <Field.ErrorMessage>{error}</Field.ErrorMessage> : null}
    </Field.Root>
  );
}

function DropzoneDemo() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <Field.Root>
      <Field.Label>첨부 파일</Field.Label>
      <FileInput.Root multiple maxFiles={3} onFilesChange={(passed) => setFiles(passed)}>
        <FileInput.Dropzone>{dropzoneBody}</FileInput.Dropzone>
        <FileInput.Preview>
          {files.length === 0 ? (
            <span>선택된 파일 없음</span>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {files.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          )}
        </FileInput.Preview>
      </FileInput.Root>
      <Field.Description>최대 3개까지 끌어다 놓을 수 있습니다.</Field.Description>
    </Field.Root>
  );
}

/**
 * 기능 테스트(Playwright)가 쓰는 데모. 두 형태를 나란히 둔다 —
 * Trigger만 쓰는 cover-field 형태(dg-studio 대표 이미지)와 Dropzone 형태.
 * 오버레이가 없는 컴포넌트라 "닫힌 상태" 이슈는 없지만 두 폼 다 빈 상태로 시작한다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 24, flexWrap: "wrap" }}>
      <div style={{ width: 280 }}>
        <CoverFieldDemo />
      </div>
      <div style={{ width: 280 }}>
        <DropzoneDemo />
      </div>
    </div>
  ),
};
