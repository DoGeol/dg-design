# dg-studio 승격 2차 구현 중 결정

- 날짜: 2026-09-06
- 스펙: [dg-studio 승격 2차](../specs/archive/2026-09-06-studio-promotion-batch-2.md)
- 근거: [컴포넌트 구성 규칙](../decisions/2026-09-05-component-composition-rules.md), [1차 구현 결정](./2026-09-05-studio-promotion-batch-implementation.md)
- 상태: 활성

## 합격 조건 대조표

| 합격 조건 | 판정 | 근거 |
|---|---|---|
| `pnpm generate && pnpm build && test && typecheck && publint` 그린 | **통과** | `pnpm generate` — palette 61 / semantic 47, WCAG 대비 전부 통과. `pnpm build` — 전체 성공, `dist/{save-status,file-input,multi-select}/`에 `.js`/`.d.ts`/`.css` 모두 방출 확인. `pnpm --filter @dg-design/react test` — 37 files / **415 tests pass**. `pnpm typecheck`(3 프로젝트) clean. `pnpm --filter @dg-design/react exec publint` → "All good!" |
| VR 기준 CI 생성 | **보류** | 로컬은 `-u` 가드가 막음(관행). `MultiSelect` state-matrix에 search 셀 3개가 추가되어 레이아웃이 밀렸다는 담당 에이전트의 decisionRequest가 있음(아래 "실제로 터진 위험" 참조) — 기존 기준 이미지 삭제 후 visual-baseline 워크플로 수동 트리거 필요. 배포 파이프라인에서 처리. |
| `SaveStatus` 4상태·error만 `role="alert"`·같은 DOM 노드 유지 | **통과** | `packages/react/src/save-status/SaveStatus.tsx:11-17`(role 분기표), `:69-82`(단일 `<span>`, status에 따라 요소를 갈아끼우지 않음). 테스트: `save-status.test.tsx` `"error만 role='alert'이고 나머지는 role='status'다"`(21행), `"status가 바뀌어도 같은 DOM 노드(같은 element 참조)를 유지한다"`(52행). |
| `MultiSelect search="trigger"` 타이핑→열림·↓/Enter·Backspace 칩 제거·`aria-activedescendant`; `search="content"` 자동 포커스·↓ 진입 | **통과** | `multi-select-search.tsx` `MultiSelectSearchTrigger`(268-370행), `MultiSelectContentSearch`(373-396행). 테스트: `multi-select-search.test.tsx` 29·58·72·84·100·112·153·164행 각각 대응. |
| `onCreate` resolve→선택 추가+query 비움, reject→항목 복구+`createErrorLabel`, 보류 중 다른 옵션 조작 가능 | **통과** | `multi-select-search.tsx:160-201`(`runCreate`/`activate`). 테스트: `"resolve한 옵션이 값에 붙고 질의가 비워진다"`(213행), `"reject면 항목이 복구되고 createErrorLabel이 role=alert로 뜬다"`(272행), `"보류 중에는 만들기 항목만 aria-disabled가 되고 다른 옵션은 그대로 조작된다"`(243행). |
| `FileInput` accept/maxSize/maxFiles 위반이 `rejected`로 사유와 함께, 통과분만 `files`; Dropzone 키보드 열림·`data-dragging` 토글; Field `aria-describedby`·`aria-invalid` | **통과** | `file-validation.ts:75-108`(`validateFiles`), `FileInput.tsx:116-197`(`FileInputDropzone`). 테스트: `file-input.test.tsx` 17·77·92·140·159·250행. |
| 신규 색 토큰 0, 대비 검사 쌍 수 불변(배치 2 신규 컴포넌트 기준) | **통과(범위 한정)** | `save-status`/`multi-select`/`file-input` 모두 기존 semantic 토큰만 참조(`fg-neutral-weak`, `fg-warning`, `fg-critical`, `stroke-neutral-weak`, `stroke-focus-ring`, `bg-brand-weak` 등). `packages/tokens/src/tokens.ts` 변경분은 배치 2 컴포넌트가 아니라 **디자인 검토 반영 F4** 한 건뿐(아래 참조) — 이 건으로 대비 검사 쌍이 1건 늘었으나 스펙의 "신규 색 토큰 0"은 유지(기존 토큰 값·검사 쌍 추가일 뿐 새 역할·강조 조합 없음). |
| dg-studio 교체 PR(0.14.0 배포 뒤) — E2E 포함 전부 통과 | **보류** | 스펙에도 "0.14.0 배포 뒤"로 명시. 이번 라운드는 DDS 게이트까지만 대상. |
| 구현 중 결정 문서화 | **통과** | 본 문서. |

