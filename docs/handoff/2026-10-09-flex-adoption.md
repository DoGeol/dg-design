# 인계: flex 적용 (2026-10-09)

다른 환경에서 이어서 진행하기 위한 인계 문서다. 이 문서만 읽고 바로 P0를 시작할 수 있게 썼다. 먼저 [AGENTS.md](../../AGENTS.md)를 읽는다.

## 한 줄 상태

검토·결정·계획은 끝났고 **패키지 코드는 아직 한 줄도 바뀌지 않았다.** [구현 계획](../plans/2026-10-09-flex-adoption.md)이 승인됐고 P0부터 순서대로 시작하면 된다.

## 브랜치와 커밋

| 브랜치 | 상태 |
| --- | --- |
| `codex/flex-adoption-review-v0173` | 원격에 푸시됨(`8c4d3b1`). main보다 7커밋 앞섬. **PR 없음, main에 미병합** |
| `feat/flex-adoption` | 위 브랜치에서 갈라진 구현용 브랜치. 이 인계 문서와 구현 계획을 담는다 |

main 위의 7커밋(오래된 순):

| 커밋 | 내용 |
| --- | --- |
| `19edccc` `ea9c55b` `e5d0018` | (이전 작업) flex 적용 검토, 컴포넌트 38개 적용안 A, 원문 우선 재검토 B와 B 이미지 보드 |
| `e1a5e73` | Storybook `Mockups/Flex` A·B 비교, B 치수 명세, 관점 보완, Claude·Gemini 이중검토, 적용 방향 결정 |
| `3085759` | A·B 보강 이미지 11–14 |
| `ded6dc0` | 사용 가이드 스킬 결정 |
| `8c4d3b1` | 결정안 미리보기(Decided 스토리 46개), 표 정렬·Sheet 모서리 |

**정할 것:** 검토 브랜치를 main에 먼저 병합할지, `feat/flex-adoption`의 구현과 함께 하나의 PR로 올릴지. 검토 브랜치는 문서와 Storybook 시안만 바꿨고 `packages/`는 그대로다.

## 확정된 결정

| 문서 | 핵심 |
| --- | --- |
| [flex 적용 방향](../decisions/2026-10-09-flex-adoption-direction.md) | A 기본 + B 사용례 흡수. 모서리 입력 4·버튼 6. outline 기본 + 모바일 확장. 브랜드 createTheme #1550A9. Sheet radius 0. 표 정렬 규칙. 결정안 치수표 36행 |
| [사용 가이드 스킬](../decisions/2026-10-09-usage-skill.md) | dg-design 소유·프로젝트 독립 예제 스킬. 패키지에 스킬 + 에이전트용 설정 가이드 md. layout은 최소 권장사항 + 프로젝트 로컬 파일 |
| [구현 계획](../plans/2026-10-09-flex-adoption.md) | P0~P7 순서, 단계 공통 규칙, 하지 않을 것 |

계획 승인 때 사용자가 정한 것:

- 결정안의 해석 항목 4개를 **모두 P2 패키지 기본값**으로 넣는다: 모서리 톤 확장(모바일 입력 14), 패널 안 행 동심 반경(옵션 4·메뉴 항목 6), 행 높이 36, 탭 확대(40·12·24).
- 커밋·푸시는 **단계마다 사용자에게 묻는다.** 배포(Version PR 머지)는 항상 따로 승인받는다.

## 다음 할 일: P0 문서·가드

배포 없음, 공개 API 변화 없음.

1. **README 문구 정정** — `packages/react/README.md` 23행의 "배럴은 … 모든 컴포넌트의 CSS가 번들에 함께 실린다"를 "번들러에 따라 다르다"로 고친다. 근거는 아래 "번들 측정"이다. 하위 경로 import를 권장하는 결론은 그대로다.
2. **하위 경로 가드 스크립트** — `packages/react`에 스크립트를 두고 CI의 build 다음 단계에서 돌린다(`.github/workflows/ci.yml`, 현재 순서 install → generate → build → test → typecheck → publint → vr).
   - 최소 검사: `dist`에서 `index.js`(배럴) 말고는 어떤 모듈도 배럴을 import하지 않는다. 하위 경로 진입점이 배럴에 닿으면 컴포넌트 하나만 써도 전부 딸려온다.
   - 확인용 출력: 하위 경로마다 닿는 컴포넌트 폴더와 CSS 파일 목록.
   - 새 의존성은 넣지 않는다. 정적 import 그래프 탐색이면 충분하다.

P0가 끝나면 변경 요약과 검증 결과를 보여 주고 커밋·푸시 승인을 받는다.

## 그다음 단계 요지

