# 커스터마이즈 계약

DDS를 프로젝트에 맞게 바꿀 때 무엇을 덮어써도 안전하고, 무엇이 예고 없이 바뀔 수 있는 내부 구현인지 정의한다. "계약"은 전자만 가리킨다 — semver가 지키는 표면.

## 로드 순서

| 순서 | 파일 | 필수 여부 |
|---|---|---|
| 1 | `@dg-design/tokens/tokens.css` (또는 `createTheme` 생성 CSS) | 필수 — 나머지 계층이 이 변수를 참조한다 |
| 2 | `@dg-design/tokens/tailwind.css` | Tailwind 쓸 때만 |
| 3 | 컴포넌트 CSS | 자동 — `@dg-design/react/*`를 import하면 side-effect로 따라온다. 소비 앱이 직접 로드할 필요 없음 |

Tailwind를 같이 쓴다면 앱 진입점 CSS 맨 위에서 레이어 순서를 직접 고정해 둔다(이유는 아래 "@layer dds 규칙" 절 참고):

```css
/* index.css — 다른 규칙보다 먼저 */
@layer dds, theme, base, components, utilities;

@import "tailwindcss";
@import "@dg-design/tokens/tokens.css";
@import "@dg-design/tokens/tailwind.css";
```

Tailwind를 안 쓰면 `tokens.css`만 로드하면 된다.

### 버전 짝

`@dg-design/react`는 `@dg-design/tokens`가 내는 CSS 변수를 전제로 컴포넌트를 만든다 — 신규 컴포넌트·신규 상태가 신규 토큰을 필요로 하면 react의 minor가 tokens의 minor를 끌고 올라간다. 구버전 `tokens.css` 위에 신버전 react를 얹으면 신규 변수가 정의되지 않아 그 변수를 쓰는 규칙만 조용히 무효화된다(에러 없음, 그냥 안 먹는다).

실제 사례(react 0.10.0 ↔ tokens 0.6.0): `Field` 설명문·그룹 라벨이 쓰는 `--dds-color-fg-neutral-weak`, 오버레이 `z-index`용 `--dds-z-overlay`·`--dds-z-toast`가 이 릴리스에서 같이 신설됐다. tokens를 0.5.x에 고정한 채 react만 0.10.0으로 올리면 오버레이가 다시 `z-index: auto`로 돌아가 소비 앱의 sticky 헤더 밑에 깔린다 — 정확히 0.6.0이 고친 버그가 재발한다. 두 패키지는 같이 올린다.

## 공개 표면

| 표면 | 무엇을 보장하나 |
|---|---|
| semantic 색 토큰 (`--dds-color-*`) | 이름이 안정적이다. `tokens.css` 로드 뒤 재정의하면 반영된다 |
| `className` | 각 컴포넌트가 `clsx`로 자기 클래스 뒤에 이어붙인다(대체가 아니라 추가) |
| `@layer dds` | 레이어 밖(어떤 `@layer`에도 안 든) 소비자 CSS는 항상 이긴다 — 아래 참고 |
| 서브패스 import (`@dg-design/react/<kebab-case>`) | 배럴(`@dg-design/react`)과 별개로 안정 — 트리셰이킹용 |
| `createTheme` | `packages/tokens`의 함수. 브랜드 hex 하나로 전체 CSS를 새로 만든다 |

### className

컴포넌트 21종 중 20종이 `className` prop을 받아 `clsx(내부 클래스, className)`으로 병합한다(예: `packages/react/src/button/Button.tsx`). 소비자 클래스가 뒤에 오지만, 승패는 이 순서가 아니라 아래 "@layer" 규칙이 정한다. 예외는 `Toast`뿐이다 — `useToast()` 훅으로 띄우는 알림이라 소비자가 직접 렌더하는 JSX 엘리먼트가 없고, 그래서 `className`을 받을 자리 자체가 없다.

### @layer dds 규칙

컴포넌트 CSS는 전부 `@layer dds { ... }` 안에 있다(`packages/react/src/*/*.css`). CSS Cascade Layers 규격상 **어떤 `@layer`에도 안 든 규칙은 특정도·선언 순서와 무관하게 레이어 안 규칙을 항상 이긴다.** 그래서 소비자가 자기 CSS를 평범하게(레이어 없이) 쓰면 `.dds-*`를 특정도 계산이나 `!important` 없이 덮어쓸 수 있다 — DDS에서 가장 저평가된 커스터마이즈 표면이다.

