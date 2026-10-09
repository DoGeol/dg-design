/**
 * @title ContextMenu
 * @summary 영역을 우클릭하면 그 지점에 뜨는 행동 메뉴 — DropdownMenu와 같은 항목 구성.
 *
 * ## 언제 쓰나
 *
 * - 파일·카드·표 행처럼 개체 위 우클릭으로 여는 단축 행동(복사, 이름 바꾸기, 삭제).
 * - 체크·라디오 항목도 쓸 수 있다(고른 뒤 메뉴가 닫히지 않는다).
 *
 * ## 쓰지 말 때
 *
 * - **마우스 전용**이다 — 키보드(Shift+F10)·터치 long-press로는 열리지 않는다. 같은 행동이 화면의 버튼이나 `DropdownMenu`로도 닿아야 한다.
 * - 버튼으로 여는 메뉴 — `DropdownMenu`.
 * - 값 고르기 — `Select`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `ContextMenu.Root` | `open`·`defaultOpen`·`onOpenChange` | |
 * | `ContextMenu.Trigger` | `asChild` | 우클릭을 받을 영역. 기본 `<div>` |
 * | `ContextMenu.Content` | — | `role="menu"`, 우클릭 지점 기준 배치 |
 * | `ContextMenu.Item` | `onSelect`·`intent`·`disabled` | 선택하면 메뉴가 항상 닫힌다 |
 * | `ContextMenu.CheckboxItem` · `RadioGroup` · `RadioItem` | DropdownMenu와 같다 | 닫히지 않는다 |
 * | `ContextMenu.Separator` · `Label` · `Shortcut` | — | |
 *
 * ## 접근성
 *
 * - 연 뒤의 키보드(화살표·Enter·Esc)는 DropdownMenu와 같다.
 * - 열리는 경로가 우클릭뿐이라 메뉴의 행동을 다른 UI로도 제공한다.
 * - 서버 컴포넌트 파일에서는 named export(`ContextMenuItem`)를 쓴다.
 */
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@dg-design/react/context-menu";

/** 카드 우클릭 메뉴 */
export function CardMenu({ onDelete }: { onDelete?: () => void }) {
  return (
    <ContextMenuRoot>
      <ContextMenuTrigger>
        <div
          style={{
            padding: "var(--dds-dimension-x4)",
            border: "1px solid var(--dds-color-stroke-neutral-weak)",
          }}
        >
          프로젝트 계획서 (우클릭)
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          열기
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>이름 바꾸기</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem intent="critical" onSelect={onDelete}>
          삭제
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuRoot>
  );
}

/** 기존 요소(표 행 등)를 asChild로 트리거에 쓴다 */
export function RowMenu() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <p>2024년 보고서</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>복사</ContextMenu.Item>
        <ContextMenu.CheckboxItem defaultChecked>즐겨찾기</ContextMenu.CheckboxItem>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
