# DDS 아키텍처: 스타일링·빌드·배포 결정

## 메타
- 생성: 2026-08-14
- 라운드: 7
- 최종 모호도: 12% (임계값 20%)
- 유형: 그린필드 (참고 저장소: `/Users/pdg/WebstormProjects/seed-design`)
- 상태: 통과
- 승인: **대기 중**

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.90 | 0.40 | 0.36 |
| 제약 | 0.85 | 0.30 | 0.255 |
| 성공 기준 | 0.90 | 0.30 | 0.27 |
| **모호도** | | | **11.5%** |

## 구성요소
| 구성요소 | 상태 | 결정 |
|----------|------|------|
| 토큰 파이프라인 | 확정 | TS 정의 → 미니 코드젠(스크립트 1개) → tokens.css + tailwind.css + 타입 |
| 컴포넌트 스타일링 | 확정 | 수기 plain CSS + CVA 클래스 조합. seed 네이밍 관습 준수 |
| 빌드/배포 | 확정 | Vite lib mode, 컴포넌트별 CSS(side-effect import), ESM only |
| Tailwind 브릿지 | 확정 | seed tailwind4-theme 패턴: `@theme`에서 `--dds-*` 재바인딩(값 복제 없음) |

## 목표

seed-design의 산출물 구조(토큰 CSS 변수 + variant 클래스 + data-attribute 상태)를 수기로 재현하는 최소 규모 개인 디자인시스템을 만들어, npm으로 배포하고 개인 프로젝트에서 import해 쓴다.

## 제약

- 규모: 개인. 첫해 컴포넌트 10~15개 가정
- 의존성 최소: 런타임 의존성은 CVA(+clsx) 수준까지만
- Tailwind 종속 금지: 컴포넌트는 Tailwind 없는 프로젝트에서도 동작
- 다크모드: seed와 동일하게 `data-*` 속성 기반 (media query 아님), 시스템 감지는 소비 앱 책임
- 모듈 포맷: ESM only (2026년 기준 CJS 듀얼 불필요)
- 코드젠은 토큰까지만. 컴포넌트 CSS는 손으로 작성

## 하지 않을 것

- 레시피 코드젠 엔진 (qvism/Panda류) — 트리거: 컴포넌트 15개+ 에서 수기 variant CSS가 실제 고통일 때 재고
- headless 패키지 분리 — 트리거: 같은 로직에 다른 스타일을 두 번 입히게 될 때
- YAML 토큰 정의 + 자체 CLI — 개인 규모에선 영구 불채택
- CJS 빌드, CSS layers 옵트인(`.layered` 변형), 컴포넌트 스펙 코드젠, Figma 연동, 문서 사이트(Storybook으로 갈음)
- CSS Modules, Panda CSS — 인터뷰에서 비교 후 탈락

## 합격 조건

- [ ] `pnpm generate` → `tokens.css` / `tailwind.css` / 타입 3종 생성, semantic 토큰이 light/dark 각각 값 보유
- [ ] Button이 variant×size 전 조합으로 Storybook 렌더, 다크모드 토글 시 색 전환
- [ ] `pnpm build` → 컴포넌트별 JS+CSS 산출, `publint` 통과
- [ ] 별도 빈 Vite 프로젝트에서 `pnpm add @dg-design/react` 후 Button import만으로 스타일 자동 적용
- [ ] Tailwind v4 프로젝트에서 브릿지 import 후 `bg-*` 토큰 유틸 동작
- [ ] npm 0.1.0 publish 완료

**0.1.0 릴리스 범위 = Button 단 하나.** 목적은 컴포넌트 수가 아니라 토큰→빌드→배포→소비 파이프라인 전체 검증. 추가 컴포넌트는 이후 마이너 버전.

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| "Tailwind 기준으로 만들자" | 컴포넌트를 Tailwind 위에 지으면 비Tailwind 프로젝트에서 깨짐 | 뒤집음: 토큰만 Tailwind로 내보내는 브릿지. seed도 동일 결론 |
| "variant는 data-attribute로" (초기 계획) | seed 실물 조사: variant=클래스, 런타임 상태만 data-attr | seed 관습 채택으로 수정 |
| "seed처럼 코드젠 파이프라인 필요" | 타사 비교: Bezier/Primer/Mantine 전부 수기 CSS로 이탈, 코드젠은 대규모용 | 토큰만 미니 코드젠, 컴포넌트 CSS는 수기 |
| "트리셰이킹 불필요(개인 규모)" (반론 챌린지) | 단일 styles.css 제안했으나 사용자가 seed 방식 학습 가치 선택 | 컴포넌트별 CSS + side-effect import 채택 |

