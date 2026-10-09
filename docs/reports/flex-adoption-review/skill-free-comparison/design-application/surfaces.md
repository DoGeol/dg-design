# 표면·레이어 7개 · B 치수 명세

[공통 규칙·프로필](README.md) · [A 표면·레이어](../../design-application/surfaces.md) · [portal·스크롤 계약](../../composition.md)

대상: Dialog, Sheet, Popover, HoverCard, Tooltip, Card, Separator, 그리고 [작업 패널 시나리오](#작업-패널-시나리오).

부유 패널은 **기본 표면(bg-layer-default) + shadow-overlay + 1px stroke-neutral-weak**를 그대로 쓴다. 다크에서 테두리를 빼는 변경은 대상이 아니다. B가 A와 달라지는 곳은 Dialog의 보기 체계, 모바일 Sheet의 반경과 단계 전환, Popover의 기능별 컨테이너 세 곳이다. 나머지 넷은 치수·조합 모두 A와 같다.

표의 숫자는 [profiles.ts](../../../../../apps/storybook/src/mockups/flex/profiles.ts)와 각 Storybook 치수표의 `extra` 행과 같다. 값 뒤 글자는 등급(A 원문, B 측정, C 재구성, D 현재 DDS)이다. 작업형 Dialog 부품은 Storybook 전용 [프로토타입](../../../../../apps/storybook/src/mockups/flex/proto/DialogLayout.tsx)으로 그렸다 — packages/react에 없다.

## Dialog `dialog`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 작업 패널 본문 여백 `panel-inset` | 24 | 40 C / 20 C | 40 C / 20 B | DS026 72÷1.75=41.1 (교차 배율) · 모바일: M020 26×0.75=19.5 |
| 확인형 | min(32rem, 화면−32) · p24 · gap12 · r16 | 같음 D | 같음 D | 현재 값 — 세 안 동일 |
| 작업형 중앙 폭 | 없음(확인형 조립) | min(48rem, 화면−32) C | min(48rem, 화면−32) C | 본문 32rem(현재 폭) + Aside 16rem |
| Aside 폭 · 여백 | 없음 | 16rem · 20 C | 16rem · 20 C | 본문 폭의 1/2 · x5 |
| Toolbar | 없음 | 세로 8 · 끝 12 · 시작 = 본문 여백, 아래 경계 1px C | 같음 C | 대상 시작선을 본문과 맞춤 |
| Footer | 없음 | 세로 16 · 좌우 = 본문 여백, 위 경계 1px C | 같음 C | Body 아래에만 |
| 좁은 패널 | — | 폭 560 미만이면 Aside를 본문 뒤로 C | 같음 C | 측면 보기·모바일에서 단일 열 |
| 측면 보기 폭 | — | 없음 | min(24rem, 화면−32), 오른쪽 붙음 D | Sheet 좌우 폭 재사용 |

A 원문은 본문 여백(32–40 후보)과 부품 구분만 정했다. 중앙 폭·Aside·Toolbar·Footer·좁은 패널 치수는 이번 시안이 관계식으로 정해 A·B 열에 똑같이 적용한 값이다(A 원문 값이 아니다).

B 외관: 확인형은 지금 Dialog 그대로다(bg-layer-default, 1px stroke-neutral-weak, r16, shadow-overlay, 제목 t7 bold, 설명 t4). 작업형은 같은 표면 위에 **Toolbar / Body / Footer | Aside**를 나눈다. Toolbar는 대상(t3 fg-neutral-weak) · 상태 Badge(informative weak) · 보기 전환 · 닫기(neutral ghost 아이콘 버튼)를 한 줄에 둔다. Body는 제목 → 판단 자료(변경 내용) → 폼 순서이고 여백 40이다. Footer는 Body 열 아래에만 붙고(취소 neutral weak, 확정 brand solid) Aside 밑으로 이어지지 않는다. Aside는 세로선(stroke-neutral-weak)으로 나눈 활동 로그다. 같은 작업을 **중앙**(48rem, r16) · **측면**(24rem, 오른쪽 붙음, 왼쪽 모서리만 r16) · **전체**(화면 전체, r0, 테두리 없음) 세 보기로 연다(DS008–011).
상태: 패널은 open·closed뿐. 초기 포커스는 첫 입력, 닫기 버튼은 2px 링. 보기를 바꿔도 같은 Content가 유지돼 입력값·포커스가 남는다(Storybook에서 확인 — 메모 입력 후 중앙→측면→전체). 긴 본문은 Body만 스크롤되고 Toolbar·Footer는 고정. 저장 중·미저장 닫기 정책은 앱 소유.
다크: 패널 1px 테두리가 유일한 경계다(딤·패널·페이지 합성색이 거의 같다). Toolbar 아래·Footer 위·Aside 왼쪽의 1px 구분선도 stroke-neutral-weak로 다크에서 보인다 — 다크 스크린샷에서 확인. 전체 보기는 테두리가 없어 화면 끝이 경계다.
모바일: 중앙 보기를 쓰지 않는다. 전체 보기(M031) 또는 하단 Sheet로 열고, Aside는 본문 뒤 보조 구역으로 내려 본문과 함께 스크롤된다. Footer는 아래 고정, CTA 52(`cta-height`).
A와 다른 점: 치수(여백 40/20, 부품 치수)는 같다. A는 부품만 정의하고 보기 전환을 후속 검토로 남겼고, B는 중앙·측면·전체 보기를 부품과 함께 정의한다. 모바일은 A가 "본문 뒤 재배치 또는 탭", B가 "전체 보기 또는 Sheet"다.
구현 수준: 조합 API — Dialog.Toolbar·Body·Aside·Footer 부품과 `view` 축(center·side·full)이 필요하고 기존 확인형 호환을 지킨다.
Storybook: `Mockups/Flex/Surfaces/Dialog` (Compare)

## Sheet `sheet`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| Sheet 안쪽 모서리 `sheet-radius` | 16 | 16 D / 24 C | 16 D / 16 D | 현재 DDS 값 유지 · 모바일: 미측정이라 현재 값 유지 |
| Sheet 안쪽 여백 `sheet-inset` | 24 | 24 D / 20 C | 24 D / 20 B | 현재 DDS 값 유지 · 모바일: M020 26×0.75=19.5 |
| 좌우 Sheet 폭 | min(24rem, 화면−32) | 같음 D | 같음 D | 현재 값 |
| 상하 Sheet 높이 | min(20rem, 화면−32) 고정 | 짧은 선택 내용 높이 · 긴 폼 최대 90dvh C | 같음 C | DatePicker 90dvh 선례 |
| 스크롤 | 내용 전체 | Body만 — 제목·닫기·Footer 고정 C | 같음 C | — |
| 하단 safe area | 없음 | Footer 아래 max(16, env(safe-area-inset-bottom)) C | 같음 C | — |
| 드래그 핸들 | 없음 | 없음 — 실제 drag를 줄 때만 | 같음 | A 원문 조건 |
| 단계 전환 | 없음 | 없음 | 간단 → 상세(90dvh) → 전체(100%, r0), 같은 값 | B M031 가변·전체 모달 |

B 외관: 표면은 지금 Sheet 그대로(bg-layer-default, 안쪽 변만 1px stroke-neutral-weak, shadow-overlay). 작업형 내용은 Dialog와 같은 부품(Toolbar / Body / Footer, Aside는 본문 뒤)을 쓰고 여백은 `sheet-inset`이다. 모바일 하단 Sheet는 같은 컨테이너에서 **간단**(상태 라디오 + 한 줄 메모, 내용 높이) → **상세**(전체 폼, 최대 90dvh) → **전체**(화면 전체, r0, 활동 포함)로 넓어진다. 세 단계 모두 같은 메모 값을 보여 준다.
상태: 단계가 바뀌어도 값·포커스 유지. 뒤로가기는 이전 단계, 닫기는 Sheet 전체를 닫는다. 넓히기 버튼은 Toolbar의 neutral ghost 아이콘 버튼(aria-pressed). 짧은 선택은 빈 높이를 남기지 않는다.
다크: 하단 Sheet는 위 변 1px, 좌우 Sheet는 안쪽 변 1px이 경계다. 전체 단계는 테두리가 없다. 다크 스크린샷에서 위 변·안쪽 변 확인.
모바일: 390px에서 r16·여백 20. CTA는 폭 전체 52(`cta-height`), 아래에 safe area. 소프트 키보드가 올라와도 마지막 필드와 CTA에 닿아야 한다 — 실기기 미검증.
A와 다른 점: 모바일 반경이 다르다(A 24 C 디자인 제안, B 16 D — 측정이 없어 현재 값). 여백 20은 같다. B는 간단→상세→전체 단계 전환을 정의하고 A는 높이·safe area·스크롤 정리까지다. 데스크톱은 두 안 모두 현재와 같다.
구현 수준: 조합 API — 높이 축(content-fit·제한·전체)과 Header/Body/Footer 부품, 단계 전환 시 값 보존 계약. 모든 Dialog를 자동 Sheet로 바꾸지 않는다.
Storybook: `Mockups/Flex/Surfaces/Sheet` (Compare)

## Popover `popover`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 선택 패널 반경 `select-panel-radius` | 12 | 14 C / 14 C | 12 C / 12 C | DS017 22.5÷1.75=12.9 → 가장 가까운 단계 12 (교차 배율). 원본도 행 반경+여백과 동심이 아니다 |
| 선택 패널 안쪽 여백 `select-panel-inset` | 4 | 8 C / 8 C | 6 C / 6 C | DS017 행 inset 12÷1.75=6.9 (교차 배율) |
| 옵션 행 최소 높이 `option-height` | 32 | 36 C / 48 C | 32 C / 48 C | DS017 hover 행 56÷1.75=32 (교차 배율) · 모바일: 터치 행 44 이상 |
| 옵션 행 반경 `option-radius` | 6 | 6 D / 6 D | 8 C / 8 C | DS017 12.5÷1.75=7.1 (교차 배율) |
| 설정 행 높이 `setting-row-height` | — | — / — | 48 C / 56 C | DS026 행 84÷1.75=48 (교차 배율) · 모바일: 필드 높이와 같게 |
| 설정 행 반경 `setting-row-radius` | — | — / — | 14 C / 14 C | DS026 24÷1.75=13.7 (교차 배율) · 모바일: 입력 반경과 같게 |
| 정보·설정 컨테이너 | p16 · r12 · 최대 24rem · arrow 8 | 같음 D | 같음 D | 측정 없음 — 현재 유지 |
| 선택 컨테이너 | p16 · r12 (정보형과 같음) | 같음 D | r14 · 여백 6 B | 위 선택 패널 역할 |

`select-panel-*`의 "현재"(12/4)는 Select 목록 패널의 값이다. 오늘 Popover에 선택 목록을 넣으면 정보형과 같은 p16·r12가 된다.

B 외관: 담는 기능별로 컨테이너를 나눈다. **정보**(제목 bold · 설명 t3 fg-neutral-weak · neutral weak 행동)는 p16·r12. **선택**은 선택 패널과 같은 r14·여백 6, 행 32·r8, 선택 체크는 fg-brand, hover는 bg-transparent-hover(중성). **설정**은 바깥 p16·r12에 DS026 설정 행(bg-neutral-weak, 48·r14, 좌우 12)과 brand solid 저장. 셋 모두 같은 표면·경계·portal·focus 계약.
상태: 행 hover(중성 배경)와 선택(체크)을 분리한다. 행 focus-visible은 안쪽 2px 링. 열림은 비모달 그대로이고 같은 자리 형제 오버레이는 하나만 열린다.
다크: 세 컨테이너 모두 1px stroke-neutral-weak 경계가 보인다 — 다크 스크린샷 확인. 설정 행 표면(bg-neutral-weak)이 패널 바탕과 구분된다.
모바일: 행은 터치 높이 48(옵션)·56(설정). 선택지가 길거나 입력이 있으면 Popover 대신 하단 Sheet 조합을 쓴다.
A와 다른 점: A는 담는 내용과 상관없이 Popover를 p16·r12로 두고 선택 전용 패널(r14·p8)은 Select의 몫으로 남긴다. B는 Popover 안에서도 선택형이면 선택 패널 치수(r14·6)를, 설정형이면 설정 행을 쓴다. 정보형은 두 안이 같다.
구현 수준: 토큰/CSS — 컨테이너 표현을 class나 `variant`로 고르는 정도. 설정 행은 RadioGroup 쪽 결정([입력·선택](forms.md))을 따른다.
Storybook: `Mockups/Flex/Surfaces/Popover` (Compare)

## HoverCard `hover-card`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 표면 | p16 · r12 · 최대 24rem · arrow 8 | 같음 D | 같음 D | 현재 값 |
| 내부 간격 | 소비자 조합 | Avatar–이름 12 · 묶음 16 C | 같음 C | 소비자 조합(A 후보와 같음) |

B 외관: Popover와 같은 표면. 사람 미리보기는 Avatar(large) → 이름 bold + 역할 Badge → 보조 정보(t3 fg-neutral-weak) → 짧은 내용 → neutral weak 행동 하나. 편집 같은 중요한 작업은 넣지 않는다.
상태: hover 지연 열림·닫힘은 현재 그대로. 트리거 링크 자체로도 같은 정보에 갈 수 있어야 한다.
다크: 1px 경계 유지 — 다크 스크린샷 확인.
모바일: hover가 없다. 탭은 링크 이동이고, 꼭 필요한 정보는 클릭 Popover나 상세 화면으로도 제공한다.
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 토큰/CSS — 변경 없음, 소비자 조합만.
Storybook: `Mockups/Flex/Surfaces/HoverCard` (Compare)

## Tooltip `tooltip`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 표면 | p6·8 · r8 · 최대 16rem · bg-neutral-solid | 같음 D | 같음 D | 현재 값 |
| 글자 | 12 / t2 · fg-neutral-contrast | 같음 D | 같음 D | 현재 값 |
| 경계 | 없음 — 반전 표면 | 같음 | 같음 | 현재 값 |

B 외관: 지금 반전 표면 그대로. 아이콘 버튼의 이름이나 짧은 부연만 넣고, 접근 이름은 aria-label이 맡는다.
상태: focus·hover로 열리고 Escape로 닫힌다. 화면 경계 배치는 현재 계약.
다크: 반전 표면이라 테두리가 필요 없다. 다크에서 밝은 표면·어두운 글자로 뒤집혀 보이는지 스크린샷 확인.
모바일: 볼 수 없어도 핵심 행동을 이해할 수 있어야 한다. 긴 설명·링크·버튼은 Popover, 필수 안내는 Field.Description으로.
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 토큰/CSS — 변경 없음.
Storybook: `Mockups/Flex/Surfaces/Tooltip` (Compare)

## Card `card`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 기본 | r12 · p16 · 1px stroke-neutral-weak · 그림자 없음 | 같음 D | 같음 D | 현재 값 |
| 클릭 hover / focus | 테두리 stroke-neutral / 2px 링 + 2px 간격 | 같음 D | 같음 D | 현재 값 |
| 큰 카드 | 없음 | r16 · p24 C | 없음 D | 측정 없음 — 만들지 않음 |

B 외관: 지금 카드 그대로. 독립 요약에만 쓰고, 연속 객체 목록은 List가 먼저다([새 종류](new-kinds.md)). 기본 카드에 overlay 그림자를 넣지 않는다.
상태: 정적 / 링크·버튼(asChild) hover 테두리 / focus 2px 링 / 버튼 disabled. 안에 행동이 여럿이면 카드 전체를 링크로 감싸지 않는다.
다크: 1px 테두리가 카드 경계다 — 다크 스크린샷 확인.
모바일: 높이는 내용을 따르고 제목·메타·행동 순서를 유지한다.
A와 다른 점: A는 복잡한 큰 카드에 r16·p24 후보를 두고, B는 측정 근거가 없어 큰 카드 단계를 만들지 않는다. 기본 카드는 같다.
구현 수준: 토큰/CSS — 변경 없음(A 후보를 채택할 때만 크기 옵션).
Storybook: `Mockups/Flex/Surfaces/Card` (Compare)

## Separator `separator`

| 역할 | 현재 | A 데스크톱 / 모바일 | B 데스크톱 / 모바일 | B 근거 |
| --- | --- | --- | --- | --- |
| 두께 · 색 | 1px · stroke-neutral-weak | 같음 D | 같음 D | 현재 값 |

B 외관: 지금 그대로. 면 끝까지 나누는 전체 폭과 텍스트 시작선에 맞춘 inset을 구분한다. 수직선은 작업형 Dialog Aside처럼 실제 열을 나눌 때만.
상태: 없음. 기본 decorative, 의미 있는 구분이면 `decorative={false}`.
다크: stroke-neutral-weak가 다크 바탕에서 보이는지 확인.
모바일: 열이 쌓이면 수평선으로 바꾸거나 없앤다. 폼 필드마다 반복하지 않는다.
A와 다른 점: 치수·조합 모두 A와 같다.
구현 수준: 토큰/CSS — 변경 없음, 소비자 배치.
Storybook: `Mockups/Flex/Surfaces/Separator` (Compare)

## 작업 패널 시나리오

같은 검토 작업(대상·상태 → 변경 내용 → 메모·담당자·마감일·링크 → 완료)을 데스크톱은 실제 Dialog, 모바일은 실제 하단 Sheet로 연다. 활동 로그는 Aside다.

| | 현재 | A | B |
| --- | --- | --- | --- |
| 데스크톱 | Title·Description·Close만, 폼·활동·버튼이 한 덩어리로 스크롤 | Toolbar / Body(40) / Footer \| Aside, Body만 스크롤 | A와 같은 부품 + Toolbar의 보기 전환(중앙·측면·전체), 값 유지 |
| 모바일 | 하단 Sheet 20rem 고정, 전체 스크롤 | 하단 Sheet r24·여백 20, 최대 90dvh, 활동은 본문 뒤, CTA 52 고정 | r16·여백 20, 넓히기 버튼으로 같은 Sheet를 전체 화면으로 |

검증한 것: 세 열 모두 같은 가상 화면 높이(40rem+32)로 맞춰 현재는 버튼이 스크롤 밖으로 밀리고 A·B는 Body만 스크롤되는 것(Body scrollHeight 638 > clientHeight 512), B에서 메모를 고친 뒤 중앙→측면→전체로 바꿔도 값이 남는 것, 다크에서 패널 1px 경계가 보이는 것. 데스크톱 비교 열(약 460px)에서는 패널을 0.55로 줄여 그린다.
미검증: 소프트 키보드, 실기기 safe area, 포커스 트랩 안에서 보기 전환 시 스크린리더 안내, 200% 확대.
Storybook: `Mockups/Flex/Scenarios/TaskPanel` (Compare)
