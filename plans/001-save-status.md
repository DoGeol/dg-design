# 001 — SaveStatus 완료 아이콘 전환

- Status: 완료 (2026-09-13) — `motion` prop과 saving → saved 교차 페이드 구현
- Commit: 43c9575
- Date: 2026-09-13
- Severity: LOW (기능 결함 판정이 아닌 추가 polish)
- Category: Missed opportunities / Accessibility / Interruptibility
- Estimated scope: 4개 기존 파일 + 공통 브라우저 테스트

## Problem

packages/react/src/save-status/SaveStatus.tsx:77:
```tsx
<span className="dds-save-status__icon">{icon ?? <SaveStatusIcon status={status} />}</span>
```
아이콘이 즉시 교체된다. saving Spinner에는 이미 회전이 있다. 같은 파일 :63의 live region DOM 유지 결정이 핵심 제약이다.

## Target

- motion 기본 auto. 기본 아이콘의 saving → saved에만 opacity 교차 전환 150ms, var(--dds-easing-out) = cubic-bezier(0, 0, 0.2, 1).
- 저장 완료는 Feedback 목적. dirty/saving/error 진입, 최초 렌더, icon 커스텀 사용은 즉시 반영. 오류를 지연하거나 성공 표시를 최소 시간 붙잡지 않는다.
- 고정 16×16px 아이콘 영역에서 현재 아이콘 opacity 0→1, 직전 saving 장식 레이어 1→0. scale·위치·텍스트 페이드 없음. 외부 span과 label 노드는 유지.
- 자동 저장 빈도가 높은 앱은 motion="none". 이 prop은 상태가 바뀌는 도중에도 즉시 적용.

## Steps

1. packages/react/src/save-status/SaveStatus.tsx에 motion prop과 직전 상태 추적을 추가한다. 최초 렌더와 실제 saving→saved 변경을 구분한다.
2. 기본 saving/saved 장식 레이어를 동일 셀에 유지해 CSS transition이 현재 opacity에서 재지정되게 한다. 숨은 Spinner는 unmount하거나 회전을 중지한다. 교차 전환 중 dirty/error가 오면 레이어 전환을 즉시 취소한다. 커스텀 icon은 현재 단일 렌더 경로를 유지한다.
3. packages/react/src/save-status/save-status.css에 16px 아이콘 스택과 opacity 전환을 추가한다. 내부 아이콘 영역은 aria-hidden, 외부 role 및 문구는 현재 로직대로 즉시 갱신한다.
4. save-status.test.tsx와 apps/storybook/src/SaveStatus.stories.tsx에서 saving→saved, saving→error, 빠른 saved→dirty, icon override, none을 다룬다.

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

- 대상 단위 테스트: `pnpm --filter @dg-design/react exec vitest run src/save-status`. 인터랙션은 user-event 사용. jsdom으로 프레임이나 레이아웃 정확성을 판정하지 않는다.
- Storybook의 해당 파일에 MotionDemo를 추가하고 최초 상태는 정지 상태로 둔다. 기존 state-matrix를 시간 의존 데모로 바꾸지 않는다.
- 브라우저 기능 검증: `apps/visual-regression/tests/component-motion-functional.spec.ts`에 대상별 describe를 순서대로 추가한다. 일반 모션 검증은 명시적으로 `page.emulateMedia({ reducedMotion: "no-preference" })`; reduce도 별도 검증한다. 기존 Playwright 기본값이 reduce임에 주의한다.
- 실제 브라우저에서 일반 속도와 DevTools 10% 재생으로 확인한다. 150ms 안에 연속 전환해도 처음 상태로 튀지 않고 최신 상태로 수렴해야 한다. 모션 도중 키보드 입력·설정 변경도 즉시 반영한다.
- 단계별로 대상 테스트와 feel check를 수행한다. 통합 마지막에 `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`를 실행한다.
- VR은 최종 정적 상태를 검증하고 시간 변화는 기능 테스트와 육안으로 검증한다. 로컬 -u 및 기준 이미지 생성 금지. 기준 변경이 필요하면 CI visual-baseline 워크플로로만 갱신한다.

## Done when

외부 live region과 label DOM identity 유지, 문구/role 즉시 변경, 16px 아이콘 영역 고정, 완료 전환만 페이드. VoiceOver로 완료/오류가 중복 안내되지 않는지 수동 확인.

## 구현 결과 (2026-09-13)

- `SaveStatus`에 `motion?: "auto" | "none"`(기본 `auto`)을 추가하고, 기본 아이콘의 **saving → saved에서만** 150ms(`--dds-duration-fast` / `--dds-easing-out`) opacity 교차 전환을 넣었다. 최초 렌더·hydration, `dirty`/`saving`/`error` 진입, `dirty → saved`, 커스텀 `icon`, `motion="none"`은 즉시 반영한다.
- 겹친 두 레이어는 클래스 없이 `data-layer` 속성으로 구분한다 — 색 텍스트 스냅샷이 `dds-` 클래스만 훑기 때문에 VR 기준이 흔들리지 않는다. 바깥 live region span과 `__label` 노드는 그대로 유지된다.
- 전환 도중 다른 status나 `motion="none"`이 오면 `data-crossfade`가 사라지며 즉시 최종값으로 수렴한다.

**검증**: `pnpm --filter @dg-design/react exec vitest run src/save-status` 17 passed · `playwright test save-status-motion` 5 passed(반복 실행 안정) · 체감은 정상 속도에서 spinner/glyph opacity 합이 항상 약 1(빈 프레임 없음), 10% 재생 스틸로 육안 확인.

**실측으로 얻은 불변식**: CSS `transition-property`의 기본값 `all`은 duration이 0이어도 "전환 가능"으로 쳐서, 모션을 끄는 순간 진행 중인 전환이 취소되지 않고 끝까지 달린다. 전환을 얹는 요소의 기본값에 `transition-property: none`을 명시해야 "즉시 취소"가 성립한다 — 002~006에도 그대로 적용했다.

**남은 기준 갱신**: 없음(정적 상태 DOM·픽셀 불변).
