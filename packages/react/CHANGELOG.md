# @dg-design/react

## 0.11.0

### Minor Changes

- 068e925: 어드민 1차 컴포넌트 5종 — Table·Card·Tabs·Pagination·Breadcrumb
  
  5종 전체가 "로직은 소비자, DDS는 마크업·스타일·접근성"의 결이다.
  
  - `Table`: 스타일드 마크업 compound(가로 스크롤 래퍼 내장). 정렬·선택·필터는 소비자 몫(tanstack 등 자유)
  - `Card`: 단일 요소 컨테이너 + `asChild`. 내부 구조는 자유
  - `Tabs`: **automatic 활성화**(화살표 포커스 = 즉시 전환, APG tabs)·Home/End·roving. 비활성 패널은 hidden이라 폼 상태가 보존된다
  - `Pagination`: 마크업 조각(Root·List·Item·Link·Previous·Next·Ellipsis). `isActive` → `aria-current="page"`, `asChild`로 라우터 Link 연동. 생략 계산은 소비자 몫
  - `Breadcrumb`: nav 마크업 + `Page`(aria-current) + `Separator`(aria-hidden)
  
  신규 토큰 0. 서브패스 5개 추가(`@dg-design/react/tabs` 등).

## 0.10.0

### Minor Changes

- 3ec9ff0: 검토에서 나온 P1 6건 수정
  
  **버그 수정**
  
  - 중첩 오버레이가 조상을 닫던 문제 — `Popover` 안에서 `Select`·`DropdownMenu`를 열면 팝오버가 닫히며 자식까지 언마운트됐다. 단일 열림 싱글턴을 스택으로 바꾸고, 자손 패널 클릭을 바깥 클릭 판정에서 면제했다. 형제 단일 열림 계약은 그대로다
  - `Select`·`RadioGroup`의 controlled 값을 `undefined`로 되돌려도 UI가 따라오지 않던 문제 — 폼 리셋 시 옛 값을 계속 표시했다. controlled 판정을 값이 아니라 prop 존재로 바꿨다
  - `Checkbox`·`Switch`·`RadioGroup`이 `Field`와 연동되지 않던 문제 — 라벨 클릭이 컨트롤을 조작하지 못하고 `aria-invalid`·`aria-describedby`도 걸리지 않았다
  
  **토큰**
  
  - `--dds-z-overlay` 신설 — 오버레이가 전부 `z-index: auto`라 소비 앱의 sticky 헤더 밑에 깔렸다
  - `--dds-color-fg-neutral-weak` 신설 — `fg-disabled`가 비활성 컨트롤과 보조 텍스트를 겸해 `Field` 설명문·그룹 라벨이 WCAG AA에 미달(3.36:1)했다. 신규 토큰은 5.03:1(라이트)·5.61:1(다크)이고 대비 검사에도 추가됐다
  
  **패키징**
  
  - 컴포넌트별 서브패스 export 추가 — `@dg-design/react/button`처럼 딥임포트가 가능해져 CSS 트리셰이킹이 동작한다(Button만 쓸 때 41.4KB → 4.3KB). 기존 `@dg-design/react` 진입점은 그대로다
  
  **후속 (B1·B2)**
  
  - 목록에서 뺀 옵션이 `Select`의 닫힌 상태 typeahead로 선택되던 문제 — 옵션 등록 캐시가 소비자가 제거한 값을 계속 후보로 들고 있었다
  - `Field` 안 `RadioGroup`에 접근 이름이 없던 문제 — `FieldContext.labelId`를 추가하고 그룹이 `aria-labelledby`로 참조한다
  
  **Button (C2·A1·D1)**
  
  - `Button`에 `intent="critical"` 추가 — 삭제·탈퇴 같은 파괴적 액션 버튼을 만들 수 없었다. `critical`에 solid·weak의 hover/pressed 토큰 4종이 함께 신설됐다
  - `Button`에 `asChild` 추가 — 링크를 버튼 외관으로 렌더할 수 있다
  - `Button` 테스트 신설 — 컴포넌트 중 유일하게 테스트가 없었다
  
  **알림 묶음 (A2·A3·A4)**
  
  - `Toast` 추가 — `useToast()` 훅으로 띄우는 일시 알림. 모달 위에서도 보이고 조작된다
  - `Alert` 추가 — intent 6종 인라인 메시지. 신규 색 토큰 0
  - `Spinner`·`Progress` 추가, `Button`에 `loading` 추가
  - **live region 정책 신설** — critical intent는 `role="alert"`, 나머지는 `role="status"`. DDS에 live region이 하나도 없어 비동기 결과가 스크린리더에 전달되지 않던 문제
  - 토큰 `--dds-z-toast`·`--dds-duration-spin`·`--dds-easing-linear` 신설
  
  **버그 수정 (B3~B6)**
  
  - `ContextMenu`가 닫힐 때 포커스가 트리거로 돌아오지 않고 사라지던 문제
  - `Tooltip` Provider 그룹에서 다른 툴팁이 열려 있는데도 지연 생략이 풀리던 문제
  - `DropdownMenu` 트리거의 ArrowUp이 마지막 항목이 아니라 첫 항목으로 열리던 문제
  - 닫히는 오버레이가 퇴장 애니메이션 동안 `inert` 상태가 되던 문제
  
  **일관성·접근성 다듬기 (D2~D8)**
  
  - 값까지 같던 오버레이 keyframes를 공용으로 (`keyframes` 26 → 16개, 시각 변화 없음)
  - `closeOnEscape`·`closeOnOutsideClick`을 `DropdownMenu`·`Select`·`MultiSelect`에도 노출(기본값 동일 — 동작 무변경)
  - `Popover`에 `initialFocusRef` 추가 (`Dialog`·`Sheet`와 같은 이름·타입)
  - `Select`·`MultiSelect`·`DropdownMenu` 트리거에 `aria-controls`, `Tooltip`·`HoverCard` arrow에 `aria-hidden`
  - i18n: `Toast.Provider`의 `closeLabel`, `MultiSelect.Trigger`의 `formatCount`
  - `RadioGroup` 비활성 테두리를 `Checkbox`와 같은 정책으로, transition easing 토큰 4곳 적용

