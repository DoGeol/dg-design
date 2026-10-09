<!-- 생성 파일 — packages/react/skill-src/tooltip.tsx에서 만든다. 직접 고치지 않는다. -->

# Tooltip

아이콘 버튼 같은 요소에 붙는 짧은 라벨 — 비인터랙티브 텍스트만.

## 언제 쓰나

- 아이콘만 있는 버튼의 이름·단축키를 hover와 키보드 포커스에서 보여 준다.
- 여러 툴팁이 나란한 툴바는 `Tooltip.Provider`로 감싸 옆으로 옮길 때 지연을 생략한다.

## 쓰지 말 때

- 안에 버튼·링크·입력이 있다 — `Popover`(클릭) 또는 `HoverCard`(hover 미리보기). Tooltip은 포커스 가능한 요소를 넣지 않는다.
- 꼭 읽어야 하는 정보 — 화면에 직접 쓰거나 `Field.Description`·`Alert`. 툴팁은 터치에서 보이지 않는다.
- 아이콘 버튼의 유일한 이름 — `aria-label`을 반드시 함께 준다. 툴팁은 보조다.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `Tooltip.Provider` | `skipDelayDuration` | 선택. 그룹 지연 스킵(기본 300ms) |
| `Tooltip.Root` | `open`·`defaultOpen`·`onOpenChange`·`placement`·`openDelay`·`closeDelay` | `placement` 기본 `top`, `openDelay` 700ms |
| `Tooltip.Trigger` | `asChild` | hover·focus에서 열리고 blur·Esc는 즉시 닫는다 |
| `Tooltip.Content` | — | `role="tooltip"`. 화살표 자동 포함 |

## 접근성

- 열린 동안 트리거에 `aria-describedby`가 연결된다. 트리거의 접근 이름은 따로 `aria-label`로 둔다.
- 키보드 포커스로도 열린다. Esc로 닫는다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import { Tooltip } from "@dg-design/react/tooltip";

/** 아이콘 버튼에 라벨 — aria-label은 따로 준다 */
export function IconButtonLabel() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button intent="neutral" variant="ghost" iconOnly aria-label="복사">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="5" y="5" width="8" height="8" stroke="currentColor" fill="none" />
            <path d="M3 10V3h7" stroke="currentColor" fill="none" />
          </svg>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>복사</Tooltip.Content>
    </Tooltip.Root>
  );
}

/** 툴바 — Provider로 묶으면 옆 버튼으로 옮길 때 바로 뜬다 */
export function Toolbar() {
  return (
    <Tooltip.Provider>
      <div style={{ display: "flex", gap: "var(--dds-dimension-x1)" }}>
        <Tooltip.Root placement="bottom">
          <Tooltip.Trigger asChild>
            <Button intent="neutral" variant="ghost" size="small">
              굵게
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>굵게 (Ctrl+B)</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root placement="bottom">
          <Tooltip.Trigger asChild>
            <Button intent="neutral" variant="ghost" size="small">
              기울임
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>기울임 (Ctrl+I)</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
```
