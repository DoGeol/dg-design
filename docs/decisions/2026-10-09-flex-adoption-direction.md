# flex 적용 방향 (2026-10-09)

> 상태: 활성 · **구현 중** — P3(접근성·API)까지 반영. 진행은 [구현 계획](../plans/2026-10-09-flex-adoption.md).
> 근거: [A·B 이중검토 종합](../reports/flex-adoption-review/review/synthesis.md) · [B 치수 명세](../reports/flex-adoption-review/skill-free-comparison/design-application/README.md) · [A·B 공통 관점 보완](../reports/flex-adoption-review/gaps.md) · Storybook `Mockups/Flex`

## 결정

| 항목 | 결정 |
| --- | --- |
| 출발점 | **A 기본 + B 사용례 흡수.** A의 외부 라벨 outline 입력과 역할 토큰 연결을 기본으로 둔다. B가 먼저 설계한 List·SectionHeader, Chip(제거·필터·툴박스), PropertyField, Sheet 단계 전환(간단·상세·전체), 설정 행을 새 종류와 조합으로 더한다 |
| 컨트롤 모서리 | **B: 입력 4 · 버튼 6** (데스크톱 medium 기준). flex 원본 측정(DS024 7.5·11.5 raster ÷1.75)에 가장 가까운 단계다. 모바일은 두 안이 같은 입력 14~16 · 버튼 12 범위에서 구현 스펙이 정한다 |
| 폼 입력 형태 | **outline 기본 + 모바일 확장.** 기본은 외부 라벨 outline이다. 모바일 상세 화면에 한해 box(경계 1px 포함)·속성 행·line을 추가 형태로 허용한다. 데스크톱은 outline 하나 |
| 브랜드 정본 | **createTheme #1550A9.** `createTheme({ brand: "#2B7FFF" })` 결과로, 생성기의 대비·gamut 검사를 통과한다. 중성색도 함께 블루 계열로 바뀐다. 소비 앱의 수동 덮어쓰기(dg-studio #155EEF)는 앱의 선택으로 남긴다 |

## 두 검토자가 합의한 전제

결정과 함께 지킨다. 출처는 [이중검토 종합](../reports/flex-adoption-review/review/synthesis.md)의 합의 8개다.

- 입력 경계(`stroke-neutral` 1px)는 접근성 계약이라 box 형태에서도 지우지 않는다(WCAG 1.4.11).
- 새 값은 DDS 2px 스케일 안에서 고른다.
- 모바일 최소 조작 영역 44, 데스크톱 단독 조작 대상 24를 컴포넌트 계약으로 둔다.
- 부유 패널은 [0.17.3 결정](2026-10-06-floating-panel-border.md)대로 1px 경계 + overlay 그림자를 유지한다.
- 판정의 정본은 Storybook 렌더이고, 생성 이미지는 방향 참고다.

## 검토하고 고르지 않은 안

- **B 전면 채택**: box·line·속성 행을 데스크톱 기본으로 두면 기존 outline 기반 소비 화면과 충돌하고 전환 비용이 크다.
- **A만 채택**: B가 먼저 설계한 목록·선택·작업 패널 사용례를 잃는다. 두 검토자 모두 이 부분은 B가 낫다고 판정했다.
- **모서리 A(6·8) 또는 현재 8 유지**: 결함이 아닌 취향 판단이었고, 사용자가 원본에 가까운 B를 골랐다.
- **브랜드 dg-studio #155EEF 또는 teal 유지**: #155EEF는 수동 덮어쓰기라 생성기 대비 검사를 거치지 않고 중성색이 teal로 남는다. teal은 블루로 옮겨 온 제품 방향과 맞지 않는다.

## 결정안 미리보기

구현 전에 결정대로 바꾸면 어떻게 보이는지 Storybook에서 본다. `pnpm --filter @dg-design/storybook dev` 뒤 `Mockups/Flex` 아래 각 컴포넌트의 **Decided (현재 vs 결정안)** 스토리를 연다. 툴바 Flex를 "결정안"으로 바꾸면 기존 상태 매트릭스 스토리도 결정안 외관으로 볼 수 있다.

- 치수: 아래 표. 모서리 계열과 B 사용례(목록·Chip·설정 행)는 B, 나머지는 A다. 패널 안 옵션·메뉴 항목 반경은 패널 반경 − 여백으로 맞췄다(동심).
- 조합: 모바일은 B 조합(내부 라벨 box·속성 행·line·Sheet 단계). 데스크톱은 A 조합(outline 단일)이되 새 종류·Sheet·Dialog·작업 패널·사람 선택·객체 목록·RadioGroup·Switch는 B 조합이다.
- 브랜드: createTheme #1550A9(Brand 툴바 auto).
- **추가 결정(2026-10-09 미리보기 검토 뒤):** Sheet(drawer)는 네 방향 모두 배경 모서리 없음(radius 0). 원래 DDS의 Sheet radius 0으로 돌아간다.
- **표 정렬:** 선택 칸 체크박스는 칸 가운데(글자 중심과 일치), 필터가 있는 머리글은 위 정렬, 숫자 열은 머리글까지 끝 정렬하고 정렬 아이콘을 라벨 앞에 둔다. 현재 DDS에서는 체크박스가 글자보다 2–2.5px 위, 필터 머리글에서 18px 어긋난다(gaps.md §13).
- 위 섞는 방식 중 모서리 톤을 패널까지 넓힌 것, 동심 반경, 데스크톱에서 B 조합을 쓰는 화면 목록은 결정을 적용하며 정한 해석이다. 구현 스펙에서 다시 확인한다.

