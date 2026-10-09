# B 입력·선택 12개

[공통 규칙·프로필](README.md) · [A 입력·선택](../../design-application/forms.md) · [B 컴포넌트 비교](../components.md)

대상: Button, Field, TextField, TextArea, Checkbox, RadioGroup, Switch, Slider, Select, MultiSelect, DatePicker, FileInput.

표의 역할 행은 [profiles.ts](../../../../../apps/storybook/src/mockups/flex/profiles.ts)에서 생성했다. 형식은 `값 등급`이고 A·B 열은 `데스크톱 / 모바일`이다. 역할 아래 줄(`부위` 이름에 id가 없는 행)은 컴포넌트 고유 값이다. Storybook 치수표의 extra 행과 같으며 근거 칸 첫 글자가 등급이다. 모든 A·B 외관은 시안 CSS [overrides/forms.css](../../../../../apps/storybook/src/mockups/flex/overrides/forms.css)가 현재 컴포넌트 위에 덧씌운 것이다.

## Button `button`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 버튼 반경 (medium) `button-radius` | 8 | 8 C / 12 C | 6 B / 12 B | DS024·026 11.5÷1.75=6.6 · 모바일: M020 16.75×0.75=12.6 |
| 주요 CTA 높이 `cta-height` | 52 | 48 C / 52 C | 48 B / 52 B | DS024 85÷1.75=48.6 · 모바일: M020 68×0.75=51 |
| 높이 small / medium / large | 36 / 40 / 52 | 같음 | 같음 | D 현재 DDS 값 유지(A·B 공통) |
| focus | 2px 링 + 2px 간격 | 같음 | 같음 | D 비입력 컨트롤 계약 유지 |

B 외관: 저장·확정은 `bg-brand-solid` + `fg-brand-contrast`, 취소·닫기는 `bg-neutral-weak` + `fg-neutral`, 문맥 행동은 ghost(`bg-transparent-hover`), 삭제는 `bg-critical-solid`. 화면당 브랜드 CTA는 하나이고 시안 클래스 `.fx-cta`로 일반 버튼과 구분한다. CTA 글자는 `body-size`(14/16).
상태: hover·pressed·focus 분리, disabled, loading 폭 유지. CTA도 같은 상태 축을 쓴다.
다크: solid 버튼의 `fg-brand-contrast` 대비, neutral weak 버튼이 `bg-layer-default` 위에서 구분되는지 확인했다(Storybook 다크 캡처).
모바일: 하단 CTA는 52px·반경 12·폭 100%. 화면 하단 고정 시 safe area 여백은 미검증.
A와 다른 점: 데스크톱 반경이 A 8, B 6. 나머지 치수와 위계 조합은 같다.
구현 수준: 토큰/CSS — 반경 역할 토큰과 CTA 크기 역할만 있으면 된다.
Storybook: `Mockups/Flex/Forms/Button` (Compare)

## Field `field`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 같은 묶음 필드 간격 `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| 묶음 사이 간격 `group-gap` | — | 24 C / 28 B | 20 C / 28 B | 모바일 관계 28:56=1/2 → 40×1/2 · 모바일: M020 36×0.75=27 |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 라벨–컨트롤 간격 | 6 | 6 | 6 | D dimension-x1_5 유지 |
| 라벨 · 설명/오류 글자 | 14 bold · 13 | 같음 | 같음 | D font-size-t4 · t3 유지 |
| 내부 라벨 (B 모바일) | — | — | 12/16 regular · `fg-neutral-weak` | C M005 Caption Medium 12/18 재구성(줄 16) |
| 내부 라벨 면 위아래 · 라벨–값 (B 모바일) | — | — | 8 · 2 | C 56 안에 라벨 줄 16 + 값 줄 24를 맞춤 |

