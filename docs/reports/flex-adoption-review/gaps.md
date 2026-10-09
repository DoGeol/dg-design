# A·B 공통 관점 보완

2026-10-09 · **구현 전 검토**. A안([적용안](design-application/README.md))과 B안([원문 우선 재검토](skill-free-comparison/README.md))을 비교하며 두 안 모두에서 빠졌거나 약했던 관점을 모았다. 각 항목은 "무엇이 비었나 → 이번에 채운 것 → 남은 결정" 순서다.

치수 정본: [profiles.ts](../../../apps/storybook/src/mockups/flex/profiles.ts) · B 치수: [B 치수 명세](skill-free-comparison/design-application/README.md) · 이미지: [보강 시안 브리프](../../design/2026-10-09-flex-ab-supplement/BRIEF.md)

## 1. 실제 DDS로 렌더한 대조군

**비었던 것.** 두 안 모두 문서와 생성 이미지뿐이었다. A plan.md의 "첫 시각 검증 묶음"과 B의 "같은 데이터로 두세 표현을 나란히 렌더"가 둘 다 착수 전이었다.

**채운 것.** Storybook `Mockups/Flex` 아래에 38개 공개 컴포넌트 + 새 종류 3개 + 시나리오 5개를 현재·A·B 세 열로 렌더했다. A·B 외관은 시안 전용 CSS가 실제 컴포넌트 위에 덧씌운다. 시나리오는 폼, 사람 선택, 객체 목록, 작업 패널, 비교 표다.

**남은 것.** 시안 CSS는 비공개 `.dds-*` 클래스를 덮는다. 구현할 때는 컴포넌트 CSS가 역할 토큰을 직접 읽게 바꿔야 한다. 덧씌우기는 비교용이다.

## 2. 다크 모드

**비었던 것.** B 보드 프롬프트의 "dark"는 글자색 뜻뿐이었고 QA가 다크를 범위 밖으로 뒀다. A 문서는 패널 경계 한 줄만 언급했다. 0.17.3의 핵심 수정(다크 부유 패널 1px 경계)을 보존하라면서 확인한 화면이 없었다.

**채운 것.** Storybook Theme 툴바로 모든 비교 화면을 다크로 볼 수 있다. 보강 이미지 14번 보드가 A·B 다크 화면이다.

**확인해야 할 계산값.** 아래는 DDS semantic 값끼리의 대비다.

| 조합 | 라이트 | 다크 | 판단 |
| --- | ---: | ---: | --- |
| 패널 경계 stroke-neutral-weak / 표면 | 1.23 | 1.74 | 장식 경계. 그림자와 함께 층을 구분한다. 0.17.3 결정 유지 |
| **box 입력 표면 bg-neutral-weak / 표면** | **1.09** | **1.25** | **입력 경계로는 부족(WCAG 1.4.11 비텍스트 3:1)** |
| line 입력 아래 경계 stroke-neutral / 표면 | 5.03 | 5.61 | 통과 |
| 보조 글자 fg-neutral-weak / bg-neutral-weak | 4.61 | 7.04 | box 안 보조 글자 통과 |

**B의 box 입력(그리고 A의 box 후보)은 면의 차이만으로 입력 영역을 알린다.** 라이트 1.09:1, 다크 1.25:1이다. 라벨이 항상 붙고 값이 들어 있으면 위치는 추론할 수 있지만, 빈 box나 단독 box는 경계를 찾기 어렵다. 구현 전에 둘 중 하나를 정해야 한다.

- box에도 stroke-neutral 1px 경계를 둔다(표면만 다르게).
- box는 "항상 라벨이 안에 있고 값이나 placeholder가 보이는 묶음 폼"으로만 허용하고, 그 조건을 문서와 예제로 고정한다.

## 3. 모바일

**비었던 것.** fxm이 연구의 절반인데 A는 숫자만, B는 보드 일부 인라인 표본만 있었다. 전용 모바일 화면이 없었다.

**채운 것.** profiles.ts에 모바일 값(390px 가정)을 두 안 모두 채웠다. Storybook Density 툴바가 모든 비교 화면을 390px 열로 바꾼다. 이미지 12번(폼·선택 시트)과 13번(시트 단계 전환·날짜 시트) 보드를 A·B로 만들었다.

