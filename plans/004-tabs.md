# 004 — Tabs 활성 밑줄 이동

- Status: 완료 (2026-09-13) — 활성 밑줄 FLIP 이동 구현, 공용 모션 스펙 분할 포함
- Commit: 43c9575
- Date: 2026-09-13
- Severity: LOW (기능 결함 판정이 아닌 추가 polish)
- Category: Missed opportunities / Accessibility / Interruptibility
- Estimated scope: 5개 기존 파일 + 내부 위치 계산 재사용 + 공통 브라우저 테스트

## Problem

packages/react/src/tabs/tabs.css:48:
```css
.dds-tabs__trigger[data-state="active"] {
  border-bottom-color: var(--dds-color-fg-brand);
  color: var(--dds-color-fg-brand);
}
```
활성 밑줄이 즉시 교체된다. Tabs.tsx의 onFocus가 automatic activation을 수행하므로 onClick만으로 입력 방식을 판별하면 늦다.

## Target

- Root motion 기본 auto. 포인터로 선택한 탭의 밑줄만 transform 150ms cubic-bezier(0, 0, 0.2, 1).
- 높이 2px, 기존 브랜드 색·밑줄 위치 유지. List 안에 aria-hidden, pointer-events:none 장식 요소 1개를 둔다.
- 포인터 누름에서 의도를 기록해 focus activation에도 전달하고 click·pointercancel·keydown·이벤트 종료에 정리한다. Safari의 click activation 경로를 함께 지원한다.
- Arrow/Home/End/Tab 포커스 및 프로그램 선택은 즉시 정렬. 패널은 현재 hidden 토글 그대로, 폼 상태·role·aria·focus에 지연 없음.
- reduce/none/초기 렌더/resize는 즉시 정렬. responsive wide에서 인디케이터를 숨기고 animation을 취소한다.

## Steps

1. packages/react/src/tabs/Tabs.tsx와 tabs-context.ts에 motion/입력 의도를 연결하되 automatic 활성화·onClick Safari 보완을 유지한다. 사용자 이벤트 취소와 ref를 합성한다.
2. List에 장식 밑줄을 넣기 위해 children을 명시적으로 받아 원래 순서로 렌더한다. selected Trigger ref를 등록한다. 측정 전 SSR에서는 현재 각 Trigger border-bottom을 fallback으로 둔다.
3. packages/react/src/internal/use-selection-indicator.ts를 003에서 재사용한다. 최종 rect에 즉시 배치하고 직전 화면 rect의 inverse transform→none을 WAAPI로 150ms 전환한다. 새 선택은 화면상 현재 rect에서 이어지며 resize/hidden/none 시 취소한다.
4. tabs.css에서 List를 위치 기준으로 삼고 장식 밑줄 준비 후에만 기존 활성 border를 투명 처리한다. 글자/콘텐츠 레이아웃은 유지한다.
5. tabs.test.tsx와 apps/storybook/src/Tabs.stories.tsx에 서로 다른 라벨 길이, 키보드, controlled, 빠른 클릭, 스크롤·RTL·responsive 왕복·항목 제거를 다룬다.

## Repo conventions to follow

- 작업 루트: /Users/pdg/orca/workspaces/dg-design/main-2. 현재 커밋과 차이가 나면 관련 소스를 다시 대조하고 계획의 전제를 갱신한다.
- 기존 CSS transition 예시: packages/react/src/switch/switch.css의 transform 전환.
- packages/tokens/src/tokens.ts:325의 --dds-duration-fast = 150ms, :338의 --dds-easing-out = cubic-bezier(0, 0, 0.2, 1)을 재사용한다. 새 라이브러리·전역 easing·duration 토큰 없음.
- CSS는 @layer dds, 공개 색상은 semantic token만. tokens.css는 소비 앱이 로드한다.
- 새 motion?: "auto" | "none" prop은 DOM에 전달하지 않는다. auto의 기본값은 각 Target에 명시한다. none은 이 계획에서 추가하는 전환을 끈다. 기존 Spinner 회전 정책은 유지한다.
- 최초 렌더·hydration에서는 진입 효과를 실행하지 않는다. 실제 값·checked·disabled·aria는 애니메이션 완료를 기다리지 않는다.
- prefers-reduced-motion: reduce에서는 transform 전환을 제거하고 opacity 전환만 150ms로 유지한다. 선택 컨트롤의 키보드/프로그램 변경 및 모든 대상의 motion="none"은 opacity도 즉시 반영한다. SaveStatus·Button·Avatar의 비동기 전환은 각 Target을 따른다.
- display를 지정하는 요소에 hidden을 쓸 경우 바로 옆에 [hidden] { display: none; }를 둔다.
- 사용자 이벤트 핸들러·ref 합성, disabled 3중 매칭과 기존 compound/named export를 보존한다. CSS 비공개 클래스 추가를 위한 barrel 수정은 불필요하다.

