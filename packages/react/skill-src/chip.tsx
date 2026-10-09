/**
 * @title Chip
 * @summary 사용자가 고른 값을 보여 주는 Chip(제거 가능)과 켜고 끄는 필터 FilterChip.
 *
 * ## 언제 쓰나
 *
 * - `Chip`: 사용자가 추가한 값(선택한 담당자, 적용한 필터 조건)을 보여 주고 제거하게 할 때.
 * - `FilterChip`: 목록 위에서 조건을 켜고 끄는 토글(`aria-pressed`).
 *
 * ## 쓰지 말 때
 *
 * - 읽기 전용 상태 표시는 `Badge`.
 * - 값 목록에서 하나를 고르는 필터는 `Select.Trigger variant="chip"`.
 * - 화면 전환 탭은 `Tabs`, 단일 선택 세그먼트는 `RadioGroup`.
 * - 칩 안에 제거 버튼을 가진 필터 토글을 만들지 않는다 — FilterChip은 제거 버튼을 품지 않는다(button 안 button 금지).
 *
 * ## 핵심 API
 *
 * | 컴포넌트 | prop | 메모 |
 * | --- | --- | --- |
 * | `Chip` | `children`(필수) · `leading` · `disabled` | 칩 자체는 초점을 받지 않는다 |
 * | `Chip` | `onRemove` + `removeLabel` | 둘은 함께만 쓴다. `removeLabel`이 제거 버튼의 접근 이름("김하나 제거") |
 * | `FilterChip` | `pressed` · `defaultPressed` · `onPressedChange` | 켜짐은 색 + 체크 아이콘. 나머지는 button 속성 |
 *
 * ## 접근성
 *
 * - `removeLabel`에는 대상 이름을 넣는다. 제거하면 같은 부모의 다음(없으면 이전) 칩 제거 버튼으로 초점이 옮겨 간다 — 둘 다 없으면 직접 초점을 옮긴다.
 * - `FilterChip`은 `aria-pressed`로 상태를 알린다. 라벨 텍스트를 바꾸지 말고 상태만 바꾼다.
 * - 칩 묶음에는 `FilterToolbox`나 `role="group"` + 이름을 준다.
 */
import { Chip, FilterChip } from "@dg-design/react/chip";
import * as React from "react";

/** 제거 가능한 Chip 목록 */
export function RemovableChips() {
  const [owners, setOwners] = React.useState(["김하나", "이둘", "박셋"]);
  return (
    <div role="group" aria-label="선택한 담당자" style={{ display: "flex", gap: "var(--dds-dimension-x2)", flexWrap: "wrap" }}>
      {owners.map((name) => (
        <Chip key={name} onRemove={() => setOwners((prev) => prev.filter((n) => n !== name))} removeLabel={`${name} 제거`}>
          {name}
        </Chip>
      ))}
    </div>
  );
}

/** 읽기 전용 Chip과 비활성 Chip */
export function PlainAndDisabled() {
  return (
    <div style={{ display: "flex", gap: "var(--dds-dimension-x2)" }}>
      <Chip>디자인</Chip>
      <Chip disabled onRemove={() => {}} removeLabel="접근성 제거">
        접근성
      </Chip>
    </div>
  );
}

/** 켜고 끄는 필터 */
export function FilterChips() {
  const [mine, setMine] = React.useState(false);
  return (
    <div role="group" aria-label="목록 필터" style={{ display: "flex", gap: "var(--dds-dimension-x2)" }}>
      <FilterChip pressed={mine} onPressedChange={setMine}>
        내가 만든 것
      </FilterChip>
      <FilterChip defaultPressed>최근 수정</FilterChip>
    </div>
  );
}
