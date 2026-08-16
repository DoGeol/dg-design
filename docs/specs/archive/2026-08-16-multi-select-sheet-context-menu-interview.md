# MultiSelect·Sheet·ContextMenu — 인터뷰 기록

[스펙 본문](2026-08-16-multi-select-sheet-context-menu.md)의 deep-interview 전체 Q&A (4라운드).

### Round 0
**Q:** 구성요소 6개(MultiSelect·Sheet·ContextMenu·테스트VR·릴리스 0.9.0 합류·레시피 코드젠 재고 판단) / **A:** 이대로 맞음

### Round 1
**Q:** MultiSelect 트리거 표시 — 요약 텍스트 vs 칩 나열 vs 라벨 나열 vs 하이브리드 / **A:** 요약 텍스트("3개 선택됨") / **모호도:** 42%

### Round 2
**Q:** MultiSelect 재사용 경계 — internal 추출 vs 별도 폴더 복제 vs Select에 multiple 분기 (Select.tsx 396줄·500줄 상한 근거 제시) / **A:** 공통을 internal/로 추출 / **모호도:** 33%

### Round 3
**Q:** Sheet side 축 범위 — 4방향 vs 좌우 2종 vs right+bottom / **A:** 4방향 전부 / **모호도:** 26%

### Round 4 (반론)
**Q:** ContextMenu를 Positioner와 같은 잣대로 빼야 하지 않나 (터치 부재·Shift+F10 별도 구현·유일한 internal 변경) / **A:** 넣되 마우스 전용 / **모호도:** 17%
