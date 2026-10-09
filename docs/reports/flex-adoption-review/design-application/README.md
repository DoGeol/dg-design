# 컴포넌트별 디자인 적용안

2026-10-08 · React 0.17.3 / tokens 0.8.0 기준 · **구현 전 제안**

기존 [적용 검토](../README.md)의 “무엇을 확장할까”에서 한 단계 내려가, 각 컴포넌트의 현재 CSS와 바뀔 외형·상태·모바일 조합을 비교했다. 38개 공개 subpath를 빠짐없이 다룬다.

| 문서 | 대상 |
| --- | --- |
| [입력·선택 12개](forms.md) | Button, Field, TextField, TextArea, Checkbox, RadioGroup, Switch, Slider, Select, MultiSelect, DatePicker, FileInput |
| [탐색·메뉴 7개](navigation.md) | Tabs, DropdownMenu, ContextMenu, Breadcrumb, Pagination, Accordion, Collapsible |
| [표면·레이어 7개](surfaces.md) | Dialog, Sheet, Popover, HoverCard, Tooltip, Card, Separator |
| [데이터·피드백 12개](data-feedback.md) | Table, DataTable, Avatar, Badge, NotificationBadge, Alert, Toast, StatePanel, SaveStatus, Progress, Spinner, Skeleton |
| [소스 근거](source-evidence.json) | CSS 파일 해시·현재 치수 선언과 줄 번호. computed style 측정은 아님 |

## 적용했을 때의 전체 인상

흰 기본 표면과 중성 구분을 중심으로 두고 블루는 행동·선택·포커스에 집중한다. 객체 행은 평평하게 정렬하고, 부유 패널에만 깊이를 둔다. 입력·값 선택·명령 메뉴는 여백 리듬을 공유하되 서로 다른 역할이 보이게 만든다. 모바일은 여유 있는 필드와 하단 행동 영역으로 재조합한다.

브랜드 hex를 모든 CSS에 넣지 않는다. 기존 `bg-layer-default`, `fg-neutral`, `fg-neutral-weak`, `bg-brand-solid`, `stroke-focus-ring` 등의 semantic 토큰을 소비한다. 앱 블루와 패키지 기본색을 통일할지는 [색상 정책](../tokens.md)에서 별도로 결정한다.

## 수치 읽는 방법

- **현재**: 코드의 선언값. 실제 높이는 border-box, 줄바꿈, 소비 앱 CSS에 따라 달라질 수 있다.
- **제안**: 모두 C(응용 설계)다. fx/fxm의 공식 숫자로 간주하지 않는다. 기존값을 유지하자는 판단도 포함한다.
- `r8`은 반경 8px, `p12`는 padding 12px를 뜻하는 문서 약칭이다. 공개 토큰/API 이름이 아니다.
- 데스크톱/모바일은 검토 프로필이다. 화면 폭만으로 기존 `size` prop을 덮어쓰는 API를 제안하지 않는다.

| 역할 | 데스크톱 제안 | 모바일 제안 |
| --- | --- | --- |
| 일반 입력/선택 트리거 | min-height 40, inline inset 12, r6 후보 | min-height 56, inset 16, r16 후보 |
| 일반 버튼/주 CTA | 기본 36/40/52 유지, 역할상 필요할 때 CTA 48 추가 | CTA 52/r12, 일반 행동은 문맥별 |
| 입력 간격 / 그룹 간격 | 12 / 24 | 14 / 28 |
| 선택 패널 | r14, inset 8, option r6 | 같은 값 모델을 Sheet 안에 배치 |
| 명령 메뉴 | r12, inset 6, item r6 | 행 min-height 48 후보, 명시적 트리거 |
| 폼 바깥 페이지 여백 | 32 후보 | 20 후보 + safe area |

48px 메뉴 행·44px 터치 영역 등 추가 값은 이번 검토의 DDS 적용 후보이며 flex 실측이나 WCAG의 단일 의무값이 아니다. 작은 시각 요소는 그대로 두고 조작 영역을 넓힐 수 있으나 인접 대상과 겹치면 안 된다.

기존 8px 필드 반경을 6px로 즉시 전역 교체하지 않는다. 역할 토큰을 먼저 연결하고, 동일한 폼을 r8/r6 후보로 비교해 최종 결정한다. 얇은 라인형 필드도 테두리 제거만으로 만들지 않고 label·value·error·focus 영역을 함께 정한다.

## 세 가지 구현 수준

| 수준 | 예 | 진행 방법 |
| --- | --- | --- |
| 토큰/CSS로 가능 | Button, Badge, Avatar, Alert의 치수·색 역할 | 기존 DOM/기능을 유지하며 적용 |
| 기존 API에 조합 추가 | Select 트리거, 풍부한 option, Menu.Sub, Dialog 레이아웃 | 타입·접근성·키보드·ref 계약을 함께 설계 |
| 새 공용 종류 또는 앱 조합 | List, Chip, PropertyField, FilterBar | 실제 소비자에서 검증한 뒤 승격 |

어떤 경우에도 이미지의 외형만으로 기존 상태나 값을 삭제하지 않는다. fx에서 직접 확인하지 못한 Spinner·Toast 등의 디자인은 DDS 토큰 정렬 제안으로만 취급한다.

## 부족한 종류의 구체적인 외형 후보

| 후보 | 조합과 디자인 | 경계 |
| --- | --- | --- |
| List | leading Avatar/아이콘 → 제목+메타데이터 → trailing 상태/메뉴. 한 줄/두 줄에 따라 min-height56/64 비교, inset12–16 후보 | 바깥 행은 구조용, 제목 링크와 메뉴 버튼은 별개. DataTable이나 listbox 의미를 강제하지 않음 |
| Chip | 약한 중성 표면, label+선택적 제거 버튼. 시각 높이28/32, r8 후보 | 읽기 전용 Badge와 구분. 필터 toggle과 제거형 chip은 서로 다른 동작. 작은 제거 버튼의 실제 영역과 인접 chip 간섭 검증 |
| PropertyField | label + 현재 value/placeholder + caret/accessory. 필드와 같은40/56 높이·반경, 모바일은 내부 label 조합 후보 | 텍스트 입력이 아닌 선택 트리거. 버튼/검색 input의 의미를 목적에 맞춰 제공하고 열림·선택값·복귀를 연결 |

이 세 종류도 공용화 전 실제 두 사용처로 검증한다. 먼저 구현할 합성 예시는 사람 선택, 블로그 객체 목록, 이력서 버전 선택이다. 업무 데이터/발행/삭제는 DDS 밖에 둔다.

## 첫 시각 검증 묶음

1. **폼**: Field + TextField + Select + Button. 기본/오류/readonly/disabled/loading, 긴 한글.
2. **사람 선택**: Avatar + MultiSelect + Chip. 선택됨·탐색 중·검색 없음·생성 실패를 한 화면에서 비교.
3. **객체 목록**: List 후보 + Badge + DropdownMenu. 행 열기와 우측 보조 행동을 분리.
4. **작업 패널**: Dialog + 폼 + Aside → 좁은 화면 Sheet. 스크롤과 Footer 유지.
5. **비교 표**: Table/DataTable + Tabs + 필터. 선택·정렬·가상화의 치수 일치 확인.

375px/390px/768px/1280px는 검증용 폭 후보이며 flex breakpoint가 아니다. light/dark, 200% 글자 확대, 키보드/터치에서도 비교한다. 이번 결과는 CSS·API 기반 검토다. **브라우저 렌더링·실기기 조작·새 시안 이미지는 Not verified / 미생성**이며 구현 승인이나 시각 QA 통과 판정이 아니다.
