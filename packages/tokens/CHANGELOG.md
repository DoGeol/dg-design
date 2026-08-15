# @dg-design/tokens

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
