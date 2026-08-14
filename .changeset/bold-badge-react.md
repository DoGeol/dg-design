---
"@dg-design/react": minor
---

Badge 컴포넌트를 추가했습니다. Intent 축의 첫 소비자로 6종 intent × 2 variant × 2 size 조합을 지원합니다.

**컴포넌트 축:**
- `intent`: brand · neutral · critical · positive · warning · informative (6종)
- `variant`: solid · weak (2종)
- `size`: medium · large (2종)
- 기본값: neutral · weak · medium

**주요 기능:**
- `asChild` prop — `@radix-ui/react-slot`으로 `<a>` 등 임의 엘리먼트에 스타일 위임
- `truncate` prop(boolean, 기본 false) — true면 label에 `max-width: 100%; overflow: hidden; text-overflow: ellipsis` 적용

**구현:**
- CSS: `@layer dds` · `.dds-badge--intent_*` 클래스 · CVA + 수기 CSS
- `@radix-ui/react-slot` 의존성 추가 (주간 1.78억 DL, 최신 유지)
- 비인터랙티브 — hover/pressed/disabled/focus 규칙 없음
