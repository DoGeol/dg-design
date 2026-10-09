# 데이터·피드백 12개 · B 치수 명세

[공통 규칙·프로필](README.md) · [A 데이터·피드백](../../design-application/data-feedback.md) · [B 컴포넌트 비교](../components.md)

대상: Table, DataTable, Avatar, Badge, NotificationBadge, Alert, Toast, StatePanel, SaveStatus, Progress, Spinner, Skeleton + 비교 표 시나리오.

이 묶음은 원문 측정이 거의 없다. fx·fxm 원문에서 Table·Toast·Skeleton 등의 조형을 따로 추출하지 못했으므로 B는 **대부분 현재 DDS 값(D)을 그대로 쓴다.** B가 바꾸는 것은 숫자보다 조합이다 — 표와 목록의 선택 기준, 목록 leading 슬롯의 범위, 상태 Badge·선택 Chip·코드 표식의 구분, 폼 과업 안의 Alert 배치.

표의 역할 행은 [profiles.ts](../../../../../apps/storybook/src/mockups/flex/profiles.ts) 값 그대로다. 역할이 없는 컴포넌트 고유 값은 Storybook 치수표의 `extra` 행과 같은 값이며 근거 칸 첫 글자가 등급이다. 모바일 칸이 데스크톱과 같으면 profiles.ts에 모바일 값이 따로 없다는 뜻이다.

## Table `table`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 표 한 줄 행 높이 `table-row` | 44 | 44 C / 44 C | 44 D / 44 D | 측정 없음 |
| 셀 여백 | 12 / 16 | 12 / 16 | 12 / 16 | D 현재 값(A·B 공통) |
| 머리글 글자 | 13/18 bold | 같음 | 13/18 bold · fg-neutral-weak | D 현재 값 |
| 본문 글자 | 14/19 | 같음 | 14/19 · fg-neutral | D 현재 값 |
| 숫자 열 | 왼쪽 정렬 | 끝 정렬 + tabular-nums | 끝 정렬 + tabular-nums | C 비교 가독성(A·B 공통) |
| 행 구분 · hover | 1px · 투명 hover | 같음 | 1px stroke-neutral-weak · bg-transparent-hover | D 현재 값 |

B 외관: 흰 `bg-layer-default` 위 평평한 행. 머리글 `fg-neutral-weak`, 본문 `fg-neutral`, 행 아래 1px `stroke-neutral-weak`만 둔다. 셀 카드·세로선 없음. 숫자 열은 머리글과 셀 모두 끝 정렬 + `font-variant-numeric: tabular-nums`, 합계 행(`tfoot`)도 같은 끝선.
상태: hover는 중성 투명 표면(`bg-transparent-hover`). 행 기본 행동이 없으면 pressed 없음. 스크롤 영역에 이름·tabIndex를 주면 2px 포커스 링(`stroke-focus-ring`, offset 2). 빈 결과는 표 안 한 줄 `fg-neutral-weak`.
다크: 행 구분선과 hover 표면이 `bg-layer-default` 위에서 보이는지 확인함. 숫자 정렬은 색과 무관.
모바일: 비교 표는 카드 블록으로 바꾸지 않고 가로 스크롤을 유지한다(시안 최소 폭 520). 머리글이 좁으면 두 줄로 꺾인다 — 열 최소 폭은 앱이 정한다. **사람·문서를 훑고 여는 화면이면 표 대신 List**를 쓴다.
A와 다른 점: 치수·외관은 A와 같다. B는 "언제 표를 쓰는가"(다열 비교일 때만)를 선택 기준으로 먼저 둔다.
구현 수준: 토큰/CSS — 숫자 열 정렬은 셀 className 조합으로 충분하다.
Storybook: `Mockups/Flex/DataFeedback/Table` (Compare)