B 외관: 데스크톱 폼 묶음은 외부 라벨(`fg-neutral` bold) + box 입력(`bg-neutral-weak` + `stroke-neutral` 1px). 단독 입력은 외부 라벨 + line. 모바일 묶음은 내부 라벨 box — 작은 라벨과 값이 한 면에 있고 면은 `bg-neutral-weak`, 반경 `field-radius`(14). 설명(`fg-neutral-weak`)·오류(`fg-critical`)는 어느 형태든 면 바깥, 같은 시작선이다. 속성 값(비키보드 값)은 PropertyField로 분리한다(새 종류 문서).
상태: 설명 있음, error, error+focus(내부 라벨 box도 `stroke-critical` 테두리 + 안쪽 1px 유지), disabled·read-only는 컨트롤 상태를 따른다. placeholder로 라벨을 대신하지 않는다.
다크: `bg-neutral-weak` 면이 `bg-layer-default` 위에서 구분된다(캡처 확인). 내부 라벨 `fg-neutral-weak` 대비는 tokens generate의 WCAG 검사 범위.
모바일: 필드 56, 간격 14, 묶음 28. 라벨과 값 줄이 클릭·포커스 영역이다(면 여백 8은 제외). 소프트 키보드에 가려지는 마지막 필드는 미검증.
A와 다른 점: 데스크톱 간격 10/20(A 12/24), 반경 4(A 6), 모바일 반경 14(A 16). A는 외부 라벨 outline이 기본이고 내부 라벨은 후보이며, B는 묶음·단독·모바일에 서로 다른 조합을 표준으로 둔다.
구현 수준: 조합 API — 내부 라벨은 Field 레이아웃(label이 컨트롤 면 안)과 Control wrapper 계약이 필요하다. 시안은 `div.fx-inbox`로 우회했다.
Storybook: `Mockups/Flex/Forms/Field` (Compare)