## 기술 맥락

### seed-design 조사 요약 (근거)
- 파이프라인: rootage YAML → 자체 CLI → CSS vars/타입/tailwind4 `@theme` → qvism(자체 레시피 엔진) → 컴포넌트별 CSS → react(Vite lib mode)
- 클래스 관습: `.seed-action-button--variant_brandSolid`(variant), `.seed-checkbox__root`(슬롯), `[data-loading]`(상태)
- CSS 로드: 레시피 `.mjs` 첫 줄 `import './x.css'` side-effect, `sideEffects: ["*.css"]`, 소비자는 base.css(토큰)만 수동 로드
- 다크모드: `:root[data-seed-color-mode=...]` 셀렉터, 시스템 감지는 앱 JS 책임
- tailwind4-theme: 100% 생성물, `@theme { --color-x: var(--seed-color-x) }` 참조 재바인딩, 토큰 CSS 선로드 필수
- react 빌드: Vite lib mode + `preserveModules: true` + CSS external + 'use client' 배너 (`packages/react/vite.config.mts`)

### DDS 채택 사항
- 모노레포: pnpm workspace — `packages/tokens`, `packages/react`, `apps/storybook`
- 토큰: `tokens.ts`(primitive→semantic 2단계) → `generate.ts`(~50줄) → `tokens.css`(`:root { --dds-* }`, `[data-dds-theme="dark"]` 재정의) + `tailwind.css` + 타입
- 컴포넌트: `Button.tsx`(CVA) + `button.css`(수기, `.dds-button--variant_solid` 관습) + `import "./button.css"`
- 빌드: Vite lib mode(preserveModules), `sideEffects: ["*.css"]`, publint 검증, changesets 배포
- 참고 파일: seed의 `packages/react/vite.config.mts`, `packages/css/package.json`(exports 맵), `packages/tailwind4-theme/index.css`

## 남은 위험

- `@dg-design` npm scope: 패키지 미발행 확인됨(404). org 소유 가능 여부는 npm 봇 차단으로 비로그인 확인 불가 — 배포 단계에서 npm 로그인 후 org 생성으로 확정. 불가 시 대안 스코프
- Vite lib mode에서 컴포넌트별 CSS 방출 + side-effect 유지 설정은 실작업에서 검증 필요 (seed 설정 참고로 완화)

## 인터뷰 기록
<details><summary>전체 Q&A (5라운드)</summary>

### Round 0 — 토폴로지
**Q:** 재결정 범위 = 토큰 파이프라인 / 스타일링 / 빌드·배포 / Tailwind 브릿지 4개 맞나?
**A:** 이대로 맞음.

### Round 1 — 코드젠 수준
**Q:** 코드젠 채택 수준? (미니/충실 재현/없음)
**A:** 타사 비교 먼저, 처음부터 크게 안 잡음. → 비교 조사 수행 (Bezier·Primer·Mantine·Radix·Panda·shadcn·TDS)
**모호도:** 52% → 44%

### Round 2 — 스타일 기술
**Q:** 컴포넌트 CSS 작성 방식? (수기+CVA / Panda / CSS Modules)
**A:** 코드젠 개념 설명 요청 → 설명 후 재질문 → "비교 기준으로 추천해달라"
**모호도:** 44%

### Round 3 — 스타일 확정
**Q:** 추천(수기 CSS + CVA, 코드젠은 토큰만) 확정?
**A:** 확정.
**모호도:** 44% → 45% (min 채점 정정, 빌드가 병목으로 노출)

### Round 4 — CSS 배포 (반론 챌린지)
**Q:** 트리셰이킹이 개인 규모에 진짜 필요한가? 단일 styles.css vs 컴포넌트별?
**A:** 컴포넌트별 CSS (seed 방식) — 학습 가치 우선.
**모호도:** 45% → 25%

### Round 5 — 합격 조건
**Q:** 합격 조건 5개 확정?
**A:** 확정.
**모호도:** 25% → 14.5%

### Round 6 — 첫 릴리스 범위 (단순화 챌린지)
**Q:** 가치가 남는 가장 단순한 0.1.0은? (Button만 / 3종 / 5~6개)
**A:** Button 하나만.
**모호도:** 14.5%

### Round 7 — 모듈 포맷
**Q:** ESM only 확정? (구형 CJS 환경 포기 감수)
**A:** ESM only.
**모호도:** 14.5% → 11.5%
</details>
