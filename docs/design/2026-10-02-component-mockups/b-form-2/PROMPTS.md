# b-form-2 생성 기록

- 도구: 내장 image_gen 기본 모드. CLI fallback 미사용.
- 기준: ../BRIEF.md, 지정된 Linux VR 스크린샷, 컴포넌트 CSS, dg-design-light-v4.png를 직접 확인했습니다.
- 최종 PNG 4종: 모두 1536×1024, 라이트 모드 A·B·C 3열, 블루 브랜드. 이모지·추가 제목·로고·긴 문구 없음.
- 생성 시안이므로 정확한 토큰 색상과 픽셀 규격을 보장하지 않습니다. 구현 기준은 토큰이며, 배경에 미세한 음영 표현이 남아 있습니다.

## select

- 결과: 성공 — `select.png`
- 재생성 0회. 5개 닫힌 상태와 열린 옵션 목록을 확인했습니다. 남은 차이: C안의 높이·행 간격 축소가 작으며, 실 px 값은 시각 방향으로만 반영됐습니다.

최종 프롬프트:

```text
Use case: ui-mockup. Generate a crisp high-fidelity flat UI design comparison image, landscape 1536x1024, light mode. Exactly THREE equal vertical columns with only A, B, C as headings, one at the top of each column. No other headings, explanatory text, annotations, logos or watermarks. Solid very light pastel blue background; white UI surfaces. Represent all labels and values with short muted gray placeholder bars, never pseudo-writing. Only A B C and explicitly permitted numerals may be text. Icons are thin single-stroke SVG-style line drawings, never emoji or typographic glyph icons.
Palette: brand and all selection/active/focus #2B7FFF, pale brand #E8F1FF, text #242727, secondary #6B706F, disabled #898D8D, surfaces #FFFFFF #F1F6F6, disabled surfaces #E4E9E8, borders #6B706F or #E4E9E8. Error border #C7272D and subtle fill #FCF3F2, error bar #731115. Border 1px; focus exactly one 2px blue outline. Sans-serif 12/14/16px regular or bold only. Spacing on 4px grid: 4,8,12,16,24,32.
Column A tidy: existing component structure, form radius 8px or 12px for large; floating panels radius 12px; interactive items 6px; normal control height 40px, small 36px, large 52px; list items 32px. Column B soft: 16px or pill radii, generous 16/24px padding, soft pale surfaces, tasteful shadow, same function. Column C dense: 4/6px radii, 4/8px gaps, 36px controls, line-based divisions. Overlay shadows 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08). Compare identical content and states in each column. No teal.
Subject: single SELECT. Each column shows five stacked closed dropdown triggers in default, hover darker border, focus blue outline, disabled gray fill, error red border states. Each trigger has a short placeholder value bar left and a drawn chevron right. Below these, show an additional OPEN select trigger with upward chevron and its floating options panel. Panel has a small gray group-label bar and six option rows, one selected with blue line checkmark on left and blue weak fill, one focused with blue outline, one disabled pale row. Reserve the same checkmark space in every row. Keep all options panel content fully visible. Deliberate tidy alignment and consistent component widths; B should look noticeably softer and C visibly more compact.
```

## multi-select

- 결과: 성공 — `multi-select.png`
- 재생성 0회. 칩·트리거 검색·패널 검색·만들기 항목과 오류 표시를 확인했습니다. 남은 차이: 선택 체크마크가 체크박스 모양으로 생성됐고 C의 밀도 차이는 작습니다.

최종 프롬프트:

