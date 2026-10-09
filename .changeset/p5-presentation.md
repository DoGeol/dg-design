---
"@dg-design/react": minor
---

P5 presentation: work-panel parts and sizes for Dialog/Sheet, sheet presentation for Select/MultiSelect.

- `Dialog.Toolbar` · `Body` · `Aside` · `Footer` (also `Sheet.*` and `DialogToolbar`-style named exports). With any part present, the Content switches to a work layout: only Body scrolls, Toolbar and Footer stay fixed, Aside sits beside Body (stacked after Body on side sheets and narrow screens). Content without parts is unchanged.
- `Dialog.Content size`: `"default"` | `"large"` | `"full"`.
- `Sheet.Content size` (top/bottom sheets): `"default"` | `"fit"` | `"tall"` | `"full"`. Changing `size` keeps the same Content, so values and focus stay.
- `Select.Root` / `MultiSelect.Root` `presentation`: `"popover"` (default) | `"sheet"` | `"auto"` (sheet when `<html data-dds-density="mobile">`). The sheet is a modal bottom panel; listbox, keyboard and value behavior are the same. `Content title` adds a visible heading. MultiSelect `search="trigger"` moves the search input into the sheet.