## TextField `text-field`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 입력 안쪽 여백 `field-inset` | 12 | 12 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 입력 값 글자 `field-font` | 14 | 14 D / 16 C | 14 D / 16 C | 현재 DDS 값 유지 · 모바일: M005 Body Large 16/24 |
| 같은 묶음 필드 간격 `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| focus | 테두리 1px + 안쪽 1px | 같음 | 같음 | D 입력류 계약 유지 — 크기 변화 없음 |
| box 표면 (B) | — | — | `bg-neutral-weak` + `stroke-neutral` 1px | B M024 box. 경계는 D(현재 입력 계약). 면만으로는 1.09:1이라 WCAG 1.4.11 미달 — 2026-10-09 Gemini 검토 수용 |

B 외관: box는 `bg-neutral-weak` + `stroke-neutral` 1px(면만으로는 경계가 1.09:1), hover에 `fg-neutral`, focus에 `stroke-focus-ring` 1px + 안쪽 1px, error에 `stroke-critical`. line은 아래 1px `stroke-neutral`만, 반경 0, 좌우 여백 0, focus는 아래 1px 안쪽 그림자를 더해 2px. outline은 현재 그대로. prefix 아이콘·suffix 단위는 현재 affix 구조.
상태: filled·hover·focus·error·disabled·read-only, error+focus. read-only는 `bg-neutral-weak` + 약한 테두리로 disabled(`bg-disabled`)와 구분.
다크: box 면과 페이지 구분, focus 링 대비 확인(캡처). line의 아래 경계 `stroke-neutral` 대비는 확인.
모바일: 56·r14·안쪽 16·글자 16. 묶음은 내부 라벨 box(Field 절).
A와 다른 점: 반경 4/14(A 6/16). A는 outline 기본·box/line 후보, B는 묶인 폼 box·단독 line을 용도로 고정한다.
구현 수준: 토큰/CSS + variant — box/line은 `appearance` 같은 variant 하나가 필요하다(affix wrapper도 같은 클래스를 받아야 함).
Storybook: `Mockups/Flex/Forms/TextField` (Compare)

## TextArea `text-area`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 입력 안쪽 여백 `field-inset` | 12 | 12 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 입력 값 글자 `field-font` | 14 | 14 D / 16 C | 14 D / 16 C | 현재 DDS 값 유지 · 모바일: M005 Body Large 16/24 |
| 본문 행간 `body-line` | 19 | 19 D / 24 C | 20 B / 24 C | DS024 줄 pitch 36÷1.75=20.6 · 모바일: M005 pitch 48÷2 |
| 위아래 여백 | 8 | 8 / 16 | 8 / 16 | 데스크톱 D dimension-x2 유지 · 모바일 C (field 56 − 줄 24) ÷ 2 |
| 최소 높이 | rows 3 | 같음 | 같음 | D 고정 높이로 자르지 않음 |
| 여러 줄 box 최소 높이 (B 모바일) | — | — | 128 | B M020 173×0.75=129.8 |
| 글자 수 · 오류 배치 | 아래 오른쪽 · 그 아래 | 같은 줄 오른쪽 · 왼쪽 | 같은 줄 오른쪽 · 왼쪽 / 모바일 box: 면 안 오른쪽 아래 · 면 바깥 | C A·B 문서 — 좁으면 줄바꿈 |

B 외관: TextField의 box·line을 그대로 여러 줄에 쓴다(`bg-neutral-weak`+`stroke-neutral` 1px / 아래 1px). 글자 수 `fg-neutral-weak` 12px, 오류 `fg-critical` 13px. 모바일 묶음은 내부 라벨 box(최소 128)이고 글자 수는 면 안 오른쪽 아래.
상태: filled·hover·focus·error·disabled·read-only, autoResize, showCount + error.
다크: box 면 구분, 글자 수 대비 확인(캡처).
모바일: 위아래 16·글자 16·행간 24. resize 손잡이는 터치에서 의미가 약해 autoResize를 기본 권장(미검증).
A와 다른 점: 반경·행간(A 19 / B 20)과 box·line 사용, B 모바일 내부 라벨 여러 줄 box(128). 글자 수·오류 한 줄 배치는 같다.
구현 수준: 토큰/CSS + variant — TextField와 같은 variant. 글자 수·오류 한 줄 배치는 Field가 count 슬롯을 알아야 해서 조합 API(시안은 grid + `display: contents`로 우회).
Storybook: `Mockups/Flex/Forms/TextArea` (Compare)

## Checkbox `checkbox`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 박스 medium / large | 16 r4 / 20 r6 | 같음 | 같음 | D 현재 DDS 값 유지 |
| 라벨 간격 | 8 | 8 | 8 | D dimension-x2 유지 |
| focus | 2px 링 + 2px 간격 | 같음 | 같음 | D 비입력 컨트롤 계약 유지 |
| 모바일 행 | — | large 20 · 행 최소 44 | large 20 · 행 최소 44 | C 터치 행 — 박스만 키우지 않음 |
| 복수 선택 mark와의 관계 | — | 16 / 16 | 같은 r4 · 브랜드 채움, 16 / 18 | C DS017 mark 33÷1.75=18.9 (교차 배율) — 모양은 맞추고 입력 의미는 따로 |

B 외관: 선택은 `bg-brand-solid` + `fg-brand-contrast` 체크, mixed는 가로 표시, 미선택은 `stroke-neutral` 1px. 긴 설명 항목은 박스를 첫 줄 옆에 맞추고 설명은 라벨 시작선(`fg-neutral-weak` 13px).
상태: off·on·mixed × default·hover·focus·disabled, error(off). on+hover는 `bg-brand-solid-hover`.
다크: 미선택 테두리와 disabled 박스 구분 확인(캡처).
모바일: large 20 박스, 라벨 행 전체 44 이상.
A와 다른 점: 치수·조합 모두 A와 같다(MultiSelect mark 크기만 다르다 — MultiSelect 절).
구현 수준: 토큰/CSS — 첫 줄 정렬은 CSS 한 줄(`align-items: flex-start` + 박스 상단 보정).
Storybook: `Mockups/Flex/Forms/Checkbox` (Compare)

## RadioGroup `radio-group`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 설정 행 높이 `setting-row-height` | — | — / — | 48 C / 56 C | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 설정 행 반경 `setting-row-radius` | — | — / — | 14 C / 14 C | DS026 24÷1.75=13.7 (교차 배율) · 모바일: 입력 반경과 같게 |
| 같은 묶음 필드 간격 `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 주요 CTA 높이 `cta-height` | 52 | 48 C / 52 C | 48 B / 52 B | DS024 85÷1.75=48.6 · 모바일: M020 68×0.75=51 |
| radio 원 · 라벨 간격 | 16 · 8 | 같음 | 같음 | D 현재 DDS 값 유지 |
| segmented 높이 | 28 / 36 / 44 | 같음, 모바일 large 44 | 같음, 모바일 large 44 | D 유지 — 모바일은 C 터치 44 이상 |
| segmented 반경 | pill | 바깥 12 · 안쪽 10 (옵션) | pill | A: C A 문서 — inset 2와 함께 · B: D 현재 값 유지 |
| 설정 행 선택점 (B) | — | — | `bg-neutral-solid` + `fg-neutral-contrast` | B DS026 중성 선택 #556373 |
| 설정 행 표면 (B) | — | — | `bg-neutral-weak` · hover `-hover` | B DS026 라디오 행 #F7F7F7 |

