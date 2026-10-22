# TextArea 높이·조절, 작은 크기 확장, flex 조작 영역 정합

## 메타

- 생성: 2026-10-22
- 라운드: 7
- 최종 모호도: 16% (임계값 20%)
- 유형: 브라운필드 · 공개 API 추가 + TextArea 기본 동작 변경
- 상태: 통과
- 근거: [flex 적용 방향](../decisions/2026-10-09-flex-adoption-direction.md)의 "Button xsmall"·"닫기·제거 X hover"·"작은 크기 단계" 절 · [P6 폼 확장 스펙](2026-10-09-p6-form-variants.md) · 2026-10-22 사용자 요청(TextArea 창 조절 기본 끔, autoResize 최대 높이, 전체 xsmall 확장)과 그 검토 목록
- 승인: **승인(2026-10-22)** — 구현 계획부터 세우기 선택

## 명확도

| 차원 | 점수 | 가중치 | 가중 점수 |
| --- | --- | --- | --- |
| 목표 | 0.88 | 0.35 | 0.31 |
| 제약 | 0.82 | 0.25 | 0.21 |
| 성공 기준 | 0.80 | 0.25 | 0.20 |
| 맥락 | 0.85 | 0.15 | 0.13 |
| **모호도** | | | **16%** |

## 구성요소

| 구성요소 | 상태 | 설명 | 커버리지 / 보류 사유 |
| --- | --- | --- | --- |
| 1. TextArea 높이·조절 | 진행 | 창 조절 기본 끔 + `resizable`, `maxRows`, autoResize가 `rows`를 최소로 지킴, showCount reset | R3·R4 |
| 2. DatePicker 트리거 size | 진행 | `size="xsmall" \| "medium" \| "large"` | 이름 규칙에서 도출 |
| 3. Pagination size | 진행 | Root에 `size="xsmall" \| "small" \| "medium"` | 이름 규칙에서 도출 |
| 4. Tabs | 진행 | Root에 `size="small" \| "medium"`(small 32), 모바일 조작 영역 44 | R2·R7 |
| 5. Chip small | 진행 | Chip·FilterChip `size="small"`(20), Select 칩 트리거 small, MultiSelect xsmall 트리거 안 칩 small | R1·R5·R6 |
| 6. 조작 영역·반경 정합 | 진행 | Alert·Toast 닫기 모바일 44, FileInput 기본 Trigger 반경 6 | 검토 목록 C2·C3 |
| Slider xsmall | 보류 | — | 손잡이가 더 작으면 잡기 어렵다(0.22.0 결정 유지) |
| 옵션·메뉴·목록·표 compact 밀도 | 보류 | — | 크기 prop이 아니라 밀도 주제다. 역할 토큰이 이미 데스크톱·모바일로 나눈다 |

## 목표

TextArea는 기본으로 크기가 고정되고 필요할 때만 늘어나며(손잡이·자동 확장·최대 줄 수), 크기 축이 없던 DatePicker·Pagination·Tabs·Chip은 Button xsmall과 같은 줄에 둘 작은 단계를 데스크톱에 갖고, 모바일에서는 모든 조작 대상이 flex 계약(누르는 영역 44)을 지킨다.

## 공통 규칙

- **작은 단계는 데스크톱 전용이다.** 모바일 밀도(`[data-dds-density="mobile"]`)에서는 medium으로 그린다(입력 xsmall과 같은 규칙, R1).
- **이름은 결정 기록 규칙을 따른다.** 높이가 같으면 Button과 같은 이름(xsmall 28·small 36)을 쓰고, 28이 맞지 않으면 지금 가장 작은 것보다 한 단계 아래 이름(small)을 쓴다.
- **모바일 44는 보이는 크기를 키우지 않는다.** 투명 `::before`로 누르는 영역만 넓힌다(Button xsmall·Chip 제거 버튼·라벨 없는 Checkbox와 같은 식). tokens는 바뀌지 않는다.
- compound 컴포넌트의 size는 Root가 받아 context로 내린다(Accordion·RadioGroup 선례).

## 1. TextArea 높이·조절

### API

```tsx
<TextArea rows={3} />                         // 고정 3줄, 손잡이 없음, 넘치면 세로 스크롤
<TextArea rows={3} resizable />               // 세로 손잡이
<TextArea autoResize rows={2} maxRows={6} />  // 2줄에서 시작해 6줄까지 자라고 그 뒤 스크롤
<TextArea rows={3} resizable maxRows={10} />  // 손잡이로 10줄까지만 늘어남
```

