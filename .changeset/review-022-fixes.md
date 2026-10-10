---
"@dg-design/react": minor
---

- xsmall TextField·TextArea·Select·MultiSelect read the new `field-xsmall` role tokens instead of per-component mobile overrides. Requires `@dg-design/tokens` 0.11.0. Mobile TextArea xsmall is now 56px (the field height) instead of 58px.
- Checkbox and Switch without a label widen their hit area to `--dds-size-touch-target` (24px, 44px on mobile) with a transparent pseudo-element. The visible size is unchanged.
- Badge `outline` + `truncate` no longer clips the bottom of the text (line-height now excludes the border).
- Chip remove button sets `box-sizing: border-box` so a consumer reset cannot grow it past the chip height.
