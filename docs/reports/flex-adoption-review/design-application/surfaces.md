# 표면·레이어 7개

[공통 규칙](README.md) · [portal·스크롤 계약](../composition.md)

부유 패널은 **기본 표면 + 기존 overlay shadow + 1px stroke-neutral-weak**를 유지한다. dark에서 테두리를 빼는 변경은 대상이 아니다. Tooltip과 Toast는 별도 표면 계약이다.

## Dialog `dialog`

현재: [CSS](../../../../packages/react/src/dialog/dialog.css)의 폭 min(32rem, 화면−32px), r16/p24/gap12, 내용 전체 스크롤. 제목20/본문14.

제안: 간단 확인 Dialog는 현재 밀도를 유지한다. 작업형은 Toolbar / Body / Aside / Footer를 구분한다. Body inset32–40 후보, Aside는 콘텐츠에 맞는 너비, Footer는 Body 아래에만 붙인다. 전체 패널을 한 덩어리로 스크롤하지 않고 본문이 길어져도 주 행동에 도달하게 한다. 제목·대상·상태를 상단에 모으고 활동 로그는 보조 영역에 둔다.

모바일·변경: 좁은 화면에서는 Aside를 본문 뒤 보조 구역으로 재배치하거나 별도 탭으로 제공한다. 저장 중/미저장 닫기 정책은 앱 소유. **레이아웃 부품/API 필요**, 기존 확인형 호환 보존.

## Sheet `sheet`

현재: [CSS](../../../../packages/react/src/sheet/sheet.css)의 p24/gap12, 안쪽 모서리 r16. 좌우 폭 최대24rem, 상하 높이 최대20rem, 내용 전체 스크롤.

제안: 짧은 선택은 content-fit, 긴 폼은 화면 제한 높이와 독립 Body 스크롤을 사용한다. bottom 형태는 r24 후보, inline inset20 후보와 하단 safe area를 함께 적용한다. 제목/닫기 영역과 Footer는 스크롤 영역 밖에 둔다. 드래그 핸들은 실제 drag 동작을 제공할 때만 사용한다.

모바일·변경: 소프트 키보드가 켜져도 마지막 필드와 CTA에 접근 가능해야 한다. DatePicker의 90dvh·safe area 패턴을 공통화 근거로 활용한다. **layout/height/presentation 계약 필요**. 모든 dialog를 자동 Sheet로 바꾸지 않는다.

## Popover `popover`

현재: [CSS](../../../../packages/react/src/popover/popover.css)의 최대24rem, p16/r12, arrow8.

제안: 간단한 정보/행동 패널은 현재 p16/r12를 유지한다. 선택 전용 패널의 r14/p8과 구분한다. 제목·설명·행동의 시작선을 맞추고 필요 없는 arrow는 빼서 문맥을 단순하게 할 수 있다. 내부에 또 Card를 감싸 표면이 중첩되지 않게 한다.

모바일·변경: 짧은 내용은 화면 안쪽에 유지, 긴 입력/선택은 앱의 Sheet 조합을 검토한다. 열림 의미를 modal로 일괄 바꾸지 않는다. arrow와 1px 경계 정렬 보존. **토큰/CSS**, portal scope는 공통 계약.

## HoverCard `hover-card`

현재: [CSS](../../../../packages/react/src/hover-card/hover-card.css)의 최대24rem, p16/r12, arrow8.

제안: 사람/객체 미리보기는 Avatar→이름/보조 정보→짧은 내용 순서. Avatar와 텍스트는 gap12 후보, 내부 그룹 간격16 후보로 정렬한다. Popover와 표면을 공유하되 중요한 편집 작업을 hover 안에 넣지 않는다.

모바일·변경: 꼭 필요한 정보는 클릭 Popover나 상세 화면으로도 제공한다. 단지 hover가 없다는 이유로 데이터를 없애지 않는다. **CSS/소비자 조합**, 새 정보 조회 로직 불필요.

## Tooltip `tooltip`

현재: [CSS](../../../../packages/react/src/tooltip/tooltip.css)의 최대16rem, r8/p6·8, 글자12, 반전 표면.

제안: 현재 형태를 유지한다. 짧은 부연만 넣고 아이콘 버튼의 실제 접근 이름을 대체하지 않는다. 모든 설명을 큰 rounded panel로 바꾸지 않는다. 긴 설명·링크·버튼은 Popover로 옮긴다.

모바일·변경: tooltip을 볼 수 없어도 핵심 행동을 이해할 수 있어야 한다. focus·hover·Escape와 화면 경계 배치 확인. **semantic 색/타입 정렬**, 새 크기 체계 불필요.

## Card `card`

현재: [CSS](../../../../packages/react/src/card/card.css)의 r12/p16, 약한 1px 테두리, 기본 표면. asChild로 link/button이 될 수 있다.

제안: 현재 r12/p16을 기본으로 유지한다. 독립 요약은 카드, 연속 객체 목록은 평면 List로 구분한다. 복잡한 큰 카드만 r16/p24 후보를 검토한다. 기본 카드에는 overlay shadow를 넣지 않는다. 클릭 카드의 반응은 비대화형 카드와 구별한다.

모바일·변경: 카드 안 행동이 여러 개면 전체 카드를 button/link로 감싸지 않는다. 제목·메타데이터·행동 순서를 유지하고 높이는 콘텐츠를 따른다. **CSS + 필요한 경우 크기 옵션**, 모든 표면의 공통 wrapper로 강제하지 않음.

## Separator `separator`

현재: [CSS](../../../../packages/react/src/separator/separator.css)의 수평/수직1px.

제안: 지금 두께를 유지한다. 간격만으로 구분이 부족한 경우에 사용하고 폼 모든 필드 사이에 반복하지 않는다. 전체 폭 경계와 텍스트 시작선에 맞춘 inset 경계를 구분한다. 수직선은 넓은 Dialog Aside 등 실제 열 구분에 사용한다.

모바일·변경: 나란한 열이 수직으로 쌓이면 선 방향이나 필요성도 다시 판단한다. 의미 있는 separator와 장식선의 기존 접근성 옵션 유지. **CSS/소비자 배치**.