## 구성요소별 구현 결과

### 1. SaveStatus (leaf)

`packages/react/src/save-status/SaveStatus.tsx` — `status`별 role 표(`SAVE_STATUS_ROLE`)를 상수로 고정하고, 아이콘·문구를 각각 `__icon`/`__label` span으로 감싸되 바깥 `<span role=...>`는 하나만 유지한다(상태 전환 시 언마운트 없음). 담당 에이전트 결정:

- 기본 아이콘 형태(위임값): saved=체크마크, dirty=채워진 점, saving=`Spinner size="small"`, error=원+느낌표. `Alert.tsx` 패턴을 따라 인라인 SVG, `aria-hidden`, `currentColor`.
- 색: saved/saving은 `fg-neutral-weak`, dirty는 `fg-warning`, error는 `fg-critical` — 신규 색 토큰 0.
- 테스트 파일명은 저장소 관행(kebab-case)에 맞춰 `save-status.test.tsx`.
- 스토리: Playground(controls) + StateMatrix(4상태, VR 대상) + FunctionalDemo(같은 노드 유지 확인, 오버레이 없어 "닫힌 상태" 조건 자동 충족).

### 2. MultiSelect 검색 + 생성

`packages/react/src/multi-select/multi-select-search.tsx`(436행)에 검색·생성 상태 훅(`useMultiSelectSearch`)과 두 모드의 UI(`MultiSelectSearchTrigger`, `MultiSelectContentSearch`, `MultiSelectCreateItem`)를 분리했고, `MultiSelect.tsx`(488행)가 `search` prop 유무로 분기한다. 담당 에이전트 결정:

- **칩 제거 라벨**: 스펙 미정의 항목이라 `formatRemoveLabel?: (option) => string`을 Trigger에 신설. 기본값은 `nodeToText(label) || value` — 문구 소유권은 소비자에 남기면서 빈 접근 이름을 방지.
- **searchProps**: `Root`에 `searchProps?: React.InputHTMLAttributes<HTMLInputElement>` 하나만 두고 두 모드 입력 모두에 스프레드. placeholder/aria-label을 모드별로 따로 만들지 않아 공개 API가 짧아지고 문구 소유권이 전부 소비자에 남는다.
- **검색 입력·만들기 항목의 자동 렌더**: `Content`가 직접 렌더(소비자가 서브컴포넌트를 배치하지 않음) — 스펙이 요구한 "첫 자식"·"맨 아래" 순서가 구조적으로 보장되고 공개 API가 늘지 않는다.
- **activedescendant용 옵션 id**: `` `${contentId}-opt-${encodeURIComponent(value)}` ``. `search="trigger"`일 때만 부여해 검색 없음 모드의 DOM을 불변으로 유지. 만들기 항목은 내부 센티넬 값(`CREATE_VALUE = " dds-create"`, 실제 옵션 값과 겹칠 수 없는 제어 문자 시작)으로 같은 함수를 태운다.
- **활성 하이라이트**: `data-active` 속성 + CSS. `search="trigger"`에서는 DOM 포커스가 입력에 남아 `:focus-visible`이 걸리지 않기 때문.
- **`internal/roving-focus.ts`의 `itemSelector`에 `:not([hidden])` 추가**(공용 파일, MultiSelect 담당 에이전트 소유): 필터로 숨긴 옵션이 화살표·typeahead 이동 대상에 남는 문제를 호출자마다 막는 대신 공유 셀렉터 한 곳에서 차단. `select`·`dropdown-menu`는 hidden 옵션을 쓰지 않아 회귀 0(테스트로 확인, 아래 교차 확인 참조).
- 필터 정규화: `normalize("NFKC").toLowerCase()`. "만들기" 항목 정확 일치 판정도 같은 정규화를 쓰고 스펙 문구대로 **필터 결과(=보이는 옵션)** 기준으로 비교(`multi-select-search.tsx:113-122`).
- `onCreate`가 resolve로 준 `{value,label}`을 `Root`가 기억해(`createdOptions`) 옵션 라벨 목록에 합친다 — 소비자가 children에 옵션을 추가하기 전에도 칩이 값 문자열이 아니라 라벨로 보인다.
- `useMultiSelectSearch`는 `search` prop이 없어도 항상 호출(훅 순서 유지)하되 `filter`를 `null`로 넘겨 계산을 스킵하고, context에는 `search: undefined`로 실어 검색 코드가 렌더 경로에 전혀 끼지 않게 함.

