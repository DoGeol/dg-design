---
@dg-design/tokens: minor
---

모션 토큰과 오버레이 토큰 신설, Switch·Checkbox 소급 교체입니다.

**신설 토큰:**
- `bg-overlay` — 다이얼로그·모달 오버레이 배경. gray-1000/알파 조합. light: 50% 알파, dark: 70% 알파. 대비 검사 미실시 (배경 투명).
- `shadow-overlay` — 다이얼로그 그림자(첫 번째 드롭 그림자). light: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`, dark: `0 20px 25px -5px rgba(0, 0, 0, 0.3)`.
- `duration-fast` — 빠른 모션(150ms). Checkbox·Switch 토그 애니메이션, Dialog 진입 애니메이션 용도.
- `duration-base` — 기본 모션(200ms). Dialog 퇴장·배경 페이드 애니메이션 용도.
- **easing**: `ease-out-cubic`(cubic-bezier(0.33, 1, 0.68, 1)) — 표준 deceleration easing.

**소급 변경:**
- `packages/react/src/checkbox/` `packages/react/src/switch/` — 하드코딩된 `150ms` transition-duration을 CSS 변수 `var(--dds-duration-fast)` 참조로 교체. vitest 및 기존 VR 기준과 시각 무변화 확인.

**타입·dist 변화:**
- semantic colors 41개 → 42개 (bg-overlay 추가)
- semantic tokens 신규 섹션 — shadows, durations, easings 추가
- tokens.css: CSS 변수 4개 추가 (bg-overlay, shadow-overlay, duration-fast, duration-base)
- tailwind.css: 테마 객체 확장

**검증:**
- `pnpm generate` ✓ (대비 검사 미실시 항목 신설, 기존 검사 전건 통과)
- CSS 생성 및 타입 일관성 ✓
