---
"@dg-design/react": minor
---

P6 form variants: `TextField` and `TextArea` accept `variant?: "outline" | "box" | "line"` (default `"outline"`).

- `box` and `line` change the look only inside `[data-dds-density="mobile"]`; elsewhere they render as `outline`.
- `box`: tinted surface (`bg-neutral-weak`) and the same `stroke-neutral` 1px border (kept for WCAG 1.4.11).
- `line`: bottom border only, no radius or inline padding, transparent surface. Focus shows a 2px bottom edge. A `line` TextArea has `resize: none`.
- The class goes on the input, the prefix/suffix wrapper, or the textarea (not the `showCount` wrapper). Field wiring, affixes, `showCount` and `autoResize` work the same.
