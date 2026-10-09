---
name: dg-design
description: Use when writing or changing React UI that uses @dg-design/react (Dogeol Design System) — picking a component, wiring forms with Field, overlays (Dialog, Sheet, Popover, Menu), lists, tables, or applying tokens, dark mode and mobile density. Read the matching file in references/ before using a component.
---

# dg-design 사용 가이드

`@dg-design/react` 컴포넌트와 `@dg-design/tokens` 토큰으로 화면을 만들 때 쓴다. 컴포넌트를 쓰기 전에 아래 목록에서 해당 `references/*.md`를 읽는다 — 목적, 쓰지 말 때, 핵심 API, 접근성 주의, 타입 검사를 통과한 예제가 들어 있다.

**프로젝트 로컬 규칙이 먼저다.** 프로젝트 루트에 `dg-design.local.md`(설정 가이드가 만드는 파일)가 있으면 먼저 읽고, 이 스킬과 다르면 로컬 규칙을 따른다. 페이지 구조·layout·브랜드는 프로젝트 소유다. 이 스킬 파일은 고치지 않는다(패키지에서 온다).

## 설치와 로드

```sh
pnpm add @dg-design/react @dg-design/tokens
```

- 앱 진입점에서 토큰 CSS를 **한 번** 로드한다. 컴포넌트는 토큰 CSS를 import하지 않는다.
  ```ts
  import "@dg-design/tokens/tokens.css";
  ```
- 컴포넌트 CSS는 컴포넌트를 import하면 자동으로 따라온다. 직접 로드하지 않는다.
- import는 **하위 경로**로 한다: `import { Button } from "@dg-design/react/button";`. 배럴(`@dg-design/react`)은 번들러에 따라 쓰지 않는 CSS까지 싣는다.
- 두 패키지는 같이 올린다(react minor가 tokens minor를 요구한다).
- Tailwind를 쓰면 `@dg-design/tokens/tailwind.css`를 tokens.css 뒤에 로드하고, 진입점 CSS 맨 위에 `@layer dds, theme, base, components, utilities;`를 둔다. 유틸 이름은 `bg-bg-brand-solid`처럼 토큰 이름을 그대로 쓴다.
- 브랜드 색 교체는 tokens.css 대신 `createTheme({ brand: "#hex" })`가 만든 CSS(또는 `npx @dg-design/tokens --brand "#hex" -o dds-tokens.css`)를 로드한다.

## 테마와 밀도

- 다크: `<html data-dds-theme="dark">`. 하위 요소에 `data-dds-theme="light"|"dark"`를 붙이면 그 영역만 바뀐다.
- 밀도: 모바일 화면이면 앱 루트(`<html>`)에 `data-dds-density="mobile"`. **앱이 명시적으로 고른다** — 화면 폭으로 자동 전환하지 않는다. 입력·버튼·옵션·목록·Sheet 치수와 조작 영역 44px이 함께 바뀐다.
- 색·간격은 px·hex 대신 토큰을 쓴다: `var(--dds-color-fg-neutral)`, `var(--dds-space-field-gap)`, `var(--dds-dimension-x4)`. palette(`--dds-color-palette-*`)는 내부 구현이라 쓰지 않는다.

## layout 최소 권장

- 간격은 역할 토큰: 페이지 여백 `--dds-space-page-inset`, 필드 사이 `--dds-space-field-gap`, 묶음 사이 `--dds-space-group-gap`.
- 입력은 외부 라벨 outline이 기본이다(`Field.Label` + `TextField`). box·line(`variant`)·속성 행(`PropertyField`)은 모바일 상세 화면에서만 쓴다.
- 한 화면의 주 행동(brand solid Button)은 하나다.
- 조작 영역은 모바일 44px, 데스크톱 단독 대상 24px 이상.
- 목록 행 안에 버튼·링크를 중첩하지 않는다. 행의 주 행동과 끝 메뉴를 나눈다(`List` 참고).
- 부유 패널 경계·그림자, Sheet 모서리, focus 링 같은 외관은 컴포넌트 기본값이다. 덮어쓰지 않는다.
- 페이지 구조(헤더·사이드바·그리드)는 이 스킬이 정하지 않는다 — 프로젝트 로컬 규칙을 따른다.

## 공통 규칙

