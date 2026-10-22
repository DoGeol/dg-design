---
"@dg-design/react": minor
"@dg-design/tokens": patch
---

Fixes from dg-studio feedback (#51).

- A disabled Chip now sets `aria-disabled="true"` on its root, so assistive tech reads it as disabled even without a remove button, and axe no longer reports its dimmed text as a contrast failure.
- `List.SectionHeader` `count` accepts a string, so a unit can be included (`count="3개"`). A bare number is still read without a unit.
- A bottom Sheet without a Footer now keeps its last content clear of the iOS home indicator (`env(safe-area-inset-bottom)`), both with plain content and with `Sheet.Body`.
- Responsive Tabs no longer leave the 24px tab-panel gap above the content once the tab list is hidden (`data-wide`).
- In a `List.Item` with `List.Action`, badges and text inside `List.Trailing` pass clicks through to the row. Buttons, links and other controls in Trailing are still pressed on their own.
- Both packages now ship `CHANGELOG.md`.
