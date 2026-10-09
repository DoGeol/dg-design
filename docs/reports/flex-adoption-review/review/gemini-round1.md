# 1라운드 비판 검토 (Gemini 3.8 Flash High)

## 총평 (5문장 이내, A와 B 중 무엇이 더 나은 출발점인지와 이유)
A안이 훨씬 더 현실적이고 안전한 기술적·접근성적 출발점이다. B안은 "원문 실측과 사용례 중심"을 표방하지만, 검증되지 않은 단일 배율(÷1.75)의 무리한 일반화, 자의적인 반올림, 그리고 무엇보다 WCAG 1.4.11(비텍스트 대비 3:1)을 정면 위반하는 box 입력 대비 1.09:1이라는 치명적인 접근성 결함을 안고 있다. 반면 A안은 기존 DDS 토큰 체계와 폼/입력의 시각적 식별성(outline 기반)을 안정적으로 계승하면서도 flex의 여백 리듬과 모바일 Sheet 계층을 점진적으로 통합할 수 있는 유연성을 제공한다. B안의 List·PropertyField 등 사용례 기반 설계 철학은 우수하나, 정량적 수치와 폼 컨트롤의 규칙 기반은 A안을 토대로 삼고 B의 사용례 패턴을 선택적으로 흡수하는 방향이 타당하다.

