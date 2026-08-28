# 우선순위 컴포넌트 1차 묶음

## 메타

- 생성: 2026-08-28
- 라운드: 4
- 최종 모호도: 14% (임계값 20%)
- 유형: 브라운필드
- 상태: **구현 완료 — 합격 20/20**
- 근거: `docs/follow-ups.md`, Seed Design 로컬 저장소
- 승인: **승인됨 — 2026-08-28**

## 명확도

| 차원 | 점수 | 가중치 | 가중 점수 |
|---|---:|---:|---:|
| 목표 | 0.92 | 0.35 | 0.322 |
| 제약 | 0.82 | 0.25 | 0.205 |
| 성공 기준 | 0.78 | 0.25 | 0.195 |
| 맥락 | 0.92 | 0.15 | 0.138 |
| **모호도** | | | **14%** |

## 구성요소

| 구성요소 | 상태 | 설명 | 커버리지 / 보류 사유 |
|---|---|---|---|
| Skeleton | 완료 | 중립 색상의 로딩 자리표시자 | radius 4종, shimmer, reduced motion |
| Avatar | 완료 | 사용자 이미지와 fallback·badge | Root/Image/Fallback/Badge만 포함 |
| Separator | 완료 | 장식 또는 의미가 있는 구분선 | horizontal/vertical, semantic opt-in |
| Collapsible | 완료 | 단일 영역 공개/접기 primitive | 독립 공개 API, Accordion의 기반 |
| Accordion | 완료 | 복수 disclosure 묶음 | single/multiple, inline/separated |
| 기능별 기획·QA 문서 | 완료 | 구현 계약과 검증 결과 | 5종 독립 재QA PASS |
| Avatar.Stack | 보류 | 여러 Avatar 겹침 | 기본 4요소로 범위를 제한 |
| Toggle 이후 후보 | 보류 | Toggle, ToggleGroup 등 | 이번 묶음 완료·검증 후 다음 차수 |

## 목표

Seed Design의 구조와 상호작용을 참고하되 DDS의 토큰, compound API, 접근성, CSS 계층, 테스트 관습을 유지하면서 Skeleton·Avatar·Separator·Collapsible·Accordion을 공개 React 컴포넌트로 추가하고 기능별 기획·QA 근거를 남긴다.

## 공통 제약

- Seed Design은 동작·치수·합성 방식의 참고 자료이며 코드를 복사하지 않는다.
- 스타일은 `@layer dds`, `.dds-x`와 `.dds-x--variant_y` 클래스, semantic token만 사용한다.
- 새 palette 공개나 `magic` intent 추가는 하지 않는다. 필요한 색은 기존 neutral semantic token으로 해결한다.
- `:focus-visible`과 `:is(:disabled,[disabled],[data-disabled])` 관습을 유지한다.
- controlled 여부는 prop 값이 아니라 prop 존재 여부로 판별하고 외부 값이 항상 진실이다.
- React 18·19, SSR·hydration, 라이트·다크 모드를 지원한다.
- 아이콘 패키지 의존성은 추가하지 않는다. Accordion indicator와 Avatar badge 내용은 소비자가 제공한다.
- 각 컴포넌트는 개별 subpath export와 barrel export를 제공하고 CSS raw copy·트리셰이킹 계약을 유지한다.
- 각 소스 파일은 300~500줄 상한을 지킨다. 공통 로직은 실제로 둘 이상이 공유할 때만 `internal/`로 뺀다.
- 모션은 DDS duration/easing token을 사용하고 `prefers-reduced-motion: reduce`에서 정지 또는 즉시 전환한다.
- 구현 중 공개 API를 바꿔야 할 새 사실이 나오면 오케스트레이터가 스펙에 결정 근거를 먼저 기록한다.

## 기능별 기획

### Skeleton

