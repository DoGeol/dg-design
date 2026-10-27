# 디자인 시스템 후속 재검토

2026-10-27 · 작업 브랜치 기준. 수정 중이며 아직 npm에 발행하지 않았다. 범위는 `docs/follow-ups.md`와 `docs/reports/flex-adoption-review/gaps.md` §13이다. 기존 구현 확인은 코드·기존 테스트 대조이며, 별도 표시하지 않은 항목을 이번에 실기기로 재검증한 뜻은 아니다.

| 후보 | 현재 판정과 근거 |
| --- | --- |
| Field 사용자 오류 id | 재현 후 수정: 종류별 등록과 다중 오류 테스트(`field.test.tsx`). |
| Field 사용자 라벨 id | FileInput 테스트로 별도 재현 후 수정: 실제 라벨 id를 context에 반영. |
| FileInput Field 라벨 | 재현 후 수정: 라벨과 버튼 문구 연결·명시 이름 우선(`file-input.test.tsx`). 앱의 기존 사용은 Field 조합이 아니므로 앱 전체 결함이라고 보지 않는다. |
| StatePanel live region | 중복 속성을 제거하고 기존 결정에 변경 이유를 기록. 실제 스크린리더 청취 미수행. |
| ContextMenu 동적 항목 tabindex | 기존 목록 후보 재현 후 수정(`context-menu.test.tsx`). |
| Collapsible·Accordion 내용 축소 | 실제 브라우저에서 고정 높이 240px이 80px로 줄지 않음을 재현하고 수정. 동적 확대·축소와 padding/border, Accordion 기존 동작을 Playwright로 확인. |
| Card 링크 표시 | 스타일을 주지 않으면 inline으로 남는 것을 실제 브라우저에서 재현하고 block으로 수정. |
| DataTable 행 hover·선택 색, 숫자 정렬·체크 위치 | 현재 CSS와 `DataTable.test.tsx`에 처리 흔적이 있다. 실제 모든 색·레이아웃 조합은 별도 전수 재측정하지 않았다. |
| DataTable 좁은 화면·고정 열 | 실제 브라우저 테스트에서 375·500px 가상/비가상 표의 고정 열 정렬과 키보드 스크롤을 확인했다. 고정 영역이 지나치게 넓은 모든 열 조합은 검증하지 않았다. |
| DataTable 선택 이름에 rowKey | 현재도 내부 key가 이름에 들어갈 수 있다. 의미 있는 행 이름 전달은 새 API 설계가 필요해 별도 후속으로 유지한다. |
| Toast action | `ToastOptions.action`과 관련 단위 테스트가 존재한다. |
| Alert 좁은 폭 행동 겹침 | 260px viewport의 기존 두 행동·닫기 버튼이 겹치지 않음을 실제 브라우저에서 확인했다. 모든 문구 조합을 검증한 것은 아니다. |
| Select·MultiSelect 표시/검색 분리 | `label`, `textValue`와 각 단위 테스트가 존재한다. |
| Select 칩 패널 폭 | `.dds-select__content--chip`에 최소 12rem과 overlay 최소폭 적용이 있다. |
| MultiSelect 검색 결과 없음·패널 바깥 슬롯 | 요청된 슬롯은 새 API/기능 설계다. 현재 구현된 기능이라고 주장하지 않는다. |
| PropertyField·Popover 라벨 | `PropertyField.Trigger`가 `aria-labelledby`로 Field 라벨과 값을 연결한다. |
| DropdownMenu 체크·라디오 | CheckboxItem·RadioItem과 테스트가 있다. |
| Select 모바일 Sheet | `presentation` prop과 시트 테스트가 있다. density를 고르는 책임은 앱에 있다. |
| 사용자 래퍼로 감싼 Select·MultiSelect 옵션 | 최초 닫힌 상태의 라벨·typeahead는 자식 요소 정적 스캔의 알려진 제한이다. 렌더링/등록 계약 변경이 필요하므로 별도 설계 항목으로 유지한다. |
| Button·Accordion 경고 정책 | 개발/운영 경고의 정책 결정 항목이며 이번에 의미를 임의 변경하지 않았다. |
| DatePicker 기본 locale·실기기, Table 스크린리더 | 기존 후속을 유지한다. 현재 데스크톱 자동 테스트는 실기기 결과가 아니다. |

이번에 함께 확인한 최신 구성요소 문제는 ToggleGroup 제어형 재시도, CodeBlock 복사 원문 누락, ResizeHandle 단위 변환, Storybook preview 다크 배경이다. 테스트와 변경은 각 컴포넌트의 소스·테스트 및 `apps/visual-regression/tests/`에 있다. 실제 릴리스와 시각 기준 변경은 별도 CI 절차로 확인한다.
