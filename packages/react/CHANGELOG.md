# @dg-design/react

## 0.6.0

### Minor Changes

- f5382b9: DropdownMenu 비모달 오버레이 화합물 컴포넌트와 @floating-ui 위치 시스템입니다.
  
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

## 0.5.0

### Minor Changes

- 70169a4: Dialog 화합물 컴포넌트와 자체 구현 오버레이 시스템입니다.
  
  **Dialog 화합물 컴포넌트 7종:**
  - 구조: `<Dialog.Root>` 상태·context 래퍼 → `Dialog.Trigger` 열기 버튼 → `Dialog.Overlay` 배경 → `Dialog.Content` 다이얼로그 박스 → `Dialog.Title` aria-labelledby 연결 → `Dialog.Description` aria-describedby 연결 → `Dialog.Close` 닫기 버튼
  - Barrel export: `Dialog` 하나만 공개 (`Dialog.Root`, `Dialog.Trigger`, 등)
  - 상태 모드: `open`+`onOpenChange` 제어형, `defaultOpen` 비제어형 겸용 (useControllableState 훅)
  - 포커스 관리: 열림 시 Content 기본 포커스(tabIndex=-1), `initialFocusRef` prop으로 오버라이드 가능. 닫힘 시 열기 전 요소로 복귀
  - Dismissal: ESC 키 닫힘(기본), `closeOnEscapeKeyDown` prop으로 끄기 가능. 오버레이 클릭 닫힘(기본), `closeOnBackdropClick` prop으로 끄기 가능
  - 중첩 스택: 싱글턴 모듈 레벨 스택으로 관리. ESC 또는 Overlay 클릭은 최상단 다이얼로그만 닫음. 스크롤 잠금은 refcount(첫 열림 시 잠금, 마지막 닫힘 시 해제)
  - Focus trap: 배경 inert 속성. 열림 시 스택상 이전 다이얼로그들에 `inert` 부여, 닫힘 시 복원. Tab 순환 코드 없음
  - Portal: React.createPortal로 body 직속 렌더
  
  **애니메이션:**
  - 열림/닫힘 모두 애니메이션 재생: fade(opacity) + scale(transform) 조합
  - CSS 애니메이션만 사용(Web Animations API 미사용)
  - 퇴장 애니메이션: animationend/transitionend 이벤트 대기 → unmount, 안전 타임아웃 폴백(500ms)
  - `prefers-reduced-motion: reduce` 감지 시 애니메이션 제거, 즉시 표시/숨김
  
  **Accessibility:**
  - Content: `role="dialog"` `aria-modal="true"` 자동 부여
  - Title/Description: 렌더된 것만 자동 id 생성 및 Content의 `aria-labelledby`/`aria-describedby` 연결
  - aria-describedby: Field 패턴처럼 Set으로 관리(실제 마운트된 것만 포함)
  
  **CSS & 토큰:**
  - `@layer dds` · `.dds-dialog--root` 클래스
  - Overlay: `bg-overlay` 토큰 사용
  - Content: `shadow-overlay` + `bg-layer-default` 토큰 사용
  - 애니메이션: duration은 `duration-fast`(열림) · `duration-base`(닫힘), easing은 `ease-out-cubic`
  
  **react-dom peer 전환:**
  - `peerDependencies.react-dom`의 `optional: true` 제거 (Dialog의 createPortal 필수)
  - peerDependenciesMeta 필드 자체는 유지되나 react-dom은 선택 사항 아님
  
  **테스트 및 VR:**
  - vitest: 스택 push/pop, ESC 라우팅, presence 타임아웃, controlled/uncontrolled 상태, aria 연결, inert 속성
  - Playwright 기능 테스트: 열기→ESC→포커스 복귀, 중첩 ESC 최상단만, 오버레이 클릭, inert 실효
  - VR: 열림 고정 스토리 추가 (라이트·다크, 동적 열거 자동 편입)
  
  **구현 파일:**
  - `packages/react/src/dialog/` — use-dialog.ts(헤드리스 훅), use-presence.ts(퇴장 presence), dialog-stack.ts(싱글턴 스택), Dialog.tsx(컴포넌트 껍데기)
  - `packages/react/src/internal/merge-refs.ts` 재사용
  - 기존 Field 패턴(compound, context, aria 연결) 참고·재사용

