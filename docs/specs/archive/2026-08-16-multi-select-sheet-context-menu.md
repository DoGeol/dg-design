# MultiSelect·Sheet·ContextMenu — 파생 컴포넌트 3종

## 메타
- 생성: 2026-08-16
- 라운드: 4
- 최종 모호도: 17% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: 이전 스펙 3건의 명시적 이월 — Select("다중 선택은 별개 물건")·Dialog("Sheet/Drawer류는 별개")·DropdownMenu("ContextMenu는 별개")
- 승인: 승인됨 (2026-08-16, 3종 일괄 구현 + 0.9.0 합류 릴리스)
- 구현: **완료** — 0.9.0 준비 (2026-08-16). 합격 조건 15/16 확정 + VR 신규 기준은 visual-baseline 워크플로로 완성

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 | 남은 구멍 |
|------|------|--------|-----------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 | — |
| 제약 | 0.80 | 0.25 | 0.200 | Sheet 크기 실값은 위임 |
| 성공 기준 | 0.80 | 0.25 | 0.200 | 추출 리팩터의 회귀 게이트는 기존 테스트에 의존 |
| 맥락 | 0.90 | 0.15 | 0.135 | — |
| **모호도** | | | **17%** | |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| MultiSelect | 진행 | 다중 선택, 요약 텍스트 트리거, internal 공통 추출 | 표시·경계 확정 |
| Sheet | 진행 | 4방향 슬라이드 모달 오버레이 | side 축 확정 |
| ContextMenu | 진행 | 우클릭 메뉴, 마우스 전용 | 접근성 정책 확정 |
| 테스트·VR | 진행 | vitest + Playwright + VR 기준 | 확립 패턴 |
| 릴리스 0.9.0 | 진행 | 기존 대기 changeset과 합류해 5종 한 번에 | 관례 |
| 레시피 코드젠 재고 | 진행 | 17종 도달로 트리거 발동 — 마감 시 판단·기록만 | 판단 산출물만 |

## 목표

Select·Dialog·DropdownMenu가 각각 "별개 물건"으로 미뤄둔 파생 3종(MultiSelect·Sheet·ContextMenu)을 기존 오버레이 자산 위에 만들고, 대기 중인 NotificationBadge·HoverCard와 함께 0.9.0으로 한 번에 릴리스한다.

## 제약

### MultiSelect (`packages/react/src/multi-select/` + `packages/react/src/internal/`)

- **트리거 표시는 요약 텍스트**: 선택 0개면 placeholder, 1개면 그 라벨, 2개 이상이면 `"{n}개 선택됨"`. 트리거 높이는 Select와 동형 고정. 문구 커스터마이즈 prop 여부는 위임(기본 문구는 한국어)
- **해제는 패널 안에서만** — 트리거에 칩·X 없음
- 값 상태: `value`/`onValueChange`/`defaultValue`가 `string[]`. `useControllableState`는 제네릭이라 수정 불필요
- **선택해도 닫히지 않는다** — Option 클릭·Enter는 토글, 패널 유지. 닫힘은 외부 클릭·ESC·트리거 재클릭
- Option에 선택 표시(체크마크) — Select의 표시 방식 재사용
- **닫힌 상태 typeahead 없음**: Select의 "닫힌 상태 문자 키 = 값 직접 변경"은 다중 값에 대응 관례가 없다. 닫힌 상태 문자 키는 열기만. 열린 상태 typeahead(포커스 이동)는 그대로 재사용
- 폼 제출: `name` 있으면 값마다 `<input type="hidden" name value>` 반복 렌더(다중값 관례)
- Field 연동·aria: Select 경로 그대로. `aria-multiselectable="true"`, Option에 `aria-selected`
- **공통 추출**: 옵션 수집(`collectOptions`·`matchOption`)·typeahead·열린 상태 키보드 분기를 `internal/`로 옮기고 Select·MultiSelect가 함께 소비한다. Select는 동작 무변경 — **기존 select 테스트 전량 통과가 추출의 합격 게이트**
- `Select.tsx`는 이 추출로 396줄에서 줄어들어야 한다(500줄 상한 준수)

### Sheet (`packages/react/src/sheet/`)

- compound는 Dialog 대칭: `Root`·`Trigger`·`Overlay`·`Content`·`Title`·`Description`·`Close`
- **`side` 4종**: `left`·`right`(기본)·`top`·`bottom`. 방향마다 진입·퇴장 keyframes 2개
- 모달 전용 — `dialog-stack`에 `modal: true`로 등록(ESC 라우팅·스크롤 잠금·배경 inert 전부 Dialog와 동일)
- presence·포커스 정책·중첩 스택 전부 Dialog 재사용. **퇴장 keyframes에 `animation-fill-mode: forwards` 필수**(없으면 언마운트 직전 스냅백 — dialog.css의 기록된 함정)
- 크기: 좌우는 width, 상하는 height. 실값은 rem 리터럴로 위임(dimension 스케일 최대 64px이라 표현 불가 — `dialog.css`의 `min(32rem, …)` 선례를 따른다)
- 모션 토큰: `--dds-duration-base` + `--dds-easing-out` 재사용. **신규 모션 토큰 0**
- reduced-motion 대응(= presence의 즉시 언마운트 경로)
- **`use-presence`·`dialog-stack`을 `dialog/`에서 `internal/`로 이동**한다 — 이미 `internal/use-overlay`가 끌어다 쓰고 Sheet가 세 번째 소비자가 된다. 이동은 import 경로 변경뿐, 동작 무변경(기존 dialog 테스트 전량 통과가 게이트)

