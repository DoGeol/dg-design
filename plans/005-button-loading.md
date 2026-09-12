# 005 — Button 로딩 전환과 폭 안정화

- Status: 완료 (2026-09-13) — 로딩 교차 페이드와 폭 안정화 구현
- Commit: 43c9575
- Date: 2026-09-13
- Severity: LOW (기능 결함 판정이 아닌 추가 polish)
- Category: Missed opportunities / Accessibility / Interruptibility
- Estimated scope: 4개 기존 파일 + 공통 브라우저 테스트

## Problem

packages/react/src/button/Button.tsx:68:
```tsx
{isLoading ? (
  <>
    <Spinner className="dds-button__spinner" aria-hidden="true" />
    {children}
  </>
) : (
  children
)}
```
Spinner가 inline-flex 흐름에 추가되므로 로딩 시 버튼 폭/내용 위치가 바뀔 수 있다. opacity만 추가하면 이 배치 변화는 남는다.

## Target

- motion 기본 auto. 기본 button에서 원래 children이 차지하는 크기를 유지하고 로딩 동안 children opacity 1→0, 중앙 장식 Spinner opacity 0→1, 150ms cubic-bezier(0, 0, 0.2, 1). 복귀는 반대.
- Spinner는 position:absolute 중앙 배치로 레이아웃 계산에서 제외한다. 버튼 크기는 children의 고정된 자리로 결정한다. width 자체를 애니메이션하지 않는다.
- 로딩 시 라벨이 보이는 기존 디자인에서 중앙 Spinner로 바뀌는 제안이다. 접근 가능한 이름은 기존 children/aria-label로 유지한다. 버튼 width 불변은 children·외부 style이 동일한 전환에 한정한다.
- disabled 및 aria-busy는 첫 상태 변경에 즉시 반영. none에서도 레이아웃 안정화는 유지하고 페이드만 끈다. reduce는 opacity만 유지.
- asChild는 기존 Slot 경로 그대로: 래퍼/Spinner를 추가하지 않으며 loading 무시·경고 정책도 유지한다.

## Steps

1. packages/react/src/button/Button.tsx의 일반 button 경로에 children용 span을 항상 유지하고 중앙 Spinner 레이어를 추가한다. children 래퍼는 inline-flex, align-items:center, gap:inherit로 기존 다중 자식 간격을 재현한다. asChild 분기를 먼저 분리한다.
2. packages/react/src/button/button.css에서 button relative, children opacity, Spinner absolute inset:0 + flex center 레이어를 정의한다. wrapper가 width/flex 소비자 스타일에 주는 영향을 확인한다. 아이콘 전용·긴 라벨·전체 폭 버튼도 보존한다.
3. 숨은 Spinner는 회전을 멈추거나 전환 종료 후 제거한다. 빠른 재진입은 동일 레이어의 opacity에서 이어가고 이벤트가 유실되어도 클릭 잠금 해제와 busy는 props대로 즉시 반영한다.
4. button.test.tsx 및 apps/storybook/src/Button.stories.tsx에 loading 왕복, loading 해제 후 disabled 유지, 접근 이름, asChild, 아이콘+라벨, none 예제를 추가한다.

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

- 대상 단위 테스트: `pnpm --filter @dg-design/react exec vitest run src/button`. 인터랙션은 user-event 사용. jsdom으로 프레임이나 레이아웃 정확성을 판정하지 않는다.
- Storybook의 해당 파일에 MotionDemo를 추가하고 최초 상태는 정지 상태로 둔다. 기존 state-matrix를 시간 의존 데모로 바꾸지 않는다.
- 브라우저 기능 검증: `apps/visual-regression/tests/component-motion-functional.spec.ts`에 대상별 describe를 순서대로 추가한다. 일반 모션 검증은 명시적으로 `page.emulateMedia({ reducedMotion: "no-preference" })`; reduce도 별도 검증한다. 기존 Playwright 기본값이 reduce임에 주의한다.
- 실제 브라우저에서 일반 속도와 DevTools 10% 재생으로 확인한다. 150ms 안에 연속 전환해도 처음 상태로 튀지 않고 최신 상태로 수렴해야 한다. 모션 도중 키보드 입력·설정 변경도 즉시 반영한다.
- 단계별로 대상 테스트와 feel check를 수행한다. 통합 마지막에 `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`를 실행한다.
- VR은 최종 정적 상태를 검증하고 시간 변화는 기능 테스트와 육안으로 검증한다. 로컬 -u 및 기준 이미지 생성 금지. 기준 변경이 필요하면 CI visual-baseline 워크플로로만 갱신한다.

## Done when

동일 children에서 로딩 전/중/후 버튼 bounding box 동일(브라우저 오차 1px 이내), 중앙 Spinner와 텍스트가 지속적으로 겹치지 않음. 접근 이름 유지·중복 제출 차단·asChild 동작 유지.

## 구현 결과 (2026-09-13)

- `Button`에 `motion?: "auto" | "none"`(기본 `auto`)을 추가했다. children은 항상 같은 래퍼에 남고 Spinner는 `position: absolute; inset: 0` 중앙 레이어로 빠져 **레이아웃 계산에 끼지 않는다**. 로딩이 바뀌면 라벨 `opacity 1↔0`, 중앙 Spinner `0↔1`이 150ms 교차한다.
- children 래퍼는 `inline-flex` + `gap: inherit` + `flex: 1 1 auto`로 버튼이 직접 flex 컨테이너였을 때의 간격·정렬을 그대로 재현한다(아이콘+라벨, 전체 폭 버튼 포함). `disabled`·`aria-busy`·`data-loading`은 전환을 기다리지 않고, 접근 이름은 children이 트리에 남아 유지된다.
- `asChild`는 Slot 경로를 먼저 분기해 래퍼·레이어·`data-motion`을 얹지 않고 `loading` 무시 + 경고 정책도 그대로다. Spinner 노드는 전환이 끝난 뒤(모션이 없으면 즉시) 내려가, 로딩을 한 번도 쓰지 않은 버튼에는 아예 붙지 않는다.

**검증**: `vitest run src/button` 20 passed · `playwright test button-motion` 5 passed · **합격 기준 실측**: 같은 children에서 로딩 전 `87.95×40` → 로딩 중 `87.95×40` → 복귀 `87.95×40`(아이콘+라벨 `155.41`, 전체 폭 버튼도 동일). 대조로 Spinner를 흐름 안으로 되돌리면 같은 버튼이 로딩 중 `95.95 → 115.95`로 20px 늘어난다 — 이 계획이 없앤 실제 점프다. 교차 곡선은 t=75ms에서 `content 0.49 / spinner 0.51`로 합이 항상 약 1이다.

**남은 기준 갱신**: 없음. 새 레이어에 `dds-` 클래스를 주지 않아 색 스냅샷 수집 대상이 그대로고(버튼 27개 기준 27개), 래퍼 유무로 버튼 기하가 전혀 바뀌지 않는다(`display: contents` 대조 0건 차이).
