import type * as React from "react";

/**
 * 새 종류(P4) 상태 매트릭스용 틀 — 같은 내용을 데스크톱과 모바일 밀도 열에 나란히 그린다.
 * 밀도는 원래 루트 지정이지만 정적 렌더는 변수 상속만 쓰므로 열 단위 속성으로 충분하다(포털은 열지 않는다).
 */
export function DensityColumns({ children }: { children: () => React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, padding: 24, alignItems: "flex-start" }}>
      <section style={{ width: 560 }}>
        <h2 style={{ font: "600 14px sans-serif", margin: "0 0 12px" }}>데스크톱</h2>
        {children()}
      </section>
      <section data-dds-density="mobile" style={{ width: 390 }}>
        <h2 style={{ font: "600 14px sans-serif", margin: "0 0 12px" }}>모바일</h2>
        {children()}
      </section>
    </div>
  );
}

export function Caption({ children }: { children: React.ReactNode }) {
  return <h3 style={{ font: "500 12px sans-serif", margin: "16px 0 8px", color: "var(--dds-color-fg-neutral-weak)" }}>{children}</h3>;
}
