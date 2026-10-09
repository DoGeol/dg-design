/**
 * @title Separator
 * @summary 내용을 나누는 얇은 구분선. 가로·세로.
 *
 * ## 언제 쓰나
 *
 * - 같은 화면 안에서 성격이 다른 묶음 사이를 시각적으로 나눌 때.
 * - 툴바·메타 정보의 항목 사이 세로선(`orientation="vertical"`).
 *
 * ## 쓰지 말 때
 *
 * - 간격만 필요하면 여백(`gap`, `margin`)으로 충분하다.
 * - 목록 행 사이 선은 `List`·`Table`이 이미 그린다.
 * - 독립된 덩어리 구분 — `Card`.
 *
 * ## 핵심 API
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `orientation` | `horizontal`(기본) · `vertical` | 세로선은 부모가 높이를 가져야 보인다 |
 * | `decorative` | boolean(기본 `true`) | `true`면 `aria-hidden`, `false`면 `role="separator"` |
 *
 * ## 접근성
 *
 * - 기본은 장식이라 스크린 리더에 노출되지 않는다.
 * - 의미 있는 구역 경계(스크린 리더 사용자도 알아야 하는 구분)일 때만 `decorative={false}`.
 */
import { Separator } from "@dg-design/react/separator";

/** 가로 구분선 */
export function Horizontal() {
  return (
    <div>
      <p>계정</p>
      <Separator style={{ margin: "var(--dds-dimension-x3) 0" }} />
      <p>알림</p>
    </div>
  );
}

/** 세로 구분선 — 부모에 높이를 준다. 의미 있는 경계라 decorative={false} */
export function Vertical() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x3)", height: 20 }}>
      <span>편집</span>
      <Separator orientation="vertical" decorative={false} />
      <span>공유</span>
    </div>
  );
}
