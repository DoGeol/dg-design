# 표시·레이아웃 컴포넌트 시안 프롬프트

2026-10-02 · 내장 image_gen 기본 모드 · 각 1536×1024 PNG · 생성 성공 5 / 실패 0.

BRIEF.md 전체, v4 스타일 참고 이미지, 각 Linux VR 스크린샷과 CSS를 확인한 뒤 생성했다. 모든 결과를 직접 확인했으며 라이트 모드, 가로 A/B/C 3열, 블루, 이모지 없음, 추가 제목 없음 조건을 충족한다. 생성 시안은 픽셀 스펙이 아니며 정확한 토큰 구현 기준은 BRIEF.md와 소스다. 수동 이미지 편집과 CLI fallback은 사용하지 않았다.

## card

- 파일: `card.png`
- 재생성: 없음 (첫 생성 채택).
- 남은 차이: 큰 위반 없음. C의 세로 배치가 A/B와 같아 밀도 차이는 주로 radius와 내부 여백으로 표현됨.

### 최종 프롬프트

```text
Use case: ui-mockup. Create a polished flat design-system comparison image, landscape 1536x1024. Exactly three equal vertical columns, with only A, B, C as column headings at the top. No other titles, captions, state names, watermarks, brands or logos. Solid pale gray-blue background. Light mode. Use gray placeholder bars for all copy except specified initials. Crisp single-stroke vector-style icons, never emojis or text glyph icons. Palette: primary blue #2B7FFF, weak blue #E8F1FF, text #242727 and #6B706F, disabled #898D8D on #E4E9E8, white #FFFFFF, weak surface #F1F6F6, borders #E4E9E8 and #6B706F. All borders 1px. Only focus ring is 2px blue outline. Spacing grid 4,8,12,16,20,24,32px. Sans-serif regular/bold only, 14 and 16px content scale, 24px headings. A: orderly existing structure with 12px cards, 6px interactive items,16px padding. B: soft generous 24px padding,16px rounded surfaces,pill controls, gentle pale surface contrast inspired by a polished blue and white UI specimen. C: compact admin layout,4-6px corners,8-12px padding and line-based divisions. Compare the SAME component and examples in all three columns. Do not display specification numbers or explanatory words. Subject: card container. Each column shows two small white cards near the top, one a static div with a single gray content bar and one a link with a blue content bar, reflecting the existing two-card structure. Below show link-card hover with pale blue surface, focused link-card with blue 2px outline, and a larger ordinary content card containing three gray text bars plus a blue 40px primary button. Preserve simple 1px bordered container anatomy. Static cards have no fabricated disabled/error state. A cards radius12px padding16px, B radius16px padding24px, C radius6px padding12px. Content spacing16px/24px/12px respectively. Carefully balanced whitespace with cards aligned across columns.
```

## avatar

- 파일: `avatar.png`
- 재생성: 없음 (첫 생성 채택).
- 남은 차이: 큰 위반 없음. 하단 예시 목록에 요청하지 않은 점 3개 메뉴 아이콘이 추가됨. 크기 비율은 시각 참고용이며 정확한 px 측정 기준이 아님.

### 최종 프롬프트

```text
Use case: ui-mockup. Create a polished flat design-system comparison image, landscape 1536x1024. Exactly three equal vertical columns, with only A, B, C as column headings at the top. No other titles, captions, state names, watermarks, brands or logos. Solid pale gray-blue background. Light mode. Use gray placeholder bars for all copy except specified initials. Crisp single-stroke vector-style icons, never emojis or text glyph icons. Palette: primary blue #2B7FFF, weak blue #E8F1FF, text #242727 and #6B706F, disabled #898D8D on #E4E9E8, white #FFFFFF, weak surface #F1F6F6, borders #E4E9E8 and #6B706F. All borders 1px. Only focus ring is 2px blue outline. Spacing grid 4,8,12,16,20,24,32px. Sans-serif regular/bold only, 14 and 16px content scale, 24px headings. A: orderly existing structure with 12px cards, 6px interactive items,16px padding. B: soft generous 24px padding,16px rounded surfaces,pill controls, gentle pale surface contrast inspired by a polished blue and white UI specimen. C: compact admin layout,4-6px corners,8-12px padding and line-based divisions. Compare the SAME component and examples in all three columns. Do not display specification numbers or explanatory words. Subject: Avatar component specimen. Each column contains identical three rows of four circular avatars in ascending actual sizes24,36,48,64px, displayed at a consistent magnification so details are visible. First row: cropped natural generic human portrait photos, same face across sizes, tiny blue #2B7FFF status badge overlapping bottom right with white keyline. Second row: initial fallback JD, in neutral text on #F1F6F6, same four sizes. Third row: single-stroke person-outline fallback icon, same four sizes. Under these rows show a practical two-row member list with a portrait avatar and an initial fallback avatar, gray content bars and one blue status dot. All avatars circular in every variant; C only changes surrounding row density, never squares avatars. A neutral thin circular borders, B gentler pale-blue fallback surfaces and generous32px spacing, C compact16px spacing and crisp 1px separators. Initials JD are permitted content; otherwise only A B C letters, no row labels. Do not invent error borders or disabled states: loading/failure resolves to neutral fallback.
```

