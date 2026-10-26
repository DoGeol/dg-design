---
"@dg-design/react": minor
---

Add `ResizeHandle` component and `useResizeHandle` hook for resizable split screen panels.

- Add `@dg-design/react/resize-handle` supporting horizontal and vertical orientations with pointer capture and W3C ARIA `role="separator"` contract (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`).
- Support keyboard step adjustments (`ArrowLeft`/`ArrowRight` or `ArrowDown`/`ArrowUp`), boundary jumps (`Home`/`End`), and reset restoration (`Enter`/`Space`).
- Provide double-click and keyboard reset hook via `onReset`.
- Expand hit target via pseudo-element to 12px on desktop and 44px under `[data-dds-density="mobile"]`.