- `resizable?: boolean`, 기본 `false`. 켜면 `resize: vertical`. 가로 조절은 없다(레이아웃을 깬다).
- `maxRows?: number`. 항상 최대 높이다 — autoResize 확장과 `resizable` 드래그 둘 다 여기서 멈춘다(R3). 최대에 닿으면 `overflow-y: auto`.
- autoResize가 켜지면 `rows`가 최소 높이다. 지금 Chromium은 `field-sizing: content`가 `rows`를 무시해 rows=3이 한 줄(38px)로 그려진다(실측 78 → 38). JS 대체 경로(Firefox)는 `height: auto`가 rows 상자로 돌아가 rows를 지키는 것으로 보인다 — 두 경로를 같은 결과로 맞춘다.
- 조합 규칙:
  - autoResize + `resizable` → autoResize가 이긴다(손잡이 없음). 지금 `.dds-text-area--auto-resize { resize: none }`과 같다.
  - `maxRows < rows` → `rows`가 이긴다(CSS `min-height`가 `max-height`보다 우선). 경고는 내지 않는다.
  - 비활성·읽기 전용은 `resizable`이어도 손잡이가 없다(지금 규칙 유지).
  - 모바일 `variant="line"`은 `resizable`이어도 손잡이가 없다(지금 규칙 유지 — 손잡이가 아래 경계를 가린다).
- 최소·최대 높이 계산: `줄 수 × 1lh + 위아래 padding + 테두리 2px`. size마다 padding이 달라 size 규칙이 `--dds-text-area-padding-block` 같은 지역 변수를 두고 계산식 하나가 읽는다. 줄 수는 인라인 CSS 변수(`--dds-text-area-min-rows`·`--dds-text-area-max-rows`)로 넘긴다.
- showCount form reset: uncontrolled일 때 상위 `form`의 `reset` 이벤트에서 카운트를 `defaultValue` 길이로 되돌린다(follow-ups 항목 정리).

### 호환

- **기본 동작이 바뀐다.** 지금까지 기본이던 세로 손잡이가 사라진다. 되돌리려면 `resizable`을 준다. changeset(react minor)에 그대로 적는다.
- `rows`·autoResize·showCount·Field 연결 계약은 그대로다.

## 2. DatePicker 트리거 size

- `DatePicker`에 `size?: "xsmall" | "medium" | "large"`, 기본 `medium`. 트리거(`dds-date-picker__trigger`)에만 적용한다.
- xsmall은 `field-xsmall` 역할 토큰(높이·여백·반경·글자)을 읽는다 — 모바일에서는 토큰이 medium 값으로 바뀐다. large는 TextField large(52·반경 12·글자 18)와 같은 값이다.
- 팝오버·시트 안 부품(달력, `DatePickerField` 44)은 바꾸지 않는다.

## 3. Pagination size

- `Pagination.Root`에 `size?: "xsmall" | "small" | "medium"`, 기본 `medium`. 링크·이전·다음은 Button의 같은 이름 size 클래스를 쓴다(지금 `dds-button--size_medium` 고정).
- 데스크톱 높이·최소 폭: xsmall 28 · small 36 · medium 40. 모바일은 지금처럼 `max(크기, var(--dds-size-touch-target))`로 44 이상이다.
- large(52)는 넣지 않는다 — 쪽 번호에 쓸 자리가 없다.

## 4. Tabs

- `Tabs.Root`에 `size?: "small" | "medium"`, 기본 `medium`.
- small 데스크톱: 최소 높이 32, 글자 13/18(t3), 좌우 여백 8. 탭과 패널 간격·표시선은 medium과 같다.
- 모바일: small도 medium(40)으로 그린다. 그리고 **모든 크기의 탭이** 투명 `::before`로 누르는 영역을 44까지 넓힌다(R2) — 보이는 높이 40은 결정 기록 치수표대로 둔다.

## 5. Chip small

