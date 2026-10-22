# dg-design

Dogeol Design System(DDS). [daangn/seed-design](https://github.com/daangn/seed-design)의 구조를 참고해 만든 개인 디자인 시스템이다.

[![CI](https://github.com/DoGeol/dg-design/actions/workflows/ci.yml/badge.svg)](https://github.com/DoGeol/dg-design/actions/workflows/ci.yml)
[![tokens](https://img.shields.io/npm/v/@dg-design/tokens?label=%40dg-design%2Ftokens)](https://www.npmjs.com/package/@dg-design/tokens)
[![react](https://img.shields.io/npm/v/@dg-design/react?label=%40dg-design%2Freact)](https://www.npmjs.com/package/@dg-design/react)

## 패키지

| 패키지 | 내용 |
|--------|------|
| [`@dg-design/tokens`](packages/tokens) | OKLCH로 파생한 팔레트를 CSS 변수, Tailwind v4 브릿지, 타입으로 낸다. 코드젠이 WCAG 대비를 검사한다. |
| [`@dg-design/react`](packages/react) | React 컴포넌트. plain CSS와 CVA로 만들어 Tailwind 없이 쓴다. |

컴포넌트별 사용법은 [packages/react/README.md](packages/react/README.md), 버전별 변경은 각 패키지의 `CHANGELOG.md`에 있다.

## 사용

```sh
pnpm add @dg-design/react @dg-design/tokens
```

```tsx
// 앱 진입점에서 한 번 불러온다. 컴포넌트는 토큰 CSS를 불러오지 않는다.
import "@dg-design/tokens/tokens.css";

import { Button } from "@dg-design/react/button";

<Button intent="brand" variant="solid" size="medium">확인</Button>
```

다크 모드는 `<html data-dds-theme="dark">`로 켠다. 하위 요소에 `data-dds-theme="light"`나 `"dark"`를 주면 그 영역만 바뀐다. 시스템 설정을 따를지는 앱이 정한다.

Tailwind v4에서는 tokens.css를 먼저 불러오고 `@import "@dg-design/tokens/tailwind.css";`를 더한다. 유틸 이름은 `bg-bg-brand-solid` 꼴이다.

코딩 에이전트용 사용 가이드 스킬이 `@dg-design/react`에 들어 있다. 연결 방법은 [AGENT-SETUP.md](packages/react/AGENT-SETUP.md).

## 개발

```sh
pnpm install
pnpm generate    # tokens.css·tailwind.css·타입 생성, 대비 검사(미달이면 실패)
pnpm build       # 전체 빌드
pnpm typecheck   # 3개 프로젝트 tsc --noEmit
pnpm --filter @dg-design/react test       # 컴포넌트 테스트(vitest)
pnpm vr          # Playwright 시각 회귀
pnpm --filter @dg-design/storybook dev    # Storybook(툴바에 다크 토글)
```

| 경로 | 내용 |
|------|------|
| `packages/tokens` | 토큰 단일 소스와 코드젠 |
| `packages/react` | 컴포넌트 |
| `apps/storybook` | 데모와 상태 매트릭스 |
| `apps/visual-regression` | 시각 회귀 테스트. 기준 이미지는 CI에서만 만든다 |

배포는 changesets로 한다. changeset이 main에 오르면 봇이 Version PR을 열고, 그 PR을 머지하면 GitHub Actions가 npm trusted publishing으로 배포한다.

## 문서

- 문서 목록: [docs/INDEX.md](docs/INDEX.md)
- 커스터마이즈(토큰 오버라이드, `@layer` 규칙, `createTheme`): [docs/customization.md](docs/customization.md)
- 아키텍처와 토큰 체계 결정: [docs/decisions/](docs/decisions/)
- 끝난 스펙 이력: [docs/specs/archive/](docs/specs/archive/)
