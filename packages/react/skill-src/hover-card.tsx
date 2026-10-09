/**
 * @title HoverCard
 * @summary 링크 위에 마우스를 올리면 뜨는 미리보기 카드 — 마우스 사용자를 위한 보조 정보.
 *
 * ## 언제 쓰나
 *
 * - 사용자명·문서 링크 위에서 프로필·요약을 미리 보여 준다.
 * - 카드 안으로 포인터가 넘어와도 유지된다(링크나 버튼이 있어도 된다).
 *
 * ## 쓰지 말 때
 *
 * - 짧은 라벨 한 줄 — `Tooltip`(포커스로도 열린다).
 * - 꼭 알려야 하는 정보나 클릭으로 여는 인터랙티브 패널 — `Popover`.
 * - 터치·키보드 사용자도 봐야 하는 정보 — HoverCard는 **hover 전용**이다(포커스·터치로 열리지 않는다).
 *   트리거 자체가 실제 링크로 이동 가능해야 하고, 카드는 곁들이는 미리보기일 뿐이다.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `HoverCard.Root` | `open`·`defaultOpen`·`onOpenChange`·`placement`·`openDelay`·`closeDelay` | `openDelay` 기본 700ms, `closeDelay` 300ms |
 * | `HoverCard.Trigger` | `asChild` | 기본 `<a>`. `href`를 준다 |
 * | `HoverCard.Content` | — | 화살표 자동 포함. 포커스를 옮기지 않는다 |
 *
 * ## 접근성
 *
 * - 카드 내용은 키보드 사용자에게 닿지 않는다 — 같은 정보를 링크가 가리키는 페이지에서도 볼 수 있어야 한다.
 * - Esc로 즉시 닫힌다.
 */
import { HoverCard } from "@dg-design/react/hover-card";

/** 사용자 링크 미리보기 */
export function UserPreview() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger href="/members/kim">김하나</HoverCard.Trigger>
      <HoverCard.Content>
        <div style={{ display: "grid", gap: "var(--dds-dimension-x1)" }}>
          <strong>김하나</strong>
          <span>디자인 팀 · 프로젝트 3개 참여</span>
          <a href="/members/kim">프로필 보기</a>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

/** 문서 링크 요약 — 지연을 줄이고 오른쪽에 배치 */
export function DocumentSummary() {
  return (
    <HoverCard.Root openDelay={300} placement="right">
      <HoverCard.Trigger href="/docs/guide">시작 가이드</HoverCard.Trigger>
      <HoverCard.Content>
        <p>설치부터 첫 화면 만들기까지의 안내입니다.</p>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
