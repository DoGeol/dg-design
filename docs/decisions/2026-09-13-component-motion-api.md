# 컴포넌트 모션 API 결정

- 날짜: 2026-09-13
- 계획: [컴포넌트 애니메이션 추가 계획](../../plans/README.md) 6건(001~006)
- 근거: [토큰 체계와 a11y 기준선](./2026-08-14-dds-token-system.md), [Dialog 구현 중 결정](./2026-08-15-dialog-implementation.md)(모션 토큰 값), [알림 묶음 구현 중 결정](./2026-08-17-feedback-batch-implementation.md)(VR reducedMotion 무효 발견)
- 상태: 활성

6종 컴포넌트(SaveStatus · Checkbox · RadioGroup · Tabs · Button · Avatar)에 모션을 넣으면서 정한 공통 규칙이다. 개별 구현 내용은 각 계획 문서의 "구현 결과" 절에 있다.

## 1. 공개 API — `motion?: "auto" | "none"`

값 두 개짜리 optional prop 하나만 공개한다. duration·easing·활성 이벤트를 소비자가 고르게 하면 디자인 시스템이 아니라 애니메이션 라이브러리가 된다.

| 컴포넌트 | 받는 곳 | 기본값 | `auto`가 움직이는 것 |
| --- | --- | --- | --- |
| SaveStatus | leaf 자신 | `auto` | saving → saved에서만 아이콘 교차 페이드 |
| Checkbox | leaf 자신 | `auto` | 포인터로 누른 변경의 체크·대시 아이콘(opacity + scale) |
| RadioGroup | `Root` | `auto` | 포인터 선택의 기본형 점 교차, segmented 선택 배경 이동 |
| Tabs | `Root` | `auto` | 포인터로 고른 탭의 활성 밑줄 이동 |
| Button | 자신 | `auto` | 로딩 라벨 ↔ 중앙 Spinner 교차 |
| Avatar | `Root` | **`none`** | (명시 시) 네트워크로 새로 받은 이미지 페이드인 |

- prop은 DOM으로 넘기지 않는다. CSS 게이트가 필요한 곳은 비공개 `data-motion` 속성으로 옮긴다.
- `none`은 **이번에 추가한 전환만** 끈다. 레이아웃 안정화(Button의 폭 고정 등)와 의미 상태는 `none`에서도 그대로다.
- Spinner의 기존 무한 회전 정책은 건드리지 않는다.

## 2. 기본값을 Avatar만 뒤집은 이유

Avatar는 목록에서 수십 개가 한꺼번에 그려지는 유일한 대상이다. 기본을 `auto`로 두면 목록이 열릴 때마다 아바타가 우수수 나타난다. 나머지 다섯은 화면에 한두 개씩 있고 사용자 조작이나 비동기 완료에 붙는 피드백이라 기본을 `auto`로 둔다. 즉 **"기본값은 화면에 몇 개가 있느냐"로 갈랐다.**

## 3. 값은 기존 토큰만 — 150ms · `cubic-bezier(0, 0, 0.2, 1)`

`--dds-duration-fast`(150ms)와 `--dds-easing-out`을 그대로 쓴다. 새 duration·easing 토큰도, 애니메이션 라이브러리 의존성도 추가하지 않았다. WAAPI는 CSS 변수를 읽지 못해 `use-selection-indicator.ts`에 같은 값을 상수로 두고 주석으로 출처를 묶어 뒀다.

바꾸는 속성은 `opacity`와 `transform`뿐이다. `width`·`left` 같은 레이아웃 속성은 전환하지 않고 최종값으로 즉시 넣는다(아래 4).

## 4. 이동은 FLIP, 헬퍼는 하나

RadioGroup segmented 배경과 Tabs 활성 밑줄은 같은 문제(선택된 항목 위로 표시 하나를 옮긴다)라 `packages/react/src/internal/use-selection-indicator.ts` 하나를 003에서 만들고 004가 재사용한다.

- 좌표·크기는 측정 즉시 최종값으로 넣고, 직전에 "보이던" 사각형으로 되돌리는 역보정 transform을 WAAPI로 identity까지 되돌린다.
- 진행 중 이동을 가로채면 **취소하기 전에 현재 화면 사각형을 읽어** 새 이동의 시작점으로 쓴다 — 처음 위치로 튀지 않는다.
- 측정은 커밋마다 도는 layout effect에서 한다. ResizeObserver는 크기 변화만 보기 때문에 `dir` 전환처럼 **위치만** 바뀌는 경우를 놓친다(003에서 370px 어긋남으로 실측). 목표 사각형이 그대로면 곧바로 빠져나가 DOM 쓰기도, 진행 중 이동 취소도 없다.
- 측정할 수 없는 환경(SSR·jsdom·0 크기·숨겨진 컨테이너)에서는 배치를 포기하고 호출자가 기존 표시를 fallback으로 남긴다.
- Tabs 밑줄처럼 세로 이동이 의미 없는 표시는 `axis: "horizontal"` 옵션으로 가로만 쓴다.