단, **Tailwind 유틸리티는 이 "레이어 밖"에 속하지 않는다.** Tailwind v4는 `@import "tailwindcss"`가 스스로 `@layer theme, base, components, utilities;`를 선언하고 생성한 유틸리티 클래스를 `@layer utilities` 안에 채운다(`npx @tailwindcss/cli`로 직접 컴파일해 확인한 사실이고, `rounded-full` 같은 유틸리티도 예외 없이 그 안에 있다). 즉 `className="rounded-full"`은 `utilities` 레이어와 `dds` 레이어의 대결이고, 이름 있는 두 레이어 사이의 승패는 **어느 이름이 문서 전체에서 더 나중에 처음 언급되는지**로 정해진다 — 실제 규칙 내용이 어디 있는지가 아니라 이름이 처음 등장한 순서다.

앱 진입점 CSS(Tailwind import 포함)는 보통 컴포넌트 CSS(자바스크립트 side-effect import로 트리 깊숙이서 나중에 실려오는)보다 먼저 로드된다. 아무 조치 없이 두면 `dds`라는 이름이 `utilities`보다 나중에 처음 언급되고, 그러면 **`dds`가 이겨서 Tailwind 유틸리티가 아무 시각적 효과 없이 조용히 무시된다** — 클래스는 붙는데 아무 일도 안 일어나는, 기대와 정반대인 결과다.

고쳐 쓰기는 한 줄이다. 레이어 이름의 순서를 앱 진입점 맨 위에서 내용 없이 미리 선언해 둔다(위 "로드 순서"의 예시에 이미 들어 있다):

```css
@layer dds, theme, base, components, utilities;
```

빈 선언이라도 그 순서를 그 자리에서 고정한다 — 이후 각 레이어의 실제 규칙이 언제 어디서(컴포넌트 CSS든 Tailwind든) 채워지든 순서는 바뀌지 않는다. 이 한 줄이 없으면 결과가 번들러의 import 순서에 좌우된다.

### createTheme

```ts
import { createTheme } from "@dg-design/tokens";

const css: string = createTheme({ brand: "#6D28D9" });
```

hex에서 OKLCH hue만 뽑아 쓴다 — lightness·chroma는 스텝마다 DDS 규칙(gamut 상한 × 스텝별 채도 비율)으로 다시 계산되므로 **입력한 색이 그대로 램프에 박히지 않는다.** 그 대신 어떤 hue를 넣어도 기본 팔레트와 같은 대비·gamut 보증을 받는다. 검사를 통과하지 못하면 파일을 쓰지 않고 실패한 쌍·실측 대비·조정 방향을 담아 에러를 던진다(자동 보정 없음 — "통과했다면 정말 통과한 것"이 이 함수의 보증이다).

CLI는 이 함수의 얇은 래퍼다:

```sh
npx @dg-design/tokens --brand "#6D28D9" -o dds-tokens.css
```

실패 시 exit 1 + 진단 stderr. 함수·CLI 모두 의존성 0.

> 유채색이면 어떤 hue든 통과한다(360개 전수 스윕이 빌드마다 이를 고정한다). 무채색 hex는 hue를 추출할 수 없어 거부된다. 배경 결정은 [스펙](specs/archive/2026-08-19-theme-generator.md)과 [구현 결정 기록](decisions/2026-08-19-theme-generator-implementation.md) 참조.

## 비공개 표면

호환 보장이 없다 — 버전 사이에 예고 없이 바뀔 수 있다.

| 표면 | 예 |
|---|---|
| `.dds-*` 클래스명 | `.dds-button--variant_solid` |
| 컴포넌트 로컬 CSS 변수 | `--dds-button-solid-bg` |
| palette 스텝 | `--dds-color-palette-brand-700` |

semantic 토큰끼리도 서로 `var()`로 참조하지 않는다는 점을 함께 기억해 둔다 — `tokens.css`는 각 semantic 변수를 생성 시점에 palette를 조회해 나온 값 그대로(리터럴 hex/rgb) 박아 넣는다. 예를 들어 `bg-brand-solid`와 `stroke-focus-ring`은 지금은 같은 palette 스텝(`brand-700`/`brand-400`)에서 나와 값이 같지만, CSS 상으로는 완전히 독립된 두 변수다 — `--dds-color-bg-brand-solid`만 오버라이드해도 `--dds-color-stroke-focus-ring`은 안 바뀐다. 여러 semantic 토큰을 한 palette 스텝에 맞춰 같이 바꾸고 싶다면 그 토큰들을 각각 나열해야 한다(아래 예시 ①).

## 브랜드 hue 지원 범위

