# @dg-design/tokens

## 0.6.0

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

## 0.5.0

### Minor Changes

- 70169a4: 모션 토큰과 오버레이 토큰 신설, Switch·Checkbox 소급 교체입니다.
  
  **신설 토큰:**
  - `bg-overlay` — 다이얼로그·모달 오버레이 배경. gray-1000/알파 조합. light: 50% 알파, dark: 70% 알파. 대비 검사 미실시 (배경 투명).
  - `shadow-overlay` — 다이얼로그 그림자(첫 번째 드롭 그림자). light: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`, dark: `0 20px 25px -5px rgba(0, 0, 0, 0.3)`.
  - `duration-fast` — 빠른 모션(150ms). Checkbox·Switch 토그 애니메이션, Dialog 진입 애니메이션 용도.
  - `duration-base` — 기본 모션(200ms). Dialog 퇴장·배경 페이드 애니메이션 용도.
  - **easing**: `ease-out-cubic`(cubic-bezier(0.33, 1, 0.68, 1)) — 표준 deceleration easing.
  
  **소급 변경:**
  - `packages/react/src/checkbox/` `packages/react/src/switch/` — 하드코딩된 `150ms` transition-duration을 CSS 변수 `var(--dds-duration-fast)` 참조로 교체. vitest 및 기존 VR 기준과 시각 무변화 확인.
  
  **타입·dist 변화:**
  - semantic colors 41개 → 42개 (bg-overlay 추가)
  - semantic tokens 신규 섹션 — shadows, durations, easings 추가
  - tokens.css: CSS 변수 4개 추가 (bg-overlay, shadow-overlay, duration-fast, duration-base)
  - tailwind.css: 테마 객체 확장
  
  **검증:**
  - `pnpm generate` ✓ (대비 검사 미실시 항목 신설, 기존 검사 전건 통과)
  - CSS 생성 및 타입 일관성 ✓

## 0.4.0

### Minor Changes

- 2e15a5a: `stroke-critical` semantic 토큰을 추가했습니다. 폼 컨트롤의 error 테두리와 주의 필요 구분선 용도로 사용됩니다.
  
  **추가 토큰:**
  - `stroke-critical` — error 상태 테두리(TextField invalid 등). light: critical-600, dark: critical-500. WCAG 1.4.11(비텍스트 그래픽 요소) min 3.0 통과.
  
  **대비 검사 확장:**
  - `stroke-critical on bg-layer-default` × 2모드(light/dark) = 2건 추가
  - 모든 검사 min 3.0 통과 (기존 stroke-neutral과 동형)
  
  **대비 결과:**
  - light: critical-600(#c41615) on bg-layer-default(#ffffff) = 5.65:1
  - dark: critical-500(#f45656) on bg-layer-default(#1a1a1a) = 5.03:1
  
  **타입 변화:**
  - semantic colors 40개 → 41개 증가
  - contrast checks 26건 → 28건 증가 (기존 검사 전건 유지)

## 0.3.0

### Minor Changes

- bd9ddbf: stroke 축을 신설했습니다. 인터랙티브 컨트롤 테두리와 구분선 용도로 `stroke-neutral` · `stroke-neutral-weak` 2개 semantic 토큰을 추가했습니다.
  
  **추가 토큰:**
  - `stroke-neutral` — 인터랙티브 컨트롤 테두리(미체크 Checkbox 등). light: gray-600, dark: gray-500. WCAG 1.4.11(비텍스트 그래픽 요소) min 3.0 통과.
  - `stroke-neutral-weak` — 구분선·비필수 장식. light: gray-200, dark: gray-800. 대비 검사 없음.
  
  **대비 검사 확장:**
  - `stroke-neutral on bg-layer-default` × 2모드(light/dark) = 2건 추가
  - 모든 검사 min 3.0 통과 (기존 stroke-focus-ring과 동형)
  
  **상태쌍 설계:**
  - stroke에는 hover/pressed 상태 토큰이 없음. 인터랙티브 시각 피드백은 기존 `bg-transparent-hover` · `bg-transparent-pressed`로 대체(재사용 결정).
  - 호버 반응은 배경 투명도 변화로 충분하다고 판정.
  
  **타입 변화:**
  - semantic colors 38개 → 40개 증가
  - contrast checks 24건 → 26건 증가 (기존 검사 전건 유지)

## 0.2.0

### Minor Changes

- a2fd2ed: Intent 축을 완성했습니다. critical, positive, warning, informative 4종 intent에 palette 램프 4개(40개 값)와 semantic 토큰 16개를 추가했습니다.
  
  **추가 토큰:**
  - palette: `critical`(hue ~25, 적) · `positive`(hue ~145, 녹) · `warning`(hue ~85, 황) · `informative`(hue ~250, 청) 각 10단계
  - semantic: `bg-{intent}-solid`, `bg-{intent}-weak`, `fg-{intent}`, `fg-{intent}-contrast` (4종 intent × 4토큰 = 16개)
  
  **대비 검사 확장:**
  - intent당 3쌍(fg-contrast on bg-solid, fg on bg-weak, fg on bg-layer-default) × 2모드(light/dark) = 24건 추가
  - 모든 검사 min 4.5:1 통과 (gamut 검사 포함)
  
  **특수 처리:**
  - `fg-warning-contrast`는 어두운 값(gray-1000 계열) — 황색 solid 위에서 흰 글자는 4.5:1 불가능하므로 dark fg로 대체
  - 나머지 3종 intent는 light fg 방향(seed와 동일)

### Patch Changes

- e0f365f: 패키지 메타데이터를 보강했습니다. MIT 라이선스를 명시하고 LICENSE 파일을 배포 아카이브에 포함하며, repository·homepage·bugs·description·keywords 필드를 추가해 npm 페이지에서 저장소로 이동할 수 있게 했습니다. 코드 동작 변화는 없습니다.

## 0.1.0

### Minor Changes

- 5af25d5: 0.1.0 첫 릴리스 — 토큰 파이프라인(OKLCH 파생 팔레트 + WCAG 대비 검증 + Tailwind v4 브릿지)과 Button 컴포넌트를 공개한다.
