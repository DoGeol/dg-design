<!-- 생성 파일 — packages/react/skill-src/filter-toolbox.tsx에서 만든다. 직접 고치지 않는다. -->

# FilterToolbox

적용된 필터 칩·결과 수·초기화를 한 줄에 놓는 필터 묶음의 껍데기.

## 언제 쓰나

- 목록·표 위에서 필터를 여러 개 걸고 결과 수와 초기화 행동을 함께 보여 줄 때.
- 고정 필터는 값만 바꾸는 `Select.Trigger variant="chip"`, 사용자가 추가한 필터는 제거 가능한 `Chip`.

## 쓰지 말 때

- 필터가 하나뿐이면 `Select`나 `FilterChip` 하나로 충분하다.
- 검색어 입력은 `TextField`. 복잡한 조건식 편집 UI는 별도 화면.
- DataTable의 열 필터는 DataTable 자체가 가진다.

## 핵심 API

| 부품 | 메모 |
| --- | --- |
| `FilterToolbox.Root` | `role="group"`. `aria-label` 또는 `aria-labelledby` 필수 |
| `FilterToolbox.Chips` | 칩 영역(줄바꿈) |
| `FilterToolbox.Count` | 결과 수. `role="status"`라 바뀔 때 읽힌다 |
| `FilterToolbox.Actions` | 오른쪽 행동(초기화 등) |

문구("12건")와 초기화 로직은 앱이 가진다 — 컴포넌트는 배치만 맡는다.

## 접근성

- 묶음 이름은 필수다. 칩만 늘어서면 무엇을 거르는지 읽히지 않는다.
- 결과 수는 `Count`에 넣어 스크린 리더가 변경을 알게 한다. 별도 `aria-live`는 얹지 않는다.
- 칩 제거 버튼의 `removeLabel`에는 대상 이름을 넣는다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import { Chip, FilterChip } from "@dg-design/react/chip";
import { FilterToolbox } from "@dg-design/react/filter-toolbox";
import { Select } from "@dg-design/react/select";
import * as React from "react";

/** 고정 필터(Select chip) + 추가한 필터(Chip) + 결과 수 + 초기화 */
export function ListFilters() {
  const [status, setStatus] = React.useState("all");
  const [tags, setTags] = React.useState(["접근성"]);
  const active = status !== "all" || tags.length > 0;
  return (
    <FilterToolbox.Root aria-label="문서 필터">
      <FilterToolbox.Chips>
        <Select.Root value={status} onValueChange={setStatus}>
          <Select.Trigger variant="chip" active={status !== "all"} aria-label="상태" />
          <Select.Content>
            <Select.Option value="all">전체 상태</Select.Option>
            <Select.Option value="open">진행 중</Select.Option>
            <Select.Option value="done">완료</Select.Option>
          </Select.Content>
        </Select.Root>
        {tags.map((tag) => (
          <Chip key={tag} onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))} removeLabel={`${tag} 태그 제거`}>
            {tag}
          </Chip>
        ))}
      </FilterToolbox.Chips>
      <FilterToolbox.Count>12건</FilterToolbox.Count>
      <FilterToolbox.Actions>
        <Button
          intent="neutral"
          variant="ghost"
          size="small"
          disabled={!active}
          onClick={() => {
            setStatus("all");
            setTags([]);
          }}
        >
          초기화
        </Button>
      </FilterToolbox.Actions>
    </FilterToolbox.Root>
  );
}

/** 토글 필터만 있는 단순 구성 */
export function ToggleFilters() {
  return (
    <FilterToolbox.Root aria-label="보기 옵션">
      <FilterToolbox.Chips>
        <FilterChip>내가 만든 것</FilterChip>
        <FilterChip defaultPressed>보관 제외</FilterChip>
      </FilterToolbox.Chips>
      <FilterToolbox.Count>8건</FilterToolbox.Count>
    </FilterToolbox.Root>
  );
}
```
