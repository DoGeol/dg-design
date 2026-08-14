# Checkbox·Switch + stroke 축

## 메타
- 생성: 2026-08-15
- 라운드: 6
- 최종 모호도: 14% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: [docs/decisions/2026-08-15-badge-intent-axis.md](../../decisions/2026-08-15-badge-intent-axis.md) (로드맵 B)
- 승인: 승인됨 (2026-08-15, 구현 계획 경로)
- 구현: **완료** — 0.3.0 준비 (2026-08-15). 합격 조건 13/13

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 |
| 제약 | 0.85 | 0.25 | 0.213 |
| 성공 기준 | 0.85 | 0.25 | 0.213 |
| 맥락 | 0.90 | 0.15 | 0.135 |
| **모호도** | | | **14%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| stroke 토큰 축 | 진행 | stroke-neutral + stroke-neutral-weak, 3:1 검사 | 구성·검사 확정, 스텝 위임 |
| Checkbox | 진행 | label 래핑, indeterminate, brand 고정 | 축·API 확정, 치수 위임 |
| Switch | 진행 | label 래핑, role=switch, 트랙+썸 | 축 확정, 치수·트랙색 위임 |
| 테스트 인프라 | 진행 | vitest 최소 구성 + CI test 단계 | 인터뷰 중 도입 확정 |
| 릴리스 0.3.0 | 진행 | tokens·react minor changeset | 기존 관례 |

## 목표

stroke 토큰 축을 신설하고 첫 폼 컨트롤 Checkbox·Switch를 vitest 테스트 인프라와 함께 0.3.0으로 릴리스한다.

## 제약

**stroke 토큰**
- `stroke-neutral` — 인터랙티브 컨트롤 테두리(미체크 Checkbox 등). 대비 검사 `stroke-neutral on bg-layer-default` min 3.0 (WCAG 1.4.11, 양 모드) — 기존 stroke-focus-ring 검사와 동형
- `stroke-neutral-weak` — 구분선·비필수 장식. 대비 검사 없음
- light/dark 쌍, gray 램프 스텝 선택은 검사 통과값으로 구현 위임
- 상태쌍 없음 — hover 반응은 기존 `bg-transparent-hover/pressed` 재사용

**Checkbox** (`packages/react/src/checkbox/`)
- `<label class="dds-checkbox">` 래핑 + 숨긴 네이티브 `input[type=checkbox]` + 시각 박스 + children이 라벨 텍스트. 클릭 타깃·a11y 연결은 네이티브에 위임
- checked 시각: `bg-brand-solid`(+hover/pressed 쌍) 재사용, 체크마크는 인라인 SVG(`fg-brand-contrast`)
- unchecked: 테두리 `stroke-neutral`, hover 시 박스에 `bg-transparent-hover`
- `indeterminate?: boolean` prop — DOM 프로퍼티라 ref+effect로 설정, 시각은 가로줄. checked 오버로드 대신 별도 prop (네이티브 모델 유지). 스크린리더 mixed 안내는 네이티브 indeterminate가 처리하는지 구현 중 검증, 안 되면 aria-checked 보강
- disabled: 기존 3중 매칭(`:disabled,[disabled],[data-disabled]`) + bg-disabled/fg-disabled/stroke 무광
- focus-visible: 기존 관습 (박스에 outline)
- intent 축 없음 — brand 고정 (반론 라운드 판정, seed 동일)

**Switch** (`packages/react/src/switch/`)
- label 래핑 Checkbox와 동일 구조, `input[type=checkbox] role="switch"`
- 트랙+썸: CSS만. checked 트랙 `bg-brand-solid`(+상태쌍), unchecked 트랙은 기존 neutral 계열 토큰에서 위임. 썸 이동 transition + `prefers-reduced-motion: reduce`에서 제거
- 새 색 토큰 금지 — 기존 semantic + 신설 stroke 2개 안에서 해결

**공통**
- size: `medium`(기본)·`large` 2단 — 두 컴포넌트 이름 축 통일, 치수는 기존 dimension 토큰에서 위임
- CVA + `@layer dds` + `.dds-checkbox--size_medium` 클래스 관습, Button·Badge와 동형
- asChild 없음 — label 래핑 구조와 충돌

**테스트 인프라** (`packages/react`)
- vitest + jsdom + @testing-library/react 최소 구성. 의존성은 minimumReleaseAge 3일 게이트 유의 — 하한을 성숙 버전으로
- 최소 케이스: Checkbox 토글·label 클릭 연동·indeterminate DOM 프로퍼티 반영·disabled 무반응, Switch role=switch·토글
- `test` 스크립트 + CI에 test 단계 (build 뒤)
- AGENTS 트리거 문구의 "로직 컴포넌트 등장"이 indeterminate ref로 성립됐다고 판정한 이력을 남긴다

## 하지 않을 것

- intent 축 — brand 고정. 수요 확인 전 선투자 금지
- stroke 상태쌍(hover/pressed) — bg-transparent 재사용으로 대체
- RadioGroup — 다음 릴리스 후보. Checkbox 관습 확립이 먼저
- 시각 회귀 — 완성 시 컴포넌트 4개, 트리거(5개+)는 다음 컴포넌트에서 재고
- 헤드리스 훅 분리 — ref 몇 줄에 과함. Dialog급 로직에서 첫 적용
- indeterminate의 폼 제출 값 처리 — 네이티브 동작(unchecked 취급) 그대로

