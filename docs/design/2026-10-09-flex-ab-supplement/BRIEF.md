# flex A·B 보강 시안 브리프

2026-10-09 · **시각 검토용 · 구현 전**. A안과 B안을 같은 조건으로 비교하려고 만든 이미지 시안의 생성 지침이다.

## 왜 다시 만드는가

- A안은 dg-design 안에 이미지 시안이 없었다. dg-studio 연구 브랜치에 8종만 있다.
- B안 보드 10장([2026-10-09-flex-all-components](../2026-10-09-flex-all-components/README.md))은 DDS가 아닌 근사 hex(#262A2D·#626B76·#E1E5EB)로 그렸다.
- 두 안 모두 List·Chip·PropertyField, 모바일 전용 보드, 다크 보드가 없었다.

그래서 **A·B 모두 같은 DDS 기반 지침**으로 14장씩 만든다. 원래 B 보드는 덮어쓰지 않고 기록으로 남긴다.

## 고정 조건

- **치수**: [profiles.ts](../../../apps/storybook/src/mockups/flex/profiles.ts)가 정본이다. 아래 표는 그 파일에서 생성했다. 이미지에 숫자 주석은 넣지 않는다.
- **브랜드**: 기존 B 보드와 같은 dg-studio 블루 #155EEF로 고정한다. 비교 조건을 맞추기 위한 고정이며 브랜드 결정이 아니다. 브랜드 비교는 Storybook Brand 툴바에서 한다.
- **중성색·의미색**: DDS 0.8.0 기본 semantic 값(아래 표). 근사 hex를 쓰지 않는다.
- **타이포**: 시스템 산세리프(한글 양호), regular 400 / bold 700 두 굵기만. 본문 14px, 보조 13px, 캡션 12px, 제목 20~24px 상당. 모바일 본문 16px 상당.
- **포커스**: 입력류는 테두리 1px + 안쪽 1px(바깥 링 없음). 비입력 컨트롤은 2px 링 + 2px 간격.
- **부유 패널**: 흰 표면 + 1px stroke-neutral-weak 경계 + overlay 그림자. 다크에서도 경계가 보여야 한다. 기본 목록·카드에는 그림자를 쓰지 않는다.
- **아이콘**: 단일 stroke SVG 스타일. 문자 기호·이모지를 조작 아이콘으로 쓰지 않는다. 도메인 표식(코드 배지·아바타)은 B 보드에서만 값 이해용 슬롯으로 허용한다.
- **문구**: 주어진 한국어 그대로, 짧은 합쇼체. 가상 데이터.
- **금지**: 초록 주 행동, 그라데이션, 유리·3D·원근, 기기 목업 프레임(모바일은 390px 폭 화면 영역만), 장식 차트, 거대한 아이콘, 모든 구역을 카드로 감싸기.
- **캔버스**: 가로 4:3(목표 2000×1500). 좌상단 작은 "dg-design / flex study", 큰 보드 제목, 부제 "A · 앞선 적용안" 또는 "B · 원문 우선 재검토". 하단 작은 "Design proposal · 2026".

### DDS semantic 색 (studio 블루 브랜드)

| 역할 | 라이트 | 다크 |
| --- | --- | --- |
| bg-layer-default (표면) | #FFFFFF | #0F1212 |
| bg-neutral-weak (약한 표면·hover) | #F1F6F6 | #242727 |
| bg-neutral-weak-hover | #E4E9E8 | #3A3E3E |
| fg-neutral (본문) | #242727 | #F1F6F6 |
| fg-neutral-weak (보조) | #6B706F | #AEB2B2 |
| stroke-neutral (입력 테두리) | #6B706F | #898D8D |
| stroke-neutral-weak (구분선·패널 경계) | #E4E9E8 | #3A3E3E |
| bg-disabled / fg-disabled | #E4E9E8 / #898D8D | #3A3E3E / #6B706F |
| bg-brand-solid / hover | #155EEF / #175CD3 | #5298FF / #70A6FF |
| bg-brand-weak | #EFF4FF | #0B254A |
| fg-brand | #0D4AC4 | #84B9FF |
| fg-brand-contrast | #FFFFFF | #0F1212 |
| stroke-focus-ring | #2B7FFF | #5298FF |
| critical fg / solid / stroke / weak | #731115 / #9B1C22 / #C7272D / #FCF3F2 | #F0C9C5 / #EF958E / #F04646 / #4B090B |
| positive fg / weak | #0F4A17 / #E7FCE7 | #83F289 / #06300B |
| overlay 딤 | rgb(15 18 18 / 0.5) | 같음 |
| overlay 그림자 | 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08) | 같음 |

## 안별 치수 (profiles.ts에서 생성)

