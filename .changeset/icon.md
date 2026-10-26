---
"@dg-design/react": minor
"@dg-design/tokens": minor
---

Add initial icon set with 16 self-contained SVG icons and the `--dds-stroke-icon-width` token.

- Add `@dg-design/react/icon` with 16 24x24 grid icons (`ChevronUpIcon`, `ChevronDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `CloseIcon`, `MenuIcon`, `ExternalLinkIcon`, `PlusIcon`, `MinusIcon`, `SunIcon`, `MoonIcon`, `DragHandleIcon`, `CheckIcon`, `CopyIcon`, `SearchIcon`, `SettingsIcon`).
- Support sizes 16, 20 (default), and 24 with proportional stroke width scaling, inheriting color via `currentColor`.
- Provide accessible naming contract: non-empty `label` sets `role="img"` and `aria-label`, while omitting `label` marks the icon decorative with `aria-hidden="true"` and `focusable="false"`.
- Add `--dds-stroke-icon-width: 2` role token in `@dg-design/tokens` and bind to Tailwind v4 bridge (`--stroke-width-icon-width`).