| 단계 | 시작할 때 볼 것 |
| --- | --- |
| P1 역할 토큰·밀도 | 역할 목록과 값은 `apps/storybook/src/mockups/flex/profiles.ts`의 `ROLES`·`FINAL`. 결정안 값은 결정 기록 치수표. 밀도는 `packages/tokens/src/color-core.ts`의 `tokensCss()`가 `[data-dds-theme]` 블록을 만드는 방식 그대로 `[data-dds-density="mobile"]` 블록을 만든다(루트 지정 전제 — 포털 상속 문제 없음). Tailwind 브릿지는 `--transition-duration-*`·`--z-index-*` 이름 정정 포함. `docs/customization.md` 공개 표면·버전 짝 갱신 |
| P2 외관 | 미리보기 덮어쓰기 CSS(`apps/storybook/src/mockups/flex/overrides/*.css`)가 실제로 고칠 선택자 목록이다. 구현한 만큼 그 규칙을 지운다. 표 정렬 원인: DataTable 선택 칸 체크박스가 `inline-flex`라 기준선에 붙음(본문 −2~2.5px, 필터 머리글 18px). tokens·react를 같은 배포로 짝 맞춤. VR 기준은 CI `visual-baseline`으로만 갱신 |
| P3~P7 | 각 단계 스펙을 먼저 쓴다(P4는 deep-interview). 현재 DDS 문제 목록은 [관점 보완 §13](../reports/flex-adoption-review/gaps.md) |

## 번들 측정 (2026-10-09, P0 근거)

임시 소비 프로젝트에서 측정했다. 측정 스크립트는 로컬 scratchpad에만 있어 넘어가지 않는다. 같은 방식(패키지를 `node_modules/@dg-design/react`로 심링크하고 react를 외부로 둔 채 entry별 번들)으로 다시 잴 수 있다.

| import | Vite 8(rolldown) JS / CSS | esbuild 0.28 JS / CSS |
| --- | --- | --- |
| `@dg-design/react/button` | 5.6KB / 6.0KB | 6.0KB / 6.0KB |
| `@dg-design/react`에서 Button만 | 5.7KB / 6.0KB | 6.0KB / **82.7KB(전부)** |
| `@dg-design/react/date-picker` | 148.5KB / 19.7KB | 156.9KB / 19.9KB |

- 패키지 설정(`exports` 하위 경로 38개, `sideEffects: ["*.css"]`, ESM `preserveModules`, 컴포넌트마다 자기 CSS import)은 맞다.
- webpack·Turbopack(Next 16 빌드 기본)은 측정하지 못했다. dg-studio는 하위 경로만 써서(348건, 배럴 0건) 영향 없음.
- DatePicker는 Sheet·Popover를 둘 다 싣는다. P5 표시 방식 작업 때 검토 후보.

## 결정안 미리보기 보는 법

```sh
pnpm install --frozen-lockfile && pnpm generate && pnpm build
pnpm --filter @dg-design/storybook dev   # http://localhost:6006
```

- `Mockups/Flex/<그룹>/<컴포넌트>`의 **Decided**: 현재 DDS vs 결정안 두 열. **Compare**: 현재·A·B 세 열.
- 툴바 Flex=결정안이면 기존 컴포넌트 스토리도 결정안 외관으로 보인다. Density·Theme·Brand 툴바도 있다.
- 시안 스토리는 `Mockups/` 아래라 시각 회귀 대상이 아니다.

## 열린 질문과 위험

- **Sheet "배경 모서리 제거"의 해석:** 사용자 요청 "drawer(sheet)의 경우 배경의 round를 제거"를 Sheet 패널 반경 0으로 해석해 반영했다. 미리보기 회색 배경 프레임도 함께 각지게 했다. 사용자가 프레임만 뜻했을 가능성을 물었으나 답을 받지 못했다. P2 전에 한 번 확인한다.
- **검토 브랜치 병합 방식**(위 "정할 것").
- **Turbopack 배럴 동작 미측정.**
- **보강 이미지 결함**(B 12 오타 등)은 다시 그리지 않기로 했다. 이미지는 방향 참고이고 구현은 Storybook을 따른다.

## 환경 주의

- **codex:** 사용자 계정은 Plus라 5시간 한도가 있다. 워커는 동시에 1~2개, 추론 단계 high, 결과물당 한 번만. 계획상 이 작업에는 codex를 쓰지 않는다.
- **Orca 터미널:** `CODEX_HOME`이 Orca가 관리하는 계정 폴더를 가리킨다. 셸에서 직접 `codex`를 부르면 사용자 `~/.codex` 로그인이 아니라 그 계정을 시험한다.
- **Storybook 비교 방식:** `iframe.html?globals=flex:final;density:mobile;theme:dark`로 안별 렌더가 된다(Storybook 10.5). 포털 오버레이까지 안별로 보려면 열마다 iframe이어야 한다.
- **이 환경에만 있는 것:** scratchpad의 캡처·측정 스크립트, Claude 로컬 메모리. 필요한 사실은 이 문서에 옮겼다.
- AGENTS.md의 규칙이 우선한다. 특히 커밋·푸시 사전 승인, `AskUserQuestion`으로 결정 묻기, VR 기준 CI 전용, changeset `@` 키 따옴표, 배포는 Version PR 머지.