- compound 컴포넌트는 `Dialog.Content`(객체)와 `DialogContent`(named export) 둘 다 있다. **React 서버 컴포넌트 파일에서는 named export를 쓴다**(객체 속성 접근이 안 된다).
- 폼 입력은 `Field.Root` 안에 둔다. 라벨·설명·오류 id와 `aria-invalid`가 자동으로 연결된다. 오류는 `Field.ErrorMessage`를 렌더하면 켜진다(`invalid` prop이 따로 없다).
- 외관 조정은 `className`(+ 토큰)까지만 공개 계약이다. `.dds-*` 내부 클래스 이름을 선택자로 쓰지 않는다.
- 상태 알림: 실패만 `role="alert"`, 나머지는 `role="status"`. 컴포넌트(`Alert`, `Toast`, `SaveStatus`)가 이미 맞춰 둔다.

## 컴포넌트

<!-- components:start -->
| 컴포넌트 | import | 한 줄 |
| --- | --- | --- |
| [Accordion](references/accordion.md) | `@dg-design/react/accordion` | 제목 줄을 눌러 본문을 펼치는 항목 묶음. 기본은 한 번에 하나, `multiple`이면 여러 개. |
| [Alert](references/alert.md) | `@dg-design/react/alert` | 화면 안에 계속 남아 있는 인라인 메시지 박스. intent로 의미를 나눈다. |
| [Avatar](references/avatar.md) | `@dg-design/react/avatar` | 사람·프로젝트를 나타내는 원형 이미지. 이미지가 없거나 실패하면 Fallback이 대신 보인다. |
| [Badge](references/badge.md) | `@dg-design/react/badge` | 항목의 상태·분류를 짧게 알려 주는 읽기 전용 라벨. |
| [Breadcrumb](references/breadcrumb.md) | `@dg-design/react/breadcrumb` | 현재 페이지가 계층 어디에 있는지 보여 주고 상위로 이동시키는 경로 표시. |
| [Button](references/button.md) | `@dg-design/react/button` | 누르면 바로 실행되는 행동 하나. 주 행동은 brand solid, 나머지는 neutral weak·ghost. |
| [Card](references/card.md) | `@dg-design/react/card` | 관련 내용을 테두리 있는 면으로 묶는 단순 컨테이너. 스타일만 있고 구조는 없다. |
| [Checkbox](references/checkbox.md) | `@dg-design/react/checkbox` | 여러 항목 중 해당하는 것을 각각 켜고 끄는 체크박스. 부분 선택(indeterminate)을 지원한다. |
| [Chip](references/chip.md) | `@dg-design/react/chip` | 사용자가 고른 값을 보여 주는 Chip(제거 가능)과 켜고 끄는 필터 FilterChip. |
| [Collapsible](references/collapsible.md) | `@dg-design/react/collapsible` | 하나의 영역을 열고 닫는 최소 disclosure. 트리거 하나 + 내용 하나. |
| [ContextMenu](references/context-menu.md) | `@dg-design/react/context-menu` | 영역을 우클릭하면 그 지점에 뜨는 행동 메뉴 — DropdownMenu와 같은 항목 구성. |
| [DataTable](references/data-table.md) | `@dg-design/react/data-table` | 데이터 배열과 열 정의로 그리는 표. 정렬·필터·행 선택·열 고정·가상 스크롤을 내장한다. |
| [DatePicker](references/date-picker.md) | `@dg-design/react/date-picker` | 날짜(또는 날짜+시간) 하나를 입력·선택하는 필드. 기간은 DateRangePicker. |
| [Dialog](references/dialog.md) | `@dg-design/react/dialog` | 화면 위에 띄우는 모달 — 짧은 확인(기본)과 편집·검토 같은 작업형 패널(Toolbar·Body·Aside·Footer). |
| [DropdownMenu](references/dropdown-menu.md) | `@dg-design/react/dropdown-menu` | 버튼을 눌러 여는 행동(명령) 목록 — 항목, 체크, 라디오, 단축키 표시. |
| [Field](references/field.md) | `@dg-design/react/field` | 입력 컨트롤에 라벨·설명·오류 메시지를 묶어 id와 aria 연결을 자동으로 해 주는 래퍼. |
| [FileInput](references/file-input.md) | `@dg-design/react/file-input` | 파일 선택·드래그 앤 드롭 입력. 형식·크기·개수 검증을 하고 통과분과 거부분을 함께 알려 준다. |
| [FilterToolbox](references/filter-toolbox.md) | `@dg-design/react/filter-toolbox` | 적용된 필터 칩·결과 수·초기화를 한 줄에 놓는 필터 묶음의 껍데기. |
| [HoverCard](references/hover-card.md) | `@dg-design/react/hover-card` | 링크 위에 마우스를 올리면 뜨는 미리보기 카드 — 마우스 사용자를 위한 보조 정보. |
| [List](references/list.md) | `@dg-design/react/list` | 제목 + 메타 + 행 동작으로 이루어진 객체 목록. 행 전체가 주 행동, 보조 행동은 Trailing. |
| [MultiSelect](references/multi-select.md) | `@dg-design/react/multi-select` | 목록에서 여러 값을 고르는 드롭다운. 검색·새 항목 만들기·모바일 Sheet 표시를 지원한다. |
| [NotificationBadge](references/notification-badge.md) | `@dg-design/react/notification-badge` | 읽지 않은 알림 개수나 새 항목 점. 다른 요소 모서리에 겹쳐 쓴다. |
| [Pagination](references/pagination.md) | `@dg-design/react/pagination` | 페이지 이동 링크 묶음. 현재 쪽 표시와 이전/다음/생략 부품만 제공하고 계산은 앱이 한다. |
| [Popover](references/popover.md) | `@dg-design/react/popover` | 트리거를 클릭하면 옆에 뜨는 비모달 패널 — 폼·옵션 같은 인터랙티브 콘텐츠용. |
| [Progress](references/progress.md) | `@dg-design/react/progress` | 작업 진행률을 막대로 보여 주는 progressbar. |
| [PropertyField](references/property-field.md) | `@dg-design/react/property-field` | 라벨은 왼쪽, 값을 고르는 트리거는 오른쪽에 두는 설정 행. 텍스트 입력이 아니라 선택창을 연다. |
| [RadioGroup](references/radio-group.md) | `@dg-design/react/radio-group` | 서로 배타적인 소수의 선택지 중 하나를 고른다. 기본 점 모양과 segmented(탭 모양) 두 가지. |
| [SaveStatus](references/save-status.md) | `@dg-design/react/save-status` | 자동 저장 상태(저장됨·변경됨·저장 중·오류)를 아이콘과 문구로 보여 주는 한 줄 표시. |
| [Select](references/select.md) | `@dg-design/react/select` | 목록에서 값 하나를 고르는 드롭다운(listbox). 여러 개는 MultiSelect. |
| [Separator](references/separator.md) | `@dg-design/react/separator` | 내용을 나누는 얇은 구분선. 가로·세로. |
| [Sheet](references/sheet.md) | `@dg-design/react/sheet` | 화면 가장자리에서 슬라이드해 들어오는 모달 패널 — 옆 상세 패널(side view)과 모바일 하단 시트. |
| [Skeleton](references/skeleton.md) | `@dg-design/react/skeleton` | 콘텐츠가 올 자리를 회색 블록으로 미리 잡아 두는 로딩 자리표시자. |
| [Slider](references/slider.md) | `@dg-design/react/slider` | 범위 안의 숫자 하나를 드래그로 고르는 슬라이더. |
| [Spinner](references/spinner.md) | `@dg-design/react/spinner` | 끝나는 시점을 모르는 짧은 대기를 나타내는 회전 표시. |
| [StatePanel](references/state-panel.md) | `@dg-design/react/state-panel` | 영역 전체가 비었거나 불러오는 중이거나 실패했을 때 그 자리에 채우는 상태 안내 패널. |
| [Switch](references/switch.md) | `@dg-design/react/switch` | 누르는 즉시 적용되는 켜기/끄기 설정 스위치. |
| [Table](references/table.md) | `@dg-design/react/table` | 정렬·선택 로직 없이 스타일만 입힌 정적 표 마크업. 데이터 기능이 필요하면 DataTable. |
| [Tabs](references/tabs.md) | `@dg-design/react/tabs` | 같은 화면 안에서 관련 패널을 전환하는 탭. 포커스가 닿으면 곧바로 활성화된다. |
| [TextArea](references/text-area.md) | `@dg-design/react/text-area` | 여러 줄 텍스트 입력. 자동 높이 조절(autoResize)과 글자 수 표시(showCount)를 지원한다. |
| [TextField](references/text-field.md) | `@dg-design/react/text-field` | 한 줄 텍스트 입력. 이메일·비밀번호·검색·숫자 등 type과 앞뒤 장식(prefix·suffix)을 지원한다. |
| [Toast](references/toast.md) | `@dg-design/react/toast` | 행동 결과를 잠깐 알리는 알림 — Provider 하나와 `useToast()` 훅. |
| [Tooltip](references/tooltip.md) | `@dg-design/react/tooltip` | 아이콘 버튼 같은 요소에 붙는 짧은 라벨 — 비인터랙티브 텍스트만. |
<!-- components:end -->
