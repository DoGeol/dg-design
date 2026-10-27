---
"@dg-design/react": patch
---

모달 스크롤 잠금이 루트의 `scrollbar-gutter: stable`을 존중합니다. 스크롤바 자리가 이미 남아 있으면 body 오른쪽 여백을 더하지 않아, 모달을 열 때 페이지가 스크롤바 폭만큼 밀리지 않습니다.