등급 — A 원문 명시, B 측정(데스크톱 ÷1.75, 모바일 ×0.75 가정), C 재구성, D 현재 DDS.

| 역할 | id | 현재 | A 데스크톱 | A 모바일 | B 데스크톱 | B 모바일 | B 근거 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 페이지 좌우 여백 | `page-inset` | — | 32 C | 20 C | 32 C | 20 B | DS029 헤더 inset 55÷1.75=31.4 (교차 배율) / M020 26×0.75=19.5 |
| 같은 묶음 필드 간격 | `field-gap` | — | 12 C | 14 B | 10 C | 14 B | 모바일 관계 14:56=1/4 → 40×1/4 / M020 18.5×0.75=13.9 |
| 묶음 사이 간격 | `group-gap` | — | 24 C | 28 B | 20 C | 28 B | 모바일 관계 28:56=1/2 → 40×1/2 / M020 36×0.75=27 |
| 작업 패널 본문 여백 | `panel-inset` | 24 | 40 C | 20 C | 40 C | 20 B | DS026 72÷1.75=41.1 (교차 배율) / M020 26×0.75=19.5 |
| 입력·선택 트리거 높이 | `field-height` | 40 | 40 C | 56 C | 40 B | 56 B | DS024 70÷1.75=40 (배율 기준) / M020 74.5×0.75=55.9 |
| 입력 반경 | `field-radius` | 8 | 6 C | 16 C | 4 B | 14 B | DS024 7.5÷1.75=4.3 / M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 입력 안쪽 여백 | `field-inset` | 12 | 12 C | 16 C | 12 B | 16 B | DS024 20÷1.75=11.4 / M020 22×0.75=16.5 |
| 입력 값 글자 | `field-font` | 14 | 14 D | 16 C | 14 D | 16 C | 현재 DDS 값 유지 / M005 Body Large 16/24 |
| 버튼 반경 (medium) | `button-radius` | 8 | 8 C | 12 C | 6 B | 12 B | DS024·026 11.5÷1.75=6.6 / M020 16.75×0.75=12.6 |
| 주요 CTA 높이 | `cta-height` | 52 | 48 C | 52 C | 48 B | 52 B | DS024 85÷1.75=48.6 / M020 68×0.75=51 |
| 선택 패널 반경 | `select-panel-radius` | 12 | 14 C | 14 C | 12 C | 12 C | DS017 22.5÷1.75=12.9 → 가장 가까운 단계 12 (교차 배율). 원본도 행 반경+여백과 동심이 아니다 |
| 선택 패널 안쪽 여백 | `select-panel-inset` | 4 | 8 C | 8 C | 6 C | 6 C | DS017 행 inset 12÷1.75=6.9 (교차 배율) |
| 옵션 행 최소 높이 | `option-height` | 32 | 36 C | 48 C | 32 C | 48 C | DS017 hover 행 56÷1.75=32 (교차 배율) / 터치 행 44 이상 |
| 옵션 행 반경 | `option-radius` | 6 | 6 D | 6 D | 8 C | 8 C | DS017 12.5÷1.75=7.1 (교차 배율) |
| 복수 선택 사각 mark | `mark-size` | — | 16 C | 16 C | 18 C | 18 C | DS017 33÷1.75=18.9 (교차 배율) |
| 메뉴 패널 반경 | `menu-radius` | 12 | 12 D | 12 D | 12 C | 12 C | DS021 19.5÷1.75=11.1 (교차 배율) |
| 메뉴 안쪽 여백 | `menu-inset` | 4 | 6 C | 6 C | 8 C | 8 C | 메뉴 안쪽 12~16÷1.75=6.9~9.1 (교차 배율) |
| 메뉴 항목 최소 높이 | `menu-item-height` | 32 | 36 C | 48 C | 32 C | 48 C | DS017 행 56÷1.75=32 (교차 배율) / 터치 행 44 이상 |
| 메뉴 항목 반경 | `menu-item-radius` | 6 | 6 D | 6 D | 8 C | 8 C | DS017 12.5÷1.75=7.1 (교차 배율) |
| Sheet 안쪽 모서리 | `sheet-radius` | 16 | 16 D | 24 C | 16 D | 16 D | 현재 DDS 값 유지 / 미측정이라 현재 값 유지 |
| Sheet 안쪽 여백 | `sheet-inset` | 24 | 24 D | 20 C | 24 D | 20 B | 현재 DDS 값 유지 / M020 26×0.75=19.5 |
| 목록 두 줄 행 높이 | `list-row-2` | — | 64 C | 64 C | 56 C | 64 C | DS014 행 pitch 98.5÷1.75=56.3 (교차 배율) / M017 사람:값 행 1.27배, 토큰 x16 |
| 목록 한 줄 행 높이 | `list-row-1` | — | 56 C | 56 C | 48 C | 56 C | DS026 행 84÷1.75=48 (교차 배율) / 필드 높이와 같게 |
| 목록 행 좌우 여백 | `list-inset` | — | 16 C | 16 C | 12 B | 16 B | DS024 20÷1.75=11.4 / M020 22×0.75=16.5 |
| leading과 본문 간격 | `list-leading-gap` | — | 12 C | 12 C | 8 C | 8 C | DS017 14÷1.75=8 (교차 배율) |
| Chip 높이 | `chip-height` | 20 | 28 C | 32 C | 24 C | 32 C | 제거 버튼 조작 영역 24 / 터치 행 |
| Chip 반경 | `chip-radius` | 6 | 8 C | 8 C | 6 D | 6 D | 측정 없음, 현재 chip 유지 |
| 설정 행 높이 | `setting-row-height` | — | — | — | 48 C | 56 C | DS026 행 84÷1.75=48 (교차 배율) / 필드 높이와 같게 |
| 설정 행 반경 | `setting-row-radius` | — | — | — | 14 C | 14 C | DS026 24÷1.75=13.7 (교차 배율) / 입력 반경과 같게 |
| 탭 최소 높이 | `tab-height` | 36 | 40 C | 40 C | 36 D | 36 D | 측정 없음 |
| 탭 좌우 여백 | `tab-inset` | 8 | 12 C | 12 C | 8 D | 8 D | 측정 없음 |
| 탭과 패널 간격 | `tab-panel-gap` | 12 | 24 C | 24 C | 12 D | 12 D | 측정 없음 |
| 표 한 줄 행 높이 | `table-row` | 44 | 44 C | 44 C | 44 D | 44 D | 측정 없음 |
| 모바일 최소 조작 영역 | `touch-target` | — | — | 44 C | — | 44 C | 데스크톱 미정 / 터치 행 44 이상 |
| 본문 글자 | `body-size` | 14 | 14 D | 16 C | 14 D | 16 C | 현재 DDS 값 유지 / M005 Body Large 16/24 |
| 본문 행간 | `body-line` | 19 | 19 D | 24 C | 20 B | 24 C | DS024 줄 pitch 36÷1.75=20.6 / M005 pitch 48÷2 |

