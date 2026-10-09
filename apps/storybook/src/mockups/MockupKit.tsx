import "./theme-a.generated.css";
import "./mockup-kit.css";

import * as React from "react";

const PSEUDO: Record<string, string> = {
  ":hover": ":is(.mk-hover, .mk-hover *)",
  ":focus-visible": ":is(.mk-focus, .mk-focus *)",
  ":active": ":is(.mk-pressed, .mk-pressed *)",
};
const PSEUDO_RE = /:hover|:focus-visible|:active/g;
const patched = new WeakSet<CSSStyleSheet>();

/**
 * 정적 시안에서 hover·focus·pressed를 보이려고 :hover 등을 쓰는 규칙을 복제해
 * 조상 클래스(.mk-hover 등)로도 걸리게 한다. 복제 규칙은 원래 규칙과 같은 @layer 안에 들어간다.
 */
export function patchPseudoStates() {
  const visit = (parent: CSSStyleSheet | CSSGroupingRule) => {
    const rules = Array.from(parent.cssRules);
    for (let i = rules.length - 1; i >= 0; i -= 1) {
      const rule = rules[i];
      if (rule instanceof CSSStyleRule && PSEUDO_RE.test(rule.selectorText)) {
        const selector = rule.selectorText.replace(PSEUDO_RE, (m) => PSEUDO[m] ?? m);
        parent.insertRule(`${selector} { ${rule.style.cssText} }`, i + 1);
      } else if (rule instanceof CSSGroupingRule) {
        visit(rule);
      }
      PSEUDO_RE.lastIndex = 0;
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    if (patched.has(sheet)) continue;
    try { visit(sheet); patched.add(sheet); } catch { /* 교차 출처 시트는 건너뛴다 */ }
  }
}

/** 시안 페이지 틀. data-mockup="a"가 있어야 블루 테마가 걸린다. */
export function MockupPage({ title, summary, children }: {
  title: string;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    patchPseudoStates();
    const id = window.setTimeout(patchPseudoStates, 300);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="mk-page" data-mockup="a">
      <header className="mk-head">
        <p className="mk-eyebrow">DDS 시안 A</p>
        <h1 className="mk-title">{title}</h1>
        <p className="mk-summary">{summary}</p>
      </header>
      {children}
    </div>
  );
}

/** 한 묶음(변형·크기·상태 등). columns로 칸 수를 고정한다. */
export function MockupSection({ title, note, columns = 3, children }: {
  title: string;
  note?: React.ReactNode;
  columns?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mk-section">
      <div className="mk-section-head">
        <h2 className="mk-section-title">{title}</h2>
        {note && <p className="mk-note">{note}</p>}
      </div>
      <div className="mk-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{children}</div>
    </section>
  );
}

/**
 * 상태 하나. label은 화면에 그대로 찍히는 상태 이름이다(예: "hover", "disabled").
 * force를 주면 칸 안의 모든 dds 요소가 그 상태로 그려진다 — 한 칸에 대상 요소 하나만 둔다.
 */
export function MockupState({ label, children, span = 1, minHeight, force }: {
  label: string;
  children: React.ReactNode;
  span?: number;
  minHeight?: number;
  force?: "hover" | "focus" | "pressed";
}) {
  return (
    <div className={force ? `mk-state mk-${force}` : "mk-state"} style={{ gridColumn: `span ${span}`, minHeight }}>
      <span className="mk-state-label">{label}</span>
      <div className="mk-state-body">{children}</div>
    </div>
  );
}

/** 개발 기준 치수표. value는 px·hex 실값, token은 대응 --dds-* 이름. */
export function MockupSpec({ rows }: { rows: readonly (readonly [part: string, value: string, token?: string])[] }) {
  return (
    <section className="mk-section">
      <div className="mk-section-head"><h2 className="mk-section-title">스펙</h2></div>
      <table className="mk-spec">
        <thead><tr><th scope="col">부위</th><th scope="col">값</th><th scope="col">토큰</th></tr></thead>
        <tbody>
          {rows.map(([part, value, token]) => (
            <tr key={part}><th scope="row">{part}</th><td>{value}</td><td><code>{token ?? "—"}</code></td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
