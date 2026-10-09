---
"@dg-design/react": minor
---

컴포넌트가 tokens 0.9.0의 역할 토큰을 읽어 flex 적용 결정의 외관을 기본값으로 갖습니다. **tokens 0.9.0 이상과 함께 올려야 합니다** — 이전 tokens 위에서는 새 변수가 정의되지 않아 해당 치수가 빠집니다.

- 모서리: 입력류(TextField·TextArea·Select·MultiSelect·DatePicker 트리거) medium 8 → 4, Button small·medium 8 → 6, Select 옵션 6 → 4, Sheet 16 → 0(네 방향).
- 행·탭: Select 옵션·메뉴 항목 최소 높이 32 → 36, 패널 안쪽 여백 4 → 8(Select)·6(메뉴), 탭 높이 36 → 40·좌우 8 → 12·패널 간격 12 → 24. 활성 탭 글자는 진한 중성색(밑줄은 브랜드).
- MultiSelect: 복수 선택 표식을 사각 mark로, 패널 검색 상자를 경계 있는 낮은 중성 표면으로, 칩 높이 24.
- DatePicker 트리거가 입력 필드 외관(경계 1px, 값 왼쪽, 입력류 focus)을 갖고 루트가 블록 폭이 됩니다.
- Pagination 현재 쪽: 브랜드 solid → 중성 weak + 중성 경계 1px + 굵은 숫자.
- Checkbox 박스가 라벨 첫 줄 옆에 붙습니다(여러 줄 라벨). 라벨의 1px 광학 보정은 없앱니다.
- DataTable: 선택 칸 체크박스가 칸 가운데, 머리글 위 정렬, hover 행 한 톤, 선택 행 hover 색.
- FileInput 드롭존: 낮은 중성 표면 + 진한 점선 경계. Alert 행동 줄바꿈.
- `<html data-dds-density="mobile">`이면 입력 높이 56·반경 14, 버튼 반경 12, 옵션·메뉴 항목 48, 조작 영역 44(Pagination·Collapsible·Slider)가 되고 메뉴 단축키를 숨깁니다.