```text
Use case: ui-mockup. Generate a crisp high-fidelity flat UI design comparison image, landscape 1536x1024, light mode. Exactly THREE equal vertical columns with only A, B, C as headings, one at the top of each column. No other headings, explanatory text, annotations, logos or watermarks. Solid very light pastel blue background; white UI surfaces. Represent all labels and values with short muted gray placeholder bars, never pseudo-writing. Only A B C and explicitly permitted numerals may be text. Icons are thin single-stroke SVG-style line drawings, never emoji or typographic glyph icons.
Palette: brand and all selection/active/focus #2B7FFF, pale brand #E8F1FF, text #242727, secondary #6B706F, disabled #898D8D, surfaces #FFFFFF #F1F6F6, disabled surfaces #E4E9E8, borders #6B706F or #E4E9E8. Error border #C7272D and subtle fill #FCF3F2, error bar #731115. Border 1px; focus exactly one 2px blue outline. Sans-serif 12/14/16px regular or bold only. Spacing on 4px grid: 4,8,12,16,24,32.
Column A tidy: existing component structure, form radius 8px or 12px for large; floating panels radius 12px; interactive items 6px; normal control height 40px, small 36px, large 52px; list items 32px. Column B soft: 16px or pill radii, generous 16/24px padding, soft pale surfaces, tasteful shadow, same function. Column C dense: 4/6px radii, 4/8px gaps, 36px controls, line-based divisions. Overlay shadows 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08). Compare identical content and states in each column. No teal.
Subject: MULTI SELECT with removable chips and search. Each column shows five stacked trigger fields: default empty with gray placeholder; hover with two small selected chips and drawn x removal icons; focused search trigger with two chips plus short search bar and blue focus outline; disabled gray field with faded chips; error field with red border. Below, an additional open chip trigger and its dropdown panel: search row with magnifying-glass line icon, four 32px option rows with two blue checkmarks for selected options, one hovered pale blue and one disabled, then a divider and create-new option with thin plus icon and short gray label bar. Under create row a tiny muted critical placeholder bar for creation error. Chips use #F1F6F6 or #E8F1FF, 12px label bars, A chips radius6, B pill chips and generous panel padding, C square radius4 chips. No textual words. Keep full panel visible, balanced and clearly differentiated A/B/C.
```

## file-input

- 결과: 성공 — `file-input.png`
- 재생성 1회. 첫 생성의 가로형 dropzone을 기존 구조에 맞는 세로 중앙 정렬로 보정했습니다. 기본·hover·focus·드래그·disabled·error 및 파일 행을 확인했습니다. 남은 차이: C의 밀도 축소가 작고 진행률 막대는 시각 예시입니다.

최종 프롬프트:

```text
Use case: ui-mockup. Generate a crisp high-fidelity flat UI design comparison image, landscape 1536x1024, light mode. Exactly THREE equal vertical columns with only A, B, C as headings, one at the top of each column. No other headings, explanatory text, annotations, logos or watermarks. Solid very light pastel blue background; white UI surfaces. Represent all labels and values with short muted gray placeholder bars, never pseudo-writing. Only A B C and explicitly permitted numerals may be text. Icons are thin single-stroke SVG-style line drawings, never emoji or typographic glyph icons.
Palette: brand and all selection/active/focus #2B7FFF, pale brand #E8F1FF, text #242727, secondary #6B706F, disabled #898D8D, surfaces #FFFFFF #F1F6F6, disabled surfaces #E4E9E8, borders #6B706F or #E4E9E8. Error border #C7272D and subtle fill #FCF3F2, error bar #731115. Border 1px; focus exactly one 2px blue outline. Sans-serif 12/14/16px regular or bold only. Spacing on 4px grid: 4,8,12,16,24,32.
Column A tidy: existing component structure, form radius 8px or 12px for large; floating panels radius 12px; interactive items 6px; normal control height 40px, small 36px, large 52px; list items 32px. Column B soft: 16px or pill radii, generous 16/24px padding, soft pale surfaces, tasteful shadow, same function. Column C dense: 4/6px radii, 4/8px gaps, 36px controls, line-based divisions. Overlay shadows 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08). Compare identical content and states in each column. No teal.
Subject: FILE INPUT upload dropzone component. Each column shows six vertically stacked wide shallow dropzones, each with small monochrome thin-stroke upload-tray icon and two short gray placeholder bars, NO words. Rows from top: default white with 1px gray dashed border; hover white with stronger dashed border; focused white with single 2px blue outline outside dashed border; dragging pale blue #E8F1FF with dashed #2B7FFF border and blue upload icon; disabled gray #E4E9E8 and faded icon; error pale #FCF3F2 with dashed #C7272D border and short dark red helper bar underneath. At bottom show TWO selected-file rows: each a document-outline icon on left, gray filename and tiny metadata bars, one thin blue progress line, and thin x removal icon on right. Each file row inside modest surface. A dropzones radius12 and 16px horizontal/24px vertical padding as space allows. B radius16 generous whitespace and soft surface depth. C radius4/6 with tight 8px padding and thin row separators. Fit everything comfortably within frame, no cropping. Draw true simple line icons, absolutely no paperclip emoji. Small upload trigger button with gray label bar may sit inside first dropzone.
STRICT STRUCTURE CORRECTION: Dropzones in A and B MUST use vertical centered content: icon centered ABOVE placeholder bars, like a traditional file drop target. Do NOT place icon left and button right. REMOVE ALL blue buttons from inside dropzones. Each dropzone should be 110px high with icon above two short bars. Six dropzones plus two compact selected file rows must fit in the column, reduce outer gaps to 8px if necessary. C may retain horizontal centered icon-and-label arrangement for density. Only selected file rows have left document icon, right removal x. Blue is conveyed by focus, dragging, and file progress. Background completely uniform solid #E8F1FF. No background gradients.
```