### 3. FileInput (compound)

`packages/react/src/file-input/`에 `FileInput.tsx`(265행), `file-validation.ts`(108행, 별도 분리), `file-input-context.ts`(21행). 담당 에이전트 결정:

- `onFilesChange`를 스펙 원문과 달리 **optional**(`onFilesChange?`)로 선언 — 다른 컴포넌트의 콜백 관례(`onValueChange?` 등)와 맞추고 콜백 없이 Root만 마운트해도 타입 에러가 안 나게 함.
- accept 검증: `File.type`이 있으면 그것으로, 비어 있으면 파일명 확장자 → 소규모 매핑표(`EXTENSION_MIME`)로 MIME 패턴(`image/*`, `image/png`)을 추정 판정. 확장자 패턴(`.png`)은 `File.type`과 무관하게 항상 파일명으로만 판정. 매핑표에 없는 확장자 + 빈 type + MIME 패턴 조합은 불일치(안전 쪽 거부).
- `maxFiles`/`multiple` 상호작용: `multiple`이 falsy(미지정 포함)면 네이티브 input과 맞춰 암묵적으로 최대 1개만 통과, `multiple`일 때만 `maxFiles`가 상한. 초과분은 통과 판정 뒤 순서대로 `"count"` 사유로 밀림.
- hidden `<input type=file>`은 클릭 선택·드롭 공통 `assignFiles` 경로에서 매번 통과분(`files`)만 담도록 `DataTransfer`로 재동기화 — `name` 폼 제출에 거부 파일이 실리지 않게 함. jsdom이 `DataTransfer`를 구현하지 않아 `typeof DataTransfer !== "undefined"` feature-detection 가드로 테스트 환경에서만 건너뜀(실제 브라우저 동작 영향 없음).
- Dropzone `tabIndex`: 스펙 문구는 고정 `0`이지만 disabled일 때 `-1`로 바꿔 tab 순서에서 제외(버튼의 네이티브 disabled와 동일 기준). `aria-disabled`·`data-disabled`는 별도로 항상 표시.
- Trigger: disabled 관련 속성을 `asChild` 여부와 무관하게 항상 적용(`Button.tsx`와 동형) — `asChild`로 `<a>` 등을 감싸도 CSS `[disabled]` 3중 매칭과 스크린리더 `aria-disabled`가 걸리게 함.
- drop 핸들러는 disabled 여부와 무관하게 항상 `preventDefault()`(안 하면 브라우저가 새 탭으로 파일을 연다). disabled는 그다음 `assignFiles` 호출만 막음.
- vitest에서 `dragenter`/`dragleave`/`drop` 세 이벤트만 예외적으로 `fireEvent` 사용(`@testing-library/user-event` 14.x에 HTML5 DnD API가 없어 대안 없음) — click·keyboard·asChild는 전부 user-event.
- Playwright 스펙은 Playwright 공식 패턴(`page.evaluateHandle`로 브라우저 컨텍스트에서 `DataTransfer` 생성 → `dispatchEvent('drop', ...)`)을 사용. 키보드·클릭 열기는 `page.waitForEvent('filechooser')`.
- `file-validation.ts`를 별도 파일로 분리 — accept 매칭·`EXTENSION_MIME`이 `FileInput.tsx`에 섞이면 300~500줄 상한에 근접.

## 디자인 검토 반영 5건 (전후 값)

