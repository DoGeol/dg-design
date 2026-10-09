# B 치수 명세 · 원문 우선 재검토

2026-10-09 · React 0.17.3 / tokens 0.8.0 기준 · **구현 전 제안**

[B 재검토 개요](../README.md)는 수치를 "원문에서 확인한 상대 관계"로만 남겼다. 이 문서는 B를 [A 적용안](../../design-application/README.md)과 같은 수준의 구체 치수로 고정한다. 그러면서도 B의 원칙인 **근거 없는 새 숫자를 만들지 않는다**를 지킨다.

치수 정본은 [profiles.ts](../../../../../apps/storybook/src/mockups/flex/profiles.ts) 하나다. 이 문서의 표, Storybook 비교 화면의 치수표, [보강 이미지 브리프](../../../../design/2026-10-09-flex-ab-supplement/BRIEF.md)가 모두 이 파일에서 나온다. 숫자가 서로 다르면 profiles.ts가 맞다.

| 문서 | 대상 |
| --- | --- |
| [입력·선택 12개](forms.md) | Button, Field, TextField, TextArea, Checkbox, RadioGroup, Switch, Slider, Select, MultiSelect, DatePicker, FileInput |
| [탐색·메뉴 7개](navigation.md) | Tabs, DropdownMenu, ContextMenu, Breadcrumb, Pagination, Accordion, Collapsible |
| [표면·레이어 7개](surfaces.md) | Dialog, Sheet, Popover, HoverCard, Tooltip, Card, Separator + 작업 패널 시나리오 |
| [데이터·피드백 12개](data-feedback.md) | Table, DataTable, Avatar, Badge, NotificationBadge, Alert, Toast, StatePanel, SaveStatus, Progress, Spinner, Skeleton + 비교 표 시나리오 |
| [새 종류 3개](new-kinds.md) | List·SectionHeader, Chip·FilterToolbox, PropertyField + 폼·사람 선택·객체 목록 시나리오 |
| [관점 보완](../../gaps.md) | 다크·모바일·브랜드·아이콘·인프라 등 A·B 공통으로 빠졌던 것 |

## B의 치수를 정하는 규칙

순서대로 적용하고 처음 맞는 규칙에서 멈춘다.

1. **측정이 있으면 측정값을 옮긴다.** 원본 이미지의 raster px를 배율 가정으로 나누고, 가장 가까운 DDS 단계로 반올림한다. 배율을 확인한 이미지(데스크톱 DS024, 모바일 M020)의 값은 등급 B, 같은 배율을 다른 이미지에 옮긴 값은 등급 C(교차 배율)다.
2. **두 단계와의 거리가 같을 때만 중첩 관계로 정한다.** 바깥 반경 ≈ 안쪽 반경 + 사이 여백. 거리가 다르면 규칙 1이 이긴다. 그래서 선택 패널은 12.9 → 12다(처음 판에서 관계식으로 14로 올렸던 것을 Gemini 검토로 바로잡았다).
3. **측정이 없으면 현재 DDS 값을 쓴다.** 새 숫자를 만들지 않는다. 등급 D.
4. **현재 값도 없으면 다른 측정과의 관계로만 유도한다.** 예: 모바일 필드 간격 14 ÷ 필드 높이 56 = 1/4이므로 데스크톱 40 × 1/4 = 10. 등급 C.
5. **접근성 하한은 예외로 올린다.** 모바일 조작 영역 44px(`touch-target`), 데스크톱 단독 조작 대상 24px(WCAG 2.5.8 — Chip 높이 24의 근거). 입력 경계 같은 현재 접근성 계약은 측정이 없다는 이유로 지우지 않는다(D 유지). 등급 C.

A는 반경에서 연구의 "proposed" 반올림 세트(필드 6, 버튼 8, 메뉴 12, 선택 패널 14, 패널 16)를 택했고, 행 높이·탭·Chip 같은 값은 A 문서가 따로 정했으며(옵션 36, 탭 40, Chip 28), 나머지는 현재 DDS를 지켰다. 측정 환산·올림·현재 값 유지가 섞인 점진적 타협안이다. B는 측정의 조건부 값을 가까운 단계로 옮기고 나머지는 현재 값을 지켰다. 반경 차이는 대부분 "올림이냐 가까운 단계냐"에서 나온다.

### 배율 가정

