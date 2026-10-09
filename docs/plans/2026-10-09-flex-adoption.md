# flex 적용 구현 계획

- 작성: 2026-10-09 · 기준 커밋: `8c4d3b1` (react 0.17.3 · tokens 0.8.0)
- 상태: **승인 (2026-10-09)** — P0~P2 배포(tokens 0.9.0 · react 0.18.0), P3 배포(react 0.19.0, [스펙](../specs/2026-10-09-p3-a11y-api.md)), P4 배포(react 0.20.0 · tokens 0.10.0, [스펙](../specs/2026-10-09-p4-new-kinds.md)). 커밋·푸시는 단계마다 사용자 확인
- 인계: [2026-10-09 인계 문서](../handoff/2026-10-09-flex-adoption.md) — 다른 환경에서 이어갈 때 먼저 읽는다
- 근거: [flex 적용 방향 결정](../decisions/2026-10-09-flex-adoption-direction.md) · [사용 가이드 스킬 결정](../decisions/2026-10-09-usage-skill.md) · [이중검토 종합](../reports/flex-adoption-review/review/synthesis.md) · [관점 보완](../reports/flex-adoption-review/gaps.md) · Storybook `Mockups/Flex/*` Decided
- 범위: 결정안을 실제 `packages/tokens`·`packages/react`에 반영하고 사용 가이드 스킬을 배포한다. dg-studio 전환은 이 저장소 밖이다.

## 단계

순서대로 하나씩 진행한다. 각 단계는 앞 단계가 배포 가능한 상태로 끝난 뒤 시작한다.

| 단계 | 내용 | 공개 API 변화 | 배포 | 별도 스펙 |
| --- | --- | --- | --- | --- |
| **P0 문서·가드** | README의 배럴 CSS 문구를 "번들러에 따라 다르다"로 정정. 하위 경로로 컴포넌트 하나를 번들하면 그 컴포넌트 CSS만 나오는지 확인하는 검사 스크립트를 CI에 추가 | 없음 | 없음 | 불필요 |
| **P1 역할 토큰·밀도** | `tokens.ts`에 역할 토큰(필드 높이·반경·안쪽 여백, 버튼 반경, 패널·옵션·메뉴 반경, 필드 간격·묶음 간격·페이지 여백, 조작 영역 등). 생성기에 `[data-dds-density="mobile"]` 블록(테마 블록과 같은 방식, 루트 지정). Tailwind 브릿지 연결과 이름 정정. `customization.md` 공개 표면 갱신 | 토큰 추가 | tokens minor | 불필요(이 계획이 범위) |
| **P2 외관** | 컴포넌트 CSS가 역할 토큰을 읽게 바꾼다. 결정된 외관(입력 4·버튼 6 모서리, Sheet 0, DataTable 체크박스·머리글 정렬, 모바일 44 조작 영역)을 기본값으로. 해당하는 시안 덮어쓰기 CSS는 같은 커밋에서 지운다. profiles.ts `FINAL`이 tokens.ts 역할 토큰과 값을 두 번 갖지 않게 정리 | 없음(모양만) | tokens + react minor **한 번에**. 시각 회귀 기준 1회 갱신 | 불필요 |
| **P3 접근성·API 선행** | DropdownMenu 체크·라디오 항목, Select·MultiSelect 표시 이름·검색 텍스트 분리(래퍼 옵션 등록 한계 해결), DataTable 열 정렬 옵션, Toast 옵션 `action` | 추가만 | react minor | 필요 — 작은 스펙 1개 |
| **P4 새 종류** | List·SectionHeader, Chip(제거·필터·툴박스), PropertyField. 구성 규칙대로 실제 소비처 두 곳을 스펙에 적는다. 목록·설정 행 역할 토큰(`list-*`·`setting-row-*`)도 여기서 추가 | 새 하위 경로 4개(filter-toolbox 분리), 토큰 6개 | tokens + react minor | 필요 — deep-interview |
| **P5 표시 방식** | Sheet 단계 전환(간단·상세·전체), Select·MultiSelect 모바일 Sheet 표시, Dialog `Toolbar`·`Body`·`Aside`·`Footer` | 추가만 | react minor | 필요 |
| **P6 폼 확장** | TextField·TextArea box·line 형태를 모바일 밀도에서만. box도 입력 경계 유지 | 추가만 | react minor | P4와 함께 판단 |
| **P7 사용 가이드 스킬** | 중립 예제(`.tsx`, 타입 검사 포함), `SKILL.md`, 컴포넌트별 참조 파일, 에이전트용 설정 가이드 md, 패키지 `files` 추가. 빈 프로젝트에서 Claude·Codex로 설정 가이드 검증 | 패키지 파일 추가 | react minor(또는 그때 배포에 포함) | 불필요(결정 기록이 범위) |

