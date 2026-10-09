# 탐색·메뉴 7개 — B 치수 명세

[공통 규칙·프로필](README.md) · [A 적용안](../../design-application/navigation.md) · [B 재검토](../components.md)

대상: Tabs, DropdownMenu, ContextMenu, Breadcrumb, Pagination, Accordion, Collapsible.

역할 행의 숫자는 [profiles.ts](../../../../../apps/storybook/src/mockups/flex/profiles.ts)와 같고, 역할이 없는 컴포넌트 고유 값은 각 스토리의 치수표(`FlexSpec extra`)와 같다. 값 뒤 글자는 등급이다(A 원문 명시, B 측정, C 재구성, D 현재 DDS). A의 모바일 값이 profiles.ts에 없으면 데스크톱 값이 그대로 쓰인다.

이 묶음에서 B가 측정으로 바꾸는 숫자는 **메뉴 네 값(반경·여백·항목 높이·항목 반경)과 버튼 반경을 따르는 Pagination 반경**뿐이다. 나머지는 현재 값을 유지하고, B의 차이는 **조합**에서 나온다 — 탭을 페이지 문법에 넣고, 메뉴에 머리·발·체크·토글을 두고, 경로·뒤로가기·제목을 한 단위로 묶는다.

## Tabs `tabs`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 탭 최소 높이 `tab-height` | 36 | 40 C / 40 C | 36 D / 36 D | 측정 없음 |
| 탭 좌우 여백 `tab-inset` | 8 | 12 C / 12 C | 8 D / 8 D | 측정 없음 |
| 탭과 패널 간격 `tab-panel-gap` | 12 | 24 C / 24 C | 12 D / 12 D | 측정 없음 |
| 활성 표시 | 브랜드 글자 + 브랜드 밑줄 2px | 진한 글자 + 브랜드 밑줄 2px C | 브랜드 글자 + 브랜드 밑줄 2px D | 현재 값 |
| 글자 | 14 / 19 bold, 비활성 fg-neutral-weak | 같음 D | 같음 D | 현재 값 |
| 넘침 | 없음(앱 우회) | 가로 스크롤 + 끝 32px 흐림 C | 가로 스크롤 + 끝 32px 흐림 C | 글자 축소 대신 스크롤 |

B 외관: 밑줄형 그대로. 비활성 `fg-neutral-weak`, 활성 `fg-brand` + `fg-brand` 2px 밑줄, 목록 아래 1px `stroke-neutral-weak`. 건수는 이름 뒤 `fg-neutral-weak` regular. 조합은 **페이지 문법**이다 — 제목(t7)과 주 행동 하나(brand solid)가 한 줄, 그 아래 범위 탭, 패널 첫 줄에 검색 TextField + 필터 버튼(neutral weak), 그 아래 목록. 탭은 범위, 필터는 범위 안의 조건이라 같은 pill로 만들지 않는다(COMPONENT-RULES Tabs·필터).

상태: default·hover(`bg-transparent-hover` + `fg-neutral`)·pressed(`bg-transparent-pressed`)·focus(2px 안쪽 링)·selected·selected+hover·selected+focus·disabled(`fg-disabled`). 활성화는 automatic이 기본이고 manual activation은 기본값으로 보이지 않는다.

다크: 밑줄과 경계선은 토큰 그대로라 바뀌는 값이 없다. 다크 캡처에서 활성 밑줄·hover 면·focus 링이 모두 구분된다.

모바일: 치수는 데스크톱과 같다(B 모바일 값 없음). 탭이 넘치면 래퍼가 가로 스크롤을 맡고 목록은 내용 폭만큼 늘어 경계선이 끝까지 이어진다. 끝 32px(x8)을 흐려 더 있음을 알린다 — 흐림 폭은 시안 값이고 미검증. 검색 필드가 56px이 되므로 옆 필터 버튼도 56×56 아이콘 버튼으로 맞춘다.

A와 다른 점: A는 40/12/24로 넓히고 활성 글자를 진하게 바꾼다. B는 치수·활성 색을 현재대로 두고 탭이 놓이는 페이지 조합을 정한다. 넘침 처리는 두 안이 같다.