B 외관: 일반 radio는 현재 브랜드 원·점 그대로. 설정 화면(DS026)은 행마다 `bg-neutral-weak` 면(48/56, r14, 좌우 `list-inset`), 행 사이 `field-gap`, 선택점은 중성(`bg-neutral-solid` 원 + `fg-neutral-contrast` 점), 강조는 아래 저장 CTA(`bg-brand-solid`, `cta-height`) 하나. 행 전체가 label이라 어디를 눌러도 고른다.
상태: unchecked·checked·hover·checked+hover·checked+focus·pressed·disabled·checked+disabled·error. 설정 행 hover는 `bg-neutral-weak-hover`, focus는 행 바깥 2px 링(박스 링 대신), selected+hover는 표면만 진해지고 선택점은 유지.
다크: 행 면 구분, 중성 선택점(다크에서 밝은 원 + 어두운 점) 대비 확인(캡처).
모바일: 행 56, CTA 52 폭 100%, segmented large 44.
A와 다른 점: A는 기존 radio 목록을 유지하고 설정 행이 없다. A는 segmented에 r12/r10 외형 옵션을 더하고 B는 pill을 유지한다.
구현 수준: 조합 API — 설정 행은 RadioGroup의 `appearance="row"` 같은 variant 또는 List 기반 조합(새 종류 문서의 List·SettingRow와 함께 결정). 중성 선택점은 토큰/CSS.
Storybook: `Mockups/Flex/Forms/RadioGroup` (Compare)

## Switch `switch`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 설정 행 높이 `setting-row-height` | — | — / — | 48 C / 56 C | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 설정 행 반경 `setting-row-radius` | — | — / — | 14 C / 14 C | DS026 24÷1.75=13.7 (교차 배율) · 모바일: 입력 반경과 같게 |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 같은 묶음 필드 간격 `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| track · thumb medium / large | 32×20 · 16 / 40×24 · 20 | 같음 | 같음 | D 현재 DDS 값 유지 |
| 모바일 크기 | medium | large 40×24, 행 전체가 조작 영역 | 같음 | C A 문서 — 시각은 유지하고 조작 영역을 넓힘 |
| 설정 행 위아래 · 라벨–스위치 (A) | — | 12 · 16 | — | C A 문서 — 행 내부 12–16 |
| 미리보기 표면 (B) | — | — | `bg-neutral-weak` · 1px `stroke-neutral-weak` | C 설정 비전(SV087) 응용 — 결과를 같은 화면에 |

