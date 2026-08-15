---
"@dg-design/react": minor
---

Select 폼 단일 선택 오버레이 화합물 컴포넌트와 typeahead 네비게이션입니다.

**Select 화합물 컴포넌트 6종:**
- 구조: `<Select.Root>` 상태·context 래퍼 → `Select.Trigger` 선택 버튼 (TextField 동형 외관) → `Select.Content` 오버레이 패널 → `Select.Option` 선택지 → `Select.Group` 섹션 그룹 → `Select.Label` 그룹 라벨
- Barrel export: `Select` 하나만 공개 (`Select.Root`, `Select.Trigger`, 등)
- 상태 모드: `value`+`onValueChange` 제어형, `defaultValue` 비제어형 겸용 (useControllableState 훅)
- Role: Content `role="listbox"`, Option `role="option"` + `aria-selected` (DropdownMenu roving 재사용, role만 변경)

**Trigger 외관:**
- TextField 동형: `stroke-neutral` 테두리, size medium/large 지원, placeholder 회색 표시 (value 없을 때)
- disabled 3중 매칭 (`:is(:disabled,[disabled],[data-disabled])`)
- invalid: Field context 소비 → `stroke-critical` 테두리 + `aria-invalid` (TextField 패턴 동일)
- 오른쪽 caret 인라인 SVG (열림 시 회전 위임)
- aria-expanded, aria-haspopup="listbox" 속성

**Roving 포커스 & Typeahead:**
- Roving tabindex: 화살표 상/하 순환, Home/End로 처음/끝, disabled 항목 자동 건너뜀 (DropdownMenu 로직 재사용)
- 열릴 때: 선택된 옵션에 포커스 + scrollIntoView, 없으면 첫 옵션
- 닫힌 상태 화살표·Enter·Space = 열기만 (값 변경 없음)
- Typeahead (문자 버퍼 + 1초 타임아웃, 대소문자 무시 prefix 매치):
  - 열린 상태 = 포커스 이동 (화살표처럼)
  - 닫힌 상태 = 값 직접 변경 (네이티브 select 관례)
  - 문자 키만 값 변경, 화살표·Enter·Space는 "열기만" 정책과 별개

**Dismissal & 단일 열림:**
- 선택 시 onValueChange 호출 + 자동 닫힘 + Trigger 포커스 복귀
- 외부 클릭 닫힘 (진정한 outside 판정, Trigger 재클릭 토글)
- ESC는 Dialog 스택 라우팅 공유 (DropdownMenu 패턴)
- 단일 열림 정책: 다른 Select가 열리면 기존 Select 닫힘

**비모달 오버레이:**
- DropdownMenu 패턴 동일: inert 속성 미부여, 스크롤 잠금 없음
- Dialog 스택 modal 플래그 공유 (기존 비모달·모달 분리)
- 포커스 trap 없음 (비모달, Tab 순환 코드 없음)

**Floating 위치 계산:**
- @floating-ui/dom 재사용 (DropdownMenu와 동일)
- placement: `bottom-start` (기본값), prop으로 오버라이드 가능
- 미들웨어: flip·shift, offset 4
- autoUpdate 활성화
- 패널 min-width: Trigger 너비 이상 (size 미들웨어 위임)

**Portal & 애니메이션:**
- Dialog의 portal 컨테이너 패턴 재사용
- Presence: use-presence 재사용
- 애니메이션: fade + scale, duration-fast (150ms), easing-out, prefers-reduced-motion 대응

**폼 제출:**
- name prop 있으면 `<input type="hidden" name value>` 렌더
- 없으면 미렌더 (선택적)

**Field 연동:**
- Field.Label 클릭 → Trigger 포커스 (htmlFor는 button에도 유효)
- describedby·aria-invalid 자동 (Field context 소비)
- TextField 패턴 동일

**CSS & 토큰:**
- `@layer dds` · `.dds-select--root` 클래스
- Content: DropdownMenu와 동일 (bg-layer-default + shadow-overlay)
- Option: 최소 높이 x8·패딩 t4, 하이라이트 bg-transparent-hover
- Trigger: TextField 토큰 재사용
- 새 토큰 추가 없음

**테스트 및 VR:**
- vitest: value 상태(controlled/uncontrolled/defaultValue), 열림 시 선택 옵션 포커스, typeahead(열림·닫힘 양쪽, 타임아웃 fake timers), 닫힌 화살표=열기만, 선택 닫힘·복귀, hidden input(존재·값 반영), Field 연동(label 클릭·invalid), disabled 옵션 건너뜀, aria(combobox·listbox·option·selected), 기존 Dialog 33건·DropdownMenu 15건 무회귀
- Playwright 기능: 열기→화살표→Enter 선택 값 반영, typeahead 점프(열림·닫힘), 외부 클릭, Field label 클릭 포커스, Dialog 안 Select에서 ESC가 Select만 닫힘
- VR: 열림 고정 스토리 2건 (라이트·다크) — `select--functional-demo` (기본) + `select--with-field-demo` (Field 연동), 기준은 visual-baseline 워크플로 대기

**구현 파일:**
- `packages/react/src/select/` — 패키지 구조 DropdownMenu 동일
  - use-select.ts (헤드리스 훅, roving 재사용)
  - use-typeahead.ts (버퍼·타임아웃 로직)
  - floating-select.ts (위치 계산 모듈)
  - Select.tsx (컴포넌트 껍데기)
  - select.css (@layer dds, Trigger·Option·Content 스타일)
- roving 로직 재사용:
  - 기존 DropdownMenu roving 추출 검토 (공유 utility 추진 또는 복제 — 구현 판단)
  - Dialog·DropdownMenu 기존 테스트 회귀 확인

**주의:**
- tokens.css에 새 토큰 추가 없음 (TextField·DropdownMenu 토큰 재사용)
- roving-focus 등 공유 로직을 internal로 옮기면 DropdownMenu 경로 수정 필요 → 이동 시 기존 테스트 재실행 (회귀 보증)
- typeahead 닫힌 상태 값 변경과 "닫힌 화살표 열기만"의 공존: 키 이벤트 분기 명확히 (문자 키만 값 변경, 화살표·Enter·Space는 열기)
- Trigger 라벨이 Option children에서 오는데 value만 아는 상태에서 라벨 역참조 필요 → Radix식 ItemText 등록 또는 옵션 스캔 (구현 판단)
- react-dom peer 미변경 (DropdownMenu에서 이미 required)