구현 수준: 토큰/CSS — 넘침 래퍼만 조합 API(`Tabs.List` 스크롤 옵션) 후보, 페이지 문법은 소비 앱 조합.

Storybook: `Mockups/Flex/Navigation/Tabs` (Compare)

## DropdownMenu `dropdown-menu`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 메뉴 패널 반경 `menu-radius` | 12 | 12 D / 12 D | 12 C / 12 C | DS021 19.5÷1.75=11.1 (교차 배율) |
| 메뉴 안쪽 여백 `menu-inset` | 4 | 6 C / 6 C | 8 C / 8 C | 메뉴 안쪽 12~16÷1.75=6.9~9.1 (교차 배율) |
| 메뉴 항목 최소 높이 `menu-item-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 메뉴 항목 반경 `menu-item-radius` | 6 | 6 D / 6 D | 8 C / 8 C | DS017 12.5÷1.75=7.1 (교차 배율) |
| 항목 좌우 여백 · 아이콘 간격 | 8 · 8 | 8 · 8 D | 8 · 8 D | 현재 값 |
| 패널 최소 폭 | 192 (12rem) | 192 D | 192 D | 현재 값 |
| leading 열 | 아이콘을 자식으로 직접 | 16 — 아이콘 또는 선택 체크 C | 16 — 아이콘 또는 선택 체크 C | 열 고정 · 아이콘 16과 같게 |
| 단축키 | 오른쪽 열 · 12px fg-neutral-weak | 데스크톱 같음 D / 모바일 숨김 C | 데스크톱 같음 D / 모바일 숨김 C | 터치에는 단축키 없음 |
| 머리·발 영역 | 없음 | 없음 | 6·8 여백 · 제목 14 bold / 보조 12 D | 항목 여백·Label 글자 재사용 |
| 토글 표시 | 없음 | 없음 | 32×20, thumb 16 (장식) D | Switch medium 재사용 |

구분선은 패널 끝까지 닿도록 `menu-inset`만큼 좌우로 당긴다(현재 −4 고정 → −`menu-inset`).

B 외관: 패널 `bg-layer-default` + 1px `stroke-neutral-weak` + `shadow-overlay`. 항목 열은 leading 16(아이콘 또는 선택 체크) · 명령문 · trailing(단축키·chevron·토글 중 하나)로 고정한다. 구성은 위에서부터 **머리**(문서 제목 t4 bold + 보조 t2 `fg-neutral-weak`, 비대화형) → 명령 그룹(이름 변경 F2 · 복제 · 이동 ›) → Label "보기" + 체크 항목 두 개 + 토글 항목 → **위험 구역**(삭제, critical) → **발**(수정 정보 t2 `fg-neutral-weak`). 체크는 leading 열에, 하위 탐색 chevron은 trailing 열에만 둔다 — 같은 열에서 섞지 않는다. 토글 항목은 항목 자체가 토글이라 안에 Switch를 넣지 않고 장식 트랙만 그린다(자의적 interactive 중첩 금지).

상태: default·hover·pressed·focus(hover 면 + 2px 안쪽 링)·disabled·critical·critical+hover·critical+focus, B는 selected(체크)·selected+hover·selected+focus·토글 켜짐을 더한다. 하위 메뉴는 부모 항목에 hover 면을 남긴 채 오른쪽에 같은 패널을 띄운 **표현만** 그린다.

다크: 부유 패널 1px 경계가 다크 캡처에서 보인다. 토글 트랙 꺼짐 `bg-neutral-weak-pressed`, 켜짐 `bg-brand-solid`, thumb `fg-brand-contrast`(Switch와 같음).

모바일: 항목 48(C, 터치), 단축키 열 숨김. 패널 폭과 열 구성은 같다. 하위 메뉴를 옆 패널로 띄우는 표현이 390px에서 맞는지는 미검증 — 드릴인 대안은 이번 범위 밖이다.

A와 다른 점: 치수는 A 6/36/6 대 B 8/32/8. 조합은 A가 기존 Label·Shortcut·Separator 구성 + 하위 메뉴 chevron까지, B는 머리·발·체크·토글을 더한다. 하위 메뉴는 A가 Sub API(→ 열기, ← 복귀, 포인터 지연)를 구현하는 안이고 B는 **Sub API 없음 — 표현만**이다.

구현 수준: 토큰/CSS(치수) + 조합 API(`CheckboxItem`·`Sub` 없이는 체크·하위 메뉴의 role·키보드가 맞지 않는다 — 시안의 체크 항목은 role이 `menuitem` 그대로라 의미가 없다).

Storybook: `Mockups/Flex/Navigation/DropdownMenu` (Compare)

## ContextMenu `context-menu`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 메뉴 패널 반경 `menu-radius` | 12 | 12 D / 12 D | 12 C / 12 C | DS021 19.5÷1.75=11.1 (교차 배율) |
| 메뉴 안쪽 여백 `menu-inset` | 4 | 6 C / 6 C | 8 C / 8 C | 메뉴 안쪽 12~16÷1.75=6.9~9.1 (교차 배율) |
| 메뉴 항목 최소 높이 `menu-item-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 메뉴 항목 반경 `menu-item-radius` | 6 | 6 D / 6 D | 8 C / 8 C | DS017 12.5÷1.75=7.1 (교차 배율) |
| 패널·항목 CSS | DropdownMenu와 공유 | 공유 D | 공유 D | 현재 구조 유지 |
| 진입 경로 | 우클릭 + 행 더보기 버튼 | 같음 C | 같음 C | 보조 경로 계약 |
| long-press | 없음 | 없음 D | 없음 D | 유일 경로로 삼지 않음 |

