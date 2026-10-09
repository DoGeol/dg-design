# 조합 API와 동작 계약

[개요](README.md) · [38개 비교](components.md) · [실행 순서](plan.md)

아래 API 이름은 후보이며 아직 공개 계약이 아니다. 시각적 자유도를 늘려도 선택·포커스·키보드 로직은 기존 기반을 우선 재사용한다.

## Select / MultiSelect

근거: [Select.tsx](../../../packages/react/src/select/Select.tsx), [MultiSelect.tsx](../../../packages/react/src/multi-select/MultiSelect.tsx), [select-core](../../../packages/react/src/internal/select-core.ts).

현재 Select.Trigger는 combobox 역할의 button을 직접 만들고 field 스타일·caret을 붙인다. children으로 표시 내용을 바꿀 수 있지만 `asChild`는 없다. MultiSelect의 일반 Trigger도 고정 button이다. DropdownMenu.Trigger와 달리 그대로 다른 버튼/칩을 끼우면 중첩 button이 된다.

권고는 기본 Trigger를 유지하면서 Value/Caret 부품과 명시적인 트리거 합성 계약을 추가하는 것이다. 임의 HTML 모두를 허용하기보다 ref·aria·키보드 이벤트를 전달할 수 있는 요소로 제한한다. 텍스트를 편집하는 검색 input과 선택창만 여는 button은 구분한다. PropertyField는 이 선택 트리거 계약에 참여한다.

현재 Option은 children에서 선택 라벨과 검색 텍스트를 얻는다. 아바타·이름·부서·설명을 모두 children에 넣으면 닫힌 트리거에도 풍부한 행 전체가 노출될 수 있다. **표시 label, 검색 textValue, 행의 leading/main/trailing 표현을 분리**해야 한다. 래핑한 Option의 초기 라벨이 raw value가 되는 등록 문제도 기존 [후속 기록](../../follow-ups.md)에 있다. 풍부한 행을 추가하기 전에 초기/비동기/비마운트 옵션의 라벨 계약부터 정한다.

MultiSelect에는 이미 검색 위치(trigger/content), 필터, onCreate, 생성 오류 문구, formatCount/formatRemoveLabel, 비공개 chip UI가 있다. 이를 다시 구현하지 않는다. 필요한 차이는 다음과 같다.

- 단일 Select의 체크와 달리 복수 선택에는 **사각 체크 표시**를 사용한다. 내부 표현만 변경하고 option/aria-selected를 유지한다. option 안에 독립적으로 초점을 받는 Checkbox를 중첩하지 않는다.
- 현재 listbox에 검색 입력과 생성 항목 등이 함께 있다. 검색·선택 수·전체 해제·푸터를 확장할 때 **패널 shell / 옵션 listbox / 보조 행동**을 분리한다.
- hover, 키보드 focus, selected는 기존처럼 별개다. 검색으로 숨겨진 선택값도 유지하고 전체 해제의 적용 범위를 명확히 한다.

## DropdownMenu / ContextMenu

근거: [DropdownMenu.tsx](../../../packages/react/src/dropdown-menu/DropdownMenu.tsx), [use-overlay.ts](../../../packages/react/src/internal/use-overlay.ts).

현재 Item은 선택 후 메뉴를 닫는다. Label/Separator/Shortcut과 Trigger.asChild는 있지만 Sub/CheckboxItem/RadioItem은 없다. 공유 overlay 스택에는 조상 유지·형제 닫기·자손의 외부 클릭 판정이 이미 있다. “중첩 오버레이 지원이 없다”는 진단은 부정확하다.

필요한 것은 그 기반 위의 **메뉴 전용 Sub 계약**이다. SubTrigger는 일반 Item의 자동 닫기를 그대로 쓰지 않으며, 좌우 키·Escape·부모 포커스 복귀·포인터 이동 경로·RTL을 함께 정의한다. 체크/라디오 메뉴는 실제 설정 명령 수요가 있을 때 추가한다. ContextMenu는 우클릭만으로 모바일 기능을 제공할 수 없으므로 같은 행동에 명시적 트리거도 둔다.

## Dialog / Sheet / portal

근거: [Dialog.tsx](../../../packages/react/src/dialog/Dialog.tsx), [dialog.css](../../../packages/react/src/dialog/dialog.css), [Sheet.tsx](../../../packages/react/src/sheet/Sheet.tsx), [sheet.css](../../../packages/react/src/sheet/sheet.css).

Dialog는 focus/inert/닫기 기반과 Title/Description/Close가 있다. 기본 Content는 max-width 32rem, padding 24px, gap 12px, radius 16px이며 내용 전체가 스크롤한다. Toolbar/Body/Footer/Aside는 공개되지 않았다.

