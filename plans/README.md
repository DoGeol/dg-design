# 컴포넌트 애니메이션 추가 계획

- 작성: 2026-09-13 / 기준 커밋: 43c9575
- 상태: **완료 (2026-09-13)** — 6개 계획 전부 구현·검증. 커밋·배포는 별도 승인 범위
- 범위: 사용자가 선택한 우선순위 6종. 기존 모션 전체 감사나 오버레이 고도화는 별도 작업.
- 스킬: improve-animations의 plan 경로. 각 계획은 소스 근거·정확한 목표값·경계·검증을 포함한다.

## 실행 순서

| 순서 | 계획 | 상태 | 단위 테스트 | 브라우저 모션 테스트 |
| --- | --- | --- | --- | --- |
| 1 | [SaveStatus](001-save-status.md) | 완료 | 17 | `save-status-motion.spec.ts` 5 |
| 2 | [Checkbox](002-checkbox.md) | 완료 | 14 | `checkbox-motion.spec.ts` 6 |
| 3 | [RadioGroup](003-radio-group.md) | 완료 | 29 | `radio-group-motion.spec.ts` 6 |
| 4 | [Tabs](004-tabs.md) | 완료 | 19 | `tabs-motion.spec.ts` 6 |
| 5 | [Button loading](005-button-loading.md) | 완료 | 20 | `button-motion.spec.ts` 5 |
| 6 | [Avatar](006-avatar.md) | 완료 | 17 | `avatar-motion.spec.ts` 5 |

계획한 순서대로 하나씩 구현·검증했다. 003이 만든 `internal/use-selection-indicator.ts`를 004가 그대로 재사용했고,
브라우저 테스트는 공통 파일 하나로 시작했다가 004에서 `motion-helpers.ts` + 컴포넌트별 `*-motion.spec.ts`로 나눴다(관습 상한 300~500줄).
공개 API와 기본값은 [모션 API 결정 기록](../docs/decisions/2026-09-13-component-motion-api.md)에 남겼다.

## 공통 설계 제안

- 기존 150ms / cubic-bezier(0, 0, 0.2, 1) 재사용. 저장소의 easing 1종 결정 존중. spring 및 새 의존성 없음.
- 신규 전환은 transform/opacity로 제한. 연속 조작 시 현재 화면 상태에서 이어지고 의미 상태는 즉시 반영.
- 소비 앱의 사용 빈도를 라이브러리가 알 수 없으므로 대상에 motion?: "auto" | "none" 제안.
  SaveStatus·Checkbox·RadioGroup.Root·Tabs.Root·Button은 auto 기본, Avatar.Root는 none 기본(프로필에서 명시 활성화).
  이 API와 기본값은 구현 시 공개 API 결정 기록 및 변경 내역에 남길 대상이다.
- 선택 컨트롤의 auto는 포인터에 의한 동기 선택만 전환한다. 키보드·초기·프로그램 변경은 즉시 반영.
- reduce는 새 위치/확대 전환을 제거하고 필요한 opacity만 150ms 유지. 기존 컴포넌트의 reduced-motion 정책을 일괄 수정하지 않는다.
- Button은 폭 안정화를 위해 로딩 동안 중앙 Spinner가 라벨을 시각적으로 대체하는 디자인을 제안한다. 접근 가능한 이름은 유지한다.
- Avatar는 기본 none으로 범위를 제한하고 캐시 완료는 auto에서도 즉시 표시한다.

## 진행과 합격 기준

1. 각 계획 착수 시 현재 코드·결정 문서를 재대조하고 대상의 기존 테스트를 기준으로 삼는다.
2. 해당 컴포넌트 구현 및 정지 상태에서 시작하는 MotionDemo를 추가한다.
3. 단위 테스트로 상태·이벤트·접근성 계약, 브라우저 기능 테스트로 실제 크기·키보드·중단·reduce를 검증한다.
4. 정상 속도와 10% 재생으로 체감을 확인한다. 특히 150ms 안의 역방향 전환, unequal widths, RTL, responsive, 캐시 로드를 본다.
5. 해당 단계 기준을 만족한 다음 다음 순위로 이동한다. 기존 상태 보존 또는 중단 동작에 실패하면 그 단계에서 먼저 해결한다.
6. 마지막에 generate → build → test → typecheck → publint → vr 통합 검증. VR 기본 reduce/animations disabled만으로 모션 검증 완료로 판정하지 않는다.
7. 스크린샷 기준 갱신은 CI에서만 수행. 최종 변화 요약과 검증 결과를 제시한다. 커밋·푸시·배포는 별도 사용자 요청/승인 범위.

## 최종 검증 (2026-09-13)

정해진 순서대로 저장소 전체를 돌렸고 전부 통과했다.

| 명령 | 결과 |
| --- | --- |
| `pnpm generate` | 생성 완료 — palette 61 / semantic 47, WCAG 대비·gamut 전부 통과 |
| `pnpm build` | tokens · react · storybook 전체 성공 |
| `pnpm --filter @dg-design/react test` | **37 files / 458 tests passed** |
| `pnpm typecheck` | 3개 프로젝트 Done |
| `pnpm --filter @dg-design/react exec publint` | All good! |
| `pnpm vr` | 96 passed / 70 skipped (스킵 = darwin 기준 이미지 없음, 설계대로) |

브라우저 모션 테스트는 6개 파일 33건이며 각 단계에서 반복 실행(`--repeat-each`)으로 안정성을 확인했다.
시간 변화는 VR 스크린샷이 아니라 이 기능 테스트와 10% 재생 육안 확인이 담당한다.

## 남은 일

- **VR 기준 이미지 갱신 3건** — CI `visual-baseline` 워크플로 수동 트리거로만 수행한다(로컬 `-u`는 가드가 막는다).
  - `checkbox--state-matrix-story` light·dark **PNG** — 002가 고친 baseline 정렬(checked·indeterminate 칸 1.84~2.11px 상승)
  - `radiogroup--state-matrix-story` light·dark **TXT** — 003의 선택 배경 요소 추가 + 선택 항목 배경 transparent
  - `tabs--state-matrix` light·dark **TXT** — 004의 밑줄 요소 추가 + 활성 Trigger 밑줄 transparent
  - 001·005·006은 정적 상태의 DOM·픽셀이 그대로라 갱신 대상이 아니다.
- 커밋·푸시·Version PR은 사용자 승인 범위. 변경 내역은 `.changeset/component-motion.md`에 있다.
