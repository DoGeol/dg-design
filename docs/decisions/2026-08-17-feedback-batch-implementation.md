# 알림 묶음 구현 중 결정 (Toast·Alert·Spinner·Progress·Button loading)

- 날짜: 2026-08-17
- 스펙: [알림 묶음](../specs/archive/2026-08-17-feedback-batch.md)
- 상태: 활성

웨이브 0(공유 자산 단독) → 웨이브 1(병렬 5). 에이전트 에스컬레이션 0건, 감독이 수거 단계에서 결함 3건을 잡았다.

## 공유 자산

- **inert 면제는 `registerNotificationLayer(container)` 하나** — 스택 엔트리에 플래그를 넣는 안은 버렸다. 그러면 알림 레이어가 ESC 라우팅·스크롤 잠금 스택에 얹혀 modal/notification 조합마다 분기가 생긴다. 스택과 분리된 Set이 면제 범위가 가장 좁다
- **명시 등록된 컨테이너 인스턴스만 면제** — 클래스·속성·selector 기반 조건은 모달 격리 우회 경로가 된다
- 등록·해제 양쪽에서 `syncInert()`를 즉시 호출 — 등록 시점이 모달 오픈 전/후냐로 동작이 갈리지 않게. 테스트 2건이 양쪽을 고정한다
- **`--dds-z-toast: 2100`** — viewport는 마운트 시 1회 생성돼 나중에 append되는 모달 portal 아래로 깔린다. "DOM 순서가 오버레이 순서를 정한다"는 규칙이 유일하게 통하지 않는 지점이라 값으로 올렸다
- **`--dds-easing-linear` 신설이 "easing 1종 YAGNI" 결정을 뒤집지 않는 이유**: 무한 회전은 전이가 아니라 반복이라 감속 곡선을 쓰면 매 바퀴 이음매가 보인다. 유한 전이용 곡선을 늘린 게 아니라 '무한 애니메이션'이라는 새 범주가 생긴 것이다. `--dds-duration-spin: 1000ms`는 Tailwind `animate-spin`과 같은 값 — 사용자가 "정상"으로 읽는 속도

## Toast

- 지속시간 5000ms, 최대 동시 3개, 우하단 고정. 위치 prop 없음
- 초과분은 즉시 제거가 아니라 `open=false`로 퇴장 애니메이션을 태운 뒤 제거
- **일시정지 해제 시 남은 시간이 아니라 전체 지속시간을 다시 센다** — 방금 읽던 항목을 손 떼자마자 지우지 않기 위해
- viewport는 `pointer-events: none`, 항목만 `auto` — 항상 떠 있는 빈 컨테이너가 우하단 클릭을 먹지 않게
- 마크업은 div+div. `ol`/`li`로 하면 항목의 `role=status`·`alert`가 `listitem`을 덮어 리스트 시맨틱이 깨진다
- 테스트에 `vi.useFakeTimers({ shouldAdvanceTime: true })` + `userEvent.setup({ delay: null })` — 순수 가짜 시계에서는 user-event의 대기 프라미스가 안 풀린다

## Alert

- `onClose` 콜백 prop으로 닫기 노출(제공 시에만 렌더). compound 서브컴포넌트가 아니라 Badge류 leaf 관례
- `bg-{intent}-weak` + `fg-{intent}`만 사용 — 대비 검사 기존 통과분, 신규 색 토큰 0(semantic 47 불변으로 확인)

## Button loading

- `[data-loading]`을 disabled 3중 매칭 셀렉터 11곳 전부에 합류. 하나라도 빠지면 loading 중 hover 색이 뜬다
- `asChild`와 배타. 타입으로 막지 않고 런타임 경고 — 조건부 prop 타입은 소비자 추론을 망친다

## 감독이 수거 단계에서 잡은 것

1. **Button `asChild` 파손(회귀)** — `{isLoading && <Spinner/>}{children}`은 `isLoading`이 false여도 자식 배열이 2개라 Slot의 `React.Children.only`가 실패한다. `asChild` 테스트 2건이 잡았다. 삼항으로 갈라 loading일 때만 Fragment로 감쌌다
2. **CSS 텍스트 검사 테스트 + `node:fs` 타입 shim 제거** — reduced-motion을 유닛 테스트에서 CSS 원문 정규식으로 확인하고 있었다. 포맷만 바뀌어도 깨지면서 적용 여부는 증명하지 못하고, 브라우저 라이브러리에 node 타입 shim이 들어간다. Playwright의 `emulateMedia`로 옮겨 실제 computed style을 본다
3. **`process.env.NODE_ENV` 타입 의존 제거** — 브라우저 라이브러리에 node 타입이 없다. shim을 또 만드는 대신 항상 경고하기로 했다. `asChild`+`loading`은 언제나 사용 실수라 프로덕션에서도 보이는 편이 낫다

## 부수 발견 — VR 설정의 `reducedMotion`이 무효

`playwright.config.ts`의 `use.reducedMotion: "reduce"`가 **`matchMedia`에 반영되지 않는다**(실측: config 경로 `mq: false`, 런타임 `emulateMedia` 경로 `mq: true`). 그래서 reduced-motion 테스트는 설정에 기대지 않고 테스트마다 `emulateMedia`로 직접 걸고, 대조군으로 "원래도 안 돌았다" 통과를 막는다.

VR 스크린샷 안정성은 `toHaveScreenshot`의 `animations: "disabled"`가 따로 담당하고 있어 기존 기준에는 영향이 없다. 설정의 해당 줄은 실효가 없는 상태로 남아 있다 — 지울지 고칠지는 별도 판단.
