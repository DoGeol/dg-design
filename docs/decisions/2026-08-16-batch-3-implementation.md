# 파생 3종 구현 중 결정 (MultiSelect·Sheet·ContextMenu)

- 날짜: 2026-08-16
- 스펙: [MultiSelect·Sheet·ContextMenu](../specs/archive/2026-08-16-multi-select-sheet-context-menu.md)
- 상태: 활성

웨이브 0(internal 리팩터 단독) → 웨이브 1(병렬 5)로 실행. 에이전트 결정 요청 0건, 감독이 수거 단계에서 버그 1건·경계 불일치 2건을 잡았다.

## internal 리팩터 (웨이브 0)

- **select-core 단일 파일**: 옵션 수집·typeahead·열린 상태 키보드를 `internal/select-core.ts` 하나로 통합. 전부 "옵션 목록 오버레이 공통"이라는 같은 목적이고 300줄 상한에 여유가 크다
- **`handleOpenKeyDown`은 `preventDefault`를 부르지 않고 boolean을 돌려준다** — 호출자가 처리한다. MultiSelect가 같은 분기 뒤에 자기 동작(토글)을 얹기 쉽다
- **`OPTION_ROLE`·`VALUE_ATTR`도 함께 이동** — `handleOpenKeyDown`이 의존하는데 소비자가 각자 하드코딩하면 어긋난다
- **닫힌 상태 typeahead는 Select에 남겼다** — 값 직접 변경은 단일 선택 고유 관례
- **타입 확장은 `ReferenceElement`**(floating-ui가 이미 내보내는 `Element | VirtualElement`) — `computePosition`의 실제 파라미터 타입 그대로라 경계가 정확히 일치하고 수정은 한 단어
- 이동한 두 파일은 이름 유지 — 이름까지 바꾸면 순수 이동이 아니게 되고 grep 흔적이 끊긴다

## MultiSelect

- **CSS 신규 0**: `select.css`와 `dds-select__*` 클래스를 그대로 재사용. 외관이 동일하고 클래스는 비공개 API라 새 파일은 순수 복붙이 된다
- `Group`·`Label`은 Select 것을 별칭 — 값 타입과 무관하게 라벨 id만 주고받는다
- **`name` + 선택 0개면 hidden input을 아예 안 낸다**(Select는 빈 값 input 1개) — 다중값 폼에서 "선택 없음"은 필드 부재로 제출되는 것이 관례
- 닫힌 상태 문자 키는 열기만 하고 **typeahead 버퍼는 건드리지 않는다** — 버퍼를 쌓으면 열린 뒤 첫 글자가 이어치기로 오인된다
- 열림 초기 포커스는 "선택된 값 중 DOM 순서상 첫 옵션" — Select의 단일 선택 자리 규칙을 배열로 자연 확장
- 요약 문구 커스터마이즈 prop 없음 — `Trigger`의 `children`이 이미 탈출구다

## Sheet

- `side`는 **Content가 아니라 Root prop** — presence·스택 배선이 Root에 있고 Content가 side를 몰라도 되게 하면 컨텍스트를 한 번 더 거쳐야 한다. 스토리·테스트가 이 형태를 따랐다
- 크기: 좌우 `width: min(24rem, calc(100% - x8))`, 상하 `height: min(20rem, calc(100% - x8))`. 교차축은 100% (dimension 스케일 최대가 64px이라 rem 리터럴 — `dialog.css` 선례)
- **border-radius 0** — 화면 가장자리에 붙는 패널이라 모서리 둥글림이 어색하다. 필요해지면 안쪽 두 모서리만
- side 변형은 CVA + `.dds-sheet--side_*` (Button 패턴)

## ContextMenu

- **`useOverlay` 대신 primitive 직접 조립**(useControllableState·usePresence·pushDialog·useOverlayPosition) — 커서 기반 VirtualElement 배치가 useOverlay의 "클릭 토글 + 트리거 DOM 기준" 전제와 안 맞는다. HoverCard가 hover 시맨틱 때문에 이미 같은 패턴
- 패널·항목 CSS는 `dropdown-menu.css`를 import해 클래스 재사용 — CSS 자체를 안 늘리는 방식으로 "신규 토큰 0" 달성
- `Trigger` 기본 태그는 `div` — 카드·리스트 행 같은 임의 영역을 감싸는 용도라 버튼 시맨틱을 강제하지 않는다
- `Content`에 `aria-labelledby` 없음 — 트리거가 라벨 있는 버튼이 아니라 연결할 의미 있는 라벨이 없다
- 재우클릭 재배치는 별도 분기 없이 기존 mousedown 닫힘 + contextmenu 열기의 자연스러운 순서로 "닫고 다시 열기" — 스펙이 명시 허용한 동작
- 테스트에서만 `document.documentElement.clientWidth/Height`를 1024/768로 override — jsdom은 이 값이 0이라 floating-ui shift가 좌표를 경계로 뭉갠다

## 감독이 수거 단계에서 잡은 것

1. **MultiSelect 라벨 버그(실제 결함)** — 사용자 컴포넌트로 감싼 옵션(`<DemoOptions />`)의 라벨을 children 트리 스캔이 못 봐서 트리거에 값(`apple`)이 그대로 노출됐다. Select는 마운트 등록 스티키 캐시로 이 구멍을 메우는데 MultiSelect가 그걸 뺐던 것. **캐시를 `useOptionRegistry` 공유 훅으로 올려 양쪽이 소비**하도록 고치고 회귀 테스트를 붙였다. 복제 대신 추출이라 총 줄 수는 오히려 줄었다
2. **스토리 초기 상태 불일치** — Storybook 에이전트가 Sheet·MultiSelect FunctionalDemo에 `defaultOpen`을 넣었는데(VR 캡처 의도), Playwright 에이전트는 트리거 클릭부터 검증하도록 썼다. 오버레이가 트리거를 덮어 7건 중 5건 실패. **VR 타깃은 두 컴포넌트 모두 StateMatrix**(matrix 정규식 우선)라 FunctionalDemo가 열려 있을 이유가 없어 `defaultOpen`을 뺐다
3. **ContextMenu 기능 테스트의 겨냥 오류** — `#storybook-root` 중앙을 우클릭했는데 그 지점은 320×200 트리거 박스 바깥이었다. 트리거 자체를 겨냥하도록 고쳤다

## 레시피 코드젠 재고 판단 (컴포넌트 17종 — 트리거 발동)

**불채택.** 트리거는 개수였지만 근거는 중복이어야 하는데, 이번 배치에서 실제 CSS 중복은 거의 안 생겼다 — MultiSelect·ContextMenu는 CSS 파일을 아예 안 만들고 기존 클래스를 재사용했고, Sheet만 새 CSS를 썼는데 그건 keyframes가 진짜 다르기 때문이다.

다만 **퇴장 애니메이션 패턴**(`[data-state="closed"]` + `animation-name` 교체 + `animation-fill-mode: forwards` + reduced-motion 블록)은 이제 6개 CSS에 복붙돼 있다. 이건 레시피 코드젠이 아니라 공용 CSS 클래스로 풀 문제다.

**다음 재고 트리거**: 개수 기준은 폐기하고 — 퇴장 패턴 복붙이 8개를 넘거나, 같은 외관의 CSS를 세 번째로 복제하게 될 때.
