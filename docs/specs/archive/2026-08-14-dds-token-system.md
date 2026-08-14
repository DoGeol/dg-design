# DDS 토큰 체계와 Button 0.1.0

## 메타
- 생성: 2026-08-14
- 라운드: 11
- 최종 모호도: 18% (임계값 20%)
- 유형: 그린필드
- 상태: 통과
- 근거: [docs/decisions/2026-08-14-dds-token-system.md](../../decisions/2026-08-14-dds-token-system.md)
- 상위 스펙: [docs/specs/archive/2026-08-14-dds-architecture.md](2026-08-14-dds-architecture.md)
- 승인: **승인됨** (2026-08-14)
- 구현: **완료** — 0.1.0 릴리스 (2026-08-14). 합격 조건 16/16. 구현 중 결정: [dds-010-implementation](../../decisions/2026-08-15-dds-010-implementation.md)

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.40 | 0.34 |
| 제약 | 0.80 | 0.30 | 0.24 |
| 성공 기준 | 0.80 | 0.30 | 0.24 |
| **모호도** | | | **18%** |

## 구성요소

| 구성요소 | 상태 | 설명 | 커버리지 / 보류 사유 |
|----------|------|------|---------------------|
| 컬러 팔레트 값 | 진행 | OKLCH 파생 램프, semantic 매핑 | brand hue 195, 10단계 확정. 각 스텝 lightness 배열은 구현 시 확정 |
| 대비 검사 구현 | 진행 | `generate.ts` 내장 WCAG 검사 | 명시 배열 선언, 임계값·면제 확정 |
| 비색상 토큰 축 | 진행 | dimension / radius / typography | 스케일 구조와 범위 확정 |
| Button 컴포넌트 API | 진행 | intent × variant × size, disabled | prop 구조·목록·disabled 방식 확정 |
| Storybook 구성 | 진행 | 개발 중 시각 확인 | 최신 안정 버전 + react-vite, 애드온 없음 |
| 공개 API 표면·배포·CI | 진행 | semver 대상 정의, publish 절차 | 공개 범위·CI 범위 확정 |
| 컴포넌트 테스트 프레임워크 | **보류** | vitest + testing-library | Button은 CVA 클래스 조합이라 로직이 거의 없다. 로직 있는 컴포넌트(Select, Dialog) 등장 시 도입 |
| 시각 회귀 테스트 | **보류** | 스냅샷 비교 | baseline은 "눈으로 다 못 볼 때" 필요하다. 컴포넌트 5개 이상 또는 토큰 값을 바꾸기 시작할 때 도입하고, 그 시점에 baseline을 새로 잡는다 |

## 목표

`@dg-design/tokens`가 OKLCH 파생 팔레트에서 CSS 변수·Tailwind 브릿지·타입을 생성하고 그 과정에서 WCAG 대비를 자동 검증하며, `@dg-design/react`의 Button 하나가 그 토큰만으로 intent × variant × size 전 조합을 라이트/다크 양쪽에서 렌더하고, 이 둘이 npm 0.1.0으로 배포돼 외부 프로젝트에서 import만으로 동작한다.

## 제약

### 토큰 문법 (공개 API)

```
--dds-color-bg-{intent}-{emphasis}[-{state}]
   intent   : brand | neutral | critical | positive | warning | informative
   emphasis : solid | weak
   state    : hover | pressed
   특수     : bg-disabled, bg-layer-default, bg-transparent-hover, bg-transparent-pressed

--dds-color-fg-{intent}[-contrast]        emphasis 축 없음, state 없음
   특수     : fg-disabled, fg-placeholder, fg-neutral-muted, fg-neutral-subtle

--dds-color-stroke-{intent}-{emphasis}    state 없음
   특수     : stroke-focus-ring, stroke-neutral-muted, stroke-neutral-subtle
```

role마다 축이 다르다. 격자가 아니므로 존재하지 않는 조합 이름(`fg-brand-solid` 등)을 만들지 않는다. 값이 없는 예약 이름은 CSS에 방출하지 않는다.

### 팔레트

- primitive: `--dds-color-palette-brand-{100..1000}`, `--dds-color-palette-gray-{00,100..1000}`
- brand hue = OKLCH 195 (청록). gray = 같은 파생 함수에 hue 195 / chroma 0.005 (완전 무채색이 아닌 차가운 중성)
- **palette는 모드 무관 단일 램프.** 모드 분기는 semantic 레이어에만 존재한다
- 청록은 밝은 쪽에서 흰 글씨 대비가 빡빡하다. solid 스텝은 700 근처에서 시작해 대비 검사를 통과시킨다

