<!-- 생성 파일 — packages/react/skill-src/progress.tsx에서 만든다. 직접 고치지 않는다. -->

# Progress

작업 진행률을 막대로 보여 주는 progressbar.

## 언제 쓰나

- 업로드·가져오기처럼 완료 비율을 측정할 수 있을 때(`value`).
- 총량은 모르지만 진행 중임을 막대 모양으로 보이고 싶을 때(`indeterminate`).

## 쓰지 말 때

- 콘텐츠 자리를 미리 잡는 로딩 — `Skeleton`.
- 짧고 막대가 필요 없는 대기 — `Spinner`.
- 슬라이더처럼 사용자가 값을 조절 — `Slider`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `value` | number(기본 0) | 0~`max`로 clamp. `indeterminate`면 무시 |
| `max` | number(기본 100) | |
| `indeterminate` | boolean | 진행률 모름. `aria-valuenow`를 비운다 |

`role`과 `aria-value*`는 컴포넌트가 정한다(prop으로 받지 않는다).

## 접근성

- 막대에는 텍스트가 없으니 `aria-label`이나 `aria-labelledby`로 무엇의 진행인지 알린다.
- 퍼센트를 보여 주려면 옆에 텍스트로 쓴다. 매 변화를 낭독하게 하지 않는다.

## 예제

```tsx
import { Progress } from "@dg-design/react/progress";

/** 측정 가능한 진행률 + 텍스트 */
export function Upload({ value = 40 }: { value?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x1)" }}>
      <span>report.pdf 올리는 중 ({value}%)</span>
      <Progress value={value} aria-label="report.pdf 업로드 진행률" />
    </div>
  );
}

/** 진행률을 모르는 작업 */
export function Indeterminate() {
  return <Progress indeterminate aria-label="가져오는 중" />;
}

/** 단위가 다른 max */
export function Steps() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x1)" }}>
      <span>3 / 5단계</span>
      <Progress value={3} max={5} aria-label="설정 단계" />
    </div>
  );
}
```
