<!-- 생성 파일 — packages/react/skill-src/badge.tsx에서 만든다. 직접 고치지 않는다. -->

# Badge

항목의 상태·분류를 짧게 알려 주는 읽기 전용 라벨.

## 언제 쓰나

- 목록 행·카드 옆에 "진행 중", "초안", "신규" 같은 상태를 표시.
- 의미는 `intent`(색), 강조는 `variant`로 나눈다.

## 쓰지 말 때

- 읽지 않은 개수·알림 점 — `NotificationBadge`.
- 사용자가 누르거나 지울 수 있는 태그·필터 — `Chip`·`FilterChip`.
- 눈에 띄어야 하는 안내 문장 — `Alert`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `intent` | `neutral`(기본) · `brand` · `critical` · `positive` · `warning` · `informative` | 의미 |
| `variant` | `weak`(기본) · `solid` · `outline` | 강조 단계 |
| `size` | `small`(16) · `medium`(기본) · `large` | |
| `truncate` | boolean | 좁은 곳에서 말줄임 |
| `asChild` | boolean | 자식 요소에 Badge 모양을 입힌다 |

## 접근성

- 상호작용이 없는 `span`이다. 색만으로 의미를 나르지 말고 문구를 반드시 쓴다.
- 값이 바뀔 때 알려야 한다면 Badge가 아니라 Alert·Toast 같은 live region을 쓴다.

## 예제

```tsx
import { Badge } from "@dg-design/react/badge";

/** 상태 라벨 */
export function StatusLabels() {
  return (
    <div style={{ display: "flex", gap: "var(--dds-dimension-x2)" }}>
      <Badge intent="positive">완료</Badge>
      <Badge intent="informative">진행 중</Badge>
      <Badge intent="warning">검토 필요</Badge>
      <Badge intent="critical">실패</Badge>
      <Badge>초안</Badge>
    </div>
  );
}

/** 강조 단계 */
export function Variants() {
  return (
    <div style={{ display: "flex", gap: "var(--dds-dimension-x2)" }}>
      <Badge intent="brand" variant="solid">
        신규
      </Badge>
      <Badge intent="brand" variant="weak">
        신규
      </Badge>
      <Badge intent="brand" variant="outline">
        신규
      </Badge>
    </div>
  );
}

/** 좁은 곳에서 말줄임 */
export function Truncated() {
  return (
    <div style={{ width: 80 }}>
      <Badge truncate>아주 긴 분류 이름</Badge>
    </div>
  );
}
```
