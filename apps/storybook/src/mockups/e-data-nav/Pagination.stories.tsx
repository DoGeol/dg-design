import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Pagination } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Pagination", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Slot = number | "gap";

/** 쪽 배열을 손으로 넘기는 소비자 조립 예. 이전·다음 비활성은 첫·마지막 쪽에서 켠다. */
function Pages({ current, total, slots }: { current: number; total: number; slots: Slot[] }) {
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item><Pagination.Previous href="#" disabled={current === 1} /></Pagination.Item>
        {slots.map((s, i) => (
          <Pagination.Item key={i}>
            {s === "gap" ? <Pagination.Ellipsis /> : <Pagination.Link href="#" isActive={s === current}>{s}</Pagination.Link>}
          </Pagination.Item>
        ))}
        <Pagination.Item><Pagination.Next href="#" disabled={current === total} /></Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

// ghost 쪽 번호의 hover 배경이 시안 칸의 회색과 섞이지 않게 실제 사용 표면(흰색) 위에 올린다.
function Surface({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "inline-flex", padding: 8, borderRadius: 8, background: "var(--dds-color-bg-layer-default)" }}>{children}</div>;
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Pagination" summary="현재 쪽은 brand solid, 나머지는 neutral ghost입니다. 처음과 마지막 쪽 번호는 항상 보이고, 사이가 멀면 생략 부호로 줄입니다.">
      <MockupSection title="위치별 구성" columns={1} note="전체 20쪽 기준입니다. 현재 쪽 앞뒤로 한 쪽씩 보입니다.">
        <MockupState label="처음 쪽 · 이전 비활성"><Surface><Pages current={1} total={20} slots={[1, 2, 3, 4, 5, "gap", 20]} /></Surface></MockupState>
        <MockupState label="가운데 쪽 · 양쪽 생략"><Surface><Pages current={10} total={20} slots={[1, "gap", 9, 10, 11, "gap", 20]} /></Surface></MockupState>
        <MockupState label="마지막 쪽 · 다음 비활성"><Surface><Pages current={20} total={20} slots={[1, "gap", 16, 17, 18, 19, 20]} /></Surface></MockupState>
        <MockupState label="7쪽 이하 · 생략 없음"><Surface><Pages current={3} total={5} slots={[1, 2, 3, 4, 5]} /></Surface></MockupState>
      </MockupSection>

      <MockupSection title="쪽 번호 상태" columns={6} note="medium(40px) 한 크기만 있습니다.">
        <MockupState label="default"><Surface><Pagination.Link href="#">7</Pagination.Link></Surface></MockupState>
        <MockupState label="hover" force="hover"><Surface><Pagination.Link href="#">7</Pagination.Link></Surface></MockupState>
        <MockupState label="pressed" force="pressed"><Surface><Pagination.Link href="#">7</Pagination.Link></Surface></MockupState>
        <MockupState label="focus" force="focus"><Surface><Pagination.Link href="#">7</Pagination.Link></Surface></MockupState>
        <MockupState label="current"><Surface><Pagination.Link href="#" isActive>7</Pagination.Link></Surface></MockupState>
        <MockupState label="current · hover" force="hover"><Surface><Pagination.Link href="#" isActive>7</Pagination.Link></Surface></MockupState>
      </MockupSection>

      <MockupSection title="이전 · 다음 · 생략" columns={6}>
        <MockupState label="이전 default"><Surface><Pagination.Previous href="#" /></Surface></MockupState>
        <MockupState label="이전 hover" force="hover"><Surface><Pagination.Previous href="#" /></Surface></MockupState>
        <MockupState label="이전 focus" force="focus"><Surface><Pagination.Previous href="#" /></Surface></MockupState>
        <MockupState label="이전 disabled"><Surface><Pagination.Previous href="#" disabled /></Surface></MockupState>
        <MockupState label="다음 default"><Surface><Pagination.Next href="#" /></Surface></MockupState>
        <MockupState label="생략 부호"><Surface><Pagination.Ellipsis /></Surface></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="목록 하단 · 건수 왼쪽, 쪽 이동 오른쪽">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "12px 16px", background: "var(--dds-color-bg-layer-default)", borderRadius: 12, boxSizing: "border-box" }}>
            <span style={{ fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>전체 1,284건 중 181–200번째</span>
            <Pages current={10} total={65} slots={[1, "gap", 9, 10, 11, "gap", 65]} />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["항목 크기", "높이 40px · 최소 폭 40px · 좌우 8px", "--dds-dimension-x10 / x2"],
        ["항목 간격", "4px", "--dds-dimension-x1"],
        ["radius", "8px", "--dds-radius-r2"],
        ["글자", "14px / 19px · bold", "--dds-font-size-t4 · --dds-font-weight-bold"],
        ["일반 쪽 글자 / hover / pressed", "#252629 · 배경 투명 / rgb(16 18 20 / 0.06) / rgb(16 18 20 / 0.12)", "--dds-color-fg-neutral · --dds-color-bg-transparent-hover / -pressed"],
        ["현재 쪽 배경 / hover / 글자", "#1550A9 / #0B397E / #FFFFFF", "--dds-color-bg-brand-solid(-hover) · --dds-color-fg-brand-contrast"],
        ["이전·다음 아이콘", "16px chevron · stroke 1.5", "currentColor"],
        ["disabled 글자", "#8A8C8F · 배경 없음", "--dds-color-fg-disabled"],
        ["생략 부호", "40×40 · #6D6F72", "--dds-dimension-x10 · --dds-color-fg-neutral-weak"],
        ["focus ring", "2px #1550A9 outline · offset 2px", "--dds-color-stroke-focus-ring"],
      ]} />
    </MockupPage>
  ),
};
