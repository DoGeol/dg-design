---
"@dg-design/tokens": minor
---

Intent 축을 완성했습니다. critical, positive, warning, informative 4종 intent에 palette 램프 4개(40개 값)와 semantic 토큰 16개를 추가했습니다.

**추가 토큰:**
- palette: `critical`(hue ~25, 적) · `positive`(hue ~145, 녹) · `warning`(hue ~85, 황) · `informative`(hue ~250, 청) 각 10단계
- semantic: `bg-{intent}-solid`, `bg-{intent}-weak`, `fg-{intent}`, `fg-{intent}-contrast` (4종 intent × 4토큰 = 16개)

**대비 검사 확장:**
- intent당 3쌍(fg-contrast on bg-solid, fg on bg-weak, fg on bg-layer-default) × 2모드(light/dark) = 24건 추가
- 모든 검사 min 4.5:1 통과 (gamut 검사 포함)

**특수 처리:**
- `fg-warning-contrast`는 어두운 값(gray-1000 계열) — 황색 solid 위에서 흰 글자는 4.5:1 불가능하므로 dark fg로 대체
- 나머지 3종 intent는 light fg 방향(seed와 동일)
