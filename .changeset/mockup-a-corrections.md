---
"@dg-design/react": minor
---

시안 A 보정을 컴포넌트 기본 스타일에 반영합니다. 화면이 바뀌므로 소비 앱의 시각 회귀 기준을 갱신해야 합니다.

- 입력류(TextField·TextArea·Select·MultiSelect): 테두리 1px `stroke-neutral`, hover `fg-neutral`. focus는 바깥 링 없이 테두리 2px(`stroke-focus-ring`)로 표시하고 오류 상태는 critical 테두리를 유지합니다. 버튼 등 비입력 컨트롤의 focus 링은 그대로입니다. DataTable 필터는 높이 32px·radius r2·연한 테두리로 줄이고 focus만 같은 규칙을 따릅니다.
- 오버레이: Popover·HoverCard·DropdownMenu·ContextMenu·Select 패널 radius r3, Tooltip r2, Sheet는 화면 안쪽 두 모서리 r4. 본문은 어절 단위로 줄바꿈합니다.
- DatePicker 달력 이동 버튼과 DataTable 정렬 표시를 글자 기호에서 SVG 아이콘으로 바꿉니다. 정렬 중인 열은 머리글이 진해지고, 선택된 행은 brand-weak 배경을 씁니다.
- Badge `truncate`가 말줄임표를 실제로 표시합니다.
- Avatar 이니셜 크기·굵기, Pagination 숫자 버튼 최소 폭, Collapsible 트리거 여백, FileInput 트리거 radius(r2), Skeleton medium radius(r3), MultiSelect 생성 옵션 들여쓰기를 맞춥니다.
