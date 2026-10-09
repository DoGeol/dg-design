/**
 * @title Checkbox
 * @summary 여러 항목 중 해당하는 것을 각각 켜고 끄는 체크박스. 부분 선택(indeterminate)을 지원한다.
 *
 * ## 언제 쓰나
 *
 * - 약관 동의, 목록에서 여러 항목 선택처럼 서로 독립적인 예/아니오.
 * - 하위 항목이 일부만 선택된 "전체 선택"은 `indeterminate`.
 * - 폼에서 제출 시점에 반영되는 옵션.
 *
 * ## 쓰지 말 때
 *
 * - 누르는 즉시 설정이 적용되면 `Switch`.
 * - 여러 후보 중 정확히 하나는 `RadioGroup`.
 * - 값이 많은 다중 선택은 `MultiSelect`.
 *
 * ## 핵심 API
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `children` | ReactNode | 라벨. 라벨 클릭도 토글된다 |
 * | `size` | `medium`(기본) · `large` | `large`는 모바일 |
 * | `indeterminate` | boolean | 부분 선택 표시. `checked`와 별개 |
 * | `motion` | `auto`(기본) · `none` | 포인터 변경에서만 아이콘 전환. 대량 목록은 `none` |
 * | `checked`·`defaultChecked`·`onChange`·`name`·`value`·`disabled` | input 표준 | controlled/uncontrolled 모두 가능 |
 *
 * ## 접근성
 *
 * - 네이티브 `input[type=checkbox]`라 키보드(Space)와 스크린 리더가 그대로 동작한다.
 * - `Field.Root` 안에서는 `aria-describedby`·`aria-invalid`가 자동 연결된다. 라벨은 `children`으로 준다.
 * - `children` 없이 쓰면 `aria-label`을 준다.
 */
import { Checkbox } from "@dg-design/react/checkbox";
import { Field } from "@dg-design/react/field";
import * as React from "react";

/** 제출 시 읽는 uncontrolled 체크박스 */
export function Uncontrolled() {
  return <Checkbox name="newsletter">뉴스레터 받기</Checkbox>;
}

/** controlled + Field 안의 오류 상태 */
export function WithFieldError() {
  const [agreed, setAgreed] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <Field.Root>
      <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
        이용약관에 동의합니다
      </Checkbox>
      <Field.Description>서비스 이용을 위해 필요합니다.</Field.Description>
      {submitted && !agreed ? <Field.ErrorMessage>약관에 동의해 주세요.</Field.ErrorMessage> : null}
      <button type="button" onClick={() => setSubmitted(true)}>
        확인
      </button>
    </Field.Root>
  );
}

/** 전체 선택 — 일부만 선택되면 indeterminate */
export function SelectAll() {
  const items = ["문서 A", "문서 B", "문서 C"];
  const [selected, setSelected] = React.useState<string[]>(["문서 A"]);
  const all = selected.length === items.length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-space-field-gap)" }}>
      <Checkbox
        checked={all}
        indeterminate={!all && selected.length > 0}
        onChange={() => setSelected(all ? [] : items)}
      >
        전체 선택
      </Checkbox>
      {items.map((item) => (
        <Checkbox
          key={item}
          checked={selected.includes(item)}
          motion="none"
          onChange={(e) =>
            setSelected((prev) => (e.target.checked ? [...prev, item] : prev.filter((i) => i !== item)))
          }
        >
          {item}
        </Checkbox>
      ))}
    </div>
  );
}
