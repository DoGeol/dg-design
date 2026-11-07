---
"@dg-design/react": minor
---

전체 코드 점검에서 나온 버그를 고쳤다.

- **Breaking:** NotificationBadge에서 `asChild`를 뺐다. 지금까지 이 prop을 쓰면 렌더 오류가 났기 때문에 동작하던 사용처는 없다.
- MultiSelect
  - 목록 안 검색창에서 Escape를 누르면 패널이 닫힌다.
  - `onCreate`를 기다리는 동안 고른 항목이 더 이상 사라지지 않는다.
- Select·MultiSelect typeahead
  - 같은 글자를 반복해 누르면 다음 항목으로 넘어간다.
  - 검색으로 숨겨진 옵션에는 걸리지 않는다.
  - 닫힌 동안 바뀐 옵션 라벨이 트리거에 반영된다.
- Popover·DropdownMenu·Select: 안에서 연 Dialog·ContextMenu를 클릭해도 닫히지 않는다.
- DateRangePicker: 지우기 후 적용을 누르면 값이 null로 저장된다.
- DatePicker: 잘못된 `timeZone`을 넘겨도 열 때 오류가 나지 않는다.
- DataTable
  - NaN·Invalid Date가 있어도 정렬이 깨지지 않는다. 이 값들은 빈 값처럼 맨 뒤로 간다.
  - 가상 스크롤 위치가 부모가 다시 그려질 때 맨 위로 튀지 않는다.
- Tooltip: 열린 채 사라지거나 controlled로 닫혀도 Provider의 지연 생략이 계속 켜져 있지 않는다.
- Collapsible·Accordion: React 18에서도 닫힌 내용에 `inert`가 걸린다.
- TableOfContents: 접는 목차의 `<nav>`에 `tree` 속성이 새지 않는다.
- Tabs
  - 선택값이 어떤 탭과도 맞지 않거나 선택된 탭이 disabled면 첫 활성 탭이 tab stop이 된다.
  - value에 공백이 있어도 aria 연결이 유지된다.
- RadioGroup·Slider: form reset 뒤 화면 상태가 실제 값과 맞는다.
- ResizeHandle: 가로 핸들에서 ArrowDown이 값을 키운다. 포인터를 아래로 끄는 방향과 같다.
- Alert·DropdownMenu.Item: `hidden` 속성을 주면 화면에서 숨겨진다.