- 단일 `Skeleton` 컴포넌트와 `SkeletonProps`를 공개한다.
- `radius?: "none" | "small" | "medium" | "full"`, 기본값은 `medium`이다.
- 네이티브 `div` 속성, `className`, `style`, `ref`를 전달한다. 너비·높이는 소비자가 `style` 또는 `className`으로 정한다.
- 배경과 shimmer는 기존 neutral semantic token만 사용한다.
- 접근성 트리에서 의미 없는 장식으로 취급되도록 기본 `aria-hidden="true"`를 적용하되 명시 prop은 덮어쓰지 않는다.
- shimmer는 무한 반복하되 reduced motion에서는 애니메이션을 제거한다.

### Avatar

- compound `Avatar.Root/Image/Fallback/Badge`를 공개한다. `Avatar.Stack`은 만들지 않는다.
- `Root`의 `size?: "small" | "medium" | "large" | "xlarge"`는 각각 24/36/48/64px이며 기본값은 `medium`이다.
- `Image`는 `img` 속성과 ref를 전달하고 `object-fit: cover`를 사용한다.
- 이미지는 최초에는 loading, 성공 시 loaded, 실패 시 error 상태가 된다. Root·Image·Fallback에 `data-loading-state`를 노출한다.
- loading/error에서는 Fallback, loaded에서는 Image를 표시한다. 캐시된 이미지의 `complete`와 `naturalWidth/naturalHeight`도 hydration 뒤 판정한다.
- `Fallback` 내용과 `Badge` 내용·색상은 소비자가 제공한다. Badge는 24px에서도 표시하며 Root 우하단에 배치한다.
- 이미지와 fallback은 원형이며 stroke·fallback 배경·텍스트는 DDS neutral semantic token을 사용한다.
- 장식 이미지면 빈 `alt`, 의미 이미지면 적절한 `alt`를 소비자가 전달하는 네이티브 이미지 계약을 유지한다.

### Separator

- 단일 `Separator`와 `SeparatorProps`를 공개한다.
- `orientation?: "horizontal" | "vertical"`, 기본값은 `horizontal`이다.
- `decorative?: boolean`, 기본값은 `true`다.
- decorative이면 `aria-hidden="true"`이며 role을 부여하지 않는다.
- semantic이면 `role="separator"`와 `aria-orientation`을 부여한다. 명시한 ARIA 속성은 보존한다.
- 수평은 width 100%·height 1px, 수직은 width 1px·align-self stretch를 기본으로 하며 neutral weak stroke를 사용한다.

### Collapsible

- compound `Collapsible.Root/Trigger/Content`를 독립 공개한다.
- Root는 `open?`, `defaultOpen?`, `onOpenChange?`, `disabled?`와 네이티브 div 속성을 지원한다.
- Trigger는 기본 button이며 `asChild`를 지원한다. `aria-expanded`, `aria-controls`, `disabled`, `data-state`를 배선한다.
- Content는 DOM에 유지해 내부 폼 상태를 보존한다. 닫힌 동안 `aria-hidden`과 `inert`를 적용해 접근·포커스를 차단한다.
- Content 높이는 실제 `scrollHeight`를 CSS 변수로 반영하고 내용 크기 변경을 관찰한다. 열림/닫힘은 height와 opacity로 전환한다.
- disabled이면 사용자 입력으로 상태가 바뀌지 않지만 controlled prop 갱신은 그대로 반영한다.
- Trigger나 Content를 생략해도 Root 자체는 예외를 던지지 않는다. 하위 요소를 Root 밖에서 사용하면 개발 오류를 명확히 던진다.

### Accordion

