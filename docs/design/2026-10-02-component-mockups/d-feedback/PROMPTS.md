# d-feedback 생성 프롬프트

2026-10-02. 내장 `image_gen` 기본 모드로 7종 생성 성공, 실패 없음. 전체 1536×1024 PNG. 기준 화면 7장과 스타일 참고 이미지를 직접 확인하고 CSS·BRIEF를 읽었다. 생성 결과를 직접 검토하여 라이트 모드, A·B·C 3열, 블루 브랜드, 이모지·추가 제목·긴 문구 부재를 확인했다. 재생성은 모두 0회. 생성물은 방향 참고용이며 hex·px 정확성을 보장하는 구현 스펙이 아니다.

## 공통 프롬프트

아래 공통 프롬프트 뒤에 각 컴포넌트 프롬프트를 그대로 이어 붙여 호출했다.

```text
Use case: ui-mockup. Create a high-fidelity raster design comparison, landscape 1536x1024, light mode, flat pale background #F1F6F6. Exactly three equal vertical columns with ONLY the headings A, B, C centered above them. No other headings, explanatory text, logos, watermark or emoji. Labels are short gray placeholder bars unless specified numbers. Each column depicts the SAME component and SAME sample set. A: preserve current DDS structure, orderly 12px cards, 8px inline boxes. B: soft generous white surfaces, 16px and pill corners, 24px padding, pastel blue #E8F1FF, polished blue design reference tone. C: dense admin layout, 4–6px corners, 8px gaps, 1px line separation. All use brand blue #2B7FFF, never teal. Text #242727, secondary #6B706F, disabled #898D8D; white #FFFFFF, weak surface #F1F6F6, disabled surface/border #E4E9E8. 1px borders, only focus treatment 2px blue #2B7FFF outline. Spacing on 4px grid (4,8,12,16,20,24,32px). Sans serif regular/bold only, sizes 11,12,13,14,16,18,20,22,24,26px. UI is straight-on, crisp, no perspective. Icons if needed are thin single-stroke SVG-style paths, no text glyph icons. No invented hover/focus/disabled states on non-interactive indicators. 
```

## toast

- 결과: 성공 · 재생성 0회 · 파일: `toast.png`
- 검토·남은 차이: 6 intent·액션·닫기 확인. 현재 스크린샷에 없는 intent 아이콘이 추가되었고 A의 radius가 다소 작게 표현됨.

```text
Toast notifications: each column six stacked compact floating toast cards representing brand, neutral, critical, positive, warning, informative in that order. Title/description replaced by two short gray bars, right aligned thin-stroke close icon and small action button. A card padding 12px 16px, inner 8px gap, title 14px bold and description 13px regular visual sizes. Brand bg #E8F1FF blue #2B7FFF; neutral #F1F6F6 text #242727; critical #FCF3F2 fg #731115 stroke #C7272D; positive #E7FCE7 fg #196623; warning #FCF4E5 fg #242727 accent #D4AB4F; informative #F0F6FC fg #175891. Subtle overlay shadow 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08). Show action control default on first toast, hover via pale blue surface on second, 2px blue focus outline on third, muted disabled action on fourth. Close neutral weak. Keep six intent cards in every column.
```

## spinner

- 결과: 성공 · 재생성 0회 · 파일: `spinner.png`
- 검토·남은 차이: 크기 2종과 버튼 맥락 확인. 비교용 확대 때문에 실제 16/20px와 버튼 높이 비율은 정확한 픽셀 스펙이 아님.

```text
Circular loading spinner component. Each column show small 16px and medium 20px open circular rings with 2px stroke, top quarter transparent; first pair brand blue #2B7FFF, next pair neutral #6B706F. Below show three loading button contexts 36px,40px,52px high with white spinners on brand solid #2B7FFF and short white placeholder label bars; last sample muted disabled button #E4E9E8 with #898D8D spinner. Do not turn spinners into dots, spokes or complete rings. A controls radius8px (large12px), B pill controls and airy24px gaps, C radius4px and8px gaps. Arrange enough whitespace for a quiet specimen sheet. Component non-interactive, no focus or error invented.
```

## progress

- 결과: 성공 · 재생성 0회 · 파일: `progress.png`
- 검토·남은 차이: 0·50·100%·불확정 확인. A에 전시용 카드가 추가되며 불확정 구간 폭은 40% 근사치.