## 0.4.0

### Minor Changes

- 2e15a5a: Field 화합물 컴포넌트와 TextField를 추가했습니다. Form 필드의 라벨·설명·에러 메시지를 선언형으로 연결하고, stroke 축의 첫 소비자(error 테두리)로 error 상태를 지원합니다.
  
  **Field 화합물(복합) 컴포넌트:**
  - 구조: `<Field.Root>` 래퍼 → context에서 id·invalid 전파
    - `Field.Label` — htmlFor 자동 연결
    - `Field.Description` — aria-describedby 연결, 보조 텍스트
    - `Field.ErrorMessage` — aria-describedby 연결, 에러 시 렌더. `fg-critical` 색상 적용, aria-live="polite" role="status"
  - Barrel export: `Field` 하나만 공개, 내부 컴포넌트는 조합 전용
  - 테스트: Label 클릭 시 TextField 포커스, aria-describedby 자동 구성, ErrorMessage 존재 시 aria-invalid 반영
  
  **TextField 컴포넌트:**
  - 한 줄 `<input>` 전용 — textarea/multiline 없음
  - Field 통합: context 활용 시 id·invalid·describedby 자동 연결. **단독 사용도 동작** — useId로 자체 id 생성
  - 상태 축: 5종
    - 기본 테두리 `stroke-neutral` + placeholder `fg-disabled` 계열
    - hover: 테두리 강조(스타일 위임)
    - focus: `:focus-visible` 표준 관행(outline)
    - invalid: `stroke-critical` 테두리(ErrorMessage 존재 시 자동)
    - disabled: `:is(:disabled,[disabled],[data-disabled])` 3중 매칭 + `bg-disabled`/`fg-disabled` 토큰, 테두리 무광
    - readonly: `bg-neutral-weak` 계열 배경 적용(입력 불가 시각 분리)
  - size 축: medium(기본) · large — 폼 컨트롤 축 통일
  - 미포함: prefix/suffix 슬롯, asChild, intent 축
  
  **구현 세부:**
  - CSS: `@layer dds` · `.dds-text-field--size_medium` 클래스 · CVA + 수기 CSS (Checkbox·Switch 관습 동형)
  - 호버 스타일 구현 (스펙 위임 항목): border-color 강조 — neutral-700(light) / neutral-300(dark)
  - focus 상태 구현 (스펙 위임 항목): `:focus-visible` outline 표준 관행 (테두리 전환은 미사용)
  - readonly 구분 스타일 구현 (스펙 위임 항목): `bg-neutral-weak` 배경으로 시각적 비활성화 표시
  
  **테스트:**
  - Field 통합: Label 클릭 포커스, aria-describedby 포함성, ErrorMessage aria-invalid 연동
  - TextField 단독: 자체 id 생성·유지, input 입력·변경 동작
  - 기존 관습: user-event 사용(fireEvent 금지), vitest + jsdom

## 0.3.0

### Minor Changes

