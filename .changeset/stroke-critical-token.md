---
"@dg-design/tokens": minor
---

`stroke-critical` semantic 토큰을 추가했습니다. 폼 컨트롤의 error 테두리와 주의 필요 구분선 용도로 사용됩니다.

**추가 토큰:**
- `stroke-critical` — error 상태 테두리(TextField invalid 등). light: critical-600, dark: critical-500. WCAG 1.4.11(비텍스트 그래픽 요소) min 3.0 통과.

**대비 검사 확장:**
- `stroke-critical on bg-layer-default` × 2모드(light/dark) = 2건 추가
- 모든 검사 min 3.0 통과 (기존 stroke-neutral과 동형)

**대비 결과:**
- light: critical-600(#c41615) on bg-layer-default(#ffffff) = 5.65:1
- dark: critical-500(#f45656) on bg-layer-default(#1a1a1a) = 5.03:1

**타입 변화:**
- semantic colors 40개 → 41개 증가
- contrast checks 26건 → 28건 증가 (기존 검사 전건 유지)