## 0.9.0

### Minor Changes

- 23db6e5: MultiSelect·Sheet·ContextMenu 추가 (파생 3종)
  
  - MultiSelect: 다중 선택 — 트리거는 요약 텍스트("n개 선택됨"), 선택해도 패널 유지(토글), `name` 지정 시 값마다 hidden input. Field 연동·aria-multiselectable
  - Sheet: 4방향(left·right·top·bottom) 슬라이드 모달 오버레이 — Dialog의 presence·모달 스택·inert 재사용
  - ContextMenu: 우클릭 메뉴 — 커서 좌표 배치, 브라우저 기본 메뉴 차단. **마우스 전용**(Shift+F10·터치 long-press 미지원, 같은 동작이 다른 UI로도 도달 가능해야 함)
  - 내부: 옵션 수집·typeahead·열린 상태 키보드를 `internal/select-core`로 추출, `use-presence`·`dialog-stack`을 `internal/`로 이동, `use-overlay-position`이 floating-ui `VirtualElement` 허용
- f38a906: NotificationBadge·HoverCard 추가 (소형 묶음 2)
  
  - NotificationBadge: count·dot 알림 배지 — `count`/`max`(기본 99, 초과 시 "99+")/`isShowEmpty`(0 표시)/`intent`(critical 기본·brand), 신규 토큰 0
  - HoverCard: hover 전용 리치 프리뷰 오버레이 — Root·Trigger(asChild)·Content(+arrow), openDelay 700/closeDelay 300, 콘텐츠 hover 유지, 포커스로 열리지 않음(시각 사용자 보조 UI)

## 0.8.0

### Minor Changes