## separator

- 파일: `separator.png`
- 재생성: 없음 (첫 생성 채택).
- 남은 차이: 큰 위반 없음. A 목록의 가로 구분선은 inset 대신 전체 폭으로 표현됨.

### 최종 프롬프트

```text
Use case: ui-mockup. Create a polished flat design-system comparison image, landscape 1536x1024. Exactly three equal vertical columns, with only A, B, C as column headings at the top. No other titles, captions, state names, watermarks, brands or logos. Solid pale gray-blue background. Light mode. Use gray placeholder bars for all copy except specified initials. Crisp single-stroke vector-style icons, never emojis or text glyph icons. Palette: primary blue #2B7FFF, weak blue #E8F1FF, text #242727 and #6B706F, disabled #898D8D on #E4E9E8, white #FFFFFF, weak surface #F1F6F6, borders #E4E9E8 and #6B706F. All borders 1px. Only focus ring is 2px blue outline. Spacing grid 4,8,12,16,20,24,32px. Sans-serif regular/bold only, 14 and 16px content scale, 24px headings. A: orderly existing structure with 12px cards, 6px interactive items,16px padding. B: soft generous 24px padding,16px rounded surfaces,pill controls, gentle pale surface contrast inspired by a polished blue and white UI specimen. C: compact admin layout,4-6px corners,8-12px padding and line-based divisions. Compare the SAME component and examples in all three columns. Do not display specification numbers or explanatory words. Subject: Separator component. Each column shows three practical examples, exactly matching across columns. Upper example: a white list of four rows with short neutral gray placeholder labels and small outline folder icons; the first folder icon blue, thin horizontal #E4E9E8 1px separators between every list row, with16px content insets. Middle example: a horizontal white toolbar containing three pairs of single-stroke vector buttons (square, circle, outline image icons), separated into groups by clearly visible vertical #E4E9E8 1px lines with height24px. One toolbar button blue on #E8F1FF, other icons neutral. Lower example: a white settings-summary block with two clusters of three gray bars divided by one full-width thin horizontal separator. Separator lines always neutral, never blue; only adjacent active control blue. A12px panels padding16px, B16px panels padding24px with soft contrast and pill toolbar buttons, C4px panels padding8px with dense32px list rows. Static separator has no focus, disabled or error state; do not invent these. No written labels except A B C.
```

## collapsible

- 파일: `collapsible.png`
- 재생성: 없음 (첫 생성 채택).
- 남은 차이: 큰 위반 없음. A에도 외곽 패널 테두리가 추가되어 현재의 독립 트리거 구조보다 박스감이 강함.

### 최종 프롬프트