- `Chip`·`FilterChip`에 `size?: "small" | "medium"`, 기본 `medium`.
- small 데스크톱: 높이 20, 글자 11/15(t1), 좌우 여백 6, 제거 버튼 20 정사각에 hover 원 14(`background-clip: content-box`로 안쪽만 칠한다 — 지금 규칙 유지).
- 모바일: small도 medium(32, 제거 원 20, 누르는 영역 44)으로 그린다.
- **Select 칩 트리거**: `Select.Trigger`의 props를 variant별 유니언으로 나눈다(R6).
  - `variant="field"`(기본) → `size?: "xsmall" | "medium" | "large"`
  - `variant="chip"` → `size?: "small" | "medium"`
  - 잘못된 조합은 타입 에러다. 실행 코드는 늘리지 않는다. 클래스는 `internal/select-core.ts`의 `selectTrigger`에 칩 small 하나를 더한다.
- **MultiSelect `search="trigger"` + `size="xsmall"`**: 안의 칩을 small(20)로 그린다. 트리거 위아래 여백 계산은 그대로 두고(데스크톱 1px) 칩만 작아져, 칩이 28 줄 가운데에 위아래 3px씩 띄워 앉는다. 모바일은 칩·트리거 모두 medium이라 지금과 같다. *(구현 중 변경: 여백 계산을 칩 small 기준으로 바꾸면 모바일용 되돌리기 규칙이 다시 필요해져 계산은 손대지 않았다.)*

## 6. 조작 영역·반경 정합

- **Alert·Toast 닫기**: 모바일에서 투명 `::before`로 누르는 영역을 44로 넓힌다. 보이는 원(24)과 배치는 그대로다. 0.22.0 때 "모바일 44 확장 없음"으로 남긴 것을 뒤집는다.
- **FileInput 기본 Trigger**: 반경 `--dds-radius-r2`(8) → `--dds-radius-button`(데스크톱 6·모바일 12). 주석("Button과 같은 radius")이 이제 맞게 된다. `asChild`로 Button을 끼우는 경로는 지금도 맞으므로 그대로다.

## 제약

- tokens는 바뀌지 않는다(react minor만 나간다). 새 크기는 기존 dimension·역할 토큰으로 표현한다.
- 새 값은 DDS 2px 스케일 안에서 고른다(결정 기록 합의 전제).
- 모바일 조작 영역 44, 데스크톱 단독 조작 대상 24를 지킨다. 예외는 Chip small 제거 버튼 하나다(데스크톱 누르는 영역 20 — 아래 "남은 위험" 참조). 나머지 작은 단계는 데스크톱에서도 24 이상이다.
- barrel(`src/index.ts`) 수정은 감독이 직결한다. 새 export는 없다(기존 컴포넌트 props만 늘어난다).
- 파일 300~500줄 상한.

## 하지 않을 것

- Slider xsmall(보류 — 0.22.0 결정 유지).
- 옵션·메뉴·목록·표의 compact 밀도(보류 — 별도 주제).
- TextArea 가로 조절, `minRows` 별도 prop(`rows`가 그 역할), `maxRows < rows` 경고.
- Pagination large, DatePicker 팝오버 안 부품의 크기.
- Tabs `tab-height` 모바일 값 변경(R2 — 보이는 높이는 40으로 둔다).
- Dialog·Sheet 닫기(소비자가 `Button ghost iconOnly`로 조립하므로 Button 규칙을 따른다).

## 합격 조건

TextArea
- [ ] 기본 TextArea의 계산 스타일 `resize`가 `none`이다. `resizable`이면 `vertical`, 비활성·읽기 전용·autoResize·모바일 line이면 `resizable`이어도 `none`이다.
- [ ] Chromium에서 `autoResize rows={3}`의 빈 TextArea 높이가 `autoResize` 없는 `rows={3}`과 같다.
- [ ] `autoResize rows={2} maxRows={4}`에 10줄을 넣으면 높이가 `rows={4}` 고정과 같고, `scrollHeight > clientHeight`이며 `overflow-y`가 `auto`다(잘리지 않고 스크롤된다).
- [ ] `resizable maxRows={5}`의 계산 스타일 `max-height`가 `rows={5}` 고정 높이와 같다.
- [ ] uncontrolled `showCount`가 form reset 뒤 `defaultValue` 길이로 돌아온다(vitest + user-event).
- [ ] xsmall·medium·large 세 size에서 위 높이 조건이 모두 맞는다(size별 padding을 계산에 쓰는지 확인).