공통(A·B 같음): 버튼 높이 36/40/52, Checkbox 16/r4·20/r6, Switch 32×20·40×24, 부유 패널 1px 경계, Dialog 확인형 r16/p24.

## 안의 성격

- **A · 앞선 적용안**: 현재 DDS에서 출발해 역할 토큰을 연결한다. 외부 라벨 outline 입력이 기본, 반경을 조금 둥글게 올린 세트(6/8/12/14/16). Select는 field 트리거가 기본이고 버튼·칩 트리거는 후속 확장. Radio는 브랜드 원형 유지. List·Chip·PropertyField는 검토 후보. 모바일 Sheet 반경 24.
- **B · 원문 우선 재검토**: 사용례에서 출발한다. 측정값을 그대로 옮긴 덜 둥근 세트(입력 4, 버튼 6), 측정 없는 값은 현재 DDS 유지(Sheet 16, Tabs 36). 묶인 폼은 box, 단독 입력은 line, 비키보드 값은 property 행. Select는 field·button·chip 트리거가 같은 패널을 연다. 설정은 중성 행(bg-neutral-weak, 반경 14, 높이 48)과 중성 선택점, 저장 CTA만 브랜드. List가 첫 설계 묶음.

## 보드 목록

> codex 사용 한도 때문에 실제로는 11–14만 A·B 모두 만들었다. 01–10은 Storybook 비교 화면이 대신한다. 현재 보드와 범위 결정은 [README](README.md)를 본다.

같은 번호의 A·B 보드는 **같은 내용·같은 배치**로 만든다. 차이는 위 치수와 성격에서만 나와야 한다.

