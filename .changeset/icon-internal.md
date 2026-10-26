---
"@dg-design/react": patch
---

Replace internal inline SVGs with `@dg-design/react/icon` components across Select, MultiSelect, List, DropdownMenu, Checkbox, and Chip.

- Select: replace trigger caret with `ChevronDownIcon` and option checkmark with `CheckIcon`.
- MultiSelect: replace option checkmark with `CheckIcon` and search trigger caret with `ChevronDownIcon`.
- List: replace collapsible SectionHeader chevron with `ChevronDownIcon`.
- DropdownMenu: replace CheckboxItem indicator with `CheckIcon` and RadioItem indicator with private `DotIcon`.
- Checkbox: replace checkmark with `CheckIcon` and dash indicator with `MinusIcon`, maintaining 70% container scaling.
- Chip: replace remove button glyph with `CloseIcon` (12px) and FilterChip checkmark with `CheckIcon` (14px).
- Add private `DotIcon` on 24x24 grid with filled circle for menu radio indicator without polluting public icon exports.
