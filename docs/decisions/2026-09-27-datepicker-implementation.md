# DatePicker 구현 결정

> 상태: 로컬 구현·자동 검증 완료 (2026-09-27). [스펙](../specs/2026-09-27-datepicker.md) · [계획](../plans/2026-09-27-datepicker.md) · [QA](../qa/2026-09-27-datepicker.md). 커밋·PR·릴리스 전.

## 공개 값과 날짜 연산

- 공개 진입점은 `DatePicker`·`DateRangePicker` 두 개, 값 종류는 `kind="date" | "local-date-time" | "zoned-date-time"`로 나눴다. 값은 `@internationalized/date`의 `CalendarDate`·`CalendarDateTime`·`ZonedDateTime`이다. 내부 달력·시간 입력은 공개하지 않는다.
- 생성자·일부 파서가 day 00, 잘못된 월일, 시간 값을 보정하거나 허용하는 것을 Phase 0에서 확인했다. 직접 입력은 완성된 형태를 엄격히 검사한 뒤 날짜와 시간을 따로 파싱한다. 외부 값의 초·밀리초와 비그레고리력은 조용히 버리지 않고 오류로 거부한다.
- zoned 편집은 먼저 현지 날짜시간 draft를 만들고 `earlier`·`later` 후보를 wall time으로 역검증한다. 후보 0개는 gap 오류, 2개는 오프셋 선택이다. 이미 선택된 중복 시각을 그대로 편집하면 기존 오프셋을 보존한다. `ZonedDateTime.set()`의 묵시적 시각 보정은 편집 경로에 사용하지 않는다.
- 기간 중 선택 불가 날짜는 CalendarDate로 양 끝을 포함해 검사한다. 종료 날짜를 확인한 뒤 반복을 끝내 최대 연도에서 날짜 증가가 멈춰도 무한 순회하지 않는다.

## 입력·오버레이

- React Aria 달력·범위 달력 훅은 기존 DDS Popover/Sheet 안에서 키보드 그리드·범위 선택·불가일을 제공한다. 직접 입력에는 React Aria `useDateField`를 쓰지 않았다. 완성 즉시 변경 이벤트를 내고 잘못된 원문을 보존할 수 없어, DDS TextField와 별도 raw draft를 사용한다.
- 데스크톱 Popover는 기본 최대 폭 24rem을 DatePicker 전용 클래스로 넓혀 두 달을 가로 배치한다. 모바일은 모든 모드에 bottom Sheet를 쓰고, 90dvh 높이·내부 달력 스크롤·고정된 동작 영역을 적용했다. 공용 Popover/Sheet 기본 크기는 바꾸지 않았다.
- 단일 날짜는 선택 즉시 확정한다. 범위·시간 입력은 값과 raw draft를 분리해 적용/취소하며, Escape·바깥 닫기는 임시 값을 버린다. 날짜 그리드는 열릴 때 선택된 날짜에 포커스하고 닫은 뒤 트리거로 복귀한다. 화면 폭 전환에는 draft와 포커스 날짜를 부모 상태로 유지한다.
- 단일 날짜의 유효한 직접 입력은 Enter 또는 패널 밖 blur에서 확정한다. 입력 후 패널 안 달력 날짜를 누르면 blur가 먼저 값을 확정해 클릭을 잃는 문제가 있어, 내부 pointerdown에서 그 blur만 건너뛴다. 직접 입력→달력 선택과 바깥 blur를 unit·Chromium 양쪽에서 검증했다.
- 프리셋은 앱이 `getValue()`로 선택 시점에 계산한다. 컴포넌트는 제약 검증 후 단일 날짜는 즉시, 나머지는 draft로 적용한다. 시간대 선택과 앱별 예약 정책은 포함하지 않는다.

## 패키지·검증 판단

- `@internationalized/date@3.12.4`, `react-aria@3.52.1`, `react-stately@3.50.0`을 React 런타임 의존성에 추가했다. 달력 훅은 서브패스로 import했지만 Storybook의 DatePicker 공유 청크는 약 122.6KB(gzip 38.5KB)였다. 이는 Storybook 소비 측정값이다.
- `@dg-design/react/date-picker` 서브패스와 루트 export, changeset을 추가했다. 빌드의 re-export 전용 파일은 JS가 생성되지 않아 서브패스 runtime 경로를 실제 `picker/DatePicker.js`로 지정했다.
- Linux 시각 기준 이미지는 macOS 로컬에서 만들지 않았다. 기준 생성 워크플로는 브랜치에 커밋·푸시하므로 별도 승인 후 실행한다. 실제 모바일 가상 키보드와 VoiceOver/TalkBack 청취도 릴리스 전 검증한다.