B 외관: DropdownMenu와 같은 클래스·치수라 별도 우클릭 스타일이 없다. 행 행동 목록(열기 · 이름 변경 · 복제 · 링크 복사 | 삭제)을 우클릭 메뉴와 행 오른쪽 더보기(ghost small 아이콘 버튼) 두 진입점이 함께 쓴다. 행을 여는 기본 행동과 더보기는 따로 둔다.

상태: 항목 상태는 DropdownMenu와 같다. 좌표 없이 열면 트리거 왼쪽 위 기준, 닫히면 포커스가 행으로 돌아온다.

다크: DropdownMenu와 같다 — 1px 경계 확인.

모바일: 우클릭이 없고 long-press는 구현하지 않는다. 행 더보기가 기본 진입점이며 같은 행동을 모두 담는다. 항목 48, 단축키 숨김.

A와 다른 점: 치수만 다르다(메뉴 역할 네 값). 조합은 A와 같다.

구현 수준: 토큰/CSS — 공유 CSS와 앱 조합으로 충분.

Storybook: `Mockups/Flex/Navigation/ContextMenu` (Compare)

## Breadcrumb `breadcrumb`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 글자 | 13 / 18, 현재 페이지 bold | 같음 D | 같음 D | 현재 값 |
| 항목 간격 / 구분자 | 6 / chevron 16 | 같음 D | 같음 D | 현재 값 |
| 뒤로가기 | 없음 | 없음(모바일은 부모 링크) | small 아이콘 버튼 36 · 아이콘 20 D | Button small 재사용 |

B 외관: 숫자 변화 없음. 상위 링크 `fg-neutral-weak`(hover `fg-neutral` + 밑줄), 현재 페이지 `fg-neutral` bold. 조합은 **페이지 내비게이션 단위** — 데스크톱은 경로 한 줄, 그 아래 [뒤로가기 아이콘 버튼(neutral ghost)] + 제목(t7) + 주 행동 하나(brand solid), 보조 설명. 뒤로가기는 경로의 바로 위 단계(예: 주문 관리)와 같은 곳으로 가며 접근 이름에 목적지를 적는다("주문 관리로 돌아가기"). 줄임표는 숨긴 단계를 DropdownMenu로 연다 — CSS로 감추기만 하지 않는다.

상태: link default·hover·focus(2px 링, offset 2), current page. 줄임표 버튼도 링크 외관을 그대로 쓴다.

