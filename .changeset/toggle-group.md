---
"@dg-design/react": minor
---

Add `ToggleGroup` compound component for single and multiple selection option groups.

- Add `@dg-design/react/toggle-group` with compound (`ToggleGroup.Root`, `ToggleGroup.Item`) and named exports (`ToggleGroupRoot`, `ToggleGroupItem`).
- Support `type="single"` (radio semantics with `role="radiogroup"` / `role="radio"`, `aria-checked`) and `type="multiple"` (toolbar semantics with `role="toolbar"`, `aria-pressed`).
- Provide keyboard navigation with arrow keys for focus movement, `Space`/`Enter` for selection, and `Home`/`End` for jumping to the first/last enabled item.
- Support `disallowEmptySelection` (defaults to `true` for single, `false` for multiple) and guarantee DOM order without duplicates in multiple selection changes.
- Reserve visual check mark space (`CheckIcon`) to avoid layout shifts upon selection, and expand mobile touch targets to 44px under `[data-dds-density="mobile"]`.
