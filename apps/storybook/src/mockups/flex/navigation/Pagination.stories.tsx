import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Pagination } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Navigation/Pagination", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak: React.CSSProperties = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" };

/** 쪽 배열을 펼친다. "…"는 생략. */
function Pages({ pages, current, first, last }: { pages: (number | "…")[]; current: number; first?: boolean; last?: boolean }) {
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item><Pagination.Previous href="#" disabled={first} /></Pagination.Item>
        {pages.map((p, i) => (
          <Pagination.Item key={i}>
            {p === "…" ? <Pagination.Ellipsis /> : <Pagination.Link href="#" isActive={p === current}>{p}</Pagination.Link>}
          </Pagination.Item>
        ))}
        <Pagination.Item><Pagination.Next href="#" disabled={last} /></Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

/** A 모바일 축약 — 이전 · 현재/전체 · 다음. */
function Compact({ current, total }: { current: number; total: number }) {
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item><Pagination.Previous href="#" /></Pagination.Item>
        <Pagination.Item><span className="fx-page-count" aria-current="page">{current} / {total}</span></Pagination.Item>
        <Pagination.Item><Pagination.Next href="#" /></Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

/** 상태 칸용 — 링크 하나. */
function One({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return <Pagination.Root><Pagination.List><Pagination.Item><Pagination.Link href="#" isActive={active}>{children}</Pagination.Link></Pagination.Item></Pagination.List></Pagination.Root>;
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isA = v.variant === "a";
  const isCurrent = v.variant === "current";
  const compact = isA && mobile;
  return (
    <FlexPage
      v={v}
      title="Pagination"
      summary={
        v.variant === "b"
          ? "크기·구성은 현재와 같습니다. 반경만 Button 역할(button-radius)을 따릅니다. 페이지 방식은 데이터에 따라 정하고 무한 스크롤로 일괄 바꾸지 않습니다."
          : isA
            ? "현재 페이지는 중성 표면 + 진한 숫자, 나머지는 ghost입니다. 모바일은 이전/현재·전체/다음으로 줄이고 44px 조작 영역을 씁니다."
            : "현재 DDS입니다. 현재 페이지는 brand solid, 나머지는 neutral ghost 버튼입니다."
      }
    >
      <FlexSection
        title="목록 아래"
        note={compact ? "결과 건수는 따로 적고 숫자는 줄이지 않습니다." : "결과 건수는 페이지 번호와 따로 둡니다."}
      >
        <FlexState label="240건 · 20쪽 중 5쪽" block>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={weak}>총 240건</p>
            {compact ? <Compact current={5} total={20} /> : <Pages pages={mobile ? [1, "…", 5, "…", 20] : [1, "…", 4, 5, 6, "…", 20]} current={5} />}
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={2} note="한 칸에 링크 하나입니다. 활성은 aria-current=page입니다.">
        <FlexState label="default"><One>4</One></FlexState>
        <FlexState label="hover" force="hover"><One>4</One></FlexState>
        <FlexState label="focus" force="focus"><One>4</One></FlexState>
        <FlexState label="pressed" force="pressed"><One>4</One></FlexState>
        <FlexState label="selected"><One active>5</One></FlexState>
        <FlexState label="selected · hover" force="hover"><One active>5</One></FlexState>
        <FlexState label="selected · focus" force="focus"><One active>5</One></FlexState>
        <FlexState label="disabled · 첫 쪽의 이전">
          <Pagination.Root><Pagination.List><Pagination.Item><Pagination.Previous href="#" disabled /></Pagination.Item></Pagination.List></Pagination.Root>
        </FlexState>
      </FlexSection>

      <FlexSection title="경계" note="첫·마지막 쪽에서 비활성 표시와 실제 차단이 같습니다. 네 자리 숫자도 폭이 늘 뿐 글자를 줄이지 않습니다.">
        <FlexState label="첫 쪽" block><Pages pages={[1, 2, 3, "…", 20]} current={1} first /></FlexState>
        <FlexState label="1000쪽 중 마지막" block>
          {compact ? <Compact current={1000} total={1000} /> : <Pages pages={mobile ? [1, "…", 999, 1000] : [1, "…", 998, 999, 1000]} current={1000} last />}
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["button-radius"]} extra={[
        ["링크 최소 폭 · 높이", compact ? "44 · 44px" : "40 · 40px", compact ? "C 터치 조작 영역 44 후보 — 미검증" : isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["간격", "4px", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["현재 페이지", isA ? "bg-neutral-weak + 1px stroke-neutral + fg-neutral bold" : "brand solid", isA ? "C 중성 강조 — 약한 표면 대비 1.07:1이라 경계 보완" : isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["모바일 구성", isA ? "이전 · 현재/전체 · 다음" : "번호 목록(생략 포함)", isA ? "C 공간 부족 시 축약" : isCurrent ? "앱 몫" : "D 데이터에 따라 결정"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
