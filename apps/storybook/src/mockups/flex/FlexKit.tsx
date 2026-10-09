import "./flex-kit.css";
import "./overrides/forms.css";
import "./overrides/navigation.css";
import "./overrides/surfaces.css";
import "./overrides/data-feedback.css";
import "./proto/proto.css";

import * as React from "react";
import type { StoryContext } from "@storybook/react-vite";

import { patchPseudoStates } from "../MockupKit";
import { ROLES, resolve, type Density, type Role, type RoleId, type Variant } from "./profiles";

export interface Flex {
  variant: Variant;
  density: Density;
}

const VARIANTS: readonly Variant[] = ["current", "a", "b"];

export const VARIANT_LABEL: Record<Variant, string> = {
  current: "현재 DDS 0.17.3",
  a: "A · 앞선 적용안",
  b: "B · 원문 우선 재검토",
};

/** 스토리 컨텍스트의 globals에서 안과 밀도를 읽는다. */
export function flexOf(ctx: Pick<StoryContext, "globals">): Flex {
  const variant = VARIANTS.includes(ctx.globals.flex as Variant) ? (ctx.globals.flex as Variant) : "current";
  const density: Density = ctx.globals.density === "mobile" ? "mobile" : "desktop";
  return { variant, density };
}

/** 한 안의 시안 페이지. 상단 라벨이 어떤 안인지 밝힌다. */
export function FlexPage({ v, title, summary, children }: {
  v: Flex;
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
    <div className="fx-page" data-fx-variant={v.variant}>
      <header className="fx-head">
        <p className="fx-eyebrow" data-variant={v.variant}>
          {VARIANT_LABEL[v.variant]} · {v.density === "mobile" ? "모바일" : "데스크톱"}
        </p>
        <h1 className="fx-title">{title}</h1>
        <p className="fx-summary">{summary}</p>
      </header>
      {children}
    </div>
  );
}

export function FlexSection({ title, note, columns = 1, children }: {
  title: string;
  note?: React.ReactNode;
  columns?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="fx-section">
      <div className="fx-section-head">
        <h2 className="fx-section-title">{title}</h2>
        {note && <p className="fx-note">{note}</p>}
      </div>
      <div className="fx-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{children}</div>
    </section>
  );
}

/**
 * 상태 하나. force를 주면 칸 안의 dds 요소가 hover·focus·pressed로 그려진다 — 한 칸에 대상 하나만 둔다.
 * block은 자식을 가로 나열하지 않고 그대로 쌓는다(폼·목록처럼 폭을 다 쓰는 표본).
 */
export function FlexState({ label, children, force, block, span = 1 }: {
  label: string;
  children: React.ReactNode;
  force?: "hover" | "focus" | "pressed";
  block?: boolean;
  span?: number;
}) {
  return (
    <div className={force ? `fx-state mk-${force}` : "fx-state"} style={{ gridColumn: `span ${span}` }}>
      <span className="fx-state-label">{label}</span>
      <div className="fx-state-body" data-block={block ? "" : undefined}>{children}</div>
    </div>
  );
}

/** 열린 오버레이가 들어갈 세로 공간. 포털 내용은 iframe 높이 계산에 안 잡혀서 자리를 미리 비운다. */
export function FlexReserve({ height }: { height: number }) {
  return <div className="fx-reserve" style={{ height }} aria-hidden />;
}

/** 이 안의 치수표. profiles.ts가 정본이라 문서·이미지 프롬프트와 같은 값이 찍힌다. */
export function FlexSpec({ v, roles, extra = [] }: {
  v: Flex;
  roles: readonly RoleId[];
  /** 역할 토큰이 아닌 값(색 역할 등). [부위, 값, 근거] */
  extra?: readonly (readonly [string, string, string])[];
}) {
  return (
    <section className="fx-section">
      <div className="fx-section-head"><h2 className="fx-section-title">치수</h2></div>
      <table className="fx-spec">
        <thead><tr><th scope="col">역할</th><th scope="col">값</th><th scope="col">근거</th></tr></thead>
        <tbody>
          {roles.map((id) => {
            const role = ROLES[id] as Role;
            const value = resolve(role, v.variant, v.density);
            const basis = v.variant === "current" ? role.currentNote ?? "DDS 선언값" : value.basis;
            return (
              <tr key={id}>
                <th scope="row">{role.label}</th>
                <td data-grade={v.variant === "current" ? undefined : value.grade}>{value.px === null ? "—" : `${value.px}px`}</td>
                <td className="fx-basis">{basis}</td>
              </tr>
            );
          })}
          {extra.map(([part, value, basis]) => (
            <tr key={part}><th scope="row">{part}</th><td>{value}</td><td className="fx-basis">{basis}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** 같은 Specimen 스토리를 current·A·B globals로 띄운 iframe 세 개. 포털 오버레이도 각 문서 안에서 열린다. */
export function FlexCompare({ ctx, minHeight = 480 }: {
  ctx: Pick<StoryContext, "globals" | "id" | "title">;
  minHeight?: number;
}) {
  const { density } = flexOf(ctx);
  const theme = ctx.globals.theme === "dark" ? "dark" : "light";
  const brand = typeof ctx.globals.brand === "string" ? ctx.globals.brand : "auto";
  const target = ctx.id.replace(/--compare$/, "--specimen");
  const mobile = density === "mobile";
  return (
    <div className="fx-compare">
      <div className="fx-compare-head">
        <strong>{ctx.title.split("/").pop()}</strong>
        <span>{mobile ? "모바일 390px" : "데스크톱"} · {theme === "dark" ? "다크" : "라이트"} · 브랜드 {brand}</span>
        <span>툴바의 Theme·Density·Brand를 바꾸면 세 열이 함께 바뀝니다.</span>
      </div>
      <div className="fx-compare-cols" style={{ gridTemplateColumns: mobile ? "repeat(3, 392px)" : "repeat(3, minmax(0, 1fr))" }}>
        {VARIANTS.map((variant) => (
          <div className="fx-compare-col" key={variant}>
            <b>{VARIANT_LABEL[variant]}</b>
            <AutoFrame
              title={`${ctx.title} — ${VARIANT_LABEL[variant]}`}
              src={`iframe.html?id=${encodeURIComponent(target)}&viewMode=story&globals=${[
                `flex:${variant}`, `density:${density}`, `theme:${theme}`, `brand:${brand}`,
              ].join(";")}`}
              minHeight={minHeight}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AutoFrame({ src, title, minHeight }: { src: string; title: string; minHeight: number }) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = React.useState(minHeight);
  React.useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const attach = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      const measure = () => setHeight(Math.max(minHeight, doc.body.scrollHeight));
      observer?.disconnect();
      observer = new ResizeObserver(measure);
      observer.observe(doc.body);
      measure();
    };
    frame.addEventListener("load", attach);
    return () => {
      frame.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, [src, minHeight]);
  return <iframe ref={ref} className="fx-compare-frame" title={title} src={src} style={{ height }} />;
}