| ID | 대상 | 전 | 후 |
|---|---|---|---|
| F4 | 다크 `fg-neutral-weak` | `gray-500` | `gray-400` — 대비 검사 쌍 `{ fg: "fg-neutral-weak", bg: "bg-neutral-weak", min: 4.5 }` 신설(`packages/tokens/src/tokens.ts:213`, "StatePanel 본문" 등 약한 배경 조합 커버) |
| F6 | Slider hit box | 트랙 높이 = 렌더 두께(4px/6px) | `height: var(--dds-dimension-x6)`(24px, WCAG 2.5.8) — 렌더 두께는 `--dds-slider-track-height` 변수로 유지, `-webkit-slider-runnable-track` 세로 중앙 정렬로 시각 두께 불변 |
| F7 | StatePanel 제목 | (이전 폰트 크기 미상, 회귀 전) | `font-size: var(--dds-font-size-t5)` / `line-height: var(--dds-line-height-t5)`(`state-panel.css:25-29`) |
| F8 | Slider 미채움 트랙 | `bg-neutral-weak` | `var(--dds-color-stroke-neutral)`(`slider.css:38-39, 53-54`) |
| F10 | Tabs wide 모드 Content | `role="tabpanel"`·`aria-labelledby`·`data-state` 유지(트리거가 숨어 고아 참조) | wide일 때 이 속성들을 전부 제거하고 일반 `<div>`로 하강(`Tabs.tsx:185-199`) — 회귀 테스트 2건 추가(`tabs.test.tsx`, 고아 속성 부재 확인 + 소비자 명시 `tabIndex` 보존 확인) |

## 태스크 경계 교차 확인

- **barrel ↔ 실제 export**: `packages/react/src/index.ts`에 `FileInput`/`FileInputRoot`/…(70-83행), `SaveStatus`(130행), `MultiSelectFilter`/`MultiSelectFilterOption`/`MultiSelectCreate` 타입(105-107행) 모두 배선 완료. 담당 에이전트가 남긴 decisionRequest("배럴에 `MultiSelectFilter` 등 3개 타입 추가 필요")는 감독이 반영함.
- **스토리 import ↔ barrel**: `SaveStatus.stories.tsx`·`FileInput.stories.tsx`·`MultiSelect.stories.tsx` 모두 `@dg-design/react`에서 import, `pnpm --filter @dg-design/react run build` 후 `apps/storybook` 빌드 성공으로 해석 확인.
- **Playwright spec의 스토리 id ↔ 실제 export 이름**: `multi-select-search-functional.spec.ts`의 `multiselect--search-trigger-demo`/`multiselect--search-content-demo`가 `MultiSelect.stories.tsx`의 `title: "MultiSelect"` + `export const SearchTriggerDemo`/`SearchContentDemo`와 일치(kebab 변환 규칙대로). `file-input-functional.spec.ts`의 `fileinput--functional-demo`가 `FileInput.stories.tsx`의 `title: "FileInput"` + `export const FunctionalDemo`와 일치.
- **multi-select 변경이 select/dropdown-menu에 영향 없는지**: 담당 에이전트가 착수 전 전체 376 pass를 기준으로 잡고, 마감 후 `vitest run src/multi-select src/select src/internal src/dropdown-menu`(90 pass, 기존 21건 포함)와 전체 `pnpm --filter @dg-design/react test`(37 files/415 pass)로 무회귀 확인. 이번 검증에서도 동일 명령 재실행해 415 pass 재확인. `select.css`에 추가된 `.dds-select__option[hidden] { display: none; }` 규칙(`display:flex`가 UA `[hidden]`을 이기는 것을 막음)은 MultiSelect가 `dds-select__option` 클래스를 그대로 재사용(`MultiSelect.tsx:434`)하기 때문에 필요했던 공유 CSS 수정이며, 검사 결과 Select 단독 사용에는 영향 없음(옵션이 hidden으로 표시되는 경로가 Select에는 없음).

## 실제로 터진 위험과 해법

