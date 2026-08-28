# Accordion QA
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 대상 기획: `docs/plans/2026-08-28-priority-components/accordion.md`
- 전체 상태: **실행 완료**
- 최종 판정: **PASS — P1 수정 후 독립 재QA 통과**
## 단위 체크리스트
- [x] single/multiple의 uncontrolled 초기값과 토글이 동작한다.
- [x] controlled values가 항상 진실이고 외부 reset이 반영된다.
- [x] single에서 열린 Item 재클릭 시 `[]`로 닫힌다.
- [x] single controlled 다중 값은 첫 값만 표시하고 다음 콜백은 정규화된다.
- [x] Root disabled와 Item disabled가 사용자 변경을 막는다.
- [x] 중복 value가 개발 모드 경고를 내고 렌더를 중단하지 않는다.
- [x] 모든 compound 구성요소의 네이티브 속성·ref와 Header `asChild`가 보존된다.
## 접근성 체크리스트
- [x] Item별 Trigger/Content id가 `aria-controls`/`aria-labelledby`로 연결된다.
- [x] Content에 `role="region"`이 적용된다.
- [x] 닫힌 Content가 `aria-hidden`·`inert`로 접근성과 포커스에서 제외된다.
- [x] ArrowDown/ArrowUp이 순환하고 disabled Trigger를 건너뛴다.
- [x] Home/End가 첫/마지막 활성 Trigger로 이동한다.
- [x] Enter/Space가 네이티브 button 동작으로 토글한다.
## Storybook 체크리스트
- [x] Root/Item/Header/Trigger/Content/Body/Title/Description/Prefix/SuffixIcon 사용 예가 있다.
- [x] single/multiple, controlled/uncontrolled, Root/Item disabled 예가 있다.
- [x] inline/separated × medium/large × open/closed/disabled StateMatrix가 있다.
- [x] 라이트·다크에서 Title·Description·disabled 색과 focus 스타일이 일관된다.
- [x] 소비자 제공 SuffixIcon이 open에서 180도 회전한다.
- [x] 기능 테스트용 demo story는 닫힌 상태로 시작한다.
## 브라우저 체크리스트
- [x] 키보드 순환과 disabled 건너뛰기가 Chromium에서 동작한다.
- [x] Content 동적 높이와 내부 폼 상태 보존이 동작한다.
- [x] inline separator와 separated border/radius/gap이 상태 조합에서 깨지지 않는다.
- [x] reduced-motion에서 Content와 SuffixIcon 전환이 즉시 적용된다.
- [x] 모든 조합을 라이트·다크로 확인한다.
- [x] 로컬 VR 기준 이미지를 생성하거나 갱신하지 않았다.
## 빌드 체크리스트
- [x] barrel과 Accordion subpath에서 compound API를 타입 안전하게 import한다.
- [x] Collapsible와 roving-focus 재사용 경계가 타입·런타임에서 맞물린다.
- [x] CSS raw copy와 트리셰이킹 계약이 유지된다.
- [x] `pnpm generate`, `pnpm build`, React 테스트가 통과한다.
- [x] `pnpm typecheck`, publint, `pnpm vr`이 통과한다.
- [x] 기능 테스트와 StateMatrix가 VR 수집 대상이다.
## 실행 명령
```sh
pnpm generate
pnpm build
pnpm --filter @dg-design/react test -- accordion
pnpm typecheck
pnpm --filter @dg-design/react exec publint
pnpm --filter @dg-design/storybook dev
pnpm vr
```
## 결과 기입란
| 구분 | 결과 | 근거 / 로그 |
|---|---|---|
| 단위 테스트 | PASS | `accordion.test.tsx` 9건 및 React 전체 32 files/342 tests 통과 |
| 접근성/ARIA 점검 | PASS | 최초 QA P1 수정: Item별 `useId`; 중복 value에서도 고유 ID·양방향 ARIA 연결 회귀 테스트 통과 |
| 키보드 브라우저 테스트 | PASS | Chromium에서 ArrowUp/Down/Home/End 순환과 disabled 건너뛰기 통과 |
| Storybook 라이트·다크 StateMatrix | PASS | 모든 variant·size·상태 조합 독립 재QA; 최초 P2 공백 전부 보완 |
| 동적 높이·폼 상태 브라우저 테스트 | PASS | Collapsible 기반 높이 전환과 닫기/열기 뒤 입력 값 보존 통과 |
| 브라우저/VR | PASS | `pnpm vr`: 56 PASS/62 SKIP; 로컬 Linux baseline 부재에 따른 정책상 SKIP |
| generate/build | PASS | `pnpm generate`, `pnpm build` 통과 |
| typecheck/publint | PASS | `pnpm typecheck`, publint 통과 |
## 미해결 위험
- Collapsible 기반 실제 높이·폼 상태는 Chromium 기능 테스트로 보완했으며 기능상 미해결 위험은 없다.
- 신규 Linux 기준 이미지가 없는 항목은 로컬 정책에 따라 SKIP되며 CI `visual-baseline`에서만 생성한다.
## 판정 기준
- **합격:** 모든 상태 계약, 정규화, disabled/중복 경계, 키보드 순환, ARIA 연결, StateMatrix 조합이 검증되고 필수 명령이 통과한다.
- **불합격:** controlled 값 왜곡, single 정규화 오류, disabled 항목 탐색, 잘못된 ARIA/id, 닫힌 Content 접근 가능, 또는 상태 조합 누락이 있다.
- 최초 QA의 duplicate value 중복 ID P1과 Storybook P2를 수정하고 독립 재QA를 마쳐 **PASS**로 판정한다.
