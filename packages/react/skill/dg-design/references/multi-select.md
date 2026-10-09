<!-- 생성 파일 — packages/react/skill-src/multi-select.tsx에서 만든다. 직접 고치지 않는다. -->

# MultiSelect

목록에서 여러 값을 고르는 드롭다운. 검색·새 항목 만들기·모바일 Sheet 표시를 지원한다.

## 언제 쓰나

- 태그, 담당자, 카테고리처럼 5개 이상 후보에서 여러 개 고를 때.
- 후보가 많으면 `search="trigger"`(칩 + 입력) 또는 `"content"`(패널 안 검색).
- 모바일 밀도 앱은 `presentation="auto"`로 하단 Sheet.

## 쓰지 말 때

- 하나만 고르면 `Select`.
- 후보가 4개 이하이고 다 보여도 되면 `Checkbox` 여러 개.
- 행동 고르기는 `DropdownMenu`.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `MultiSelect.Root` | `value`·`defaultValue`·`onValueChange`(`string[]`)·`name`·`presentation` | `name`을 주면 선택 수만큼 hidden input이 제출에 실린다 |
| `MultiSelect.Root` | `search`(`trigger`·`content`)·`filter`·`onCreate`·`createLabel` | `filter={null}`은 서버 검색. `onCreate`는 Promise로 새 옵션 `{ value, label }`을 돌려준다. 만들기 문구는 소비자가 쓴다 |
| `MultiSelect.Trigger` | `placeholder`·`formatCount`·`size`(`xsmall`·`medium` 기본·`large`) | 2개 이상 선택 요약 문구. `size`는 Select와 같다 |
| `MultiSelect.Content` | `title` | Sheet 표시일 때 제목 |
| `MultiSelect.Option` | `value`·`disabled`·`label`·`textValue` | `Select.Option`과 같은 규칙 |
| `MultiSelect.Group` · `MultiSelect.Label` | — | 묶음 |

## 접근성

- `Field.Root` 안에 두면 `Field.Label`이 트리거 이름이 된다. 밖이면 `aria-label`.
- `search="trigger"`에서 칩 제거 버튼 이름은 `formatRemoveLabel`로 앱 언어에 맞춘다.
- 키보드 동작은 컴포넌트가 처리한다. 열림 상태는 닫힌 채로 시작한다.

## 예제

```tsx
import { Field } from "@dg-design/react/field";
import { MultiSelect } from "@dg-design/react/multi-select";
import * as React from "react";

/** Field 안의 기본 MultiSelect — controlled */
export function WithField() {
  const [tags, setTags] = React.useState<string[]>(["design"]);
  return (
    <Field.Root>
      <Field.Label>태그</Field.Label>
      <MultiSelect.Root value={tags} onValueChange={setTags} name="tags">
        <MultiSelect.Trigger placeholder="태그 선택" />
        <MultiSelect.Content>
          <MultiSelect.Option value="design">디자인</MultiSelect.Option>
          <MultiSelect.Option value="dev">개발</MultiSelect.Option>
          <MultiSelect.Option value="ops">운영</MultiSelect.Option>
        </MultiSelect.Content>
      </MultiSelect.Root>
      {tags.length === 0 ? <Field.ErrorMessage>태그를 하나 이상 고르세요.</Field.ErrorMessage> : null}
    </Field.Root>
  );
}

/** 트리거 안 검색 + 새 항목 만들기 */
export function SearchAndCreate() {
  const [options, setOptions] = React.useState([
    { value: "alpha", label: "알파" },
    { value: "beta", label: "베타" },
  ]);
  return (
    <Field.Root>
      <Field.Label>라벨</Field.Label>
      <MultiSelect.Root
        search="trigger"
        searchProps={{ placeholder: "검색 또는 추가" }}
        onCreate={async (query) => {
          const created = { value: query, label: query };
          setOptions((prev) => [...prev, created]);
          return created;
        }}
        createLabel={(query) => `"${query}" 만들기`}
      >
        <MultiSelect.Trigger />
        <MultiSelect.Content>
          {options.map((o) => (
            <MultiSelect.Option key={o.value} value={o.value}>
              {o.label}
            </MultiSelect.Option>
          ))}
        </MultiSelect.Content>
      </MultiSelect.Root>
    </Field.Root>
  );
}

/** 모바일 밀도 앱 — 목록이 하단 Sheet로 열린다 */
export function MobileSheet() {
  return (
    <Field.Root>
      <Field.Label>공유 대상</Field.Label>
      <MultiSelect.Root presentation="auto" defaultValue={["team"]}>
        <MultiSelect.Trigger placeholder="선택하세요" />
        <MultiSelect.Content title="공유 대상">
          <MultiSelect.Option value="team">팀</MultiSelect.Option>
          <MultiSelect.Option value="org">조직 전체</MultiSelect.Option>
        </MultiSelect.Content>
      </MultiSelect.Root>
    </Field.Root>
  );
}
```
