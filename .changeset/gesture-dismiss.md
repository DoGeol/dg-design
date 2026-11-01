---
"@dg-design/react": minor
---

끌어서 닫기와 Toast 세로 재배치를 추가했다.

- Toast를 가로로 끌어 닫을 수 있다. 폭의 50%를 넘기거나 놓기 직전 속도가 0.11px/ms를 넘으면 멈춘 자리에서 이어 빠지고, 못 미치면 제자리로 돌아온다. 반대 방향은 고무줄로 버틴다.
- 토스트가 하나 사라지면 남은 토스트가 150ms FLIP으로 따라 올라온다(reduced motion에서는 걸지 않는다).
- `Sheet.Handle` 추가 — Content 안에 두면 손잡이를 끌어 시트를 닫을 수 있다. 장식이라 `aria-hidden`이고, ESC와 닫기 버튼은 그대로다.

reduced motion에서는 손가락을 따라가는 것만 남고 손을 뗀 뒤의 이동은 페이드로 바뀐다.

근거: `docs/decisions/2026-10-31-gesture-dismiss.md`
