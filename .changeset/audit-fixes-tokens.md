---
"@dg-design/tokens": patch
---

라이트 모드 gray-600을 조금 진하게 했다(OKLCH L 0.54 → 0.50).

- 바꾼 이유: 보조 텍스트(`fg-neutral-weak`)가 hover·pressed 배경 위에서 WCAG 4.5:1에 못 미쳤다. 해당 위치는 메뉴 단축키와 List 메타 텍스트다.
- 대비 검사에 이 두 조합을 추가했다.
- `createTheme`도 같은 gray 값을 쓴다.
