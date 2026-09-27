# Table v2 구현 중 결정

- 날짜: 2026-09-25
- 상태: 로컬 구현 완료, 릴리스 전
- 계약: [구현 스펙](../specs/2026-09-25-table-v2.md)
- 검증: [Table v2 QA](../qa/2026-09-25-table-v2.md)

## 기존 Table와 새 DataTable

기존 `Table`은 마크업 primitive로 유지한다. 표 데이터를 받아 처리하는 계층은 별도 `DataTable`로 추가했다. 기존 `TableRoot`의 table ref와 props 전달은 그대로 두고 `wrapperProps`·`wrapperRef`만 추가했다. 가로 스크롤이 있는 소비 화면은 이름 있는 focusable region을 구성할 수 있다.

`DataTable`의 열 배열과 타입 연결 render prop 태그는 하나의 `DataColumn<T>` 모델로 정규화한다. 직접 자식 `<DataTable.Column>`은 부모의 행 타입이 자식에 전달되지 않아 필드 오타를 타입 검사에서 놓쳤으므로 제공하지 않는다. render prop은 직접 `Column`, 배열, fragment, 조건부 null만 읽고 임의 컴포넌트의 렌더 결과는 해석하지 않는다. 빈 열·중복 ID·유효하지 않은 너비·행 ID는 조기에 오류로 알린다.

## 데이터 처리와 가상화

필터 → 안정 정렬 → 가상 범위 선택 → 셀 렌더 순서다. 모델 함수는 원본 배열을 변경하지 않는다. 계산 열의 정렬·필터는 별도 비교/값 함수로 처리해 화면 밖의 `cell` 렌더러를 호출하지 않는다. 선택 상태는 배열 위치가 아닌 `rowKey` 결과를 따른다.

별도 가상화 의존성을 추가하지 않았다. 첫 범위가 고정 높이 세로 행뿐이고 네이티브 `<table>` + 위아래 spacer 행으로 1만 행·sticky 헤더/좌우 열 PoC가 통과했기 때문이다. `virtual`을 켜면 필요한 행만 마운트하며, 열 너비가 필요한 고정 열은 명시적 `width`를 요구한다. 선택 열의 기존 셀 여백이 지정 너비 44px을 실제 52px로 넓혀 고정 열이 8px 어긋났으므로 해당 셀의 가로 여백을 제거했다. 브라우저에서 실제 행 높이 44px과 9,000번째 누적 위치를 확인했다.

가상 행에 포커스한 채 화면 밖으로 스크롤하면 언마운트 직전에 이름 있는 스크롤 영역으로 포커스를 옮긴다. 비가상 표는 실제 overflow가 있을 때만 `ResizeObserver` 측정으로 region과 tab stop을 추가한다. 선택 체크박스는 DDS `Checkbox`를 재사용하고 대량 행에서는 motion을 끈다.

## 공개·검증 경계

`@dg-design/react/data-table` 서브패스와 barrel에서 컴포넌트·타입을 공개한다. Vite preserveModules 빌드는 순수 재수출 파일의 JS를 생략하므로 package의 런타임 export는 실제 `dist/data-table/view/DataTable.js`, 타입 export는 `dist/data-table/DataTable.d.ts`를 가리킨다. publint로 패키지 경로를 확인했다.

첫 릴리스는 로컬 배열·고정 높이 행·세로 가상화에 한정한다. 서버 데이터, 무한 로딩, 가변 행 높이, 열 가상화, 확장·트리·셀 병합은 후속이다. Storybook 신규 시각 기준 이미지는 CI의 visual-baseline 워크플로에서만 생성한다.
