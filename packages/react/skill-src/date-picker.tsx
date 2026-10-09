/**
 * @title DatePicker
 * @summary 날짜(또는 날짜+시간) 하나를 입력·선택하는 필드. 기간은 DateRangePicker.
 *
 * ## 언제 쓰나
 *
 * - 마감일, 예약일처럼 날짜 하나. 시각이 필요하면 `kind="local-date-time"`, 시간대가 있으면 `"zoned-date-time"`.
 * - 시작~종료 기간은 `DateRangePicker`(같은 subpath).
 * - 오늘·내일 같은 빠른 선택은 `presets`.
 *
 * ## 쓰지 말 때
 *
 * - 목록에서 고르는 값은 `Select`.
 * - 자체 `label`을 가지므로 `Field.Root`로 감싸지 않는다.
 *
 * ## 핵심 API
 *
 * 값은 `@internationalized/date` 객체다. 소비 앱이 값을 만들려면 그 패키지를 직접 설치한다(`pnpm add @internationalized/date`, `@dg-design/react`가 쓰는 3.x와 맞춘다).
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `kind` | `date` · `local-date-time` · `zoned-date-time` (필수) | 값 타입이 정해진다. `zoned-date-time`은 `timeZone` 필수 |
 * | `value`·`defaultValue`·`onValueChange` | `@internationalized/date` 객체 또는 `null` | `CalendarDate` 등. controlled/uncontrolled 중 하나만 |
 * | `label`·`description`·`locale`·`name` | | `name`을 주면 폼 제출에 실린다 |
 * | `minValue`·`maxValue`·`isDateUnavailable`·`required` | | 제약. 위반 시 열린 패널 안에 안내 문구가 표시된다 |
 * | `presets` | `{ id, label, getValue }[]` | 빠른 선택 버튼 |
 * | `errorMessages` | 오류 코드별 문구 | 기본 문구를 앱 말투로 바꿀 때 |
 * | `DateRangePicker` | `startName`·`endName`·`startLabel`·`endLabel` | 값은 `{ start, end }` |
 *
 * ## 접근성
 *
 * - 닫힌 상태는 값 요약 버튼이다. 누르면 `dialog`(좁은 화면은 하단 Sheet)가 열리고, 그 안에서 직접 타이핑하거나 달력으로 고른다. 키보드만으로 달력 이동이 가능하다.
 * - `label`을 항상 준다. 없으면 기본 제목이 쓰이지만 폼에서는 의미 있는 라벨이 필요하다.
 * - 형식 오류·범위 위반은 컴포넌트가 오류 문구로 알린다. 날짜 값은 `@internationalized/date`로 만든다.
 */
import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { DatePicker, DateRangePicker } from "@dg-design/react/date-picker";
import * as React from "react";

/** 날짜 하나 — controlled, 범위 제한과 빠른 선택 */
export function SingleDate() {
  const [due, setDue] = React.useState<CalendarDate | null>(new CalendarDate(2026, 10, 9));
  return (
    <DatePicker
      kind="date"
      locale="ko-KR"
      label="마감일"
      description="오늘 이후만 고를 수 있습니다."
      name="due"
      value={due}
      onValueChange={setDue}
      minValue={new CalendarDate(2026, 10, 9)}
      presets={[{ id: "week", label: "일주일 뒤", getValue: () => new CalendarDate(2026, 10, 16) }]}
    />
  );
}

/** 날짜 + 시간, 필수 입력 */
export function DateAndTime() {
  return (
    <DatePicker
      kind="local-date-time"
      locale="ko-KR"
      label="회의 시작"
      name="meeting"
      required
      defaultValue={new CalendarDateTime(2026, 10, 12, 10, 30)}
    />
  );
}

/** 기간 — 시작~종료 */
export function Range() {
  return (
    <DateRangePicker
      kind="date"
      locale="ko-KR"
      label="조회 기간"
      startName="from"
      endName="to"
      defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 31) }}
    />
  );
}
