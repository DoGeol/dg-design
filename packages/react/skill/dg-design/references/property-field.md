<!-- 생성 파일 — packages/react/skill-src/property-field.tsx에서 만든다. 직접 고치지 않는다. -->

# PropertyField

라벨은 왼쪽, 값을 고르는 트리거는 오른쪽에 두는 설정 행. 텍스트 입력이 아니라 선택창을 연다.

## 언제 쓰나

- 설정 화면·상세 패널의 "공개 범위 / 카테고리 / 발행 시각" 같은 속성 행.
- 값은 Select 목록, 또는 Popover·Sheet(달력 등)로 고른다.
- 모바일 밀도에서는 행들이 약한 중성 표면 하나에 쌓인다. 데스크톱은 표면과 행 테두리가 없다.

## 쓰지 말 때

- 값을 직접 타이핑하면 `Field` + `TextField`.
- 위쪽 라벨 + 전체 폭 컨트롤의 일반 폼은 `Field`.
- 켜고 끄기는 `Switch`.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `PropertyField.Group` | `aria-label` 또는 `aria-labelledby`(필수) | 행 묶음. `role="group"` |
| `PropertyField.Root` | `Field.Root`와 동일 | 한 행. Field context를 쓴다 |
| `PropertyField.Label` · `Description` · `ErrorMessage` | Field와 동일 | |
| `PropertyField.Trigger` | `placeholder` | Popover·Sheet용 트리거. `Popover.Trigger asChild`에 끼운다. children이 현재 값 |

Select를 값 선택창으로 쓸 때는 `Select.Root` + `Select.Trigger`를 `PropertyField.Root` 안에 그대로 둔다.

## 접근성

- `Group`의 이름은 필수다 — 한 표면 안의 행이 무엇의 설정인지 읽혀야 한다.
- `Trigger`의 접근 이름은 "라벨 + 현재 값"이고 라벨을 눌러도 열린다.
- 오류는 `PropertyField.ErrorMessage`로 — 렌더되면 invalid와 describedby가 자동 연결된다.
- Popover 내용에는 `aria-label`을 준다.

## 예제

```tsx
import { Popover } from "@dg-design/react/popover";
import { PropertyField } from "@dg-design/react/property-field";
import { Select } from "@dg-design/react/select";

/** Select로 값을 고르는 설정 묶음 */
export function SettingsGroup() {
  return (
    <PropertyField.Group aria-label="발행 설정">
      <PropertyField.Root>
        <PropertyField.Label>공개 범위</PropertyField.Label>
        <Select.Root defaultValue="link">
          <Select.Trigger />
          <Select.Content title="공개 범위">
            <Select.Option value="public">전체 공개</Select.Option>
            <Select.Option value="link">링크가 있는 사람</Select.Option>
            <Select.Option value="private">나만 보기</Select.Option>
          </Select.Content>
        </Select.Root>
      </PropertyField.Root>
      <PropertyField.Root>
        <PropertyField.Label>카테고리</PropertyField.Label>
        <Select.Root>
          <Select.Trigger placeholder="선택" />
          <Select.Content title="카테고리">
            <Select.Option value="guide">가이드</Select.Option>
            <Select.Option value="notice">공지</Select.Option>
          </Select.Content>
        </Select.Root>
      </PropertyField.Root>
    </PropertyField.Group>
  );
}

/** Popover로 값을 고르는 행 — 닫힌 채로 시작 */
export function PopoverValue() {
  return (
    <PropertyField.Group aria-label="일정">
      <PropertyField.Root>
        <PropertyField.Label>발행 시각</PropertyField.Label>
        <Popover.Root>
          <Popover.Trigger asChild>
            <PropertyField.Trigger placeholder="바로 발행">10월 9일 09:00</PropertyField.Trigger>
          </Popover.Trigger>
          <Popover.Content aria-label="발행 시각 고르기">달력이 들어갈 자리</Popover.Content>
        </Popover.Root>
      </PropertyField.Root>
    </PropertyField.Group>
  );
}

/** 설명과 오류 메시지 */
export function WithDescriptionAndError({ error = true }: { error?: boolean }) {
  return (
    <PropertyField.Group aria-label="분류 설정">
      <PropertyField.Root>
        <PropertyField.Label>카테고리</PropertyField.Label>
        <Select.Root>
          <Select.Trigger placeholder="선택" />
          <Select.Content>
            <Select.Option value="guide">가이드</Select.Option>
          </Select.Content>
        </Select.Root>
        <PropertyField.Description>목록 필터에 쓰입니다.</PropertyField.Description>
        {error ? <PropertyField.ErrorMessage>카테고리를 고르세요</PropertyField.ErrorMessage> : null}
      </PropertyField.Root>
    </PropertyField.Group>
  );
}
```
