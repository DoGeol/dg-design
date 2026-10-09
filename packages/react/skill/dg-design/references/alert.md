<!-- 생성 파일 — packages/react/skill-src/alert.tsx에서 만든다. 직접 고치지 않는다. -->

# Alert

화면 안에 계속 남아 있는 인라인 메시지 박스. intent로 의미를 나눈다.

## 언제 쓰나

- 폼·페이지 위쪽에 사용자가 읽고 조치할 안내가 계속 보여야 할 때(경고, 오류 요약, 안내).
- 제목 + 본문 + 액션 버튼 조합이 필요할 때.
- 사용자가 닫을 수 있어야 하면 `onClose`.

## 쓰지 말 때

- 잠깐 떴다 사라지는 결과 알림("저장했어요") — `Toast`.
- 목록·표 영역 자체가 비었거나 불러오기에 실패한 상태 — `StatePanel`.
- 자동 저장 상태 표시 — `SaveStatus`.
- 입력 필드 하나의 오류 — `Field.ErrorMessage`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `intent` | `neutral`(기본) · `brand` · `critical` · `positive` · `warning` · `informative` | `critical`만 `role="alert"`, 나머지는 `role="status"` |
| `title` | ReactNode | 굵은 제목 |
| `description` | ReactNode | 본문 |
| `actions` | ReactNode | 본문 아래 가로 배치(주로 Button) |
| `onClose` | `() => void` | 주면 닫기 버튼이 생긴다 |
| `closeLabel` | string | 닫기 버튼 `aria-label`(기본 "닫기") |

## 접근성

- role은 컴포넌트가 intent에 맞춰 정한다. `role`·`aria-live`를 직접 얹지 않는다.
- 화면에 나타난 뒤 내용이 바뀌면 스크린 리더가 읽는다. 처음부터 있던 Alert는 읽히지 않을 수 있다.
- 색만으로 의미를 나르지 않도록 아이콘과 제목 문구를 함께 쓴다.

## 예제

```tsx
import { Alert } from "@dg-design/react/alert";
import { Button } from "@dg-design/react/button";
import * as React from "react";

/** 제목 + 본문 + 액션 */
export function WithActions() {
  return (
    <Alert
      intent="warning"
      title="저장 공간이 거의 찼어요"
      description="사용량이 90%를 넘었습니다. 불필요한 파일을 정리하세요."
      actions={
        <Button size="small" intent="neutral" variant="weak">
          파일 정리하기
        </Button>
      }
    />
  );
}

/** 오류 — critical은 role="alert"로 즉시 낭독된다 */
export function ErrorSummary() {
  return (
    <Alert
      intent="critical"
      title="변경 내용을 저장하지 못했어요"
      description="네트워크 연결을 확인한 뒤 다시 시도해 주세요."
    />
  );
}

/** 닫을 수 있는 안내 */
export function Dismissible() {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
    <Alert
      intent="informative"
      title="새 기능이 추가되었어요"
      description="문서에 댓글을 남길 수 있습니다."
      onClose={() => setOpen(false)}
    />
  );
}
```