## DataTable `data-table`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 표 한 줄 행 높이 `table-row` | 44 | 44 C / 44 C | 44 D / 44 D | 측정 없음 |
| comfortable 행 | — | 52 C | — | B 없음 — A만 두 번째 밀도 |
| 선택 열 폭 | 44 | 44 | 44 | D 현재 값(JS pin offset과 공유) |
| 머리글 필터 | 32 · r8 | 같음 | 32 · r8 | D 현재 값 |
| hover 표면 | 고정 열 neutral-weak · 나머지 transparent-hover | 행 전체 bg-neutral-weak | 행 전체 bg-neutral-weak | C 고정 열 불투명 표면과 한 톤(A·B 공통) |
| 선택 행 표면 | brand-weak (hover 시 고정 열만 neutral-weak) | brand-weak → hover brand-weak-hover | brand-weak → hover brand-weak-hover | C 선택+hover 조합 유지(A·B 공통) |
| 숫자 셀 | 왼쪽 정렬 | 끝 정렬 + tabular-nums | 끝 정렬 + tabular-nums | C — 머리글 정렬은 DataColumn align 보완 필요 |
| toolbox | 없음 | 외부 Toolbar | 앱 조합(결과 수·초기화) | 비교 표 시나리오 참조 |

B 외관: Table과 같은 표면·선. 선택 행은 체크 + `bg-brand-weak`. 머리글 체크박스는 일부 선택이면 indeterminate. 정렬 중인 열만 머리글 글자를 `fg-neutral`로 진하게.
상태: hover(행 전체 `bg-neutral-weak`), selected, **selected + hover**(고정 열까지 `bg-brand-weak-hover`, 체크 유지), 머리글 indeterminate, 정렬 버튼 focus 2px 링, 필터 입력 focus는 테두리 1px + 안쪽 1px, empty("표시할 데이터가 없습니다." 한 줄).
다크: **현재 DDS는 선택 행에 hover가 겹치면 고정 열만 회색으로 바뀌어 행이 두 색으로 갈린다**(고정 열 hover 규칙이 선택 규칙보다 구체적). 다크에서 더 뚜렷하다. A·B 모두 행 전체를 한 톤으로 묶는다.
모바일: 표 가로 스크롤 유지, 제목 열만 왼쪽 고정. 오른쪽 고정 열은 좁은 폭에서 끝 정렬 숫자를 덮으므로 시안에서는 쓰지 않았다.
A와 다른 점: A는 compact 44 / comfortable 52 두 밀도를 두고 밀도 전환 시 CSS와 `virtual.rowHeight`·고정 열 offset·colgroup을 함께 바꾸는 API 계약을 제안한다. B는 행 44 하나만 쓰고 검색·필터 toolbox를 공용 API가 아닌 앱 조합으로 둔다. 선택 표면·hover·숫자 정렬은 A와 같다.
구현 수준: 토큰/CSS(선택+hover·hover 톤) + 조합 API(숫자 머리글 정렬은 `DataColumn`에 align 옵션이 없어 CSS만으로 불가) — 행 높이는 `virtual.rowHeight` prop과 같은 값이어야 해서 CSS만 바꾸면 스페이서 계산이 어긋난다.
Storybook: `Mockups/Flex/DataFeedback/DataTable` (Compare)

## Avatar `avatar`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 목록 두 줄 행 높이 `list-row-2` | — | 64 C / 64 C | 56 C / 64 C | DS014 행 pitch 98.5÷1.75=56.3 (교차 배율) · 모바일: M017 사람:값 행 1.27배, 토큰 x16 |
| 목록 한 줄 행 높이 `list-row-1` | — | 56 C / 56 C | 48 C / 56 C | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| leading과 본문 간격 `list-leading-gap` | — | 12 C / 12 C | 8 C / 8 C | DS017 14÷1.75=8 (교차 배율) |
| 크기 | 24 / 36 / 48 / 64 | 같음 | 24 / 36 / 48 / 64 | D 현재 값(A·B 공통) |
| 이니셜 글자 | 11 / 13 / 16 / 20 bold | 같음 | 11 / 13 / 16 / 20 bold | D 현재 값 |
| 외곽선 | 1px | 같음 | 1px stroke-neutral-weak | D 현재 값 — 사진과 fallback 면적 일치 |
| 썸네일 leading | — | — | 36 · r8 · bg-neutral-weak | C 같은 행 Avatar 크기 · 반경은 D radius-r2 |
| 도메인 표식 | — | — | Badge large outline 24 | D 현재 Badge 재사용 · 글자 고정폭 |

