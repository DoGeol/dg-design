<!-- 생성 파일 — packages/react/skill-src/notification-badge.tsx에서 만든다. 직접 고치지 않는다. -->

# NotificationBadge

읽지 않은 알림 개수나 새 항목 점. 다른 요소 모서리에 겹쳐 쓴다.

## 언제 쓰나

- 아이콘 버튼·탭·아바타 위에 읽지 않은 개수를 표시(`count`).
- 개수는 필요 없고 "새 것이 있음"만 알리는 점(`count` 생략).

## 쓰지 말 때

- 항목의 상태·분류 라벨 — `Badge`.
- 눌러서 지우는 태그 — `Chip`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `count` | number | 생략하면 dot. `0`이면 아무것도 렌더하지 않는다 |
| `max` | number(기본 99) | 초과하면 `99+` 식으로 표시 |
| `isShowEmpty` | boolean | `count={0}`일 때도 "0"을 표시 |
| `intent` | `critical`(기본) · `brand` | |
| `asChild` | boolean | 자식 요소에 모양을 입힌다 |

위치 지정(모서리 겹침)은 소비자 몫이다. 부모를 `position: relative`로 두고 직접 배치한다.

## 접근성

- 숫자·점만으로는 의미가 전달되지 않는다. 부모 버튼의 `aria-label`에 개수를 포함한다(예: "알림, 3개 읽지 않음").
- 배지 자체는 live region이 아니다. 개수 변화를 알려야 하면 별도 `Toast`·`Alert`를 쓴다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import { NotificationBadge } from "@dg-design/react/notification-badge";

/** 아이콘 버튼 위 개수 — 접근 이름에 개수를 넣는다 */
export function OnIconButton({ unread = 3 }: { unread?: number }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <Button
        intent="neutral"
        variant="ghost"
        iconOnly
        aria-label={`알림, ${unread}개 읽지 않음`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M5 14V9a5 5 0 0110 0v5l1.5 2h-13L5 14z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </Button>
      <NotificationBadge
        count={unread}
        style={{ position: "absolute", top: 0, right: 0 }}
        aria-hidden="true"
      />
    </span>
  );
}

/** 개수 없는 점 */
export function DotOnly() {
  return (
    <span style={{ position: "relative", display: "inline-block", paddingRight: 8 }}>
      새 메시지
      <NotificationBadge intent="brand" style={{ position: "absolute", top: 0, right: 0 }} />
    </span>
  );
}

/** 상한 — 100개 이상은 99+ */
export function Capped() {
  return <NotificationBadge count={120} max={99} />;
}
```
