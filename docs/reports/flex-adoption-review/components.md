# 컴포넌트 38개 비교

[검토 개요](README.md) · [API 상세](composition.md) · [토큰](tokens.md)

`유지`는 기존 기능을 보존하면서 역할 토큰·밀도·상태 표현을 정렬한다는 뜻이다. `확장`은 additive API 또는 DOM 구조 검토가 필요하다. 아래 경로는 실제 공개 subpath다. 블로그에서 직접 대응하는 예시가 없는 항목은 DDS 기능으로 유지한다.

## 기존 공개 컴포넌트

| subpath | 판정 | 적용 방향 |
| --- | --- | --- |
| `accordion` | 유지 | 제목·설명·prefix/suffix 기존 조합 활용. 그룹 간격과 구분선 정렬 |
| `alert` | 유지 | 안내/오류와 행동 slot 유지. 본문 상태와 작업 완료 상태 혼동 금지 |
| `avatar` | 유지 | 사람 행의 leading 요소로 재사용. 크기·badge 배치 규칙 정렬 |
| `badge` | 유지 | 비대화형 상태/분류 표시. 제거·토글 기능은 Chip과 구분 |
| `breadcrumb` | 유지 | 위치 탐색 유지. 상세 페이지/모달의 제목 계층과 조합 |
| `button` | 유지·선택 확장 | solid/weak/ghost, brand/neutral/critical 유지. 역할별 높이·반경 적용 |
| `card` | 유지 | 정보 묶음 표면으로 사용. 모든 행·구역을 카드로 감싸지 않음 |
| `checkbox` | 유지 | 독립 폼 입력/일괄 선택. MultiSelect 내부 표시는 비대화형 mark로 별도 처리 |
| `collapsible` | 유지 | 보조 정보 점진 공개. Accordion과 같은 역할로 중복 신설하지 않음 |
| `context-menu` | 확장 | Menu와 행동 문법 공유. 모바일에는 명시적 메뉴 진입점 제공 |
| `data-table` | 확장 | 데이터 정렬·필터·선택·가상화 유지. 외부 스타일/행 높이/고정 열 치수 계약 보완 |
| `date-picker` | 확장 | 단일/범위·날짜/시간·검증 재사용. 컨테이너와 트리거 선택권 보완 |
| `dialog` | 확장 | Toolbar/Body/Actions 또는 Footer/Aside 부품, 크기·스크롤 영역 추가 |
| `dropdown-menu` | 확장 | Trigger.asChild 유지. Sub 메뉴, 필요할 때 checkbox/radio 명령 추가 |
| `file-input` | 유지 | Trigger/Dropzone/Preview/Actions 활용. 업로드 비즈니스 로직은 앱 소유 |
| `field` | 확장 | label/description/error 연결 유지. 박스 안 라벨 등 layout 계약 보완 |
| `hover-card` | 유지 | 비필수 미리보기. 터치에서 필요한 정보는 Popover 등으로 접근 가능하게 조합 |
| `multi-select` | 확장 | 검색·생성·칩 재사용. 사각 체크 표시, 풍부한 행, 목록/보조 영역 분리 |
| `notification-badge` | 유지 | 건수/새 활동 표시. 상태 Badge나 선택 Chip으로 대체하지 않음 |
| `pagination` | 유지 | 목록/표 탐색. 현재 페이지·disabled·모바일 표기 정렬 |
| `popover` | 유지 | inline 선택/정보 패널 재사용. radius/inset 및 portal scope 검증 |
| `progress` | 유지 | 수치 진행률 표현. Spinner와 다른 의미 유지 |
| `radio-group` | 유지 | 기존 `variant="segmented"` 사용. 별도 SegmentedControl 신설 불필요 |
| `save-status` | 유지 | 저장 전/중/완료 의미 유지. 과업 완료·승인 상태와 분리 |
| `select` | 확장 | Trigger/Value/Caret 분리, label/textValue, 필요 시 검색 지원 |
| `separator` | 유지 | 그룹 경계에 사용. 모든 행에 강한 테두리 추가 금지 |
| `sheet` | 확장 | 4방향 유지. content-fit/full 높이·safe area·본문 스크롤·행동 영역 규칙 |
| `skeleton` | 유지 | 실제 콘텐츠 구조·밀도 반영. 임의 장식 블록으로 사용하지 않음 |
| `slider` | 유지 | 네이티브 입력 유지. Field와 값·설명 조합 |
| `spinner` | 유지 | 진행 중 의미·reduced motion 보존. 버튼 안 배치 정렬 |
| `state-panel` | 유지 | empty/error/loading 구조 재사용. 문구와 재시도 행동은 앱 소유 |
| `switch` | 유지 | 즉시 적용 설정의 상태 제어. 확인/저장이 필요한 선택과 구분 |
| `table` | 유지 | 네이티브 표 조합 유지. 헤더·본문·선택 상태 토큰 정렬 |
| `tabs` | 선택 확장 | 역할 토큰 적용. focus와 선택을 분리하려면 manual activation을 opt-in 추가 |
| `text-area` | 확장 | autoResize/showCount 유지. Field와 같은 box/line 계열 적용 |
| `text-field` | 확장 | prefix/suffix 유지. box/line·밀도·내부 라벨 조합 추가 검토 |
| `toast` | 유지 | 간결한 결과 피드백, live region·타이머·오버레이 우선순위 유지 |
| `tooltip` | 유지 | 짧은 보충 설명. 핵심 정보/행동을 Tooltip에만 두지 않음 |