B 외관: 원형 Avatar는 사람에게만 쓴다. 목록 leading 슬롯은 세 가지를 받는다 — 사람은 원형 Avatar 36, 문서는 사각 썸네일 36·r8(`bg-neutral-weak` + `fg-neutral-weak` 단일 stroke 아이콘), 도메인 값은 코드 표식(Badge large outline, 고정폭 글자, `stroke-neutral` 경계). 셋 다 36px 칸에 맞춰 본문 시작선을 같게 둔다. 본문은 제목 14/19 bold + 메타 13/18 `fg-neutral-weak`.
상태: 이미지 없음·실패 → 같은 자리에 이니셜 fallback(`bg-neutral-weak`). 코너 표식은 NotificationBadge dot을 `Avatar.Badge`에 얹는다(role=img + 이름).
다크: fallback 표면과 1px 외곽선이 `bg-layer-default` 위에서 구분되는지 확인함. 썸네일 칸도 같은 표면.
모바일: 행 높이를 64로 늘려도 Avatar는 36 그대로 둔다. leading 간격 8, 행 좌우 16.
A와 다른 점: A는 원형 Avatar의 문맥별 크기(선택 행 24/36, 객체 목록 36/48, 상세 64)와 leading 간격 12·행 64를 정한다. B는 크기 규칙보다 leading 슬롯의 범위(이미지·Avatar·도메인 표식)를 넓히고, 행·간격은 측정값(56·8·12)을 쓴다.
구현 수준: 조합 API — 새 Avatar API가 아니라 List 행의 leading 슬롯 조합이다(List는 new-kinds 묶음).
Storybook: `Mockups/Flex/DataFeedback/Avatar` (Compare)

## Badge `badge`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| Chip 높이 `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| Chip 반경 `chip-radius` | 6 | 8 C / 8 C | 6 D / 6 D | 측정 없음, 현재 chip 유지 |
| Badge medium | 20 · r4 · 좌우 6 · 11 | 같음 | 20 · r4 · 좌우 6 · 11 | D 현재 값(A·B 공통) |
| Badge large | 24 · r6 · 좌우 8 · 12 | 같음 | 24 · r6 · 좌우 8 · 12 | D 현재 값(A·B 공통) |
| 기본 variant | weak | weak | weak | D 현재 기본값 |
| Chip 선택 | — | brand-weak · fg-brand + 체크 | brand-weak · fg-brand + 체크 | C 선택은 브랜드, 색 외 표식 동반 |
| 코드 표식 | — | — | outline · 고정폭 글자 | C DS018 코드 배지 — 크기는 D Badge 재사용 |

B 외관: 세 가지를 구분한다. **상태 Badge**는 읽기 전용, intent별 weak(`bg-{intent}-weak` + `fg-{intent}`), 의미가 다른 상태는 글자로 구분. **선택 Chip**은 누르는 필터(`aria-pressed`), 기본 `bg-neutral-weak`, 선택 `bg-brand-weak` + `fg-brand` + 체크 아이콘. **코드 표식**은 도메인 값 설명(예: FE-102), outline + 고정폭 글자 + `stroke-neutral` 경계.
상태: Badge는 hover·focus 없음, 긴 글자는 `truncate`. Chip은 default·hover·selected·selected+hover(`bg-brand-weak-hover`)·focus(2px 링)·disabled.
다크: weak 표면과 outline 경계가 다크에서 보이는지 확인함. 선택 Chip의 brand-weak 대비 확인함.
모바일: Chip 32. Badge는 그대로. Badge에 제거 버튼을 넣지 않는다.
A와 다른 점: A도 Badge와 Chip을 나누지만 Chip은 28·r8이고 코드 표식 구분은 없다. B는 Chip 24·r6(현재 비공개 chip 반경 유지)과 코드 표식을 더한다. Badge 자체는 A와 같다.
구현 수준: Badge는 소비자 사용 규칙, Chip은 새 종류(new-kinds Chip 정의를 따른다), 코드 표식은 토큰/CSS — Badge outline에 글자만 바꾼 조합.
Storybook: `Mockups/Flex/DataFeedback/Badge` (Compare) — Chip은 Button small에 chip 역할 치수를 얹은 자리 표시이며 실제 Chip 시안은 new-kinds.

