# @dg-design/react

Dogeol Design System(DDS)의 React 컴포넌트 패키지.

## 설치

```sh
pnpm add @dg-design/react @dg-design/tokens
```

peer dependency: `react` / `react-dom` `^18 || ^19`

컴포넌트 CSS는 side-effect import로 자동 로드되지만, 토큰 값(`--dds-*`)은 별도 패키지에 있다. 소비 앱이 진입점에서 `@dg-design/tokens/tokens.css`를 직접 로드해야 한다.

```ts
import "@dg-design/tokens/tokens.css";
```

## Button

```tsx
import { Button } from "@dg-design/react";

<Button intent="brand" variant="solid" size="medium">확인</Button>
<Button intent="neutral" variant="weak" size="small">취소</Button>
<Button variant="ghost" disabled>비활성</Button>
```

- `intent`: `"brand" | "neutral"` (기본 `"brand"`)
- `variant`: `"solid" | "weak" | "ghost"` (기본 `"solid"`)
- `size`: `"small" | "medium" | "large"` (기본 `"medium"`)
- `disabled`: native `disabled` 속성

## 스타일 오버라이드

`className` prop으로 오버라이드한다. 컴포넌트가 방출하는 CSS 클래스 이름(`.dds-button--variant_solid` 등)은 **공개 API가 아니며** 예고 없이 바뀔 수 있다 — 직접 참조하지 말 것.
