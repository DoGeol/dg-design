# @dg-design/react

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
