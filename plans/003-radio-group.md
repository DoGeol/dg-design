# 003 — RadioGroup 선택 점과 Segmented 배경 이동

- Status: 완료 (2026-09-13) — 점 페이드와 segmented 배경 FLIP 이동 구현
- Commit: 43c9575
- Date: 2026-09-13
- Severity: LOW (기능 결함 판정이 아닌 추가 polish)
- Category: Missed opportunities / Accessibility / Interruptibility
- Estimated scope: 5개 기존 파일 + 내부 위치 계산 파일 1개 + 공통 브라우저 테스트

## Problem

packages/react/src/radio-group/radio-group.css:65:
```css
.dds-radio__input:checked ~ .dds-radio__box .dds-radio__dot {
  display: block;
}
```
기본형 점은 즉시 표시된다. :151의 segmented transition은 background-color/color/box-shadow 0.15s ease이며 항목 사이를 이동하는 배경은 없다. RadioGroup.tsx는 name을 공유하는 네이티브 radio에 선택/방향키를 위임한다.

## Target

- motion 기본 auto. 기본형 점은 포인터 선택에 opacity 0↔1, 150ms cubic-bezier(0, 0, 0.2, 1).
- segmented는 aria-hidden·pointer-events:none 배경 1개를 루트 안에 두고 선택 항목 위치/크기로 이동. 텍스트와 실제 input은 움직이지 않는다.
- 실제 left/width/height는 측정 시 최종값으로 즉시 설정하고, 직전 화면 rect에서 새 rect로 translateX/translateY/scaleX/scaleY를 역보정한 뒤 transform을 150ms에 identity로 전환하는 FLIP 방식. 글자를 배경 안에 넣지 않는다.
- 초기 렌더/키보드/controlled 외부 변경/resize는 즉시 정렬. reduce에서는 이동 없이 선택 배경을 즉시 옮기고 기본형 점의 opacity만 유지.
- 기존 segmented 색·그림자 정착값은 보존한다. selected 항목의 중복 배경을 제거하고 텍스트 변화는 즉시 반영.

## Steps

1. RadioGroup.tsx와 radio-group-context.ts에 motion 및 해당 포인터 선택 의도를 전달한다. 네이티브 input/change, name, disabled 및 방향 제한은 유지한다. 취소/이벤트 종료 후 의도를 정리하여 지연 controlled 변경에 전파하지 않는다.
2. 기본형은 radio-group.css의 점 display를 opacity 전환으로 바꾼다.
3. segmented 배경을 추가하고 packages/react/src/internal/use-selection-indicator.ts에 컨테이너/선택 요소 rect 측정과 FLIP 중단 처리를 분리한다. 선택 요소 ref 등록을 사용하고 value를 CSS 선택자 문자열로 삽입하지 않는다.
4. 실제 보이는 rect를 새 전환의 시작점으로 캡처하고 진행 중 animation을 취소 후 다시 연결한다. WAAPI transform keyframes [{ transform: inverse }, { transform: "none" }]에 duration 150, easing cubic-bezier(0, 0, 0.2, 1)을 적용한다. CSS 변수의 부모 갱신이나 상시 프레임 루프를 쓰지 않는다. 기능 미지원/측정 불가에서는 즉시 정렬.
5. ResizeObserver로 컨테이너 및 항목 치수 변화(폰트/라벨/size)를 관찰하고 추가·삭제·스크롤·RTL에서 재측정한다. resize는 모션 없이 정렬하고 observer/animation을 정리한다. 미측정 SSR에서는 기존 항목 배경을 fallback으로 표시한다.
6. radio-group.test.tsx, apps/storybook/src/RadioGroup.stories.tsx에 unequal widths, RTL, 동적 항목, orientation/size, disabled, 키보드, none을 추가한다.

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