| 가정 | 내용 | 한계 |
| --- | --- | --- |
| H-desktop | DS024 입력 70 raster px = 40px, 배율 1.75 | 다른 이미지(DS017·021·026·029·014)도 같은 배율이라는 증거는 없다 |
| H-mobile | M020 화면 안쪽 520 raster px = 390px, 배율 0.75 | M017·M024는 다른 크기로 내보내졌다. 393px 가정이면 값이 1% 안쪽에서 움직인다 |

원 측정은 dg-studio 연구 폴더에 있다(아래 "출처" 참고). 이 가정을 버리면 B의 측정 등급 값은 모두 C로 내려간다.

## 역할별 치수

값 뒤 글자는 등급이다. A 원문 명시, B 측정, C 재구성, D 현재 DDS. "현재"의 —는 DDS가 정하지 않는 값(앱 소유 또는 컴포넌트 없음)이다.

| 역할 | id | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | A·B | B 근거 |
| --- | --- | ---: | --- | --- | --- | --- |
| 페이지 좌우 여백 | `page-inset` | — | 32 C / 20 C | 32 C / 20 B | 같음 | DS029 헤더 inset 55÷1.75=31.4 (교차 배율) · 모바일: M020 26×0.75=19.5 |
| 같은 묶음 필드 간격 | `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 다름 | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| 묶음 사이 간격 | `group-gap` | — | 24 C / 28 B | 20 C / 28 B | 다름 | 모바일 관계 28:56=1/2 → 40×1/2 · 모바일: M020 36×0.75=27 |
| 작업 패널 본문 여백 | `panel-inset` | 24 | 40 C / 20 C | 40 C / 20 B | 같음 | DS026 72÷1.75=41.1 (교차 배율) · 모바일: M020 26×0.75=19.5 |
| 입력·선택 트리거 높이 | `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | 같음 | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 | `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | 다름 | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 입력 안쪽 여백 | `field-inset` | 12 | 12 C / 16 C | 12 B / 16 B | 같음 | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 입력 값 글자 | `field-font` | 14 | 14 D / 16 C | 14 D / 16 C | 같음 | 현재 DDS 값 유지 · 모바일: M005 Body Large 16/24 |
| 버튼 반경 (medium) | `button-radius` | 8 | 8 C / 12 C | 6 B / 12 B | 다름 | DS024·026 11.5÷1.75=6.6 · 모바일: M020 16.75×0.75=12.6 |
| 주요 CTA 높이 | `cta-height` | 52 | 48 C / 52 C | 48 B / 52 B | 같음 | DS024 85÷1.75=48.6 · 모바일: M020 68×0.75=51 |
| 선택 패널 반경 | `select-panel-radius` | 12 | 14 C / 14 C | 12 C / 12 C | 다름 | DS017 22.5÷1.75=12.9 → 가장 가까운 단계 12 (교차 배율). 원본도 행 반경+여백과 동심이 아니다 |
| 선택 패널 안쪽 여백 | `select-panel-inset` | 4 | 8 C / 8 C | 6 C / 6 C | 다름 | DS017 행 inset 12÷1.75=6.9 (교차 배율) |
| 옵션 행 최소 높이 | `option-height` | 32 | 36 C / 48 C | 32 C / 48 C | 다름 | DS017 hover 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 옵션 행 반경 | `option-radius` | 6 | 6 D / 6 D | 8 C / 8 C | 다름 | DS017 12.5÷1.75=7.1 (교차 배율) |
| 복수 선택 사각 mark | `mark-size` | — | 16 C / 16 C | 18 C / 18 C | 다름 | DS017 33÷1.75=18.9 (교차 배율) |
| 메뉴 패널 반경 | `menu-radius` | 12 | 12 D / 12 D | 12 C / 12 C | 같음 | DS021 19.5÷1.75=11.1 (교차 배율) |
| 메뉴 안쪽 여백 | `menu-inset` | 4 | 6 C / 6 C | 8 C / 8 C | 다름 | 메뉴 안쪽 12~16÷1.75=6.9~9.1 (교차 배율) |
| 메뉴 항목 최소 높이 | `menu-item-height` | 32 | 36 C / 48 C | 32 C / 48 C | 다름 | DS017 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 메뉴 항목 반경 | `menu-item-radius` | 6 | 6 D / 6 D | 8 C / 8 C | 다름 | DS017 12.5÷1.75=7.1 (교차 배율) |
| Sheet 안쪽 모서리 | `sheet-radius` | 16 | 16 D / 24 C | 16 D / 16 D | 다름 | 현재 DDS 값 유지 · 모바일: 미측정이라 현재 값 유지 |
| Sheet 안쪽 여백 | `sheet-inset` | 24 | 24 D / 20 C | 24 D / 20 B | 같음 | 현재 DDS 값 유지 · 모바일: M020 26×0.75=19.5 |
| 목록 두 줄 행 높이 | `list-row-2` | — | 64 C / 64 C | 56 C / 64 C | 다름 | DS014 행 pitch 98.5÷1.75=56.3 (교차 배율) · 모바일: M017 사람:값 행 1.27배, 토큰 x16 |
| 목록 한 줄 행 높이 | `list-row-1` | — | 56 C / 56 C | 48 C / 56 C | 다름 | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 목록 행 좌우 여백 | `list-inset` | — | 16 C / 16 C | 12 B / 16 B | 다름 | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| leading과 본문 간격 | `list-leading-gap` | — | 12 C / 12 C | 8 C / 8 C | 다름 | DS017 14÷1.75=8 (교차 배율) |
| Chip 높이 | `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 다름 | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| Chip 반경 | `chip-radius` | 6 | 8 C / 8 C | 6 D / 6 D | 다름 | 측정 없음, 현재 chip 유지 |
| 설정 행 높이 | `setting-row-height` | — | — / — | 48 C / 56 C | 다름 | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 설정 행 반경 | `setting-row-radius` | — | — / — | 14 C / 14 C | 다름 | DS026 24÷1.75=13.7 (교차 배율) · 모바일: 입력 반경과 같게 |
| 탭 최소 높이 | `tab-height` | 36 | 40 C / 40 C | 36 D / 36 D | 다름 | 측정 없음 |
| 탭 좌우 여백 | `tab-inset` | 8 | 12 C / 12 C | 8 D / 8 D | 다름 | 측정 없음 |
| 탭과 패널 간격 | `tab-panel-gap` | 12 | 24 C / 24 C | 12 D / 12 D | 다름 | 측정 없음 |
| 표 한 줄 행 높이 | `table-row` | 44 | 44 C / 44 C | 44 D / 44 D | 같음 | 측정 없음 |
| 모바일 최소 조작 영역 | `touch-target` | — | — / 44 C | — / 44 C | 같음 | 데스크톱 미정 · 모바일: 터치 행 44 이상 |
| 본문 글자 | `body-size` | 14 | 14 D / 16 C | 14 D / 16 C | 같음 | 현재 DDS 값 유지 · 모바일: M005 Body Large 16/24 |
| 본문 행간 | `body-line` | 19 | 19 D / 24 C | 20 B / 24 C | 다름 | DS024 줄 pitch 36÷1.75=20.6 · 모바일: M005 pitch 48÷2 |

