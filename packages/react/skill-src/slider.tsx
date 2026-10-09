/**
 * @title Slider
 * @summary 범위 안의 숫자 하나를 드래그로 고르는 슬라이더.
 *
 * ## 언제 쓰나
 *
 * - 볼륨, 밝기, 배율처럼 정확한 숫자보다 대략의 크기를 조절할 때.
 * - 값을 옆에 함께 보여 주면 더 좋다.
 *
 * ## 쓰지 말 때
 *
 * - 정확한 숫자를 입력해야 하면 `TextField type="number"`.
 * - 몇 개 안 되는 이산 선택지는 `RadioGroup variant="segmented"`.
 * - 진행률 표시는 `Progress`(입력이 아니다).
 *
 * ## 핵심 API
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `min`·`max`·`step` | number | 기본 0·100·1 |
 * | `value`·`defaultValue`·`onChange` | number | `onChange`의 `e.target.valueAsNumber`로 읽는다 |
 * | `size` | `small` · `medium`(기본) | |
 * | `name`·`disabled` | input 표준 | |
 *
 * ## 접근성
 *
 * - 네이티브 `input[type=range]`라 방향키·Home·End·PageUp/Down이 동작한다.
 * - 라벨이 필요하다 — `Field.Root` 안에서 `Field.Label`을 주거나 `aria-label`.
 * - 현재 값은 화면에 텍스트로도 보여 준다(`aria-valuetext`가 필요하면 직접 전달).
 */
import { Field } from "@dg-design/react/field";
import { Slider } from "@dg-design/react/slider";
import * as React from "react";

/** controlled + 값 표시 */
export function WithValue() {
  const [volume, setVolume] = React.useState(40);
  return (
    <Field.Root>
      <Field.Label>음량: {volume}</Field.Label>
      <Slider value={volume} onChange={(e) => setVolume(e.target.valueAsNumber)} />
    </Field.Root>
  );
}

/** uncontrolled — 범위와 단계 지정 */
export function StepRange() {
  return (
    <Field.Root>
      <Field.Label>확대 비율</Field.Label>
      <Slider name="zoom" min={50} max={200} step={10} defaultValue={100} />
      <Field.Description>50%에서 200%까지 10% 단위입니다.</Field.Description>
    </Field.Root>
  );
}

/** 작은 크기, 라벨은 aria-label */
export function SmallDisabled() {
  return <Slider size="small" aria-label="밝기" defaultValue={70} disabled />;
}
