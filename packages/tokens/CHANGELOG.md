# @dg-design/tokens

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