각 엔트리와 CSS 파일은 [inventory.json](inventory.json)에 있다. DateRangePicker·Calendar 등은 `date-picker` 서브패스 내부에 포함된다.

## 종류가 맞지 않는 지점

| 필요한 역할 | 현재 상태 | 권고 형태와 범위 |
| --- | --- | --- |
| 객체 목록 List | Table/메뉴/선택기는 있지만 일반 객체 행 규약 없음 | List + Item + leading/main/trailing 구조. 기본은 목록 의미, 선택형 listbox 역할을 강제하지 않음 |
| 목록 구역 | 앱별 제목·설명·우측 행동 조합 | List.Section 또는 SectionHeader 후보. 실제 두 소비자의 구조를 먼저 비교 |
| 선택 Chip | MultiSelect 안의 비공개 chip, 비대화형 Badge | 제거/토글 의미를 가진 Chip 후보. Badge에 `onClick`만 붙여 대체하지 않음 |
| PropertyField | 텍스트 입력과 고정 Select Trigger 사이에 빈자리 | label/value/accessory를 가진 선택 트리거. readOnly TextField를 버튼처럼 위장하지 않음 |
| 계층형 명령 메뉴 | Root 단위 중첩 기반은 있지만 Sub API 없음 | 기존 DropdownMenu의 Sub/Trigger/Content 확장. 새 메뉴 시스템 불필요 |
| 작업형 모달 | Dialog 기본 표면과 Title/Description/Close | 기존 Dialog에 레이아웃 부품 추가. HR 전용 모달 신설 불필요 |
| 모바일 폼/선택 프리셋 | 부품은 있으나 조합 제약이 일정하지 않음 | 기존 부품의 허용 조합을 문서·예제로 고정. 코드젠/별도 headless 패키지는 불필요 |

List는 **대상**, Select는 **값**, DropdownMenu는 **행동**을 다룬다. 외형이 비슷해도 하나로 합치지 않는다. DS014(객체 행), DS017–018(선택), DS021–022(명령)의 차이를 적용한다.

## 공용화와 앱 조합의 경계

List의 실소비 후보는 dg-studio의 `homeground-blog/server.tsx` 목록과 `homeground-resume-versions/resume-version-list.tsx`다. 제목·메타데이터·우측 메뉴가 반복되는지 확인하고 공용 API를 확정한다. 링크/주 행동과 보조 버튼을 분리해 중첩 button/link를 만들지 않는다.

PageHeader·Toolbar·FilterBar는 우선 앱 조합으로 둔다. 글로벌 검색·캘린더 업무 화면·프로필·설정·리치텍스트 편집기는 서비스 패턴이다. flex 사례와 종류를 맞추기 위해 도메인 기능이나 편집기 의존성을 DDS에 넣지 않는다.

## 생성 시안과 코드의 차이

- Button 시안의 outline과 spinner 옆 “저장 중” 표기는 현 API가 아니다. 실제 필요가 있을 때만 variant/loadingLabel을 추가한다.
- Tabs 시안의 focus ≠ selected는 현 자동 활성화와 다르다. manual 모드 제안으로 취급한다.
- DataTable 선택 행을 흰색으로 그린 시안 때문에 현 연한 브랜드 배경을 제거하지 않는다. 선택의 식별성을 검증해 결정한다.
- fxm의 11개 타이포 역할은 11개의 새 글자 크기가 필요하다는 뜻이 아니다.