## Boundaries

- 범위는 아래 Steps의 대상 컴포넌트·직접 필요한 internal 코드·해당 테스트와 스토리로 한정한다.
- 기존 오버레이, Accordion/Collapsible, Spinner, Progress, 토큰 패키지의 모션을 변경하지 않는다.
- 애니메이션용 setTimeout으로 의미 상태나 클릭 처리를 지연하지 않는다. 상시 rAF 루프·transition: all·레이아웃 속성 transition을 추가하지 않는다.
- 이 문서는 실행 전 계획이다. 현재 요청은 계획 작성이며 구현·커밋·푸시·배포를 포함하지 않는다.

## Verification

- 대상 단위 테스트: `pnpm --filter @dg-design/react exec vitest run src/tabs`. 인터랙션은 user-event 사용. jsdom으로 프레임이나 레이아웃 정확성을 판정하지 않는다.
- Storybook의 해당 파일에 MotionDemo를 추가하고 최초 상태는 정지 상태로 둔다. 기존 state-matrix를 시간 의존 데모로 바꾸지 않는다.
- 브라우저 기능 검증: `apps/visual-regression/tests/component-motion-functional.spec.ts`에 대상별 describe를 순서대로 추가한다. 일반 모션 검증은 명시적으로 `page.emulateMedia({ reducedMotion: "no-preference" })`; reduce도 별도 검증한다. 기존 Playwright 기본값이 reduce임에 주의한다.
- 실제 브라우저에서 일반 속도와 DevTools 10% 재생으로 확인한다. 150ms 안에 연속 전환해도 처음 상태로 튀지 않고 최신 상태로 수렴해야 한다. 모션 도중 키보드 입력·설정 변경도 즉시 반영한다.
- 단계별로 대상 테스트와 feel check를 수행한다. 통합 마지막에 `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`를 실행한다.
- VR은 최종 정적 상태를 검증하고 시간 변화는 기능 테스트와 육안으로 검증한다. 로컬 -u 및 기준 이미지 생성 금지. 기준 변경이 필요하면 CI visual-baseline 워크플로로만 갱신한다.

## Done when

밑줄과 활성 탭의 rect 일치, 키보드 선택 즉시 반영, wide 전환 후 잔상 없음. 패널 내부 폼 상태 및 wide 모드 접근성 계약 유지.

## 구현 결과 (2026-09-13)

- `Tabs.Root`에 `motion?: "auto" | "none"`(기본 `auto`)을 추가하고, 003의 `use-selection-indicator`를 재사용해 포인터로 고른 탭의 밑줄만 150ms 이동하게 했다. 밑줄은 List 안의 `aria-hidden`·`pointer-events: none` span 하나이고, 상자는 활성 Trigger와 같은 사각형인데 칠하는 건 아래 2px뿐이라 기존 밑줄 위치·색이 그대로다.
- Tabs는 **automatic 활성화가 focus에서** 일어나 click보다 이르다. 그래서 입력 방식을 `pointerdown`에서 기록하고 `click`(focus 활성화와 Safari click 활성화 모두 그 뒤)·`pointercancel`·`keydown`에서 내린다. keydown 정리는 `moveFocus`가 부르는 활성화보다 먼저 돌도록 List keydown 핸들러 맨 앞에 둔다.
- 헬퍼에 `axis: "horizontal"` 옵션(세로 이동·확대 제거)과 "꺼진 동안 진행 중 애니메이션 취소"를 추가했다. responsive wide에서는 List가 `display: none`이라 측정을 멈추고 잔상도 남기지 않는다.
- 계획 수립 당시 하나였던 `component-motion-functional.spec.ts`(599줄)를 `motion-helpers.ts` + 컴포넌트별 `*-motion.spec.ts`로 나눠 모든 파일이 300~500줄 관습 안에 들어왔다(커버리지 동일).

**검증**: `vitest run src/tabs` 19 passed · `playwright test tabs-motion` 6 passed(3회 반복 18/18) · 정적 상태에서 밑줄과 활성 Trigger 사각형 차이 `0.000px` · 이동 구간 t=0 `left 40.0/w 44.0` → t=150 `88.0/124.4`이고 `top`은 불변 · responsive 480↔900 왕복에서 잔상 없이 재정렬되고 패널 입력값도 보존.

**남은 기준 갱신**: `tabs--state-matrix` light·dark **TXT**(새 밑줄 요소 줄 추가 + 활성 Trigger `border-color`가 transparent로). PNG는 동일하다.
