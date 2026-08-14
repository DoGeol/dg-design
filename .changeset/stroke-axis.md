---
"@dg-design/tokens": minor
---

stroke 축을 신설했습니다. 인터랙티브 컨트롤 테두리와 구분선 용도로 `stroke-neutral` · `stroke-neutral-weak` 2개 semantic 토큰을 추가했습니다.

**추가 토큰:**
- `stroke-neutral` — 인터랙티브 컨트롤 테두리(미체크 Checkbox 등). light: gray-600, dark: gray-500. WCAG 1.4.11(비텍스트 그래픽 요소) min 3.0 통과.
- `stroke-neutral-weak` — 구분선·비필수 장식. light: gray-200, dark: gray-800. 대비 검사 없음.

**대비 검사 확장:**
- `stroke-neutral on bg-layer-default` × 2모드(light/dark) = 2건 추가
- 모든 검사 min 3.0 통과 (기존 stroke-focus-ring과 동형)

**상태쌍 설계:**
- stroke에는 hover/pressed 상태 토큰이 없음. 인터랙티브 시각 피드백은 기존 `bg-transparent-hover` · `bg-transparent-pressed`로 대체(재사용 결정).
- 호버 반응은 배경 투명도 변화로 충분하다고 판정.

**타입 변화:**
- semantic colors 38개 → 40개 증가
- contrast checks 24건 → 26건 증가 (기존 검사 전건 유지)
