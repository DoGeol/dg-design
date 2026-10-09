/**
 * @title DropdownMenu
 * @summary 버튼을 눌러 여는 행동(명령) 목록 — 항목, 체크, 라디오, 단축키 표시.
 *
 * ## 언제 쓰나
 *
 * - "더 보기(⋯)" 버튼 뒤에 숨기는 보조 행동들(이름 바꾸기, 복제, 삭제).
 * - 설정을 이어서 바꾸는 체크·라디오 항목 — 고른 뒤 메뉴가 닫히지 않는다.
 * - 삭제 같은 파괴적 행동은 `intent="critical"`.
 *
 * ## 쓰지 말 때
 *
 * - 폼 값 하나 고르기 — `Select`. 여러 값은 `MultiSelect`.
 * - 주 행동 — 메뉴에 숨기지 말고 `Button`.
 * - 우클릭으로 여는 메뉴 — `ContextMenu`.
 * - 입력·버튼이 섞인 패널 — `Popover`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `DropdownMenu.Root` | `open`·`defaultOpen`·`onOpenChange`·`placement`·`closeOnEscape`·`closeOnOutsideClick` | `placement` 기본 `bottom-start` |
 * | `DropdownMenu.Trigger` | `asChild` | |
 * | `DropdownMenu.Content` | — | `role="menu"` |
 * | `DropdownMenu.Item` | `onSelect`·`intent`(`neutral`·`critical`)·`disabled` | 선택하면 `onSelect` 뒤 **메뉴가 항상 닫힌다** |
 * | `DropdownMenu.CheckboxItem` | `checked`·`defaultChecked`·`onCheckedChange` | 메뉴가 닫히지 않는다 |
 * | `DropdownMenu.RadioGroup` · `RadioItem` | `value`·`defaultValue`·`onValueChange` / `value` | 메뉴가 닫히지 않는다 |
 * | `DropdownMenu.Separator` · `Label` · `Shortcut` | — | `Shortcut`은 표시용 글자(키 바인딩은 앱이 건다) |
 *
 * ## 접근성
 *
 * - 열면 첫 항목에 포커스, 화살표·Home·End로 이동(타이핑 검색은 없다), Esc로 닫고 트리거로 복귀 — 컴포넌트가 처리한다.
 * - 아이콘만 있는 트리거는 `aria-label`을 준다.
 * - 서버 컴포넌트 파일에서는 named export(`DropdownMenuItem`)를 쓴다.
 */
import { Button } from "@dg-design/react/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@dg-design/react/dropdown-menu";
import * as React from "react";

/** 행 끝의 더 보기 메뉴 — 일반 행동 + 위험 행동 */
export function RowActions({ onDelete }: { onDelete?: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button intent="neutral" variant="ghost" size="small" iconOnly aria-label="더 보기">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="3" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="13" cy="8" r="1.5" fill="currentColor" />
          </svg>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onSelect={() => {}}>
          이름 바꾸기
          <DropdownMenu.Shortcut>F2</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>복제</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item intent="critical" onSelect={onDelete}>
          삭제
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** 체크·라디오 항목 — 고른 뒤에도 메뉴가 열려 있다 */
export function ViewMenu() {
  const [showDone, setShowDone] = React.useState(true);
  const [sort, setSort] = React.useState("recent");
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <Button intent="neutral" variant="weak">
          보기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>표시</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={showDone} onCheckedChange={setShowDone}>
          완료 항목
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>정렬</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort} aria-label="정렬 기준">
          <DropdownMenuRadioItem value="recent">최근 수정</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">이름</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          새로 고침
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
