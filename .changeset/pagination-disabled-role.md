---
"@dg-design/react": patch
---

`Pagination.Previous`·`Next`에 `disabled`를 주면 href가 빠진 `<a>`가 generic role이 되어 `aria-label`·`aria-disabled`가 금지 속성(axe `aria-prohibited-attr`)이 되던 문제를 고칩니다. 비활성일 때 `role="link"`를 명시합니다.
