# @dg-design/react

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
