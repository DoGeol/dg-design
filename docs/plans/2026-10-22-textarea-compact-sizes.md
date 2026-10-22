# TextArea 높이·조절, 작은 크기 확장, flex 조작 영역 정합 — 구현 계획

- 작성: 2026-10-22 · 기준 커밋: `66d5bf0` (react 0.23.0 · tokens 0.11.0)
- 상태: **승인 (2026-10-22)** — 배포 완료(react 0.24.0, PR #46·#47). 계획과 달라진 점: 스토리는 컴포넌트별 매트릭스에 행을 넣는 대신 조합 스토리 하나(`Compact sizes`, `compact-sizes--state-matrix`)에 두 밀도로 모았다. Tabs는 Root context, Pagination은 Root context + 지역 변수, Select 칩 small 클래스는 `selectTrigger` cva 밖(Select.tsx)에서 붙인다 — cva size에 넣으면 MultiSelect 타입으로 small이 샌다. Toast 닫기 44는 Alert와 같은 CSS 규칙이라 기능 테스트는 Alert만 잰다.
- 스펙: [2026-10-22 TextArea·작은 크기·flex 정합](../specs/2026-10-22-textarea-compact-sizes.md) — 이 계획은 순서와 파일만 정한다. 무엇을 만드는지는 스펙이 정본이다

## 진행 방식

- 브랜치 `feat/textarea-compact-sizes` 하나. 서브에이전트 없이 감독 세션이 직접 한다 — 단계마다 CSS·스토리·VR 기능 테스트 파일이 겹쳐 병렬로 나눠도 이득이 작다.
- 각 단계는 테스트를 먼저 쓴다(vitest + user-event, 인터랙션에 fireEvent 금지). 단계를 마칠 때 `pnpm --filter @dg-design/react test`가 초록이어야 다음으로 간다.
- 순서는 위험이 큰 것(기본 동작 변경·브라우저 차이)을 앞에, 기계적인 것을 뒤에 둔다.
- tokens는 바뀌지 않는다. 배포는 react minor 한 번이다.

## 순서

| # | 단계 | 파일 | 테스트 먼저 |
| --- | --- | --- | --- |
| 1 | TextArea `resizable` + 기본 끔 | `text-area/TextArea.tsx`(prop, `dds-text-area--resizable` 클래스), `text-area.css`(기본 `resize: none`, `--resizable`만 `vertical`. 비활성·읽기 전용·auto-resize·모바일 line은 지금처럼 none이 이긴다) | 기본은 클래스 없음, `resizable`이면 클래스, autoResize와 같이 주면 auto-resize 클래스가 함께 붙음(외관은 CSS가 정한다) |
| 2 | TextArea `rows` 최소 · `maxRows` 최대 | `TextArea.tsx`(인라인 변수 `--dds-text-area-min-rows`=rows·`--dds-text-area-max-rows`, `style` prop과 합치기), `text-area.css`(size별 `--dds-text-area-padding-block` 지역 변수, `min-height`·`max-height: calc(n * 1lh + 2 * padding + 2px)`, auto-resize의 `overflow: hidden` → max 도달 시 스크롤되게 `overflow-y: auto`), `use-auto-resize.ts`(폴백도 CSS min/max에 맡김 — `height = scrollHeight` 뒤 브라우저가 clamp. 필요하면 clamp 후 overflow 판단만 추가) | 인라인 변수 값·사용자 `style` 보존, maxRows 없으면 변수 없음. 높이·스크롤은 7단계 VR 기능 테스트가 잰다 |
| 3 | TextArea showCount reset | `TextArea.tsx`(uncontrolled일 때 `textarea.form`의 `reset`을 듣고 `defaultValue` 길이로) | 폼 안 uncontrolled + 입력 → reset 버튼 클릭 → 카운트 복귀. controlled는 영향 없음 |
| 4 | Chip·FilterChip small | `chip/Chip.tsx`(`size` prop → `dds-chip--size_small`), `chip.css`(20·t1·좌우 6·제거 버튼 20에 원 14. 모바일 블록에서 small을 medium 값으로 되돌림) | 클래스 단독·제거 있음·FilterChip, 기본 medium은 클래스 불변 |
| 5 | Select 칩 small · MultiSelect 내부 칩 | `internal/select-core.ts`(`selectTrigger`에 칩 small 클래스), `select/Select.tsx`(`SelectTriggerProps`를 variant별 유니언으로, chip일 때 size 전달), `select.css`(칩 트리거 small 높이), `multi-select/multi-select-search.tsx`(xsmall일 때 `<Chip size="small">`), `multi-select.css:15`(계산식의 칩 높이를 small 20으로 — 모바일은 medium 칩 기준 유지) | chip+small 클래스, field 기본 불변, `@ts-expect-error` 두 조합(field+small·chip+xsmall), xsmall 검색 트리거 안 칩 클래스 |
| 6 | Tabs small + 모바일 44 | `tabs/tabs-context.ts`(size), `Tabs.tsx`(Root `size` → context → Trigger 클래스), `tabs.css`(small 32·t3·좌우 8, 모바일 small=medium, 모바일 모든 트리거 `::before` 44 — `position: relative` 확인) | Root size가 Trigger 클래스로, 기본 medium 불변 |
| 7 | Pagination size | `pagination/Pagination.tsx`(Root `size` + 작은 context, Link·Previous·Next가 `dds-button--size_{size}`), `pagination.css`(최소 폭·높이를 size별로, 모바일 `max(…, touch-target)` 유지) | Root size → 링크·이전·다음 클래스, 기본 medium 불변 |
| 8 | DatePicker 트리거 size | `date-picker/picker/DatePicker.tsx`(`size` prop → 트리거 클래스 `dds-date-picker__trigger--size_{size}`), `date-picker.css`(xsmall은 `field-xsmall` 토큰 4개, large는 TextField large 값) | 트리거 클래스, 기본 medium 불변 |
| 9 | 닫기 X 모바일 44 · FileInput 반경 | `alert/alert.css`·`toast/toast.css`(모바일 `__close::before`, 버튼 `position: relative` 확인), `file-input/file-input.css:57`(`--dds-radius-button`) | 없음(CSS만) — 10단계 기능 테스트 |
| 10 | 스토리·VR 기능 테스트 | Storybook: `TextArea`(resizable·maxRows·rows 최소 행), `Chip`·`FilterToolbox`·`Select`·`MultiSelect`·`Tabs`·`Pagination`·`DatePicker` 매트릭스에 새 크기 행(`DensityColumns`로 두 밀도), `XsmallRow.stories.tsx`에 DatePicker xsmall·Pagination xsmall·Chip small 한 줄. `apps/visual-regression/tests/compact-sizes-functional.spec.ts` 새로 — 스펙 합격 조건의 높이·스크롤·계산 스타일·바깥 지점 클릭 | 스펙 합격 조건 그대로 |
| 11 | 사용 가이드 스킬 | `packages/react/skill-src/`의 text-area·chip·filter-toolbox·select·multi-select·tabs·pagination·date-picker 예제와 props 표 → `pnpm --filter @dg-design/react run build:skill`. Chip은 "small 칩 사이 간격 4 이상" 한 줄 | `check:skill` + 예제 typecheck·스모크 |
| 12 | 문서·배포 준비 | changeset(react minor — TextArea 기본 손잡이 제거와 `resizable` 복구를 맨 위에), 결정 기록 "구현 중 결정"에 이번 메모(0.22.0 "크기 축 없음" 뒤집음 포함), `docs/follow-ups.md`에서 TextArea showCount reset 행 삭제, 스펙·계획 상태 | — |

## 검증

`pnpm generate` → `pnpm build` → react test → `pnpm typecheck` → `check:subpaths`·`check:skill` → publint → storybook build → 로컬 VR(기능 테스트만. 시각 비교는 linux 기준이라 CI에서). 로컬 Playwright는 sandbox 밖에서 돌린다(Chromium mach port·preview 포트가 막힌다).

시각 기준: PR 뒤 `visual-baseline` 워크플로로 갱신한다. 기존 매트릭스에 새 크기 행을 넣으므로 해당 png·txt가 바뀌는 것은 정상이다. 행을 넣지 않은 매트릭스(Alert·Toast·FileInput)는 데스크톱 png가 그대로여야 한다 — 바뀌면 기본값이 새어 나간 것이다. 모바일 `::before`는 색 텍스트 스냅샷(txt)에 새 줄로 잡힌다(0.23.0에서 확인한 동작).

## 커밋·배포 (단계마다 승인)

1. 1~12 끝에 변경 요약을 보이고 승인 → 커밋·푸시·PR.
2. CI(원래 커밋) 확인 + 기준 워크플로 실행 → 실패가 VR 스냅샷 차이뿐이고 기준 커밋이 덮는지 확인.
3. PR 머지 승인 → Version PR → 머지 승인 = 배포(react minor).
4. 배포 뒤 AGENTS.md·INDEX 버전 줄 갱신(별도 docs PR, 승인 후).

## 위험과 대응

- **`lh` 단위**: Chrome 109·Safari 16.4·Firefox 120 미만에서는 계산식 전체가 무효가 되어 min·max가 사라진다(지금 동작으로 돌아감 — 깨지지는 않는다). 대체값을 두지 않는다.
- **`field-sizing` + `min-height`**: Chromium에서 `field-sizing: content`가 `min-height`를 따르는지 2단계 직후 실측한다. 따르지 않으면 auto-resize일 때 `min-block-size`·`height: max(...)` 같은 다른 경로를 쓰고 스펙의 "남은 위험"을 갱신한다.
- **Firefox 폴백**: CI에서 돌지 않는다. `use-auto-resize.ts`를 고칠 때 jsdom 테스트는 배선만 보고, 높이 계산은 코드 리뷰로 본다(스펙 남은 위험).
- **Select 유니언 타입**: `SelectTriggerProps`를 쓰는 곳(skill-src, Storybook, PropertyField.Trigger 조합)이 타입 에러를 낼 수 있다. 5단계에서 `pnpm typecheck`로 바로 확인한다.
- **Tabs·닫기 `::before`**: 트리거·닫기 버튼이 이미 `::before`를 쓰는지 먼저 grep한다. 쓰고 있으면 `::after`로 옮긴다.
- **MultiSelect 계산식**: xsmall 데스크톱만 칩 small 기준으로 바꾸고 모바일은 medium 칩(32) 기준이어야 한다 — 0.23.0에서 지운 모바일 되돌리기 규칙이 다시 생기지 않게 칩 높이를 지역 변수로 두고 small 클래스가 덮는 방식으로 한다.
- 파일 상한: `Select.tsx` 426줄에 유니언 타입이 더해진다. 500을 넘으면 트리거를 `select-trigger.tsx`로 나눈다.
