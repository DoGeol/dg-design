/**
 * @title Select
 * @summary 목록에서 값 하나를 고르는 드롭다운(listbox). 여러 개는 MultiSelect.
 *
 * ## 언제 쓰나
 *
 * - 고를 값이 5~15개쯤이고 한 번에 하나만 고른다.
 * - 툴바 필터처럼 칩 모양 트리거가 필요하면 `Select.Trigger variant="chip"`.
 * - 모바일 밀도 앱은 `presentation="auto"`로 목록을 하단 Sheet로 연다.
 *
 * ## 쓰지 말 때
 *
 * - 2~4개 중 하나이고 모두 보여도 되면 `RadioGroup`.
 * - 여러 개 고르기는 `MultiSelect`.
 * - 행동(명령) 고르기는 `DropdownMenu` — Select는 값을 고른다.
 * - 날짜는 `DatePicker`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `Select.Root` | `value`·`defaultValue`·`onValueChange`·`name`·`disabled`·`presentation` | `presentation`: `popover`(기본)·`sheet`·`auto`(루트 `data-dds-density="mobile"`이면 Sheet) |
 * | `Select.Trigger` | `placeholder`·`size`(`xsmall`(28, 모바일 밀도에서는 `medium`)·`medium` 기본·`large`)·`variant`(`field` 기본·`chip`)·`active` | 선택 값의 표시 이름을 보여 준다 |
 * | `Select.Content` | `title` | `title`은 Sheet 표시일 때 보이는 제목 |
 * | `Select.Option` | `value`·`disabled`·`label`·`textValue` | `label`: 트리거에 보일 이름(children이 풍부할 때), `textValue`: 타이핑 검색용 |
 * | `Select.Group` · `Select.Label` | — | 옵션 묶음과 묶음 제목 |
 *
 * ## 접근성
 *
 * - `Field.Root` 안에 두면 `Field.Label`이 트리거 이름이 된다. Field 밖에서 쓰면 `Select.Trigger`에 `aria-label`을 준다.
 * - 옵션 children에 아이콘·설명이 섞이면 `label`(표시)과 `textValue`(타이핑 검색)를 준다.
 * - 키보드(화살표·Home·End·타이핑 검색·Escape)는 컴포넌트가 처리한다. 덮어쓰지 않는다.
 */
import { Field } from "@dg-design/react/field";
import { Select } from "@dg-design/react/select";
import * as React from "react";

/** Field 안의 기본 Select — 라벨·오류가 자동 연결된다 */
export function WithField() {
  const [value, setValue] = React.useState<string>();
  return (
    <Field.Root>
      <Field.Label>공개 범위</Field.Label>
      <Select.Root value={value} onValueChange={setValue} name="visibility">
        <Select.Trigger placeholder="선택하세요" />
        <Select.Content>
          <Select.Option value="private">나만 보기</Select.Option>
          <Select.Option value="team">팀 공개</Select.Option>
          <Select.Option value="public">전체 공개</Select.Option>
        </Select.Content>
      </Select.Root>
      {value === undefined ? null : <Field.Description>바꾸면 바로 적용됩니다.</Field.Description>}
    </Field.Root>
  );
}

/** 묶음과 비활성 옵션 */
export function Grouped() {
  return (
    <Select.Root defaultValue="kr">
      <Select.Trigger aria-label="지역" />
      <Select.Content>
        <Select.Group>
          <Select.Label>아시아</Select.Label>
          <Select.Option value="kr">대한민국</Select.Option>
          <Select.Option value="jp">일본</Select.Option>
        </Select.Group>
        <Select.Group>
          <Select.Label>유럽</Select.Label>
          <Select.Option value="de">독일</Select.Option>
          <Select.Option value="fr" disabled>
            프랑스(준비 중)
          </Select.Option>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

/** 툴바 필터 — 칩 트리거, 값이 걸리면 active */
export function ChipFilter() {
  const [status, setStatus] = React.useState("all");
  return (
    <Select.Root value={status} onValueChange={setStatus}>
      <Select.Trigger variant="chip" active={status !== "all"} aria-label="상태" />
      <Select.Content>
        <Select.Option value="all">전체 상태</Select.Option>
        <Select.Option value="open">진행 중</Select.Option>
        <Select.Option value="done">완료</Select.Option>
      </Select.Content>
    </Select.Root>
  );
}

/** 모바일 밀도 앱 — 목록이 하단 Sheet로 열린다 */
export function MobileSheet() {
  return (
    <Field.Root>
      <Field.Label>정렬</Field.Label>
      <Select.Root defaultValue="recent" presentation="auto">
        <Select.Trigger />
        <Select.Content title="정렬">
          <Select.Option value="recent">최근 수정</Select.Option>
          <Select.Option value="name">이름</Select.Option>
        </Select.Content>
      </Select.Root>
    </Field.Root>
  );
}
