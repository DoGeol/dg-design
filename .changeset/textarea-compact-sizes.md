---
"@dg-design/react": minor
---

**TextArea no longer shows a resize handle by default.** Pass `resizable` to bring back vertical resizing.

- TextArea adds `resizable` (vertical only) and `maxRows`. `maxRows` caps both `autoResize` growth and manual resizing, and the content scrolls once it is reached. Before this, a `max-height` on an `autoResize` TextArea clipped the overflow with no way to scroll.
- `autoResize` now keeps `rows` as the minimum height. In Chromium, `field-sizing: content` used to ignore `rows`, so `rows={3}` rendered as one line.
- An uncontrolled `showCount` counter now resets with its form.
- Chip and FilterChip add `size="small"` (20px). Select `variant="chip"` accepts `size="small"`; the trigger's `size` type now depends on `variant`, so `variant="field" size="small"` is a type error. MultiSelect `search="trigger" size="xsmall"` renders small chips.
- Tabs adds `size="small"` (32px) on `Tabs.Root`. Pagination adds `size="xsmall" | "small"` on `Pagination.Root`. DatePicker adds `size="xsmall" | "large"` for its trigger.
- Small steps are desktop only: inside `[data-dds-density="mobile"]` they render as `medium`.
- In mobile density, tab triggers and the Alert and Toast close buttons get a 44px hit area through a transparent pseudo-element. Their visible size is unchanged.
- The default FileInput trigger uses the Button radius role (6px, 12px on mobile) instead of 8px.
