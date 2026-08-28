# Skeleton QA
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 대상 기획: `docs/plans/2026-08-28-priority-components/skeleton.md`
- 전체 상태: **실행 완료**
- 최종 판정: **PASS — 독립 재QA 통과**
## 단위 체크리스트
- [x] 기본 `radius="medium"`이 적용된다.
- [x] `none`, `small`, `medium`, `full` 4종이 렌더된다.
- [x] 임의 width/height와 네이티브 div 속성·className·style이 전달된다.
- [x] ref가 루트 div를 가리킨다.
- [x] 기본 `aria-hidden="true"`가 적용되고 명시 prop은 보존된다.
## 접근성 체크리스트
- [x] 기본 Skeleton이 접근성 트리에서 제외된다.
- [x] Skeleton 자체가 잘못된 live region이나 role을 만들지 않는다.
- [x] `prefers-reduced-motion: reduce`에서 shimmer 애니메이션이 제거된다.
- [x] SSR·hydration 전후 DOM과 기본 ARIA가 일치한다.
## Storybook 체크리스트
- [x] 기본 사용 예와 임의 width/height 예가 있다.
- [x] radius 4종을 모두 보여준다.
- [x] 라이트·다크 StateMatrix가 neutral semantic token을 사용한다.
- [x] reduced-motion에서 정지 상태를 수동 확인할 수 있다.
- [x] VR 수집 대상 story 이름과 태그가 등록되어 있다.
## 브라우저 체크리스트
- [x] Chromium에서 다양한 크기와 radius가 깨지지 않는다.
- [x] 라이트·다크에서 shimmer와 배경 대비가 DDS 컴포넌트와 일관된다.
- [x] reduced-motion 에뮬레이션에서 애니메이션이 동작하지 않는다.
- [x] 로컬 VR 기준 이미지를 생성하거나 갱신하지 않았다.
## 빌드 체크리스트
- [x] barrel과 Skeleton subpath에서 타입 안전하게 import된다.
- [x] CSS raw copy와 트리셰이킹 계약이 유지된다.
- [x] `pnpm generate`가 통과한다.
- [x] `pnpm build`가 통과한다.
- [x] React 테스트가 통과한다.
- [x] `pnpm typecheck`가 통과한다.
- [x] publint가 통과한다.
- [x] `pnpm vr`이 통과한다.
## 실행 명령
```sh
pnpm generate
pnpm build
pnpm --filter @dg-design/react test -- skeleton
pnpm typecheck
pnpm --filter @dg-design/react exec publint
pnpm --filter @dg-design/storybook dev
pnpm vr
```
## 결과 기입란
| 구분 | 결과 | 근거 / 로그 |
|---|---|---|
| 단위 테스트 | PASS | `skeleton.test.tsx` 5건 및 React 전체 32 files/342 tests 통과 |
| 접근성 점검 | PASS | 기본 `aria-hidden`, 명시 ARIA·role 보존, SSR 안전 DOM 확인 |
| Storybook 라이트·다크 | PASS | Functional demo·StateMatrix 독립 재QA, 공백 보완 확인 |
| reduced-motion | PASS | Chromium `emulateMedia({ reducedMotion: "reduce" })`에서 shimmer 정지 |
| 브라우저/VR | PASS | `pnpm vr`: 56 PASS/62 SKIP; 로컬 Linux baseline 부재에 따른 정책상 SKIP |
| generate | PASS | `pnpm generate` 통과 |
| build | PASS | `pnpm build` 통과 |
| typecheck | PASS | `pnpm typecheck` 통과 |
| publint | PASS | `pnpm --filter @dg-design/react exec publint` 통과 |
## 미해결 위험
- 기능상 미해결 위험 없음. 신규 Linux 기준 이미지가 없는 항목은 로컬 정책에 따라 SKIP되며 CI `visual-baseline`에서만 생성한다.
## 판정 기준
- **합격:** 모든 필수 체크가 완료되고 명령이 통과하며, radius 4종·임의 크기·기본 ARIA·reduced-motion이 근거와 함께 확인된다.
- **불합격:** 필수 체크 실패, 공개 API/토큰 계약 위반, 로컬 기준 이미지 갱신, 또는 검증 불가능한 항목이 남는다.
- 모든 필수 체크와 독립 재QA가 완료되어 **PASS**로 판정한다.
