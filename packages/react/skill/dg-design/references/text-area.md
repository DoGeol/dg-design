<!-- 생성 파일 — packages/react/skill-src/text-area.tsx에서 만든다. 직접 고치지 않는다. -->

# TextArea

여러 줄 텍스트 입력. 자동 높이 조절(autoResize)과 글자 수 표시(showCount)를 지원한다.

## 언제 쓰나

- 메모, 설명, 댓글처럼 길어질 수 있는 입력.
- 글자 수 제한이 있으면 `maxLength` + `showCount`.
- 모바일 밀도 앱은 `variant="box"|"line"`.

## 쓰지 말 때

- 한 줄 입력은 `TextField`.
- 서식(굵게·링크 등)이 필요한 편집은 리치 텍스트 에디터를 따로 쓴다.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `size` | `xsmall` · `medium`(기본) · `large` | `small`은 없다. `xsmall`은 한 줄 높이 28, 모바일 밀도에서는 `medium` |
| `variant` | `outline`(기본) · `box` · `line` | `box`·`line`은 `[data-dds-density="mobile"]` 안에서만 적용된다 |
| `autoResize` | boolean | 입력량에 따라 높이가 늘어난다. `rows`가 최소 줄 수. 기본은 `rows` 높이 고정 + 넘치면 스크롤 |
| `resizable` | boolean | 세로 손잡이. 기본 꺼짐(react 0.24.0부터). autoResize와 함께 주면 autoResize가 이긴다 |
| `maxRows` | number | 최대 줄 수. autoResize 확장·손잡이 드래그 모두 여기서 멈추고 넘치면 스크롤 |
| `showCount` | boolean | 글자 수 표시. `maxLength`가 있으면 "현재/최대". 켜면 wrapper가 생긴다 |
| `value`·`defaultValue`·`onChange`·`rows`·`maxLength`·`name`·`disabled`·`readOnly` | textarea 표준 | |

## 접근성

- `Field.Root` 안에 두면 라벨·설명·오류가 자동 연결된다. 밖에서는 `aria-label`.
- 오류는 `Field.ErrorMessage`를 렌더하면 켜진다.
- `showCount`의 글자 수는 보조 정보다. 제한 안내는 `Field.Description`에도 적는다.

## 예제

```tsx
import { Field } from "@dg-design/react/field";
import { TextArea } from "@dg-design/react/text-area";
import * as React from "react";

/** 글자 수 제한 + 오류 (controlled) */
export function WithCountAndError() {
  const [note, setNote] = React.useState("");
  return (
    <Field.Root>
      <Field.Label>메모</Field.Label>
      <TextArea
        name="note"
        rows={4}
        maxLength={200}
        showCount
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Field.Description>최대 200자까지 입력할 수 있습니다.</Field.Description>
      {note.trim() === "" ? <Field.ErrorMessage>메모를 입력해 주세요.</Field.ErrorMessage> : null}
    </Field.Root>
  );
}

/** 입력량에 따라 높이가 늘어나는 uncontrolled 입력 */
export function AutoResize() {
  return (
    <Field.Root>
      <Field.Label>댓글</Field.Label>
      <TextArea autoResize rows={2} maxRows={6} placeholder="댓글을 남겨 보세요" />
    </Field.Root>
  );
}

/** 모바일 밀도 — box·line은 mobile 스코프 안에서만 적용 */
export function MobileVariants() {
  return (
    <div
      data-dds-density="mobile"
      style={{ display: "flex", flexDirection: "column", gap: "var(--dds-space-field-gap)" }}
    >
      <Field.Root>
        <Field.Label>상세 내용</Field.Label>
        <TextArea variant="box" rows={3} />
      </Field.Root>
      <Field.Root>
        <Field.Label>비고</Field.Label>
        <TextArea variant="line" rows={2} />
      </Field.Root>
    </div>
  );
}
```
