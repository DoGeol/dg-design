---
"@dg-design/react": minor
---

Add `TableOfContents` component and optional `useTableOfContentsActiveId` hook for in-page anchor navigation.

- Add `@dg-design/react/table-of-contents` with `TableOfContents` leaf component and `useTableOfContentsActiveId` scroll observation hook.
- Support `variant="inline"` (default) and `variant="collapsible"` composed with `Collapsible` primitive and `ChevronDownIcon`.
- Normalize item depths (1–6) into standard nested `<ol>` / `<li>` structure while visually capping indentation accumulation at 3 levels.
- Assign `aria-current="location"` with brand indicator bar and bold styling to the single active heading without stealing focus or fragment navigation.
- Return trigger focus automatically when collapsible content is closed programmatically while focus is inside the content.
- Provide `useTableOfContentsActiveId` hook observing passive scroll with requestAnimationFrame coordinate measurement and resize cleanup, safely returning `null` during SSR.
