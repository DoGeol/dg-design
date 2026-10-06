# 다크 모드 부유 패널 경계 복구 계획 (2026-10-06)

> 상태: **구현 완료 (2026-10-06)** — 안 1(테두리 1px). 배포 대기. 결과는 맨 아래 "구현 결과"
> 작성: 2026-10-06 / 기준 커밋: 715b8e1 (react 0.17.2 · tokens 0.8.0)
> 출처: dg-studio 세션이 `/dg-design/components/*` 문서 페이지에서 실측해 작성했다. 구현은 `fix/dark-overlay-boundary` 브랜치에서 했다.

## 증상

다크 모드에서 Dialog·Popover·DropdownMenu 같은 부유 패널이 뒤 화면과 구분되지 않는다. 패널 안 글자만 떠 있는 것처럼 보인다. 라이트 모드는 정상이다.

## 실측

dg-studio main(6854cc4, react 0.17.2) dev 서버에서 예제를 열고 `getComputedStyle`로 읽었다. 페이지 배경(`.shell`, `.docs-example-frame`)은 다크에서 `rgb(15, 18, 18)`이다.

| 패널 | 다크 배경 | 테두리 | 그림자 | 백드롭 |
| --- | --- | --- | --- | --- |
| `.dds-dialog__content` | `rgb(15, 18, 18)` | 0px | `rgba(15,15,15,.18)` · `rgba(15,15,15,.08)` | `rgba(15, 18, 18, 0.5)` |
| `.dds-sheet__content` | `rgb(15, 18, 18)` | 0px | 같음 | `rgba(15, 18, 18, 0.5)` |
| `.dds-popover__content` | `rgb(15, 18, 18)` | 0px | 같음 | 없음 |
| `.dds-dropdown-menu__content` (ContextMenu 포함) | `rgb(15, 18, 18)` | 0px | 같음 | 없음 |
| `.dds-select__content` | `rgb(15, 18, 18)` | 0px | 같음 | 없음 |
| `.dds-hover-card__content` | `rgb(15, 18, 18)` | 0px | 같음 | 없음 |
| `.dds-tooltip__content` | `rgb(208, 213, 213)` | 0px | 같음 | 없음 |

Tooltip만 반전 배경이라 구분된다. 나머지 여섯은 패널 배경이 페이지 배경과 같은 값이고 테두리가 없다. 스크린샷으로도 Dialog·Popover·DropdownMenu의 경계가 보이지 않는 것을 확인했다. Toast는 positive 하나만 열어 봤다(`rgb(6, 48, 11)`, 테두리 0px).

재현: Storybook 또는 dg-studio 문서 페이지를 다크로 두고 Dialog·Popover·DropdownMenu를 연다.

## 원인

두 가지가 겹친다.

1. **그림자가 다크에서 보이지 않는다.** `--dds-shadow-overlay`는 모드 분기가 없는 어두운 알파 그림자다(`packages/tokens/src/tokens.ts:314`). 그 위 주석(309~313행)은 "항상 bg-overlay 백드롭 위에서만 쓰인다"를 근거로 들지만, Popover·DropdownMenu·ContextMenu·Select·MultiSelect·HoverCard·DatePicker 팝오버에는 백드롭이 없다. 전제가 틀렸다.
2. **패널 배경이 주변과 같다.** 다크의 `bg-layer-default`는 gray-1000(`#0f1212`)이고 페이지 배경도 같다. `bg-overlay`도 다크에서 gray-1000/0.5라 `#0f1212` 위에 합성하면 다시 `#0f1212`다. 백드롭이 있는 Dialog·Sheet도 패널과 주변이 같은 색이 된다.

라이트에서는 흰 패널 위 어두운 그림자가 경계를 만들어 주므로 문제가 드러나지 않았다. Popover 화살표에는 이미 같은 이유의 테두리가 있다(`popover.css`의 화살표 주석 "패널은 그림자만 있어 … 사라진다").

## 착수 전 결정