다크: 토큰 그대로 — 다크 캡처에서 링크·현재 페이지 대비 확인.

모바일: 전체 경로를 숨기고 [뒤로가기] + 상위 이름(t3 `fg-neutral-weak`) + 제목. 모바일에서 주 행동 하나를 어디에 둘지(하단 고정 CTA 등)는 정하지 않았다 — 미검증. 뒤로가기 버튼은 36이라 터치 44에 못 미친다 — 조작 영역 확대는 미검증.

A와 다른 점: A는 데스크톱에서 경로를 제목 위에 두기만 하고, 모바일에서 "‹ 부모" 텍스트 링크로 줄인다. B는 데스크톱에도 뒤로가기를 두고 주 행동을 하나로 제한한다. 치수는 같다.

구현 수준: 토큰/CSS — 숫자 변화 없음, 페이지 머리는 소비 앱 조합.

Storybook: `Mockups/Flex/Navigation/Breadcrumb` (Compare)

## Pagination `pagination`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 버튼 반경 (medium) `button-radius` | 8 | 8 C / 12 C | 6 B / 12 B | DS024·026 11.5÷1.75=6.6 · 모바일: M020 16.75×0.75=12.6 |
| 링크 최소 폭 · 높이 | 40 · 40 | 40 · 40 D / 44 · 44 C | 40 · 40 D / 40 · 40 D | 현재 값 |
| 간격 | 4 | 4 D | 4 D | 현재 값 |
| 현재 페이지 | brand solid | bg-neutral-weak + 1px stroke-neutral + fg-neutral bold C | brand solid D | 현재 값 |
| 모바일 구성 | 번호 목록(생략 포함) | 이전 · 현재/전체 · 다음 C | 번호 목록(생략 포함) D | 데이터에 따라 결정 |

반경은 Pagination이 쓰는 `dds-button--size_medium`을 통해 `button-radius` 역할을 그대로 따른다(Button 토큰 연동). 페이지네이션 전용 CSS는 B에 없다.

B 외관: 현재와 같다 — 현재 페이지 brand solid, 나머지 neutral ghost, 생략 표시 40×40 `fg-neutral-weak`. 결과 건수("총 240건")는 페이지 번호와 따로 둔다. 페이지 방식은 데이터에 따라 정하고 무한 스크롤로 일괄 바꾸지 않는다.

상태: default·hover·pressed·focus·selected·selected+hover·selected+focus, 첫 쪽 이전·마지막 쪽 다음 disabled(`aria-disabled` + href 제거로 실제 차단). 네 자리 쪽수(1000)는 폭만 늘고 글자를 줄이지 않는다.

다크: 토큰 그대로 — 다크 캡처에서 활성·hover·pressed 면이 구분된다. 대비 수치는 토큰 생성 검사에 맡기고 따로 재지 않았다.

모바일: 치수·구성은 데스크톱과 같고 반경만 12(버튼 모바일 반경). 7항목(40 + 간격 4)은 약 304px로 390 화면에 들어간다. 터치 44 미만(40)은 미검증 항목으로 남긴다.

A와 다른 점: A는 현재 페이지를 중성 표면 + 진한 숫자로 바꾸고(흰 배경 위 약한 표면 대비 1.07:1이라 1px 중성 경계를 보탠 시안), 모바일에서 44px·이전/현재·전체/다음 축약을 쓴다. B는 반경 외에 바꾸지 않는다.

구현 수준: 토큰/CSS — Button 반경 역할 연동만.

Storybook: `Mockups/Flex/Navigation/Pagination` (Compare)

## Accordion `accordion`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 트리거 여백 | 세로 16 · 좌우 16 (large 20) | 같음 D | 같음 D | 현재 값 |
| 제목 / 설명 | 16/20 bold · 13/18 | 같음 D | 같음 D | 현재 값 |
| separated | r8 · 1px stroke-neutral-weak · 항목 간격 12 | 같음 D | 같음 D | 현재 값 |
| prefix 들여쓰기 | padding-left (물리) | padding-inline-start 검토 C | padding-inline-start 검토 C | RTL 대비 — 값 동일 |

