import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Breadcrumb, Button } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Breadcrumb", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="8" r="1.25" /><circle cx="8" cy="8" r="1.25" /><circle cx="12.5" cy="8" r="1.25" />
    </svg>
  );
}

/** 경로 배열을 Item·Separator로 펼친다. 마지막 항목은 현재 페이지(span)다. */
function Trail({ path, separator }: { path: React.ReactNode[]; separator?: React.ReactNode }) {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {path.map((node, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Breadcrumb.Separator>{separator}</Breadcrumb.Separator>}
            <Breadcrumb.Item>
              {i === path.length - 1 ? <Breadcrumb.Page>{node}</Breadcrumb.Page> : typeof node === "string" ? <Breadcrumb.Link href="#">{node}</Breadcrumb.Link> : node}
            </Breadcrumb.Item>
          </React.Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

// 중간 생략은 소비자 몫이다. 링크 외관(색·hover·focus)을 그대로 쓰려고 Link asChild로 button을 감싼다.
const collapsed = (
  <Breadcrumb.Link asChild>
    <button type="button" aria-label="숨겨진 경로 3개 보기" style={{ display: "inline-flex", border: 0, padding: 0, background: "none", cursor: "pointer" }}>
      <MoreIcon />
    </button>
  </Breadcrumb.Link>
);

const one = (state: string, force?: "hover" | "focus") => (
  <MockupState label={state} force={force}>
    <Breadcrumb.Root><Breadcrumb.List><Breadcrumb.Item><Breadcrumb.Link href="#">주문 관리</Breadcrumb.Link></Breadcrumb.Item></Breadcrumb.List></Breadcrumb.Root>
  </MockupState>
);

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Breadcrumb" summary="현재 위치까지의 경로를 보여 줍니다. 상위 단계는 링크, 마지막 현재 페이지는 굵은 글자의 일반 텍스트입니다.">
      <MockupSection title="단계" columns={1} note="3~5단계까지는 모두 펼칩니다.">
        <MockupState label="3단계"><Trail path={["홈", "주문 관리", "주문 상세"]} /></MockupState>
        <MockupState label="4단계"><Trail path={["홈", "설정", "팀 관리", "멤버 초대"]} /></MockupState>
        <MockupState label="5단계"><Trail path={["홈", "상품", "전자기기", "키보드", "무선 키보드 K3"]} /></MockupState>
      </MockupSection>

      <MockupSection title="긴 경로 생략" columns={2} note="6단계 이상이면 처음과 마지막 두 단계만 남기고 가운데를 하나의 더보기 버튼으로 접습니다.">
        <MockupState label="7단계 접음 · 홈, 더보기, 키보드, 현재" span={2}><Trail path={["홈", collapsed, "키보드", "무선 키보드 K3 블루투스 5.1 저소음 적축"]} /></MockupState>
        <MockupState label="더보기 hover" force="hover"><Trail path={[collapsed, "무선 키보드 K3"]} /></MockupState>
        <MockupState label="더보기 focus" force="focus"><Trail path={[collapsed, "무선 키보드 K3"]} /></MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={4}>
        {one("link default")}
        {one("link hover", "hover")}
        {one("link focus", "focus")}
        <MockupState label="current page"><Breadcrumb.Root><Breadcrumb.List><Breadcrumb.Item><Breadcrumb.Page>주문 상세</Breadcrumb.Page></Breadcrumb.Item></Breadcrumb.List></Breadcrumb.Root></MockupState>
      </MockupSection>

      <MockupSection title="구분자" columns={2}>
        <MockupState label="기본 · 슬래시"><Trail path={["홈", "설정", "알림"]} /></MockupState>
        <MockupState label="아이콘 · chevron 14px"><Trail path={["홈", "설정", "알림"]} separator={<ChevronIcon />} /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="상세 페이지 머리 · 경로 위, 제목 아래">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", padding: 24, background: "var(--dds-color-bg-layer-default)", borderRadius: 12, boxSizing: "border-box" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Trail path={["홈", "주문 관리", "ORD-24091"]} />
              <h3 style={{ margin: 0, fontSize: 24, lineHeight: "32px" }}>주문 ORD-24091</h3>
              <p style={{ margin: 0, fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>2026년 10월 2일 결제 완료된 주문입니다.</p>
            </div>
            <span style={{ display: "flex", gap: 8 }}>
              <Button intent="neutral" variant="weak">영수증 보기</Button>
              <Button>배송 시작</Button>
            </span>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["글자", "13px / 18px", "--dds-font-size-t3 · --dds-line-height-t3"],
        ["상위 링크 / hover", "#6D6F72 / #252629 + 밑줄", "--dds-color-fg-neutral-weak / fg-neutral"],
        ["현재 페이지", "#252629 · bold · 링크 아님 (aria-current=page)", "--dds-color-fg-neutral · --dds-font-weight-bold"],
        ["항목 사이 간격", "6px (구분자 양옆)", "--dds-dimension-x1_5"],
        ["구분자", "기본 \"/\" · 아이콘으로 바꿀 때 14px chevron · #6D6F72", "--dds-color-fg-neutral-weak"],
        ["focus ring", "2px #1550A9 outline · offset 2px · radius 4", "--dds-color-stroke-focus-ring · --dds-radius-r1"],
        ["생략 기준 (소비자)", "6단계 이상: 처음 1 + 더보기 + 마지막 2"],
        ["줄바꿈", "폭이 모자라면 다음 줄로 감김 (flex-wrap)"],
      ]} />
    </MockupPage>
  ),
};