**결정: 안 1** (사용자, 2026-10-06). 나머지 두 안은 검토 기록으로 남긴다.

| 안 | 내용 | 영향 |
| --- | --- | --- |
| **1 (권장)** | 부유 패널에 `border: 1px solid var(--dds-color-stroke-neutral-weak)` | 토큰 변경 없음. Card와 Popover 화살표가 이미 쓰는 색이고 "테두리 1px" 관습과 맞는다. 라이트에서도 `#e4e9e8` 실선이 생긴다(흰 배경 대비 1.23:1이라 거의 안 보인다). react patch |
| 2 | 다크에서만 보이는 새 stroke 토큰(라이트 transparent) | 라이트 픽셀이 그대로다. 공개 토큰이 하나 늘고 tokens minor가 필요하다 |
| 3 | seed-design식 `bg-layer-floating`(다크에서 한 단계 밝은 표면) | 범위가 가장 넓다. fg·stroke 대비 검사 행이 새 배경마다 늘고, gray-900을 쓰면 `bg-neutral-weak` 버튼(`#242727`)이 패널에 묻힌다. gray-900과 페이지의 대비도 1.25:1뿐이라 테두리 없이는 약하다. 별도 결정으로 다룬다 |

안 1의 다크 테두리(`#3a3e3e`)는 `#0f1212` 위에서 1.74:1이다. 패널 경계는 조작 대상이 아니라 WCAG 1.4.11의 3:1 대상이 아니다. Card가 같은 값으로 이미 쓰이고 있다. 대비 검사 행은 추가하지 않는다.

## 변경 (안 1)

전부 `packages/react/src` 아래 CSS다. 패널은 모두 `box-sizing: border-box`다. 크기를 지정한 축은 바깥 크기가 그대로이고 안쪽이 2px 줄어든다. 내용에 맞춰 늘어나는 축(대부분의 높이)은 바깥 크기가 2px 늘어난다.

| 파일 | 변경 |
| --- | --- |
| `dialog/dialog.css` `.dds-dialog__content` | 테두리 추가 |
| `popover/popover.css` `.dds-popover__content` | 테두리 추가. DatePicker 팝오버(`.dds-date-picker__popover`)가 이 클래스를 물려받는다 |
| `hover-card/hover-card.css` `.dds-hover-card__content` | 테두리 추가 |
| `dropdown-menu/dropdown-menu.css` `.dds-dropdown-menu__content` | 테두리 추가. ContextMenu가 이 클래스를 쓴다 |
| `select/select.css` `.dds-select__content` | 테두리 추가. MultiSelect가 이 클래스를 쓴다(`MultiSelect.tsx:376`) |
| `sheet/sheet.css` | 화면 안쪽 변에만: `--side_left`는 `border-right`, `--side_right`는 `border-left`, `--side_top`은 `border-bottom`, `--side_bottom`은 `border-top`. 화면 가장자리에 붙는 변에는 선을 그리지 않는다. DatePicker 모바일 시트도 여기에 포함된다 |

함께 고칠 것:

- `packages/tokens/src/tokens.ts:309~313` 주석 — "항상 백드롭 위" 전제를 지우고, 경계는 패널 테두리가 맡는다고 적는다. 값은 그대로라 tokens changeset은 없다.
- `popover.css`·`hover-card.css` 화살표 주석 — "패널은 그림자만 있어"가 더는 사실이 아니다.
- 결정 기록 한 건(짧게) — `decisions/2026-08-15-dialog-implementation.md`의 "shadow-overlay는 항상 오버레이 위에서만 쓰여 배경 명암 무관"을 대체한다. AGENTS.md "컴포넌트 CSS" 줄에 "부유 패널은 `stroke-neutral-weak` 테두리 1px + `shadow-overlay`"를 더한다.
- `.changeset/dark-overlay-boundary.md` — `"@dg-design/react": patch`(`@` 키 따옴표).

제외: Tooltip(반전 배경으로 이미 구분된다). Toast는 아래 "범위 밖"에 따로 적었다.