### 모드

- `:root { --dds-* }` + `[data-dds-theme="dark"] { --dds-* }` 재정의
- semantic 토큰이 모드별로 다른 palette 스텝을 가리킬 수 있다 (예: light는 brand-700, dark는 brand-600)
- 시스템 감지는 소비 앱 책임. DDS는 `data-dds-theme` 속성만 읽는다

### 대비 검사

`tokens.ts`에 검사 쌍을 명시 배열로 선언한다. 규칙 기반 생성을 쓰지 않는다.

intent 2개 × variant 3개 = 6조합이 실제로 만드는 쌍은 16개다.

```ts
export const contrastChecks = [
  // brand solid
  { fg: "fg-brand-contrast",   bg: "bg-brand-solid",           min: 4.5 },
  { fg: "fg-brand-contrast",   bg: "bg-brand-solid-hover",     min: 4.5 },
  { fg: "fg-brand-contrast",   bg: "bg-brand-solid-pressed",   min: 4.5 },
  // brand weak
  { fg: "fg-brand",            bg: "bg-brand-weak",            min: 4.5 },
  { fg: "fg-brand",            bg: "bg-brand-weak-hover",      min: 4.5 },
  { fg: "fg-brand",            bg: "bg-brand-weak-pressed",    min: 4.5 },
  // neutral solid
  { fg: "fg-neutral-contrast", bg: "bg-neutral-solid",         min: 4.5 },
  { fg: "fg-neutral-contrast", bg: "bg-neutral-solid-hover",   min: 4.5 },
  { fg: "fg-neutral-contrast", bg: "bg-neutral-solid-pressed", min: 4.5 },
  // neutral weak
  { fg: "fg-neutral",          bg: "bg-neutral-weak",          min: 4.5 },
  { fg: "fg-neutral",          bg: "bg-neutral-weak-hover",    min: 4.5 },
  { fg: "fg-neutral",          bg: "bg-neutral-weak-pressed",  min: 4.5 },
  // ghost — 페이지 배경 위
  { fg: "fg-brand",            bg: "bg-layer-default",         min: 4.5 },
  { fg: "fg-neutral",          bg: "bg-layer-default",         min: 4.5 },
  // 포커스 링 (비텍스트)
  { fg: "stroke-focus-ring",   bg: "bg-layer-default",         min: 3.0 },  // WCAG 1.4.11
  // 면제
  { fg: "fg-disabled",         bg: "bg-disabled",              exempt: "WCAG 1.4.3 비활성 컨트롤" },
]
```

- 라이트/다크 각각 계산한다
- 텍스트는 4.5:1 단일 기준. Button은 size별 폰트가 달라 "큰 텍스트 3:1" 분기가 실익이 없다
- 미달 시 **생성 실패**(경고 아님). 의존성 없이 sRGB 상대휘도 공식을 직접 구현한다
- **알파를 가진 토큰**(`bg-transparent-hover` 등)은 그 자체로 대비를 잴 수 없다. `bg-layer-default` 위에 알파 합성한 결과 색으로 검사한다

### 비색상 토큰

- `--dds-dimension-x0_5` ~ `x16` (2px ~ 64px, 4px 배수)
- `--dds-radius-r0_5` ~ `r6`, `--dds-radius-r-full`
- `--dds-font-size-t{n}` + `--dds-line-height-t{n}` — 별도 스케일이되 `t` 인덱스를 공유한다
- `--dds-font-weight-regular`, `--dds-font-weight-bold`
- **semantic 치수 레이어를 두지 않는다.** 컴포넌트가 primitive를 직접 참조하고, 스케일에 안 맞는 값은 raw px로 적는다

### Button API

```
intent  : "brand" | "neutral"                    (기본 "brand")
variant : "solid" | "weak" | "ghost"             (기본 "solid")
size    : "small" | "medium" | "large"           (기본 "medium")
disabled: boolean → native disabled 속성
```

- size별 치수: small `x9`(36px)/`r2`, medium `x10`(40px)/`r2`, large `x13`(52px)/`r3`
- size 블록은 height·radius·타이포만 잡는다. 가로 패딩은 별도 규칙
- CSS는 intent가 지역 변수를 세팅하고 variant가 소비한다. intent 추가 = 규칙 블록 하나