B 외관: 현재와 같다. inline은 항목 사이 1px `stroke-neutral-weak`, separated는 r8 테두리 상자. 제목 `fg-neutral` bold, 설명 `fg-neutral-weak`, chevron `fg-neutral-weak`(열리면 180° 회전). 펼친 본문은 prefix 폭만큼 들여 제목 시작선에 맞춘다.

**Accordion과 목록 섹션 그룹(노트):** Accordion은 본문 설명·FAQ·설정 설명처럼 읽을 내용을 접는 disclosure로 유지한다. 객체 행 묶음의 제목(목록 섹션)은 접기와 '추가' 같은 그룹 행동이 제목 줄에 함께 놓이므로 Accordion 트리거 안에 넣지 않고 새 종류 List/SectionHeader 조합으로 다룬다.

상태: default·hover·pressed·focus(2px 안쪽 링)·open·open+hover·open+focus·disabled(`fg-disabled`). 헤더 전체가 조작 영역이고 긴 제목은 줄바꿈한다.

다크: 토큰 그대로 — 구분선·상자 경계가 다크 캡처에서 보인다.

모바일: 치수 같음. 본문은 페이지 본문 글자(16/24)를 물려받는다.

A와 다른 점: 치수·조합 모두 A와 같다. B는 목록 섹션 그룹과의 역할 구분을 노트로 더한다.

구현 수준: 토큰/CSS — 논리 속성 전환만, 새 expand 로직 불필요.

Storybook: `Mockups/Flex/Navigation/Accordion` (Compare)

## Collapsible `collapsible`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | ---: | --- | --- | --- |
| 트리거 | 여백 4·8 · r4 · 간격 4 | 같음 D | 같음 D | 현재 값 |
| 본문 위 여백 | 소비자 몫(기존 스토리 8) | 12 C / 12 C | 8 D / 8 D | 소비자 몫 유지 |
| 모바일 조작 높이 | 없음 | — / 44 이상 C | — / 44 이상 C | 터치 조작 영역 44 |

B 외관: 작은 ghost 트리거(`fg-neutral`, hover `bg-transparent-hover`, r4) + chevron. "상세 옵션"처럼 낮은 우선순위 정보만 접고, 주 행동(발행)은 접힌 영역 밖에 둔다. 숨긴 내용은 `inert`로 탭 순서에서 빠진다.

상태: default·hover·pressed·focus(2px 링, offset 2)·open·disabled.

다크: 토큰 그대로.

모바일: 트리거 최소 높이 44(C) — 작은 문구의 조작 영역만 넓히고 글자·여백은 그대로 둔다.

A와 다른 점: A는 본문 위 여백을 후보 8~12 중 12로 둔다. B는 소비자 몫 8을 유지한다. 모바일 44는 두 안이 같다.

구현 수준: 토큰/CSS.

Storybook: `Mockups/Flex/Navigation/Collapsible` (Compare)

## 검증과 남은 문제

- 검증한 것: Storybook 타입 검사, 일곱 Compare의 데스크톱·모바일·다크 캡처 확인.
- **DDS 버그(발견)**: Collapsible.Content는 `scrollHeight`로 높이를 다시 재고 ResizeObserver를 자기 자신에 건다. 고정 높이 요소의 `scrollHeight`는 자기 높이 아래로 내려가지 않아, 폭이 좁아졌다 넓어지면 열린 본문 아래에 빈 공간이 남는다(Accordion도 같다). 재현: `accordion--state-matrix`에서 뷰포트 800→280→800, 마지막 항목 상자 73px·내용 35px. Playwright 전체 페이지 캡처가 이 경로를 밟아 Accordion·Collapsible 비교 캡처는 처음부터 큰 뷰포트로 찍었다. 패키지 수정은 이 작업 범위 밖이다.
- 미검증: 하위 메뉴 키보드 계약(A Sub API), 체크·토글 항목의 role(`menuitemcheckbox`), 메뉴 머리·발의 스크린리더 낭독, 탭 흐림 폭 32px, 모바일 뒤로가기·페이지 링크의 터치 44 미달, 실기기.
