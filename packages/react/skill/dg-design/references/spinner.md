<!-- 생성 파일 — packages/react/skill-src/spinner.tsx에서 만든다. 직접 고치지 않는다. -->

# Spinner

끝나는 시점을 모르는 짧은 대기를 나타내는 회전 표시.

## 언제 쓰나

- 버튼·작은 영역이 잠깐 처리 중일 때.
- 결과 모양을 몰라 Skeleton을 못 그리는 짧은 로딩.

## 쓰지 말 때

- 콘텐츠 모양을 알고 자리를 잡고 싶을 때 — `Skeleton`.
- 진행률을 측정할 수 있을 때 — `Progress`.
- 버튼의 진행 중 상태는 `Button loading`이 Spinner를 이미 포함한다.
- 영역 전체 로딩(아이콘 + 문구) — `StatePanel.Loading`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `size` | `small` · `medium`(기본) | |
| `aria-label` / `aria-labelledby` | string | 주면 `role="status"`가 붙는 의미 있는 상태가 된다 |

## 접근성

- 라벨이 없으면 장식(`aria-hidden`)이다. 홀로 로딩을 알려야 하면 `aria-label`을 준다.
- 다른 요소가 이미 상태를 알리면(`Button`의 `aria-busy`, 옆의 로딩 문구) 라벨 없이 쓴다.

## 예제

```tsx
import { Spinner } from "@dg-design/react/spinner";

/** 라벨이 있는 독립 로딩 표시 — 스크린 리더에 상태로 알려진다 */
export function Labeled() {
  return <Spinner aria-label="불러오는 중" />;
}

/** 문구 옆의 작은 장식 스피너 */
export function InlineWithText() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--dds-dimension-x2)" }}>
      <Spinner size="small" />
      <span role="status">내보내는 중...</span>
    </span>
  );
}
```
