/**
 * @title List
 * @summary 제목 + 메타 + 행 동작으로 이루어진 객체 목록. 행 전체가 주 행동, 보조 행동은 Trailing.
 *
 * ## 언제 쓰나
 *
 * - 문서·프로젝트·버전처럼 "열어 볼 객체"의 목록.
 * - 행마다 상태 Badge나 더보기 메뉴가 붙을 때.
 * - 목록을 묶음(발행됨/초안)으로 나누고 묶음을 접고 싶을 때(`List.Section` + `collapsible`).
 *
 * ## 쓰지 말 때
 *
 * - 열로 값을 비교하거나 정렬해야 하면 `Table`·`DataTable`.
 * - 값 하나를 고르는 목록은 `Select`(listbox).
 * - 본문을 펼쳐 보는 FAQ 형태는 `Accordion`. `List.SectionHeader`의 접기는 목록 묶음을 접는 용도다.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `List.Root` | `ul` 속성 | `role="list"`. 이름은 `aria-label`, Section 안이면 헤더 제목이 자동 연결 |
 * | `List.Item` | `current` | 지금 열린 객체. 행 Action(없으면 Title)에 `aria-current="true"` |
 * | `List.Action` | `href` · `asChild` | `href`가 있으면 링크, 없으면 `button`, 라우터 Link는 `asChild`. 행 전체가 누름 영역 |
 * | `List.Title` | — | 주 행동이 없는 행의 제목 |
 * | `List.Leading` · `List.Meta` · `List.Trailing` | — | 앞 아이콘/아바타 · 보조 설명 · 오른쪽 Badge/메뉴 |
 * | `List.Section` | `collapsible` · `open` · `defaultOpen` · `onOpenChange` | 묶음. 접힌 목록은 `hidden` |
 * | `List.SectionHeader` | `title`(필수) · `count` · `description` · `action` · `as`(`h2`·`h3`·`h4`) | `action` 이름에 대상 종류를 넣는다("초안 추가") |
 *
 * ## 접근성
 *
 * - 행의 주 행동 안에 버튼·링크를 중첩하지 않는다. 보조 행동은 `List.Trailing`(Action의 형제)에 둔다. 탭 순서는 Action, Trailing 버튼, 다음 행.
 * - 행동이 둘을 넘으면 Trailing에 `DropdownMenu` 하나로 모은다. 아이콘 버튼은 `aria-label`에 대상 이름을 넣는다.
 * - 말줄임은 CSS로만 하고 `List.Action` 안의 텍스트는 전체 제목을 유지한다.
 * - `List.Root`에 이름이 없고 Section도 없으면 `aria-label`을 준다.
 */
import { Badge } from "@dg-design/react/badge";
import { Button } from "@dg-design/react/button";
import { DropdownMenu } from "@dg-design/react/dropdown-menu";
import { List } from "@dg-design/react/list";

/** 더보기 메뉴 — 대상 이름이 들어간 접근 이름 */
function RowMenu({ title }: { title: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="small" intent="neutral" variant="ghost" aria-label={`${title} 더 보기`}>
          더 보기
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>이름 바꾸기</DropdownMenu.Item>
        <DropdownMenu.Item>복제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** 행 전체가 링크 + 상태 Badge와 보조 메뉴는 Trailing */
export function DocumentList() {
  return (
    <List.Root aria-label="문서 목록">
      <List.Item current>
        <List.Action href="#doc-1">다크 모드 대비 검수 메모</List.Action>
        <List.Meta>접근성 · 10월 5일 수정</List.Meta>
        <List.Trailing>
          <Badge intent="positive" variant="weak">
            발행됨
          </Badge>
          <RowMenu title="다크 모드 대비 검수 메모" />
        </List.Trailing>
      </List.Item>
      <List.Item>
        <List.Action href="#doc-2">토큰 이름 정리</List.Action>
        <List.Meta>디자인 시스템 · 10월 2일 수정</List.Meta>
        <List.Trailing>
          <Badge intent="neutral" variant="weak">
            초안
          </Badge>
        </List.Trailing>
      </List.Item>
    </List.Root>
  );
}

/** 주 행동이 없는 정적 행 — Title만 두고 동작은 Trailing 메뉴로 */
export function StaticRows() {
  return (
    <List.Root aria-label="버전 이력">
      <List.Item>
        <List.Title>v3 최종본</List.Title>
        <List.Meta>어제 저장</List.Meta>
        <List.Trailing>
          <RowMenu title="v3 최종본" />
        </List.Trailing>
      </List.Item>
      <List.Item>
        <List.Title>v2 검토용</List.Title>
        <List.Meta>지난주 저장</List.Meta>
        <List.Trailing>
          <RowMenu title="v2 검토용" />
        </List.Trailing>
      </List.Item>
    </List.Root>
  );
}

/** 접히는 묶음 — 제목이 접기 버튼, 오른쪽 action은 형제 */
export function CollapsibleSection() {
  return (
    <List.Section collapsible defaultOpen>
      <List.SectionHeader
        as="h2"
        title="초안"
        count={2}
        action={
          <Button size="small" intent="neutral" variant="ghost">
            초안 추가
          </Button>
        }
      />
      <List.Root>
        <List.Item>
          <List.Action href="#draft-1">온보딩 가이드</List.Action>
          <List.Meta>오늘 수정</List.Meta>
        </List.Item>
        <List.Item>
          <List.Action href="#draft-2">릴리스 노트</List.Action>
          <List.Meta>3일 전 수정</List.Meta>
        </List.Item>
      </List.Root>
    </List.Section>
  );
}
