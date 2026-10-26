---
"@dg-design/react": minor
---

Add `CodeBlock` component and `CopyButton` sub-component for scrollable code areas with accessible clipboard copy feedback.

- Add `@dg-design/react/code-block` exporting `CodeBlock` leaf component and standalone `CopyButton`.
- Provide keyboard scrollable code container with W3C `role="region"`, `tabIndex={0}`, and accessible naming contract derived from `label` or `filename`.
- Connect asynchronous clipboard copying with polite `role="status"` screen reader announcements ("코드를 복사했습니다." on success, "복사하지 못했습니다. 코드를 선택해 직접 복사하십시오." on error) without redundant `aria-live`.
- Toggle between `CopyIcon` and `CheckIcon` with "코드 복사" and "복사됨" dynamic `aria-label` updates and pending action lock.
- Support optional `filename` header, flexible plain text children auto-extraction, and seamless integration with pre-highlighted code nodes (shiki/Prism).
- Expand mobile hit area of `CopyButton` to 44px under `[data-dds-density="mobile"]`.
