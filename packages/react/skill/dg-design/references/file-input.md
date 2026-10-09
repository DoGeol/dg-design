<!-- 생성 파일 — packages/react/skill-src/file-input.tsx에서 만든다. 직접 고치지 않는다. -->

# FileInput

파일 선택·드래그 앤 드롭 입력. 형식·크기·개수 검증을 하고 통과분과 거부분을 함께 알려 준다.

## 언제 쓰나

- 첨부 파일, 프로필 이미지 업로드.
- 끌어놓기 영역은 `FileInput.Dropzone`, 버튼 하나면 `FileInput.Trigger`.
- 제출 폼에 실으려면 `name`을 준다.

## 쓰지 말 때

- 업로드 진행률·미리보기 생성은 컴포넌트가 하지 않는다 — 소비자가 `Progress` 등으로 직접 그린다.
- 텍스트 값 입력은 `TextField`.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `FileInput.Root` | `accept`·`multiple`·`maxSize`(바이트)·`maxFiles`·`disabled`·`name`·`resetKey` | `multiple`이 아니면 한 개 |
| `FileInput.Root` | `onFilesChange(files, rejected)` | `rejected[].reason`은 `type`·`size`·`count` 코드뿐. 문구는 소비자가 쓴다 |
| `FileInput.Dropzone` | — | 클릭·Enter·Space로 선택창을 열고 드롭을 받는다 |
| `FileInput.Trigger` | `asChild` | 버튼. `asChild`로 `Button`에 동작만 얹는다 |
| `FileInput.Preview` · `FileInput.Actions` | — | 슬롯. 내용은 소비자 몫 |

## 접근성

- `Field.Root` 안에서는 설명·오류가 Dropzone·Trigger에 `aria-describedby`·`aria-invalid`로 연결된다. `Field.Label`은 숨은 file input을 가리키므로 Dropzone·Trigger의 이름은 그 안의 텍스트다 — 텍스트에 무엇을 고르는지 적는다. 거부 사유는 `Field.ErrorMessage`로 보여 준다.
- Dropzone은 `role="button"`이고 키보드로 열 수 있다. 허용 형식·크기는 `Field.Description`에 적는다.
- 같은 파일을 다시 고르려면 `resetKey`를 바꿔 내부 입력을 초기화한다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import { Field } from "@dg-design/react/field";
import { FileInput, type RejectedFile } from "@dg-design/react/file-input";
import * as React from "react";

const reasonText = { type: "허용되지 않는 형식", size: "크기 초과", count: "개수 초과" } as const;

/** Dropzone + 검증 + 거부 사유 표시 */
export function ImageDropzone() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [rejected, setRejected] = React.useState<RejectedFile[]>([]);
  return (
    <Field.Root>
      <Field.Label>첨부 이미지</Field.Label>
      <FileInput.Root
        name="attachments"
        accept="image/*"
        multiple
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        onFilesChange={(accepted, rej) => {
          setFiles(accepted);
          setRejected(rej);
        }}
      >
        <FileInput.Dropzone>파일 선택 또는 끌어놓기</FileInput.Dropzone>
        <FileInput.Preview>
          {files.map((file) => (
            <span key={file.name}>{file.name} </span>
          ))}
        </FileInput.Preview>
      </FileInput.Root>
      <Field.Description>이미지 최대 3개, 파일당 5MB까지.</Field.Description>
      {rejected.length > 0 ? (
        <Field.ErrorMessage>
          {rejected.map((r) => `${r.file.name}: ${reasonText[r.reason]}`).join(", ")}
        </Field.ErrorMessage>
      ) : null}
    </Field.Root>
  );
}

/** 버튼 트리거 — DDS Button에 동작만 얹기 */
export function ButtonTrigger() {
  const [name, setName] = React.useState<string>();
  return (
    <FileInput.Root accept=".pdf" onFilesChange={(accepted) => setName(accepted[0]?.name)}>
      <FileInput.Actions>
        <FileInput.Trigger asChild>
          <Button intent="neutral" variant="weak">
            PDF 선택
          </Button>
        </FileInput.Trigger>
      </FileInput.Actions>
      <FileInput.Preview>{name ?? "선택된 파일 없음"}</FileInput.Preview>
    </FileInput.Root>
  );
}

/** 선택 초기화 — resetKey를 바꾼다 */
export function Resettable() {
  const [resetKey, setResetKey] = React.useState(0);
  const [count, setCount] = React.useState(0);
  return (
    <FileInput.Root resetKey={resetKey} onFilesChange={(accepted) => setCount(accepted.length)}>
      <FileInput.Dropzone>파일 선택 ({count}개)</FileInput.Dropzone>
      <FileInput.Actions>
        <Button
          type="button"
          intent="neutral"
          variant="ghost"
          size="small"
          onClick={() => {
            setResetKey((k) => k + 1);
            setCount(0);
          }}
        >
          지우기
        </Button>
      </FileInput.Actions>
    </FileInput.Root>
  );
}
```