## date-picker

- 결과: 성공 — `date-picker.png`
- 재생성 0회. 단일 날짜 미리보기·범위 달력·시간 입력·중립 취소 및 블루 적용 버튼을 확인했습니다. 남은 차이: A와 C 범위 끝이 8/4~6px보다 둥글고 C 밀도 차이가 작습니다.

최종 프롬프트:

```text
Use case: ui-mockup. Generate a crisp high-fidelity flat UI design comparison image, landscape 1536x1024, light mode. Exactly THREE equal vertical columns with only A, B, C as headings, one at the top of each column. No other headings, explanatory text, annotations, logos or watermarks. Solid very light pastel blue background; white UI surfaces. Represent all labels and values with short muted gray placeholder bars, never pseudo-writing. Only A B C and explicitly permitted numerals may be text. Icons are thin single-stroke SVG-style line drawings, never emoji or typographic glyph icons.
Palette: brand and all selection/active/focus #2B7FFF, pale brand #E8F1FF, text #242727, secondary #6B706F, disabled #898D8D, surfaces #FFFFFF #F1F6F6, disabled surfaces #E4E9E8, borders #6B706F or #E4E9E8. Error border #C7272D and subtle fill #FCF3F2, error bar #731115. Border 1px; focus exactly one 2px blue outline. Sans-serif 12/14/16px regular or bold only. Spacing on 4px grid: 4,8,12,16,24,32.
Column A tidy: existing component structure, form radius 8px or 12px for large; floating panels radius 12px; interactive items 6px; normal control height 40px, small 36px, large 52px; list items 32px. Column B soft: 16px or pill radii, generous 16/24px padding, soft pale surfaces, tasteful shadow, same function. Column C dense: 4/6px radii, 4/8px gaps, 36px controls, line-based divisions. Overlay shadows 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08). Compare identical content and states in each column. No teal.
Subject: DATE PICKER and DATE RANGE PICKER, combined in each column. Each column has at top FIVE slim date controls stacked: default, darker hover border, blue focus outline, disabled gray fill, red error border. Each control has a gray value bar and a small line-calendar icon. Beneath is a large floating range calendar panel with TWO date input fields side by side (gray label bars, values 2026.10.12 and 2026.10.16), a calendar navigation row showing only 2026.10 and drawn chevron icons, a proper 7-column calendar grid with 31 numbered days (October 2026 starts Thursday). Show range 12 through 16 as a continuous #2B7FFF strip with white numbers and rounded outer endpoints; other dates neutral, one date with hover gray background and one with blue focus outline; unavailable dates pale gray. Below calendar show two compact time fields 09:00 and 17:00 and thin clock line icons. Bottom action row: neutral weak cancel button with gray placeholder bar, and blue solid apply button with white placeholder bar. No button words. At bottom of each column a separate miniature single-date preview: calendar-outline icon, value 2026.10.12, and isolated blue selected day tile 12 to distinguish single-date from range. Panel radius12 for A,16 for B,6 for C; A calendar hit areas44px, weekday header32px, field40px. B softer spacious rounded dates, C more compact line-based fields. White calendar surface. Keep all content inside frame, no extra title besides A B C. Permitted text: A B C, dates/times, and calendar numerals only. Weekday names use seven tiny gray bars rather than words. No logos.
```

