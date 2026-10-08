# 데이터·피드백 12개

[공통 규칙](README.md) · [Table 계산 계약](../composition.md)

## Table `table`

현재: [CSS](../../../../packages/react/src/table/table.css)의 cell p12·16, 헤더13/bold, 본문14, 행 아래1px 선과 hover 표면.

제안: 기본 여백은 유지한다. 헤더는 약한 텍스트, 본문은 진한 텍스트, 긴 제목/사람 정보는 leading 정렬, 숫자는 끝 정렬+tabular-nums를 적용한다. 행의 비교가 목적이므로 모든 셀에 카드·수직선을 넣지 않는다. density는 별도 cell padding 역할로 연결한다.

모바일·변경: 비교가 필요한 표는 가로 스크롤을 유지하고 caption/핵심 열에 접근하게 한다. 객체 탐색이 목적이면 앱에서 List를 선택한다. CSS로 행을 block으로 바꾸기만 하지 않는다. **CSS/마크업 조합**.

## DataTable `data-table`

현재: [CSS](../../../../packages/react/src/data-table/view/data-table.css)는 Table을 기반으로 선택 표면·고정 열·가상 행을 추가한다. 선택 열44, 필터 높이32/r8, 가상 높이는 prop과 CSS 변수로 연결된다.

제안: compact 44 / comfortable 52 행 높이는 **한 줄 가상 행의 비교 후보**로만 사용한다. 두 줄 내용에는 별도 충분한 높이를 지정한다. 선택 행은 체크와 약한 brand 표면을 유지하고 hover를 겹쳐도 체크가 남는다. 외부 Toolbar에는 검색/필터/선택 수/일괄 행동을 둔다.

모바일·변경: 핵심 열을 남기거나 표 스크롤을 유지하는 앱 결정을 따른다. CSS padding만 바꾸지 않고 rowHeight·pin offset·colgroup과 일치시킨다. wrapper 스타일/API 보완 필요. **CSS + 치수/API 계약**.

## Avatar `avatar`

현재: [CSS](../../../../packages/react/src/avatar/avatar.css)의 원형24/36/48/64와 크기별 fallback 글자.

제안: 네 크기를 유지한다. 선택 행은24/36, 객체 목록36/48, 상세 헤더64를 우선 조합한다. 이름과 gap8/12 후보로 정렬하고 부서·직함은 아래 약한 텍스트로 둔다. 사진 외곽과 fallback의 시각 면적을 맞춘다.

모바일·변경: 행 높이를 늘려도 Avatar를 무조건 확대하지 않는다. 로드 실패 fallback·badge 위치·긴 이름 확인. **토큰/CSS/행 조합**.

## Badge `badge`

현재: [CSS](../../../../packages/react/src/badge/badge.css)의 높이20/r4/p6/글자11, 높이24/r6/p8/글자12. intent별 solid/weak.

제안: 현재 비율을 유지하고 일반 상태는 weak 위주로 둔다. “발행됨”, “초안” 등 의미가 다른 상태를 글자로 표현하며 critical/positive 등을 업무 의미에 맞춰 사용한다. 약한 회색 본문을 복제해 접근 대비를 낮추지 않는다.

모바일·변경: 길면 문구/배치를 조정하고 태그 제거 버튼을 넣지 않는다. 클릭형은 Chip 역할로 분리한다. **semantic 연결/소비자 사용 규칙**.

## NotificationBadge `notification-badge`

현재: [CSS](../../../../packages/react/src/notification-badge/notification-badge.css)의 dot6, count min18×18, 글자11, 완전 원형/캡슐.

제안: 크기는 유지한다. dot은 새 활동, count는 건수로 구분하고 label 옆/아이콘 코너의 위치를 소비자 조합으로 맞춘다. 두 자리·세 자리 숫자에서도 원형 강제로 잘리지 않게 한다.

모바일·변경: 배지는 독립 터치 대상이 아니다. “알림 12개” 같은 부모 이름과 중복 읽기 여부를 확인한다. **CSS/배치**, 상태 Badge와 합치지 않음.

## Alert `alert`

현재: [CSS](../../../../packages/react/src/alert/alert.css)의 r8/p16/gap8, 제목14/본문13, actions slot.

제안: p16/r8을 유지한다. 정보·주의·오류는 해당 weak 표면+아이콘+문구로 표현한다. 제목→설명→복구 행동을 같은 텍스트 시작선에 둔다. 큰 안내 영역에 강한 solid 브랜드를 쓰지 않는다.