B 외관: 스위치 모양은 현재 그대로. 라벨·설명은 왼쪽, 스위치는 오른쪽인 설정 행을 RadioGroup과 같은 중성 행 면으로 그린다. 행 위에 토글 값이 바꾸는 결과 미리보기(예: 주말 열 표시·근무 시간 표시)를 두고, 아래에 저장 경계(변경 있음 문구 `fg-neutral-weak` + 브랜드 CTA, 변경 없으면 disabled).
상태: off·on·on+hover·off+focus·on+pressed·on+disabled. 비동기 반영 중·실패 복구는 앱이 표시한다(미시안).
다크: 행 면·미리보기 면 구분, off track(`bg-neutral-weak-pressed`) 대비 확인(캡처).
모바일: large 40×24, 행 56, CTA 폭 100%.
A와 다른 점: A는 설정 행(표면 없음, 위아래 12)까지만. B는 중성 행 면 + 결과 미리보기 + 저장 경계를 한 조합으로 둔다. 스위치 치수는 같다.
구현 수준: 조합 API — 설정 행(Field 가로 배치)과 저장 경계는 조합 예제. 스위치 자체는 변경 없음.
Storybook: `Mockups/Flex/Forms/Switch` (Compare)

## Slider `slider`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| track small / medium | 4 / 6 | 같음 | 같음 | D 현재 DDS 값 유지 |
| thumb small / medium | 14 / 18 | 같음 | 같음 | D 현재 DDS 값 유지 |
| 입력 높이(drag 영역) | 24 | 24 / 44 | 24 / 44 | 데스크톱 D WCAG 2.5.8 최소 24 유지 · 모바일 C 터치 44 — track·thumb 외형은 그대로 |
| 값 표시 | — | 라벨 오른쪽 · 본문 굵게 · tabular-nums | 같음 | C A 문서 — 라벨과 같은 줄 |
| 결과 예시 (B) | — | — | 슬라이더 아래 · 같은 값 | C 서비스 설정 비전 응용 |

B 외관: 활성 구간 `bg-brand-solid`, 나머지 neutral(현재 그대로). 라벨 행에 값(`output`, `fg-neutral` bold)을 오른쪽 정렬, 설명은 아래 `fg-neutral-weak`. 아래에 같은 값이 적용된 결과 예시(`bg-neutral-weak` 면 + 1px `stroke-neutral-weak`).
상태: default·hover·focus·pressed·disabled, small.
다크: thumb 테두리·track 대비 확인(캡처).
모바일: drag 영역 44, track·thumb 크기는 그대로.
A와 다른 점: 결과 예시 조합만 다르다. 치수는 같다.
구현 수준: 조합 — 값 표시·결과 예시는 Field 조합, Slider 변경 없음.
Storybook: `Mockups/Flex/Forms/Slider` (Compare)

## Select `select`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 선택 패널 반경 `select-panel-radius` | 12 | 14 C / 14 C | 12 C / 12 C | DS017 22.5÷1.75=12.9 → 가장 가까운 단계 12 (교차 배율). 원본도 행 반경+여백과 동심이 아니다 |
| 선택 패널 안쪽 여백 `select-panel-inset` | 4 | 8 C / 8 C | 6 C / 6 C | DS017 행 inset 12÷1.75=6.9 (교차 배율) |
| 옵션 행 최소 높이 `option-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 hover 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 옵션 행 반경 `option-radius` | 6 | 6 D / 6 D | 8 C / 8 C | DS017 12.5÷1.75=7.1 (교차 배율) |
| Chip 높이 `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| Chip 반경 `chip-radius` | 6 | 8 C / 8 C | 6 D / 6 D | 측정 없음, 현재 chip 유지 |
| 버튼 반경 (medium) `button-radius` | 8 | 8 C / 12 C | 6 B / 12 B | DS024·026 11.5÷1.75=6.6 · 모바일: M020 16.75×0.75=12.6 |
| 옵션 좌우 여백 · 표식–글자 | 8 · 8 | 같음 | 같음 | C DS017 16÷1.75=9.1 · 14÷1.75=8 (교차 배율) — 현재와 같음 |
| 아바타 행 실제 높이 | 36 | 36 / 48 | 36 / 48 | C 아바타 small 24 + 행 위아래 6 — option-height는 최소값, 모바일은 48이 정한다 |
| 선택 표식 색 | `fg-neutral`(currentColor) | 같음 | `fg-brand` | B DS017·018 선택 표시와 hover 색 분리 |
| 사람 행 선택 표식 위치 | leading | trailing 체크 | leading | A 문서 — leading Avatar, trailing 선택 표식 · B: D 현재 위치 |
| 버튼 트리거 높이 (B) | — | — | 36 · 좌우 12 | D Button small 재사용 |