```text
Use case: ui-mockup. Create a polished flat design-system comparison image, landscape 1536x1024. Exactly three equal vertical columns, with only A, B, C as column headings at the top. No other titles, captions, state names, watermarks, brands or logos. Solid pale gray-blue background. Light mode. Use gray placeholder bars for all copy except specified initials. Crisp single-stroke vector-style icons, never emojis or text glyph icons. Palette: primary blue #2B7FFF, weak blue #E8F1FF, text #242727 and #6B706F, disabled #898D8D on #E4E9E8, white #FFFFFF, weak surface #F1F6F6, borders #E4E9E8 and #6B706F. All borders 1px. Only focus ring is 2px blue outline. Spacing grid 4,8,12,16,20,24,32px. Sans-serif regular/bold only, 14 and 16px content scale, 24px headings. A: orderly existing structure with 12px cards, 6px interactive items,16px padding. B: soft generous 24px padding,16px rounded surfaces,pill controls, gentle pale surface contrast inspired by a polished blue and white UI specimen. C: compact admin layout,4-6px corners,8-12px padding and line-based divisions. Compare the SAME component and examples in all three columns. Do not display specification numbers or explanatory words. Subject: Collapsible component, standalone disclosure trigger and revealed content. Each column has five vertically stacked examples in this exact order: (1) open default disclosure with upward vector chevron beside a short gray label bar, beneath it three gray content bars; (2) closed default disclosure, downward vector chevron beside gray label bar, no body; (3) hovered closed disclosure, pale-blue trigger surface, blue vector chevron, no body; (4) keyboard-focused open disclosure, crisp 2px #2B7FFF outline around trigger only and three gray body bars beneath; (5) disabled open disclosure, #898D8D trigger label and muted chevron, body still visible as two lighter gray bars. No error state applies. A stays closest to simple existing structure: minimal standalone triggers,6px trigger corners,16px content inset,24px separation between examples. B uses softly grouped #F1F6F6 surfaces,16px corners,pill trigger,24px generous inset. C uses4px corners,8px inset,compact spacing,subtle horizontal divisions. Trigger heights40px A and B,36px C; don't turn them into giant cards. Use ONLY A B C text and gray bars for everything else. Icons are thin handless chevron strokes drawn as vectors, not font symbols.
```

## accordion

- 파일: `accordion.png`
- 재생성: 없음 (첫 생성 채택).
- 남은 차이: 큰 위반 없음. focus outline이 트리거만이 아니라 열린 패널 전체를 감쌈. B 상단 inline 그룹은 둥근 개별 항목처럼 표현됨.

### 최종 프롬프트

```text
Use case: ui-mockup. Create a polished flat design-system comparison image, landscape 1536x1024. Exactly three equal vertical columns, with only A, B, C as column headings at the top. No other titles, captions, state names, watermarks, brands or logos. Solid pale gray-blue background. Light mode. Use gray placeholder bars for all copy except specified initials. Crisp single-stroke vector-style icons, never emojis or text glyph icons. Palette: primary blue #2B7FFF, weak blue #E8F1FF, text #242727 and #6B706F, disabled #898D8D on #E4E9E8, white #FFFFFF, weak surface #F1F6F6, borders #E4E9E8 and #6B706F. All borders 1px. Only focus ring is 2px blue outline. Spacing grid 4,8,12,16,20,24,32px. Sans-serif regular/bold only, 14 and 16px content scale, 24px headings. A: orderly existing structure with 12px cards, 6px interactive items,16px padding. B: soft generous 24px padding,16px rounded surfaces,pill controls, gentle pale surface contrast inspired by a polished blue and white UI specimen. C: compact admin layout,4-6px corners,8-12px padding and line-based divisions. Compare the SAME component and examples in all three columns. Do not display specification numbers or explanatory words. Subject: Accordion component. Each column contains two groups of three accordion rows. Top group is inline single-open mode: first row open with title gray bar, smaller description gray bar, upward single-stroke chevron on right, and revealed content containing a 40px white input with8px radius,1px neutral border and a gray placeholder; second row disabled closed with muted #898D8D label bars and down chevron; third row closed hovered with pale #E8F1FF surface and down chevron. Thin1px inset horizontal neutral dividers between rows. Bottom group is separated multi-open mode: first and second items BOTH OPEN, third closed; separate thin bordered panels with12px gaps; first open trigger has2px blue focus outline, body has two gray bars; second open trigger uses blue icon and body has two gray bars; third closed neutral. Prefixes simple outline person/bell/shield SVG-style icons, never text bullets. A uses6px separated item corners,16px trigger vertical/horizontal padding,16px bold title scale and12px description. B uses16px rounded items,24px padding,18px bold title,14px description, soft white and pale-blue surfaces. C uses4px item corners,12px padding,14px bold title,12px description with denser rows. No invented error state. Exact three columns only; no headers other than A B C; represent all title/description text with neutral bars. Ensure visibly open content is connected to its own trigger, closed rows have no body, and disabled row is muted.
```

