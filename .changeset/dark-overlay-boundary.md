---
"@dg-design/react": patch
---

다크 모드에서 Dialog·Sheet·Popover·HoverCard·DropdownMenu·ContextMenu·Select·MultiSelect·DatePicker 패널이 페이지 배경에 묻혀 경계가 보이지 않던 문제를 고칩니다. 패널에 `stroke-neutral-weak` 테두리 1px를 추가합니다(Sheet는 화면 안쪽 변에만). 라이트 모드에도 같은 테두리가 생기고, 내용에 맞춰 늘어나는 패널은 높이가 2px 커집니다. Popover·HoverCard 화살표는 테두리 폭만큼 바깥으로 옮겨 패널 테두리와 이어지게 했습니다.
