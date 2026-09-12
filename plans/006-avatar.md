# 006 — Avatar 지연 로딩 이미지 페이드

- Status: 완료 (2026-09-13) — 기본 none, auto 지연 로드 페이드 구현
- Commit: 43c9575
- Date: 2026-09-13
- Severity: LOW (기능 결함 판정이 아닌 추가 polish)
- Category: Missed opportunities / Accessibility / Interruptibility
- Estimated scope: 4개 기존 파일 + 공통 브라우저 테스트

## Problem

packages/react/src/avatar/Avatar.tsx:106:
```tsx
hidden={loadingState !== "loaded"}
```
Fallback은 :124에서 loaded일 때 hidden 처리한다. 이미지가 준비되면 즉시 교체된다. avatar.css의 fallback display:flex 옆에 [hidden] 가드가 없어 브라우저 표시 검증이 필요하다.

## Target

- Avatar.Root motion 기본 none. motion="auto"를 선택한 프로필 영역에서만 네트워크 로드 완료 이미지 opacity 0→1, 150ms cubic-bezier(0, 0, 0.2, 1). 대량 목록은 기존 기본값 유지.
- 캐시 완료 판정(image.complete && naturalWidth > 0 && naturalHeight > 0), 초기 SSR/hydration, 오류 복귀는 즉시 표시. src 변경으로 시작한 새 로드도 해당 요청의 준비 결과만 사용한다.
- Root 크기 24/36/48/64px와 Badge 위치 고정. 이미지/fallback 레이어를 같은 영역에 겹친다. 로드 전 img hidden, 오류 시 fallback 즉시 복원.
- fade 중 fallback은 시각적으로 남기되 접근성 트리에서는 숨겨 이미지와 중복 안내하지 않는다. 150ms 완료 시 hidden으로 제거. none은 기존 hidden 전환.
- reduce는 opacity만 유지. Avatar의 overflow:visible을 유지해 Badge가 잘리지 않게 한다.

## Steps

1. packages/react/src/avatar/Avatar.tsx의 Root prop/context에 motion 및 로드 경로(캐시 즉시/비동기)를 추가한다. 초기 loading 상태와 effect 완료 판정으로 hydration-safe 계약을 유지한다.
2. Image의 onLoad에서 현재 src에 속한 이벤트인지 확인하고 연결 해제·이전 요청 결과가 새 상태를 덮지 않게 한다. src 변경/에러/none 변경 시 진행 중 fade를 취소한다. onLoad/onError 소비자 콜백을 보존한다.
3. avatar.css에 레이어 배치와 opacity transition을 추가한다. 등장 시작 프레임을 적용한 뒤 목표 opacity로 전환하는 단발 rAF를 사용하고 cleanup한다. 캐시 경로는 시작 프레임 없이 최종 표시.
4. 시각 fallback 유지는 장식 처리와 hidden 종료를 분리한다. display 규칙 바로 옆에 image/fallback [hidden] 가드를 추가한다. 이것은 기존 기본 모드에도 적용되므로 정적 VR 변화 여부를 따로 확인한다.
5. avatar.test.tsx 및 apps/storybook/src/Avatar.stories.tsx에서 캐시 완료, 네트워크 지연, 에러, src 빠른 교체, hydration, badge, none/auto를 다룬다. 이미지 이벤트 검증은 실제 브라우저 네트워크 응답 제어로 수행한다.

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

- 대상 단위 테스트: `pnpm --filter @dg-design/react exec vitest run src/avatar`. 인터랙션은 user-event 사용. jsdom으로 프레임이나 레이아웃 정확성을 판정하지 않는다.
- Storybook의 해당 파일에 MotionDemo를 추가하고 최초 상태는 정지 상태로 둔다. 기존 state-matrix를 시간 의존 데모로 바꾸지 않는다.
- 브라우저 기능 검증: `apps/visual-regression/tests/component-motion-functional.spec.ts`에 대상별 describe를 순서대로 추가한다. 일반 모션 검증은 명시적으로 `page.emulateMedia({ reducedMotion: "no-preference" })`; reduce도 별도 검증한다. 기존 Playwright 기본값이 reduce임에 주의한다.
- 실제 브라우저에서 일반 속도와 DevTools 10% 재생으로 확인한다. 150ms 안에 연속 전환해도 처음 상태로 튀지 않고 최신 상태로 수렴해야 한다. 모션 도중 키보드 입력·설정 변경도 즉시 반영한다.
- 단계별로 대상 테스트와 feel check를 수행한다. 통합 마지막에 `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`를 실행한다.
- VR은 최종 정적 상태를 검증하고 시간 변화는 기능 테스트와 육안으로 검증한다. 로컬 -u 및 기준 이미지 생성 금지. 기준 변경이 필요하면 CI visual-baseline 워크플로로만 갱신한다.

## Done when

대량 목록 기본 모드에서 새 등장 모션 없음. auto 지연 로드만 페이드, 캐시·오류 즉시 반영, 이미지와 fallback 중복 접근 이름 없음, src 교체 후 오래된 이미지 잔상 없음.

## 구현 결과 (2026-09-13)

- `Avatar.Root`에 `motion?: "auto" | "none"`을 추가하되 **기본값은 `none`** — 대량 목록에서 아바타가 우수수 나타나지 않는다. `auto`를 고른 곳에서만 네트워크로 새로 받은 이미지가 150ms 페이드인한다.
- 캐시 완료(`complete && naturalWidth > 0 && naturalHeight > 0`)·최초 렌더/hydration·오류 복귀는 즉시. src를 갈아끼우면 진행 중 페이드를 취소하고, `onLoad`는 지금 걸린 src의 이벤트만 상태로 받되 소비자 콜백은 언제나 그대로 부른다.
- 페이드 중 fallback은 이미지 뒤에 그대로 남아 빈 자리를 막되 `aria-hidden`으로 접근성 트리에서 빠지고, 전환이 끝나면 평소대로 `hidden`으로 접는다. Root 크기와 Badge 위치는 고정이고 `overflow: visible`도 그대로다.

**검증**: `vitest run src/avatar` 17 passed · `playwright test avatar-motion` 5 passed(6회 반복 30/30, 응답을 직접 가로채 지연 로드를 만들어 검증) · 체감 곡선 opacity 0 → 0.60 → 0.88 → 1(150ms), 폭 64px 고정.

**구현 중 잡은 문제 3건**: (1) 계획이 지목한 대로 `[hidden]` 가드가 없어 `loaded` 상태에서도 fallback의 computed display가 `flex`로 남아 있었다(폭 0이라 안 보였을 뿐) — display 규칙 옆에 가드를 넣었다. (2) 대체 요소인 `img`는 `inset: 0`만으로 늘어나지 않아 24px 아바타에서 고유 크기 64px로 삐져나왔다 — `width/height: 100%`가 함께 필요하다. (3) rAF 콜백이 스타일 계산보다 앞서 돌아 시작 프레임이 합쳐지면서 페이드가 통째로 건너뛰어졌다(6회 중 2회) — 커밋 직후 layout effect에서 시작 opacity를 강제로 계산시킨 뒤 단발 rAF로 목표값을 준다. 캐시 판정도 layout effect로 옮겨(항상 load 이벤트보다 먼저) 캐시가 비동기 경로로 새던 간헐 실패를 없앴다.

**남은 기준 갱신**: 없음. `avatar--state-matrix` 7개 아바타의 root·image·badge 사각형이 A/B 실측에서 완전히 동일하고, 유일한 차이는 fallback이 "폭 0짜리 flex 상자"에서 `display: none`으로 바뀐 것(둘 다 아무것도 칠하지 않는다)이다.
