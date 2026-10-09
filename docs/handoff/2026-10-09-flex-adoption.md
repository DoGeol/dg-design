# 인계: flex 적용 (2026-10-09)

다른 환경에서 이어서 진행하기 위한 인계 문서다. 이 문서만 읽고 다음 단계를 시작할 수 있게 썼다. 먼저 [AGENTS.md](../../AGENTS.md)를 읽는다.

## 한 줄 상태

**P0~P2 배포 완료(2026-10-09, tokens 0.9.0 · react 0.18.0), 다음은 P3 접근성·API 선행.** P3는 작은 스펙을 먼저 쓴다.

## 브랜치와 PR

검토 브랜치는 [PR #24](https://github.com/DoGeol/dg-design/pull/24), P0~P2는 [PR #25](https://github.com/DoGeol/dg-design/pull/25), 배포는 Version PR [#26](https://github.com/DoGeol/dg-design/pull/26)으로 main에 병합했다(모두 merge commit). 작업 브랜치는 지웠다. P3부터는 main에서 단계별 브랜치를 새로 딴다.

## 확정된 결정

| 문서 | 핵심 |
| --- | --- |
| [flex 적용 방향](../decisions/2026-10-09-flex-adoption-direction.md) | A 기본 + B 사용례 흡수. 모서리 입력 4·버튼 6. outline 기본 + 모바일 확장. 브랜드 createTheme #1550A9. Sheet radius 0. 표 정렬 규칙. 결정안 치수표 36행 |
| [사용 가이드 스킬](../decisions/2026-10-09-usage-skill.md) | dg-design 소유·프로젝트 독립 예제 스킬. 패키지에 스킬 + 에이전트용 설정 가이드 md. layout은 최소 권장사항 + 프로젝트 로컬 파일 |
| [구현 계획](../plans/2026-10-09-flex-adoption.md) | P0~P7 순서, 단계 공통 규칙, 하지 않을 것 |

계획 승인 때 사용자가 정한 것:

- 결정안의 해석 항목 4개를 **모두 P2 패키지 기본값**으로 넣는다: 모서리 톤 확장(모바일 입력 14), 패널 안 행 동심 반경(옵션 4·메뉴 항목 6), 행 높이 36, 탭 확대(40·12·24).
- 커밋·푸시는 **단계마다 사용자에게 묻는다.** 배포(Version PR 머지)는 항상 따로 승인받는다.

## 끝난 단계

| 단계 | 커밋 | 내용 |
| --- | --- | --- |
| P0 문서·가드 | `9217ef7` | README 배럴 CSS 문구를 "번들러에 따라 다르다"로 정정. `packages/react/scripts/check-subpaths.js`(하위 경로가 배럴에 닿으면 실패)를 CI build 다음 단계에 추가 |
| P1 역할 토큰·밀도 | `020f77d` | 역할 토큰 30개, `[data-dds-density="mobile"]` 블록, Tailwind 브릿지(역할·`duration-*`·`z-*`, 4.3.3에서 컴파일 확인), `customization.md` "밀도" 절. 구현 중 결정은 [결정 기록](../decisions/2026-10-09-flex-adoption-direction.md) "구현 중 결정" |
| P2 외관 | `4e12f65` `e423639` `cf1504d` `b384abb` | 컴포넌트 CSS가 역할 토큰을 읽고 결정안 외관이 기본값. 구현된 시안 덮어쓰기 삭제, profiles.ts 결정안은 토큰 참조. VR 기준 155개를 지우고 CI `visual-baseline`으로 재촬영(60개 바뀜, 라벨 있는 Checkbox는 VR 스토리에 없어 미검증). 구현 중 결정은 결정 기록 "P2 외관" |

## 그다음 단계 요지

| 단계 | 시작할 때 볼 것 |
| --- | --- |
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

- ~~Sheet "배경 모서리 제거"의 해석~~ — **확인(2026-10-09): Sheet 패널 반경 0이 맞다.** 결정 기록 그대로 P2에 넣는다.
- ~~검토 브랜치 병합 방식~~ — 위 "정함" 참고.
- **Turbopack 배럴 동작 미측정** — 측정하지 않기로 했다(2026-10-09). README는 "번들러에 따라 다르다"로만 쓴다.
- **보강 이미지 결함**(B 12 오타 등)은 다시 그리지 않기로 했다. 이미지는 방향 참고이고 구현은 Storybook을 따른다.

## 환경 주의

- **codex:** 사용자 계정은 Plus라 5시간 한도가 있다. 워커는 동시에 1~2개, 추론 단계 high, 결과물당 한 번만. 계획상 이 작업에는 codex를 쓰지 않는다.
- **Orca 터미널:** `CODEX_HOME`이 Orca가 관리하는 계정 폴더를 가리킨다. 셸에서 직접 `codex`를 부르면 사용자 `~/.codex` 로그인이 아니라 그 계정을 시험한다.
- **Storybook 비교 방식:** `iframe.html?globals=flex:final;density:mobile;theme:dark`로 안별 렌더가 된다(Storybook 10.5). 포털 오버레이까지 안별로 보려면 열마다 iframe이어야 한다.
- **이 환경에만 있는 것:** scratchpad의 캡처·측정 스크립트, Claude 로컬 메모리. 필요한 사실은 이 문서에 옮겼다.
- AGENTS.md의 규칙이 우선한다. 특히 커밋·푸시 사전 승인, `AskUserQuestion`으로 결정 묻기, VR 기준 CI 전용, changeset `@` 키 따옴표, 배포는 Version PR 머지.
