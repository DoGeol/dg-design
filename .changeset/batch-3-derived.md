---
"@dg-design/react": minor
---

MultiSelect·Sheet·ContextMenu 추가 (파생 3종)

- MultiSelect: 다중 선택 — 트리거는 요약 텍스트("n개 선택됨"), 선택해도 패널 유지(토글), `name` 지정 시 값마다 hidden input. Field 연동·aria-multiselectable
- Sheet: 4방향(left·right·top·bottom) 슬라이드 모달 오버레이 — Dialog의 presence·모달 스택·inert 재사용
- ContextMenu: 우클릭 메뉴 — 커서 좌표 배치, 브라우저 기본 메뉴 차단. **마우스 전용**(Shift+F10·터치 long-press 미지원, 같은 동작이 다른 UI로도 도달 가능해야 함)
- 내부: 옵션 수집·typeahead·열린 상태 키보드를 `internal/select-core`로 추출, `use-presence`·`dialog-stack`을 `internal/`로 이동, `use-overlay-position`이 floating-ui `VirtualElement` 허용
