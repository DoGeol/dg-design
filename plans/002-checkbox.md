# 002 — Checkbox 선택 표시 전환

- Status: 완료 (2026-09-13) — 포인터 전용 아이콘 전환과 겹침 배치 구현
- Commit: 43c9575
- Date: 2026-09-13
- Severity: LOW (기능 결함 판정이 아닌 추가 polish)
- Category: Missed opportunities / Accessibility / Interruptibility
- Estimated scope: 4개 기존 파일 + 공통 브라우저 테스트

## Problem

packages/react/src/checkbox/checkbox.css:42:
```css
.dds-checkbox__check-icon,
.dds-checkbox__dash-icon {
  display: none;
  width: 70%;
  height: 70%;
}
```
checked/indeterminate에서 display:block으로 즉시 전환된다. Checkbox.tsx:58 부근 effect는 indeterminate DOM 프로퍼티를 직접 반영한다.

## Target

- motion 기본 auto. 실제 포인터 클릭으로 변경된 아이콘만 opacity 0↔1, scale 0.95↔1, 150ms cubic-bezier(0, 0, 0.2, 1).
- 키보드 Space, 폼 reset, 외부 checked/indeterminate 변경, 초기 선택 상태는 즉시 표시한다. 의미 checked는 항상 즉시 변경된다.
- 아이콘을 같은 셀에 겹쳐 배치하고 현재 checked/indeterminate CSS 선택자를 유지한다. 중간 상태에서는 dash만 표시한다. 배경·테두리는 현재처럼 즉시 변경.
- reduce는 scale 없이 opacity만, none은 전부 즉시. 대량 선택 화면은 none 사용.

## Steps

1. packages/react/src/checkbox/Checkbox.tsx에 motion prop을 추가하고 label의 포인터 클릭과 input의 실제 change를 연결한다. label 클릭이 생성하는 input click을 중복 처리하지 않는다. 키보드 click(detail=0), 취소·disabled에는 모션을 허용하지 않는다.
2. 포인터 의도는 해당 이벤트에만 사용하고 작업 종료 후 정리한다. 전역 마지막 입력 방식 플래그를 쓰지 않는다. 소비자가 나중에 controlled 값을 갱신하면 프로그램 변경으로 즉시 처리한다. 사용자 핸들러의 preventDefault 및 ref 전달을 보존한다.
3. packages/react/src/checkbox/checkbox.css에서 display 토글을 겹친 아이콘의 opacity/transform으로 바꾼다. 모션 허용 여부를 바꿀 때도 의미 상태 CSS가 최종 진실이어야 한다. 반복 클릭은 CSS transition으로 현재값에서 이어진다.
4. checkbox.test.tsx 및 apps/storybook/src/Checkbox.stories.tsx: label/input 각각 클릭, Space, controlled·uncontrolled, indeterminate, reset, disabled, none, 빠른 반전 검증.

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

- 대상 단위 테스트: `pnpm --filter @dg-design/react exec vitest run src/checkbox`. 인터랙션은 user-event 사용. jsdom으로 프레임이나 레이아웃 정확성을 판정하지 않는다.
- Storybook의 해당 파일에 MotionDemo를 추가하고 최초 상태는 정지 상태로 둔다. 기존 state-matrix를 시간 의존 데모로 바꾸지 않는다.
- 브라우저 기능 검증: `apps/visual-regression/tests/component-motion-functional.spec.ts`에 대상별 describe를 순서대로 추가한다. 일반 모션 검증은 명시적으로 `page.emulateMedia({ reducedMotion: "no-preference" })`; reduce도 별도 검증한다. 기존 Playwright 기본값이 reduce임에 주의한다.
- 실제 브라우저에서 일반 속도와 DevTools 10% 재생으로 확인한다. 150ms 안에 연속 전환해도 처음 상태로 튀지 않고 최신 상태로 수렴해야 한다. 모션 도중 키보드 입력·설정 변경도 즉시 반영한다.
- 단계별로 대상 테스트와 feel check를 수행한다. 통합 마지막에 `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`를 실행한다.
- VR은 최종 정적 상태를 검증하고 시간 변화는 기능 테스트와 육안으로 검증한다. 로컬 -u 및 기준 이미지 생성 금지. 기준 변경이 필요하면 CI visual-baseline 워크플로로만 갱신한다.

## Done when

아이콘 겹침·박스 크기 변화 없이 최종 체크/중간 상태가 일치. 포인터 뒤 프로그램 변경이나 키보드 사용에 모션 허용 상태가 남지 않는다.

## 구현 결과 (2026-09-13)

- `Checkbox`에 `motion?: "auto" | "none"`(기본 `auto`)을 추가하고, **포인터로 누른 변경에서만** 아이콘이 `opacity 0↔1` · `transform scale(0.95)↔none`으로 150ms 전환한다. 키보드 Space·폼 reset·외부 값 변경·최초 렌더·disabled는 즉시.
- 입력 방식은 **input의 click 이벤트 한 곳**에서만 가른다. 실측(Chromium): label 텍스트·박스·input 직접 클릭 모두 input에 `PointerEvent detail=1`로 도착하고, 키보드 Space와 프로그램 `.click()`은 `detail=0`이다. 전역 "마지막 입력 방식" 플래그는 쓰지 않고, 전환이 끝나면 `data-motion`이 스스로 꺼진다.
- `display` 토글을 겹친 아이콘의 opacity로 바꿨다. 겹침은 `position: absolute`로 흐름에서 빼는데, 흐름에 남기면 박스의 baseline이 선택 여부에 따라 달라진다.

**검증**: `vitest run src/checkbox` 14 passed · `playwright test checkbox-motion` 6 passed · reduce에서는 scale 없이 opacity만 전환됨을 브라우저로 확인.

**부수 발견**: 기존 `display` 토글이 **보이는 label이 없는 체크박스**(aria-label만 쓰는 경우)의 baseline을 상태에 따라 바꿔, 체크 시 박스가 medium 2.11px · large 1.84px 내려앉았다. 겹침 배치가 이를 고정한다 — unchecked 칸은 좌표까지 동일하고 checked·indeterminate 칸만 unchecked와 같은 줄로 올라온다.

**남은 기준 갱신**: `checkbox--state-matrix-story` light·dark **PNG**(위 정렬 교정 반영). CI `visual-baseline` 워크플로에서만 갱신한다.
