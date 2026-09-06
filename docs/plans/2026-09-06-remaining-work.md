# 남은 작업 진행 계획 (2026-09-06)

> 상태: **A·B·C 완료, D 대기** · 감독 세션이 관리, 실행은 서브에이전트
> 선행: dg-studio PR #59(DDS 0.13.1 도입) 열림 · dg-design follow-ups D1·D2 기록됨

## 트랙

| 트랙 | 내용 | 저장소 | 실행 방식 |
| --- | --- | --- | --- |
| A | PR #59 스크린샷(라이트·다크, 390·1280) 첨부 | dg-studio `codex/dds-013-adoption-main` | 서브에이전트 1 |
| B | DDS 0.14.0 — D2 `Tabs.Content` tabIndex override, D1 compound 서브컴포넌트 named export 20종 | dg-design `packages/react` | 서브에이전트 3 (병렬) |
| C | 승격 2차 스펙 — SaveStatus · MultiSelect `onCreate` · 파일 입력 | dg-design `docs/specs` | deep-interview (감독+사용자) → implement-spec |
| D | dg-studio 2차 교체 (TagPicker→MultiSelect creatable, 저장 상태→SaveStatus, cover 파일 입력) | dg-studio | C 배포 뒤 별도 계획 |

순서: **A ∥ B** 지금 → C 인터뷰(B 실행 중 진행 가능) → C 구현 → B+C 한 번에 0.14.0 배포(Version PR 1개) → D.

## 트랙 A — 스크린샷

- 대상 6장 × (라이트·다크): Homeground 빈 목록(EmptyState)·error(ErrorState)·블로그 편집기 390/1280·이력서 편집기 390/1280·테마 토글(공개 푸터)·실험실 슬라이더 1곳.
- 방법: Playwright 스크립트(`tests/e2e/_screenshots.spec.ts` 임시, 실행 후 삭제)로 `docs/plans/assets/2026-09-06-dds-013/*.png` 저장. 다크는 `localStorage` 테마 저장값 주입.
- 산출: PNG + PR 본문 갱신용 마크다운 조각. 커밋은 감독이 승인받아 실행.
- 모델: sonnet · medium. 소유 범위: `docs/plans/assets/`, 임시 spec 1개.

## 트랙 B — DDS 0.14.0 (D1·D2)

D1 결정: **named sub-export 추가, 객체 export 유지.** 이름 규약 `{Compound}{Sub}` (예 `StatePanelRoot`, `TabsContent`). 이미 그 이름으로 선언된 내부 const에 `export`만 붙인다. 이름이 다르면(예 Avatar) 규약에 맞춰 alias export.

| # | 태스크 | 소유 범위 | 모델·추론 | 합격 조건 |
| --- | --- | --- | --- | --- |
| B1 | D2: `Tabs.Content` `tabIndex` 기본 0 유지, props로 override 허용 + 테스트 1건 | `tabs/` | haiku · low | `tabIndex={-1}` 전달 시 반영, 기존 tabs 테스트 통과 |
| B2 | D1 named export — accordion, avatar, breadcrumb, collapsible, context-menu, dialog, dropdown-menu, field, hover-card, multi-select | 해당 10 디렉터리 | sonnet · medium | 각 디렉터리 typecheck, 객체 export 불변 |
| B3 | D1 named export — pagination, popover, radio-group, select, sheet, state-panel, table, toast, tooltip, tabs(export만, B1과 파일 겹치므로 B1 완료 뒤) | 해당 10 디렉터리 | sonnet · medium | 동일 |

- barrel `src/index.ts`는 **감독이 직결**(AGENTS 규칙). 서브패스 `exports`는 파일 단위라 변경 없음.
- changeset: react **minor** (`@dg-design/react`) — 새 공개 API. C와 합쳐 0.14.0.
- 문서: follow-ups D1·D2 처리됨, 결정 기록 `2026-09-06-compound-named-exports.md`(RSC 근거).
- 게이트: `pnpm build && test && typecheck && publint`, VR(CI).

## 트랙 C — 승격 2차 스펙

deep-interview로 확정할 것(구성 규칙 문서의 사전 판정 반영):

| 후보 | 사전 판정 | 인터뷰에서 정할 것 |
| --- | --- | --- |
| SaveStatus | leaf. `dirty`·children(문구)·`aria-live` | 상태 축(saved/dirty/saving/error?), 아이콘 유무, 이력서 편집기의 3항목 상태줄까지 담을지 |
| MultiSelect `onCreate` | 기존 compound 옵션 | 생성 항목 표시(“‘x’ 만들기”), 비동기 생성 중 상태, 실패 표시, 최대 개수 |
| 파일 입력 | 미판정 | leaf(`FileInput` 버튼형) vs compound(dropzone+미리보기). cover-field는 hidden input + 버튼 + 미리보기 + alt 텍스트 |

산출: [승격 2차 스펙](../specs/archive/2026-09-06-studio-promotion-batch-2.md) — 승인·구현 완료(2026-09-06). 결정 기록 `decisions/2026-09-06-studio-promotion-batch-2-implementation.md`.

## 감독 처리

커밋·푸시·PR 갱신·Version PR 머지, 결정 판정, barrel 편집, 현황판 갱신.
