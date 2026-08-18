# dg-design

Dogeol Design System (DDS). [daangn/seed-design](https://github.com/daangn/seed-design) 구조를 참고한 개인 디자인시스템.

[![CI](https://github.com/DoGeol/dg-design/actions/workflows/ci.yml/badge.svg)](https://github.com/DoGeol/dg-design/actions/workflows/ci.yml)

## 패키지

| 패키지 | 버전 | 설명 |
|--------|------|------|
| [`@dg-design/tokens`](https://www.npmjs.com/package/@dg-design/tokens) | 0.6.0 | OKLCH 파생 팔레트 → CSS 변수 + Tailwind v4 브릿지 + 타입. 코드젠에 WCAG 대비 검사 내장 |
| [`@dg-design/react`](https://www.npmjs.com/package/@dg-design/react) | 0.10.0 | React 컴포넌트 21종 (Button, Badge, NotificationBadge, Alert, Toast, Spinner, Progress, Checkbox, Switch, TextField·Field, TextArea, RadioGroup, Select, MultiSelect, Dialog, Sheet, DropdownMenu, ContextMenu, Tooltip, Popover, HoverCard). plain CSS + CVA, Tailwind 비종속 |

## 사용

```tsx
// 앱 진입점 — 토큰 CSS는 소비 앱이 한 번 로드한다
import "@dg-design/tokens/tokens.css";

import { Button } from "@dg-design/react";

<Button intent="brand" variant="solid" size="medium">확인</Button>
```

다크모드: `<html data-dds-theme="dark">`. 시스템 감지는 앱 책임.

Tailwind v4: tokens.css 선로드 후 `@import "@dg-design/tokens/tailwind.css";` → `bg-bg-brand-solid` 형태 유틸 사용.

## 개발

```
pnpm install
pnpm generate   # tokens.css / tailwind.css / 타입 생성 + 대비 검사 (미달 시 실패)
pnpm typecheck  # 3개 프로젝트 tsc --noEmit
pnpm build      # 전체 빌드
pnpm --filter @dg-design/storybook dev   # Storybook (다크 토글 툴바 내장)
```

구조: `packages/tokens`(단일 소스 + 코드젠) · `packages/react`(컴포넌트) · `apps/storybook`. 배포는 changesets.

## 문서

- 커스터마이즈(토큰 오버라이드·`@layer` 규칙·`createTheme`): [docs/customization.md](docs/customization.md)
- 아키텍처·토큰 체계 결정: [docs/decisions/](docs/decisions/)
- 완료된 스펙(이력): [docs/specs/archive/](docs/specs/archive/)