**남은 것.** 소프트 키보드가 하단 CTA를 가리는지, safe area(`env(safe-area-inset-*)`), 실제 터치 hit area, 200% 글자 확대는 실기기에서만 확인할 수 있다. density를 화면 폭에서 자동으로 바꿀지, 앱이 명시적으로 고를지도 정해야 한다(A plan의 결정 3과 같은 질문).

## 4. 새 종류 3개

**비었던 것.** B는 List를 첫 설계 묶음으로 올렸지만 B 보드에서 List·Chip·PropertyField를 빼 B 자신의 우선순위를 그리지 않았다. A도 후보로만 적었다.

**채운 것.** Storybook 전용 프로토타입(`flex/proto/`)과 [새 종류 명세](skill-free-comparison/design-application/new-kinds.md), 이미지 11번 보드를 A·B로 만들었다.

**선행 조건.** 사람 행처럼 풍부한 옵션은 [후속 작업](../../follow-ups.md)의 "Select·MultiSelect 래퍼 옵션" 한계를 먼저 풀어야 한다. 옵션을 컴포넌트로 감싸면 첫 열기 전 트리거에 값 문자열이 보인다. label·textValue·행 표현을 나누는 계약과 같은 작업이다.

**승격 조건.** 구성 규칙대로 실제 소비처 두 곳(dg-studio 블로그 목록, 이력서 버전 목록)에서 같은 구조가 확인되면 공용화한다.

## 5. 브랜드 색

**비었던 것.** A plan의 결정 1(브랜드)이 열려 있는데 dg-studio 연구 시안과 B 보드가 모두 #155EEF를 써서 한쪽을 암묵적으로 골랐다.

**채운 것.** Storybook Brand 툴바에서 세 후보를 같은 화면으로 바꿔 본다. 이미지 보강 시안은 기존 B 보드와 비교 조건을 맞추려고 #155EEF로 고정했다. 결정이 아니다.

| 후보 | solid | 흰 글자 대비 | 출처 | 특성 |
| --- | --- | ---: | --- | --- |
| DDS 기본 teal | #196161 | 7.18 | tokens 기본값 | 현재 패키지 기본. 블루가 아니다 |
| createTheme 블루 | #1550A9 | 7.63 | `createTheme({ brand: "#2B7FFF" })` | DDS 생성기·대비 검사를 통과한 값. 중성색까지 블루 쪽으로 바뀐다 |
| dg-studio 블루 | #155EEF | 5.41 | dg-studio `studio-brand-theme.css` 수동 지정 | 소비 앱 실사용 값. brand 토큰만 덮고 중성색은 teal 계열이 남는다 |

**결정(2026-10-09): 패키지 정본은 createTheme #1550A9.** [flex 적용 방향](../../decisions/2026-10-09-flex-adoption-direction.md) 참고.

dg-studio 값은 brand 9개만 덮는다. 그래서 회색은 DDS 기본(청록 기운)이고 브랜드만 블루다. createTheme은 hue만 받아 중성색까지 다시 만든다. 같은 "블루"라도 화면 전체 인상이 다르다. Storybook에서 두 블루를 바꿔 보면 회색 차이가 보인다.

## 6. 아이콘과 도메인 표식

**충돌.** 2026-10-02 [시안 브리프](../../design/2026-10-02-component-mockups/BRIEF.md)는 이모지·문자 글리프를 아이콘으로 쓰지 말라고 한다. B는 DS018을 근거로 도메인 표식(코드 배지·이모지)을 슬롯에 허용한다.

**제안.** 조작 아이콘(닫기·더보기·펼침·검색)은 단일 stroke SVG만 쓴다. 값을 설명하는 표식(아바타·코드 배지·파일 형식)은 List·Option의 leading 슬롯에 데이터로 들어갈 수 있다. 장식 이모지는 어느 쪽에서도 쓰지 않는다. 이 구분을 결정 기록으로 남겨야 두 문서가 함께 맞는다.

## 7. 타이포그래피

**비었던 것.** 폰트 family·숫자 weight·tracking을 복원하지 못했다는 사실만 있고, 그럼 무엇을 쓸지가 없었다.

