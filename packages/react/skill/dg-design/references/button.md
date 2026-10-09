<!-- 생성 파일 — packages/react/skill-src/button.tsx에서 만든다. 직접 고치지 않는다. -->

# Button

누르면 바로 실행되는 행동 하나. 주 행동은 brand solid, 나머지는 neutral weak·ghost.

## 언제 쓰나

- 폼 제출, 저장, 삭제처럼 이 화면에서 바로 일어나는 행동.
- 한 화면(또는 한 Dialog)의 주 행동은 `intent="brand" variant="solid"` 하나만 둔다. 나머지는 `neutral`의 `weak`·`ghost`.
- 되돌릴 수 없는 행동은 `intent="critical"`.

## 쓰지 말 때

- 다른 페이지로 이동 — 링크(`<a>`, 라우터 Link)를 쓰고 모양만 필요하면 `asChild`로 입힌다.
- 켜고 끄는 상태 — `Switch`(설정)나 `FilterChip`(필터).
- 여러 행동 중 하나 고르기 — `DropdownMenu`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `intent` | `brand`(기본) · `neutral` · `critical` | 의미 |
| `variant` | `solid`(기본) · `weak` · `ghost` | 강조 단계 |
| `size` | `small` · `medium`(기본) · `large` | `large`는 모바일 주 행동 |
| `iconOnly` | boolean | 정사각. `aria-label` 필수 |
| `loading` | boolean | 스피너 + disabled + `aria-busy`. 폭은 그대로 |
| `asChild` | boolean | 자식 요소(링크 등)에 Button 모양을 입힌다. `loading`과 함께 못 씀 |

## 접근성

- 아이콘만 있는 버튼은 `aria-label`(또는 `aria-labelledby`)을 준다(없으면 콘솔 경고 — 개발·운영 구분 없이 항상).
- 비활성 이유가 중요하면 버튼을 끄지 말고 누를 때 이유를 알린다 — `disabled` 버튼은 초점을 받지 못한다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";

/** 주 행동 하나 + 보조 행동 */
export function PrimaryAndSecondary() {
  return (
    <div style={{ display: "flex", gap: "var(--dds-dimension-x2)", justifyContent: "flex-end" }}>
      <Button intent="neutral" variant="weak">
        취소
      </Button>
      <Button type="submit">저장</Button>
    </div>
  );
}

/** 되돌릴 수 없는 행동, 진행 중 상태 */
export function DestructiveAndLoading({ deleting = false }: { deleting?: boolean }) {
  return (
    <Button intent="critical" loading={deleting}>
      삭제
    </Button>
  );
}

/** 아이콘만 있는 버튼 — 접근 이름 필수 */
export function IconOnly() {
  return (
    <Button intent="neutral" variant="ghost" size="small" iconOnly aria-label="닫기">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </Button>
  );
}

/** 링크에 Button 모양 입히기 */
export function LinkAsButton() {
  return (
    <Button asChild intent="neutral" variant="weak">
      <a href="/docs">문서 보기</a>
    </Button>
  );
}
```