크기
- [ ] DatePicker 트리거: xsmall 데스크톱 28 · 모바일 56, large 52, medium은 지금과 픽셀이 같다.
- [ ] Pagination 링크: xsmall 28 · small 36 · medium 40(데스크톱), 모바일은 셋 다 44.
- [ ] Tabs small 트리거 데스크톱 32, 모바일 40. 모바일에서 탭 위 경계 2px 바깥을 눌러도 그 탭이 선택된다(medium·small 모두).
- [ ] Chip small 데스크톱 20 · 모바일 32, 제거 버튼 hover 원 14(데스크톱). FilterChip small도 같은 높이다.
- [ ] Select `variant="chip" size="small"` 트리거 데스크톱 20. `variant="field" size="small"`과 `variant="chip" size="xsmall"`은 typecheck가 실패한다(`@ts-expect-error` 테스트).
- [ ] MultiSelect `search="trigger" size="xsmall"` 안 칩이 데스크톱 20, 트리거 최소 높이 28 유지, 넘침 없음(`scrollHeight <= clientHeight`).

정합
- [ ] 모바일에서 Alert·Toast 닫기 버튼의 보이는 원 바깥, 44 반경 안을 누르면 닫힌다. 데스크톱은 지금과 같다.
- [ ] FileInput 기본 Trigger의 계산 `border-radius`가 데스크톱 6px · 모바일 12px이다.

공통
- [ ] size를 주지 않은 모든 컴포넌트는 VR 기준과 픽셀이 같다(기존 매트릭스에 차이 없음 — 새 행·새 스토리만 기준이 늘어난다).
- [ ] 상태 매트릭스 스토리에 새 크기 행이 데스크톱·모바일 두 밀도(`DensityColumns`)로 있다.
- [ ] skill-src 예제와 표(text-area·date-picker·pagination·tabs·chip·filter-toolbox·select·multi-select)가 새 API를 쓰고 CI `check:skill`을 통과한다.
- [ ] vitest·typecheck·check:subpaths·publint·VR 통과. VR 기준은 visual-baseline 워크플로로 갱신한다.
- [ ] 결정 기록에 이번 결정(아래 표의 결론 + "Tabs·Pagination·Chip 크기 축 없음"을 뒤집음)을 메모하고, changeset(react minor)에 TextArea 기본 동작 변경과 복구 방법을 적는다.

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
| --- | --- | --- |
| 손잡이를 끄는 게 목적이다 | R4 반론: 기본을 autoResize로 바꾸면 손잡이가 필요 없지 않나 | 기본은 고정 rows + 손잡이 없음. 자동 확장은 opt-in |
| maxRows는 자동 확장용이다 | R3: `max-height`는 드래그도 막는다 | 항상 최대 높이. 확장·드래그 공통 |
| 작은 칩은 Chip만의 일이다 | R5: Select 칩 트리거·MultiSelect 내부 칩이 같은 높이 축을 쓴다 | 세 곳 모두 small을 맞춘다 |
| Select size에 small 하나만 더하면 된다 | R6 단순화: field small은 존재하지 않는 크기 | variant별 유니언 타입으로 잘못된 조합을 컴파일 단계에서 막는다 |
| 모바일 44는 토큰으로 푼다 | R2: 치수표 40/40과 계약 44가 충돌 | 보이는 40 유지 + 투명 영역. tokens 변경 없음 |
| 작은 단계는 모바일에서도 작아야 한다 | R1: 모바일 칩 32는 터치 기준 | 작은 단계는 데스크톱 전용, 모바일은 medium |
| autoResize는 rows를 지킨다 | Chromium 실측(rows=3: 78 → 38) | 버그로 보고 이번에 맞춘다 |

## 기술 맥락

