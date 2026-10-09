/**
 * @title Skeleton
 * @summary 콘텐츠가 올 자리를 회색 블록으로 미리 잡아 두는 로딩 자리표시자.
 *
 * ## 언제 쓰나
 *
 * - 불러올 콘텐츠의 모양(목록 행, 카드, 프로필)을 알고 있어서 같은 크기로 자리를 잡을 때.
 * - 레이아웃이 흔들리지 않게 하고 싶을 때.
 *
 * ## 쓰지 말 때
 *
 * - 결과 모양을 모르는 짧은 대기 — `Spinner`.
 * - 진행률을 숫자로 알 때(업로드 등) — `Progress`.
 * - 영역 전체의 로딩 안내 문구가 필요하면 `StatePanel.Loading`.
 *
 * ## 핵심 API
 *
 * | prop | 값 | 메모 |
 * | --- | --- | --- |
 * | `radius` | `none` · `small` · `medium`(기본) · `full` | 아바타 자리는 `full` |
 *
 * 크기는 `style`(width·height)로 직접 준다. 기본은 `aria-hidden`.
 *
 * ## 접근성
 *
 * - Skeleton은 `aria-hidden`이라 로딩을 알리지 못한다. 감싸는 영역에 `aria-busy="true"`를 주고, 필요하면 보이지 않는 안내 문구를 둔다.
 * - 로딩이 끝나면 `aria-busy`를 해제하고 Skeleton을 실제 내용으로 교체한다.
 */
import { Skeleton } from "@dg-design/react/skeleton";

/** 목록 행 자리표시자 */
export function ListRows({ count = 3 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x3)" }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x3)" }}>
          <Skeleton radius="full" style={{ width: 40, height: 40 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x1)" }}>
            <Skeleton style={{ width: "60%", height: 14 }} />
            <Skeleton style={{ width: "40%", height: 12 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 카드 자리표시자 */
export function CardPlaceholder() {
  return (
    <div aria-busy="true" style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x2)" }}>
      <Skeleton style={{ width: "100%", height: 120 }} />
      <Skeleton style={{ width: "70%", height: 16 }} />
    </div>
  );
}
