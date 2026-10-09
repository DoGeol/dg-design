/**
 * @title Field
 * @summary 입력 컨트롤에 라벨·설명·오류 메시지를 묶어 id와 aria 연결을 자동으로 해 주는 래퍼.
 *
 * ## 언제 쓰나
 *
 * - TextField, TextArea, Select, MultiSelect, Checkbox, Switch, Slider, RadioGroup, FileInput 등 폼 컨트롤 하나당 하나.
 * - 라벨과 도움말, 검증 오류를 함께 보여야 할 때.
 *
 * ## 쓰지 말 때
 *
 * - `DatePicker`는 자체 `label`·`description`을 가지므로 Field로 감싸지 않는다.
 * - 라벨이 필요 없는 툴바 컨트롤(칩 필터 등)은 `aria-label`만 준다.
 * - 오류를 화면 전체에 알릴 때는 `Alert`.
 *
 * ## 핵심 API
 *
 * | 부품 | 메모 |
 * | --- | --- |
 * | `Field.Root` | 컨트롤 id·라벨 id·describedby를 context로 전파. `invalid` prop은 없다 |
 * | `Field.Label` | 안의 컨트롤에 연결되는 `<label>` |
 * | `Field.Description` | 도움말. 렌더되면 컨트롤의 `aria-describedby`에 들어간다 |
 * | `Field.ErrorMessage` | **렌더하는 순간** 컨트롤이 `aria-invalid`가 되고 오류 스타일이 켜진다. 오류가 없으면 아예 렌더하지 않는다 |
 *
 * ## 접근성
 *
 * - 한 Field.Root에는 컨트롤 하나. 같은 id를 공유하므로 둘 이상 넣지 않는다.
 * - 실제로 렌더된 Description·ErrorMessage만 `aria-describedby`에 포함된다.
 * - 오류 문구는 "무엇이 잘못됐고 어떻게 고치는지"를 적는다. 색만으로 오류를 알리지 않는다.
 */
import { Field } from "@dg-design/react/field";
import { TextField } from "@dg-design/react/text-field";
import * as React from "react";

/** 라벨 + 설명 */
export function LabelAndDescription() {
  return (
    <Field.Root>
      <Field.Label>프로젝트 이름</Field.Label>
      <TextField name="project" />
      <Field.Description>팀원에게 보이는 이름입니다.</Field.Description>
    </Field.Root>
  );
}

/** 검증 후 오류 켜기 — ErrorMessage를 조건부로 렌더 */
export function WithValidation() {
  const [name, setName] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const error = touched && name.trim() === "" ? "이름을 입력해 주세요." : null;
  return (
    <Field.Root>
      <Field.Label>이름</Field.Label>
      <TextField value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} />
      {error ? <Field.ErrorMessage>{error}</Field.ErrorMessage> : null}
    </Field.Root>
  );
}

/** 여러 Field를 세로로 쌓기 — 간격은 토큰으로 */
export function FormLayout() {
  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "var(--dds-space-field-gap)" }}>
      <Field.Root>
        <Field.Label>이름</Field.Label>
        <TextField name="name" />
      </Field.Root>
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TextField type="email" name="email" />
      </Field.Root>
    </form>
  );
}