모바일·변경: Actions는 본문 아래로 줄바꿈하고 닫기와 실행 버튼이 겹치지 않게 한다. critical의 alert 역할과 일반 status 계약 보존. **CSS/기존 actions 조합**.

## Toast `toast`

현재: [CSS](../../../../packages/react/src/toast/toast.css)의 r12/p12·16, 제목13/설명12, viewport 최대24rem, 별도 toast z-index.

제안: 현재 작은 피드백 형태를 유지한다. 결과를 짧게 쓰고 되돌리기처럼 필요한 행동만 추가한다. 중복 안내가 쌓이지 않도록 앱에서 발행한다. 일반 Popover와 같은 흰 패널/테두리를 강제하지 않는다.

모바일·변경: safe area와 고정 CTA·키보드에 겹치는지 확인한다. 타이머·hover/focus 정지·닫기·live region·inert 예외를 유지한다. **CSS/배치**, 실제 지연과 오류 정책은 앱 소유.

## StatePanel `state-panel`

현재: [CSS](../../../../packages/react/src/state-panel/state-panel.css)의 min-height16rem, r12/p24·16, 제목16/설명13, Actions/Footer.

제안: 페이지 전체 empty는 현 크기, 작은 선택기/패널 empty는 문맥에 맞는 compact 조합 후보. 아이콘→제목→설명→다음 행동 순서. 검색 결과 없음은 “조건 초기화”, 데이터 없음은 “첫 항목 만들기”로 구분한다.

모바일·변경: 고정 최소 높이 때문에 현재 작업이 밀리지 않는지 확인한다. 코드/진단 정보는 기본 본문보다 보조 영역에 둔다. **크기·정렬 CSS 또는 옵션**, 비즈니스 문구는 앱 소유.

## SaveStatus `save-status`

현재: [CSS](../../../../packages/react/src/save-status/save-status.css)의 글자12, gap4, icon16.

제안: 현 밀도를 유지해 저장 버튼 근처에 놓는다. 변경됨/저장 중/저장됨을 텍스트와 아이콘으로 구분하고 긴 오류는 별도 Alert로 설명한다. 성공 때마다 큰 녹색 Badge로 바꾸지 않는다.

모바일·변경: 공간이 작아도 실패 상태를 숨기지 않는다. 과업 완료/승인과 저장 완료를 분리하고 불필요한 반복 알림 방지. **semantic/배치**, 지원 상태 추가가 필요하면 앱 조합부터 검토.

## Progress `progress`

현재: [CSS](../../../../packages/react/src/progress/progress.css)의 track6, neutral 바탕/brand 채움, indeterminate40% 이동.

제안: 두께6을 유지하고 값과 label은 같은 시작선/끝선에 정렬한다. 진행률을 아는 경우에만 퍼센트를 쓰고, 모르면 기존 indeterminate를 사용한다. 오류는 색 변경만 하지 않고 설명을 함께 둔다.

모바일·변경: 전체 작업인지 파일 하나인지 범위가 드러나야 한다. reduced motion·value/aria 범위 유지. **CSS/주변 설명 조합**.

## Spinner `spinner`

현재: [CSS](../../../../packages/react/src/spinner/spinner.css)의 16/20, 선2, spin1000ms.

제안: 기존 값 유지. 버튼 안은 버튼 글자색, 본문 대기는 중성 색을 사용한다. 작은 로딩마다 브랜드 색을 남용하지 않는다. 버튼 안 spinner와 라벨의 면적을 맞추되 기존 Button 폭 보존 로직을 사용한다.

모바일·변경: spinner만으로 오래 대기하게 하지 않고 필요 시 상태 문구를 둔다. 모션을 바꾸기 위해 새 easing/speed를 추가하지 않는다. **역할 색/사용 규칙**.

## Skeleton `skeleton`

현재: [CSS](../../../../packages/react/src/skeleton/skeleton.css)의 반경 none/8/12/full, neutral 표면, shimmer와 reduced motion 대응.

제안: 실제 콘텐츠의 Avatar·텍스트 줄·행 여백을 그대로 예고한다. 둥근 Avatar 자리에는 full, Card 자리에는 같은 반경을 쓴다. 여러 무관한 큰 카드 블록으로 페이지를 채우지 않는다.

모바일·변경: 로딩이 끝나도 행 시작선과 주요 영역 높이가 크게 바뀌지 않게 한다. 로딩/빈 결과/오류를 구분하고 Skeleton을 무기한 유지하지 않는다. **CSS/소비자 조합**, 새 모양 생성 API 불필요.
