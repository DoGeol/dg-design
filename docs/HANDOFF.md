# HANDOFF — 다음 세션 인계

갱신: 2026-08-15. 이 문서는 다음 작업 착수용 임시 인계서다 — 착수하면 해당 절을 지우고, 전부 끝나면 파일을 삭제한다.

## 현재 상태

- main 그린, 컴포넌트 5개(Button·Badge·Checkbox·Switch·TextField·Field), 0.4.0 버전 확정
- 인프라: typecheck·vitest(user-event)·Playwright 시각 회귀(기준 이미지 10장, CI 실비교 통과)·공급망 게이트·catalog·TS 6.0.3

## 1. npm publish 2건 (사용자 직접)

0.3.0·0.4.0이 버전 확정만 되고 미배포. npm은 0.2.0까지만 올라가 있다.

```bash
npm login
```

```bash
pnpm changeset publish
```

publish 후 태그 푸시는 에이전트에게 요청 (`git push origin --tags`). 배포 직후 npm 404는 레플리카 전파 지연 — 재publish 403이면 성공.

## 2. Dialog 구현 (스펙·분해 승인 완료, 실행 직전 정지)

- 스펙: [specs/2026-08-15-dialog.md](specs/2026-08-15-dialog.md) — 승인됨, 합격 조건 18건, 모호도 10%(deep)
- 재개 방법: `/implement-spec docs/specs/2026-08-15-dialog.md` — 아래 분해표가 승인된 상태였다

| # | 태스크 | 소유 범위 | 모델·추론 |
|---|--------|-----------|-----------|
| 1 | 토큰 — bg-overlay·shadow-overlay·모션(duration 2단+easing). 그림자·모션은 첫 카테고리라 generate.ts 방출 확장 가능성 | `packages/tokens` | sonnet·high |
| 2 | Dialog 전체 — 훅 4종(presence·스택·inert·controllable)+compound 7종+CSS 애니메이션+vitest+**Switch·Checkbox 150ms→duration-fast 소급 교체**+스토리 | `packages/react` + `apps/storybook` | opus·high |
| 3 | Playwright 기능 테스트 3~5케이스 (ESC 라우팅·포커스 복귀·inert 실효). 스토리 부재 시 스킵 가드 | `apps/visual-regression` | sonnet·high |
| 4 | changeset 2건 (0.5.0) | `.changeset` | haiku·low |

- 웨이브 1 병렬 4개. 스토리 id 규약(2·3번 공유): `dialog--functional-demo`(Trigger 포함 기본)·`dialog--nested-demo`(중첩)
- 웨이브 2 감독: 통합 파이프라인 + 기능 테스트 실행(플랫폼 무관, 로컬 가능) + Storybook 실측 → 커밋 승인 → 푸시 → visual-baseline 워크플로 트리거(Dialog 기준 추가 + Switch 토큰 교체 무변화 diff 확인 — 실값 150ms 유지해야 diff 안 남)

## 참고

- 관습·명령: [AGENTS.md](../AGENTS.md) / 문서 색인: [INDEX.md](INDEX.md)
- Dialog 이후 로드맵: NotificationBadge·TextArea·Icon(+TextField prefix/suffix)·RadioGroup 등 보류 목록이 각 스펙의 "하지 않을 것"에 있다
