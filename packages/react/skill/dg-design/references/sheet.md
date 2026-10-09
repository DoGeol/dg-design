<!-- 생성 파일 — packages/react/skill-src/sheet.tsx에서 만든다. 직접 고치지 않는다. -->

# Sheet

화면 가장자리에서 슬라이드해 들어오는 모달 패널 — 옆 상세 패널(side view)과 모바일 하단 시트.

## 언제 쓰나

- 목록에서 항목을 눌러 여는 상세·편집 패널 — `side="right"`(기본). "옆으로 여는 Dialog" 대신 Sheet를 쓴다.
- 모바일 하단 시트 — `side="bottom"`. `size`로 `fit`(내용 높이) → `tall` → `full` 단계 전환.
- Dialog와 같은 작업형 부품(`Toolbar`·`Body`·`Aside`·`Footer`)을 쓴다. Body만 스크롤된다.

## 쓰지 말 때

- 가운데 뜨는 짧은 확인은 `Dialog`.
- 트리거 옆 작은 인터랙티브 영역은 `Popover`.
- 항상 보이는 사이드바는 레이아웃으로 만든다(모달이 아니다).

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `Sheet.Root` | `side`: `right`(기본) · `left` · `top` · `bottom` | 이 외 `open`·`defaultOpen`·`onOpenChange`·`initialFocusRef`·`closeOnEscape`·`closeOnOverlayClick`은 Dialog와 같다 |
| `Sheet.Content` | `size`: `default` · `fit` · `tall` · `full` | 상하 Sheet의 높이만 바꾼다(좌우는 무시). size를 바꿔도 상태가 남는다 |
| `Sheet.Trigger` · `Sheet.Close` | `asChild` | |
| `Sheet.Title` · `Sheet.Description` | — | aria 자동 연결 |
| `Sheet.Overlay` | — | 뒤 배경. Content와 형제로 Root 안에 둔다 |
| `Sheet.Toolbar` · `Body` · `Aside` · `Footer` | — | Content 직속 |

## 접근성

- Dialog와 같다 — `Sheet.Title` 필수, 모달이라 배경 inert, Esc로 닫고 포커스는 트리거로 복귀.
- 서버 컴포넌트 파일에서는 named export(`SheetContent`)를 쓴다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import {
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetOverlay,
  SheetRoot,
  SheetTitle,
  SheetToolbar,
  SheetTrigger,
} from "@dg-design/react/sheet";
import * as React from "react";

/** 오른쪽 상세 패널 — 목록 옆 side view */
export function DetailPanel() {
  return (
    <SheetRoot side="right">
      <SheetTrigger asChild>
        <Button intent="neutral" variant="weak">
          상세 보기
        </Button>
      </SheetTrigger>
      <SheetOverlay />
      <SheetContent>
        <SheetToolbar>
          <SheetTitle>프로젝트 상세</SheetTitle>
        </SheetToolbar>
        <SheetBody>
          <p>이름, 담당자, 최근 활동 같은 상세 내용.</p>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button intent="neutral" variant="weak">
              닫기
            </Button>
          </SheetClose>
          <Button>수정</Button>
        </SheetFooter>
      </SheetContent>
    </SheetRoot>
  );
}

/** 모바일 하단 시트 — 내용 높이로 열리고 필요하면 size를 키운다 */
export function BottomSheet() {
  const [size, setSize] = React.useState<"fit" | "tall">("fit");
  return (
    <SheetRoot side="bottom">
      <SheetTrigger asChild>
        <Button intent="neutral" variant="weak">
          필터
        </Button>
      </SheetTrigger>
      <SheetOverlay />
      <SheetContent size={size}>
        <SheetTitle>필터</SheetTitle>
        <SheetDescription>조건을 고르세요.</SheetDescription>
        <Button
          intent="neutral"
          variant="ghost"
          size="small"
          onClick={() => setSize(size === "fit" ? "tall" : "fit")}
        >
          {size === "fit" ? "더 보기" : "접기"}
        </Button>
      </SheetContent>
    </SheetRoot>
  );
}

/** 왼쪽 탐색 패널 */
export function NavigationPanel() {
  return (
    <SheetRoot side="left">
      <SheetTrigger asChild>
        <Button intent="neutral" variant="ghost" iconOnly aria-label="메뉴 열기">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetOverlay />
      <SheetContent>
        <SheetTitle>메뉴</SheetTitle>
        <nav style={{ display: "grid", gap: "var(--dds-dimension-x2)" }}>
          <a href="/projects">프로젝트</a>
          <a href="/settings">설정</a>
        </nav>
      </SheetContent>
    </SheetRoot>
  );
}
```
