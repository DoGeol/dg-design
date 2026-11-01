---
"@dg-design/react": minor
---

조작 색 전환을 Switch 트랙·Checkbox 박스·Chip·Tabs·Breadcrumb·달력 날짜·FileInput으로 넓히고, Alert가 `@starting-style`로 떠오르며 들어오게 했다.

전부 기존 토큰(`--dds-duration-fast`·`--dds-easing-out`)을 쓰고 `motion` prop 밖이다 — 색은 위치·크기 변화가 아니라 reduced motion에서도 남는다. Alert 진입은 reduce에서 이동만 빠지고 페이드는 남는다. 최종 색이 그대로라 화면 결과물은 바뀌지 않는다.

근거: `docs/decisions/2026-10-31-motion-sweep.md`