## NotificationBadge `notification-badge`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| dot | 6 원 | 같음 | 6 원 | D 현재 값(A·B 공통) |
| count | 최소 18 × 18 · 좌우 4 · 11 bold | 같음 | 최소 18 × 18 · 좌우 4 · 11 bold | D 현재 값(A·B 공통) |
| max | 99 → 99+ | 같음 | 99 → 99+ | D 현재 기본값 |
| 색 | critical solid · brand solid | 같음 | critical solid · brand solid | D 현재 값 |

B 외관: 글로벌 알림(헤더 벨 아이콘 코너의 count)과 객체 상태(목록 행 제목 앞 dot)를 구분해 배치한다. 업무 상태는 상태 Badge가 맡고 둘을 한 표식으로 합치지 않는다.
상태: 독립 터치 대상이 아니다. 아이콘 코너 배지는 `aria-hidden`, 건수는 부모 버튼 이름("알림 12개")이 읽는다. 두·세 자리는 캡슐로 늘어난다.
다크: critical·brand solid 위 contrast 글자 확인함.
모바일: 아이콘 버튼 조작 영역은 버튼이 갖는다. 배지 위치는 버튼 기준 소비자 조합.
A와 다른 점: 치수·조합 모두 A와 같다. B는 글로벌/객체 구분 배치를 예시로 더했을 뿐이다.
구현 수준: 토큰/CSS — 위치는 소비자 조합.
Storybook: `Mockups/Flex/DataFeedback/NotificationBadge` (Compare)

## Alert `alert`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 같은 묶음 필드 간격 `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| 여백 · 반경 | 16 · r8 | 같음 | 16 · r8 | D 현재 값(A·B 공통) |
| 아이콘 · 간격 | 20 · 8 | 같음 | 20 · 8 | D 현재 값 |
| 제목 / 설명 | 14/19 bold · 13/18 | 같음 | 14/19 bold · 13/18 | D 현재 값 |
| 행동 | 한 줄 · 위 8 · 사이 8 | 줄바꿈 허용 · 위 8 · 사이 8 | 줄바꿈 허용 · 위 8 · 사이 8 | C 좁은 폭 겹침 방지(A·B 공통) |
| 배치 | 폼 상단 | 폼 상단 | 관련 필드 바로 아래 | C B 원문 우선 — 폼 과업 안 배치 |

B 외관: intent별 weak 표면(`bg-{intent}-weak`) + `fg-{intent}` 아이콘·글자. 큰 안내에 solid 브랜드 없음. 정책·주의 Alert는 해당 필드 바로 아래(`field-gap` 간격), 실패·복구 Alert는 저장 행동 바로 위.
상태: critical만 `role="alert"`, 나머지 `role="status"`. 닫기 버튼 hover `bg-transparent-hover`, focus 2px 링. 행동은 본문 아래에서 줄바꿈.
다크: weak 표면이 `bg-layer-default`와 구분되는지, warning 글자 대비 확인함.
모바일: 260px 폭에서 현재는 행동 두 개가 닫기 버튼 쪽으로 밀린다. A·B는 줄바꿈한다. 필드 간격 14.
A와 다른 점: 치수와 외관은 A와 같다. 배치가 다르다 — A는 폼 위에 안내를 모으고, B는 관련 필드 옆에 둔다.
구현 수준: 토큰/CSS(행동 줄바꿈) + 소비자 배치 규칙.
Storybook: `Mockups/Flex/DataFeedback/Alert` (Compare)

## Toast `toast`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 주요 CTA 높이 `cta-height` (겹침 확인용) | 52 | 48 C / 52 C | 48 B / 52 B | DS024 85÷1.75=48.6 · 모바일: M020 68×0.75=51 |
| viewport | 오른쪽 아래 16 · 폭 min(384, 100vw − 32) | 같음 | 같음 | D 현재 값(A·B 공통) |
| 쌓임 | 간격 8 · 최대 3개 | 같음 | 같음 | D 현재 값 |
| 항목 | 여백 12/16 · r12 · overlay 그림자 | 같음 | 같음 | D 현재 값 |
| 제목 / 설명 | 13/18 bold · 12/16 | 같음 | 같음 | D 현재 값 |
| 되돌리기 행동 | View에만 있음 | useToast 옵션으로 공개 | useToast 옵션으로 공개 | C 조합 API 보완(A·B 공통) |
| 다크 경계 | 없음 | 없음 | 없음 — weak 표면 + 그림자 | layer 위는 확인 · neutral-weak 표면 위 겹침은 미검증 |