```css
.dds-button--intent_brand  { --dds-button-solid-bg: var(--dds-color-bg-brand-solid); … }
.dds-button--variant_solid { background: var(--dds-button-solid-bg); }
```

### CSS 관습

- 포커스 링은 `:focus-visible`
- 비활성은 `:is(:disabled, [disabled], [data-disabled])` 3중 매칭 — React 구현을 나중에 바꿔도 CSS를 안 고친다
- hover/pressed 규칙은 비활성 가드로 감싼다: `:not(:is(:disabled, [disabled], [data-disabled])):is(:hover, [data-hover])`
- **컴포넌트 CSS 전체를 `@layer dds`에 넣는다.** 레이어 밖 소비자 CSS가 항상 이기므로 오버라이드가 소스 순서에 의존하지 않는다
- **`tokens.css`는 소비 앱이 진입점에서 수동 로드한다** (seed base.css 관습). react 컴포넌트는 토큰 CSS를 import하지 않는다 — 자동 import하면 브릿지 사용 시 이중 방출되고 로드 순서 제어권이 앱에서 사라진다

### 공개 API 범위 (semver 대상)

| 공개 | 비공개 |
|------|--------|
| 패키지 exports 경로 (`@dg-design/react`, `@dg-design/tokens/tokens.css`, `/tailwind.css`) | `--dds-color-palette-*` (내부 구현) |
| 컴포넌트와 props 타입 | CSS 클래스 이름 (`.dds-button--variant_solid` 등) |
| `data-dds-theme` 속성 이름 | 컴포넌트 지역 변수 (`--dds-button-*`) |
| semantic 색 토큰, dimension/radius/typography 스케일 | |

오버라이드 경로는 `className` prop이다. 클래스 이름을 문서화하지 않으므로 CSS 내부 구조는 언제든 바꿀 수 있다.

### 배포

- pnpm workspace, ESM only, Vite lib mode + `preserveModules`, `sideEffects: ["*.css"]`
- GitHub Actions CI: 빌드 + `generate` + `publint`. 공개 저장소라 표준 러너 무료
- changesets로 버전 관리
- publish는 로컬에서 하되 **클린 체크아웃 빌드 → `publint` → 소비 검증 앱 통과**를 사람이 순서대로 확인한 뒤 실행
- Storybook은 최신 안정 버전 + `@storybook/react-vite`, 애드온 없음. 다크 토글은 `<html>`에 `data-dds-theme`를 세팅하는 자체 데코레이터 하나
- 소비 검증 앱은 Storybook과 별도로 둔다 (Storybook = workspace 소스 HMR, 검증 앱 = npm 패키지 설치 결과물)

## 하지 않을 것

- **컴포넌트 테스트 프레임워크** — 대비 검사와 Storybook이 현재 역할을 대체. 로직 있는 컴포넌트가 등장하면 도입
- **시각 회귀 테스트** — 컴포넌트 5개 이상 또는 토큰 값 변경을 시작할 때
- **palette 공개** — 여는 건 언제든 non-breaking, 회수는 breaking. 작게 시작한다
- **CSS 클래스 이름 공개** — 공개하면 CSS 내부 구조가 고정되어 리팩터가 breaking이 된다
- **규칙 기반 대비 쌍 생성** — 쌍이 7개고 예외가 이미 둘이라 규칙이 곧 예외 처리를 달게 된다
- **semantic 치수 레이어** — 모드 분기가 없어 레이어가 벌어주는 게 없다
- **합성 variant prop** (`variant="brandSolid"`) — 색 토큰 축이 intent × emphasis인데 API만 합성이면 매핑이 어긋난다
- **`aria-disabled` 방식** — 3중 셀렉터가 문을 열어두므로 필요해지면 CSS 변경 없이 전환
- **Button의 loading 상태와 아이콘 slot** — 0.1.0 범위 밖. `[data-loading]` 관습은 예약해둔다
- **critical / positive / warning / informative intent** — 토큰 문법에는 예약, 값과 Button 지원은 이후 버전

## 합격 조건

