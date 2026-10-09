<!-- 생성 파일 — packages/react/skill-src/avatar.tsx에서 만든다. 직접 고치지 않는다. -->

# Avatar

사람·프로젝트를 나타내는 원형 이미지. 이미지가 없거나 실패하면 Fallback이 대신 보인다.

## 언제 쓰나

- 사용자·작성자·프로젝트를 이미지로 구분할 때(목록 행, 댓글, 헤더).
- 이미지가 없을 수 있으면 `Avatar.Fallback`에 이니셜을 둔다.
- 온라인 표시 등 작은 상태 점은 `Avatar.Badge`.

## 쓰지 말 때

- 상태·분류 라벨 — `Badge`.
- 개수·읽지 않음 표시 — `NotificationBadge`(Avatar 위에 겹칠 수 있다).
- 일반 이미지·썸네일 — `<img>`를 직접 쓴다.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `Avatar.Root` | `size`(`xsmall` 20·`small`·`medium` 기본·`large`·`xlarge`) · `motion`(`none` 기본·`auto`) | `auto`면 새로 받은 이미지가 150ms 페이드인. 대량 목록은 기본값 유지 |
| `Avatar.Image` | `src` · `alt` | `<img>` 속성. 로드되기 전과 실패 시 숨겨진다 |
| `Avatar.Fallback` | children | 이미지가 로드되면 숨겨진다. 이니셜·아이콘 |
| `Avatar.Badge` | children | 모서리 상태 점 |

모든 부품은 `Avatar.Root` 안에서만 쓴다(밖이면 에러).

## 접근성

- 이름이 옆에 텍스트로 있으면 `alt=""`, 아바타만 단독이면 `alt`에 이름을 준다.
- Fallback 이니셜이 유일한 단서라면 Root에 `aria-label`을 준다.
- Badge의 의미(예: 온라인)는 색만으로 전달하지 말고 `aria-label`이나 인접 텍스트를 함께 둔다.

## 예제

```tsx
import { Avatar } from "@dg-design/react/avatar";

/** 이미지 + 이니셜 fallback — 이미지가 없거나 실패해도 자리가 비지 않는다 */
export function WithFallback() {
  return (
    <Avatar.Root size="large" aria-label="김지원">
      <Avatar.Image src="/avatars/jiwon.png" alt="" />
      <Avatar.Fallback>김</Avatar.Fallback>
    </Avatar.Root>
  );
}

/** 크기 변형 */
export function Sizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x2)" }}>
      {(["xsmall", "small", "medium", "large", "xlarge"] as const).map((size) => (
        <Avatar.Root key={size} size={size}>
          <Avatar.Fallback>김</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}

/** 상태 점 */
export function WithStatusBadge() {
  return (
    <Avatar.Root size="large" aria-label="이서준, 온라인">
      <Avatar.Fallback>이</Avatar.Fallback>
      <Avatar.Badge />
    </Avatar.Root>
  );
}
```