B 외관: field·버튼·chip 세 트리거가 같은 `Select.Root`·`Select.Content`를 연다. field는 폼 안에서 box(`bg-neutral-weak`), 버튼 트리거는 Button small neutral weak(`bg-neutral-weak`, bold 13, 반경 `button-radius`), chip 트리거는 `chip-height`·`chip-radius`·12px(`bg-neutral-weak`, 캐럿 12). 패널은 `bg-layer-default` + 1px `stroke-neutral-weak` + `shadow-overlay`. 사람 행은 leading 아바타 24 → 이름 → 소속(`fg-neutral-weak` 13), 간격 `list-leading-gap`. 선택은 `fg-brand` 체크, hover는 `bg-transparent-hover`.
상태: empty·hover·focus·disabled·error 트리거, 열린 패널의 selected+focus와 hover 행 분리. 버튼·chip 트리거 focus는 비입력 2px 링.
다크: 패널 1px 경계, 선택 체크 `fg-brand` 대비, box 트리거 면 구분 확인(캡처).
모바일: 트리거 56·r14, 옵션 48. 모바일 Sheet 컨테이너는 Select 쪽 API가 없어 미시안(Popover 그대로).
A와 다른 점: 패널 여백 6(A 8)·옵션 32/r8(A 36/r6)·트리거 반경 4(A 6). A는 field 트리거만 기본이고 사람 행 체크가 trailing이며, B는 세 트리거를 동등하게 두고 선택 표식을 브랜드로 칠한다.
구현 수준: 조합 API — 버튼·chip 트리거는 `className`만으로 시안이 되지만 `matchTriggerWidth`가 좁은 트리거에서도 패널 최소 폭을 트리거 폭으로 잡는다(패널 폭 옵션 필요). 풍부한 행은 닫힌 값이 행 전체를 그대로 보여 `label`/`textValue` 분리가 필요하다(시안은 Trigger children으로 이름만 넘겨 우회, typeahead 텍스트도 비어 있음).
Storybook: `Mockups/Flex/Forms/Select` (Compare)

## MultiSelect `multi-select`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 복수 선택 사각 mark `mark-size` | — | 16 C / 16 C | 18 C / 18 C | DS017 33÷1.75=18.9 (교차 배율) |
| Chip 높이 `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| Chip 반경 `chip-radius` | 6 | 8 C / 8 C | 6 D / 6 D | 측정 없음, 현재 chip 유지 |
| 선택 패널 반경 `select-panel-radius` | 12 | 14 C / 14 C | 12 C / 12 C | DS017 22.5÷1.75=12.9 → 가장 가까운 단계 12 (교차 배율). 원본도 행 반경+여백과 동심이 아니다 |
| 선택 패널 안쪽 여백 `select-panel-inset` | 4 | 8 C / 8 C | 6 C / 6 C | DS017 행 inset 12÷1.75=6.9 (교차 배율) |
| 옵션 행 최소 높이 `option-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 hover 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| mark 반경 · 선택 | 체크 아이콘 16 | r4 · `bg-brand-solid` + `fg-brand-contrast` 체크 | 같음 | A: C Checkbox small r4 재사용 · B: C DS017 7÷1.75=4.0 (교차 배율) |
| 패널 검색 | 밑줄 2px · 32 | box r6 · 32 | box r6 · 32 | A: C 검색 6 + 여백 8 = 패널 14 · B: C DS017 58÷1.75=33.1 · 9÷1.75=5.1 (교차 배율) |
| 순서 | 검색 → 목록 | 검색 → 선택 수·해제 → 목록 → 도움말 | 같음 | C A·B 문서 — 검색·행동은 listbox 밖 |

