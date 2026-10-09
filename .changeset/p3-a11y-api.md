---
"@dg-design/react": minor
---

접근성·API를 추가합니다. 기존 동작은 바뀌지 않습니다.

- `DropdownMenu.CheckboxItem`·`RadioGroup`·`RadioItem`(ContextMenu에도 같은 이름): `menuitemcheckbox`·`menuitemradio` + `aria-checked`. 골라도 메뉴를 닫지 않습니다. 앞쪽 16px 표식 열에 체크·점을 그립니다.
- `Select.Option`·`MultiSelect.Option`의 `label`·`textValue`: 닫힌 트리거(칩)에는 `label`, 검색·typeahead는 `textValue`, 열린 목록 행은 children을 씁니다.
- `DataColumn.align`(`"start" | "center" | "end"`): 머리글·본문·필터 칸 정렬. `end`면 정렬 아이콘이 라벨 앞에 옵니다.
- `ToastOptions.action`(`{ label, onClick }`): 본문 아래 글자 버튼. 누르면 `onClick` 뒤 토스트를 닫습니다. 자동 닫힘(5초)은 그대로라 같은 일을 하는 다른 경로가 화면에 있어야 합니다.
