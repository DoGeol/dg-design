# 새 종류 3개 · B 치수 명세

[공통 규칙·프로필](README.md) · [A 부족한 종류](../../design-application/README.md#부족한-종류의-구체적인-외형-후보) · [조합 API](../../composition.md) · [구성 규칙(leaf·compound·preset)](../../../../decisions/2026-09-05-component-composition-rules.md)

대상: List·SectionHeader, Chip·FilterToolbox, PropertyField, 그리고 시나리오 셋 — [발행 정보 폼](#발행-정보-폼), [사람 선택](#사람-선택), [객체 목록](#객체-목록).

세 종류 모두 **DDS에 없다.** Storybook에서는 `apps/storybook/src/mockups/flex/proto/`의 전용 프로토타입([List.tsx](../../../../../apps/storybook/src/mockups/flex/proto/List.tsx), [Chip.tsx](../../../../../apps/storybook/src/mockups/flex/proto/Chip.tsx), [PropertyField.tsx](../../../../../apps/storybook/src/mockups/flex/proto/PropertyField.tsx))로 A·B 열을 그리고, 현재 열에는 "현재 없음 — 우회"와 함께 오늘 쓸 수 있는 가장 가까운 조합을 그렸다. 선택 로직(listbox·키보드·포커스 복귀)은 프로토타입이 새로 만들지 않고 DDS Select·MultiSelect·Popover·DropdownMenu를 그대로 쓴다.

표의 숫자는 [profiles.ts](../../../../../apps/storybook/src/mockups/flex/profiles.ts)와 각 Storybook 치수표의 `extra` 행과 같다. 값 뒤 글자는 등급(A 원문, B 측정, C 재구성, D 현재 DDS)이다. "현재"의 —는 DDS가 정하지 않는 값(앱 소유 또는 컴포넌트 없음)이다. API 이름은 모두 후보다.

## 공통 승격 조건

A·B 모두 "실제 두 사용처에서 검증한 뒤 공용화"를 유지한다. B가 바꾸는 것은 **설계 순서**(이 셋을 첫 설계 묶음으로 먼저 그린다)이지 승격 문턱이 아니다.

| 소비자 | 쓰는 종류 | 상태 |
| --- | --- | --- |
| dg-studio homeground-blog 글 목록 | List·SectionHeader(발행됨·초안), Chip(상태·태그 필터), PropertyField(발행 설정) | 시나리오로 재구성 — 실제 화면 미대조 |
| dg-studio 이력서 버전 목록 | List(버전명·수정일·현재 버전 `aria-current`·메뉴), PropertyField(공개 여부·기준 버전) | 요구 확인 필요 — Chip 사용 여부 미확인 |

종류마다 두 소비자에서 **같은 행 구조와 같은 접근성 계약**으로 쓰일 때 승격한다. 한쪽에서만 쓰이는 조합(예: FilterToolbox)은 앱 조합으로 남긴다. 승격 전에 승인된 스펙, user-event 기반 테스트, `*--state-matrix` VR 스토리가 필요하다(AGENTS.md).

## List · SectionHeader `list` (새 종류)

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 목록 한 줄 행 높이 `list-row-1` | — | 56 C / 56 C | 48 C / 56 C | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 목록 두 줄 행 높이 `list-row-2` | — | 64 C / 64 C | 56 C / 64 C | DS014 행 pitch 98.5÷1.75=56.3 (교차 배율) · 모바일: M017 사람:값 행 1.27배, 토큰 x16 |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| leading과 본문 간격 `list-leading-gap` | — | 12 C / 12 C | 8 C / 8 C | DS017 14÷1.75=8 (교차 배율) |
| leading | — | 아이콘 18 / Avatar 24·36 D | 같음 D | Avatar small·medium 재사용, 문서 표식은 36 상자 |
| 구분선 | — | 1px stroke-neutral-weak, 좌우 여백에서 시작 D | 같음 D | 경계 1px |
| focus | — | 행 2px 링(안쪽) | 같음 | 비입력 계약 — 행 링크가 초점 |
| SectionHeader | — | 목록 위 제목만(최소 40 · 13 bold) D | 최소 40 · 제목 13 bold weak D | dimension-x10, t3 |
| 우회(현재 열) | Card p16·r12·테두리 1px / Table 행 44·셀 12/16 | — | — | D 현재 Card·Table |

B 외관: 행은 투명 표면이고 카드로 만들지 않는다. 제목 fg-neutral(두 줄 행은 bold), 메타 t3 fg-neutral-weak(모바일 t4). 문서 표식은 bg-neutral-weak 36 상자 r8 + fg-neutral-weak 아이콘. trailing은 상태 Badge(positive·neutral·informative weak)와 메뉴 버튼(neutral ghost small iconOnly). 행 사이는 좌우 여백에서 시작하는 1px stroke-neutral-weak, 그림자 없음. 묶음은 SectionHeader(t3 bold fg-neutral-weak, 건수 regular) + 접기 chevron + 오른쪽 추가 버튼(neutral ghost small). 선택 모드는 행 leading이 Checkbox로 바뀌고 위에 bg-neutral-weak 선택 막대(건수 + critical weak 행동)가 붙는다.
상태: default · hover(bg-transparent-hover) · focus-visible(행 안쪽 2px stroke-focus-ring) · pressed(bg-transparent-pressed) · 현재 열린 객체(`aria-current`, bg-neutral-weak) · 긴 제목(말줄임, trailing 폭 유지) · 선택 모드(Checkbox 체크). hover·pressed는 행 링크에서만 걸리고 메뉴 버튼 위에서는 행이 반응하지 않는다. selected+hover는 선택 모드에서 행 링크가 없어 Checkbox 자체 hover만 있다. selected+focus는 Checkbox focus 링. disabled 행·loading(Skeleton 행)·empty(StatePanel)는 그리지 않았다 — 미검증.
다크: 구분선·hover 표면·문서 표식 상자가 다크에서 보이는 것을 캡처로 확인했다. 행에 테두리·그림자를 더하지 않는다.
모바일: 행 56/64, 여백 16, 간격 8(B)/12(A), 메타 t4. 메뉴 버튼이 small 36이라 **터치 영역 44에 못 미친다** — 모바일에서 medium 이상 또는 조작 영역 확장이 필요하다(미해결). 긴 제목은 한 줄 말줄임.
A와 다른 점: B 데스크톱이 더 낮고 촘촘하다(48/56 · 여백 12 · 간격 8, A 56/64 · 16 · 12). 모바일 치수는 간격 외에 같다. B는 SectionHeader의 접기·추가·건수·설명과 선택 모드를 함께 정의하고, A는 행 구성만 정의한다.
구현 수준: 새 종류 — 행 구조가 사용처마다 다르고(leading·meta·trailing 유무) 묶음 접기가 aria 연결을 요구해 compound다.
Storybook: `Mockups/Flex/NewKinds/List` (Compare)

API 후보(구성 규칙 2·3단계 → compound, Section에만 context):

```tsx
<List.Root>
  <List.Section>                      {/* 접기 상태와 aria-controls 연결만 context */}
    <List.SectionHeader title="초안·예약" count={2} collapsible action={<Button …>초안 추가</Button>} />
    <List.Item current={false}>
      <List.Leading>…</List.Leading>
      <List.Action href="/posts/d1">다크 모드 대비 검수 메모</List.Action>   {/* asChild 허용, 행 전체 누름 영역 */}
      <List.Meta>접근성 · 10월 5일 수정</List.Meta>
      <List.Trailing><Badge …/><DropdownMenu.Root>…</DropdownMenu.Root></List.Trailing>
    </List.Item>
  </List.Section>
</List.Root>
```

프로토타입은 `ListItem`의 prop(leading·title·meta·trailing·href)으로 그렸다. slot prop이 셋을 넘어서 구성 규칙의 재고 트리거(3개 이상이면 compound 검토)에 걸리므로 승격 시에는 위 compound가 맞다. 선택 모드는 두 소비자 중 한 곳이 일괄 행동을 요구할 때만 넣는다.

접근성 계약:
- `ul`/`li` 구조(`role="list"` 복원). listbox·grid 의미를 붙이지 않는다 — 행마다 독립 행동이 둘 이상이기 때문이다.
- 행의 기본 행동은 하나다. 이동이면 링크, 그 자리 행동이면 버튼. `::after`가 행 전체를 덮어 누름 영역이 되고, trailing의 버튼은 그 위 형제다(링크 안 버튼 중첩 금지). 탭 순서는 행 링크 → trailing 버튼 → 다음 행. trailing 행동이 둘을 넘으면 메뉴로 모은다.
- 링크 이름은 전체 제목이다(말줄임은 CSS만). 메뉴 버튼 이름은 "{제목} 더 보기"처럼 대상을 포함한다.
- 지금 열린 객체는 `aria-current="true"`.
- SectionHeader는 소비자가 고르는 heading(h2~h4) 안에 접기 button(`aria-expanded`, `aria-controls`)을 둔다. 추가 버튼은 heading 밖 형제이고 이름에 대상 종류를 넣는다("초안 추가"). 접힌 목록은 `hidden`.
- 선택 모드에서는 링크를 빼고 Checkbox가 기본 행동이 된다(라벨 = 제목). 선택 건수 문구는 `role="status"`가 필요하다 — 프로토타입은 아직 정적 문구(미검증).

## Chip · FilterToolbox `chip` (새 종류)

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| Chip 높이 `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| Chip 반경 `chip-radius` | 6 | 8 C / 8 C | 6 D / 6 D | 측정 없음, 현재 chip 유지 |
| 제거 버튼 조작 영역 | 칩 안 아이콘 버튼 | 28 / 32 정사각(칩 높이) C | 24 / 32 정사각(칩 높이) C | 제거 버튼 조작 영역 24 → 칩 높이 |
| 글자 | 12 | 12 / 13 D | 12 / 13 D | t2 / t3 |
| 좌우 여백 | 8 | 8 / 12 D | 8 / 12 D | x2 / x3, 제거 버튼 쪽은 0 |
| 켜진 필터 | — | bg-brand-weak · fg-brand C | bg-brand-weak · fg-brand B(낮음) | DS029 옅은 파랑 필터 배경 → semantic |
| focus | — | 필터 칩 2px 링 + 2px 간격, 제거 버튼 안쪽 2px | 같음 | 비입력 계약 |
| 필터 도구(B) | — | 없음 — 앱 조합 | 칩 간격 6 · 결과 수 13 weak · 초기화 small ghost D | x1_5, t3, Button small |

B 외관: 값 칩은 bg-neutral-weak 표면, fg-neutral 글자, 테두리 없음. leading Avatar는 칩 높이 − 4로 줄이고 bg-layer-default로 칩 표면과 구분한다. 제거 버튼은 fg-neutral-weak 아이콘, hover bg-transparent-hover + fg-neutral. 필터 칩(꺼짐)은 bg-layer-default + 안쪽 1px stroke-neutral-weak, 켜짐은 bg-brand-weak + fg-brand + 체크 아이콘. 고정 필터는 같은 칩 모양의 **Select 트리거**("상태: 발행됨")이고 값이 기본이 아니면 켜짐 색을 쓴다. 필터 도구는 칩 → 필터 추가(neutral ghost) → 오른쪽 결과 수·초기화 순서다.
상태: 값 칩 default · disabled(bg-disabled, 제거 버튼도 비활성) · 긴 값(최대 폭 말줄임, 줄바꿈). 제거 버튼 hover · focus · pressed(bg-transparent-pressed) · disabled. 필터 칩 꺼짐 · 켜짐 · hover · focus · 켜짐+focus · pressed · disabled. 켜짐+hover는 bg-brand-weak-hover. 초기화는 모든 값이 기본이면 disabled.
다크: 꺼진 필터 칩의 1px 안쪽 경계와 값 칩 표면이 다크에서 보이는 것을 캡처로 확인했다. 켜짐은 brand-weak 표면 + fg-brand로 대비가 유지된다(WCAG 수치 검사는 tokens generate 범위 밖 — 미검증).
모바일: 칩 32, 글자 13, 좌우 12. 제거 버튼 32×32는 **터치 44에 못 미친다** — 칩 사이 간격 6을 포함해도 인접 칩과 영역이 붙는다(미해결, 실기기 미검증). 필터 도구는 결과 수·초기화가 다음 줄로 내려간다.
A와 다른 점: 치수(A 28/32 · r8, B 24/32 · r6). B는 필터 도구의 결과 수·초기화·고정/제거 규칙을 정의하고 A는 필터 칩 나열까지만 정의한다. 값 칩과 필터 칩을 다른 동작으로 나누는 결론은 같다.
구현 수준: 새 종류 — `Chip`·`FilterChip`은 leaf, 칩 모양 값 선택은 기존 Select에 variant, FilterToolbox는 앱 조합.
Storybook: `Mockups/Flex/NewKinds/Chip` (Compare)

API 후보:

```tsx
<Chip leading={<Avatar.Root …/>} onRemove={…} removeLabel="김도걸 제거">김도걸</Chip>   {/* leaf, span */}
<FilterChip pressed={mine} onPressedChange={setMine}>내 글</FilterChip>               {/* leaf, button[aria-pressed] */}
<Select.Trigger variant="chip">상태: 발행됨</Select.Trigger>                          {/* 구성 규칙 6 — 기존 compound variant */}
```

- `Chip`과 `FilterChip`은 동작이 달라(정적 값 + 제거 / 켜고 끄는 버튼) 한 컴포넌트의 variant로 합치지 않는다. `onRemove`를 주면 `removeLabel`을 타입에서 필수로 만든다.
- MultiSelect의 비공개 chip(20px)은 승격 시 `Chip`을 쓰도록 바꾼다. 지금은 MultiSelect 안에서만 존재한다.
- FilterToolbox의 결과 수·초기화 문구는 앱 언어라(구성 규칙 1단계) DDS에 넣지 않는다. 두 소비자에서 같은 배치가 반복되면 그때 껍데기 compound(Root·Count·Reset)를 검토한다.

접근성 계약:
- 칩 자체는 초점을 받지 않는다. 초점 대상은 제거 버튼 하나이고 이름은 "{값} 제거". 제거 후 초점은 다음 칩의 제거 버튼 → 이전 칩 → 연결된 입력 순으로 옮긴다 — 프로토타입은 아직 옮기지 않는다(미검증).
- 필터 칩은 `button[aria-pressed]`이고 켜짐을 색만으로 표시하지 않는다(체크 아이콘).
- 칩 모양 Select 트리거는 Select의 combobox 계약을 그대로 쓴다. 보이는 글자("상태: …")가 이름에 포함되게 `aria-label`에 필터 이름을 넣는다.
- 필터 도구는 `role="group"` + 이름. 결과 수는 `role="status"`(aria-live를 얹지 않는다). 고정 필터는 제거 버튼이 없고 값만 바꾼다. 추가한 필터만 제거 버튼이 있다.
- Badge(읽기 전용 상태)와 Chip(사용자가 고른 값)을 시각·동작 모두 구분한다.

## PropertyField `property-field` (새 종류)

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 — B 데스크톱은 행 hover 표면 반경 |
| 입력 안쪽 여백 `field-inset` | 12 | 12 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| 설정 행 높이 `setting-row-height` | — | — / — | 48 C / 56 C | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 — 프로토타입의 데스크톱 속성 행은 `field-height` 40을 쓰고, 48은 설정(Radio·Switch) 행용이다 |
| 설정 행 반경 `setting-row-radius` | — | — / — | 14 C / 14 C | DS026 24÷1.75=13.7 (교차 배율) · 모바일: 입력 반경과 같게 — 모바일 묶음 표면 반경 |
| 라벨 | 필드 위 14 bold | 상자 안 왼쪽 14 약한 글자 / 위 12 약한 글자 C | 왼쪽 1/3 열 14 약한 글자 / 왼쪽 16 본문색 | B M026 속성 행 배치, 글자는 D |
| 값 | Select 값 | 왼쪽 정렬 · 본문색 D | 왼쪽 정렬 · 본문색 / 오른쪽 정렬 · 약한 글자 | B M026 |
| focus | 테두리 1px + 안쪽 1px | 테두리 1px + 안쪽 1px | 행 안쪽 2px 링 | 테두리 없는 행 — 비입력 링 |
| 행 구분선 | — | — | 1px · 안쪽 여백에서 시작 D | 경계 1px |

B 외관: 데스크톱은 테두리 없는 행에 라벨(fg-neutral-weak) 1/3 열 + 값(fg-neutral) + caret(fg-neutral-weak). hover는 bg-transparent-hover, 행 반경 `field-radius`. 모바일(M026)은 bg-neutral-weak 묶음 표면(r14) 안에 56 행을 쌓고, 라벨은 fg-neutral 16, 값은 오른쪽 정렬 fg-neutral-weak, 행 사이 1px stroke-neutral-weak는 안쪽 16에서 시작한다. 날짜·사람처럼 Select가 아닌 값은 같은 행에 Popover 트리거 버튼을 끼운다.
상태: 값 있음 · placeholder(fg-neutral-weak) · hover · focus · 열림(DDS Select 패널) · error · disabled. error는 A가 상자 테두리 stroke-critical, B가 행 안쪽 1px stroke-critical(focus 시 2px) + 행 아래 오류 문구(묶음 안 여백 16). error+focus는 critical 링. disabled는 bg-disabled + fg-disabled. pressed는 열림으로 대신한다. read-only 값(바꿀 수 없는 속성)은 트리거 없는 정적 행이어야 한다 — 그리지 않았다(미검증).
다크: 데스크톱 다크 캡처에서 B 행 구분선, 오류 행의 critical 경계, 열린 Select 패널의 1px 경계를 확인했다. 모바일 묶음 표면(bg-neutral-weak)의 다크 대비는 모바일+다크 캡처가 없어 미검증.
모바일: 행 56, 안쪽 16, 라벨 왼쪽·값 오른쪽. 행 전체가 누름 영역이라 높이 56이 그대로 터치 영역이다. 패널은 값 영역 기준으로 열린다(아래 API 필요 참고).
A와 다른 점: 높이·안쪽 여백은 같다. A는 필드 상자(데스크톱 40 · r6, 모바일 56 · r16) 안에 라벨·값을 넣고 모바일은 라벨을 위로 올린다(내부 라벨 후보). B는 테두리 없는 속성 행이고 모바일은 묶음 표면(r14) 안 행이다. 반경은 A 6/16, B 4/14.
구현 수준: 조합 API — 새 컴포넌트보다 Field의 배치 variant와 Select 트리거 variant로 먼저 시도한다.
Storybook: `Mockups/Flex/NewKinds/PropertyField` (Compare)

API 후보(구성 규칙 6단계 우선):

```tsx
<Field.Group label="발행 설정">                     {/* 모바일 묶음 표면. role=group */}
  <Field.Root layout="property">                    {/* 라벨 왼쪽, 컨트롤 오른쪽 */}
    <Field.Label>공개 범위</Field.Label>
    <Select.Root defaultValue="link">
      <Select.Trigger variant="property" />         {/* 테두리 없음, 상자 전체 누름 영역 */}
      <Select.Content>…</Select.Content>
    </Select.Root>
  </Field.Root>
</Field.Group>
```

variant로 안 되는 요구(아래 API 필요의 anchor·라벨 연결)가 남으면 그때 `PropertyField.Root/Label/Value` compound를 만든다. 프로토타입은 `PropertyField`(label·layout·description·error) + `PropertySelect` + `PropertyButton` + `PropertyGroup`으로 그렸다.

접근성 계약:
- 텍스트 입력이 아니다. 키보드로 값을 쓰지 않고 선택창을 연다. Select형은 combobox(listbox 팝업), Popover형은 `button[aria-haspopup="dialog"]`.
- 라벨은 버튼 밖 `<label for>`이고 트리거의 `::after`가 상자 전체를 덮는다. 라벨을 눌러도 열린다.
- Select형은 Field 연결(라벨 for · aria-describedby · aria-invalid)을 Select가 이미 한다. Popover형은 Field.Label의 for가 닿지 않아 `aria-labelledby="{라벨} {값}"`으로 이름에 현재 값을 넣었다.
- 열림 후 선택하면 초점은 트리거로 돌아온다(Select 기존 동작). Popover형의 복귀는 Popover 계약을 따른다.
- 오류는 상자·행 밖 Field.ErrorMessage로 두고 placeholder로 라벨을 대신하지 않는다.

## API 필요 (스크린샷에서 드러난 것)

| 필요 | 근거 화면 | 대상 |
| --- | --- | --- |
| Select 패널 anchor를 트리거가 아닌 행 상자로 | PropertyField 열림 — 패널이 값 영역에서 시작 | Select.Root `anchor` 또는 트리거 variant |
| 칩 모양 트리거의 패널 최소 폭 | Chip 고정 필터 열림 — `matchTriggerWidth`로 패널이 칩 폭(약 90) | Select.Content `minWidth` |
| Field.Label for를 Popover 트리거에 연결 | PropertyField 발행 시각 — FieldContext 비공개 | Field의 control id 노출 또는 PropertyField 소유 id |
| 빈 결과 슬롯 | 사람 선택 "홍길순" — 현재 빈 패널만 | `MultiSelect.Empty`(listbox 밖, `role="status"`) |
| 옵션의 표시 label · 검색 textValue · 행 표현 분리 | 사람 선택 — 아바타·팀을 children에 넣으면 한 명 선택 시 트리거에 행 전체가 나옴 | Select·MultiSelect.Option ([조합 API](../../composition.md#select--multiselect)와 같은 결론) |
| 칩 제거 후 초점 이동 | Chip 제거 | Chip 계약 |

## 발행 정보 폼

TextField + PropertyField 행 + 한 줄 메모 + CTA. 같은 값으로 세 안을 비교한다.

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 입력 반경 `field-radius` | 8 | 6 C / 16 C | 4 B / 14 B | DS024 7.5÷1.75=4.3 · 모바일: M020 18.75~21×0.75=14.1~15.8, 평균 14.9 |
| 같은 묶음 필드 간격 `field-gap` | — | 12 C / 14 B | 10 C / 14 B | 모바일 관계 14:56=1/4 → 40×1/4 · 모바일: M020 18.5×0.75=13.9 |
| 주요 CTA 높이 `cta-height` | 52 | 48 C / 52 C | 48 B / 52 B | DS024 85÷1.75=48.6 · 모바일: M020 68×0.75=51 |
| 설정 행 반경 `setting-row-radius`(B 모바일) | — | — / — | 14 B / 14 C | DS026 24÷1.75=13.7 · 모바일: 입력 반경과 같게 |

조합: 현재는 모든 값이 외부 라벨 + outline(선택은 Select, 발행 시각은 읽기 전용 입력 + 변경 버튼). A는 외부 라벨 outline + PropertyField 상자. B는 글(제목·한 줄 설명)이 box(모바일은 M024 내부 라벨 box), 발행 설정이 속성 행 묶음(M026), 메모가 line, CTA가 데스크톱 헤더 오른쪽 · 모바일 하단 폭 전체.
상태: 카테고리 미선택 error를 세 안 모두 같은 위치(필드·행 아래)에 둔다. 공개 범위 열림은 같은 DDS Select 패널.
다크·모바일: 데스크톱 다크와 모바일 라이트 캡처 확인(모바일+다크 미캡처). 묶음 사이 간격(`group-gap`)은 이 시안에 적용하지 않았다 — Storybook 구역 간격은 비교 틀 값이다.
A와 다른 점: 치수는 반경·간격만 다르고, 조합은 값의 성격마다 표현이 다르다(B: box·property·line, A: outline 하나).
Storybook: `Mockups/Flex/Scenarios/FormTask` (Compare)

## 사람 선택

Avatar + MultiSelect + Chip. 네 상태를 실제 MultiSelect로 한 화면에 열어 둔다(제어 `open`이라 형제가 닫지 못한다).

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 입력·선택 트리거 높이 `field-height` | 40 | 40 C / 56 C | 40 B / 56 B | DS024 70÷1.75=40 (배율 기준) · 모바일: M020 74.5×0.75=55.9 |
| 옵션 행 최소 높이 `option-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 hover 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| Chip 높이 `chip-height` | 20 | 28 C / 32 C | 24 C / 32 C | 제거 버튼 조작 영역 24 · 모바일: 터치 행 |
| Chip 반경 `chip-radius` | 6 | 8 C / 8 C | 6 D / 6 D | 측정 없음, 현재 chip 유지 |

| 상태 | 현재 | A·B | 화면 출처 |
| --- | --- | --- | --- |
| 선택됨 · 3명 | 검색 트리거 안 비공개 chip | 요약 트리거 "3명" + 아래 Chip(Avatar + 제거) 줄 | 실제 DDS + 프로토 Chip |
| 검색 결과 없음 | 빈 패널만 | 패널 안 "일치하는 사람이 없습니다." | A·B 문구는 **CSS 재구성**(`::after`) — Empty 슬롯 제안 |
| 생성 실패 | 만들기 항목 + `role="alert"` 문구 | 같음(패널 검색 위치만 다름) | 실제 DDS — 효과가 만들기 항목을 한 번 click, onCreate가 reject |
| 탐색 중 | 활성 행 배경(`aria-activedescendant`) | 첫 행 초점 2px 링 | 실제 DDS — 효과가 검색 입력에 ArrowDown 한 번. 비교 화면은 iframe 하나만 실제 초점을 가져 초점 행에 강제 focus 표시를 달았다 |

조합: 옵션 행은 Avatar 24 + 이름 + 팀(fg-neutral-weak). B 모바일은 속성 행("참여자 · n명")으로 들어가 같은 패널을 연다. 한 명 선택 시 트리거에는 이름만 넘긴다 — 옵션 children이 행 표현까지 품는 문제의 우회.
다크: 데스크톱 다크 캡처에서 패널 1px 경계, 생성 실패 critical 글자, 빈 결과 문구를 확인했다. 모바일+다크는 캡처하지 않았다.
A와 다른 점: 칩 치수(28/32·r8 대 24/32·r6), 옵션 행 36 대 32, B 모바일의 속성 행 진입.
Storybook: `Mockups/Flex/Scenarios/PersonPicker` (Compare)

## 객체 목록

List + Badge + DropdownMenu. homeground-blog 글 목록을 재구성했다. 행 열기(제목 링크 = 행 전체)와 오른쪽 메뉴 버튼을 분리하고, 마지막 행의 메뉴를 열어 둔다.

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 목록 두 줄 행 높이 `list-row-2` | — | 64 C / 64 C | 56 C / 64 C | DS014 행 pitch 98.5÷1.75=56.3 (교차 배율) · 모바일: M017 사람:값 행 1.27배, 토큰 x16 |
| 목록 행 좌우 여백 `list-inset` | — | 16 C / 16 C | 12 B / 16 B | DS024 20÷1.75=11.4 · 모바일: M020 22×0.75=16.5 |
| leading과 본문 간격 `list-leading-gap` | — | 12 C / 12 C | 8 C / 8 C | DS017 14÷1.75=8 (교차 배율) |
| 메뉴 항목 최소 높이 `menu-item-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 보조 행동 | DropdownMenu 버튼(36 ghost) | 같음 D | 같음 D | Button small iconOnly |

조합: 현재는 Card를 행처럼 쌓아 제목 링크만 누를 수 있다. A는 List 한 덩어리. B는 필터 도구(내 글·최근 수정, 결과 수, 초기화) → SectionHeader "발행됨 2"(접기) → 행 → SectionHeader "초안·예약 2"(접기 + 초안 추가) → 행.
다크·모바일: 데스크톱 다크와 모바일 라이트 캡처 확인(모바일+다크 미캡처). 모바일 메뉴 버튼 36은 터치 44 미달(List와 같은 미해결).
A와 다른 점: 행 치수와 B의 필터 도구·묶음 제목.
Storybook: `Mockups/Flex/Scenarios/ObjectList` (Compare)

## 검증 범위

- 검증한 것: Storybook 타입 검사, 여섯 Compare 스토리의 데스크톱 라이트·모바일 라이트·데스크톱 다크 캡처를 눈으로 확인.
- 시안 화면 재구성: 사람 선택의 빈 결과 문구(CSS `::after`), 탐색 중의 초점 표시(비교 화면은 iframe 하나만 실제 초점을 가져 강제 focus 클래스를 달았다).
- 검증하지 않은 것: 모바일+다크 조합, 스크린리더 청취(특히 Popover형 PropertyField 이름, 필터 결과 수 status), 실제 터치 영역, 200% 글자 확대, 제거 후 초점 이동, 이력서 버전 목록의 실제 요구.