B 외관: 단일 Select와 같은 패널·행에 사각 mark(미선택 1px `stroke-neutral`, 선택 `bg-brand-solid` + `fg-brand-contrast` 체크). 패널 검색은 `bg-neutral-weak` box(r6, focus는 입력 계약). 선택 수(`fg-neutral-weak` 13) + "모두 해제"(`fg-brand` bold) 줄, 목록, 아래 도움말(위 1px `stroke-neutral-weak`, 12px "Return으로 선택·해제, Esc로 닫습니다" — DS019 키 안내). 검색 트리거 안 chip은 `chip-height`·`chip-radius`, box 트리거 위에서는 chip 면을 `bg-layer-default`로 바꿔 구분. 툴바 chip 트리거에서도 같은 패널을 연다.
상태: 선택 3 + hover 1(다른 행), 검색 focus, chip 3·5(줄바꿈)·disabled, 모두 해제 disabled(선택 0).
다크: mark 미선택 테두리, 선택 mark 대비, 패널 경계 확인(캡처).
모바일: 옵션 48, 트리거 최소 56, chip 32. mark는 18(B)/16(A) 그대로.
A와 다른 점: mark 18(A 16), chip 24/r6(A 28/r8), 패널 여백 6·옵션 32. 조합은 같고 B만 툴바 chip 진입을 더한다.
구현 수준: API/DOM + CSS — 선택 수·해제·도움말은 listbox 밖 header/footer 슬롯이 필요하다(시안은 listbox 안에 둠). 사람 행 chip은 Select와 같은 label/textValue 분리 문제(chip이 행 전체를 그림)라 시안의 chip 예시는 텍스트 태그로 했다.
Storybook: `Mockups/Flex/Forms/MultiSelect` (Compare)

## DatePicker `date-picker`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 입력 안쪽 여백 `field-inset` | 12 | 12 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| Sheet 안쪽 모서리 `sheet-radius` | 16 | 16 D / 24 C | 16 D / 16 D | 현재 DDS 값 유지 · 모바일: 미측정이라 현재 값 유지 |
| Sheet 안쪽 여백 `sheet-inset` | 24 | 24 D / 20 C | 24 D / 20 B | 현재 DDS 값 유지 · 모바일: M020 26×0.75=19.5 |
| Popover 여백 · 반경 | 16 · 12 | 같음 | 같음 | D 현재 DDS 값 유지 |
| Popover 폭 | 최대 24rem(384) | 같음 | 같음 | D 현재 DDS 값 유지 |
| 날짜·이동 버튼 | 최소 44 | 같음 | 같음 | D 현재 DDS 값 유지 |
| 트리거 | Button neutral weak | outline · 값 왼쪽 | box(`bg-neutral-weak`) · 값 왼쪽 | A: C A 문서 — Field 계열 · B: C property 값 = box 조합 |
| 컨테이너 (B) | — | — | inline · Popover · Sheet 동등 | B M027–029 — inline은 Calendar export 필요 |

B 외관: 트리거는 비키보드 값이라 property 외형 — 입력과 같은 높이·반경·여백의 box(`bg-neutral-weak` + `stroke-neutral` 1px), 값은 왼쪽 regular, disabled는 `bg-disabled`. 달력 내용(오늘·선택·범위)과 값 모델은 현재 그대로이고 컨테이너만 바뀐다. 데스크톱은 Popover(p16·r12·1px 경계), 모바일은 하단 Sheet(r16·안쪽 20, 아래는 safe area 유지).
상태: selected·empty·disabled·description, 열린 상태(selected).
다크: Popover·Sheet 1px 경계, 선택일 `bg-brand-solid` 대비 확인(캡처).
모바일: Sheet 제목·달력 스크롤·하단 행동. 비교 iframe은 화면 높이가 없어 Sheet 높이를 844px 화면의 90dvh(760)로 고정해 보였다(현재 구현은 `min(90dvh, 100% − 1rem)`).
A와 다른 점: 모바일 Sheet 반경 16(A 24), 트리거 box(A outline), 트리거 반경 4/14(A 6/16). B는 inline 컨테이너를 동등한 사용례로 올리지만 지금은 렌더할 방법이 없다.
구현 수준: 조합 API — 트리거 외형은 CSS로 되지만 Field 계열 트리거·inline 컨테이너는 `presentation`(inline/popover/sheet) 확장과 Calendar 공개 export가 필요하다. 컨테이너 선택이 화면 폭(48rem) 고정이라 시안은 비교 열에서 matchMedia를 density에 맞춰 답하게 했다.
Storybook: `Mockups/Flex/Forms/DatePicker` (Compare)