- [x] `pnpm generate`가 `tokens.css` / `tailwind.css` / 타입 3종을 만들고, palette 21개(brand 10 + gray 11)와 semantic 22개(brand 8 + neutral 8 + 공통 6)가 방출된다
- [x] `tokens.css`에 `:root`와 `[data-dds-theme="dark"]` 두 블록이 있고, semantic 토큰이 양쪽에 값을 갖는다
- [x] `--dds-color-palette-*`는 CSS에 방출되지만 문서에 "내부 구현"으로 명시되고 타입 export에서 빠진다
- [x] 대비 검사가 16쌍을 라이트/다크 각각 검사하고, 통과하면 생성 성공한다
- [x] `bg-brand-solid`의 값을 일부러 밝게 바꾸면 `pnpm generate`가 **실패하고**, 실패 메시지에 쌍 이름과 실제 대비값이 나온다
- [x] Button이 intent(2) × variant(3) × size(3) = 18조합으로 Storybook에 렌더되고, 다크 토글 시 색이 전환된다
- [x] Button의 hover와 pressed가 서로 다른 색이다 (데스크톱에서 육안 확인)
- [x] `disabled` Button에 마우스를 올려도 hover 색이 적용되지 않는다
- [x] 키보드 Tab으로 Button에 도달하면 포커스 링이 보이고, 마우스 클릭으로는 보이지 않는다
- [x] 컴포넌트 CSS 전체가 `@layer dds` 안에 있고, 레이어 밖 소비자 클래스가 같은 specificity로 이긴다
- [x] `pnpm build`가 컴포넌트별 JS+CSS를 만들고 `publint`를 통과한다
- [x] GitHub Actions가 push마다 generate + build + publint를 통과시킨다
- [x] 빈 Vite 프로젝트에서 `pnpm add @dg-design/react @dg-design/tokens` 후 진입점에서 `tokens.css` import + Button import로 스타일이 적용된다 (컴포넌트 CSS는 side-effect 자동, 토큰 CSS는 소비 앱 수동 로드)
- [x] Tailwind v4 프로젝트에서 `tokens.css` 선로드 + 브릿지 import로 `bg-*` 토큰 유틸이 동작한다
- [x] npm 0.1.0 publish 완료

## 드러난 가정과 결론

결정 기록에서 이미 판정된 것은 옮기지 않는다. 인터뷰 중 새로 나온 것만 적는다.

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| "palette는 모드 무관, semantic이 모드 분기" (초기 가정) | seed 실물 조사: palette 자체가 모드별 값을 갖고 semantic도 모드별 스텝을 가리킨다 — 다이얼이 2개 | 다이얼 1개로 축소. 이름과 밝기가 일치하고 추적이 1단계 |
| "치수도 primitive→semantic 2단계" | seed는 색만 2단계고 치수는 컴포넌트가 primitive 직접 참조 | 색 semantic이 하는 일은 light/dark를 한 이름으로 묶는 것인데 치수엔 모드가 없다. 1단계 채택 |
| "variant는 seed처럼 합성 이름" | 색 토큰 축이 intent × emphasis인데 API만 합성이면 매핑이 어긋남 | 2-prop으로 분리. intent가 지역 변수를 세팅하는 CSS 구조로 추가 비용 제거 |
| "Storybook은 당연히 필요" (반론 챌린지) | 컴포넌트 1개에 무거운 도구, 소비 검증 앱과 중복 가능성 | 유지 — 검증 대상이 다르다(빌드 전 소스 HMR vs 설치된 패키지). 대신 두 앱의 역할을 명시 분리 |
| "대비 검사는 seed를 따라가는 것" | seed 저장소 전수 조사: 휘도 계산·WCAG 코드가 **하나도 없다**. CLI 검증은 `publint`뿐 | DDS 고유 결정으로 재분류. seed는 디자인 팀+Figma가 그 역할을 하는데 DDS는 색을 OKLCH로 파생시켜 사람이 각 값을 볼 기회가 없다 — 파생을 택한 이상 검사는 짝이다 |
| "공개 범위는 선택 사항" | Tailwind 브릿지가 semantic 토큰을 재바인딩하므로 "컴포넌트만 공개"는 성립 불가 | 강제 공개분(경로·props·`data-dds-theme`·semantic)을 먼저 확정하고, 선택 가능한 palette·클래스만 결정 |
| "`data-dds-theme`는 내부 구현" (암묵) | 다크 감지가 소비 앱 책임이므로 앱이 이 속성을 직접 세팅한다 | 공개 API로 승격. 이름 변경은 breaking |
| "CSS 클래스를 비공개로 하면 끝" | `className`과 variant 클래스가 같은 specificity(0,1,0)라 소스 순서로 승부가 갈림 | `@layer dds`로 감싸 specificity 싸움 자체를 제거. 아키텍처 스펙이 뺀 것은 레이어드/논레이어드 **두 벌 배포**이지 레이어 사용이 아니다 |
| "CI는 YAGNI" (결정 기록) | 공개 저장소라 GitHub Actions 표준 러너가 무료 — 도입 비용이 사실상 0 | 진행으로 승격. 다만 publish 자동화는 안 하고 사람이 클린 빌드 절차를 수행 |
| "hue는 순수 취향" | 대비 검사를 강제하므로 hue가 solid 스텝 선택 폭을 좌우 | 청록(195) 선택 — solid를 700 근처로 잡아야 흰 글씨가 통과. 검사가 이를 강제한다 |
| "Button import만으로 스타일 완결" (합격 조건 초안) | 착수 전 검증: Button CSS는 side-effect 자동 로드지만 `--dds-*` 값은 tokens.css에 있다 — 로드 주체 미정이면 합격 조건이 성립 불가 | 소비자 수동 로드(seed 방식) 확정. 합격 조건 문구 수정 |