- 대상 단위 테스트: `pnpm --filter @dg-design/react exec vitest run src/radio-group`. 인터랙션은 user-event 사용. jsdom으로 프레임이나 레이아웃 정확성을 판정하지 않는다.
- Storybook의 해당 파일에 MotionDemo를 추가하고 최초 상태는 정지 상태로 둔다. 기존 state-matrix를 시간 의존 데모로 바꾸지 않는다.
- 브라우저 기능 검증: `apps/visual-regression/tests/component-motion-functional.spec.ts`에 대상별 describe를 순서대로 추가한다. 일반 모션 검증은 명시적으로 `page.emulateMedia({ reducedMotion: "no-preference" })`; reduce도 별도 검증한다. 기존 Playwright 기본값이 reduce임에 주의한다.
- 실제 브라우저에서 일반 속도와 DevTools 10% 재생으로 확인한다. 150ms 안에 연속 전환해도 처음 상태로 튀지 않고 최신 상태로 수렴해야 한다. 모션 도중 키보드 입력·설정 변경도 즉시 반영한다.
- 단계별로 대상 테스트와 feel check를 수행한다. 통합 마지막에 `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`를 실행한다.
- VR은 최종 정적 상태를 검증하고 시간 변화는 기능 테스트와 육안으로 검증한다. 로컬 -u 및 기준 이미지 생성 금지. 기준 변경이 필요하면 CI visual-baseline 워크플로로만 갱신한다.

## Done when

기본형과 segmented가 같은 선택값을 즉시 표현. 배경은 빠른 역방향 선택에도 현재 위치에서 이동하며 크기/RTL/스크롤 변화 후 정확히 정렬된다. 네이티브 키보드 동작 불변.

## 구현 결과 (2026-09-13)

- `RadioGroup.Root`에 `motion?: "auto" | "none"`(기본 `auto`)을 추가했다. 기본형 점은 포인터 선택에서만 `opacity`가 150ms 교차하고(나가는 점·들어오는 점이 함께), segmented는 루트 안의 `aria-hidden`·`pointer-events: none` 배경 하나가 선택 항목으로 이동한다.
- 이동은 좌표를 최종값으로 즉시 넣고 직전에 "보이던" 사각형으로 되돌리는 역보정 transform을 WAAPI로 identity까지 되돌리는 FLIP이다(150ms, `cubic-bezier(0, 0, 0.2, 1)`). 측정·중단·ResizeObserver는 `packages/react/src/internal/use-selection-indicator.ts`로 분리해 004 Tabs가 그대로 재사용한다.
- 포인터 의도는 **실제 값이 바뀌는 `setValue`에서만** 기록하고 배치 직후 지운다 — 선택이 바뀌지 않는 클릭이나 늦게 온 controlled 변경에 번지지 않는다. 측정 전(SSR·jsdom)에는 기존 항목 배경이 fallback으로 남는다.

**검증**: `vitest run src/radio-group` 29 passed · `playwright test radio-group-motion` 6 passed(3회 반복 18/18) · 정적 상태에서 배경과 선택 항목 사각형 차이 `0.000px` · 이동 구간 실측 t=0 `left 42.0/w 52.0` → t=150 `153.5/148.7`(양 끝이 각 항목과 일치).

**구현 중 잡은 문제 2건**: (1) `dir` 전환은 항목의 **위치만** 바꾸고 크기는 그대로라 ResizeObserver가 보지 못해 배경이 370px 어긋난 채 남았다 — 측정을 커밋마다 도는 layout effect로 옮기고 목표가 같으면 곧바로 빠져나가게 해 해결했다. (2) 선택 항목이 굵어지며 도는 관찰자 콜백이 방금 시작한 이동을 취소하던 것도 같은 가드로 막았다.

**남은 기준 갱신**: `radiogroup--state-matrix-story` light·dark **TXT**(새 배경 요소 줄 추가 + 선택 항목 `background-color`가 transparent로). PNG는 배경이 항목 사각형을 `0.000px` 오차로 덮어 동일하다.
