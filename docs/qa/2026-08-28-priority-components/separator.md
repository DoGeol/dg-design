# Separator QA
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 대상 기획: `docs/plans/2026-08-28-priority-components/separator.md`
- 전체 상태: **실행 완료**
- 최종 판정: **PASS — 독립 재QA 통과**
## 단위 체크리스트
- [x] 기본 orientation이 horizontal이다.
- [x] 기본 decorative가 true다.
- [x] decorative에서 `aria-hidden="true"`이고 role이 없다.
- [x] `decorative={false}`에서 `role="separator"`와 `aria-orientation`이 적용된다.
- [x] 명시한 role·ARIA 속성이 보존된다.
- [x] className·style·네이티브 속성·ref가 전달된다.
## 접근성 체크리스트
- [x] 장식 구분선이 접근성 트리에서 제외된다.
- [x] 의미 구분선이 올바른 orientation으로 노출된다.
- [x] decorative/semantic 전환 시 상충하는 기본 ARIA가 남지 않는다.
- [x] 의미가 없는 구분선을 semantic으로 노출하는 story가 없다.
## Storybook 체크리스트
- [x] horizontal/vertical 예가 모두 있다.
- [x] decorative 기본과 semantic opt-in 예가 있다.
- [x] 수직 예는 부모 높이와 stretch 동작을 확인할 수 있다.
- [x] 라이트·다크 StateMatrix에서 neutral weak stroke가 일관된다.
- [x] 모든 공개 prop의 사용 예가 있다.
## 브라우저 체크리스트
- [x] 수평이 기본 100%×1px로 렌더된다.
- [x] 수직이 기본 1px×stretch로 렌더된다.
- [x] 사용자 style로 길이·정렬 재정의가 가능하다.
- [x] 라이트·다크에서 1px 선이 선명하고 토큰이 일관된다.
- [x] 로컬 VR 기준 이미지를 생성하거나 갱신하지 않았다.
## 빌드 체크리스트
- [x] barrel과 Separator subpath에서 타입 안전하게 import된다.
- [x] CSS raw copy와 트리셰이킹 계약이 유지된다.
- [x] `pnpm generate`, `pnpm build`, React 테스트가 통과한다.
- [x] `pnpm typecheck`, publint, `pnpm vr`이 통과한다.
- [x] 새 StateMatrix가 VR 수집 대상이다.
## 실행 명령
```sh
pnpm generate
pnpm build
pnpm --filter @dg-design/react test -- separator
pnpm typecheck
pnpm --filter @dg-design/react exec publint
pnpm --filter @dg-design/storybook dev
pnpm vr
```
## 결과 기입란
| 구분 | 결과 | 근거 / 로그 |
|---|---|---|
| 단위 테스트 | PASS | `separator.test.tsx` 6건 및 React 전체 32 files/342 tests 통과 |
| 접근성 점검 | PASS | decorative 기본과 semantic opt-in의 role·ARIA 우선순위 확인 |
| Storybook 라이트·다크 | PASS | 양 orientation·semantic StateMatrix 독립 재QA, 공백 보완 확인 |
| horizontal/vertical 브라우저 점검 | PASS | Chromium에서 100%×1px, 1px×stretch와 사용자 style 재정의 확인 |
| 브라우저/VR | PASS | `pnpm vr`: 56 PASS/62 SKIP; 로컬 Linux baseline 부재에 따른 정책상 SKIP |
| generate/build | PASS | `pnpm generate`, `pnpm build` 통과 |
| typecheck/publint | PASS | `pnpm typecheck`, publint 통과 |
## 미해결 위험
- 기능상 미해결 위험 없음. 수직 stretch는 Storybook 브라우저 재QA를 통과했다.
- 신규 Linux 기준 이미지가 없는 항목은 로컬 정책에 따라 SKIP되며 CI `visual-baseline`에서만 생성한다.
## 판정 기준
- **합격:** decorative 기본과 semantic opt-in의 role·ARIA가 정확하고, 양 orientation 레이아웃과 필수 명령이 모두 검증된다.
- **불합격:** 장식 요소가 접근성 트리에 노출되거나 semantic orientation이 틀리거나, 1px 레이아웃·빌드 계약이 실패한다.
- 모든 필수 체크와 독립 재QA가 완료되어 **PASS**로 판정한다.