P3~P6의 예제는 각 단계에서 함께 쓰고, P7은 그 예제를 묶어 스킬로 내보낸다.

## 단계 공통 규칙

1. 착수 전에 해당 코드·결정 문서·Storybook 결정안을 다시 대조한다.
2. 동작이 있는 변경은 테스트를 먼저 쓴다(vitest, 인터랙션은 user-event).
3. 단계 끝 검증: `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → publint → 관련 VR.
4. 외관이 바뀌면 시각 회귀 기준은 CI `visual-baseline` 워크플로로만 갱신한다. 얇은 변화가 임계에 묻히지 않게 바뀐 컴포넌트 기준은 지우고 다시 찍는다.
5. 새 토큰을 읽는 react는 같은 배포의 tokens와 짝을 맞춘다. `customization.md` "버전 짝"을 갱신하고, CSS 대체값으로 버전 차이를 덮지 않는다.
6. 시안 CSS(`apps/storybook/src/mockups/flex/overrides/`)는 실제 구현이 들어오는 만큼 지운다. profiles.ts와 tokens.ts가 같은 값을 두 번 갖지 않게 한다.
7. 단계마다 changeset을 쓰고 결정 기록에 구현 중 결정을 남긴다. 배포는 Version PR 머지(사용자 승인)다.
8. 커밋·푸시는 단계 끝에 사용자 승인을 받는다(승인 방식은 아래 질문에서 정함). 서브에이전트는 커밋하지 않고 배럴 `src/index.ts`는 감독만 고친다.

## 하지 않을 것

- 이미지 시안 재생성, codex 사용.
- dg-studio 코드 수정(전환은 배포 뒤 별도 작업).
- 0.17.3 부유 패널 경계 결정 변경.
- 루트(배럴) 경로 제거 같은 기존 사용법을 깨는 변경. 필요하면 별도 마이그레이션 결정으로 다룬다.

## 승인 때 정한 것

결정안의 일부 치수는 결정을 적용하며 작성자가 해석한 값이었다. P2에서 패키지 기본값이 되면 모든 소비 앱의 모양이 바뀌므로 승인 때 다시 물었고, **아래 네 항목 모두 P2 기본값으로 넣기로 했다(2026-10-09)**.

| 해석 항목 | 결정안 값 | 현재 |
| --- | --- | --- |
| 모서리 톤을 패널까지 넓힘 | 선택 패널 12, 메뉴 12, 모바일 입력 14 | 12 · 12 · 8 |
| 패널 안 행 동심 반경 | 옵션 4, 메뉴 항목 6 | 6 · 6 |
| 행 높이 확대 | 옵션 36, 메뉴 항목 36 | 32 · 32 |
| 탭 확대 | 높이 40 · 좌우 12 · 패널 간격 24 | 36 · 8 · 12 |

데스크톱 필드 간격 12·묶음 간격 24·페이지 여백 32는 토큰으로만 제공되고 컴포넌트 기본 모양을 바꾸지 않는다.

## 다음(이 저장소 밖)

- dg-studio: 새 배포판으로 의존성 갱신(현재 0.17.2), 앱 임시 덮어쓰기(`studio-brand-theme.css` 포함) 정리, 사용 가이드 스킬 연결.