- bd9ddbf: Checkbox와 Switch 폼 컨트롤 2개를 추가했습니다. stroke 축의 첫 소비자이며, vitest 테스트 인프라도 동시 도입합니다.
  
  **Checkbox 컴포넌트:**
  - 구조: `<label class="dds-checkbox">` 래핑 + 숨긴 네이티브 `input[type=checkbox]` + 시각 박스 + children이 라벨 텍스트
  - checked 시각: `bg-brand-solid`(+hover/pressed 쌍) 재사용, 체크마크는 인라인 SVG(`fg-brand-contrast`)
  - unchecked: 테두리 `stroke-neutral`, hover 시 박스에 `bg-transparent-hover` 적용
  - indeterminate prop(boolean) — DOM 프로퍼티로 설정, 시각은 가로줄. ref+effect로 구현
  - disabled: `:disabled, [disabled], [data-disabled]` 3중 매칭 + `bg-disabled`/`fg-disabled`/`stroke` 무광
  - focus-visible: 기존 관습(박스에 outline) 적용
  - intent 축 없음 — brand 고정(색 토큰 신규 추가 0개)
  
  **Switch 컴포넌트:**
  - 구조: label 래핑 Checkbox와 동일, `input[type=checkbox] role="switch"`
  - 트랙+썸: CSS만 구현. checked 트랙 `bg-brand-solid`(+상태쌍), unchecked 트랙은 `bg-neutral-weak` 등 기존 neutral 계열 토큰 사용
  - 썸 이동 transition + `prefers-reduced-motion: reduce`에서 제거
  - 새 색 토큰 금지 — 기존 semantic + 신설 stroke 2개 안에서 해결
  - disabled/focus-visible: Checkbox 규칙 동일
  
  **공통:**
  - size 축: `medium`(기본) · `large` 2단. 두 컴포넌트 이름 축 통일.
  - CVA + `@layer dds` + `.dds-checkbox--size_medium` · `.dds-switch--size_medium` 클래스 관습(Button·Badge와 동형)
  - 클릭 타깃·a11y 연결: 네이티브에 위임. label htmlFor 수작업 불필요.
  - asChild 없음 — label 래핑 구조와 충돌
  
  **테스트 인프라:**
  - vitest + jsdom + @testing-library/react 최소 구성 도입
  - 최소 케이스: Checkbox 토글·label 클릭 연동·indeterminate DOM 프로퍼티 반영·disabled 무반응, Switch role=switch·토글
  - `pnpm --filter @dg-design/react run test` 스크립트 추가
  - CI에 test 단계 추가 (build 뒤 typecheck 앞)
  - indeterminate ref 로직 등장 → AGENTS.md "로직 컴포넌트 등장" 트리거 성립 기록
  
  **삭제 및 미포함:**
  - intent 축 — 수요 확인 전 선투자 금지. brand 고정으로 충분
  - RadioGroup — 다음 릴리스 후보. Checkbox 관습 확립이 먼저
  - 헤드리스 훅 분리 — ref 몇 줄에 과함. Dialog급 로직에서 첫 적용
  - indeterminate 폼 제출 값 처리 — 네이티브 동작(unchecked 취급) 그대로

## 0.2.0

### Minor Changes

- a2fd2ed: Badge 컴포넌트를 추가했습니다. Intent 축의 첫 소비자로 6종 intent × 2 variant × 2 size 조합을 지원합니다.
  
  **컴포넌트 축:**
  - `intent`: brand · neutral · critical · positive · warning · informative (6종)
  - `variant`: solid · weak (2종)
  - `size`: medium · large (2종)
  - 기본값: neutral · weak · medium
  
  **주요 기능:**
  - `asChild` prop — `@radix-ui/react-slot`으로 `<a>` 등 임의 엘리먼트에 스타일 위임
  - `truncate` prop(boolean, 기본 false) — true면 label에 `max-width: 100%; overflow: hidden; text-overflow: ellipsis` 적용
  
  **구현:**
  - CSS: `@layer dds` · `.dds-badge--intent_*` 클래스 · CVA + 수기 CSS
  - `@radix-ui/react-slot` 의존성 추가 (주간 1.78억 DL, 최신 유지)
  - 비인터랙티브 — hover/pressed/disabled/focus 규칙 없음

### Patch Changes

- e0f365f: 패키지 메타데이터를 보강했습니다. MIT 라이선스를 명시하고 LICENSE 파일을 배포 아카이브에 포함하며, repository·homepage·bugs·description·keywords 필드를 추가해 npm 페이지에서 저장소로 이동할 수 있게 했습니다. 코드 동작 변화는 없습니다.
- 841d3c8: exports의 `"import"` 조건을 `"default"`로 바꿔 CJS 도구(Jest 등)에서 `ERR_PACKAGE_PATH_NOT_EXPORTED`로 해석이 막히던 문제를 고쳤습니다. react-dom은 현재 어떤 컴포넌트도 사용하지 않아 `peerDependenciesMeta`로 optional 표시했습니다.

## 0.1.0

### Minor Changes

- 5af25d5: 0.1.0 첫 릴리스 — 토큰 파이프라인(OKLCH 파생 팔레트 + WCAG 대비 검증 + Tailwind v4 브릿지)과 Button 컴포넌트를 공개한다.