**현재 상태.** 두 안 모두 앱 폰트 상속 + regular 400/bold 700을 유지한다. B는 데스크톱 본문 행간을 19 → 20으로 옮겼다(측정). 모바일 본문 16/24는 현재 스케일에 없다(t5는 16/22). 모바일 역할 타입(Header 28/36, Title 24/32 등)을 쓰려면 행간 값을 additive로 더해야 한다.

**남은 결정.** 모바일 타입 역할을 DDS에 추가할지, 앱 조합으로 둘지.

## 8. 포털과 범위 전달

**비었던 것.** density·theme을 요소 단위로 바꾸면 body 바로 아래 포털(Dialog·Select·Menu·Toast)은 그 속성을 상속하지 못한다. A composition.md가 지적했지만 해결 방향이 없었다.

**이번에 피한 방법.** Storybook은 `:root`에 속성을 달고, 세 열을 별도 iframe으로 띄워 문제를 우회했다. 실제 앱에서는 이 우회를 쓸 수 없다.

**남은 결정.** 루트 단위만 지원한다고 문서화할지, 오버레이가 트리거 조상의 `data-dds-theme`·density를 읽어 포털 컨테이너에 복사하는 계약을 만들지. dialog-stack의 inert 규칙을 깨지 않는 쪽이어야 한다.

## 9. 구현 인프라 갱신 범위

A plan.md는 컴포넌트 변경 순서만 적었다. 실제로 함께 바뀌어야 하는 곳은 다음과 같다.

| 대상 | 할 일 |
| --- | --- |
| `packages/tokens/src/tokens.ts` | 역할 토큰(`--dds-space-field-gap` 등) 추가 → `pnpm generate`의 대비·gamut 검사 통과 |
| Tailwind 브릿지 생성기 | 역할 토큰 연결, `--transition-duration-*`·`--z-index-*` 이름 정정(4.3.3 실측), 지원 버전 명시 |
| 컴포넌트 CSS | primitive 대신 역할 토큰을 읽게 변경. 시안 덧씌우기 CSS는 버린다 |
| `docs/customization.md` | 공개 override 목록·기본값·범위, createTheme 반환값 `{ css, brandHue }` 예시 정정 |
| Storybook 상태 매트릭스 | 새 상태·조합 추가(시안 스토리와 별개) |
| 시각 회귀 | 기준 이미지와 색 텍스트 스냅샷은 CI에서만 갱신. 얇은 변화가 0.5% 임계에 묻히지 않게 해당 기준을 지우고 재촬영 |
| changeset | tokens·react 최소 호환 버전 짝을 문서화. 둘이 어긋나 CSS 변수가 빠지는 배포 금지 |
| dg-studio | 배포판으로 의존성 갱신, 임시 override(`studio-brand-theme.css` 포함) 정리 |

## 10. 출처 의존과 소비 앱 차이

- **출처 커밋이 미병합 브랜치에만 있다.** 측정 원자료는 dg-studio `fa3eaa3`이고 이 커밋은 `codex/flex-design-research` 브랜치에만 있다. 브랜치를 지우거나 rebase하면 이 저장소의 모든 근거 링크가 끊긴다. dg-studio에서 브랜치를 병합하거나 태그를 다는 것이 가장 싸다. 원본 이미지는 제3자 저작물이라 이 저장소로 옮기지 않는다.
- **소비 앱이 한 버전 뒤에 있다.** dg-studio는 react 0.17.2를 고정한다. 이 검토 기준은 0.17.3(다크 패널 경계 포함)이다. 전환 단계 전에 먼저 맞춘다.

## 11. 이미지 시안의 기준

- 기존 B 보드 10장은 DDS가 아닌 근사 hex로 그렸다. 보강 시안은 A·B 모두 DDS 0.8.0 semantic 값으로 다시 그렸다. 원래 B 보드는 기록으로 남겼다.
- 이미지는 방향 참고다. 반경·색·문구를 이미지 픽셀에서 다시 측정해 토큰으로 삼지 않는다. 숫자는 profiles.ts가 정본이다.

## 12. 모션

두 안 모두 새 모션 숫자를 만들지 않는다. 원본 영상은 Origami 프로토타입이고 전체 길이를 duration으로 쓸 수 없다. 기존 DDS duration(150/200ms)·easing을 유지한다. Sheet 단계 전환(간단 → 상세 → 전체)을 구현하면 높이 변화 모션과 reduced motion 처리를 그때 정한다.

