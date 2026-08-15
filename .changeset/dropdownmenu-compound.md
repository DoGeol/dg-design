---
"@dg-design/react": minor
---

DropdownMenu 비모달 오버레이 화합물 컴포넌트와 @floating-ui 위치 시스템입니다.

**DropdownMenu 화합물 컴포넌트 6종:**
- 구조: `<DropdownMenu.Root>` 상태·context 래퍼 → `DropdownMenu.Trigger` 열기 버튼 (asChild) → `DropdownMenu.Content` 오버레이 패널 → `DropdownMenu.Item` 액션 항목 → `DropdownMenu.Separator` 분리선 → `DropdownMenu.Label` 섹션 라벨
- Barrel export: `DropdownMenu` 하나만 공개 (`DropdownMenu.Root`, `DropdownMenu.Trigger`, 등)
- 상태 모드: `open`+`onOpenChange` 제어형, `defaultOpen` 비제어형 겸용 (useControllableState 훅)
- Role: Content `role="menu"`, Item `role="menuitem"`. Item disabled 지원 (`:is(:disabled,[disabled],[data-disabled])` 3중 매칭)

**Floating 위치 계산:**
- @floating-ui/dom 의존성 추가 (minimumReleaseAge 3일 게이트, 성숙 버전 하한)
- placement 기본값: `bottom-start` (Trigger 기준), prop으로 오버라이드 가능
- 미들웨어: flip (화면 경계 회피), shift (스크롤 포함 정렬)
- autoUpdate 활성화: viewport scroll·window resize 추적

**키보드 내비게이션 & 포커스:**
- Roving tabindex: 화살표 상/하 순환, Home/End로 처음/끝, disabled 항목 자동 건너뜀
- Enter/Space: 현재 항목 선택, ESC: 메뉴 닫힘 (Dialog 스택 라우팅 공유)
- 타이핑 검색(typeahead) 미포함
- 열림 시 첫 항목 포커스(또는 Content 자체 — APG 관례 판단 구현 시), 닫힘 시 Trigger 복귀

**Dismissal & 단일 열림:**
- 외부 클릭 닫힘 (진정한 outside 판정, Trigger 재클릭 토글)
- 항목 선택(onSelect 콜백 호출) 시 자동 닫힘
- 단일 열림 정책: 모듈 레벨로 다른 메뉴가 열리면 기존 메뉴 닫힘
- ESC는 Dialog 스택 라우팅 공유 (최상단만 닫힘)

**비모달 오버레이:**
- 배경 `inert` 속성 미부여 (Dialog와 달리 배경 비활성화 없음)
- 스크롤 잠금 없음 (body overflow 수정 안 함)
- Dialog 스택에 `modal` 플래그 추가: 비모달 엔트리는 ESC 라우팅만 참여, inert·잠금은 모달 엔트리만 계산
- 기존 Dialog 테스트 회귀 필수 (33건)

**Portal & 애니메이션:**
- Dialog의 portal 컨테이너 패턴 재사용 (body 직속 자기 div)
- Portal `role="menu"` 직접 삽입 (Dialog Overlay 문법 미사용)
- 포커스 trap: 비모달이므로 inert 없음, Tab 순환도 코드 없음 (Content roving tabindex만 관리)
- Presence: use-presence 재사용 (computed CSS duration 읽기)
- 애니메이션: fade (opacity) + scale (0.96→1, 수직 2%) 조합, duration-fast (150ms), easing-out, `prefers-reduced-motion: reduce` 즉시 표시

**CSS & 토큰:**
- `@layer dds` · `.dds-dropdownmenu--root` 클래스
- Content: `bg-layer-default` + `shadow-overlay` 토큰
- Item hover/highlight: `bg-transparent-hover` 계열 (치수·색 위임)
- Separator: 구분선 (색·높이 토큰)
- radius: r4 (기존 dimension 토큰)

**테스트 및 VR:**
- vitest: 열림/닫힘, roving tabindex 이동·순환, disabled 건너뜀, 단일 열림(둘째 메뉴 열면 첫째 닫힘), 항목 선택 닫힘, aria role, controlled/uncontrolled 상태, 기존 Dialog 33건 회귀
- Playwright 기능: 열기→화살표 이동→Enter 선택, ESC 닫힘+Trigger 포커스 복귀, 외부 클릭, Dialog 안 메뉴에서 ESC가 메뉴만 닫힘 (비모달 검증)
- VR: 열림 고정 스토리 추가 (라이트·다크, 동적 열거 자동 편입, 기준은 visual-baseline 워크플로)

**구현 파일:**
- `packages/react/src/dropdown-menu/` — 패키지 구조 Dialog 동일
  - use-dropdown-menu.ts (헤드리스 훅)
  - use-single-open.ts (메뉴 전용 단일 열림)
  - floating-menu.ts (위치 계산 모듈)
  - DropdownMenu.tsx (컴포넌트 껍데기)
- `packages/react/src/internal/` — dialog-stack.ts에 modal 플래그 추가 (기존 동작 불변 필수)
- Dialog 패턴 재사용: use-presence, useControllableState, portal 컨테이너

**주의:**
- tokens.css에 새 토큰 추가 없음 (기존 토큰 재사용)
- react-dom peer 미변경 (Dialog에서 이미 required)
