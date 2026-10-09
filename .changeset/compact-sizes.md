---
"@dg-design/react": minor
---

Smaller size steps to sit next to Button `xsmall` (28px).

- TextField, Select, MultiSelect triggers and TextArea add `size="xsmall"` (28px, 12px text). Inside `[data-dds-density="mobile"]` they render as `medium`, because iOS zooms into inputs with text smaller than 16px. The MultiSelect search trigger still grows when chips wrap.
- RadioGroup segmented adds `xsmall` (24px).
- Switch adds `small` (28×16). Checkbox adds `small` (14px box). Badge adds `small` (16px).
- Avatar adds `xsmall` (20px). Spinner adds `xsmall` (12px). Accordion adds `small`.
- Button `loading` with `size="xsmall"` now uses the 16px spinner instead of 20px.
