# AGENTS.md

이 저장소에서 작업하는 코딩 에이전트(Claude Code, Codex 등) 공용 지침. 프로젝트 스킬은 `.claude/skills/`가 원본이고 `.agents/skills`는 심링크다.

# dg-design

Dogeol Design System (DDS). daangn/seed-design 구조를 참고한 개인 디자인시스템.
**상태: 0.1.0 npm 배포 완료 (2026-08-14).** npm org `dg-design`, 리모트 `github.com/DoGeol/dg-design`.

## 절대 규칙

**커밋·푸시(태그 푸시 포함)는 실행 전에 반드시 사용자에게 묻고 승인을 받는다.** 작업이 끝났다고 임의로 `git commit`이나 `git push`를 실행하지 않는다. 변경 요약을 보여주고 승인받은 뒤에 실행한다. 서브에이전트는 커밋 자체를 하지 않으며, 감독 세션이 승인을 받아 대신 커밋한다. 사용자가 커밋을 명시적으로 요청했을 때(`/git-commit` 포함)는 그 요청이 승인이다.

## 구조와 명령

- pnpm workspace: `packages/tokens`, `packages/react`, `apps/storybook`(`@dg-design/storybook`, private)
- `pnpm generate` — tokens.css / tailwind.css / 타입 생성 + WCAG 대비 검사 16쌍×2모드 (미달·sRGB 밖 값이면 **생성 실패**). 의존성 0, Node 네이티브 타입 스트리핑으로 실행
- `pnpm build` — 전체 빌드 (react는 Vite lib mode + preserveModules). publint는 `pnpm --filter @dg-design/react exec publint`
- CI(GitHub Actions): install → generate → build → publint. tokens dist는 gitignore — generate가 build에 선행해야 함
- 배포: changesets. publish는 npm 웹 재인증 때문에 사용자가 터미널에서 직접 실행

## 핵심 관습 (변경 시 스펙·결정 기록 먼저 확인)

- 토큰: `--dds-color-{role}-{intent}-{emphasis}[-{state}]`, role마다 축이 다름(격자 아님). palette는 내부 구현(타입 미노출), semantic만 공개 API
- hover/pressed 2단계 상태 축 — seed와 의도적으로 갈라진 유일한 지점
- 다크모드: `[data-dds-theme="dark"]` 재정의. palette는 모드 무관, semantic만 분기
- **tokens.css는 소비 앱이 수동 로드.** react 컴포넌트는 토큰 CSS를 import하지 않는다
- 컴포넌트 CSS: 수기 + CVA, 전체 `@layer dds`, `.dds-button--variant_solid` 클래스 관습(비공개 API), `:focus-visible`, `:is(:disabled,[disabled],[data-disabled])` 3중 매칭
- react 빌드에서 CSS는 external + raw copy 플러그인 (Vite가 side-effect import를 지우는 문제 회피 — vite.config.ts 참조)
- Tailwind 브릿지: `@theme` 재바인딩, 유틸명은 `bg-bg-brand-solid` 형태(토큰 이름 1:1)

## 코드 컨벤션

- **폴더 이름은 항상 kebab-case**
- **파일은 300~500줄을 넘기지 않는다.** 넘으면 분리를 검토한다. 다만 쪼개는 쪽이 오히려 추적을 어렵게 만든다고 판단되면 그대로 두고 나중에 분리한다 — 분리 자체가 목적이 아니다
- **주석은 꼭 필요한 곳에만 단다.** 이름과 구조로 의도가 드러나면 주석을 쓰지 않는다. 코드만 봐서는 알 수 없는 "왜"(우회한 버그, 외부 제약, 의도적으로 이상해 보이는 선택)일 때만 남긴다. 사용자가 명시적으로 요청하면 남긴다

## 문서

**[docs/INDEX.md](docs/INDEX.md)에서 필요한 것만 골라 읽는다.** `docs/` 전체를 훑지 않는다.

하지 않을 것 + 재고 트리거: 레시피 코드젠(컴포넌트 15개+), headless 분리(같은 로직에 다른 스타일 2회), 테스트 프레임워크(로직 컴포넌트 등장), 시각 회귀(컴포넌트 5개+), CJS·YAML 정의(영구 불채택)

## 참고 저장소

로컬 클론: `/Users/pdg/WebstormProjects/seed-design` — 패턴 참고용 read-only. 코드 복사보다 구조·네이밍 참고 우선.

- 토큰/스키마: `packages/rootage`, `packages/design-token`
- 레시피: `packages/qvism-preset`, `packages/css`, `packages/stylesheet`
- 컴포넌트: `packages/react`, `packages/react-headless`
- Tailwind 브릿지: `packages/tailwind4-theme`, `packages/tailwind3-plugin`