## FileInput `file-input`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 버튼 반경 (medium) `button-radius` | 8 | 8 C / 12 C | 6 B / 12 B | DS024·026 11.5÷1.75=6.6 · 모바일: M020 16.75×0.75=12.6 |
| Dropzone 반경 · 여백 | 12 · 24/16 | 같음 | 같음 | D 현재 DDS 값 유지 |
| Dropzone 바탕 | 투명 · hover `bg-transparent-hover` | `bg-neutral-weak` · hover `-hover` | 같음 | C A 문서 — 약한 중성 바탕 |
| Dropzone 경계 | 1px 점선 `stroke-neutral-weak` | 1px 점선 `stroke-neutral` | 같음 | C 약한 중성 바탕 위에서 식별되게 한 단계 진하게 |
| 파일 행 | 앱 조립 | 아이콘 20 · 이름/크기·상태 · 행동 | 같음 | C A 문서 — 한 행 |

B 외관: Dropzone·파일 행은 A와 같다. 파일 행은 1px `stroke-neutral-weak`·r8, 좌우 `list-inset`, 이름 `fg-neutral` + 크기·상태 `fg-neutral-weak` 13, 오류 행은 `stroke-critical` 경계 + `fg-critical` 상태 + "다시 시도". B는 문서·댓글 속 첨부를 더한다 — 댓글 box TextArea 아래에 파일 행, 작은 "첨부" Trigger(반경 `button-radius`)와 브랜드 등록 CTA.
상태: default·hover·focus·dragging(`bg-brand-weak` + `stroke-focus-ring`)·error·disabled, 파일 완료·올리는 중·오류.
다크: 점선 경계(`stroke-neutral`)가 `bg-neutral-weak` 위에서 보이는지, dragging 면 대비 확인(캡처).
모바일: Dropzone 대신 "파일 선택" Trigger를 폭 100%·최소 44로 앞에 두고 끌어놓기 안내는 짧게.
A와 다른 점: Dropzone·파일 행 치수와 조합은 A와 같다. B만 댓글 첨부 조합을 더한다(목록 행 여백 12, 버튼 반경 6은 공통 역할 차이).
구현 수준: 토큰/CSS + 기존 부품 조합 — 업로드 상태는 앱 소유.
Storybook: `Mockups/Flex/Forms/FileInput` (Compare)

## 검증

- `pnpm --filter @dg-design/storybook typecheck` 통과.
- 12개 Compare를 데스크톱·모바일·다크로 캡처했다(36장, 콘솔 오류 0). 다크 12장 전부와 모바일 11장(Button 제외), 데스크톱 라이트 7장(Field·TextArea·RadioGroup·Select·MultiSelect·DatePicker·FileInput)을 열어 세 열 차이, 오버레이 잘림, 다크 경계를 확인했다. Button·TextField·Checkbox·Switch·Slider의 데스크톱 라이트와 Button 모바일은 캡처만 하고 열어 보지 않았다.
- 비교 화면은 iframe 세 개라 실제 포커스는 한 문서에만 있다. 열린 Select·MultiSelect의 focus 링이 한 열에만 보이는 것은 캡처 조건이다.
- 미검증: 실제 기기 터치 영역, 스크린리더 청취(listbox 안의 선택 수·도움말 포함), 200% 글자 확대, 소프트 키보드, 모바일 Select Sheet.