### 주의할 곳

- **화살표 이음매.** 화살표는 `position: absolute`라 패널 padding box 기준으로 놓인다(`internal/use-overlay-position.ts:80`, `-offsetWidth / 2`). 패널에 테두리가 생기면 화살표 중심이 바깥 테두리선보다 1px 안쪽에 온다. 화살표 배경이 패널 테두리를 덮어 선이 끊겨 보여야 하고, 화살표의 두 변이 패널 테두리와 자연스럽게 만나야 한다. 네 방향 모두 확대해서 확인하고, 어긋나면 그 오프셋에서 테두리 폭만큼 보정한다. → 실제로 어긋나 보정했다(구현 결과 참고).
- **스크롤 패널.** `overflow-y: auto`인 Dialog·DropdownMenu·Select·DatePicker 팝오버에서 스크롤바가 테두리 안쪽에 놓이는지 본다.

## 검증

1. `pnpm generate` → `pnpm build` → `pnpm --filter @dg-design/react test` → `pnpm typecheck` → `pnpm --filter @dg-design/react exec publint` → `pnpm vr`.
2. 로컬(darwin)은 기준 이미지가 없어 스크린샷 비교가 스킵된다. 시각 확인은 Storybook에서 직접 한다: 라이트·다크 각각 Dialog, Sheet 네 방향, Popover·HoverCard 화살표 네 방향, DropdownMenu, ContextMenu, Select, MultiSelect, DatePicker 데스크톱 팝오버와 모바일 시트.
3. 재발 방지 검사 하나: `apps/visual-regression/tests/`에 기능 테스트를 추가해 다크에서 각 패널을 열고 `border-top-width`가 `1px`인지(Sheet는 안쪽 변) 확인한다. 로컬에서도 돈다.
4. 기준 PNG는 CI `visual-baseline` 워크플로로만 갱신한다. 열린 패널이 찍히는 스토리가 라이트·다크 모두 바뀐다. 후보: `dialog--state-matrix-story`, `sheet--state-matrix`, `popover--state-matrix-story`, `dropdownmenu--state-matrix-story`, `select--state-matrix-story`, `multiselect--state-matrix`, `hovercard--functional-demo`(defaultOpen), `datepicker-open-desktop`, `daterangepicker-open-desktop`, `daterangepicker-open-mobile`. 실제 목록은 CI diff로 확정한다. 색 텍스트 스냅샷(`.txt`)은 `#storybook-root` 안만 읽어 포털로 나가는 패널이 잡히지 않으므로 대부분 그대로일 것으로 보인다.
5. 알아둘 것: `dialog--state-matrix-story-dark.png` 기준에는 패널 둘레에 청록 링이 찍혀 있다. main CI(715b8e1)는 통과 중이라 현재 렌더와 일치하는 상태다. 링이 어디서 오는지는 확인하지 않았다. 새 테두리와 겹쳐 보이는지 Storybook에서 본다.

## 배포와 후속

- 커밋·푸시는 사용자 승인 뒤. changeset 커밋이 main에 오르면 봇이 Version PR을 만들고, 그 PR 머지가 배포 승인이다(0.17.3 예상).
- dg-studio: `@dg-design/react`를 새 버전으로 고정하고 `pnpm-workspace.yaml`의 `minimumReleaseAgeExclude`에서 `@dg-design/react@0.17.2`를 새 버전으로 바꾼다. 다크에서 `/dg-design/components/dialog`·`popover`·`dropdown-menu`와 Homeground 분류 관리 Dialog를 확인한다. dg-studio에는 패널 Content에 테두리·그림자 className을 덧씌운 곳이 없어(grep 0건) 이중 테두리는 생기지 않는다.

## 범위 밖 (기록만)

