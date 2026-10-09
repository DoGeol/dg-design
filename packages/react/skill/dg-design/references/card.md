<!-- 생성 파일 — packages/react/skill-src/card.tsx에서 만든다. 직접 고치지 않는다. -->

# Card

관련 내용을 테두리 있는 면으로 묶는 단순 컨테이너. 스타일만 있고 구조는 없다.

## 언제 쓰나

- 목록 안의 한 항목, 대시보드 위젯처럼 독립된 덩어리를 시각적으로 묶을 때.
- 카드 전체가 링크여야 하면 `asChild`로 `<a>`에 입힌다.

## 쓰지 말 때

- 떠 있는 패널 — `Dialog`·`Popover`.
- 메시지 박스 — `Alert`.
- 영역이 비었거나 오류인 상태 — `StatePanel`.
- 행 형태 목록 — `List`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `asChild` | boolean | 자식 요소(`a`, `button`, `article` 등)에 Card 모양을 입힌다 |

그 외는 `div` 속성이 그대로 전달된다. 기본 안쪽 여백이 있다. Header·Body 같은 하위 부품은 없다 — 안쪽 레이아웃은 직접 만든다. `a[href]`·`button`으로 렌더하면 hover·포커스 스타일이 자동으로 붙는다.

## 접근성

- Card 자체에는 role이 없다. 독립된 글이면 `asChild`로 `<article>`을 쓴다.
- 카드 전체를 링크로 만들면 안쪽에 또 다른 링크·버튼을 넣지 않는다(중첩 상호작용 금지).
- 제목은 문서 구조에 맞는 heading 레벨을 쓴다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import { Card } from "@dg-design/react/card";

/** 기본 카드 — 제목, 설명, 행동 */
export function Basic() {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x2)" }}>
      <h3 style={{ margin: 0 }}>프로젝트 A</h3>
      <p style={{ margin: 0 }}>마지막 수정 3일 전</p>
      <div>
        <Button size="small" intent="neutral" variant="weak">
          열기
        </Button>
      </div>
    </Card>
  );
}

/** 카드 전체가 링크 — 안쪽에 다른 상호작용을 두지 않는다 */
export function LinkCard() {
  return (
    <Card asChild>
      <a href="/projects/a">프로젝트 A 열기</a>
    </Card>
  );
}

/** 독립된 글 단위 — article로 렌더 */
export function AsArticle() {
  return (
    <Card asChild>
      <article>
        <h3 style={{ margin: 0 }}>릴리스 노트</h3>
        <p>이번 주 변경 사항을 정리했습니다.</p>
      </article>
    </Card>
  );
}
```
