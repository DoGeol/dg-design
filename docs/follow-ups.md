# 후속 작업

0.9.0 검토(렌즈 6개 감사)에서 나온 30건 중 **30건 전부 처리됐다.**

근거 문서: [0.9.0 감사 결과](decisions/2026-08-17-feedback-batch-implementation.md) 및 각 구현 결정 기록.

## 남은 것

없음. 30건 전부 처리됐다. 새 항목은 여기에 "무엇이 정해져야 착수할 수 있는지"와 함께 적는다.

## 알아두면 첫 시도에서 안 틀리는 것

이번 세션에서 실측으로 확인된 것들 — 재현 경로와 근거는 `docs/decisions/`에 있다.

| 사실 | 영향 |
|------|------|
| jsdom은 `animationDuration`이 `auto`라 `use-presence`의 `exitDurationMs`가 **항상 0** | 오버레이 퇴장·재열림은 유닛 테스트로 검증 불가. `apps/visual-regression/tests/overlay-exit.spec.ts`가 그 구간을 담당한다 |
| `playwright.config`의 `use.reducedMotion`이 `matchMedia`에 **반영되지 않는다** | reduced-motion 검증은 테스트마다 `page.emulateMedia()`로 직접 걸어야 한다 |
| VR은 `*--state-matrix`를 우선 집는다 | 기능 테스트용 데모 스토리는 **닫힌 상태로** 둔다(열어두면 오버레이가 트리거를 덮어 클릭이 막힌다) |
| 퇴장 애니메이션 keyframes는 `internal/overlay-motion.css`에 공용으로 있다 | 새 오버레이는 값이 같으면 그것을 참조한다. 진짜 다른 모션만 자기 파일에 |

## 처리된 것

30건 중 30건. 큰 갈래만:

- **P1 6건** — 중첩 오버레이가 조상을 닫던 문제, controlled 리셋 미반영, Field 미연동 3종, z-index 부재, 보조 텍스트 AA 미달, CSS 트리셰이킹 차단
- **기능 공백** — Toast(+ live region 정책 신설) · Alert · Spinner · Progress · Button loading · Button critical intent
- **버그 6건** — 사라진 옵션 선택, RadioGroup 접근 이름, ContextMenu 포커스 소실, Tooltip 그룹 스킵, 닫히는 오버레이 inert, DropdownMenu ArrowUp
- **테스트 인프라** — Button 테스트 신설, 오버레이 퇴장·재열림 Playwright 커버리지
- **다듬기 8건** — keyframes 공용화, 닫힘 prop·`initialFocusRef` 비대칭 해소, `aria-controls`·`aria-hidden` 보강, i18n 경로, 테두리 정책, easing 토큰
- **C3 색 회귀** — 스크린샷 테스트에 색 텍스트 스냅샷(`*.txt`) 추가. 임계 없음이라 1값 차이도 잡히고 `-u`가 항상 갱신. 근거는 [배포 자동화 결정](decisions/2026-09-06-release-automation.md)의 후속 항목
- **릴리스 운영** — npm trusted publishing + changesets/action으로 자동화. 근거는 [배포 자동화 결정](decisions/2026-09-06-release-automation.md)
- **A5 완료** — Tabs에 이어 Skeleton·Avatar·Separator·Collapsible·Accordion 추가. Accordion duplicate value ID P1 수정과 독립 재QA까지 완료
