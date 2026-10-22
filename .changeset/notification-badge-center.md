---
"@dg-design/react": patch
---

NotificationBadge count digits now sit at the vertical center of the pill. The 2px top padding meant as an optical correction pushed the digits about 1px below center (6px above vs 4px below at 18px height with Pretendard; also low with system-ui), so it is removed.