| 역할 | id | 현재 | 결정안 데스크톱 / 모바일 | 출처 |
| --- | --- | ---: | --- | --- |
| 페이지 좌우 여백 | `page-inset` | — | 32 / 20 | A |
| 같은 묶음 필드 간격 | `field-gap` | — | 12 / 14 | A |
| 묶음 사이 간격 | `group-gap` | — | 24 / 28 | A |
| 작업 패널 본문 여백 | `panel-inset` | 24 | 40 / 20 | A |
| 입력·선택 트리거 높이 | `field-height` | 40 | 40 / 56 | A |
| 입력 반경 | `field-radius` | 8 | 4 / 14 | B |
| 입력 안쪽 여백 | `field-inset` | 12 | 12 / 16 | A |
| 입력 값 글자 | `field-font` | 14 | 14 / 16 | A |
| 버튼 반경 (medium) | `button-radius` | 8 | 6 / 12 | B |
| 주요 CTA 높이 | `cta-height` | 52 | 48 / 52 | A |
| 선택 패널 반경 | `select-panel-radius` | 12 | 12 / 12 | B |
| 선택 패널 안쪽 여백 | `select-panel-inset` | 4 | 8 / 8 | A |
| 옵션 행 최소 높이 | `option-height` | 32 | 36 / 48 | A |
| 옵션 행 반경 | `option-radius` | 6 | 4 / 4 | 결정(동심) |
| 복수 선택 사각 mark | `mark-size` | — | 16 / 16 | A |
| 메뉴 패널 반경 | `menu-radius` | 12 | 12 / 12 | B |
| 메뉴 안쪽 여백 | `menu-inset` | 4 | 6 / 6 | A |
| 메뉴 항목 최소 높이 | `menu-item-height` | 32 | 36 / 48 | A |
| 메뉴 항목 반경 | `menu-item-radius` | 6 | 6 / 6 | 결정(동심) |
| Sheet 안쪽 모서리 | `sheet-radius` | 16 | 0 / 0 | 결정(사용자) |
| Sheet 안쪽 여백 | `sheet-inset` | 24 | 24 / 20 | A |
| 목록 두 줄 행 높이 | `list-row-2` | — | 56 / 64 | B |
| 목록 한 줄 행 높이 | `list-row-1` | — | 48 / 56 | B |
| 목록 행 좌우 여백 | `list-inset` | — | 12 / 16 | B |
| leading과 본문 간격 | `list-leading-gap` | — | 8 / 8 | B |
| Chip 높이 | `chip-height` | 20 | 24 / 32 | B |
| Chip 반경 | `chip-radius` | 6 | 6 / 6 | B |
| 설정 행 높이 | `setting-row-height` | — | 48 / 56 | B |
| 설정 행 반경 | `setting-row-radius` | — | 14 / 14 | B |
| 탭 최소 높이 | `tab-height` | 36 | 40 / 40 | A |
| 탭 좌우 여백 | `tab-inset` | 8 | 12 / 12 | A |
| 탭과 패널 간격 | `tab-panel-gap` | 12 | 24 / 24 | A |
| 표 한 줄 행 높이 | `table-row` | 44 | 44 / 44 | A |
| 모바일 최소 조작 영역 | `touch-target` | — | — / 44 | A |
| 본문 글자 | `body-size` | 14 | 14 / 16 | A |
| 본문 행간 | `body-line` | 19 | 19 / 24 | A |

표는 profiles.ts의 `FINAL`에서 생성했다. P1부터 토큰이 된 역할의 정본은 `packages/tokens/src/tokens.ts`의 `roles`다.

## 구현 중 결정

**P1 역할 토큰·밀도 (2026-10-09)**

