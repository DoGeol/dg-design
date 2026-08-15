# Select 구현 중 결정

- 날짜: 2026-08-16
- 스펙: [specs/archive/2026-08-16-select.md](../specs/archive/2026-08-16-select.md)
- 실행: Workflow 병렬 3태스크 (Select opus·high / 기능 테스트 sonnet·high / changeset haiku·low) + 감독 수정 1건

## 감독 판정

**D1. 라벨 역참조를 스캔 단독 → 스캔+마운트 등록 하이브리드로 보강 (감독 직접 수정)** — 에이전트는 children 엘리먼트 스캔을 택하고 "사용자 컴포넌트로 감싸면 안 보임"을 한계로 문서화했는데, **자기 스토리에서 그 한계를 바로 밟았다**(`<DemoOptions/>` 래핑 → 선택해도 트리거가 placeholder). 작성자가 즉시 밟는 지뢰는 소비자도 밟는다고 판정. Option이 마운트 시 context에 라벨을 등록하는 **스티키 캐시**(해제 없음 — 닫히면 unmount라 그때 지우면 라벨이 다시 사라짐, value→라벨 표라 stale 무해)를 추가. 스캔은 닫힌 초기 라벨·typeahead 폴백으로 유지. 기능 테스트 2건 실패 → 13/13 회복.

**D2. decisionRequests 2건 수용** — (1) useControllableState의 `value !== undefined` controlled 판정: `value={undefined}` 시작이 첫 선택까지 uncontrolled로 동작. Radix도 동일한 생태 관례, 훅 수정 시 Dialog·DropdownMenu 회귀 범위가 더 커서 수용. (2) combobox 트리거의 스크린리더 낭독 순서는 수동 확인 대상으로 기록.

## 위임돼 구현 중 정해진 값 (ownDecisions)

**공유 로직 대개편**
- 3개 훅만이 아니라 **오버레이 Root 배선 전체를 `internal/use-overlay.ts`로 추출** — 상태·presence·portal·floating·단일열림·비모달 스택·바깥클릭·복귀까지. 차이는 `onOpenFocus` 콜백 하나. DropdownMenu.tsx 285→201줄
- roving을 `internal/roving-focus.ts`로 이동, role 인자화. `focusItem`에 `scrollIntoView({block:"nearest"})` — DropdownMenu에도 소급(스크롤 패널 공통 버그)
- 단일 열림 레지스트리를 팝오버 공용 승격 — Select↔메뉴 교차 닫힘

**Select 고유**
- 키 분기: 닫힌 상태 Trigger가, 열린 상태 Content가 물리적으로 분담. Trigger에서 Enter·Space는 **미처리**(네이티브 click이 토글 — keydown으로 열면 이어지는 click이 도로 닫아 먹통). 화살표만 preventDefault+열기. 문자 키(Space 제외)만 닫힌 값 변경
- 열린 Space는 typeahead 버퍼 있을 때만 문자("New York" 대응), 비었으면 선택
- typeahead 순환: 1글자 = 다음부터(연타 순환), 이어치기 = 현재부터 (네이티브·Radix)
- Trigger는 `.dds-text-field` 클래스 재사용 불가 — CSS `:read-only`가 `<button>`에도 매칭돼 readonly 배경이 잘못 걸림. 토큰값 1:1 복제
- 선택 체크마크는 항상 렌더 + opacity 토글 — 조건부 렌더면 라벨이 좌우로 흔들림
- Field 소비는 Trigger가 아니라 Root — htmlFor→버튼 활성화로 라벨 클릭이 열기까지 전달(네이티브 동형)
- matchTriggerWidth: size 미들웨어로 min-width만 (긴 옵션은 패널 확장)
- 테스트: `vi.useFakeTimers({ shouldAdvanceTime: true })` 필수 — 없으면 user-event가 가짜 시계에 갇혀 타임아웃

## 위험 결과

- 공유 추출 회귀 — 없음: 추출 직후 기존 48건 선확인, 최종 74/74
- typeahead·화살표 경합 — Trigger/Content 물리 분담으로 해소
- **라벨 역참조 — 실제로 터짐**(스펙이 예고한 위험): D1로 해소, 기능 테스트가 회귀망

## 검증 요약

vitest 74/74(신규 26) · 기능 테스트 13/13(dialog 5·dropdown 4·select 4) · typecheck·build·publint 그린. 감독 실브라우저: 열림 시 첫 옵션 포커스·aria-selected 정확·D1 수정 후 트리거 라벨 반영 실측. VR에 select 스토리 2건 자동 편입 — 기준은 워크플로 대기.