`createTheme`은 brand·gray hue만 바꾼다(intent 4종·radius·spacing·타이포·모션은 고정). 그리고 **고채도 노랑 계열(대략 hue 60~100°, `#FFD400`급)은 지원 대상이 아니다** — DDS의 warning intent가 이미 겪은 문제와 같다: 어두운 스텝의 OKLCH lightness를 낮추면 노랑은 다른 hue보다 훨씬 빨리 갈색·올리브로 보인다. 예를 들어 `#FFD400`을 brand로 넣으면 `brand-700`이 `#645416`(짙은 올리브)로 나온다 — 노란 브랜드가 아니라 갈색 브랜드다.

DDS 자신도 이 문제를 warning에서만 반전 규칙(밝은 스텝을 solid로 쓰고 글자를 어둡게)으로 풀었다. `createTheme`은 brand에 이 반전을 적용하지 않는다 — hue마다 다른 매핑 규칙을 얹으면 테마 축이 하나 늘어나기 때문이다(스펙이 명시적으로 범위 밖으로 둔 결정). 대비·gamut 검사는 수치만 보고 "노랑처럼 보이는가"는 판단하지 않으므로, 이 갈색화는 검사 통과 여부와 무관하게 일어날 수 있다 — 노랑 계열 hue를 넣은 결과가 갈색·올리브에 가깝다면 검사를 통과했더라도 의도한 지원 범위 밖으로 받아들이고 hue를 조정하라.

## 예시 3종

### ① 토큰 몇 개만 오버라이드

```css
/* my-theme.css — tokens.css보다 나중에 로드 */
:root {
  --dds-color-bg-brand-solid: #7c3aed;
  --dds-color-bg-brand-solid-hover: #6d28d9;
  --dds-color-bg-brand-solid-pressed: #5b21b6;
  --dds-color-fg-brand: #6d28d9;
}

[data-dds-theme="dark"] {
  --dds-color-bg-brand-solid: #a78bfa;
  --dds-color-bg-brand-solid-hover: #c4b5fd;
  --dds-color-bg-brand-solid-pressed: #ddd6fe;
  --dds-color-fg-brand: #c4b5fd;
}
```

```ts
// 앱 진입점
import "@dg-design/tokens/tokens.css";
import "./my-theme.css"; // tokens.css 다음
```

`var(--dds-color-bg-brand-solid)`를 참조하는 컴포넌트(Button의 `intent="brand" variant="solid"` 등)가 즉시 새 색을 쓴다. 주의 둘: 이 값은 손으로 넣은 것이라 `pnpm generate`의 대비 검사를 거치지 않는다 — WCAG 확인은 소비자 책임이다. 그리고 위 "비공개 표면"에서 설명했듯 semantic 토큰은 서로 연결돼 있지 않으므로, 포커스 링(`stroke-focus-ring`)처럼 같은 계열로 보이는 다른 토큰까지 바꾸려면 그것도 목록에 따로 추가해야 한다.

### ② Tailwind 유틸로 개별 인스턴스 커스텀

위 "로드 순서"에서 이미 `@layer dds, theme, base, components, utilities;`를 진입점에 넣었다면:

```tsx
import { Button } from "@dg-design/react/button";

<Button className="rounded-full">전체 반경</Button>
```

렌더된 클래스는 `dds-button dds-button--intent_brand dds-button--variant_solid dds-button--size_medium rounded-full`(clsx 병합, 대체 아님 — 실제 `cva` 설정으로 재현해 확인한 순서다). `border-radius`는 `.dds-button--size_medium`과 `.rounded-full`이 둘 다 정의하지만, 레이어 순서를 고정해 뒀으므로 `rounded-full`이 이긴다. 그 한 줄이 없으면 대부분의 번들러 구성에서 반대로 `.dds-button--size_medium`이 이겨, 클래스는 붙어도 시각적으로 아무 일도 안 일어난다(실제 Vite 프로덕션 빌드로 두 경우 다 재현해 컴퓨티드 스타일까지 확인했다).

### ③ createTheme으로 전체 브랜드 교체

```js
// scripts/build-theme.mjs — 빌드 전 1회 실행
import { writeFileSync } from "node:fs";
import { createTheme } from "@dg-design/tokens";

writeFileSync("src/styles/dds-tokens.css", createTheme({ brand: "#6D28D9" }));
```

```diff
  // 앱 진입점
- import "@dg-design/tokens/tokens.css";
+ import "./styles/dds-tokens.css";
  import "@dg-design/tokens/tailwind.css"; // 그대로 — 브릿지는 var() 참조뿐이라 브랜드 무관
```

생성 CSS는 기존 `tokens.css`와 같은 `:root` + `[data-dds-theme="dark"]` 구조라 드롭인 교체다 — 둘 중 하나만 로드한다.
