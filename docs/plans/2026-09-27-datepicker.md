# DatePicker 구현 계획

> 상태: **npm 0.16.1 배포, 실기기 QA 후속** (2026-09-29 KST). [승인된 스펙](../specs/2026-09-27-datepicker.md)을 구현 가능한 작업으로 나눈 계획이다. [구현 결정](../decisions/2026-09-27-datepicker-implementation.md) · [QA](../qa/2026-09-27-datepicker.md).
> 사용자 배포 요청으로 아래 실기기·스크린리더 릴리스 전 게이트는 미검증 상태로 후속 QA에 이월했다.

## 목표와 첫 버전 경계

`@dg-design/react`에 `DatePicker`와 `DateRangePicker`를 추가한다. 두 컴포넌트는 단일/범위 × 날짜/날짜+시간을 지원하고, 시간이 있으면 현지 시각 또는 IANA 시간대가 있는 실제 시점을 구분한다. 데스크톱은 팝오버, 모바일은 모든 모드에서 시트다. 단일 날짜는 즉시 확정하고 범위·시간은 적용/취소를 거친다. 프리셋의 문구·계산식은 소비 앱이 제공한다.

첫 버전의 공개 표면은 두 컴포넌트와 값·프리셋 타입으로 제한한다. `Calendar`, `TimeField`, `DatePicker.Trigger` 같은 조립 부품은 내부에 두고, 실제 두 번째 소비 방식이 생길 때 공개를 검토한다. 반복 일정·초 단위·시간대 선택기·서버 예약 정책·비그레고리력 UI는 만들지 않는다.

## 구현 전 고정할 공개 API

| 항목 | 계획안 | 확인 방법 |
| --- | --- | --- |
| 값 종류 | `kind="date" | "local-date-time" | "zoned-date-time"` 판별자. 각각 `CalendarDate`, `CalendarDateTime`, `ZonedDateTime` 값만 받는다 | 잘못 섞은 `value`·범위 양 끝이 타입 검사 실패 |
| 시간대 | `zoned-date-time`에만 IANA `timeZone` 필수. 값의 시간대와 prop 불일치 시 오류 | 빈 값에서 선택 시작, DST, prop 변경 테스트 |
| 상태 | `value/defaultValue/onValueChange`와 `null` 빈 값. prop 존재 여부로 controlled 판정 | 외부 값 변경·초기화·취소 테스트 |
| 범위 | `{ start, end }`와 동일 값 종류. 날짜 양 끝은 포함, 같은 날 유효한 시간 범위 허용 | 타입·경계 테스트 |
| 제약 | `minValue/maxValue/isDateUnavailable`와 오류 문구 재정의. 중간 불가일을 지나는 범위는 차단 | 순수 모델 테스트 |
| 프리셋 | 선택적 `{ id, label, getValue: () => Value }[]`. 클릭 시 앱의 계산 함수를 호출한다 | 자정 경계·시간대·제약 위반 테스트 |
| 표시 언어 | `locale`은 명시 가능하며 SSR에서 안정적인 기본값을 쓴다. 날짜 순서·주 시작일은 `Intl` 기준, 동작·오류 문구는 앱이 재정의할 수 있다 | `ko-KR`·`en-US`, SSR hydration, 접근 이름 테스트 |
| 폼 | 단일 `name`, 범위 `startName/endName`. 날짜/현지 날짜시간은 ISO 문자열, zoned 값은 오프셋과 IANA 지역을 보존 | 제출 DOM·직렬화 왕복 테스트 |
| 입력 | 달력과 직접 키보드 입력. 직접 입력의 미완성 상태는 확정 값과 분리 | blur/Enter/오류/취소 테스트 |

