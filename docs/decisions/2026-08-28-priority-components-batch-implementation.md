# 우선순위 컴포넌트 1차 구현 중 결정

- 날짜: 2026-08-28
- 스펙: [우선순위 컴포넌트 1차 묶음](../specs/archive/2026-08-28-priority-components-batch.md)
- 상태: 활성
- 결과: Skeleton·Avatar·Separator·Collapsible·Accordion 구현 완료, 합격 조건 20/20

## 구현 경계

- Skeleton은 새 tone을 만들지 않고 neutral semantic token과 radius 4종만 공개했다. 크기는 소비자 `style`·`className`에 맡겼다.
- Avatar는 `Root/Image/Fallback/Badge`까지만 compound API로 제공하고 Stack은 보류했다. hydration-safe loading을 기본으로 두고 effect에서 캐시 이미지의 `complete`와 natural size를 판정한다.
- Separator는 장식 사용이 더 흔하므로 decorative를 기본으로 유지하고, 의미가 있을 때만 `role="separator"`와 orientation을 노출한다.
- Collapsible는 독립 공개 primitive로 구현했다. Content DOM을 유지해 폼 상태를 보존하고, 닫힐 때 `aria-hidden`·`inert`로 차단하며 `ResizeObserver`로 실제 높이를 갱신한다.
- Accordion은 Collapsible의 상태·높이 전환과 기존 roving-focus를 조립했다. 별도 headless 계층이나 아이콘 의존성은 추가하지 않았다.

## QA에서 바뀐 결정

- 최초 Accordion QA에서 duplicate `value`가 Trigger/Content ID까지 중복시키는 P1을 발견했다. `value`는 상태 키와 경고에만 쓰고, ARIA ID는 각 Item의 `useId()`에서 만들도록 분리했다.
- 같은 `value` 두 개를 렌더해도 Trigger ID와 Content ID가 각각 고유하고 `aria-controls`·`aria-labelledby`가 양방향으로 연결되는 회귀 테스트를 추가했다.
- Storybook 최초 QA의 P2 공백은 5개 컴포넌트의 상태·조합 예제를 보완해 모두 해소했다. 기능 테스트용 Collapsible·Accordion 데모는 닫힌 상태로 시작하는 규칙을 유지했다.

## 검증과 릴리스 상태

- 독립 재QA: 5종 전부 PASS.
- 최종 검증: `pnpm generate`, `pnpm build`, React 32 files/342 tests, `pnpm typecheck`, publint PASS.
- `pnpm vr`: 56 PASS/62 SKIP. SKIP은 로컬 Linux baseline 부재 정책이며 기준 이미지는 CI에서만 생성한다.
- React 0.12.0은 npm `latest`로 배포됐고 `@dg-design/react@0.12.0` Git 태그가 `main`의 릴리스 커밋을 가리킨다.

## 남긴 범위

- Avatar.Stack과 Toggle 이후 후보는 이번 묶음에 포함하지 않았다.
- publish는 npm 재인증이 필요한 사용자 작업이며, 이번 마감에서 commit·push·publish를 수행하지 않았다.