## 기술 맥락

### seed-design 조사 (근거)

| 항목 | seed 실물 | 파일 |
|------|-----------|------|
| palette 정의 | 손으로 고른 hex, primitive가 모드별 값 보유, 비대칭 역전(dark-600 = light-700 값) | `packages/rootage/color.yaml` |
| semantic 정의 | 모드별로 다른 palette 스텝 참조 가능 (`bg-brand-solid`: light carrot-600 / dark carrot-700) | 같은 파일 |
| 색 축 | bg는 intent×emphasis+pressed, fg는 intent+contrast, stroke는 intent×emphasis — role마다 다름 | `packages/css/vars/color/` |
| hover | `:hover` 셀렉터 158회 존재하나 참조 토큰은 전부 `-pressed`. 별도 hover 토큰 없음 | `packages/css/recipes/` |
| 치수 | 순수 수치 스케일 `$dimension.x1 = 4px`, semantic 레이어 없음 | `packages/rootage/dimension.yaml` |
| Button | variant 7개(합성 이름), size 4개. `height: var(--seed-dimension-x10)` 직접 참조, `--seed-icon-size: 18px` raw px 혼용 | `packages/css/recipes/action-button.css` |
| 타이포 | `font-size-t{n}` + `line-height-t{n}` 인덱스 공유 | 같은 파일 |
| disabled | `:is(:disabled, [disabled], [data-disabled])` 370회, hover 가드로도 사용 | 같은 디렉터리 |
| focus | `:focus-visible` 196회 vs `:focus` 40회 | 같은 디렉터리 |
| 대비 검증 | **없음.** 휘도 계산·WCAG 코드 0건, CLI 검증은 `publint`뿐 | 저장소 전체 |

### 참고할 설정 파일

- `packages/react/vite.config.mts` — lib mode + `preserveModules` + CSS external + `'use client'` 배너
- `packages/css/package.json` — exports 맵 구성
- `packages/tailwind4-theme/index.css` — `@theme` 재바인딩 패턴

## 남은 위험

- **청록 hue의 대비 여유**: 195는 밝은 쪽에서 흰 글씨 대비가 빡빡하다. solid 스텝을 700보다 더 어둡게 잡아야 할 수 있고, 그러면 hover/pressed가 800/900으로 밀려 램프 아래쪽이 좁아진다. 실제 값 생성 후 확인 — 막히면 chroma를 낮추거나 `fg-brand-contrast`를 흰색이 아닌 아주 밝은 청록으로 돌린다
- **OKLCH 균등 lightness의 지각 오차**: 파생 램프가 중간 스텝에서 지각적으로 고르지 않을 수 있다. 완화책은 lightness 배열을 손으로 조정하는 것 — 파생 구조는 유지한 채 배열만 튜닝하면 되므로 되돌리기 싸다
- **Vite lib mode의 컴포넌트별 CSS 방출 + side-effect 유지**: 아키텍처 스펙에서 이월된 위험. seed 설정 참고로 완화하되 실작업에서 검증 필요
- **`@dg-design` npm scope 확보**: 아키텍처 스펙에서 이월. 배포 단계에서 npm 로그인 후 org 생성으로 확정
- **`@layer` 브라우저 지원**: 2022년 이후 브라우저는 전부 지원하나, 레이어 미지원 환경에서는 모든 규칙이 레이어 없이 평가되어 오버라이드가 소스 순서 의존으로 되돌아간다. 실질 위험은 낮음

## 인터뷰 기록

전체 Q&A는 [2026-08-14-dds-token-system-interview.md](2026-08-14-dds-token-system-interview.md)로 분리.
