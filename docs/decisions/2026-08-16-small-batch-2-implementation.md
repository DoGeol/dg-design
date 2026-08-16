# 소형 묶음 2 구현 중 결정 (NotificationBadge·HoverCard)

- 날짜: 2026-08-16
- 스펙: [소형 묶음 2](../specs/archive/2026-08-16-small-batch-2.md)
- 상태: 활성

스펙이 위임한 값과 구현 중 판단. 병렬 에이전트 4개(컴포넌트 2·스토리·기능 테스트)가 각자 결정하고 감독이 수거·검증했다. 결정 요청(에스컬레이션)은 0건.

## NotificationBadge

- **치수**: dot 6px 하드코딩(토큰 스케일 밖 — Badge 1px 테두리와 같은 관례). pill은 min-width·height `x4_5`(18px, seed와 일치·스케일 안), padding-inline `x1`, 타이포 t1 bold
- **CSS 단층 구조**: Badge의 intent 로컬 변수 2층을 안 따르고 intent 클래스에서 색 직접 지정 — solid 하나뿐이라 variant 조합이 없어 인다이렉션이 불필요한 추상화
- **shape 비노출**: dot/pill은 count 유무로 내부 계산 — 스펙 prop 목록과 "size 축 없음"에 일치
- **children Omit**: count가 항상 라벨을 계산하므로 children이 조용히 버려지는 상황을 타입에서 차단

## HoverCard

- **스케줄 훅 복제**: `use-tooltip-schedule` → `use-hover-card-schedule` 복제·개조(원본 미수정). Provider 그룹 로직 제거, 대신 콘텐츠 진입 시 대기 중 닫힘만 취소하는 `cancelClose` 신설 — Tooltip엔 없는 개념(비인터랙티브 전제였으므로)
- **use-overlay 부분 재사용**: 전체 대신 `use-overlay-position`(위치+arrow, hover 무관 일반 훅)만 사용. 상태·presence·portal 배선은 Tooltip 구조를 본떠 직접 작성 — 클릭 토글·바깥클릭 닫힘은 hover 시맨틱과 불일치
- **ESC는 dialog-stack 비모달 등록**(modal:false) — 스펙의 우선 검토 권고대로. Tooltip식 자체 리스너 아님
- **Trigger 기본 엘리먼트 `<a>`**: 전형 용례(링크 위 리치 프리뷰)와 "트리거가 다른 경로로도 도달 가능"이라는 접근성 전제가 링크를 가리킴. Radix 관례 일치, asChild로 교체 가능
- **placement 기본 bottom**: 리치 프리뷰는 아래 전개가 흔함(Radix 기본값 동일). Tooltip의 top과 다름
- **role·aria-describedby 미부여**: 인터랙티브 가능 콘텐츠라 tooltip role 부적합, Popover의 group도 강제 안 함 — 필요 시 소비자 지정

## 스토리·테스트

- **스토리 id 규약 실증**: 기존 index.json에서 PascalCase 제목이 하이픈 없이 소문자화됨을 확인(`hovercard--functional-demo`, `notificationbadge--state-matrix`) — 병렬 태스크 간 규약이 실제로 맞물림
- **HoverCard 데모는 `defaultOpen`**: VR(로드 즉시 arrow 포함 캡처)과 Playwright 실 hover 검증을 한 스토리가 겸함 — 초기 열림이어도 mouseleave/ESC 실동작 검증에 지장 없음
- **'유지' 증명의 고정 대기**: 폴링은 "안 닫혔다"를 증명 못 해(이미 참인 단언은 즉시 통과) closeDelay 2배(600ms) 고정 대기를 그 지점에만 예외 허용
- **ESC 후 트리거 포커스 복귀 단언 없음**: HoverCard는 포커스를 안 뺏으므로 복귀 패턴 자체가 부적용 — 포커스 무이동은 vitest 몫
- **jest-dom 부재**: 이 레포는 @testing-library/jest-dom 미연결 — 순수 DOM 단언(classList·textContent)만 사용(기존 테스트와 동일)

## 감독 판정

- barrel 2줄·changeset은 감독 직결(규칙대로), 에이전트 소유 범위 이탈 0건
- VR 신규 기준 2종(notificationbadge--state-matrix·hovercard--functional-demo)은 CI visual-baseline 워크플로 수동 트리거로 생성 — 로컬 스킵 실측 확인