표는 다음 명령으로 다시 만든다. 문서를 고칠 때 손으로 숫자를 바꾸지 않는다.

```sh
node --input-type=module -e 'const { ROLES, resolve } = await import("./apps/storybook/src/mockups/flex/profiles.ts"); for (const r of Object.values(ROLES)) console.log(r.id, resolve(r,"b","desktop"), resolve(r,"b","mobile"))'
```

## A와 B의 차이 요약

| 주제 | A | B | 보이는 결과 |
| --- | --- | --- | --- |
| 모서리 | 입력 6 · 버튼 8 | 입력 4 · 버튼 6 | B가 덜 둥글다. 원본 화면에 더 가깝다 |
| 선택 패널 | 반경 14 · 여백 8 · 옵션 36 · 옵션 반경 6 | 반경 12 · 여백 6 · 옵션 32 · 옵션 반경 8 | B는 행이 촘촘하고, 원본처럼 안쪽 반경+여백이 바깥 반경과 맞지 않는다 |
| 명령 메뉴 | 여백 6 · 항목 36 | 여백 8 · 항목 32 | B는 패널 여백이 넓고 행이 낮다 |
| 데스크톱 간격 | 필드 12 · 묶음 24 | 필드 10 · 묶음 20 | B는 모바일 비율(1/4, 1/2)을 데스크톱에 옮겼다 |
| 모바일 입력 반경 | 16 | 14 | 측정 평균 14.9를 B는 14로 내렸다 |
| 모바일 Sheet | 반경 24 | 반경 16 | 24는 미측정 제안이라 B는 현재 값을 유지한다 |
| Tabs·Table | 높이 40·여백 12·패널 간격 24, 행 44 | 현재 값 유지 | 근거가 없는 확대를 B는 하지 않는다 |
| 목록 | 한 줄 56 · 두 줄 64 · 여백 16 · leading 간격 12 | 한 줄 48 · 두 줄 56 · 여백 12 · 간격 8 | B는 DS014·DS026 측정으로 더 낮다 |
| Chip | 28/32 · 반경 8 | 24/32 · 반경 6 | B는 현재 비공개 chip 반경을 유지한다 |
| 설정 행 | 없음(기존 Radio 목록) | 48/56 · 반경 14 · 중성 표면 | B만 DS026 설정 조합을 표준 사용례로 둔다 |
| 본문 행간 | 19 | 20 | B는 DS024 줄 간격을 옮겼다 |