B 외관: 현재 작은 weak 피드백 그대로. 결과를 짧게 쓰고 되돌리기처럼 꼭 필요한 글자 행동만 붙인다(밑줄, intent 글자색 상속). 일반 Popover 같은 흰 패널·테두리를 강제하지 않는다.
상태: 5초 자동 닫힘, hover·focus 중 정지, 닫기 2px 링, critical만 `role="alert"`. 모달 inert 예외 유지.
다크: weak 표면과 그림자로만 떠 있다. 다크 `bg-layer-default` 위에서는 보였다. 같은 `bg-neutral-weak` 표면 위에 겹칠 때는 미검증 — 부유 패널 1px 경계 규칙과 충돌하는지 따로 판정이 필요하다.
모바일: viewport 기본 위치(아래 16)는 하단 고정 CTA를 덮는다. 앱이 CTA 높이 + safe area만큼 올린다. 폭은 화면 − 32.
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 조합 API — 되돌리기 action은 현재 `Toast.View`에만 있고 `useToast` 옵션(`ToastOptions`)에는 없다.
Storybook: `Mockups/Flex/DataFeedback/Toast` (Compare) — Provider viewport는 iframe 높이에 잡히지 않아 같은 마크업(`Toast.View`, live 끔)을 흐름 안에 쌓았다.

## StatePanel `state-panel`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 최소 높이 | 256 (16rem) | 같음 | 256 (16rem) | D 현재 값(A·B 공통 · 페이지 상태) |
| 여백 · 반경 | 24/16 · r12 | 같음 | 24/16 · r12 | D 현재 값 |
| 제목 / 설명 | 16/22 bold · 13/18 | 같음 | 16/22 bold · 13/18 | D 현재 값 |
| 아이콘 아래 · 행동 위 | 12 · 16 | 같음 | 12 · 16 | D 현재 값 |
| 작은 패널 | minHeight={0} | compact: 최소 높이 없음 · 여백 16/12 · 제목 14/19 bold · 아이콘 아래 8 · 행동 위 12 (C) | minHeight={0} | D 기존 prop |

B 외관: `bg-neutral-weak` 표면, 아이콘 `fg-neutral-weak` → 제목 `fg-neutral` → 설명 `fg-neutral-weak` → 행동 → Footer(진단 코드). 검색 결과 없음은 "조건 초기화"(neutral weak), 데이터 없음은 "첫 글 쓰기"(brand solid)로 다음 행동을 나눈다.
상태: empty(검색 결과 없음 / 데이터 없음), error(`role="alert"` + 다시 시도 + 오류 코드 Footer), loading(`StatePanel.Loading`, Spinner medium).
다크: neutral-weak 표면이 페이지와 구분되는지, 작은 부유 패널의 1px `stroke-neutral-weak` 경계 확인함.
모바일: 오류·로딩은 한 열로 쌓는다. 작은 패널에서 최소 높이가 현재 작업을 밀어내지 않게 `minHeight={0}`.
A와 다른 점: A는 작은 선택기·패널용 compact 조합(여백 16/12, 제목 14, 간격 8·12 — 모두 C, 미측정)을 둔다. B는 새 크기 없이 기존 `minHeight` prop만 쓴다. 페이지 상태는 A와 같다.
구현 수준: 토큰/CSS — B는 기존 prop, A의 compact는 크기 옵션 추가가 필요하다.
Storybook: `Mockups/Flex/DataFeedback/StatePanel` (Compare)

