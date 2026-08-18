---
"@dg-design/tokens": minor
---

createTheme — 브랜드 hex 하나로 WCAG 검사를 통과한 테마 생성

- `createTheme({ brand: "#6A4FBB" })` → 기존 tokens.css와 드롭인 호환인 CSS 문자열. hue만 추출해 DDS 규칙(고정 lightness + hue별 sRGB 상한 × 비율 프로파일)으로 팔레트를 재파생하고, **기본 팔레트와 같은 대비·gamut 검사를 전량 통과시킨 뒤에만** 방출한다. 360개 hue 전수 스윕 통과 — 유채색이면 어떤 브랜드든 된다
- CLI 동반: `npx dds-tokens --brand "#6A4FBB" -o dds-tokens.css` (실패 시 exit 1 + 진단)
- Tailwind 브릿지 확장: radius·spacing·타이포·easing 유틸 추가(`rounded-r2`, `p-x4`, `text-t4`, `ease-out`). duration·z는 Tailwind v4 제약으로 괄호 임의값 문법(`z-(--dds-z-toast)`) 사용 — [docs/customization.md](https://github.com/DoGeol/dg-design/blob/main/docs/customization.md) 참고
- 커스터마이즈 계약 문서 신설 — 공개/비공개 표면, `@layer` 우선 규칙, 오버라이드 예시 3종
