# 입력·선택 12개

[공통 규칙·수치의 신뢰도](README.md) · [API 계약](../composition.md)

## Button `button`

현재: [CSS](../../../../packages/react/src/button/button.css)의 높이 36/40/52, r8/8/12, 좌우 여백 12/16/20, 글자 13/14/18. solid/weak/ghost가 있다.

제안: 기본 세 크기는 유지한다. 저장/확정은 brand solid, 보조 행동은 neutral weak, 문맥 행동은 ghost로 정렬한다. 아이콘-라벨 간격 8은 유지하고 모서리를 pill로 일괄 변경하지 않는다. 데스크톱 주요 CTA 48은 별도 역할 수요가 확인될 때 추가한다. 모바일 주요 CTA는 52/r12, 글자 16 후보로 검토한다.

상태·변경: loading 폭 보존, pressed/focus 분리, iconOnly 접근 이름 유지. outline이나 loadingLabel은 이번 기본 범위가 아니다. **토큰/CSS 우선**, 크기·문구 API는 필요 시 additive.

## Field `field`

현재: [CSS](../../../../packages/react/src/field/field.css)의 label-컨트롤 간격 6, label 14, 설명·오류 13.

제안: 한 필드 내부 6과 필드 사이 12/모바일 14를 구분한다. 그룹 사이 24/28을 둔다. 외부 label형을 기본으로 유지하고, 모바일 박스 안 label형은 작은 label과 value를 수직 배치한다. 설명·오류는 박스 바깥 같은 시작선에 둔다.

상태·변경: placeholder를 label로 대체하지 않는다. 내부 label형은 Field layout/Control wrapper 계약 검토가 필요하다. description/error ID와 invalid 연결 유지. **조합 추가**.

## TextField `text-field`

현재: [CSS](../../../../packages/react/src/text-field/text-field.css)의 높이40/r8/p12/글자14px와 높이52/r12/p16/글자18px, prefix/suffix 지원.

제안: 데스크톱 40/r6 후보와 기존 r8을 비교한다. 모바일 56/r16/p16, 값 글자 16 후보. box형은 낮은 중성 표면과 명확한 focus 경계, line형은 같은 라벨/값 배치에 아래 경계를 사용한다. 검색은 선행 아이콘, 단위는 후행 부속 영역에 둔다.

상태·변경: readonly는 읽기·복사가 가능해 보여야 하고 disabled와 구분한다. 오류+focus에서 라벨과 설명을 잃지 않는다. affix 유무에 따른 className 위치와 input ref 보존. **토큰/CSS + variant 계약**.

## TextArea `text-area`

현재: [CSS](../../../../packages/react/src/text-area/text-area.css)의 r8/r12, 세로 여백 8/12, 가로 12/16, 글자 14/18. autoResize/showCount가 있다.

제안: TextField와 표면·반경·inline inset을 맞추고 여러 줄 콘텐츠만 높이가 늘어난다. 모바일 값 글자 16, 최소 높이는 실제 3줄 등 용도에 따라 정한다. 글자 수는 아래 우측, 오류는 좌측에 놓고 좁으면 순서대로 줄바꿈한다.

상태·변경: 임의 고정 높이로 잘라내지 않는다. 값과 카운트의 form reset 동기화는 기존 후속 항목. **토큰/CSS 우선**, 내부 DOM 확대는 필요한 경우만.

## Checkbox `checkbox`

현재: [CSS](../../../../packages/react/src/checkbox/checkbox.css)의 시각 박스 16/r4 또는 20/r6, label gap 8.

제안: 이 크기·반경을 유지하고 선택 시 브랜드 채움+체크, mixed 시 가로 표시로 분리한다. 긴 설명이 있는 항목은 첫 줄 옆에 체크를 정렬한다. 모바일은 20px 박스와 넓은 라벨 행을 쓰며 박스만 44px로 확대하지 않는다.

상태·변경: unchecked/checked/mixed 각각 focus·disabled 검수. MultiSelect option 내부에는 native Checkbox를 넣지 않는다. **CSS/조합으로 가능**.

## RadioGroup `radio-group`

현재: [CSS](../../../../packages/react/src/radio-group/radio-group.css)의 기본 원 16, 세로 gap 12. segmented는 높이 28/36/44, inset 2, pill 표면과 이동 indicator.

제안: 일반 radio의 원과 점을 유지한다. segmented는 기존 pill을 남기고 사각형에 가까운 r12 바깥/r10 안쪽 후보를 같은 variant의 외형 옵션으로 비교한다. inset 2와 indicator 반경을 함께 바꾼다. 모바일은 44 이상 조작 영역과 긴 라벨 처리를 확인한다.