- **MultiSelect state-matrix VR 기준 이미지 밀림**: search 셀 3개(0개·칩 2개·disabled)를 기존 매트릭스에 추가하면서 레이아웃이 바뀜 — "얇은 요소 추가"가 아니라 임계(0.5%)를 넘길 변화로 담당 에이전트가 판단해 decisionRequest로 보고. **해법**: 기존 `multiselect--state-matrix` 기준 이미지를 삭제하고 visual-baseline 워크플로(CI ubuntu)로 재촬영 — 배포 파이프라인 단계로 이관, 이번 검증에서는 로컬 실행 대상에서 제외.
- **existing-mode DOM 회귀 우려**(스펙 "남은 위험" 항목): Trigger 안 입력 추가로 기존 `search` 없음 모드의 Trigger가 `button`→`combobox` 컨테이너로 바뀔 가능성 — `context.search?.mode === "trigger"`일 때만 `MultiSelectSearchTrigger`로 분기하고 그 외에는 기존 `<button role="combobox">` 경로를 그대로 두어(`MultiSelect.tsx:294-347`) 회귀 0. 테스트 `"search가 없으면 트리거는 여전히 button이고 검색 입력도 만들기 항목도 없다"`(`multi-select-search.test.tsx:325`)로 고정.
- **roving-focus 공유 변경의 부작용 우려**: `:not([hidden])` 추가가 `dropdown-menu`(hidden 항목 없음)·`select`(동일)에 영향 없는지 별도 스위트로 재확인 완료(위 교차 확인 참조).
- **jsdom `DataTransfer` 미구현**: FileInput의 hidden input 재동기화 로직이 테스트 환경에서 예외를 던질 뻔했으나 feature-detection 가드(`typeof DataTransfer !== "undefined"`)로 해소.
- **Node 22.16 로컬 게이트**(1차 결정에서 이어짐, 재확인): 이번 세션에서는 로컬 환경 자체 이슈 재발 없음.

## 미해결 사항

- **dg-studio 교체 PR**: 스펙대로 0.14.0 배포 이후 별도 라운드. `tag-picker.tsx`→`MultiSelect search="trigger" onCreate`, 툴바 status 2곳→`SaveStatus`, `cover-field.tsx`→`FileInput.Root/Trigger/Preview/Actions`+`Field.ErrorMessage` 교체와 dg-studio `typecheck·lint·unit·E2E` 통과까지 이 문서 범위 밖.
- **MultiSelect state-matrix VR 기준 이미지**: 위 "실제로 터진 위험" 참조 — 재촬영 필요.
- **Content 검색 모드(스펙의 "남은 위험" 그대로 이월)**: 기준 소비자가 없는 상태로 설계됨. dg-studio에 두 번째 소비자가 생기면 API 재검토.
- **FileInput 드롭 검증의 브라우저별 MIME 공백**: 확장자 fallback으로 완화했으나 매핑표(`EXTENSION_MIME`)에 없는 확장자는 여전히 불일치 처리(안전 쪽 거부) — 사용 중 소비자 요청이 오면 매핑표 확장.

## 감독 통합 중 수정 (Playwright에서만 드러난 것)

- `.dds-select__option { display: flex }`가 검색 필터의 `hidden` 속성을 이겨 숨긴 옵션이 그대로 보였다. jsdom은 CSS를 적용하지 않아 vitest는 통과했고 `multi-select-search-functional.spec.ts`가 잡았다. `select.css`에 `.dds-select__option[hidden] { display: none }` 추가. Tabs.Content·dg-studio pane에서 이미 두 번 겪은 함정 — `[hidden]`을 쓰는 요소는 자기 display 규칙 옆에 `[hidden]` 재선언을 둔다.
- trigger 모드 활성 항목 초기화가 `candidates`를 ref로만 읽어, 옵션 텍스트가 등록되기 전(첫 질의 순간) "만들기" 항목만 후보인 값이 굳었다. 효과의 의존성을 `candidates`로 바꾸고, 현재 활성이 후보에 남아 있으면 유지·아니면 첫 후보로 되돌리게 했다.
- VR 기준 이미지 삭제는 불필요 — 임계를 넘는 변화는 `-u`가 갱신하고, 색 txt 스냅샷은 임계가 없다. 머지 뒤 visual-baseline 워크플로 1회.
