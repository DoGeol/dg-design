# Tooltip·Popover 구현 중 결정

- 날짜: 2026-08-16
- 스펙: [specs/archive/2026-08-16-tooltip-popover.md](../specs/archive/2026-08-16-tooltip-popover.md)
- 실행: Workflow 병렬 4태스크 (Tooltip sonnet·high / Popover sonnet / 기능 sonnet·high / changeset haiku·low)

## 감독 판정

**D1. Popover 에이전트의 소유 범위 초과 수용** — `internal/use-overlay`·`use-overlay-position`을 옵션화(closeOnEscape/closeOnOutsideClick 기본 true, arrowNode 기본 null)했다. 스펙 요구(닫힘 prop·arrow)가 코어 확장 없이는 "그대로 재사용"이 불가능했고, 기본값 유지로 DropdownMenu·Select 무회귀(121/121)를 에이전트가 선증명. 교차 검증에서도 회귀 0 — 수용. Tooltip 에이전트는 같은 파일을 "공용이라 불가" 판단으로 자기 파일을 팠고 서로 다른 파일이라 충돌 없음 — 병렬 소유 규칙이 의도대로 경합을 막았다

**D2. 기능 테스트 Tab 레이스 수정 (감독)** — 헤드리스 새 페이지의 첫 Tab이 문서 포커스를 못 받는 복불복(Select 때와 동일 "inactive" 패턴). Tab 역학 대신 `focus()/blur()` 직접 호출로 교체 — 검증 대상은 "포커스가 열고 blur가 닫는다"다. 3연속 그린

## 위임돼 구현 중 정해진 값 (ownDecisions)

**Tooltip**
- 지연: openDelay 700ms·closeDelay 150ms·Provider skipDelayDuration 300ms(닫힌 직후 유예), 전부 prop 오버라이드
- 그룹 스킵은 Provider 안 **useRef 명령형 신호** — state면 하나 열릴 때마다 형제 전체 리렌더
- hover·focus 모두 scheduleOpen(지연 경유), mouseleave는 closeDelay, **blur·ESC는 즉시 닫힘**
- use-overlay 미재사용 — 자체 훅 2개(use-tooltip-position·use-tooltip-schedule), presence만 dialog에서 재사용. 스택 미등록(스펙 명시)
- aria-describedby는 열려 있을 때만(Radix 관례), arrow는 Content 내장 회전 사각형 + dataset.side 노출
- 시각: bg-neutral-solid + fg-neutral-contrast, t2, radius r1_5

**Popover**
- arrow는 boolean prop이 아니라 **Popover.Arrow 합성 컴포넌트**(Radix 관례) — 미들웨어가 실제 DOM ref를 요구
- Content role="group", placement 기본 "bottom"(메뉴의 bottom-start와 다름 — 중앙 정렬이 자유 콘텐츠에 자연), 패딩 x4(Dialog x6와 메뉴 x1 사이)
- **max-height·내부 스크롤 없음** — arrow가 Content 안에 있어 스크롤 클리핑에 잘린다. Radix도 동일. 필요 시 소비자 래퍼
- autoFocus 기본 true(Content 포커스+복귀 — 포커스가 안일 때만 복귀)

## 위험 결과

- 탭 포커스 열림(표준 이탈) — 구현·문서화됨, 실브라우저 focus 케이스 통과
- hover 지연 CI 플레이크 — 로케이터 대기 설계로 hover 케이스는 무사, Tab 케이스만 D2로 수정
- use-overlay 부분 재사용 경계 — Tooltip 복제/Popover 확장으로 갈렸고 둘 다 정당한 근거 기록

## 검증 요약

vitest 121/121(tooltip 12·popover 12 신규) · 기능 19/19(신규 4, 실 hover 지연 포함) 3연속 · typecheck 3/3 · build·publint 그린 · css 토큰 교차 OK. VR에 신규 스토리 4건(tooltip·popover × 2) 자동 편입 — 기준은 워크플로 대기.