## 13. 비교 화면을 만들며 드러난 현재 DDS 문제

Storybook 비교 화면은 현재 컴포넌트를 그대로 렌더한다. 그 과정에서 flex 적용과 무관하게 지금도 있는 문제가 보였다. 고치지 않았고, 재현 위치만 적는다.

| 대상 | 문제 | 재현 |
| --- | --- | --- |
| DataTable | 선택 행에 hover하면 고정 열 셀만 회색이 되어 행이 두 색으로 갈린다. 다크에서 두드러진다 | `Mockups/Flex/DataFeedback/DataTable` 현재 열 |
| DataTable | 일반 hover도 고정 열과 나머지 열의 hover 색이 다르다 | 같은 위치 |
| DataTable | `DataColumn`에 정렬·className 옵션이 없어 숫자 열 머리글을 끝 정렬할 수 없다 | 같은 위치 |
| DataTable | 선택 칸 체크박스가 `inline-flex`라 글자 기준선에 붙어 옆 칸 글자 중심보다 2–2.5px 위에 뜬다. 필터가 있는 머리글에서는 체크박스만 칸 가운데라 라벨과 18px 어긋난다 | `datatable--functional-demo`. 결정안 미리보기는 시안 CSS로 맞췄다(`overrides/data-feedback.css` 끝) |
| DataTable | 좁은 폭에서 오른쪽 고정 열이 끝 정렬 숫자를 덮는다 | `pin: "right"` + 390px |
| Toast | `ToastOptions`에 `action`이 없어 되돌리기 버튼은 `Toast.View`에서만 된다 | `Mockups/Flex/DataFeedback/Toast` |
| Alert | 260px 폭에서 행동 두 개가 닫기 버튼과 겹친다 | 좁은 열 |
| Collapsible·Accordion | 열린 내용이 폭이 좁아질 때 커지고, 다시 넓어져도 줄지 않는다(scrollHeight 재측정이 자기 상자만 본다) | `accordion--state-matrix`에서 800 → 280 → 800 |
| Card | `asChild`로 링크를 만들면 소비자가 `display:block`을 직접 줘야 한다 | 기존 Card 스토리의 우회 |
| Select·MultiSelect | 풍부한 옵션의 표시 이름·검색 텍스트·행 표현을 나눌 수 없다. 닫힌 트리거에 행 전체가 들어간다 | `Mockups/Flex/Forms/Select` |
| Select | 버튼·칩 모양 트리거에서 열린 패널 최소 폭이 트리거 폭을 따라가 칩 트리거는 약 90px 패널이 된다 | `Mockups/Flex/NewKinds/PropertyField` |
| MultiSelect | 검색 결과 없음 슬롯이 없다. 선택 수·전체 해제·도움말을 listbox 밖에 둘 슬롯이 없다 | `Mockups/Flex/Scenarios/PersonPicker` |
| Field | `Field.Label`의 `for`가 Popover 트리거 버튼에 닿지 않는다 | PropertyField 프로토타입은 `aria-labelledby`로 우회 |
| DropdownMenu | 체크·토글 항목(`menuitemcheckbox`·`menuitemradio`)이 없어 B의 설정 명령은 겉모양만 있다 | `Mockups/Flex/Navigation/DropdownMenu` |
| DataTable | 390px에서 머리글·셀이 잘린다. 모바일 표의 가로 스크롤 틀 계약이 없다. 객체 탐색이면 List로 바꾸는 것이 B의 기준이다 | `Mockups/Flex/DataFeedback/DataTable` 모바일 (Gemini 1라운드 #10) |
| Select | 모바일에서 속성 행이 연 패널이 좁은 부유 패널로 뜬다. DatePicker처럼 좁은 화면에서 Sheet로 바꾸는 presentation 계약이 Select에는 없다 | `Mockups/Flex/Scenarios/PersonPicker` 모바일 (Gemini 1라운드 #11) |

모바일 조작 영역도 확인됐다. 목록 행 메뉴 버튼 36px, Chip 제거 버튼 32px, 뒤로가기·경로 링크 36px로 44px 아래다. `touch-target` 역할(44, C)을 profiles.ts에 더했다.
