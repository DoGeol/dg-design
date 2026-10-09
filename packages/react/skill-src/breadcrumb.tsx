/**
 * @title Breadcrumb
 * @summary 현재 페이지가 계층 어디에 있는지 보여 주고 상위로 이동시키는 경로 표시.
 *
 * ## 언제 쓰나
 *
 * - 폴더·카테고리처럼 2단계 이상 깊은 계층에서 상위로 되돌아갈 수 있어야 할 때.
 * - 마지막 항목은 현재 위치(`Breadcrumb.Page`), 앞쪽은 이동 가능한 링크(`Breadcrumb.Link`).
 *
 * ## 쓰지 말 때
 *
 * - 같은 층의 화면을 오가는 탐색 — `Tabs`.
 * - 목록의 페이지 이동 — `Pagination`.
 * - 계층이 1단계뿐이면 필요 없다.
 *
 * ## 핵심 API
 *
 * | 부품 | 메모 |
 * | --- | --- |
 * | `Breadcrumb.Root` | `nav`. `aria-label`이 "이동 경로"로 미리 들어 있다 |
 * | `Breadcrumb.List` | `ol` |
 * | `Breadcrumb.Item` | `li`. Link 또는 Page를 담는다 |
 * | `Breadcrumb.Link` | `a`. `asChild`로 라우터 Link에 스타일만 입힌다 |
 * | `Breadcrumb.Page` | 현재 위치(`span`, `aria-current="page"`) |
 * | `Breadcrumb.Separator` | `ol` 안에서 Item 사이에 `li`로 둔다. 기본 기호는 셰브론, children으로 교체 |
 *
 * 긴 경로를 중간 "…"으로 줄이는 로직은 없다. 필요하면 소비자가 항목을 줄여 넘긴다.
 *
 * ## 접근성
 *
 * - Separator는 `aria-hidden`이라 스크린 리더가 건너뛴다.
 * - 현재 위치는 링크로 만들지 않는다.
 * - 한 화면에 Breadcrumb이 둘이면 `aria-label`을 서로 다르게 덮어쓴다.
 */
import { Breadcrumb } from "@dg-design/react/breadcrumb";

/** 기본 경로 */
export function Basic() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">홈</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/projects">프로젝트</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>설정</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

/** 라우터 Link에 스타일 입히기 + 기호 교체 */
export function WithRouterLink() {
  // 실제 앱에서는 <a> 자리에 라우터의 <Link to="...">를 둔다.
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <a href="/docs">문서</a>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Page>시작하기</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