- 이름: `--dds-space-*`(여백·간격), `--dds-size-*`(높이·크기), 역할 radius는 기존 `--dds-radius-*` 아래(`--dds-radius-field`), 글자는 `--dds-font-size-*`·`--dds-line-height-*` 아래. [토큰 적용 검토](../reports/flex-adoption-review/tokens.md)의 예시 이름을 따랐다.
- 범위: P2·P3에서 컴포넌트가 읽을 역할과 레이아웃 3개(page-inset·field-gap·group-gap) — 30개. 목록·설정 행(`list-*`·`setting-row-*` 6개)은 P4에서 그 컴포넌트와 함께 넣는다. P4 스펙에서 값이 바뀔 수 있어서다. Chip(`chip-height`·`chip-radius`)과 `mark`는 넣었다 — 새 Chip 컴포넌트는 P4지만 지금 MultiSelect가 이미 칩과 선택 표식을 그려 P2 소비처가 있다.
- `touch-target`: 데스크톱 24 · 모바일 44. 위 "두 검토자가 합의한 전제"의 데스크톱 24를 따랐다(profiles.ts는 데스크톱을 비워 뒀다). 변수가 늘 정의돼 컴포넌트 CSS에 대체값이 필요 없다.
- 밀도: `[data-dds-density="mobile"]` 블록. 루트 지정 전제, 중첩 미지원(포털이 하위 스코프를 벗어난다). mobile 값이 desktop과 같은 역할은 블록에 넣지 않는다.
- 44는 4px 스케일에 스텝이 없어 리터럴로 둔다(표 행·모바일 조작 영역만 쓴다). Sheet 반경 0도 리터럴이다.
- profiles.ts `FINAL`과 tokens.ts의 값 중복은 P2에서 정리한다(시안 덮어쓰기 CSS를 지우는 시점과 같다).

**P2 외관 (2026-10-09)**

- 패키지 기본값이 된 범위: 결정안 미리보기의 덮어쓰기 규칙 중 `.dds-*` 선택자만 겨눈 것 + 결정안 열에서 모든 안에 시안 클래스로 걸던 것(Checkbox 첫 줄 정렬, FileInput 드롭존, DatePicker 필드 트리거). 시안 클래스로만 쓰는 조합(`.fx-cta`, box·line 입력, 버튼·칩 트리거, 설정 행, 큰 Card, StatePanel compact, 선택형 Popover)은 P3~P6 또는 앱 조합으로 남긴다.
- 표 숫자 열 끝 정렬은 DataColumn 정렬 옵션이 필요해 P3로 미룬다.
- DatePicker 트리거는 Button 배선을 그대로 쓰고 `dds-date-picker__trigger` 클래스로 필드 외관(경계 1px·입력류 focus)을 입힌다. 루트는 `inline-flex` → `flex`(블록 폭)로 바꿔 다른 필드와 폭 규칙을 맞췄다.
- Pagination 현재 쪽은 Button 클래스를 `brand solid` → `neutral weak`로 바꾸고 중성 경계 1px를 얹는다(흰 배경 위 weak 단독 1.07:1 보완).
- Checkbox 라벨의 1px 광학 보정(`translateY(1px)`)은 첫 줄 정렬과 함께 없앴다. 라벨 없는 박스(표 선택 칸)는 내리지 않는다.
- 모바일 전용 규칙은 `[data-dds-density="mobile"]`(메뉴 단축키 숨김, TextArea 위아래 여백) 아니면 토큰 `max()`(Pagination 44)로 둔다.
- Storybook 시안: 구현된 규칙은 덮어쓰기 CSS에서 지웠다. 결정안 열의 `--fx-*`는 토큰 역할이면 `var(--dds-…)`를 가리키고, profiles.ts `FINAL`에는 토큰이 아닌 목록·설정 행만 남는다. 그래서 Decided의 "현재 DDS" 열도 이제 새 기본값으로 보이고, Compare의 A·B 열은 지운 규칙만큼 결정안과 같아진다 — 비교 시안은 결정 당시 기록으로만 본다.

**P3 접근성·API (2026-10-09)** — [스펙](../specs/2026-10-09-p3-a11y-api.md)

- 메뉴 체크·라디오 항목은 메뉴 context가 필요 없어(닫지 않음) DropdownMenu와 ContextMenu가 같은 컴포넌트를 쓴다(`dropdown-menu/menu-choice-items.tsx`). roving은 `menuitem`·`menuitemcheckbox`·`menuitemradio`를 함께 훑는다.
- Select·MultiSelect의 표시·검색 분리는 `internal/select-core.ts`의 `optionLabel()` 한 곳이 스캔과 등록 둘 다 처리한다.
- DataTable 숫자 열 시안(`:has(.fx-num)` 머리글 규칙)은 `align: "end"`로 바꾸고 지웠다. 고정폭 숫자는 align과 별개로 소비자 몫이다.

## 다음

- Storybook Brand 툴바의 auto를 createTheme 블루로 맞췄다(`apps/storybook/.storybook/preview.tsx`). 보강 이미지는 #155EEF로 그렸으므로 색은 참고하지 않는다.
- 소비자에게 규칙을 전하는 방법은 [사용 가이드 스킬](2026-10-09-usage-skill.md)로 정했다.
- 구현 스펙 후보 순서는 [이중검토 종합](../reports/flex-adoption-review/review/synthesis.md)의 "구현 스펙 후보 순서"를 따른다. 스펙은 `docs/specs/`에 새로 쓴다.
- profiles.ts는 A·B 비교용 정본으로 남긴다. 혼합안의 확정 치수는 구현 스펙에서 역할 토큰으로 옮길 때 정한다.