- cd69b8d: TextArea 자동 확장·RadioGroup 방향·Badge outline 테두리 variant 추가입니다.
  
  **TextArea 자동 높이 제어:**
  - 컴포넌트: `<TextArea>` — `<textarea>` 전용, TextField 동형 외관·상태
  - 크기: size `medium`/`large` 지원
  - 상태: hover·focus·invalid·disabled·readonly 5종 (TextField 패턴 동일)
  - autoResize prop: `boolean`, 기본 `false`
    - `false`: 네이티브 `rows` + `resize: vertical` (사용자 수동 조정)
    - `true`: CSS `field-sizing: content` 구현으로 입력 높이에 따라 자동 확장 (Firefox 폴백: scrollHeight 동기화)
  - Field 연동: label·describedby·invalid 자동 (TextField 동일)
  - CSS: text-field.css 토큰값 완전 재사용
  - 새 토큰: 0개
  
  **RadioGroup 화합물 & 방향:**
  - 구조: `RadioGroup.Root` 상태·context → `RadioGroup.Item` 라벨 래핑 (Checkbox 동형)
  - 네이티브: `input[type=radio]` + 공유 `name` 속성
  - Props (`Root`):
    - `value`: 선택값 (제어형)
    - `defaultValue`: 기본값 (비제어형)
    - `onValueChange`: 값 변경 콜백
    - `name`: form 제출용 name 속성
    - `orientation`: `vertical`(기본) / `horizontal` — 화살표 키 네비게이션 축 제어 (세로면 ↑↓, 가로면 ←→)
  - 화살표 roving: Checkbox의 roving-focus 재사용, orientation 축 지원 확장 (기존 상하→좌우 추가)
  - 네이티브 라디오 기본 동작 우선 — roving과 이중 처리 회피 (`preventDefault` 조정)
  - 시각: Checkbox 박스의 원형 라디오닷 (checked = bg-brand-solid 계열)
  - disabled·focus-visible: Checkbox 관습 동일 (3중 매칭)
  - Controlled/uncontrolled: useControllableState
  - 새 토큰: 0개
  
  **Badge outline variant:**
  - 기존: `solid` / `weak` (2종 × intent 6 = 12조합)
  - 신규: `outline` (배경 투명, 테두리·글자 `fg-{intent}`)
  - 토큰: 기존 `fg-{intent}` 재사용 (새 토큰 0개)
  - 대비: `fg-{intent} on bg-layer-default` 4.5:1 WCAG AA 검사로 자동 커버 (비텍스트 3:1 기준 충족)
  - 기존 24조합 무회귀 (solid·weak 변경 없음)
  - Storybook: 매트릭스 스토리에 outline 열 추가 (variant 3 × intent 6 = 18조합)
  - VR: 기준 이미지 visual-baseline 워크플로 갱신 (로컬 `-u` 금지)
  
  **CSS & 구현:**
  - TextArea: `packages/react/src/text-area/`
    - text-area.css (@layer dds, `.dds-text-area--*` 클래스)
    - use-auto-resize.ts (field-sizing vs scrollHeight 판단 로직)
    - TextArea.tsx (컴포넌트 껍데기)
  - RadioGroup: `packages/react/src/radio-group/`
    - radio-group.css (@layer dds, `.dds-radio-group--*` 클래스)
    - roving-focus 재사용 (packages/react/src/internal/roving-focus.ts, orientation 축 지원 확장)
    - RadioGroup.tsx (Root·Item compound)
  - Badge: `packages/react/src/badge/badge.css` 수정 (outline variant 스타일 추가)
  
  **테스트 및 VR:**
  - vitest:
    - TextArea: autoResize toggle, Field 연동(label·describedby·invalid), disabled·readonly, 상태 5종 × size 2
    - RadioGroup: 선택·화살표 이동(orientation별 축 정확성)·disabled 건너뜀·name 공유·controlled/uncontrolled, roving 포커스 기본
    - Badge: outline variant 렌더 + intent 6종 대비 검사, 기존 solid·weak 24조합 무회귀
    - 기존 74건 무회귀 보증
  - Playwright 기능:
    - RadioGroup: 화살표 이동 1~2케이스 (orientation별)
    - 스토리 부재 시 스킵 가드
  - VR: StateMatrixStory 관습 (TextArea·RadioGroup·Badge 각 매트릭스 스토리, 자동 편입)
  
  **주의:**
  - TextArea `rows` prop: 구현 판단 (기본값 3 또는 사용자 명시)
  - RadioGroup roving과 네이티브 화살표 이중 처리: preventDefault 위치 정확히 (두 칸씩 이동 버그 회피)
  - Badge 기준 이미지: outline 추가 시 diff 발생 예상 → CI에서 기존 solid·weak 먼저 픽셀 확인 후 갱신
  - tokens.css 신규 토큰 불필요 — TextArea·RadioGroup·Badge 모두 기존 토큰 재사용