flex 작업 모달처럼 만들려면 기존 Content 아래에 레이아웃 부품을 추가한다. **Toolbar는 위, Body와 Aside는 나란히, Actions/Footer는 본문 아래**라는 조합을 제공하고 긴 본문만 스크롤하도록 한다. 저장/승인 처리는 앱에 둔다. 단순 확인 Dialog는 그대로 사용할 수 있어야 한다.

Sheet는 네 방향과 안쪽 모서리 16px를 이미 지원한다. 옛 결정 문서의 radius 0보다 현재 CSS를 기준으로 삼는다. content-fit/full 높이, safe area, 소프트 키보드, 본문 스크롤, 고정 행동 영역을 공통화할지 검토한다. DatePicker가 이미 90dvh와 safe area·달력 스크롤·하단 행동을 구현했으므로 실제 재사용 근거로 삼는다. 모바일 radius 24px는 출처 실측값이 아닌 디자인 후보다.

**새 density/테마를 적용할 때 portal 전달이 선행 조건이다.** useOverlay·Dialog·Sheet는 body 바로 아래에 portal 컨테이너를 만든다. 트리거 조상의 data 속성/CSS 변수는 portal에 자동 상속되지 않는다. 루트 단위만 지원할지, 명시적 prop/context로 가장 가까운 모드·밀도를 portal에 전달할지 계약이 필요하다. 임의 컨테이너로 portal을 옮겨 기존 dialog-stack의 inert 규칙을 깨뜨리지 않는다.

0.17.3은 부유 패널에 1px 경계와 arrow 위치 보정을 추가했다. 새 radius/padding을 넣어도 이를 유지한다. 패널 층의 경계와 폼 컨트롤 식별 경계는 다른 역할이며 같은 대비 기준으로 일괄 판정하지 않는다.

## Field / Button / Tabs

근거: [TextField](../../../packages/react/src/text-field/TextField.tsx), [Field](../../../packages/react/src/field/Field.tsx), [Button](../../../packages/react/src/button/Button.tsx), [Tabs](../../../packages/react/src/tabs/Tabs.tsx).

TextField는 medium 40px/r8, large 52px/r12이고 prefix/suffix를 지원한다. affix가 있으면 className은 wrapper, ref는 input으로 간다. 새 box/line 또는 내부 라벨 조합은 이 계약과 Field의 label/description/error ID 연결을 유지한다. TextArea의 autoResize/showCount도 재사용한다. uncontrolled count의 form reset 문제는 기존 후속 항목이다.

Button은 36/40/52px, radius 8/8/12px다. loading은 원래 내용을 숨겨 폭을 보존하고 spinner를 겹친다. asChild와 loading의 동시 지원은 없다. 시안 때문에 이 동작을 조용히 바꾸지 않는다.

Tabs는 포커스 시 자동 활성화된다. `activationMode="manual"` 같은 선택적 확장은 가능하지만 기본 동작을 바꾸지 않는다. 기존 responsive는 넓은 화면에서 모든 패널을 보여주는 기능이므로 모바일 탭 스크롤과 동일시하지 않는다. segmented 선택은 기존 RadioGroup을 쓴다.

## DatePicker / DataTable

근거: [DatePicker](../../../packages/react/src/date-picker/picker/DatePicker.tsx), [모바일 CSS](../../../packages/react/src/date-picker/picker/date-picker.css), [DataTable](../../../packages/react/src/data-table/view/DataTable.tsx).

DatePicker는 단일/범위, date/localdatetime/zoned 모델, DST·제약·프리셋, 분리된 Field/Calendar를 이미 갖췄다. 상위 Picker는 Button과 47.99rem 기준 Sheet/Popover 전환을 내부 결정한다. presentation/trigger 선택권을 추가하되 값 모델은 재사용한다. 분기/반기는 범위 프리셋으로 먼저 해결한다. 해당 breakpoint를 flex 공식 값이라고 부르지 않는다.

DataTable은 정렬·필터·선택·가상화·고정 열이 이미 있다. 일반 Table처럼 className/style/wrapperProps를 직접 받는 계약은 없다. 가상 행 높이는 JS `virtual.rowHeight`와 CSS가 함께 사용하고 선택 열 폭 44px도 위치 계산·colgroup·CSS에 걸쳐 있다. **밀도 변경은 CSS와 계산을 같은 값으로 연결해야 한다.** 새 표를 만들기보다 외부 표현 API를 보완한다. 객체 List가 필요한 곳에 DataTable을 억지로 사용하지 않는다.
