# AGENTS.md

이 저장소에서 작업하는 코딩 에이전트(Claude Code, Codex 등) 공용 지침. 프로젝트 스킬은 `.claude/skills/`가 원본이고 `.agents/skills`는 심링크다.

# dg-design

Dogeol Design System (DDS). daangn/seed-design 구조를 참고한 개인 디자인시스템.
**상태: 0.1.0 npm 배포 완료 (2026-08-14).** npm org `dg-design`, 리모트 `github.com/DoGeol/dg-design`.

## 절대 규칙

**커밋·푸시(태그 푸시 포함)는 실행 전에 반드시 사용자에게 묻고 승인을 받는다.** 작업이 끝났다고 임의로 `git commit`이나 `git push`를 실행하지 않는다. 변경 요약을 보여주고 승인받은 뒤에 실행한다. 서브에이전트는 커밋 자체를 하지 않으며, 감독 세션이 승인을 받아 대신 커밋한다. 사용자가 커밋을 명시적으로 요청했을 때(`/git-commit` 포함)는 그 요청이 승인이다.

**사용자에게 결정을 물을 때는 `AskUserQuestion`을 쓴다.** 채팅 평문으로 선택지를 나열하지 않는다 — 사용자가 일부만 답하거나 흘린다. 승인 게이트, 갈래 선택, 우선순위 결정이 전부 해당한다. 예외는 아직 선택지를 댈 수 없는 열린 탐색("이걸 왜 만들려는지")뿐이다.

## 구조와 명령

- pnpm workspace: `packages/tokens`, `packages/react`, `apps/storybook`(`@dg-design/storybook`, private)
- 공유 의존성 버전은 `pnpm-workspace.yaml`의 `catalog:`가 단일 소스 — 각 package.json은 `"catalog:"`로 참조. TypeScript는 6.x (7은 vite-plugin-dts 미지원)
- `minimumReleaseAge` 3일 게이트 — 의존성 추가·업데이트 시 range 하한이 3일 미만이면 설치가 실패한다. 하한을 최신 성숙 버전으로 잡을 것
- `pnpm generate` — tokens.css / tailwind.css / 타입 생성 + WCAG 대비 검사 16쌍×2모드 (미달·sRGB 밖 값이면 **생성 실패**). 의존성 0, Node 네이티브 타입 스트리핑으로 실행
- `pnpm typecheck` — 3개 프로젝트 `tsc --noEmit`. 빌드가 잡지 못하는 타입 에러는 여기서만 걸린다 (tokens는 Node 타입 스트리핑, storybook은 번들러 통과)
- `pnpm --filter @dg-design/react test` — vitest. 인터랙션 테스트는 fireEvent 금지, user-event 사용 (jsdom이 disabled 차단을 구현 안 함)
- `pnpm vr` — Playwright 시각 회귀. **기준 이미지는 CI(ubuntu)에서만 생성·갱신** — 로컬 `-u` 금지(코드 가드가 막음), 갱신은 visual-baseline 워크플로 수동 트리거
- `pnpm build` — 전체 빌드 (react는 Vite lib mode + preserveModules). publint는 `pnpm --filter @dg-design/react exec publint`
- CI(GitHub Actions): install → generate → build → test → typecheck → publint. tokens dist는 gitignore라 generate가 선행, storybook typecheck는 react dist를 참조하므로 build 뒤
- 배포: changesets. publish는 npm 웹 재인증 때문에 사용자가 터미널에서 직접 실행

## 핵심 관습 (변경 시 스펙·결정 기록 먼저 확인)

- 토큰: `--dds-color-{role}-{intent}-{emphasis}[-{state}]`, role마다 축이 다름(격자 아님). palette는 내부 구현(타입 미노출), semantic만 공개 API. intent 6종(brand·neutral·critical·positive·warning·informative) — 새 4종은 base만, hover/pressed 없음. warning solid는 밝은 황 + 어두운 fg(반전 근거는 구현 결정 기록)
- hover/pressed 2단계 상태 축 — seed와 의도적으로 갈라진 유일한 지점
- 다크모드: `[data-dds-theme="dark"]` 재정의. palette는 모드 무관, semantic만 분기
- **tokens.css는 소비 앱이 수동 로드.** react 컴포넌트는 토큰 CSS를 import하지 않는다
- 컴포넌트 CSS: 수기 + CVA, 전체 `@layer dds`, `.dds-button--variant_solid` 클래스 관습(비공개 API), `:focus-visible`, `:is(:disabled,[disabled],[data-disabled])` 3중 매칭
- react 빌드에서 CSS는 external + raw copy 플러그인 (Vite가 side-effect import를 지우는 문제 회피 — vite.config.ts 참조)
- Tailwind 브릿지: `@theme` 재바인딩, 유틸명은 `bg-bg-brand-solid` 형태(토큰 이름 1:1)

## 코드 컨벤션

- **폴더 이름은 항상 kebab-case**
- **파일은 300~500줄을 넘기지 않는다** — 글자 수가 아니라 **줄 수**다. 줄이 기준인 이유: 에이전트가 파일을 라인 좌표로 읽고(`file.ts:42`), 부분 읽기 단위도 라인이며, `wc -l`로 즉시 검증된다. 500줄이면 한 번에 통째로 읽혀 잘리지 않으므로 맥락이 끊기지 않는다
- 상한을 넘으면 분리를 검토한다. 다만 쪼개는 쪽이 오히려 추적을 어렵게 만든다고 판단되면 그대로 두고 나중에 분리한다 — 분리 자체가 목적이 아니다
- **주석은 꼭 필요한 곳에만 단다.** 이름과 구조로 의도가 드러나면 주석을 쓰지 않는다. 코드만 봐서는 알 수 없는 "왜"(우회한 버그, 외부 제약, 의도적으로 이상해 보이는 선택)일 때만 남긴다. 사용자가 명시적으로 요청하면 남긴다

## 문서

**[docs/INDEX.md](docs/INDEX.md)에서 필요한 것만 골라 읽는다.** `docs/` 전체를 훑지 않는다.

하지 않을 것 + 재고 트리거: 레시피 코드젠(컴포넌트 15개+), headless 분리(같은 로직에 다른 스타일 2회), TypeScript 7(vite-plugin-dts가 TS7의 JS Compiler API 미지원 — 지원되면 재시도. 현재 6.x), renovate(컴포넌트 늘고 수동 업데이트가 부담될 때), CJS·YAML 정의(영구 불채택). 테스트 프레임워크는 0.3.0(vitest), 시각 회귀는 0.4.0(Playwright)에서 도입됨

## 참고 저장소

로컬 클론: `/Users/pdg/WebstormProjects/seed-design` — 패턴 참고용 read-only. 코드 복사보다 구조·네이밍 참고 우선.

- 토큰/스키마: `packages/rootage`, `packages/design-token`
- 레시피: `packages/qvism-preset`, `packages/css`, `packages/stylesheet`
- 컴포넌트: `packages/react`, `packages/react-headless`
- Tailwind 브릿지: `packages/tailwind4-theme`, `packages/tailwind3-plugin`