치수만이 아니라 **조합**도 다르다. B는 묶인 폼에 box(약한 중성 면 + 현재 입력 경계 1px), 단독 입력에 line, 비키보드 값에 property 행을 쓴다. box의 경계는 처음 판에서 지웠다가 대비 1.09:1 문제로 되돌렸다. Select는 field·button·chip 트리거를 동등하게 둔다. 설정 선택은 중성 행과 중성 선택점으로 그리고 저장 CTA만 브랜드로 둔다. A는 외부 라벨 outline이 기본이고 나머지는 후보다.

## 두 안이 같은 것

모바일 필드 높이 56·안쪽 16·간격 14·묶음 28, CTA 48/52, 페이지 여백 32/20, 작업 패널 여백 40, 메뉴 반경 12, 모바일 조작 영역 44는 두 안이 같다. 같은 연구 측정에서 출발했기 때문이다. 버튼 높이 36/40/52, Checkbox·Switch 크기, 부유 패널 1px 경계, 확인 Dialog 16/24, 입력 focus 계약도 두 안 모두 현재 DDS를 유지한다.

## Storybook에서 비교하기

`pnpm --filter @dg-design/storybook dev`를 띄우고 `Mockups/Flex` 아래를 연다.

- 각 컴포넌트의 **Compare**는 현재 DDS · A · B 세 열을 나란히 보여준다. 열마다 별도 iframe이라 Dialog·Select 같은 포털 오버레이도 해당 안의 외관으로 열린다.
- **Specimen**은 한 안만 크게 본다. 툴바 Flex로 안을 고른다.
- 툴바 **Density**는 데스크톱과 모바일(390px) 프로필을 바꾼다. **Theme**은 라이트·다크다. **Brand**는 DDS 기본 teal, createTheme 블루 #1550A9, dg-studio 블루 #155EEF를 바꾼다. auto는 flex 시안에만 정본 브랜드 createTheme 블루 #1550A9를 건다([flex 적용 방향 결정](../../../../decisions/2026-10-09-flex-adoption-direction.md)). 그래서 Compare의 "현재" 열도 현재 DDS 컴포넌트에 같은 블루를 씌운 모습이다. 보강 이미지는 결정 전에 dg-studio 블루 #155EEF로 그렸다. 패키지 기본 teal로 보려면 Brand를 DDS 기본으로 바꾼다.
- Flex 툴바는 기존 컴포넌트 스토리에도 걸린다. 예를 들어 `Select > State Matrix`를 열고 Flex를 B로 바꾸면 기존 상태 매트릭스를 B 외관으로 볼 수 있다.
- 시안 스토리는 `Mockups/` 아래라 시각 회귀 기준에서 빠진다.

Storybook의 A·B 외관은 시안 전용 CSS(`apps/storybook/src/mockups/flex/overrides/`)가 현재 컴포넌트 위에 덧씌운 것이다. 패키지 코드와 공개 API는 바뀌지 않았다. List·Chip·PropertyField·Dialog 레이아웃 부품은 `flex/proto/`의 Storybook 전용 프로토타입이다.

## 검증 범위

- 검증한 것: Storybook 타입 검사, 세 열 렌더(데스크톱·모바일·다크)의 브라우저 캡처 확인.
- 검증하지 않은 것: 실제 기기, 스크린리더 청취, 200% 글자 확대, 소프트 키보드, 실제 터치 hit area, 원본 이미지 배율 가정 자체.
- 이미지 시안은 [보강 시안](../../../../design/2026-10-09-flex-ab-supplement/BRIEF.md)에 따로 있다. 이미지는 방향 참고이며 구현 계약이 아니다.

## 출처

- 데스크톱 측정: dg-studio `fa3eaa3` `docs/design/2026-10-06-flex-research/tokens/`(README·TAILWIND·layout-measurements.json)
- 모바일 측정: dg-studio `fa3eaa3` `docs/design/2026-10-07-flex-mobile-research/tokens/`
- 이 커밋은 dg-studio의 미병합 브랜치에만 있다. 위험과 처리 방법은 [관점 보완](../../gaps.md)에 적었다.
