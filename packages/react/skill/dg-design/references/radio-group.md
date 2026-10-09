<!-- 생성 파일 — packages/react/skill-src/radio-group.tsx에서 만든다. 직접 고치지 않는다. -->

# RadioGroup

서로 배타적인 소수의 선택지 중 하나를 고른다. 기본 점 모양과 segmented(탭 모양) 두 가지.

## 언제 쓰나

- 2~5개 선택지 중 하나이고 모두 화면에 보여도 될 때.
- 보기 방식 전환처럼 짧은 선택지는 `variant="segmented"`.
- 폼 제출 값은 `name`으로 실린다.

## 쓰지 말 때

- 선택지가 6개 이상이면 `Select`.
- 여러 개 선택은 `Checkbox` 또는 `MultiSelect`.
- 켜기/끄기 하나는 `Switch`.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `RadioGroup.Root` | `value`·`defaultValue`·`onValueChange`·`name`·`disabled` | `value`가 있으면 controlled |
| `RadioGroup.Root` | `orientation`(`vertical` 기본·`horizontal`)·`variant`(`default`·`segmented`)·`size`(`small`·`medium`·`large`)·`motion`(`auto`·`none`) | `size`는 segmented에만 적용. segmented는 항상 horizontal |
| `RadioGroup.Item` | `value`(필수)·`disabled`·`children` | children이 라벨 |

## 접근성

- Root가 `role="radiogroup"`이다. `Field.Root` 안에 두면 `Field.Label`이 그룹 이름이 된다. 밖이면 `aria-label`을 준다.
- 방향키로 항목 사이를 이동한다(네이티브 radio 동작).
- 항목마다 보이는 라벨(`children`)을 둔다.

## 예제

```tsx
import { Field } from "@dg-design/react/field";
import { RadioGroup } from "@dg-design/react/radio-group";
import * as React from "react";

/** Field 안의 기본 RadioGroup — uncontrolled */
export function WithField() {
  return (
    <Field.Root>
      <Field.Label>알림 주기</Field.Label>
      <RadioGroup.Root name="digest" defaultValue="daily">
        <RadioGroup.Item value="realtime">실시간</RadioGroup.Item>
        <RadioGroup.Item value="daily">하루 한 번</RadioGroup.Item>
        <RadioGroup.Item value="off" disabled>
          받지 않음
        </RadioGroup.Item>
      </RadioGroup.Root>
      <Field.Description>언제든 설정에서 바꿀 수 있습니다.</Field.Description>
    </Field.Root>
  );
}

/** segmented — 보기 방식 전환 (controlled) */
export function Segmented() {
  const [view, setView] = React.useState("list");
  return (
    <RadioGroup.Root
      aria-label="보기 방식"
      variant="segmented"
      orientation="horizontal"
      value={view}
      onValueChange={setView}
    >
      <RadioGroup.Item value="list">목록</RadioGroup.Item>
      <RadioGroup.Item value="grid">격자</RadioGroup.Item>
      <RadioGroup.Item value="board">보드</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

/** 오류 상태 — ErrorMessage를 그리면 켜진다 */
export function WithError({ missing = true }: { missing?: boolean }) {
  return (
    <Field.Root>
      <Field.Label>결제 방식</Field.Label>
      <RadioGroup.Root name="payment">
        <RadioGroup.Item value="card">카드</RadioGroup.Item>
        <RadioGroup.Item value="transfer">계좌이체</RadioGroup.Item>
      </RadioGroup.Root>
      {missing ? <Field.ErrorMessage>결제 방식을 선택해 주세요.</Field.ErrorMessage> : null}
    </Field.Root>
  );
}
```