이 표는 구현 전에 타입·런타임 PoC로 검증할 **제안 API**다. `@internationalized/date`의 세 값 타입은 스펙의 날짜/현지 시각/실제 시점 구분과 직접 맞는다. 특히 DST에서 `toZoned`의 기본 변환은 존재하지 않는 시각을 조정할 수 있으므로, 제품 계약의 “조용히 보정하지 않음”을 별도 왕복 검증으로 강제한다. 중복되는 현지 시각은 두 오프셋을 구분해 선택·표시해야 한다. 이 경로를 만들 수 없으면 전체 구현 전에 계획을 수정한다. [날짜 값 문서](https://react-aria.adobe.com/internationalized/date/), [DST 동작](https://react-aria.adobe.com/internationalized/date/CalendarDateTime), [시간대 값](https://react-aria.adobe.com/internationalized/date/ZonedDateTime)

## Phase 0 — 기술 게이트

소스 구현 전에 작은 PoC로 아래 네 가지를 확인하고 결과를 계획에 기록한다. 실패한 계약을 우회해 전체 구현을 시작하지 않는다.

1. **타입·값:** 세 값 종류와 단일/범위의 판별 타입이 TS 6.x에서 잘 추론되는지 확인한다. `null` controlled, 잘못 섞은 값, 시작·종료의 타입 오류와 locale별 직접 입력을 검사한다.
2. **날짜 연산:** 윤일, 월 경계, 1만 일 내외의 기간 중 불가일 탐색, DST gap/overlap, 직렬화 왕복을 측정한다. 브라우저 `Date`의 암묵적 시간대 변환에 의존하지 않는다.
3. **접근성 조립:** React Aria의 달력/날짜 입력 훅을 기존 DDS `Popover`·`Sheet` 안에서 사용할 수 있는지 확인한다. 키보드 그리드·범위 선택·포커스 복귀가 맞으면 훅을 사용하고, 오버레이를 중복 중첩해야만 동작한다면 구현 전에 대안을 비교해 기록한다. [달력 훅](https://react-aria.adobe.com/Calendar/useCalendar), [범위 달력 훅](https://react-aria.adobe.com/RangeCalendar/useRangeCalendar)
4. **화면 크기:** 375px에서 한 달 달력+시간+프리셋+가상 키보드를 기존 bottom `Sheet`에 넣어 본다. 기본 시트 높이·스크롤이 부족하면 DatePicker 전용 레이아웃만 추가한다. 공용 `Sheet`의 기본 계약은 바꾸지 않는다.

Phase 0의 산출물은 확정 API 타입, 날짜 연산 경로, 접근성 훅 채택 여부, 모바일 레이아웃 측정값이다. 패키지 빌드는 의존성을 external로 두므로 새 의존성의 실제 소비 번들 증가는 Storybook production build의 해당 청크로 기록한다. 공개 API·접근성이 스펙에 맞지 않으면 사용자에게 수정안을 보여주고 다음 단계를 멈춘다.

### Phase 0 결과 (2026-09-27)

[Phase 0 QA](../qa/2026-09-27-datepicker.md)에 타입·엄격 파싱·DST·접근성 훅·375px 시트 실측을 기록했다. 공개 값 구분은 유지한다. `@internationalized/date`의 묵시적 보정을 막는 strict draft 파서, React Aria 달력 훅+DDS 오버레이, 별도 TextField draft, DatePicker 전용 모바일 시트 크기로 진행한다. 세 패키지를 React 의존성에 고정했으며 소비 번들은 Storybook 예제가 나온 뒤 측정한다.

## 작업 분해와 의존

소유 경로는 병렬 실행 시 서로 겹치지 않게 정한다. 실행 승인을 받기 전에는 아래 작업을 시작하지 않는다.

| # | 작업·소유 범위 | 의존 | 합격 조건·위험 | 배정 권장 |
| --- | --- | --- | --- | --- |
| A | 날짜 값·순수 검증 모델 — `packages/react/src/date-picker/model/` | Phase 0 | 세 값 종류, 범위·불가일·DST·프리셋 검증. 공개 타입 실수는 되돌리기 비쌈 | gpt-6-astra · high |
| B | 달력 그리드·범위 표시 — `packages/react/src/date-picker/calendar/` | A | 월 탐색·불가일·키보드·발화. 중간 불가일 차단과 그리드 포커스 | gpt-6-sol · high |
| C | 직접 입력·시간 필드 — `packages/react/src/date-picker/field/` | A | 미완성 값, 날짜 순서, 시간대/오프셋, 두 입력의 이름·오류. `Field`의 단일 ID 계약 주의 | gpt-6-astra · high |
| D | 공개 두 컴포넌트·반응형 패널 — `packages/react/src/date-picker/picker/` | B·C | 즉시/적용/취소, 프리셋, Popover↔Sheet, 포커스·폼. Sheet 크기와 overlay 스택 주의 | gpt-6-sol · high |
| E | Storybook 예제 — `apps/storybook/src/DatePicker.stories.tsx`, `DateRangePicker.stories.tsx` | D | 네 사용 방식, 프리셋·오류·비활성·라이트/다크 | gpt-6-sol · medium |
| F | 브라우저 기능·시각 검사 — `apps/visual-regression/tests/date-picker*.spec.ts` | D·E | 1280px·375px, 키보드·터치·리사이즈·포커스·DST; 모바일 viewport 명시 | gpt-6-sol · high |

**감독 통합:** `packages/react/src/index.ts`·`packages/react/package.json`·lockfile·changeset·문서 색인은 한 곳에서만 수정한다. A가 확정한 타입을 기준으로 서브패스 export를 붙이고, B/C 결과를 D에 통합한 뒤 전체 검증한다. 의존 그래프는 `Phase 0 → A → (B, C 병렬) → D → E → F`다. B와 C가 같은 CSS·barrel을 수정하지 않도록 각 소유 경로 안에 파일을 둔다.

## 검증 게이트

| 시점 | 실행·관찰 | 통과 기준 |
| --- | --- | --- |
| A 완료 | Vitest 순수 모델 + 타입 음성 사례 | 윤년·월 경계·범위 내부 불가일·DST gap/overlap·직렬화 왕복과 잘못 섞인 타입 실패 |
| B/C 완료 | 컴포넌트 상호작용 테스트(`user-event`) | 달력 roving focus, 범위 그리드, 직접 입력 임시 상태, 시간 변경과 오류 연결 |
| D 완료 | 브라우저 기능 테스트 | 네 사용 방식, 즉시/적용/취소, controlled 초기화, 프리셋과 폼 제출, 리사이즈 중 draft/포커스 보존 |
| E/F 완료 | `pnpm generate`, `pnpm build`, React test, `pnpm typecheck`, publint, `pnpm vr` | 전체 CI 무회귀, 375px 모바일과 데스크톱 라이트/다크 확인 |
| 릴리스 전 | Linux 시각 기준 생성·검토, 실제 모바일과 VoiceOver/TalkBack 청취 | 자동 검사에서 빠지는 발화·가상 키보드·터치 흐름 통과. 기준 생성 워크플로의 커밋·푸시는 별도 사용자 승인 후 실행 |

기능 데모 Storybook은 닫힌 상태로 시작한다(VR의 `*--state-matrix` 우선 선택 규칙). Playwright 기본 viewport가 1280×900이므로 모바일 검사에는 `page.setViewportSize`를 명시한다. 로컬 macOS에서 시각 기준을 갱신하지 않는다. 오류·취소·포커스 같은 비가시 동작은 스냅샷만으로 통과 판정하지 않는다.

## 합격 조건 대조

| 스펙 조건 | 담당 작업 | 주요 증거 |
| --- | --- | --- |
| 값 종류·타입 안전성 | A·감독 | 타입 음성 사례, publint |
| 네 모드와 두 화면에서 선택·입력·지우기 | B·C·D·F | 브라우저 시나리오 |
| 즉시 확정과 적용·취소 | D·F | 변경 이벤트 횟수·값 보존 테스트 |
| 앱 제공 프리셋과 시간대 보존 | A·D·F | 자정·DST·직렬화 테스트 |
| 모든 날짜·시간 제약 | A·B·C | 순수 모델 및 UI 오류 테스트 |
| 키보드·터치·포커스·접근 가능한 이름 | B·C·D·F | 자동 a11y + 실제 청취 |
| Storybook·빌드·전체 회귀 | E·F·감독 | CI 로그와 Linux 시각 기준 |

## 실행·릴리스 경계

사용자가 2026-09-27 Phase 0부터 구현 시작을 승인했다. Phase 0 결과가 공개 API나 스펙을 바꾸어야 한다면 수정안을 먼저 보여주고 다시 결정받는다. 계약이 유지되면 위 배정대로 A~F를 진행한다. dg-design의 `AGENTS.md`에 따라 커밋·푸시는 변경 요약을 보여주고 별도 승인받은 뒤 실행한다. PR·Version Packages PR 병합도 별도 요청 전에는 진행하지 않는다.
