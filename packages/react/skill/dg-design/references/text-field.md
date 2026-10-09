<!-- 생성 파일 — packages/react/skill-src/text-field.tsx에서 만든다. 직접 고치지 않는다. -->

# TextField

한 줄 텍스트 입력. 이메일·비밀번호·검색·숫자 등 type과 앞뒤 장식(prefix·suffix)을 지원한다.

## 언제 쓰나

- 이름, 이메일, 검색어, 금액 같은 한 줄 입력.
- 단위·아이콘이 붙는 입력은 `prefix`·`suffix`.
- 모바일 밀도 앱은 `variant="box"|"line"`으로 모양을 바꾼다.

## 쓰지 말 때

- 여러 줄 입력은 `TextArea`.
- 정해진 목록에서 고르기는 `Select`, 날짜는 `DatePicker`.
- 파일은 `FileInput`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `type` | `text`(기본) · `email` · `password` · `tel` · `url` · `search` · `number` | |
| `size` | `xsmall`(28) · `medium`(기본) · `large` | `small`은 없다. `xsmall`은 데스크톱 표 툴바·필터 줄에서 Button `xsmall`(28) 옆에 둔다. 모바일 밀도에서는 `medium`으로 그린다(16px 미만 입력은 iOS가 확대) |
| `variant` | `outline`(기본) · `box` · `line` | `box`·`line`은 `[data-dds-density="mobile"]` 안에서만 적용된다 |
| `prefix`·`suffix` | ReactNode | 둘 중 하나라도 있으면 wrapper가 생기고 `className`은 wrapper에 붙는다 |
| `value`·`defaultValue`·`onChange`·`name`·`placeholder`·`disabled`·`readOnly` | input 표준 | |

## 접근성

- `Field.Root` 안에 두면 `Field.Label`·설명·오류가 자동 연결된다. Field 밖에서는 `aria-label`을 준다.
- 오류는 `Field.ErrorMessage`를 렌더하면 켜진다(`aria-invalid` 자동). placeholder는 라벨을 대신하지 못한다.
- `prefix`·`suffix`가 아이콘이면 `aria-hidden`, 단위 텍스트면 라벨이나 설명에도 단위를 적는다.

## 예제

```tsx
import { Field } from "@dg-design/react/field";
import { TextField } from "@dg-design/react/text-field";
import * as React from "react";

/** Field 안의 기본 입력 — controlled, 오류 표시 */
export function WithFieldError() {
  const [email, setEmail] = React.useState("");
  const invalid = email.length > 0 && !email.includes("@");
  return (
    <Field.Root>
      <Field.Label>이메일</Field.Label>
      <TextField
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
      />
      <Field.Description>알림을 받을 주소입니다.</Field.Description>
      {invalid ? <Field.ErrorMessage>올바른 이메일 형식이 아닙니다.</Field.ErrorMessage> : null}
    </Field.Root>
  );
}

/** 앞뒤 장식 — 단위와 검색 아이콘 */
export function PrefixSuffix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-space-field-gap)" }}>
      <Field.Root>
        <Field.Label>예산</Field.Label>
        <TextField type="number" defaultValue={100} suffix="만원" />
      </Field.Root>
      <TextField
        type="search"
        aria-label="문서 검색"
        placeholder="문서 검색"
        prefix={
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        }
      />
    </div>
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
        <Field.Label>프로젝트 이름</Field.Label>
        <TextField variant="box" size="large" defaultValue="새 프로젝트" />
      </Field.Root>
      <Field.Root>
        <Field.Label>설명</Field.Label>
        <TextField variant="line" size="large" placeholder="한 줄 설명" />
      </Field.Root>
    </div>
  );
}
```