| 번호 | 파일 | 담을 것 |
| --- | --- | --- |
| 01 | `{a,b}/01-controls.png` | Button(위계 4종, focus·loading·disabled), Checkbox(기본·선택·일부·비활성), RadioGroup(A: 브랜드 원형 목록 + segmented r12/r10 / B: 중성 설정 행 3개 + 중성 segmented), Switch 설정 행 2개, Slider(값 100%·미리보기) |
| 02 | `{a,b}/02-fields.png` | Field(라벨·설명·오류), TextField(A: 외부 라벨 outline 기본, box·line은 작은 "후보" 표본 / B: box·line 동등 + 내부 라벨 box), TextArea, FileInput |
| 03 | `{a,b}/03-selection.png` | Select(담당자, 사람 행 3개, 체크 1개), MultiSelect(사각 mark 2개 선택, 검색·선택 수·전체 해제), DatePicker 범위(2026년 10월 12–14일) · A는 field 트리거만, B는 field·button·chip 트리거 3종 |
| 04 | `{a,b}/04-navigation.png` | 페이지 헤더 안 Breadcrumb·Tabs(건수 포함), DropdownMenu(그룹·shortcut·하위 메뉴 chevron·위험 명령 분리), ContextMenu + 행 끝 "더보기" 트리거, Pagination |
| 05 | `{a,b}/05-structure.png` | Accordion 펼침/접힘, Collapsible, Card 기본/포커스, Separator 수평/수직 |
| 06 | `{a,b}/06-modal.png` | 확인 Dialog + 작업 Dialog(Toolbar·본문·Aside·본문 아래 Footer, 본문만 스크롤), Sheet. B는 같은 작업의 중앙/측면 보기 두 프레임 |
| 07 | `{a,b}/07-floating.png` | Popover(A: 정보 패널 한 가지 / B: 정보·선택·설정 세 컨테이너), HoverCard 사람 미리보기, Tooltip 반전 표면 |
| 08 | `{a,b}/08-data.png` | Table(숫자 끝 정렬), DataTable(전체 선택 mixed, 1행 선택, A는 compact 44 행), Avatar 4크기, Badge weak, NotificationBadge dot/count |
| 09 | `{a,b}/09-feedback.png` | Alert(정보·오류 + 행동), Toast 결과, StatePanel(데이터 없음·검색 결과 없음), SaveStatus(변경됨·저장 중·저장됨·실패) |
| 10 | `{a,b}/10-loading.png` | Progress(값·불확정 정적 표본), Spinner(버튼 안·본문), Skeleton(실제 행 구조 전후) |
| 11 | `{a,b}/11-new-kinds.png` | List(한 줄·두 줄 행, leading·main·trailing, 행 열기와 끝 메뉴 분리, SectionHeader), Chip(제거형·필터 토글형·필터 툴박스: 결과 수·초기화), PropertyField(데스크톱 인라인 속성 행 / 모바일 행). A 치수 vs B 치수 |
| 12 | `{a,b}/12-mobile-form.png` | 390px 화면 영역 2개: ① 발행 정보 폼(A: 외부 라벨 outline h56 r16 / B: 내부 라벨 box h56 r14 + property 행 + line 메모) + 하단 CTA 52, ② 담당자 선택 bottom sheet(A r24 / B r16), 사람 행 |
| 13 | `{a,b}/13-mobile-flow.png` | 390px 화면 영역 3개: 같은 Sheet의 간단 → 상세 → 전체 보기(입력한 값 "연장 근무 2시간"이 유지됨), DatePicker 시트(달력·하단 적용/취소, safe area 여백) |
| 14 | `{a,b}/14-dark.png` | 다크 테마: 열린 Select, DropdownMenu, Popover, 작업 Dialog 일부, 입력(focus·error), 버튼 위계. 부유 패널 1px #3A3E3E 경계가 보여야 한다 |

01–10의 세부 문구·데이터는 [기존 B 프롬프트](../2026-10-09-flex-all-components/prompts.json)의 같은 번호 `body`를 출발점으로 쓴다. A 보드는 그 body에서 위 "A" 차이만 바꾼다. 그 body의 근사 hex는 위 DDS 표로 바꾼다.

## 참조 이미지

- 현재 DDS 실제 렌더: 이 커밋의 Storybook 상태 매트릭스 스토리를 studio 블루·라이트/다크로 캡처한 PNG. 재현은 [flex/shoot.mjs](../../../apps/storybook/src/mockups/flex/shoot.mjs)에 `<story-id>@brand:studio-blue`와 `<story-id>@brand:studio-blue;theme:dark`를 넘긴다. 캡처본은 커밋하지 않는다. 컴포넌트 형태·상태 표현의 기준으로 본다.
- 기존 B 보드: [2026-10-09-flex-all-components](../2026-10-09-flex-all-components/README.md)의 채택본 — 배치 참고.
- flex 원본 이미지는 dg-studio `fa3eaa3` 연구 폴더에 있다(미병합 브랜치). 첨부하지 않는다.

## 산출물 계약

- 파일명은 위 표 그대로. 보정본은 `-v2` 접미사, 원본은 덮어쓰지 않는다.
- 워커마다 `records-<담당>.json`에 보드별 실제 프롬프트, 생성 모드, 크기, sha256, 원본 생성 파일명, 보정 여부를 남긴다.
- 생성 뒤 각 보드를 열어 표의 "담을 것"이 모두 있는지, 글자가 깨지지 않았는지 확인하고 결과를 records에 적는다.
