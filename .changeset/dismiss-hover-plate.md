---
"@dg-design/react": patch
---

Close and remove buttons now show a circular hover plate that no longer touches the edges of the parent. Chip remove keeps its chip-height hit area but paints only an inner circle (18px, 20px in mobile density). Alert close uses a 24px circle. Toast close gains hover and pressed feedback with a 24px circle; its layout footprint is unchanged.