## 5. 포인터 대 키보드 — 무엇이 움직이는지 가르는 규칙

선택 컨트롤(Checkbox · RadioGroup · Tabs)의 `auto`는 **포인터로 누른 변경만** 움직인다. 키보드·프로그램 변경·폼 reset·최초 렌더는 언제나 즉시다. 키보드 사용자는 연속 이동이 잦아 전환이 밀리면 느려 보인다.

판별은 전역 "마지막 입력 방식" 플래그를 쓰지 않고 해당 이벤트 안에서만 한다.

- **Checkbox · RadioGroup**: input의 `click` 이벤트 `detail`. 실측(Chromium) — label 텍스트·박스·input 직접 클릭 모두 input에 `PointerEvent detail=1`로 도착하고, 키보드 Space/화살표와 프로그램 `.click()`은 `detail=0`이다. radio는 `click`이 `change`보다 먼저 와서 판정이 늦지 않는다.
- **Tabs**: automatic 활성화가 `focus`에서 일어나 `click`보다 이르다. 그래서 `pointerdown`에서 기록하고 `click`(focus 활성화와 Safari의 click 활성화 모두 그 뒤)·`pointercancel`·`keydown`에서 내린다. keydown 정리는 `moveFocus`가 부르는 활성화보다 먼저 돌아야 한다.
- 의도는 **실제 값이 바뀌는 순간에만** 찍고 배치 직후 지운다. 선택이 바뀌지 않는 클릭이나 늦게 도착한 controlled 변경에 번지지 않는다.

비동기 전환(SaveStatus의 저장 완료, Button의 로딩, Avatar의 이미지 로드)에는 이 규칙이 없다. 대신 각자의 "즉시" 조건을 갖는다 — 최초 렌더/hydration, 캐시 완료, 오류.

## 6. reduced motion

`prefers-reduced-motion: reduce`에서는 위치·확대 전환을 빼고 opacity만 150ms로 남긴다(Checkbox의 scale이 유일한 제거 대상). 이동이 있는 RadioGroup·Tabs 배경은 reduce에서 아예 움직이지 않고 즉시 정렬한다. WAAPI는 미디어쿼리를 따르지 않으므로 JS에서 `matchMedia`로 직접 확인한다.

Playwright 기본값이 `reducedMotion: "reduce"`라 일반 모션 검증은 테스트마다 `page.emulateMedia({ reducedMotion: "no-preference" })`로 명시적으로 해제한다.

## 7. 실측으로 얻은 CSS 불변식 두 가지

1. **`transition-property: none`을 기본값에 명시한다.** 기본값 `all`은 duration이 0이어도 "전환 가능"으로 쳐서, 모션을 끄는 순간 진행 중인 전환이 취소되지 않고 끝까지 달린다(001에서 중단 직후 opacity 0.58로 계속 진행하는 것을 관측). `none`이어야 중단이 즉시 최종값으로 간다.
2. **`display`를 정하는 요소 옆에는 `[hidden] { display: none }` 가드를 둔다.** author display가 UA의 `[hidden]`을 이긴다 — Avatar fallback이 `loaded` 상태에서도 계속 `display: flex`로 남아 있었다(AGENTS.md에 이미 있는 규칙이지만 006에서 실제 누락을 확인).

곁들여, 대체 요소(`img`)는 `inset: 0`만으로는 늘어나지 않고 고유 크기를 쓴다 — 겹침 배치에는 `width/height: 100%`가 함께 필요하다.

## 8. VR 기준 이미지는 CI에서만 갱신한다

시간 변화는 스크린샷으로 검증하지 않는다. VR은 최종 정적 상태만 보고, 움직임은 `apps/visual-regression/tests/*-motion.spec.ts`(6파일 33건)와 10% 재생 육안 확인이 담당한다.

정적 상태가 바뀐 컴포넌트는 기준 이미지 갱신이 필요하고, **로컬 `-u`는 가드가 막으므로 CI `visual-baseline` 워크플로 수동 트리거로만** 갱신한다. 이번 6건에서 남은 대상은 `checkbox--state-matrix-story`(PNG) · `radiogroup--state-matrix-story`(TXT) · `tabs--state-matrix`(TXT) 세 건이다.

기준 흔들림을 줄이려고 **장식 레이어에는 `dds-` 클래스를 주지 않고 `data-layer` 속성으로 구분**했다. 색 텍스트 스냅샷이 `[class*="dds-"]`만 훑기 때문에, SaveStatus·Button의 새 레이어는 기준을 전혀 건드리지 않는다. 반대로 RadioGroup·Tabs의 선택 표시는 소비자가 알아야 할 컴포넌트 부품이라 BEM 클래스를 주고 기준 갱신을 감수했다.
