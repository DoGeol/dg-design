# c-overlay 생성 프롬프트

- 생성 방식: 내장 `image_gen` 기본 모드, 컴포넌트당 1회 생성. CLI fallback 없음.
- 성공: dialog, sheet, popover, tooltip, hover-card, dropdown-menu, context-menu. 실패: 없음.
- 7개 결과를 직접 시각 검수했습니다. 모두 1536×1024, 라이트 모드 가로 3열 A·B·C, 블루 브랜드이며 추가 제목·로고·이모지는 없습니다.
- 재생성: 전체 0회. 아래 미세한 표현 차이는 시안의 한계로 남깁니다. 생성 이미지는 픽셀 스펙이 아니며 실제 구현은 토큰을 따릅니다.
- 근거: 공용 BRIEF.md 전체, 지정 v4 참고 이미지, 각 Linux VR 스크린샷과 해당 CSS 및 ContextMenu.tsx.

## dialog

- 최종 파일: `dialog.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: 기본·critical 모달과 비활성 버튼 확인. hover는 별도 표본으로 분리되지 않았으며 배경 앱 표현이 원본보다 상세합니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: open centered modal dialog panels. Each column has two stacked miniature viewports with neutral dim rgb(15 18 18 / 0.5) over a white app background. Upper modal standard: title bar, 2 description bars, bottom-right neutral weak cancel and blue solid confirm controls, focused confirm single blue outline. Lower modal destructive variant: shorter title bars, disabled secondary control and critical solid delete control. A modal radius 16px, padding24px, gap12px, buttons40px radius8px. B softer 16px panels, wider whitespace and pill buttons. C radius6px, padding16px, buttons36px. Modal clearly floats centrally with space around all edges.
```

## sheet

- 최종 파일: `sheet.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: 하단 부착 시트·입력 오류·포커스·비활성 확인. 원본에 없는 드래그 핸들 표현이 추가되어 있습니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: open bottom sheets. Each column contains two stacked miniature app viewports with dim rgb(15 18 18 / 0.5) above a full-width white panel attached exactly to viewport bottom. Sheets have title bar, description bars, one input, bottom neutral weak cancel and blue solid confirm. Upper sheet input default, confirm focused; lower sheet input critical error stroke and tiny red error bar, disabled secondary action. A top sheet corners16px, padding24px, gap12px, input40px radius8px. B16px and pill actions with32px padding; C6px corners,16px padding,36px controls. Bottom sheets unmistakable, no floating centered modal, no side sheets.
```

## popover

- 최종 파일: `popover.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: 화살표·입력 포커스·오류·비활성 확인. A 패널 모서리가 목표 12px보다 작게 보이며 하단 상태 표본의 트리거는 생략되어 있습니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: open anchored popover with an 8px rotated-square arrow pointing upward to a blue trigger button above each panel. Each column has one large open white form popover containing a label bar, single line input40px, second label bar, textarea80px, neutral weak cancel and blue solid save actions. A floating panel12px radius,padding16px,controls8px radius; B16px padding24px pill trigger; C6px padding12px controls4px. Beneath main popover a smaller second open popover demonstrates critical input outline/error bar and disabled gray save. Main input has 2px blue focus outline; hover trigger weak blue sample nearby. No overlay dim.
```

## tooltip

- 최종 파일: `tooltip.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: 네 방향 배치·hover·focus·disabled 확인. 컨트롤이 지정한 실제 높이보다 크게 시각화되었습니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: dark neutral tooltip bubbles around blue/neutral control triggers. In each column show four generously separated tooltip-trigger pairs stacked vertically: top placement default, bottom placement hovered trigger pale blue, left placement focused blue trigger with2px blue outline, right placement neutral trigger. Each tooltip #242727 with a short white placeholder bar, padding6px 8px, visible8px diamond arrow pointing toward trigger. A tooltip corners8px, controls40px radius8px. B tooltip16px corners, pill triggers, more whitespace. C tooltip4px corners,36px controls and tighter spacing. At bottom one disabled gray trigger WITHOUT a tooltip. Do not add error tooltip as tooltip has no error variant. Light canvas, only bubbles dark, no dark-mode panels.
```

## hover-card