## SaveStatus `save-status`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 글자 | 12/16 · fg-neutral-weak | 같음 | 같음 | D 현재 값(A·B 공통) |
| 아이콘 · 간격 | 16 · 4 | 같음 | 같음 | D 현재 값 |
| 색 | dirty warning · error critical · 나머지 neutral-weak | 같음 | 같음 | D 현재 값 |
| 완료 전환 | saving → saved 150ms 교차 페이드 | 같음 | 같음 | D 현재 값 |

B 외관: 편집 헤더에서 저장 버튼 바로 옆, 작은 글자. 성공할 때마다 녹색 Badge로 바꾸지 않는다. 긴 실패 설명은 헤더 아래 critical Alert로.
상태: dirty·saving·saved·error. error만 `role="alert"`. 아이콘과 문구를 항상 같이 써서 색만으로 나르지 않는다.
다크: warning·critical 글자 대비 확인함.
모바일: 헤더 공간이 좁아도 실패 상태를 숨기지 않는다(시안은 미리보기 버튼을 빼고 저장 상태는 남김).
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 소비자 배치 규칙.
Storybook: `Mockups/Flex/DataFeedback/SaveStatus` (Compare)

## Progress `progress`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 트랙 | 6 · r-full · bg-neutral-weak | 같음 | 같음 | D 현재 값(A·B 공통) |
| 채움 | bg-brand-solid · width 전환 base | 같음 | 같음 | D 현재 값 |
| indeterminate | 40% 막대 왕복 · reduced motion 정지 | 같음 | 같음 | D 현재 값 |
| 라벨 줄 | — | 13/18 · 값 tabular-nums · 트랙과 간격 8 | 같음 | C 앱 조합(A·B 공통) |

B 외관: 라벨(범위 — "이미지 3개 중 2개 올림")은 시작선, 퍼센트는 끝선 `fg-neutral-weak` + tabular-nums. 진행률을 알 때만 퍼센트를 쓴다.
상태: determinate, indeterminate, error(바는 그대로, 아래에 `fg-critical` 문구 + 다시 시도), 완료. 라벨은 `aria-labelledby`로 연결.
다크: 트랙 `bg-neutral-weak`가 다크 표면 위에서 보이는지 확인함.
모바일: 전체 작업인지 파일 하나인지 문구로 밝힌다. 배치 동일.
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 소비자 조합 — 라벨 줄은 앱 몫.
Storybook: `Mockups/Flex/DataFeedback/Progress` (Compare)

## Spinner `spinner`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 크기 | 16 / 20 | 같음 | 16 / 20 | D 현재 값(A·B 공통) |
| 선 · 회전 | 2 · 1000ms linear | 같음 | 같음 | D 현재 값 |
| 색 | currentColor | 같음 | currentColor (본문은 fg-neutral-weak) | D 현재 값 · 사용 규칙 |

B 외관: 버튼 안은 버튼 글자색(기존 loading이 폭 유지), 본문 대기는 `fg-neutral-weak` + 상태 문구. 작은 로딩마다 브랜드 색을 쓰지 않는다.
상태: 라벨이 있으면 `role="status"`, 버튼 안에서는 장식(aria-hidden)이고 버튼이 aria-busy를 갖는다. reduced motion에서 정지.
다크: currentColor라 문맥 글자색을 따른다. 확인함.
모바일: Spinner만으로 오래 대기하지 않게 문구를 둔다.
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 사용 규칙.
Storybook: `Mockups/Flex/DataFeedback/Spinner` (Compare)

## Skeleton `skeleton`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 목록 두 줄 행 높이 `list-row-2` | — | 64 C / 64 C | 56 C / 64 C | DS014 행 pitch 98.5÷1.75=56.3 (교차 배율) · 모바일: M017 사람:값 행 1.27배, 토큰 x16 |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| leading과 본문 간격 `list-leading-gap` | — | 12 C / 12 C | 8 C / 8 C | DS017 14÷1.75=8 (교차 배율) |
| 반경 | none / 8 / 12 / full | 같음 | none / 8 / 12 / full | D 현재 값(A·B 공통) |
| 표면 · shimmer | bg-neutral-weak · weak-hover 1000ms | 같음 | 같음 | D 현재 값 |
| 글줄 높이 | — | 14 / 12 | 14 / 12 (본문·보조 글자 크기) | C 실제 글자 크기 예고 |

