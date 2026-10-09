/**
 * @title Popover
 * @summary 트리거를 클릭하면 옆에 뜨는 비모달 패널 — 폼·옵션 같은 인터랙티브 콘텐츠용.
 *
 * ## 언제 쓰나
 *
 * - 버튼을 눌러 여는 작은 설정·입력·옵션 영역(날짜 범위 옵션, 간단한 폼).
 * - 안에 버튼·입력처럼 포커스를 받는 요소가 있다.
 * - 입력 중인 필드 옆 참조 패널은 `autoFocus={false}`로 포커스를 건드리지 않는다.
 *
 * ## 쓰지 말 때
 *
 * - 짧은 라벨 한 줄(비인터랙티브) — `Tooltip`.
 * - 마우스를 올리면 보이는 미리보기 — `HoverCard`.
 * - 행동 목록 — `DropdownMenu`. 값 하나 고르기 — `Select`.
 * - 화면을 막고 끝내야 하는 작업 — `Dialog`·`Sheet`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `Popover.Root` | `open`·`defaultOpen`·`onOpenChange`·`placement`·`autoFocus`·`initialFocusRef`·`closeOnEscape`·`closeOnOutsideClick` | `placement` 기본 `bottom`, 공간이 없으면 뒤집힌다 |
 * | `Popover.Trigger` · `Popover.Close` | `asChild` | Trigger는 클릭으로 토글 |
 * | `Popover.Content` | — | `role="group"`. 이름이 필요하면 `aria-label`을 준다 |
 * | `Popover.Arrow` | — | 선택. Content 안에 둔다 |
 *
 * ## 접근성
 *
 * - 비모달이다 — 배경은 inert가 아니고 Esc·바깥 클릭으로 닫힌다.
 * - 열리면 Content로 포커스가 이동하고 닫히면 트리거로 돌아온다(`autoFocus`).
 * - Content에 `aria-label`을 줘 무엇인지 알린다.
 */
import { Button } from "@dg-design/react/button";
import { Popover } from "@dg-design/react/popover";

/** 클릭하면 열리는 설정 폼 */
export function SettingsPopover() {
  return (
    <Popover.Root placement="bottom-start">
      <Popover.Trigger asChild>
        <Button intent="neutral" variant="weak">
          보기 옵션
        </Button>
      </Popover.Trigger>
      <Popover.Content aria-label="보기 옵션">
        <div style={{ display: "grid", gap: "var(--dds-dimension-x2)" }}>
          <label>
            <input type="checkbox" defaultChecked /> 완료 항목 보기
          </label>
          <Popover.Close asChild>
            <Button size="small">적용</Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

/** 화살표가 있는 팝오버 */
export function WithArrow() {
  return (
    <Popover.Root placement="top">
      <Popover.Trigger asChild>
        <Button intent="neutral" variant="ghost">
          도움말
        </Button>
      </Popover.Trigger>
      <Popover.Content aria-label="도움말">
        <p>이 값은 저장할 때 한 번에 반영됩니다.</p>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
}

/** 입력 중인 필드 옆 참조 패널 — 포커스를 옮기지 않는다 */
export function ReferencePanel() {
  return (
    <Popover.Root autoFocus={false} placement="right">
      <Popover.Trigger asChild>
        <Button intent="neutral" variant="ghost" size="small">
          작성 가이드
        </Button>
      </Popover.Trigger>
      <Popover.Content aria-label="작성 가이드">
        <p>제목은 40자 이내로 씁니다.</p>
      </Popover.Content>
    </Popover.Root>
  );
}
