/**
 * @title Switch
 * @summary 누르는 즉시 적용되는 켜기/끄기 설정 스위치.
 *
 * ## 언제 쓰나
 *
 * - 알림 받기, 다크 모드처럼 바로 효과가 나는 설정.
 * - 설정 목록에서 라벨과 한 줄로 배치.
 *
 * ## 쓰지 말 때
 *
 * - 폼 제출 때 반영되는 예/아니오(약관 동의 등)는 `Checkbox`.
 * - 여러 선택지 중 하나는 `RadioGroup`.
 * - 일회성 행동은 `Button`.
 *
 * ## 핵심 API
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `children` | ReactNode | 라벨 |
 * | `size` | `small` · `medium`(기본) · `large` | `small`(28×16)은 Button `xsmall` 줄, `large`는 모바일 |
 * | `labelPlacement` | `end`(기본) · `start` | 라벨 위치. 설정 행은 `start`로 오른쪽 정렬 |
 * | `checked`·`defaultChecked`·`onChange`·`name`·`disabled` | input 표준 | controlled/uncontrolled 모두 가능 |
 *
 * ## 접근성
 *
 * - 네이티브 checkbox에 `role="switch"`가 붙는다. 켜짐 상태는 `checked`로 전달된다.
 * - 라벨은 `children`으로 준다. 없으면 `aria-label`.
 * - `Field.Root` 안에서는 설명·오류가 `aria-describedby`로 자동 연결된다.
 */
import { Field } from "@dg-design/react/field";
import { Switch } from "@dg-design/react/switch";
import * as React from "react";

/** controlled — 즉시 적용 설정 */
export function Controlled() {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)}>
      알림 받기
    </Switch>
  );
}

/** 설정 행 — 라벨을 앞에, 설명은 Field로 */
export function SettingRow() {
  return (
    <Field.Root>
      <Switch name="autosave" labelPlacement="start" defaultChecked>
        자동 저장
      </Switch>
      <Field.Description>편집 내용을 30초마다 저장합니다.</Field.Description>
    </Field.Root>
  );
}

/** 모바일 크기와 비활성 */
export function LargeAndDisabled() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-space-field-gap)" }}>
      <Switch size="large">위치 정보 사용</Switch>
      <Switch disabled>관리자만 변경 가능</Switch>
    </div>
  );
}