- 9a08fe2: Tooltip·Popover 경량 오버레이 2종 추가입니다.
  
  **Tooltip — 자동 지연·hover/focus 트리거:**
  - 구조: `Tooltip.Provider`(지연 그룹 스코프) + `Tooltip.Root` + `Tooltip.Trigger`(asChild) + `Tooltip.Content`(+arrow)
  - Provider 그룹 스킵: openDelay 기본값 위임, 그룹 내 하나가 열려 있으면 인접 트리거 이동 시 지연 생략
  - 트리거: hover(mouseenter/leave) + focus(탭 포커스 포함, `:focus` 기반)
  - 닫힘: blur·ESC·스크롤에서 닫힘
  - 접근성: `role="tooltip"` + 트리거에 `aria-describedby` 자동 연결
  - 색: `bg-neutral-solid` + `fg-neutral-contrast` 재사용 (새 토큰 0개)
  - 비인터랙티브: 툴팁 안 포커스 가능 요소 금지 (문서화)
  - arrow: floating-ui 미들웨어 기본 활성, 회전 사각형·flip 시 위치 자동
  - 애니메이션: duration-fast·easing-out, reduced-motion 대응
  - 스택: ESC 라우팅 미등록, 자체 ESC 처리
  
  **Popover — 자유 콘텐츠 비모달:**
  - 구조: `Popover.Root` + `Popover.Trigger`(asChild, 클릭 토글) + `Popover.Content`(+arrow) + `Popover.Close`
  - use-overlay 재사용: 비모달 스택 등록(ESC 라우팅)·외부 클릭 닫힘·presence·floating·단일 열림
  - autoFocus prop: 기본 `true`, true면 열릴 때 Content 포커스 + 닫힐 때 트리거 복귀(Dialog 관례)
  - 닫힘 prop: closeOnEscape·closeOnOutsideClick (이름 위임)
  - 패널: bg-layer-default + shadow-overlay + radius (DropdownMenu 계열), role 기본 미지정(위임)
  - arrow: floating-ui 미들웨어 prop(기본값 위임), 회전 사각형·flip 시 위치 자동
  - 애니메이션: duration-fast·easing-out, reduced-motion 대응
  
  **공통:**
  - 새 토큰: 0개 (기존 재사용)
  - 파일 구조:
    - Tooltip: `packages/react/src/tooltip/` (tooltip.css, use-delay.ts, Tooltip.tsx + Provider)
    - Popover: `packages/react/src/popover/` (popover.css, Popover.tsx)
    - 공유: `packages/react/src/internal/use-overlay.ts` (상태·presence·portal·floating·단일열림·비모달 스택·바깥클릭·복귀)
  
  **테스트 및 VR:**
  - vitest:
    - Tooltip: 지연 타이머(fake timers)·Provider 그룹 스킵·describedby·focus(탭 포커스)·blur·ESC·스크롤
    - Popover: autoFocus 양쪽(true/false)·클릭 토글·외부 클릭·ESC·단일 열림
    - hover 이벤트는 jsdom 한계(mouseenter 디스패치)
    - 기존 101건 무회귀 보증
  - Playwright 기능:
    - Tooltip: 실 hover 열림/이탈 닫힘(지연 포함), focus 열림
    - Popover: 클릭 토글·외부 클릭, ESC
  - VR:
    - 신규 스토리는 기준 없음 → 스킵 → visual-baseline 워크플로 경유
    - 스토리 id: `tooltip--functional-demo`, `popover--functional-demo`
    - arrow 포함 라이트·다크 매트릭스
    - 기존 기준 무영향
  - Storybook: 두 컴포넌트 데모 + StateMatrixStory
  
  **주의:**
  - Tooltip Provider 밖 사용 시 단독 지연으로 동작(에러 금지)
  - 탭 포커스 열림 채택으로 터치에서 "버튼 액션 + 툴팁 동시 발생" — 트레이드오프 수용, 문서화 필요
  - hover 지연 테스트 CI 타이밍: Playwright 로케이터 대기 + 넉넉한 지연 마진

## 0.7.0

### Minor Changes

- 28ae3ce: Select 폼 단일 선택 오버레이 화합물 컴포넌트와 typeahead 네비게이션입니다.
  
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
