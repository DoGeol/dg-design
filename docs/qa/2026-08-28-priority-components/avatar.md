# Avatar QA
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 대상 기획: `docs/plans/2026-08-28-priority-components/avatar.md`
- 전체 상태: **실행 완료**
- 최종 판정: **PASS — 독립 재QA 통과**
## 단위 체크리스트
- [x] 최초 `loading`, 성공 `loaded`, 실패 `error` 전환이 정확하다.
- [x] loading/error에서 Fallback, loaded에서 Image가 표시된다.
- [x] 캐시 완료 이미지의 complete·natural size 성공/실패 경로가 판정된다.
- [x] Root·Image·Fallback의 `data-loading-state`가 동기화된다.
- [x] src 변경 시 상태가 다시 판정된다.
- [x] 사용자 `onLoad`/`onError`, 네이티브 img 속성, ref가 보존된다.
## 접근성 체크리스트
- [x] 장식 이미지의 빈 alt와 의미 이미지의 alt가 네이티브 계약대로 전달된다.
- [x] Fallback/Badge가 불필요한 role이나 live region을 만들지 않는다.
- [x] Image/Fallback 가시성 전환이 중복 접근 가능한 이름을 만들지 않는다.
- [x] SSR·hydration mismatch가 없고 hydration 직후 전환을 관찰한다.
## Storybook 체크리스트
- [x] `Root/Image/Fallback/Badge` 공개 요소의 사용 예가 있다.
- [x] small/medium/large/xlarge 4개 크기가 있다.
- [x] loading/loaded/error와 이미지 없는 fallback 예가 있다.
- [x] 24px를 포함한 모든 크기에서 Badge가 표시된다.
- [x] 라이트·다크 StateMatrix에서 stroke·fallback 색·텍스트가 일관된다.
## 브라우저 체크리스트
- [x] 실제 이미지 요청의 성공·실패와 캐시 재방문 경로가 동작한다.
- [x] hydration 직후 Fallback의 짧은 노출 여부와 영향이 기록된다.
- [x] Image가 원형 영역에서 `object-fit: cover`로 잘린다.
- [x] Badge가 모든 크기에서 Root 우하단에 안정적으로 배치된다.
- [x] 로컬 VR 기준 이미지를 생성하거나 갱신하지 않았다.
## 빌드 체크리스트
- [x] barrel과 Avatar subpath에서 compound API와 타입을 import할 수 있다.
- [x] CSS raw copy와 트리셰이킹 계약이 유지된다.
- [x] `pnpm generate`, `pnpm build`, React 테스트가 통과한다.
- [x] `pnpm typecheck`, publint, `pnpm vr`이 통과한다.
- [x] 새 StateMatrix와 기능 story가 VR 수집 대상이다.
## 실행 명령
```sh
pnpm generate
pnpm build
pnpm --filter @dg-design/react test -- avatar
pnpm typecheck
pnpm --filter @dg-design/react exec publint
pnpm --filter @dg-design/storybook dev
pnpm vr
```
## 결과 기입란
| 구분 | 결과 | 근거 / 로그 |
|---|---|---|
| 단위 테스트 | PASS | `avatar.test.tsx` 6건 및 React 전체 32 files/342 tests 통과 |
| 접근성 점검 | PASS | 네이티브 alt, 가시성 전환, 불필요한 role/live region 부재 확인 |
| Storybook 라이트·다크 | PASS | 4개 size·Badge·loading 상태 StateMatrix 독립 재QA, 공백 보완 확인 |
| 실제 이미지/캐시 브라우저 점검 | PASS | Chromium 성공·실패 경로와 단위 테스트의 complete/natural size 양 경로 확인 |
| hydration 전환 관찰 | PASS | hydration mismatch 없이 effect 뒤 캐시 상태 판정; 짧은 fallback 전환은 허용된 계약 |
| 브라우저/VR | PASS | `pnpm vr`: 56 PASS/62 SKIP; 로컬 Linux baseline 부재에 따른 정책상 SKIP |
| generate/build | PASS | `pnpm generate`, `pnpm build` 통과 |
| typecheck/publint | PASS | `pnpm typecheck`, publint 통과 |
## 미해결 위험
- 캐시 이미지도 hydration 직후 effect 판정 전에는 fallback이 짧게 보일 수 있다. mismatch를 피하기 위한 의도된 계약이며 기능 결함으로 보지 않는다.
- 신규 Linux 기준 이미지가 없는 항목은 로컬 정책에 따라 SKIP되며 CI `visual-baseline`에서만 생성한다.
## 판정 기준
- **합격:** 상태 전환·캐시 경로·4개 크기·Badge·사용자 핸들러/ref·접근성 계약이 모두 확인되고 필수 명령이 통과한다.
- **불합격:** 잘못된 Image/Fallback 가시성, hydration mismatch, 소비자 이벤트 유실, 24px Badge 누락, 또는 필수 검증 실패가 있다.
- 모든 필수 체크와 독립 재QA가 완료되어 **PASS**로 판정한다.