- `Accordion.Root/Item/Header/Trigger/Content/Body/Title/Description/Prefix/SuffixIcon`을 공개한다.
- Root는 Seed와 동일한 배열 상태 계약 `values?`, `defaultValues?`, `onValuesChange?`, `multiple?`, `disabled?`를 사용한다. 기본은 single이며 열린 항목을 다시 누르면 모두 닫을 수 있다.
- controlled 값이 single 모드에서 여러 개면 첫 값만 유효하게 표시하며 콜백은 정규화된 다음 배열을 전달한다.
- Item은 필수 `value`와 선택 `disabled`를 받는다. 중복 value는 개발 모드에서 경고한다.
- Header는 기본 `h3`이며 `asChild`를 지원한다. Trigger는 기본 button이고 Item별 Content와 ARIA로 연결한다.
- Content는 Collapsible.Content를 재사용하고 `role="region"`, `aria-labelledby`를 연결한다.
- Trigger의 ArrowDown/ArrowUp/Home/End는 활성 trigger 사이에서 순환하며 disabled 항목을 건너뛴다. Enter/Space는 네이티브 button 동작을 사용한다.
- `variant?: "inline" | "separated"`, 기본값은 `inline`; `size?: "medium" | "large"`, 기본값은 `medium`이다.
- inline은 항목 사이 구분선, separated는 항목별 border·radius와 Root gap을 사용한다.
- Title은 neutral 본문색, Description은 AA를 통과하는 `fg-neutral-weak`, disabled는 `fg-disabled`를 사용한다.
- SuffixIcon은 소비자 아이콘을 감싸며 open일 때 180도 회전한다.

## 문서와 오케스트레이션

- 기획·QA 문서 작성과 전체 판정은 `gpt-5.6-sol`, reasoning `high`가 담당한다.
- 구현은 기능 규모에 따라 다음처럼 배정한다.
  - Skeleton·Separator: `gpt-5.6-luna`, reasoning `max`
  - Avatar·Collapsible: `gpt-5.6-terra`, reasoning `medium`
  - Accordion: `gpt-5.6-terra`, reasoning `high`
- 독립 QA는 모든 기능에 `gpt-5.6-terra`, reasoning `medium`을 사용한다.
- 구현 작업자는 커밋하지 않고 자신에게 배정된 디렉터리와 스토리·테스트만 수정한다. barrel, package exports, 문서 색인은 오케스트레이터가 직결한다.
- 기능별 기획 문서는 `docs/plans/2026-08-28-{component}.md`, QA 문서는 `docs/qa/2026-08-28-{component}.md`에 작성한다. component는 `skeleton`, `avatar`, `separator`, `collapsible`, `accordion`이다.
- QA 문서에는 검증 명령, 자동 테스트 결과, 수동/시각 점검 결과, 미해결 위험, 합격/불합격 판정을 남긴다.

## 하지 않을 것

- Avatar.Stack, Skeleton magic tone, responsive 전용 size는 이번에 만들지 않는다.
- Toggle·ToggleGroup·Slider·ScrollArea·AlertDialog 등 다음 우선순위는 이번 묶음에 포함하지 않는다.
- 새 아이콘 라이브러리, headless 패키지 분리, recipe 코드 생성기를 도입하지 않는다.
- Accordion 중첩, 가상화, drag reorder, 서버 데이터 로딩은 별도 기능으로 제공하지 않는다.
- 시각 기준 이미지는 로컬에서 갱신하지 않는다. 새 스토리는 CI `visual-baseline` 절차로 기준을 만든다.
- npm publish, git commit, push는 수행하지 않는다. 필요 시 변경 요약 후 별도 승인을 받는다.

## 합격 조건

### 공통

- [x] 5개 컴포넌트가 barrel과 subpath에서 타입 안전하게 import된다.
- [x] 각 기능별 기획·QA 문서가 존재하고 QA 판정과 근거가 채워져 있다.
- [x] 모든 공개 prop과 compound 구성요소에 테스트 또는 Storybook 사용 예가 있다.
- [x] 라이트·다크 StateMatrix 스토리에서 기존 DDS 컴포넌트와 토큰·타이포·focus 스타일이 일관된다.
- [x] `pnpm generate`, `pnpm build`, React test, `pnpm typecheck`, `publint`가 통과한다.
- [x] 새 VR 스토리는 기능 테스트와 기준 이미지 생성 대상에 포함되고 로컬 기준 갱신은 하지 않는다.

### Skeleton

- [x] radius 4종과 임의 width/height가 렌더된다.
- [x] 기본 aria-hidden과 reduced-motion 애니메이션 제거가 검증된다.

### Avatar

- [x] loading·loaded·error 전환 및 캐시 완료 이미지 경로에서 Image/Fallback 가시성이 맞다.
- [x] 4개 size와 Badge 배치가 라이트·다크에서 검증된다.
- [x] 사용자 onLoad/onError와 ref가 보존된다.

