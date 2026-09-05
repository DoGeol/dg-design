# 후속 작업

0.9.0 검토(렌즈 6개 감사)에서 나온 30건 중 **29건이 처리됐고 1건이 남았다.** 남은 하나는 미루다 남은 게 아니라 **지금 하지 않는 것이 맞다고 판단된 것**이라, "무엇이 정해져야 착수할 수 있는지"를 같이 적는다.

근거 문서: [0.9.0 감사 결과](decisions/2026-08-17-feedback-batch-implementation.md) 및 각 구현 결정 기록.

## 남은 것

### C3 — 색 회귀를 잡을 수단

**문제**: 작은 글자의 색 변화는 VR 임계(`maxDiffPixelRatio: 0.005`) 아래라 스크린샷 비교로 안 잡힌다. 더 나쁜 건 **기준 갱신조차 no-op**이라는 점이다 — Playwright의 `--update-snapshots`는 임계를 넘은 것만 다시 쓴다. 보조 텍스트 AA 대비를 고칠 때 실제로 그랬고, 기준 12장을 손으로 지워 강제 재촬영했다.

**착수 전에 정해야 할 것**: 어느 쪽으로 풀지가 안 정해졌다.
- 임계를 컴포넌트별로 낮춘다 → 텍스트가 많은 스토리에서 폰트 렌더링 차이로 거짓 실패가 늘 수 있다
- 계산된 색을 단언하는 별도 테스트를 둔다 → VR과 별개 축이 생기고, 무엇을 단언 대상으로 삼을지(토큰? 컴포넌트별 실효색?) 결정이 필요하다

**현재 우회**: 색 토큰을 바꾸면 영향 기준을 **지워서** 재촬영한다. 이 절차가 [AGENTS.md](../AGENTS.md)에 기록돼 있다.

## 알아두면 첫 시도에서 안 틀리는 것

이번 세션에서 실측으로 확인된 것들 — 재현 경로와 근거는 `docs/decisions/`에 있다.

| 사실 | 영향 |
|------|------|
| jsdom은 `animationDuration`이 `auto`라 `use-presence`의 `exitDurationMs`가 **항상 0** | 오버레이 퇴장·재열림은 유닛 테스트로 검증 불가. `apps/visual-regression/tests/overlay-exit.spec.ts`가 그 구간을 담당한다 |
| `playwright.config`의 `use.reducedMotion`이 `matchMedia`에 **반영되지 않는다** | reduced-motion 검증은 테스트마다 `page.emulateMedia()`로 직접 걸어야 한다 |
| VR은 `*--state-matrix`를 우선 집는다 | 기능 테스트용 데모 스토리는 **닫힌 상태로** 둔다(열어두면 오버레이가 트리거를 덮어 클릭이 막힌다) |
| 퇴장 애니메이션 keyframes는 `internal/overlay-motion.css`에 공용으로 있다 | 새 오버레이는 값이 같으면 그것을 참조한다. 진짜 다른 모션만 자기 파일에 |

## 처리된 것

30건 중 29건. 큰 갈래만:

- **P1 6건** — 중첩 오버레이가 조상을 닫던 문제, controlled 리셋 미반영, Field 미연동 3종, z-index 부재, 보조 텍스트 AA 미달, CSS 트리셰이킹 차단
- **기능 공백** — Toast(+ live region 정책 신설) · Alert · Spinner · Progress · Button loading · Button critical intent
- **버그 6건** — 사라진 옵션 선택, RadioGroup 접근 이름, ContextMenu 포커스 소실, Tooltip 그룹 스킵, 닫히는 오버레이 inert, DropdownMenu ArrowUp
- **테스트 인프라** — Button 테스트 신설, 오버레이 퇴장·재열림 Playwright 커버리지
- **다듬기 8건** — keyframes 공용화, 닫힘 prop·`initialFocusRef` 비대칭 해소, `aria-controls`·`aria-hidden` 보강, i18n 경로, 테두리 정책, easing 토큰
- **릴리스 운영** — npm trusted publishing + changesets/action으로 자동화. 근거는 [배포 자동화 결정](decisions/2026-09-06-release-automation.md)
- **A5 완료** — Tabs에 이어 Skeleton·Avatar·Separator·Collapsible·Accordion 추가. Accordion duplicate value ID P1 수정과 독립 재QA까지 완료
