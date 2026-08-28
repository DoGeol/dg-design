# Collapsible QA
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 대상 기획: `docs/plans/2026-08-28-priority-components/collapsible.md`
- 전체 상태: **실행 완료**
- 최종 판정: **PASS — 독립 재QA 통과**
## 단위 체크리스트
- [x] uncontrolled `defaultOpen`과 사용자 토글이 동작한다.
- [x] controlled `open`과 `onOpenChange`가 외부 값을 진실로 유지한다.
- [x] `open={false}`도 controlled로 판별하고 외부 reset이 반영된다.
- [x] disabled에서 사용자 입력은 막히고 controlled 갱신은 반영된다.
- [x] Trigger `asChild`, ref, 네이티브 속성이 보존된다.
- [x] Trigger/Content 생략은 허용되고 Root 밖 하위 요소는 개발 오류를 낸다.
- [x] 닫았다 열어도 Content 내부 input 값이 유지된다.
## 접근성 체크리스트
- [x] Trigger의 `aria-expanded`와 `aria-controls`가 Content id와 일치한다.
- [x] 닫힌 Content에 `aria-hidden`과 `inert`가 적용된다.
- [x] 닫힌 Content 내부로 Tab/프로그램 포커스가 이동하지 않는다.
- [x] disabled Trigger가 상태를 변경하지 않는다.
- [x] reduced-motion에서 높이·opacity가 즉시 전환된다.
## Storybook 체크리스트
- [x] controlled/uncontrolled/disabled 예가 있다.
- [x] Content 내부 input 상태 보존 예가 있다.
- [x] 동적으로 콘텐츠 크기가 바뀌는 기능 예가 닫힌 상태로 시작한다.
- [x] Trigger `asChild`와 하위 요소 생략 가능성을 보여준다.
- [x] 라이트·다크 StateMatrix와 reduced-motion 확인 경로가 있다.
## 브라우저 체크리스트
- [x] 실제 `scrollHeight`가 CSS 변수에 반영된다.
- [x] ResizeObserver로 열린 Content의 동적 높이가 갱신된다.
- [x] 열림/닫힘 height·opacity 전환 중 잘림이나 점프가 없다.
- [x] 닫힌 Content의 inert와 포커스 차단이 실제 브라우저에서 동작한다.
- [x] 기능 테스트용 demo story는 닫힌 상태로 시작한다.
- [x] 로컬 VR 기준 이미지를 생성하거나 갱신하지 않았다.
## 빌드 체크리스트
- [x] barrel과 Collapsible subpath에서 compound API를 타입 안전하게 import한다.
- [x] CSS raw copy와 트리셰이킹 계약이 유지된다.
- [x] `pnpm generate`, `pnpm build`, React 테스트가 통과한다.
- [x] `pnpm typecheck`, publint, `pnpm vr`이 통과한다.
- [x] 기능 테스트와 StateMatrix가 VR 수집 대상이다.
## 실행 명령
```sh
pnpm generate
pnpm build
pnpm --filter @dg-design/react test -- collapsible
pnpm typecheck
pnpm --filter @dg-design/react exec publint
pnpm --filter @dg-design/storybook dev
pnpm vr
```
## 결과 기입란
| 구분 | 결과 | 근거 / 로그 |
|---|---|---|
| 단위 테스트 | PASS | `collapsible.test.tsx` 6건 및 React 전체 32 files/342 tests 통과 |
| 접근성 점검 | PASS | Item별 ARIA 연결, 닫힌 Content의 `aria-hidden`·`inert`, disabled 확인 |
| Storybook 라이트·다크 | PASS | 상태·동적 콘텐츠·asChild 예제 독립 재QA, 공백 보완 확인 |
| 동적 높이 브라우저 테스트 | PASS | Chromium에서 `scrollHeight` CSS 변수와 ResizeObserver 갱신 확인 |
| inert/포커스 브라우저 테스트 | PASS | 닫힌 Content 접근·포커스 차단과 DOM/폼 상태 보존 확인 |
| 브라우저/VR | PASS | `pnpm vr`: 56 PASS/62 SKIP; 로컬 Linux baseline 부재에 따른 정책상 SKIP |
| generate/build | PASS | `pnpm generate`, `pnpm build` 통과 |
| typecheck/publint | PASS | `pnpm typecheck`, publint 통과 |
## 미해결 위험
- jsdom의 레이아웃 공백은 Chromium 기능 테스트로 보완했으며 기능상 미해결 위험은 없다.
- 신규 Linux 기준 이미지가 없는 항목은 로컬 정책에 따라 SKIP되며 CI `visual-baseline`에서만 생성한다.
## 판정 기준
- **합격:** 상태 계약·ARIA/id·inert/포커스 차단·폼 상태 보존·동적 높이가 자동 및 브라우저 근거로 확인되고 필수 명령이 통과한다.
- **불합격:** controlled 외부 값이 무시되거나 닫힌 Content가 접근/포커스되거나 DOM 상태가 유실되거나 동적 높이 검증이 빠진다.
- 모든 필수 체크와 독립 재QA가 완료되어 **PASS**로 판정한다.