B 외관: 실제 행의 Avatar(full 36)·글줄 두 개·행 여백을 그대로 예고한다. 로딩 행과 실제 행이 같은 `list-row-2`를 써서 로드 뒤 시작선과 높이가 바뀌지 않는다. Card 자리는 같은 반경(medium = r12).
상태: loading → loaded. reduced motion에서 shimmer 정지. 무기한 유지하지 않고 empty·error로 넘어간다.
다크: shimmer가 다크 `bg-neutral-weak` 위에서 보이는지 확인함.
모바일: 행 높이 64, 여백 16(목록 역할을 따름).
A와 다른 점: Skeleton 모양은 A와 같다. 행 높이·여백·간격은 B 목록 측정값(56·12·8)을 따른다.
구현 수준: 소비자 조합 — 새 모양 API 불필요.
Storybook: `Mockups/Flex/DataFeedback/Skeleton` (Compare)

## 비교 표 시나리오

Table/DataTable + Tabs + 필터 toolbox. 글 관리 화면 — 상태 탭(전체·발행·작성 중·보관, 건수 표시), 제목 검색, 댓글 조건 필터, 결과 수 + 조건 초기화, 선택 수 + 일괄 보관, 선택 가능한 DataTable.

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 표 한 줄 행 높이 `table-row` | 44 | 44 C / 44 C | 44 D / 44 D | 측정 없음 |
| 탭 최소 높이 `tab-height` | 36 | 40 C / 40 C | 36 D / 36 D | 측정 없음 |
| 탭 좌우 여백 `tab-inset` | 8 | 12 C / 12 C | 8 D / 8 D | 측정 없음 |
| 탭과 패널 간격 `tab-panel-gap` | 12 | 24 C / 24 C | 12 D / 12 D | 측정 없음 |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| Chip 높이 `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| 필터 형태 | Select 트리거 | Select 트리거 | Chip toggle (aria-pressed) | C B toolbox — Chip은 new-kinds 정의를 따름 |
| 결과 수 · 초기화 | 필터 줄 바로 아래 한 줄 | 같음 | 같음 · 조건 없으면 초기화 비활성 | C B toolbox 문서화 항목 |
| 선택 수 · 일괄 행동 | 결과 줄 오른쪽 · neutral weak small | 같음 | 같음 | C 앱 조합(세 안 공통) |
| 숫자 열 | 왼쪽 정렬 | 끝 정렬 + tabular-nums | 끝 정렬 + tabular-nums | DataTable과 같음 |

B: 이 화면은 조회수·댓글을 열끼리 견주므로 표를 고른다. 글을 훑고 여는 것이 목적이면 같은 데이터를 List 두 줄 행으로 둔다 — 모바일에서 객체 탐색이 주 과업이면 List가 기본이다. 필터는 Chip toolbox, 결과 수와 초기화는 바로 아래 한 줄, 행 높이는 현재 44.
A: compact 44 행(`--fx-table-row` = `virtual.rowHeight`), A 탭 치수(40·12·24), 외부 Toolbar에 검색·필터·선택 수·일괄 행동.
현재: 같은 부품으로 조합할 수 있으나 toolbar 배치 규칙이 없다.
다크: 선택 행·탭 활성 밑줄·Chip 선택 표면 확인함. 모바일: 검색과 필터가 한 줄, 표는 가로 스크롤(상태 열이 화면 밖).
Tabs 외관은 navigation 묶음 CSS를 따르고 이 시나리오는 Tabs 치수를 정하지 않는다.
Storybook: `Mockups/Flex/Scenarios/CompareTable` (Compare)

## 미검증

- 원본 이미지 배율 가정(H-desktop·H-mobile) 자체 — 이 묶음의 B 측정값은 목록 역할뿐이다.
- Toast가 같은 `bg-neutral-weak` 표면 위에 겹칠 때 다크 경계.
- 실기기 터치, 스크린리더 청취(배지 aria-hidden·live region), 200% 글자 확대에서 표 머리글 줄바꿈.
- 실제 이미지 로드 실패 경로(시안은 콘솔 오류를 피하려고 실패 이미지를 그리지 않고 fallback만 그렸다).
