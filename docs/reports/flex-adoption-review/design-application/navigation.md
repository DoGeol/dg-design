# 탐색·메뉴 7개

[공통 규칙](README.md) · [Menu/Tabs API 검토](../composition.md)

## Tabs `tabs`

현재: [CSS](../../../../packages/react/src/tabs/tabs.css)의 min-height36, p6·8, 글자14/bold, 선택 시 브랜드 글자와 2px 밑줄, 패널 위 여백12.

제안: 밑줄형은 유지한다. 일반 탭은 약한 글자, 활성 탭은 진한 글자+브랜드 밑줄로 위계를 줄 수 있다. 긴 이름·건수를 위해 좌우 여백12와 min-height40 후보를 비교한다. 콘텐츠와의 간격은24 후보. 모바일은 글자를 압축하기보다 가로 스크롤과 끝부분 탐색 단서를 제공한다.

상태·변경: 선택/hover/focus를 분리하되 기본 자동 활성화는 유지한다. manual activation은 필요할 때만 추가. 가로 스크롤은 기존 responsive(넓을 때 모든 패널 표시)와 별도 기능이다. **CSS + 선택적 overflow API**.

## DropdownMenu `dropdown-menu`

현재: [CSS](../../../../packages/react/src/dropdown-menu/dropdown-menu.css)의 패널 r12/p4/min-width12rem, item min32/r6/p6·8. Label/Shortcut/Separator가 있다.

제안: 패널 r12/p6, 항목 r6/min36, 좌우8–12 후보. leading 아이콘·명령문·shortcut/하위 메뉴 chevron의 정렬 열을 고정한다. 그룹 간격은 항목 간격보다 크게 하고 위험 명령만 별도 구역으로 둔다. 선택값 체크와 하위 탐색 chevron을 혼용하지 않는다. 모바일은 행 min48, shortcut은 필요한 경우만 표시한다.

상태·변경: Sub 메뉴는 표식만 추가하지 않고 키보드/포인터/복귀 계약을 구현해야 한다. 회색 hover와 focus를 구분하며 disabled 명령은 실행하지 않는다. **CSS + Sub API**.

## ContextMenu `context-menu`

현재: [소스](../../../../packages/react/src/context-menu/ContextMenu.tsx)는 DropdownMenu CSS를 재사용하며 우클릭 위치에서 열린다.

제안: 위 메뉴의 치수·그룹·아이콘 배치를 공유한다. 별도 “우클릭 메뉴 스타일”을 만들지 않는다. 행 우측 더보기 버튼으로 같은 행동에 도달할 수 있게 하고, 모바일에서는 이 버튼 또는 선택 후 행동 영역을 기본 진입점으로 둔다.

상태·변경: 우클릭/키보드 트리거와 화면 가장자리 배치, 닫은 뒤 포커스 확인. long-press를 유일한 진입 경로로 삼지 않는다. **공유 CSS/앱 조합**, 하위 메뉴가 필요하면 공통 Menu 계약 사용.

## Breadcrumb `breadcrumb`

현재: [CSS](../../../../packages/react/src/breadcrumb/breadcrumb.css)의 글자13, 항목 gap6, 항목 안 gap4.

제안: 보조 위치 정보로 현재 크기를 유지한다. 현재 위치는 fg-neutral, 상위 경로는 fg-neutral-weak와 명확한 링크 반응을 쓴다. 제목 위에 놓고 큰 제목·탭과 경쟁하지 않게 한다. 모바일은 부모로 돌아가기+현재 위치 같은 축약 조합을 앱에서 제공한다.

상태·변경: 줄임표 뒤 경로에 도달할 수 있어야 한다. 목록을 CSS로 숨기기만 하지 않는다. 현재 페이지 의미와 긴 제목 처리 유지. **CSS/소비자 조합**, 별도 라우터 의존 불필요.

## Pagination `pagination`

현재: [CSS](../../../../packages/react/src/pagination/pagination.css)의 버튼 기반 min-width40, 항목 gap4, 생략 표시40×40.

제안: 현재 페이지는 중성 강조 표면+진한 숫자, 나머지는 ghost 계열로 정렬한다. 40px 기준은 유지하며 모바일에서 44px 조작 영역 후보를 확인한다. 공간이 부족하면 이전/현재·전체/다음 조합으로 줄이고 결과 건수는 별도 텍스트로 둔다.

상태·변경: 페이지 이동은 링크 의미를 유지한다. 첫/마지막에서 disabled 표시와 실제 차단 일치, 1000쪽 같은 긴 숫자 검증. **Button 토큰 연동/앱 조합**, 숫자만 줄이는 폰트 축소는 지양.

## Accordion `accordion`

현재: [CSS](../../../../packages/react/src/accordion/accordion.css)의 root gap12/16, trigger inline16·block16/20, 제목16/20, 설명13/16, boxed 형태 r8.

제안: 정보 묶음은 header→description→body 순서를 유지한다. 기본 평면형은 간격과 필요한 구분선으로, 카드형은 독립 구역에만 쓴다. 기존 여백을 먼저 유지하고 아이콘/아바타 유무와 무관하게 본문이 제목 시작선에 맞게 한다. 모바일도 헤더 전체를 조작할 수 있게 하고 긴 제목은 줄바꿈한다.

상태·변경: chevron으로 열림을 나타내고 focus를 별도로 표시한다. prefix가 있을 때 본문 들여쓰기는 현재 물리 padding-left 대신 logical property 적용을 검토한다. **CSS/역할 토큰**, 새 expand 로직 불필요.

## Collapsible `collapsible`

현재: [CSS](../../../../packages/react/src/collapsible/collapsible.css)의 trigger r4/p4·8/gap4, 실제 높이 기반 content 전환.

제안: “상세 옵션”, “설명 더 보기” 같은 낮은 우선순위 정보 공개에 사용한다. 작은 ghost 트리거를 유지하고 열렸을 때 본문 위8–12 후보 여백을 준다. 모바일에서는 작은 문구의 hit area를 넓히며 주요 실행 버튼은 접힌 영역 밖에 둔다.

상태·변경: 숨겨진 콘텐츠가 탭 순서에 남지 않게 기존 hidden 계약 유지. Accordion과 달리 여러 항목의 배타적 상태를 새로 만들지 않는다. **CSS/조합으로 가능**.