```text
Linear progress indicators, identical four examples in every column: empty 0%, half-full 50%, full 100%, and indeterminate 40%-width segment floating at center with blank track either side. Do not print percentages or any labels; use small gray placeholder bars above tracks. A track320px wide,6px tall,pill ends,#F1F6F6 on white card, blue #2B7FFF indicator;24px between rows. B softer pill tracks8px tall with32px rows and16px card corners. C6px tracks with4px end corners,16px row spacing, thin dividers. These are passive progress indicators, no handles, icons, buttons, error or focus.
```

## skeleton

- 결과: 성공 · 재생성 0회 · 파일: `skeleton.png`
- 검토·남은 차이: 텍스트·원형·카드 확인. 카드 상단 블루 진행바는 사용 맥락을 보여주는 보조 요소이며 skeleton 자체 API가 아님.

```text
Skeleton loading placeholders. Each column contains same three arrangements: three text skeleton bars with varied widths160/120/80px and height16px; a40px circular avatar skeleton next to two text lines; a compact card with wide160x96px rectangular media skeleton above two text lines. A card radius12px, inline radius8px, spacing16px; demonstrate square,6px,16px and full skeleton corners. B soft16px/pill corners,24px padding. C4px rectangles,8px spacing, thin1px dividers. Skeleton fill #E4E9E8 with subtle static shimmer center #F1F6F6, never dark. Small blue #2B7FFF progress accent may sit at top of each host card to establish brand, skeleton blocks themselves stay neutral. No photos, real content, labels, interactive states, icons or text other than A B C.
```

## save-status

- 결과: 성공 · 재생성 0회 · 파일: `save-status.png`
- 검토·남은 차이: 4상태 확인. A도 전시용 카드로 묶였고 저장 완료 체크에 원형 테두리가 추가됨; 실제 inline 컴포넌트 크기는 CSS 기준.

```text
Inline save status indicator; every column exactly four rows showing saved, saving, dirty, error. No words for states, gray placeholder labels only. Saved:16px thin-stroke check and short bar in #6B706F. Saving:16px open ring spinner #2B7FFF and secondary gray bar. Dirty: small solid warning dot #D4AB4F beside dark secondary bar. Error:16px outlined circle with exclamation drawn as stroke geometry #731115, matching dark-red placeholder bar on #FCF3F2 subtle local surface. A retain simple icon+label inline rows,4px internal gap,13px text-equivalent size,24px row gap. B same inline anatomy within softly rounded16px white surfaces and24px padding. C compact16px row gap,4px corners, thin1px dividers. Do not turn indicators into buttons or invent focus/hover/disabled.
```

## badge

- 결과: 성공 · 재생성 0회 · 파일: `badge.png`
- 검토·남은 차이: 각 열 6 intent × 3 variant × 2 size(36개) 확인. 일부 색과 크기·간격은 생성 이미지 근사치.

```text
Badge comparison sheet. Within EACH A B C column, exactly six intent groups in order blue brand, neutral gray, critical red, positive green, warning gold, informative navy. Every group contains two rows of three badges: solid,weak,outline side-by-side; first row20px high,second row24px high. 36 badges per comparison column. Badge label is one short placeholder bar, white on solid except gold uses dark#242727. Brand #2B7FFF weak#E8F1FF; neutral#242727 weak#F1F6F6; critical solid#9B1C22 fg#731115 border#C7272D weak#FCF3F2;positive#196623 weak#E7FCE7;warning#D4AB4F with dark foreground weak#FCF4E5;informative#175891 weak#F0F6FC. Outline variants white with1px intent border. A medium4px corners6px horizontal padding and large6px corners8px padding,11/13px text equivalents; B pill corners and24px group spacing; C4px corners8px group spacing with thin gray dividers. These are passive labels, no hover,focus,disabled or icons.
```

## notification-badge

- 결과: 성공 · 재생성 0회 · 파일: `notification-badge.png`
- 검토·남은 차이: 각 열 두 intent의 dot·5·99+·0 및 부착 예시 확인. dot 대 count 크기 비율이 실제 6/18px보다 크게 표현됨.

```text
Notification badges, each column show two rows of four standalone specimens. Top row brand blue #2B7FFF, bottom row critical red #9B1C22; each row has6px dot,18px minimum diameter pill with white number '5',18px high wider pill with white '99+',18px circle with white '0'. Numbers11px bold,4px horizontal pill padding,full round corners,1px optical downward adjustment. Below each specimen row show an example attached to top-right of a neutral thin-stroke bell icon on a white tile, blue count5 and red99+ respectively. A white host tile radius12px gap16px; B airy16px tile corners/pill surroundings24px padding; C compact4px tile corners8px spacing and1px separators. Badge dots and count pills remain round in ALL variants. No labels, no title except A B C, no words. Do not invent interactions on badges.
```