### Separator

- [x] decorative 기본과 semantic opt-in의 role·ARIA가 정확하다.
- [x] horizontal/vertical 레이아웃이 검증된다.

### Collapsible

- [x] uncontrolled·controlled·disabled 상태와 외부 controlled reset이 검증된다.
- [x] Trigger와 Content의 id·ARIA, 닫힌 Content의 inert/포커스 차단이 검증된다.
- [x] 닫았다 열어도 Content 내부 입력 값이 유지되고 동적 높이가 갱신된다.

### Accordion

- [x] single·multiple·controlled·uncontrolled·disabled·중복 value 경계가 검증된다.
- [x] ArrowUp/Down/Home/End 순환, disabled 건너뛰기, Enter/Space 토글이 검증된다.
- [x] Item별 trigger/content ARIA 연결과 닫힌 콘텐츠의 접근성 제외가 검증된다.
- [x] inline/separated × medium/large × open/closed/disabled 상태가 Storybook StateMatrix에 표현된다.

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|---|---|---|
| Seed Avatar 전체가 필요하다 | Stack까지 공개할 필요가 있는지 분리해 물었다 | 기본 4요소만 포함하고 Stack은 보류 |
| Seed Skeleton의 tone을 그대로 가져온다 | DDS에 magic semantic token이 없음을 확인했다 | neutral 단일 tone과 radius 축만 채택 |
| Separator는 단순한 선이다 | 장식과 문서 구조 의미가 다름을 확인했다 | decorative 기본, semantic opt-in |
| Collapsible는 Accordion 내부 구현이면 충분하다 | 독립 소비처가 없을 때 공개 API 증가를 반론으로 제시했다 | 독립 공개 컴포넌트로 제공 |

## 기술 맥락

- React 공개 컴포넌트: `packages/react/src/{component}/`
- barrel: `packages/react/src/index.ts`
- subpath export: `packages/react/package.json`
- Storybook: `apps/storybook/src/*.stories.tsx`
- VR·기능 테스트: `apps/visual-regression/`
- controlled 공통: `packages/react/src/internal/use-controllable-state.ts`
- roving focus 공통: `packages/react/src/internal/roving-focus.ts`
- CSS raw copy: `packages/react/vite.config.ts`
- Seed 참고: `/Users/pdg/WebstormProjects/seed-design/packages/react/src/components/{Skeleton,Avatar,Accordion}`와 `packages/react-headless/{avatar,collapsible,accordion}`

## 완료 시 확인한 운영 제약

- Avatar는 hydration mismatch를 피하기 위해 effect 판정 전 fallback이 짧게 보일 수 있으며, QA에서 의도된 계약으로 확인했다.
- Collapsible의 실제 높이·폼 상태는 jsdom 공백을 Chromium 기능 테스트로 보완했다.
- 신규 Linux 기준 이미지가 없는 VR 항목은 로컬 정책에 따라 SKIP되며 CI `visual-baseline`에서만 생성한다.
- 최종 검증은 generate·build·React 32 files/342 tests·typecheck·publint PASS, VR 56 PASS/62 SKIP이다.

## 인터뷰 기록

<details><summary>전체 Q&A (4라운드)</summary>

### Round 0

**Q:** Skeleton, Avatar, Separator, Collapsible/Accordion과 기능별 문서를 이번 차수로 진행할 것인가?
**A:** 진행.
**모호도:** 채점 전

### Round 1

**Q:** Avatar.Stack까지 포함할 것인가?
**A:** 기본 4요소만.
**모호도:** 34%

### Round 2

**Q:** Skeleton은 neutral tone과 radius 4종으로 제한할 것인가?
**A:** 확정.
**모호도:** 28%

### Round 3

**Q:** Separator는 decorative 기본과 semantic opt-in을 지원할 것인가?
**A:** 좋다.
**모호도:** 23%

### Round 4

**Q:** Collapsible를 독립 공개 컴포넌트로 제공할 것인가?
**A:** 독립 컴포넌트로 제공.
**모호도:** 17%

</details>
