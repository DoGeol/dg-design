/**
 * @title ToggleGroup
 * @summary 편집 화면이나 도구 모음에서 보기 옵션을 하나 또는 여러 개 고르는 토글 묶음.
 *
 * ## 언제 쓰나
 *
 * - 화면 표시 방식, 미리보기 너비, 안내선/라벨 표시 등 도구 옵션을 제어할 때.
 * - 단일 선택(`type="single"`) 또는 복수 선택(`type="multiple"`) 묶음이 필요할 때.
 * - 폼 제출이나 패널 생명주기 소유 없이, 순수 선택 상태 공유와 키보드 묶음이 목적일 때.
 *
 * ## 쓰지 말 때 (Tabs / RadioGroup과의 구분)
 *
 * | 목적 | 사용할 컴포넌트 | 이유 |
 * | --- | --- | --- |
 * | 하나의 패널만 표시하며 tab ↔ tabpanel을 연결 | `Tabs` | Content의 id·hidden·포커스 계약 필요 |
 * | 폼의 배타적 값 선택·제출·필수값 | `RadioGroup` | 폼 name·validation 및 단순 배타 선택 |
 * | 화면 도구의 선택 상태·여러 보기 옵션 | `ToggleGroup` | 패널/폼 없이 상태 공유와 키보드 묶음 제공 |
 * | 독립 토글 버튼 하나 | `Button` (aria-pressed) 또는 `Chip` | 불필요한 그룹을 만들지 않음 |
 *
 * ## 접근성 및 키보드 조작
 *
 * - `type="single"`: Root는 `role="radiogroup"`, 각 Item은 `role="radio"`와 `aria-checked`를 갖습니다.
 * - `type="multiple"`: Root는 `role="toolbar"` (상위 toolbar 안에서는 `role="group"`), 각 Item은 `aria-pressed`를 갖습니다.
 * - **키보드 탐색**: 방향키(`ArrowLeft`/`ArrowRight` 또는 `ArrowUp`/`ArrowDown`)로 초점만 이동하며, `Space` 또는 `Enter`를 눌러 선택/해제합니다 (방향키만으로 자동 선택되지 않음).
 * - **Home / End**: 첫 번째 및 마지막 활성 Item으로 즉시 초점을 이동합니다.
 * - **접근 이름**: `aria-label` 또는 `aria-labelledby`가 필수입니다.
 * - **시각 피드백**: 선택된 항목은 체크 마크와 함께 브랜드 배경색이 적용되며, 마크 공간이 미리 확보되어 선택 전후 버튼 폭이 변하지 않습니다.
 */
import { ToggleGroup } from "@dg-design/react/toggle-group";
import * as React from "react";

/** 단일 보기 폭 선택 (uncontrolled) */
export function SingleViewWidthExample() {
  return (
    <ToggleGroup.Root type="single" defaultValue="wide" aria-label="미리보기 너비">
      <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
      <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
      <ToggleGroup.Item value="full">전체화면</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

/** 복수 표시 옵션 선택 (uncontrolled) */
export function MultipleOptionsExample() {
  return (
    <ToggleGroup.Root type="multiple" defaultValue={["guides"]} aria-label="표시 옵션">
      <ToggleGroup.Item value="guides">안내선</ToggleGroup.Item>
      <ToggleGroup.Item value="labels">이름표</ToggleGroup.Item>
      <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

/** 제어형 단일 선택 (controlled) */
export function ControlledSingleExample() {
  const [value, setValue] = React.useState<string | null>("medium");

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={setValue}
      aria-label="크기 선택"
    >
      <ToggleGroup.Item value="small">작게</ToggleGroup.Item>
      <ToggleGroup.Item value="medium">중간</ToggleGroup.Item>
      <ToggleGroup.Item value="large">크게</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