## 합격 조건

- [ ] `stroke-neutral`·`stroke-neutral-weak` semantic 추가, light/dark 쌍, tokens.css·tailwind.css·d.ts 자동 반영
- [ ] 대비 검사 `stroke-neutral on bg-layer-default` min 3.0 × 2모드 추가·통과, 기존 검사 전건 유지
- [ ] Checkbox: unchecked(테두리)·checked(brand+체크마크)·indeterminate(가로줄) 3상태 × size 2 렌더
- [ ] label 클릭으로 토글, htmlFor 수작업 불필요
- [ ] `indeterminate` prop이 DOM 프로퍼티에 반영되고 시각 표시
- [ ] Checkbox·Switch disabled에서 상호작용 무시 + disabled 토큰 적용
- [ ] Switch: `role="switch"`, checked 토글에 따라 썸 이동, reduced-motion에서 transition 제거
- [ ] focus-visible 아웃라인 양 컴포넌트 동작
- [ ] vitest 구성 + 최소 케이스 그린, `pnpm --filter @dg-design/react test`
- [ ] CI에 test 단계 추가, 전체 그린
- [ ] Storybook: 두 컴포넌트 상태 매트릭스 스토리, 라이트·다크 확인
- [ ] `pnpm generate`·`typecheck`·`build`·publint 그린
- [ ] tokens·react minor changeset (0.3.0)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| 폼 컨트롤도 intent 축 | 반론 라운드 — 습관 vs 검증된 필요 | brand 고정, 새 색 토큰 0개 |
| stroke에 상태쌍 필요 | bg-transparent-hover 재사용 제시 | stroke 2개로 최소화 |
| 네이티브 기반이라 로직 0 | indeterminate는 DOM 프로퍼티 전용임을 지적 | 지원 확정 → ref 로직 → 테스트 프레임워크 도입 |
| Switch 크기 단일이면 충분 | 사용자가 폼 컨트롤 간 축 통일 선택 | medium·large 2단 공통 |
| 테스트는 Dialog 때 | 단순화 라운드 — 사용자가 이번 도입 선택 | vitest 이번 릴리스 포함 |

## 기술 맥락

- `packages/tokens/src/tokens.ts` — semanticColors에 stroke 2개 추가, contrastChecks에 2건. generate.ts 수정 불필요 예상
- `packages/react/src/button/`·`src/badge/` — CVA·CSS 관습 원본. 신규는 `src/checkbox/`·`src/switch/`
- disabled 3중 매칭·focus-visible·`:not(:disabled):is(:hover)` 패턴은 button.css 참조
- vite.config.ts — 테스트 의존성은 devDependencies라 external 무관
- CI: .github/workflows/ci.yml — build 뒤 test 단계 삽입
- pnpm catalog — 새 devDeps(vitest 등)는 단일 패키지 사용이라 catalog 제외, 직접 명시

## 남은 위험

- stroke-neutral 3:1: light에서 gray-500(#?) 근처가 경계값 — 검사가 게이트라 조용히 깨질 수는 없지만 스텝 튜닝이 필요할 수 있다
- Switch unchecked 트랙 대비: WCAG 1.4.11의 "필수 시각 정보" 해석상 트랙 자체는 검사 비대상으로 판단(썸·테두리가 상태 전달). 검사 쌍은 안 넣되 구현 중 명백히 안 보이면 재고
- indeterminate와 SSR: effect 적용이라 hydration 전 한 프레임 미표시 가능 — 실해 없다고 판단, 문제 시 data-attribute 병행
- jsdom 한계: CSS 시각 검증 불가 — 시각은 Storybook 실측, 로직만 vitest
- vitest 신규 의존성들이 minimumReleaseAge 게이트에 걸릴 수 있다 — 하한을 3일+ 성숙 버전으로 잡을 것

## 인터뷰 기록
<details><summary>전체 Q&A (6라운드)</summary>

### Round 0
**Q:** 구성요소 4개(stroke·Checkbox·Switch·0.3.0) / **A:** 이대로 맞음 (테스트 인프라는 R6에서 추가됨)

### Round 1
**Q:** stroke 세트 구성 / **A:** neutral + weak 2개, hover는 bg-transparent 재사용 / **모호도:** 37%

### Round 2
**Q:** Checkbox label 처리 / **A:** label 래핑 + children이 라벨 / **모호도:** 33%

### Round 3
**Q:** Switch size 축 / **A:** Checkbox와 동일 2단 (폼 컨트롤 축 통일) / **모호도:** 28%

### Round 4 (반론)
**Q:** intent 축이 검증된 필요인가 습관인가 / **A:** brand 고정 / **모호도:** 24%

### Round 5
**Q:** indeterminate 지원 (설명 요청 후 재질문) / **A:** 지원 / **모호도:** 21%

### Round 6 (단순화)
**Q:** 테스트 프레임워크 이번 도입 vs Dialog 때 / **A:** 이번에 도입 / **모호도:** 14%
</details>