- `bg-overlay`가 다크 페이지 위에서 표면색을 바꾸지 못한다(글자만 흐려진다). 테두리로 Dialog는 구분되지만, 백드롭을 더 어둡게 하려면 다크 값을 따로 정해야 한다.
- 그림자 모드 분기. seed-design은 다크에서 알파를 크게 올린다(s1 기준 `#00000014` → `#00000080`).
- `bg-layer-floating` 표면 단계(안 3).
- 다크 Toast는 구현 중에 `toast--state-matrix`로 확인했다. 여섯 intent 모두 채워진 면이라 페이지와 구분된다(neutral `#242727` 포함). 바꾸지 않았다.

## 구현 결과 (2026-10-06)

브랜치 `fix/dark-overlay-boundary`(기준 715b8e1).

- 패널 5종에 테두리 1px, Sheet는 안쪽 변에만. 계획의 "변경" 표 그대로다.
- 화살표가 실제로 어긋났다. 화살표 변 끝이 패널 테두리선 안쪽으로 약 0.7px 삐져나왔다. `internal/use-overlay-position.ts`에서 `floating.clientTop`(테두리 폭)만큼 더 내보내 고쳤다. Tooltip은 다른 훅(`use-tooltip-position.ts`)을 쓰고 테두리가 없어 그대로다.
- `apps/visual-regression/tests/overlay-boundary.spec.ts` 추가(6건). 다크에서 패널별로 테두리 폭 1px와 테두리색이 배경색과 다른지를 확인한다.
- 문서: [결정 기록](../decisions/2026-10-06-floating-panel-border.md), AGENTS.md 컴포넌트 CSS 줄, tokens.ts 그림자 주석, `.changeset/dark-overlay-boundary.md`(react patch).

| 명령 | 결과 |
| --- | --- |
| `pnpm generate` | 생성 완료 — palette 61 / semantic 47, 대비 검사 통과 |
| `pnpm build` | tokens · react · storybook 성공 |
| `pnpm --filter @dg-design/react test` | 44 files / 518 tests 통과 |
| `pnpm typecheck` | 3개 프로젝트 통과 |
| `pnpm --filter @dg-design/react exec publint` | All good! |
| `pnpm vr` | 122 통과 / 79 스킵(darwin 기준 이미지 없음) |

Storybook 스크린샷으로 다크의 Dialog, Popover, HoverCard, DropdownMenu, Select, Sheet 네 방향, ContextMenu, DatePicker 팝오버를 눈으로 확인했다. 라이트는 Dialog와 DropdownMenu만 봤다. 화살표 이음매는 Popover·HoverCard의 bottom 방향만 다크에서 6배 확대해 봤다. 나머지 세 방향은 같은 코드 경로지만 직접 보지는 않았다.

남은 것:

- `overlay-exit.spec.ts`의 Dialog "ESC 직후 data-state=closed" 테스트가 간헐적으로 실패했다(전체 실행 1회, 5회 반복 실행 1회. 그 테스트만 30회 반복은 직렬·병렬 모두 통과). 이번 변경은 그 테스트가 타는 경로를 건드리지 않는다. `overlay-exit.spec.ts`와 `use-presence.ts`는 그대로고 `dialog.css`에는 `border` 한 줄만 더했다(애니메이션 규칙 불변). 그래서 기존 불안정으로 분류했다. main과 비교 실행은 하지 않았다.
- VR 기준 PNG 갱신. PR #22 CI에서 198 통과 / 3 실패였다. 실패 3건은 전부 `date-picker-visual.spec.ts`의 열린 패널 요소 스크린샷이고, 패널 높이가 2px 늘어 크기부터 달랐다(예: 384×525 → 384×527). 스토리 전체를 찍는 나머지 스크린샷은 1px 선이 `maxDiffPixelRatio` 0.005 안이라 통과했다. `visual-baseline` 워크플로로 기준을 갱신해야 한다.
- DatePicker 모바일 시트는 Sheet `side="bottom"` 규칙을 그대로 타지만 따로 열어 보지는 않았다.
- 커밋·푸시·Version PR 머지, 그리고 dg-studio 버전 올리기.
