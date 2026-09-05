# dg-studio 승격 1차 (StatePanel · Slider · segmented · responsive Tabs · Alert actions)

## 메타
- 생성: 2026-09-05
- 유형: 브라운필드 (react 0.12.0 위에 추가)
- 상태: 승인됨 (2026-09-05) — 구현 대기
- 근거: [docs/decisions/2026-09-05-component-composition-rules.md](../decisions/2026-09-05-component-composition-rules.md)
- 출처: dg-studio `src/shared/ui/state.tsx`, `theme-toggle.tsx`, `homeground/blog/[id]/editor-screen.tsx`, `features/experiments/*` range 입력 6곳
- 시안: dg-studio 세션 scratchpad `mockups/01~04-*.png` (StatePanel 시안은 preset 형태라 참고만, 구조는 이 스펙이 정본)

## 목표

dg-studio가 직접 만들어 쓰던 상태 패널·슬라이더·세그먼트 토글·반응형 탭·행동 있는 배너를 DDS로 옮긴다. 구성 규칙에 따라 앱 문구와 도메인 조합은 dg-studio에 남기고, 구조·접근성·스타일만 DDS가 맡는다. react 0.13.0 minor.

## 범위 밖

SaveStatus, MultiSelect `onCreate`, TagPicker, 파일 입력. 1차 검증 후 별도 스펙.

## 제약

### 1. StatePanel (`packages/react/src/state-panel/`) — compound, context 없음

- `StatePanel.Root` — `div`, 세로 중앙 정렬, `min-height` 기본 `16rem`(prop `minHeight`로 덮어씀), 배경 `bg-neutral-weak`, radius 기존 카드와 동일 위임. `role` 기본 없음 — 소비자가 `status`/`alert` 지정. children 순서를 강제하지 않는다.
- `StatePanel.Icon` — `div`, Spinner·아이콘 자리. 크기 위임.
- `StatePanel.Title` — `h2` 기본, `as` 없음. 필요하면 `asChild`.
- `StatePanel.Description` — `p`, `fg-neutral-weak`.
- `StatePanel.Actions` — `div`, 가로 flex, gap 위임. 버튼은 소비자가 넣는다.
- `StatePanel.Footer` — `div`, 자유 슬롯(details 등). 상단 여백만 준다.
- `StatePanel.Loading` — preset. props `{ label?: ReactNode }`(기본 "불러오는 중입니다" **아님** — 문구는 필수 prop으로 받는다, DDS는 한국어 기본 문구를 갖지 않는다). 렌더: `Root role="status" aria-live="polite"` > `Icon><Spinner size="medium"/>` + `Description{label}`.
- context 없음. 서브컴포넌트는 클래스만 붙이는 `forwardRef`. Root 밖에서 써도 에러 없이 렌더된다.
- 이름은 `StatePanel`. 대안 `Empty`·`Placeholder`는 Error 용도를 못 담아 탈락.

### 2. Slider (`packages/react/src/slider/`) — leaf

- `<input type="range">` 래퍼. `SliderProps extends Omit<InputHTMLAttributes, "type" | "size">`. min/max/step/value/onChange 그대로 통과.
- `size`: `small`(트랙 4px·thumb 14px)·`medium`(트랙 6px·thumb 18px, 기본). 시안 수치는 위임값, 구현 중 조정 가능.
- 채움 트랙: `bg-brand-solid`, 빈 트랙 `bg-neutral-weak`. 채움 비율은 CSS 변수 `--dds-slider-fill`(0~100)로 컴포넌트가 계산해 `style`에 얹는다. controlled/uncontrolled 둘 다 — uncontrolled면 `onInput`에서 변수만 갱신.
- thumb: `bg-layer-default` + `stroke-brand` 테두리. hover 시 `bg-brand-weak` 6px halo, `:focus-visible` 기존 outline 관습, disabled 3중 매칭 + `bg-disabled`/`cursor: not-allowed`.
- Field 연동: `FieldContext`가 있으면 id·describedby·invalid 연결 (TextField와 같은 경로). 라벨·현재값 표시는 컴포넌트가 만들지 않는다 — `Field.Label`과 소비자 마크업.
- 틱 마크(`datalist`)는 네이티브에 위임, 스타일 안 함. 세로 방향 없음.
- WebKit·Firefox 둘 다 `-webkit-slider-runnable-track`/`-moz-range-track` 셀렉터 필요. 시각 회귀는 크로미움만이라 Firefox는 Storybook 수동 확인.

### 3. RadioGroup `variant="segmented"` (`radio-group/`)