- TextArea: `packages/react/src/text-area/TextArea.tsx`(cva·`rows=3` 기본·showCount), `text-area.css`(기본 `resize: vertical`, `.dds-text-area--auto-resize { resize: none; overflow: hidden; field-sizing: content }`, size별 padding, 모바일 line `resize: none`), `use-auto-resize.ts`(`field-sizing` 미지원 시 `height = scrollHeight` 폴백).
- `lh` 단위: Chrome 109·Safari 16.4·Firefox 120부터. 최소·최대 높이 계산에 쓴다.
- DatePicker: `date-picker/picker/DatePicker.tsx`가 `Button`을 `dds-date-picker__trigger`로 렌더하고 `date-picker.css:5`가 필드 외관(`field-height`·`field-inset`·`radius-field`·`font-size-field`)을 덮는다.
- Pagination: `pagination/Pagination.tsx:15`가 `dds-button--size_medium`을 고정으로 붙이고 `pagination.css:20`의 `max(var(--dds-dimension-x10), var(--dds-size-touch-target))`가 모바일 44를 만든다.
- Tabs: `tabs/tabs.css:32` 트리거 `min-height: var(--dds-size-tab-height)`, padding `x1_5 var(--dds-space-tab-inset)`. `tab-height`는 모바일 값이 없다(tokens.ts).
- Chip: `chip/chip.css`(높이 `chip-height`, 글자 t2, 제거 버튼 padding 계산과 `background-clip: content-box`, 모바일 규칙 130행~). `Chip`·`FilterChip`은 `chip/Chip.tsx`.
- Select: `internal/select-core.ts`의 `selectTrigger` cva(size·variant 축). `Select.tsx`는 `size: variant === "chip" ? null : size`로 칩일 때 size를 무시한다.
- MultiSelect: `multi-select.css:15` xsmall 검색 트리거의 `padding-block: calc((field-xsmall-height − chip-height − 2px) / 2)`. 칩이 small이 되면 계산식의 칩 높이도 바뀐다.
- Alert·Toast 닫기: `alert/alert.css:50`, `toast/toast.css`의 `__close`(24, 원형 hover).
- FileInput: `file-input/file-input.css:49` `.dds-file-input__trigger { border-radius: var(--dds-radius-r2) }`.
- 투명 조작 영역 선례: `button/button.css`의 `[data-dds-density="mobile"] .dds-button--size_xsmall::before`(inset `min(0px, calc((100% − touch-target) / 2))`), `checkbox.css`·`switch.css`의 라벨 없는 박스 규칙.
- 검증 선례: `apps/visual-regression/tests/xsmall-row-functional.spec.ts`(높이·바깥 지점 클릭), `apps/storybook/src/XsmallRow.stories.tsx`·`new-kinds-frame.tsx`의 `DensityColumns`.

## 남은 위험

- **Firefox JS 대체 경로는 실측하지 못했다.** CI VR은 Chromium만 돈다. 폴백이 `rows` 최소·`maxRows` 최대를 지키는지는 코드 리뷰와 jsdom 단위 테스트(스타일 계산 없이 배선만)로만 본다.
- **Chip small 제거 버튼은 데스크톱 단독 조작 대상 24에 못 미친다(20).** 칩 높이 자체가 20이라 투명 영역으로 넓히면 이웃 칩과 겹친다. 데스크톱 24를 지키려면 칩 사이 간격이 4 이상이어야 한다는 점을 skill 예제에 적는다.
- **TextArea 기본 동작 변경은 dg-studio 화면에 그대로 반영된다.** 손잡이를 쓰던 화면이 있으면 `resizable`을 넣어야 한다(소비 측 작업).
- 데스크톱 B 조합 화면 목록·소비처는 이번에도 없다(구성 규칙 예외 — "나중에 쓸 수 있다", 0.22.0과 같은 근거).

## 인터뷰 기록

<details><summary>전체 Q&A (7라운드)</summary>

### Round 0
**Q:** 구성요소 6개(TextArea·DatePicker·Pagination·Tabs·Chip·정합)와 제안 항목(호환·결정 기록·검증·tokens)이 범위로 맞나? / **A:** 이대로 맞음 / **모호도:** 채점 전

### Round 1
**Q:** Chip small(데스크톱 20)은 모바일에서 어떻게 그리나? / **A:** 모바일은 medium(32) / **모호도:** 41%

### Round 2
**Q:** Tabs 모바일 조작 영역 44를 어떻게 맞추나? / **A:** 보이는 40 + 투명 ::before 44 / **모호도:** 37%

### Round 3
**Q:** `maxRows`는 언제 적용하나? / **A:** 항상 최대 높이(확장·드래그 공통) / **모호도:** 33%

### Round 4 (반론)
**Q:** 기본값을 고정 rows + 조절 끔 / autoResize / 지금 그대로 중 무엇으로? / **A:** 고정 rows + 조절 끔 / **모호도:** 30%

### Round 5
**Q:** Chip small을 어디까지? / **A:** Chip·FilterChip + MultiSelect xsmall 내부 칩 + Select 칩 트리거 / **모호도:** 29%

### Round 6 (단순화)
**Q:** Select 칩 트리거 small의 타입은? / **A:** variant별 유니언 타입 / **모호도:** 25%

### Round 7
**Q:** Tabs small 데스크톱 치수는? / **A:** 32 · 글자 13 · 좌우 8 / **모호도:** 16%
</details>