### ContextMenu (`packages/react/src/context-menu/` + `internal/use-overlay-position.ts`)

- compound: `Root`·`Trigger`·`Content`·`Item`·`Separator`·`Label` — DropdownMenu 대칭. Item·Separator·Label과 패널 CSS는 DropdownMenu 계열 재사용
- **마우스 전용**: `contextmenu` 이벤트로 열림 + `preventDefault()`로 브라우저 기본 메뉴 차단. **Shift+F10·메뉴키·터치 long-press는 지원하지 않는다.** HoverCard와 같은 논리로 "보조 경로 — 같은 동작이 다른 UI로도 도달 가능해야 함"을 문서화
- 열린 뒤 키보드는 DropdownMenu와 동일(roving tabindex 화살표·Enter·ESC) — 여는 경로만 마우스 전용이다
- **커서 좌표 기준 배치**: `internal/use-overlay-position.ts`의 reference 타입을 floating-ui `VirtualElement` 허용으로 넓힌다. 기존 소비자(DropdownMenu·Select·Popover·HoverCard) 동작 무변경이 게이트
- 열린 상태에서 다른 곳 우클릭 → 새 좌표로 재배치(닫고 다시 열기 허용). 비모달 스택 등록(DropdownMenu와 동일)
- placement는 `bottom-start` 계열(커서 오른쪽 아래로 펼침), flip·shift로 뷰포트 경계 대응

### 테스트·VR

- vitest: MultiSelect(값 배열 controlled/uncontrolled, 토글·패널 유지, 요약 문구 3분기, hidden input 개수, aria-multiselectable, Field 연동), Sheet(side 4종 클래스, 모달 스택·inert, 포커스 복귀), ContextMenu(contextmenu 열림·기본 메뉴 차단, 좌표 반영, roving, ESC)
- **회귀 게이트**: 기존 vitest 134건 전량 통과 — 추출 3건(select-core·presence/stack 이동·position 타입 확장)이 전부 기존 컴포넌트를 건드리기 때문에 이게 가장 중요한 조건이다
- Playwright 기능: MultiSelect 다중 선택 후 패널 유지·외부 클릭 닫힘, Sheet side별 열림·ESC, ContextMenu 우클릭 열림·기본 메뉴 차단
- VR: 열림 고정 스토리 라이트·다크. 스토리 id 규약 — `multiselect--functional-demo`·`multiselect--state-matrix`, `sheet--state-matrix`(4방향 한 장), `contextmenu--functional-demo`. 신규 기준은 스킵 → visual-baseline 워크플로 경로

### 릴리스

- 새 changeset 1장(react minor) — 기존 `small-batch-2.md` changeset과 합류해 **0.9.0 한 번에 5종 배포**
- frontmatter `@` 키 따옴표 인용 필수, `changeset status`로 파싱 실검증

## 하지 않을 것

- **MultiSelect 칩/태그 트리거·개별 X** — 요약 텍스트 채택으로 배제(트리거 높이 가변·칩 내부 키보드 순회 비용)
- **MultiSelect 검색 입력(combobox 필터)·전체 선택·그룹 단위 선택** — 별개 수요
- **MultiSelect 닫힌 상태 typeahead 값 변경** — 다중 값에 네이티브 관례 없음
- **Sheet 드래그 제스처·스냅 포인트·리사이즈** — 포인터 제스처는 별개 난도, 수요 시
- **Sheet 비모달 모드** — 모달 전용. 비모달 측면 패널이 필요하면 레이아웃의 일이지 오버레이의 일이 아니다
- **ContextMenu Shift+F10·메뉴키·터치 long-press** — 마우스 전용 확정(반론 라운드)
- **ContextMenu Sub(중첩)·CheckboxItem·RadioItem** — DropdownMenu가 이미 미룬 것, 그대로 유지
- **신규 색·모션·치수 토큰** — 전부 기존 재사용
- **레시피 코드젠 실제 도입** — 이번엔 트리거 발동에 따른 판단과 기록만. 도입 여부는 결정 기록으로 남긴다

## 합격 조건

