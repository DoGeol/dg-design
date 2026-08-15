# HANDOFF — 다음 세션 인계

갱신: 2026-08-15. 이 문서는 다음 작업 착수용 임시 인계서다 — 착수하면 해당 절을 지우고, 전부 끝나면 파일을 삭제한다.

## 현재 상태

- main 그린, 컴포넌트 6개(+Dialog), 0.5.0 changeset 대기
- 인프라: typecheck·vitest(user-event)·Playwright 시각 회귀(기준 이미지 10장, CI 실비교 통과)·공급망 게이트·catalog·TS 6.0.3

## 1. npm publish 2건 (사용자 직접)

0.3.0·0.4.0이 버전 확정만 되고 미배포(npm은 0.2.0까지). 0.5.0은 changeset 상태 — 배포 전 `pnpm changeset version` 선행.

```bash
npm login
```

```bash
pnpm changeset publish
```

publish 후 태그 푸시는 에이전트에게 요청 (`git push origin --tags`). 배포 직후 npm 404는 레플리카 전파 지연 — 재publish 403이면 성공.

## 참고

- 관습·명령: [AGENTS.md](../AGENTS.md) / 문서 색인: [INDEX.md](INDEX.md)
- Dialog 이후 로드맵: NotificationBadge·TextArea·Icon(+TextField prefix/suffix)·RadioGroup 등 보류 목록이 각 스펙의 "하지 않을 것"에 있다
