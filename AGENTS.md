# AGENTS.md

코딩 에이전트 공용 지침. 프로젝트 스킬 원본은 `.claude/skills/`(`.agents/skills`는 심링크).

# dg-design

Dogeol Design System (DDS). daangn/seed-design 참고한 개인 디자인시스템.
**react 0.10.0 · tokens 0.6.0 버전 확정(publish 대기), 컴포넌트 21종.** npm org `dg-design`, 리모트 `github.com/DoGeol/dg-design`.

## 절대 규칙

**커밋·푸시(태그 푸시 포함)는 실행 전에 반드시 사용자에게 묻고 승인을 받는다.** 변경 요약을 보여주고 승인받은 뒤에 실행한다. 서브에이전트는 커밋 자체를 하지 않으며, 감독 세션이 승인을 받아 대신 커밋한다. 사용자가 커밋을 명시적으로 요청했을 때(`/git-commit` 포함)는 그 요청이 승인이다.

**사용자에게 결정을 물을 때는 `AskUserQuestion`을 쓴다.** 채팅 평문으로 선택지를 나열하지 않는다 — 사용자가 일부만 답하거나 흘린다. 승인 게이트, 갈래 선택, 우선순위 결정이 전부 해당한다. 예외는 아직 선택지를 댈 수 없는 열린 탐색뿐이다.

## 구조와 명령

- pnpm workspace: `packages/tokens`, `packages/react`, `apps/storybook`, `apps/visual-regression`(뒤 둘은 private)
- 공유 의존성 버전은 `pnpm-workspace.yaml`의 `catalog:`가 단일 소스. TypeScript는 6.x (7은 vite-plugin-dts 미지원)
- `minimumReleaseAge` 3일 게이트 — 의존성 range 하한이 3일 미만이면 설치 실패
- `pnpm generate` — tokens.css / tailwind.css / 타입 생성 + WCAG 대비·gamut 검사 내장(미달 시 **생성 실패**). 의존성 0, Node 타입 스트리핑 실행
- `pnpm typecheck` — 3개 프로젝트 `tsc --noEmit`. 빌드가 못 잡는 타입 에러는 여기서만 걸린다
- `pnpm --filter @dg-design/react test` — vitest. 인터랙션은 fireEvent 금지, user-event 사용 (jsdom이 disabled 차단 미구현)
- `pnpm vr` — Playwright 시각 회귀 + 기능 테스트. **기준 이미지는 CI(ubuntu)에서만 생성·갱신**(로컬 `-u`는 가드가 막음, visual-baseline 워크플로 수동 트리거). 얇은 요소 추가는 diff 임계(0.5%) 아래로 조용히 통과하니 스토리 확장 시 기준을 삭제해 재촬영. VR은 `*--state-matrix`를 우선 집으니 **기능 테스트용 데모 스토리는 닫힌 상태로** 두라(열어두면 오버레이가 트리거를 덮는다)
- `pnpm build` — 전체 빌드 (react는 Vite lib mode + preserveModules). publint는 `pnpm --filter @dg-design/react exec publint`
- CI: install → generate → build → test → typecheck → publint → vr. tokens dist가 gitignore라 generate 선행, storybook typecheck가 react dist 참조라 build 뒤
- 배포: changesets. **changeset frontmatter의 `@` 키는 반드시 따옴표 인용**(미인용은 YAML 파싱 실패로 version이 죽는다). publish는 npm 재인증 때문에 사용자가 터미널에서 직접

## 핵심 관습 (변경 시 결정 기록 먼저 확인)

- 토큰: `--dds-color-{role}-{intent}-{emphasis}[-{state}]`, role마다 축이 다름. palette는 내부 구현, semantic만 공개 API. intent 6종 — hover/pressed는 brand·neutral·critical만(나머지는 base). warning solid는 밝은 황 + 어두운 fg
- 다크모드: `[data-dds-theme="dark"]` 재정의. palette는 모드 무관, semantic만 분기
- **tokens.css는 소비 앱이 수동 로드.** react 컴포넌트는 토큰 CSS를 import하지 않는다
- 컴포넌트 CSS: 수기 + CVA, `@layer dds`, `.dds-x--variant_y` 클래스(비공개 API), `:focus-visible`, `:is(:disabled,[disabled],[data-disabled])` 3중 매칭, 테두리는 1px 하드코딩(2px 토큰은 소형 컨트롤에 무겁다)
- react 빌드에서 CSS는 external + raw copy 플러그인 (vite.config.ts 참조). barrel(src/index.ts)은 병렬 작업 시 에이전트 수정 금지 — 감독이 직결
- 공통은 `internal/`: use-overlay(오버레이 배선, 모달 여부는 dialog-stack), select-core(옵션 목록), overlay-motion.css(공용 keyframes). **클릭 토글·트리거 기준 배치가 아니면**(hover·우클릭) use-overlay 대신 primitive를 직접 조립한다
- live region: critical intent만 `role="alert"`, 나머지는 `role="status"`. `aria-live`는 얹지 않는다(role이 암묵적 politeness를 갖는다)
- Tailwind 브릿지: `@theme` 재바인딩, 유틸명은 `bg-bg-brand-solid` 형태

## 코드 컨벤션

- 폴더 이름은 kebab-case. 파일은 **300~500줄** 상한(`wc -l` 기준) — 넘으면 분리 검토하되 분리가 목적은 아니다
- 주석은 코드로 알 수 없는 "왜"에만

## 문서

**[docs/INDEX.md](docs/INDEX.md)에서 필요한 것만 골라 읽는다.** 남은 일과 착수 조건은 [docs/follow-ups.md](docs/follow-ups.md). 재고 트리거: headless 분리(같은 로직에 다른 스타일 2회), TypeScript 7(vite-plugin-dts 지원 시), renovate(수동 업데이트 부담 시). 영구 불채택: 레시피 코드젠·CJS·YAML 정의

## 참고 저장소

로컬 클론 `/Users/pdg/WebstormProjects/seed-design` — read-only 패턴 참고(토큰 rootage, 레시피 qvism-preset, 컴포넌트 react·react-headless, 브릿지 tailwind4-theme).
