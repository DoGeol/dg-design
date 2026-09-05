# dg-studio 승격 1차 구현 중 결정

- 날짜: 2026-09-05
- 스펙: [dg-studio 승격 1차](../specs/2026-09-05-studio-promotion-batch.md)
- 근거: [컴포넌트 구성 규칙](../decisions/2026-09-05-component-composition-rules.md)
- 상태: 활성

## 구현 결과 및 결정

### 1. StatePanel compound 및 Loading preset
- `StatePanel`은 `Root`, `Icon`, `Title`, `Description`, `Actions`, `Footer`의 compound 구조로 구현했다.
- 별도의 Context를 두지 않아 서브컴포넌트를 `Root` 밖에서 독립적으로 렌더링해도 런타임 에러가 발생하지 않는다.
- `StatePanel.Title`은 `asChild`를 지원하여 시맨틱 헤딩 레벨(h1~h6 등)을 소비자가 유연하게 지정할 수 있다.
- `StatePanel.Loading` 프리셋은 `label: ReactNode`를 필수로 받으며, 한국어 기본 문구를 내장하지 않는 DDS 원칙을 지킨다 (`role="status"`, `aria-live="polite"`).

### 2. Slider leaf
- `<input type="range">`의 래퍼 컴포넌트로 구현했으며, `size`는 `small`(트랙 4px, thumb 14px)과 `medium`(트랙 6px, thumb 18px, 기본) 둘 다 지원한다.
- 채움 트랙 비율은 CSS 변수 `--dds-slider-fill`을 계산하여 인라인 스타일에 부여하고, WebKit과 Firefox 모두에서 `linear-gradient`를 활용해 채움 트랙(`bg-brand-solid`)과 빈 트랙(`bg-neutral-weak`)을 표현했다.
- controlled와 uncontrolled 모두를 지원하며, uncontrolled 환경에서는 `onInput`과 `onChange`에서 내부 fill percentage 상태를 갱신한다.
- `FieldContext` 연동을 통해 Field 하위에서 `id`, `aria-describedby`, `aria-invalid`가 자동 연결된다.

### 3. RadioGroup variant="segmented"
- `variant="segmented"` 및 `size` (`small` 28px, `medium` 36px, `large` 44px)를 추가했다.
- `variant="default"`는 기존 규격을 완벽히 유지하며 `size` 지정을 무시한다.
- `variant="segmented"`인 경우 `orientation="vertical"`이 주어지더라도 런타임 경고 없이 `horizontal`로 강제 렌더링되며, roving focus 또한 좌우 화살표로 제한된다.
- 인디케이터(box/dot)를 숨기고 캡슐 배경 위에서 선택된 아이템만 `bg-layer-default`와 1단 그림자(`0 1px 3px rgba(0, 0, 0, 0.1)`)를 갖는다.

### 4. Tabs responsive
- `responsive` prop으로 브레이크포인트(px)를 지정받으면 Root에 `data-responsive` 및 `--dds-tabs-breakpoint` 변수를 부여한다.
- 미디어쿼리(`matchMedia`)를 통해 브레이크포인트 이상(`isWide`) 여부를 계산하여 context로 전달한다.
- `isWide`가 활성화되면:
  - Root에 `data-wide` 속성이 부여되고 CSS `grid-auto-flow: column` 그리드로 전환된다.
  - `Tabs.List`는 `display: none`으로 숨겨진다.
  - 모든 `Tabs.Content`의 `hidden` 속성이 제거되어 전체 패널이 동시에 나란히 표시된다.
- SSR 환경의 초기값은 `false`(모바일 우선)이며, hydration 직후 1프레임 깜빡임은 스펙에 명시된 대로 허용한다.

### 5. Alert actions slot
- leaf 형태를 유지하면서 `actions?: ReactNode` slot prop을 추가했다.
- `description` 하단에 가로 flex로 배치되며, `actions` prop이 없으면 관련 DOM 요소가 생성되지 않는다.
- 기존 우상단 `onClose` 닫기 버튼과 완벽히 공존한다.

### 6. 토큰 및 호환성
- 신규 색 토큰 추가 0건, `packages/tokens` 변경 0건.
- 모든 색상은 기존 semantic 토큰을 그대로 재사용했다.
- barrel export 및 `packages/react/package.json`의 `exports` 서브패스 매핑(`state-panel`, `slider`)을 완료하고 `publint`를 통과했다.

## 리뷰 수정 (감독 세션)

- Slider thumb 테두리가 존재하지 않는 `--dds-color-stroke-brand`를 참조해 테두리가 사라지던 문제 — stroke 축에 brand가 없으므로(`stroke-{neutral,neutral-weak,critical,focus-ring}`뿐) `bg-brand-solid`로 대체. 신규 토큰 추가 없음 원칙 유지.
- Tabs.Content의 `data-responsive-visible` 속성은 어떤 CSS·테스트도 읽지 않는 죽은 마크업이라 제거.
- 로컬 게이트는 Node 22.16에서 `NODE_OPTIONS=--experimental-strip-types`가 필요했다(CI ubuntu의 Node는 기본 strip 지원). 코드 문제 아님.