상태·변경: 선택 글자와 표면으로 상태를 유지하며 focus는 별도. 새로운 SegmentedControl export는 불필요. **CSS + 필요 시 shape 옵션**.

## Switch `switch`

현재: [CSS](../../../../packages/react/src/switch/switch.css)의 track 32×20 / 40×24, thumb 16/20, label gap 8.

제안: pill track·thumb 비율을 유지하고 설정 행의 우측에 배치한다. label/설명은 좌측, 행 내부 12–16, 그룹 간격 24/28 후보. 모바일은 40×24 시각 형태를 유지하되 터치 영역을 늘린다.

상태·변경: thumb 위치와 색을 함께 사용한다. 비동기 반영 중 상태·실패 복구는 앱에서 표시하며 단순히 성공 상태를 미리 확정하지 않는다. **CSS/설정 행 조합**.

## Slider `slider`

현재: [CSS](../../../../packages/react/src/slider/slider.css)의 track 4/6, input 높이 24, 네이티브 range.

제안: track 비율 유지, 값은 label 우측에 정렬하고 설명은 아래에 둔다. 활성 구간만 brand, 나머지는 neutral. 모바일은 thumb/track 외형과 별도로 drag hit area를 검토한다. 수치 정밀 입력이 필요하면 TextField를 앱에서 함께 제공한다.

상태·변경: min/max/step과 키보드 동작 유지. 눈금·툴팁·복수 thumb는 원본 스타일을 이유로 선제 추가하지 않는다. **CSS/Field 조합**.

## Select `select`

현재: [CSS](../../../../packages/react/src/select/select.css)의 Trigger 40/r8 또는 52/r12, 패널 r12/p4, option min-height 32/r6/p6·8.

제안: Trigger는 TextField와 기준선을 맞춘다. 패널 r14/p8, option r6/min-height 36 후보로 정보 여유를 준다. 단일 선택은 체크 하나, hover는 옅은 중성 표면으로 구분한다. 사람 항목은 leading Avatar, 이름/설명, trailing 선택 표식으로 구성한다. 모바일은 행 48 후보와 Sheet 조합을 검토한다.

상태·변경: 풍부한 행과 닫힌 선택값의 label/textValue를 분리한다. Button/PropertyField/Chip 트리거 합성은 새 API가 필요하다. **조합 API 선행**, CSS만으로 완성 불가.

## MultiSelect `multi-select`

현재: [CSS](../../../../packages/react/src/multi-select/multi-select.css)의 SearchTrigger min-height 40, chip r6/p2·8/글자12. 선택 표식은 단일 Select와 같은 체크이고 검색·생성은 이미 지원한다.

제안: Select와 패널 치수를 맞추되 **사각 체크 mark**로 복수 선택을 드러낸다. 검색 → 선택 수/해제 → 옵션 목록 → 선택적 행동 영역 순서. trigger 안 chip은 필요한 수만 보이게 하는 조합도 검토하되 숨긴 값의 수를 정확히 표시한다. 모바일은 여러 chip으로 높이가 늘어날 수 있게 한다.

상태·변경: 검색/행동은 listbox 바깥, 선택값은 검색으로 사라지지 않음. chip 제거는 이름이 있는 독립 버튼이며 전체 선택기 button 안에 중첩하지 않는다. **API/DOM + CSS**.

## DatePicker `date-picker`

현재: [CSS](../../../../packages/react/src/date-picker/picker/date-picker.css)의 Popover p16, 단일 폭 최대24rem/범위43rem, 모바일 Sheet 90dvh 제한과 안전 영역. 달력 day/nav는 min44.

제안: 날짜 필드는 PropertyField/Field 계열로 맞추고 Calendar는 현재 날짜/선택 날짜/범위 중간/양 끝을 구분한다. 모바일은 제목·달력 스크롤·하단 적용/취소를 유지한다. 시간·타임존은 보조 그룹으로 분리한다.

상태·변경: inline/Popover/Sheet 외형을 바꿔도 같은 값 모델·DST·검증 유지. 고수준 트리거/presentation 확장만 검토. **기존 모바일 구현 재사용**.

## FileInput `file-input`

현재: [CSS](../../../../packages/react/src/file-input/file-input.css)의 Dropzone r12, p24·16, gap8; Preview/Actions 부품이 있다.

제안: 바탕은 약한 중성, drop 경계는 업로드 가능한 영역을 식별할 정도로 유지한다. 선택 후에는 파일명·크기·상태·제거를 한 행으로 표현한다. 모바일은 “파일 선택”을 명시적으로 보여주고 drag 설명의 비중을 줄인다.

상태·변경: drag-over만으로 안내하지 않고 오류 파일/업로드 중/재시도를 구분한다. 업로드 로직은 앱 소유. **CSS/기존 부품 조합**.