## 지적 사항
| # | 심각도(높음/중간/낮음) | 대상(파일:줄 또는 스토리/보드) | 문제 | 근거 | 제안 |
|---|---|---|---|---|---|
| 1 | 높음 | `apps/storybook/src/mockups/flex/profiles.ts:65`, `docs/reports/flex-adoption-review/gaps.md:26-30` | B안의 box 입력 표면이 WCAG 1.4.11 비텍스트 명도 대비(3:1)에 심각하게 미달함 | `.flex-review-inputs/storybook/mockups-flex-forms-textfield--compare.png`, `mockups-flex-scenarios-formtask--compare__density-mobile.png`, `docs/reports/flex-adoption-review/gaps.md:26-30` | box 형태라도 `stroke-neutral-weak` 또는 `stroke-neutral`의 최소 1px 테두리를 의무화하거나, outline을 기본형으로 고정할 것 |
| 2 | 높음 | `apps/storybook/src/mockups/flex/profiles.ts:5`, `docs/reports/flex-adoption-review/skill-free-comparison/design-application/README.md:32-37` | DS024 단일 이미지 기반 배율(÷1.75)을 서로 다른 해상도의 타 이미지(DS017·021·026·029·014)에 무근거로 일괄 적용하여 B등급(측정)으로 공표함 | `.flex-review-inputs/research/2026-10-06-flex-research/tokens/README.md:83-84`, `apps/storybook/src/mockups/flex/profiles.ts:5` | B등급으로 표기된 모든 데스크톱 측정 수치를 C등급(가설/재구성)으로 공식 강등하고 배율 가정의 취약성을 명시할 것 |
| 3 | 높음 | `apps/storybook/src/mockups/flex/profiles.ts:67, 96-97` | 반올림 규칙의 비일관성과 자의적 사후 합리화 (선택 패널 12.85px는 14로 올리고, 모바일 입력 반경 14.9px는 14로 내림) | `docs/reports/flex-adoption-review/skill-free-comparison/design-application/README.md:22-23`, `apps/storybook/src/mockups/flex/profiles.ts:67, 96` | 수학적 반올림 기준 또는 표준 토큰 스케일 정렬 원칙을 단일하게 수립하고 사후 합리화된 중첩 관계 예외를 폐기할 것 |
| 4 | 높음 | `docs/design/2026-10-09-flex-ab-supplement/BRIEF.md:100-103`, `docs/design/2026-10-09-flex-ab-supplement/{a,b}/11-new-kinds.png` | 11번 보드가 BRIEF의 "같은 번호 A·B 보드는 같은 내용·같은 배치" 규칙을 정면 위반하여 텍스트 데이터, 구조, 컴포넌트 배치가 완전히 불일치함 | `docs/design/2026-10-09-flex-ab-supplement/a/11-new-kinds.png`, `docs/design/2026-10-09-flex-ab-supplement/b/11-new-kinds.png`, `docs/design/2026-10-09-flex-ab-supplement/BRIEF.md:100-103` | 11번 보드의 데이터를 동일 데이터셋으로 재정렬하고 프롬프트 템플릿의 레이아웃 구조를 엄격히 일치시킬 것 |
| 5 | 높음 | `docs/reports/flex-adoption-review/gaps.md:138`, `apps/storybook/src/mockups/flex/profiles.ts:220-224` | 모바일 390px 환경에서 터치 타깃 44px 미달 결함 방치 (객체 목록 메뉴 버튼 36px, Chip 제거 버튼 32px) | `.flex-review-inputs/storybook/mockups-flex-scenarios-objectlist--compare__density-mobile.png`, `mockups-flex-newkinds-chip--compare__density-mobile.png`, `docs/reports/flex-adoption-review/gaps.md:138` | 모바일 밀도 적용 시 모든 단독 아이콘 버튼 및 칩 제거 버튼에 비가시적 패딩을 주어 최소 44px 조작 영역을 강제할 것 |
| 6 | 중간 | `docs/reports/flex-adoption-review/skill-free-comparison/design-application/README.md:28`, `apps/storybook/src/mockups/flex/profiles.ts:6-7` | "A는 연구 proposed 세트를 그대로 택했다"는 단언의 사실 왜곡 (A는 실측 환산, 올림, 기존 DDS 보존이 복합 혼합됨) | `apps/storybook/src/mockups/flex/profiles.ts:61-96`, `docs/reports/flex-adoption-review/design-application/README.md:28-36` | A안에 대한 서술을 '실측과 기존 DDS 계약 간의 점진적 타협안'으로 정정하고 비교 프레이밍을 바로잡을 것 |
| 7 | 중간 | `apps/storybook/src/mockups/flex/profiles.ts:175-178` | B의 "측정 없으면 현재 DDS(D) 유지" 원칙 스스로 위반: Chip 높이 20px를 무시하고 24px C를 자의적 신설 | `apps/storybook/src/mockups/flex/profiles.ts:175-178`, `.flex-review-inputs/storybook/mockups-flex-newkinds-chip--compare.png` | 원칙대로 현재 값 20px D를 유지하거나 조작성 하한에 따른 24px 예외 규정을 투명하게 문서화할 것 |
| 8 | 중간 | `docs/reports/flex-adoption-review/gaps.md:25`, `apps/storybook/src/mockups/flex/profiles.ts:121` | 다크 모드 부유 패널의 1px 경계선 식별성 한계 (대비 1.74:1)로 OLED 등 저명도 화면에서 층위 구분 붕괴 | `.flex-review-inputs/storybook/mockups-flex-forms-select--compare__theme-dark.png`, `mockups-flex-navigation-dropdownmenu--compare__theme-dark.png`, `docs/reports/flex-adoption-review/gaps.md:25` | 다크 모드 부유 패널 테두리에 `stroke-neutral`(#898D8D) 또는 반투명 화이트 스트로크를 적용해 최소 3:1 대비를 확보할 것 |
| 9 | 중간 | `docs/reports/flex-adoption-review/gaps.md:53-66`, `docs/design/2026-10-09-flex-ab-supplement/BRIEF.md:16` | 브랜드 색상 파편화 및 검토 기준 왜곡 (패키지 기본 Teal, 공식 createTheme #1550A9 대신 임시 패치 #155EEF 고정) | `docs/reports/flex-adoption-review/gaps.md:59-65`, `.flex-review-inputs/storybook/mockups-flex-forms-button--compare.png` | 브랜드 확정 전까지는 패키지 공식 createTheme 블루(#1550A9) 또는 Teal을 대조군으로 삼고 임시 패치와 분리할 것 |
| 10 | 중간 | `apps/storybook/src/mockups/flex/profiles.ts:213-217` | 모바일 390px DataTable의 헤더 및 셀 가로 잘림과 반응형 레이아웃 파탄 | `.flex-review-inputs/storybook/mockups-flex-datafeedback-datatable--compare__density-mobile.png`, `docs/reports/flex-adoption-review/gaps.md:126-127` | 모바일 화면에서는 DataTable 사용을 지양하고 List로 대체하거나, 가로 스크롤 카드 래퍼 계약을 수립할 것 |
| 11 | 중간 | `.flex-review-inputs/storybook/mockups-flex-scenarios-personpicker--compare__density-mobile.png` | B의 모바일 PersonPicker에서 속성 행 클릭 시 Select 패널이 좁은 고정폭(260px)으로 둥둥 떠서 열리는 정렬 붕괴 | `.flex-review-inputs/storybook/mockups-flex-scenarios-personpicker--compare__density-mobile.png` | 모바일 밀도에서 속성 행 기반 오버레이는 하단 Sheet로 자동 변환(adaptive presentation)되도록 강제할 것 |
| 12 | 중간 | `.flex-review-inputs/storybook/mockups-flex-datafeedback-alert--compare__density-mobile.png` | Alert 좁은 폭(260px)에서 현재 DDS는 닫기 버튼과 복구 버튼이 겹치고, A·B는 줄바꿈 처리하나 여백 리듬이 불균형함 | `.flex-review-inputs/storybook/mockups-flex-datafeedback-alert--compare__density-mobile.png`, `docs/reports/flex-adoption-review/gaps.md:129` | Alert actions 영역의 반응형 래핑 규칙과 우측 여백 확보(close button safe zone)를 공통 CSS로 확정할 것 |
| 13 | 낮음 | `.flex-review-inputs/storybook/mockups-flex-forms-datepicker--compare.png`, `apps/storybook/src/mockups/flex/profiles.ts:65` | DatePicker B 트리거의 box 표면 적용으로 인한 클릭 타깃 인지성 및 명도 대비 저하 | `.flex-review-inputs/storybook/mockups-flex-forms-datepicker--compare.png` | 비키보드 클릭 전용 컨트롤에는 최소 1px 테두리 또는 명확한 달력 아이콘과 배경 명도 차이를 부여할 것 |
| 14 | 낮음 | `docs/reports/flex-adoption-review/gaps.md:136`, `.flex-review-inputs/storybook/mockups-flex-navigation-dropdownmenu--compare__theme-dark.png` | B DropdownMenu의 체크·토글 설정 행이 WAI-ARIA 역할 없이 가짜 DOM 스타일로만 구현되어 접근성 결여 | `docs/reports/flex-adoption-review/gaps.md:136`, `.flex-review-inputs/storybook/mockups-flex-navigation-dropdownmenu--compare__theme-dark.png` | `menuitemcheckbox`·`menuitemradio` 접근성 계약 선행 구현 전에는 복합 설정 메뉴를 표준 시안에 포함하지 말 것 |
| 15 | 낮음 | `.flex-review-inputs/storybook/mockups-flex-forms-button--compare.png`, `docs/reports/flex-adoption-review/gaps.md:55-64` | Storybook Compare의 '현재 DDS 0.17.3' 열이 순정 Teal이 아닌 dg-studio 블루가 주입되어 엄밀한 대조군 역할 상실 | `docs/reports/flex-adoption-review/gaps.md:63-65`, `docs/design/2026-10-09-flex-ab-supplement/BRIEF.md:16` | 현재 열은 순정 Teal 테마로 렌더하고 브랜드 변경 툴바의 동작을 명확히 문서화할 것 |
| 16 | 낮음 | `.flex-review-inputs/storybook/mockups-flex-navigation-tabs--compare.png` | Tabs 컴포넌트 Compare 화면에서 B안이 임의의 페이지 헤더("문서", "+ 새 문서")를 강제 주입하여 컴포넌트 비교를 교란함 | `.flex-review-inputs/storybook/mockups-flex-navigation-tabs--compare.png` | 컴포넌트 Compare 스토리는 순수 부품 형태 비교에 집중하고 페이지 단위 합성은 Scenarios로 제한할 것 |
| 17 | 낮음 | `docs/design/2026-10-09-flex-ab-supplement/README.md:23-26` | codex 한도로 인한 핵심 비교 보드(B 12, 13, 14 및 A 14)의 미생성으로 시각 보강 검토의 완전성 훼손 | `docs/design/2026-10-09-flex-ab-supplement/README.md:23-26` | Storybook Compare 렌더를 1차 정본으로 격상하고 생성형 AI 이미지 의존도를 축소할 것 |

## 주제별 판정
| 주제 | A | B | 판정(A/B/둘 다 수정/동등) | 이유 |
|---|---|---|---|---|
| 모서리 | 입력 6, 버튼 8 | 입력 4, 버튼 6 | **A** | B의 4px/6px는 지나치게 각져 현대 UI에서 딱딱하며, A의 6px/8px가 기존 DDS(8px)와의 점진적 조화 및 텍스트 시각 완충에 우수함 |
| 선택 패널 | 여백 8, 옵션 36, 옵션 반경 6, 패널 반경 14 | 여백 6, 옵션 32, 옵션 반경 8, 패널 반경 14 | **A** | A의 36px 옵션 행이 터치 및 마우스 조작 여유를 제공함. B는 32px로 빽빽하고 옵션 반경(8)이 패널 여백(6)보다 커서 시각 간섭 발생 |
| 메뉴 | 여백 6, 항목 36, 반경 6, 패널 반경 12 | 여백 8, 항목 32, 반경 8, 패널 반경 12 | **A** | A의 36px 항목이 단축키와 긴 라벨을 담기에 쾌적함. B의 32px 항목은 답답하며 가짜 토글/체크 DOM에 의존함 |
| 간격 | 데스크톱 필드 12, 그룹 24 | 데스크톱 필드 10, 그룹 20 | **A** | A의 12/24는 표준 4px/8px 그리드 시스템과 정렬됨. B의 10/20은 모바일 비율 역산으로 인해 불필요한 10px 단위를 양산함 |
| 모바일 | 필드 56, 반경 16, 외부 라벨 outline | 필드 56, 반경 14, 내부 라벨 box 및 속성 행 | **둘 다 수정** | A는 외부 라벨로 세로 공간을 낭비하고, B는 테두리 없는 box로 경계가 불분명함. 둘 다 터치 타깃 44px 미달 컨트롤이 방치됨 |
| Sheet | 반경 24, 여백 20 | 반경 16, 여백 20, 단계적 전환(간단/상세/전체) | **B** | B의 단계적 시트 전환 인터랙션과 기존 DDS Sheet 반경(16px) 유지가 상단 곡률의 안정성과 사용성 면에서 우수함 (A의 24px는 근거 부족) |
| 목록 | 한 줄 56, 두 줄 64, 여백 16, 간격 12 | 한 줄 48, 두 줄 56, 여백 12, 간격 8, SectionHeader | **B** | B가 List를 1차 부품으로 격상하고 행 열기와 보조 메뉴를 분리하며 SectionHeader를 정립한 설계가 실사용 완성도가 높음 |
| Chip | 높이 28/32, 반경 8 | 높이 24/32, 반경 6, 제거형/토글형/툴박스 분리 | **B** | B의 제거형·토글형·툴박스 역할 분리가 논리적임. 단, 데스크톱 높이 24px는 조작 영역이 좁아 28px 상향 검토 필요 |
| 설정 행 | 별도 설정 행 없음 (기존 Radio 목록) | 높이 48/56, 반경 14, 약한 중성 표면, 중성 선택점 | **B** | DS026 기반 설정 행 조합이 설정 화면의 시각 위계를 차분하게 정리하고 저장 CTA만 브랜드로 명확히 분리함 |
| box/line 입력 | 외부 라벨 outline 기본, box/line은 후보 | 묶인 폼 box, 단독 line, 비키보드 property | **A** | B의 테두리 없는 box는 명도 대비 1.09:1로 WCAG 1.4.11을 위반함. A의 outline 기본형이 식별성과 접근성 면에서 필수적임 |
| 다크 | 부유 패널 1px 경계, outline 입력 유지 | 부유 패널 1px 경계, 테두리 없는 box 입력 | **A** | 다크에서 B의 box 입력(1.25:1 대비)은 배경과 구분이 불가능함. A는 stroke-neutral 테두리로 다크에서도 필드가 선명함 |
| 브랜드 | semantic 토큰 연결, 패키지 기본과 분리 | dg-studio 임시 블루(#155EEF) 전면 적용 | **A** | B는 공식 createTheme(#1550A9) 대신 중성색이 어긋난 임시 오버라이드를 기정사실화함. A의 원칙적 분리 접근이 건전함 |
| 이미지 시안 품질 | 11~13 생성 완료, 가독성 양호 | 11만 생성(12~14 누락), 11번 보드 데이터 불일치 | **A** | A는 12, 13 모바일 흐름까지 시각화됨. B는 codex 한도로 누락되었고 11번 보드마저 BRIEF의 동일 배치/데이터 조건을 위반함 |

## B 유도 규칙 자체에 대한 반론

### 1. ÷1.75 단일 배율의 무리한 다중 이미지 확장
B안은 DS024(입력 700×70 raster px = 40px)라는 단 하나의 표본에서 얻은 배율 `1.75`를 전혀 다른 크기와 캔버스 비율을 가진 DS017(500×905), DS021(480×1068), DS026(698×86), DS029, DS014에 기계적으로 적용했다. 원본 연구 문서(`2026-10-06-flex-research/tokens/README.md:83-84`)에서도 "모든 컴포넌트가 하나의 배율로 내보내졌다는 근거는 없다"고 명시적으로 경고하고 있다. 서로 다른 내보내기 배율이 존재할 가능성이 매우 높은 상황에서 단일 배율을 전체 데스크톱 화면에 일괄 대입하여 유도된 값을 'B등급(측정)'이라고 부르는 것은 통계적·과학적 오류다. 이 가정이 흔들리는 순간 B의 모든 측정 등급 값은 C등급(가설/재구성)으로 추락한다.

### 2. 가장 가까운 단계 반올림의 자의성과 사후 합리화
B안의 규칙 1과 2는 상호 모순되며 일관성이 결여되어 있다.
- 선택 패널 반경: DS017 실측 22.5 ÷ 1.75 = 12.85px. 가장 가까운 4의 배수는 12px(오차 0.85)임에도 불구하고, B는 "행 8 + 여백 6 = 14"라는 중첩 관계를 사후에 끌어와 14px로 올렸다.
- 모바일 입력 반경: M020 실측 14.1~15.8px(평균 14.9px). 반올림하면 15px 또는 16px(오차 1.1)가 되어야 마땅하나, B는 아무런 근거 없이 14px로 내렸다.
왜 패널에서는 올리고 모바일 입력에서는 내렸는가? 이는 엄밀한 수학적 유도 규칙이 아니라, A안(입력 반경 16px)과의 차이를 인위적으로 부각시키기 위해 14px라는 숫자에 결과를 끼워 맞춘 사후 합리화(post-hoc rationalization)에 불과하다.

### 3. D(현재 값 유지) 대체 규칙의 자가당착과 접근성 파탄
B안은 "측정이 없으면 새 숫자를 만들지 않고 D(현재 값)를 쓴다"는 규칙 3을 핵심 원칙으로 내세웠다. 그러나:
- Chip 높이: 현재 DDS 비공개 Chip은 20px임에도, B는 측정이 없음에도 24px C라는 새 숫자를 자의적으로 만들었다.
- 입력 테두리: 현재 DDS TextField는 1px 테두리(`stroke-neutral`, 대비 5.03:1)를 명확히 갖고 있다. B는 모바일 이미지 관찰을 핑계로 이 테두리를 완전히 제거하고 면(`bg-neutral-weak`)으로만 채웠다. 그 결과 명도 대비 1.09:1이라는 치명적인 WCAG 1.4.11 위반을 야기했다.
"새 숫자를 만들지 않는다"는 원칙이 정작 기존의 검증된 테두리 계약을 파괴하여 접근성 결함을 만들고, 이를 수습하려면 다시 테두리 숫자를 정의해야 하는 모순적 자가당착에 빠져 있다.

## 작성자가 놓친 관점

1. **4px/8px 시스템 그리드 리듬의 파괴와 인지 부하**:
   B안은 데스크톱 필드 간격 10px, 그룹 간격 20px, 반경 14px 등을 도입했다. 이는 기존 웹 디자인 시스템의 4의 배수 그리드(4, 8, 12, 16, 24...) 리듬을 깨뜨린다. 컴포넌트 간격이 10px, 12px, 14px로 파편화되면 소비 앱 개발자는 매 폼마다 토큰 값을 수동으로 확인해야 하는 극심한 인지 부하를 겪게 된다.

2. **WAI-ARIA 및 키보드 접근성 구현 복잡도**:
   B안이 제시한 DropdownMenu 내 체크/스위치 토글, List 행 내 독립적인 메뉴 분리, Select의 다채로운 옵션 렌더링은 시각적으로는 매력적이지만, WAI-ARIA(메뉴 패턴 vs 리스트박스 패턴, `aria-haspopup`, `aria-expanded`, 포커스 트랩) 명세 충족을 위해 깊은 DOM 재설계가 필요하다. Storybook에 렌더된 B의 외관은 가짜 시각 효과일 뿐이며, 이를 실제 패키지로 배포하기 위한 접근성 비용을 작성자는 과소평가하고 있다.

3. **소비 앱 마이그레이션 및 시각적 일관성 파괴**:
   기존 dg-design 소비 앱들은 모두 outline 기반의 폼 필드를 전제로 화면을 조립해왔다. B안처럼 묶음 폼은 box, 단독 폼은 line, 속성값은 property 행으로 쪼개는 문법을 강제하면, 기존 서비스 화면과의 시각적 충돌과 대규모 리팩터링 비용이 발생한다.

4. **다크 모드에서의 면 분할 한계**:
   다크 테마에서는 라이트 테마보다 명도 구분이 훨씬 어렵다. 표면 간 명도 차이만으로 요소를 구분하려는 B안의 방식은 주변 조명이 밝거나 저가형 모니터 환경에서 완전히 무너진다.

## 작성자에게 묻는 질문 (3~6개, 2라운드 토론 주제)

1. **[box 입력 접근성]**: WCAG 1.4.11(비텍스트 대비 3:1)을 명백히 위반하는 B안의 테두리 없는 box 입력(라이트 1.09:1, 다크 1.25:1)을 실서비스 제품에 출시할 수 있는가? 경계선을 1px라도 추가한다면, 그것은 실질적으로 A안의 outline 입력과 무엇이 다른가?
2. **[데스크톱 실측 배율]**: DS024 외의 다른 이미지들(DS017, DS021, DS026 등)이 동일한 1.75 배율로 내보내졌다는 어떠한 객관적 증거가 있는가? 증거가 없다면 B등급(측정) 표기를 모두 C등급(가설/재구성)으로 공식 강등하는 데 동의하는가?
3. **[반올림 일관성]**: 선택 패널 실측 12.85px는 14px로 올리고, 모바일 입력 반경 평균 14.9px는 14px로 내린 수학적·논리적 기준은 무엇인가? 이것이 A안의 16px를 회피하기 위한 사후 편향이 아니라고 입증할 수 있는가?
4. **[모바일 터치 타깃]**: `touch-target` 역할(44px)을 세웠음에도 모바일 객체 목록 스토리에서 DropdownMenu 더보기 버튼이 36px로 렌더되고 Chip 제거 버튼이 32px에 머무는 이유는 무엇인가? 컴포넌트 API 차원에서 44px hit area를 강제할 구체적 설계가 있는가?
5. **[브랜드 테마 정본]**: 왜 공식 테마 생성기(`createTheme`) 결과인 #1550A9 대신, 중성색이 Teal 계열로 남는 소비 앱의 임시 오버라이드(#155EEF)를 모든 비교의 기준으로 삼았는가? 정식 DDS 릴리스에서 채택할 표준 브랜드 전략은 무엇인가?