- [ ] MultiSelect: 값 배열 controlled/uncontrolled 동작, Option 클릭이 토글이고 패널이 닫히지 않음 (vitest)
- [ ] MultiSelect: 요약 문구 3분기(0개 placeholder / 1개 라벨 / 2개+ "n개 선택됨") (vitest)
- [ ] MultiSelect: `name` 지정 시 hidden input이 선택 개수만큼, aria-multiselectable·aria-selected (vitest)
- [ ] MultiSelect: Field 연동(label 클릭 포커스·invalid) (vitest)
- [ ] Sheet: side 4종이 각각 해당 방향에서 슬라이드, 퇴장 애니메이션 스냅백 없음 (VR + vitest 클래스)
- [ ] Sheet: 모달 스택 동작 — ESC 최상단만 닫힘·배경 inert·스크롤 잠금·트리거 포커스 복귀 (vitest)
- [ ] ContextMenu: 우클릭으로 열리고 브라우저 기본 메뉴가 뜨지 않음, 커서 좌표에 배치 (Playwright)
- [ ] ContextMenu: 열린 뒤 화살표 roving·Enter 실행·ESC 닫힘 (vitest)
- [ ] **추출 무회귀: 기존 vitest 134건 전량 통과** (select-core 추출·presence/stack 이동·position 타입 확장 후)
- [ ] `Select.tsx`가 500줄 이하 (`wc -l`)
- [ ] 신규 토큰 0 — `pnpm generate`의 palette·semantic 개수 불변
- [ ] Playwright 기능 신규 3종 그린 + 기존 21건 무회귀
- [ ] VR 신규 기준(워크플로 경유) 포함 파이프라인 그린
- [ ] Storybook: 3종 데모 + 매트릭스
- [ ] changeset 합류로 0.9.0에 5종 반영 (`changeset status`로 확인)
- [ ] 레시피 코드젠 재고 판단을 결정 기록에 남김

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| MultiSelect 트리거는 칩 나열(업계 관례) | 높이 가변·칩 내부 키보드 순회 비용 제시 | 요약 텍스트, 높이 고정 |
| Select에 multiple 분기가 diff 최소 | Select.tsx 396줄 + 500줄 상한 + 병렬 경계 충돌 근거 제시 | internal 공통 추출, 양쪽이 소비 |
| Sheet side는 실수요만(2종) | 방향 추가가 기계적 복제라 병목이 없음을 제시 | 4방향 전부 |
| ContextMenu도 Positioner처럼 뺄 후보 | 반론: 터치 부재·키보드 별도 구현·유일한 internal 변경 | 넣되 **마우스 전용**으로 축소 |

## 기술 맥락

- `internal/use-overlay.ts`(158줄)가 오버레이 배선 전부 보유 — 3종 모두 신규 primitive 거의 불필요
- `Select.tsx:57-61` 값 상태는 `useControllableState<string|undefined>` 하나. 갈리는 지점 3곳(setValue·트리거 라벨·Option 클릭)
- `Select.tsx:184-204`(닫힌 상태 typeahead) vs `:255-280`(열린 상태) — MultiSelect가 재사용하는 건 후자뿐
- `dialog.css:36-45` 퇴장 패턴(`[data-state="closed"]` + `animation-name` 교체 + `forwards`)이 이미 4개 컴포넌트에 복붙됨. Sheet가 5번째
- `dialog/use-presence.ts:25-31`이 computed style에서 길이를 실측 — Sheet가 다른 duration을 써도 훅 수정 불필요
- `internal/roving-focus.ts`는 role만 파라미터 — ContextMenu가 `menuitem`으로 그대로 재사용
- `internal/use-overlay-position.ts:31`의 `reference: HTMLElement`가 ContextMenu의 유일한 실질 구멍
- z-index 토큰 없음 — 스택 순서는 portal append 순서에 의존. Sheet도 동일 방식이면 토큰 불필요
- 기존 VR functional 스펙은 `hasStory` 가드로 스토리 부재 시 skip — 신규 스펙도 같은 패턴

## 남은 위험

- **추출 3건이 전부 기존 컴포넌트를 건드린다** — select-core 추출(Select), presence·stack 이동(Dialog·모든 오버레이), position 타입 확장(오버레이 4종). 회귀 게이트는 기존 테스트 134건뿐이며, 테스트가 못 잡는 회귀는 VR이 잡는다. 병렬 실행 시 `internal/`을 두 태스크가 만지므로 **파일 단위 소유를 명시해야 한다**
- Sheet 크기 실값이 위임 — 4방향에서 어색한 값이 나오면 VR 기준을 다시 찍어야 함
- ContextMenu가 열린 상태에서의 재우클릭 처리는 브라우저별 이벤트 순서 차이 가능 — Playwright 실측 필요
- 5종 한 릴리스라 changeset이 2장 합류 — version 실행 전 `changeset status`로 반드시 확인(0.5.0 때 인용 누락 사고 선례)

## 인터뷰 기록

[2026-08-16-multi-select-sheet-context-menu-interview.md](2026-08-16-multi-select-sheet-context-menu-interview.md) 참조 (4라운드).
