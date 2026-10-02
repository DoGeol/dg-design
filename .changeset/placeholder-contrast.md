---
"@dg-design/react": patch
---

입력류 placeholder 색을 `fg-disabled`에서 `fg-neutral-weak`로 바꿔 WCAG 1.4.3 대비(4.5:1)를 맞춥니다. 라이트 3.36:1 → 5.03:1, 다크 3.74:1 → 8.79:1입니다. TextField·TextArea·Select·MultiSelect·DataTable 필터가 해당하고, 비활성 필드 안의 placeholder는 그대로 `fg-disabled`입니다.