- `RadioGroupRootProps.variant?: "default" | "segmented"`. 기본 `default`(현행).
- segmented: 캡슐 컨테이너 `bg-neutral-weak` + radius 위임, Item은 원형 인디케이터 숨기고 라벨만. 선택 Item `bg-layer-default` + 그림자 1단(elevation 토큰 있으면 그것, 없으면 `0 1px 3px` 위임값). `orientation`은 horizontal 강제 — vertical + segmented는 타입에서 막지 않고 런타임 경고 없이 horizontal로 렌더.
- `size`: small(28px)·medium(36px, 기본)·large(44px). default variant는 size 무시(현행 유지).
- 접근성·키보드는 현행 RadioGroup 그대로(roving, 좌우 화살표). 신규 aria 없음.
- dg-studio `theme-toggle.tsx`의 `fieldset/legend + aria-pressed` 패턴을 이것으로 교체 가능해야 한다 — legend 자리는 `Field.Label` 또는 `aria-label`.

### 4. Tabs `responsive` (`tabs/`)

- `TabsRootProps.responsive?: number` — px 브레이크포인트. 지정 시 Root에 `data-responsive` + CSS 변수 `--dds-tabs-breakpoint`.
- 브레이크포인트 **이상**에서: `Tabs.List` `display: none`, 모든 `Tabs.Content`가 `hidden` 무시하고 표시, Root가 `grid-template-columns: repeat(N, 1fr)`(N = Content 수, CSS `grid-auto-flow: column`으로 처리해 N을 JS로 세지 않는다).
- CSS만으로 못 하는 부분(`hidden` 속성이 display를 이김): Content가 `data-responsive-visible`을 항상 갖고, 미디어쿼리 안에서 `[hidden]`을 `display: block !important`… 은 금지. 대신 Root가 `matchMedia`로 `wide` 상태를 계산해 context에 넣고, Content는 `wide`면 `hidden`을 안 붙인다. SSR 초기값은 `false`(모바일 우선). hydration 후 1프레임 깜빡임은 허용 — 결정 기록에 남긴다.
- `wide`일 때 Trigger의 `aria-selected`·roving은 List가 display none이라 무의미하지만 DOM은 유지한다(포커스 이동 없음).
- 브레이크포인트 아래는 현행 Tabs와 100% 동일.

### 5. Alert `actions` slot

- `AlertProps.actions?: ReactNode`. description 아래 가로 flex로 렌더. 없으면 DOM 없음.
- `onClose`와 공존. 닫기 버튼은 우상단 현행 위치 유지.
- dg-studio `draft-recovery-banner.tsx`·`session-banner.tsx`가 description에 버튼을 끼우던 우회를 이걸로 제거하는 것이 검증 기준.
- compound 전환은 하지 않는다(구성 규칙 "slot 3개 이상이면 재검토").

### 공통

- barrel: `state-panel`, `slider` 신규 export 경로. package.json `exports` 추가, publint 통과.
- 파일 300~500줄, 폴더 kebab-case, CSS `@layer dds`, 클래스 `.dds-{name}--{axis}_{value}`.
- 신규 색 토큰 0. 필요한 색은 전부 기존 semantic으로 해결한다. 대비 검사 쌍 추가 없음.
- Storybook: 각 컴포넌트 `*--state-matrix` 스토리(라이트·다크 VR 자동 편입) + 기능 데모 1개.
- vitest: StatePanel(Root 밖 서브컴포넌트 렌더, Loading role/aria-live), Slider(Field 연결, fill 변수 갱신, disabled), RadioGroup segmented(선택 이동·size 클래스), Tabs responsive(matchMedia mock으로 wide 전환 시 hidden 제거), Alert actions(렌더 유무).
- changeset: react minor 0.13.0. tokens 변경 없음.

## 합격 조건

1. `pnpm generate && pnpm build && pnpm --filter @dg-design/react test && pnpm typecheck && publint` 그린.
2. dg-studio에서 다음 교체가 DDS만으로 가능하다(실제 교체는 dg-studio 별도 PR):
   - `state.tsx` Loading/Empty/Error → StatePanel 조합, 기술정보 details는 Footer에.
   - `theme-toggle.tsx` → `RadioGroup variant="segmented"`.
   - `editor-screen.tsx`·`resume-editor.tsx`·`resume-widget-inspector.tsx` 탭 → `Tabs responsive={1024}`(inspector는 값 다를 수 있음).
   - 배너 2곳 → `Alert actions`.
   - 실험실 range 6곳 → `Slider`.
3. 신규 색 토큰 0, 대비 검사 쌍 수 불변.
4. VR 기준 이미지는 CI에서 생성(로컬 -u 금지 유지).
5. 구현 중 결정은 `docs/decisions/2026-09-05-studio-promotion-batch-implementation.md`에 기록.

## 결정된 질문 (2026-09-05)

- Q1. Tabs responsive hydration 1프레임 깜빡임 — **허용**. matchMedia 방식 확정, 결정 기록에 남긴다.
- Q2. Slider `size` — **small·medium 둘 다** 유지.