- 최종 파일: `hover-card.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: 열린 카드·hover·focus·disabled 표본 확인. 트리거에 원본에 없는 아바타가 추가되었으며 카드 아바타가 40px보다 크게 표현되었습니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: opened hover cards attached beneath neutral weak profile-link triggers, small8px white diamond arrow toward trigger. Each column shows two vertically separated examples: hovered trigger with pale blue treatment and open profile card, then keyboard focused trigger with2px blue ring and equivalent open card. Profile card structure: plain gray circular avatar40px on left, strong name placeholder bar and three short gray body bars on right. No person photos or actual brand names. A panel radius12px,padding16px,gap12px,max width384px. B16px radius,padding24px,more generous avatar spacing. C6px radius,padding12px,gap8px. Include small muted disabled trigger sample at bottom without card. No dim, no form or error state.
```

## dropdown-menu

- 최종 파일: `dropdown-menu.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: default·hover·focus·disabled·critical 및 구분선 확인. disabled 행 배경은 원본의 투명 배경보다 강하며 C 기본 행에 외곽선이 추가되어 있습니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: open dropdown menus anchored underneath blue trigger buttons, no arrow. Each column shows one tall menu with a small gray group-label bar and five menu items: default row, pale blue hover row, focused row with2px blue outline, disabled muted row, then1px separator and critical delete row with dark red bar. Use subtle single-stroke outline icons at row starts (document,copy,export,trash) with no text glyphs. A menu radius12px,padding4px,min width192px,rows32px,min item radius6px,row inset8px and6px vertical; B menu16px,more roomy rows40px,soft surfaces,pill trigger. C panel6px,item4px,rows32px,dense crisp separators. Under main menu a small second menu with critical hovered delete weak red background #FCF3F2. Main brand blue #2B7FFF clearly visible on triggers and focus. No dim.
```

## context-menu

- 최종 파일: `context-menu.png`
- 재생성: 없음 (첫 생성 채택).
- 검수 및 남은 차이: 커서 위치에 열린 메뉴·hover·focus·disabled·critical 확인. 보조 메뉴가 별도 작업 영역 밖 대신 같은 작업 영역 안에 표현되었습니다.

### 최종 프롬프트

```text
Use case: ui-mockup. Generate one polished flat UI design comparison image, landscape 1536x1024. Light mode, exactly three equal vertical columns across the image. Only text anywhere is A, B, C centered at the respective column tops, no other headings or text. Use gray placeholder bars for all labels and copy, white bars on solid buttons. Solid pale #F1F6F6 canvas. Brand blue #2B7FFF, weak blue #E8F1FF; never teal. Surfaces #FFFFFF; weak #F1F6F6; disabled #E4E9E8 with #898D8D bars. Text bars #242727 and #6B706F. Borders 1px #E4E9E8, focus only a single 2px #2B7FFF outline. Critical #731115 foreground, #9B1C22 solid, #C7272D stroke, #FCF3F2 weak. Shadow 0 12px 32px rgba(15,15,15,.18) plus 0 4px 8px rgba(15,15,15,.08). Use consistent 4px spacing grid, controls 36/40/52px; labels 14px and titles 20px sans serif regular/bold if represented by bars. A orderly preserves existing component structure with prescribed radii. B soft, generous 24/32px padding, 16px corners and pill controls, pale surface contrast. C dense admin layout with 4/6px corners, 8/12px spacing and crisp dividers. Each column depicts the SAME component and comparable states. No branding, logos, emojis, decorative glyph icons, measurements, legends, photographic content, gradients or extra titles. Any icons must be simple single-stroke vector style.
Subject: right-click context menus opened at cursor position over a light rectangular work area, NOT under a button. Each column contains one rectangular pale work area with subtle1px dashed gray outline and several gray placeholder content bars. An outlined mouse pointer sits just left of the upper-left corner of the open white menu. Menu overlays the work area and contains group-label bar, default copy row, pale blue hover row, focused row2px blue outline, disabled paste row, separator1px, critical delete row. Outline document/copy/trash icons only, never glyph characters. A panel12px radius,padding4px,items32px height6px radius. B16px panel,roomier40px rows,soft surfaces. C6px panel4px items,32px rows,crisp dividers. Below each work area a compact second opened menu shows critical hover #FCF3F2 and blue focus row. No trigger button, no overlay dim, no arrows connecting panels.
```


