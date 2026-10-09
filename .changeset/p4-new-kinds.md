---
"@dg-design/tokens": minor
"@dg-design/react": minor
---

P4 새 종류: List·SectionHeader, Chip·FilterChip, FilterToolbox, PropertyField와 목록·설정 행 역할 토큰.

- tokens: `--dds-size-list-row-1`·`--dds-size-list-row-2`·`--dds-space-list-inset`·`--dds-space-list-leading-gap`·`--dds-size-setting-row-height`·`--dds-radius-setting-row`(모바일 밀도 값 포함, Tailwind 브릿지 연결).
- react 하위 경로 4개: `@dg-design/react/list`(Root·Section·SectionHeader·Item·Leading·Action·Title·Meta·Trailing, 묶음 접기), `/chip`(Chip 제거·초점 이동, FilterChip aria-pressed), `/filter-toolbox`(group·Chips·Count status·Actions 껍데기), `/property-field`(Group·Root·Label·Trigger·Description·ErrorMessage — 라벨 왼쪽·값 오른쪽 속성 행).
- `Select.Trigger variant="chip"` + `active`: 칩 모양 고정 필터. 열린 패널은 최소 12rem.
- MultiSelect 검색 트리거의 칩이 `Chip`으로 바뀌었다. 칩을 지우면 초점이 다음 칩(마지막이면 검색 입력)으로 간다. 비공개 `dds-multi-select__chip*` 클래스는 없어졌다.
- 모바일 밀도에서 칩 제거 버튼·필터 칩·목록 trailing 버튼의 조작 영역이 44px다(보이는 크기는 그대로).
- FilterToolbox·Select chip·PropertyField는 실사용 전 **초기 API**다 — 첫 소비 앱 적용에서 다음 minor에 바뀔 수 있다.
- react 0.20.0은 tokens 0.10.0 이상과 함께 올린다.
