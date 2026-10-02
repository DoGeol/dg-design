import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Button, NotificationBadge } from "@dg-design/react";
import type * as React from "react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/NotificationBadge", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5h-13S5 12 5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 16.5a1.6 1.6 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 아이콘 버튼 오른쪽 위에 얹는다. 개수는 버튼의 접근 이름에 함께 넣고 배지는 aria-hidden. */
function IconWithBadge({ label, count, icon = <BellIcon /> }: { label: string; count?: number; icon?: React.ReactNode }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <Button intent="neutral" variant="ghost" size="small" aria-label={label} style={{ paddingInline: 8 }}>{icon}</Button>
      <NotificationBadge
        count={count}
        aria-hidden="true"
        style={{ position: "absolute", top: count === undefined ? 6 : -4, right: count === undefined ? 6 : -6, pointerEvents: "none" }}
      />
    </span>
  );
}

/** 시안 칸 배경(neutral-weak) 대신 실제 헤더처럼 흰 표면에 둔다. */
const surface = { display: "flex", alignItems: "center", gap: 16, width: "100%", boxSizing: "border-box", padding: "8px 12px", borderRadius: 8, background: "var(--dds-color-bg-layer-default)" } as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="NotificationBadge" summary="읽지 않은 알림이 있음(dot)이나 개수(count)를 표시합니다. 개수가 0이면 렌더되지 않고, max를 넘으면 max+로 줄입니다.">
      <MockupSection title="모양 · critical (기본)" columns={5}>
        <MockupState label="dot"><NotificationBadge /></MockupState>
        <MockupState label="count · 3"><NotificationBadge count={3} /></MockupState>
        <MockupState label="count · 27"><NotificationBadge count={27} /></MockupState>
        <MockupState label="max 초과 · 150 → 99+"><NotificationBadge count={150} /></MockupState>
        <MockupState label="max=9 · 12 → 9+"><NotificationBadge count={12} max={9} /></MockupState>
      </MockupSection>

      <MockupSection title="intent · brand" columns={5} note="새 기능·안내처럼 경고가 아닌 표시에만 씁니다.">
        <MockupState label="dot"><NotificationBadge intent="brand" /></MockupState>
        <MockupState label="count · 3"><NotificationBadge intent="brand" count={3} /></MockupState>
        <MockupState label="count · 27"><NotificationBadge intent="brand" count={27} /></MockupState>
        <MockupState label="max 초과 · 99+"><NotificationBadge intent="brand" count={150} /></MockupState>
        <MockupState label="isShowEmpty · 0"><NotificationBadge intent="brand" count={0} isShowEmpty /></MockupState>
      </MockupSection>

      <MockupSection title="empty" columns={2}>
        <MockupState label="count=0 · 렌더 안 됨 (기본)">
          <IconWithBadge label="알림" count={0} />
        </MockupState>
        <MockupState label="count=0 · isShowEmpty">
          <NotificationBadge count={0} isShowEmpty />
        </MockupState>
      </MockupSection>

      <MockupSection title="아이콘 버튼 위 · 상태" columns={4} note="hover·pressed·focus는 아이콘 버튼의 상태입니다. 배지는 그대로입니다.">
        <MockupState label="default"><IconWithBadge label="알림 5개" count={5} /></MockupState>
        <MockupState label="hover" force="hover"><IconWithBadge label="알림 5개" count={5} /></MockupState>
        <MockupState label="pressed" force="pressed"><IconWithBadge label="알림 5개" count={5} /></MockupState>
        <MockupState label="focus" force="focus"><IconWithBadge label="알림 5개" count={5} /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="헤더 아이콘 버튼 · dot / count / 99+">
          <div style={surface}>
            <IconWithBadge label="새 알림 있음" />
            <IconWithBadge label="받은 메시지 8개" count={8} icon={<MailIcon />} />
            <IconWithBadge label="알림 99개 이상" count={150} />
          </div>
        </MockupState>
        <MockupState label="아바타 위 · Avatar.Badge 슬롯">
          <div style={surface}>
          <Avatar.Root size="large">
            <Avatar.Fallback>편</Avatar.Fallback>
            <Avatar.Badge><NotificationBadge count={3} aria-label="읽지 않은 메시지 3개" /></Avatar.Badge>
          </Avatar.Root>
          <Avatar.Root size="medium">
            <Avatar.Fallback>김</Avatar.Fallback>
            <Avatar.Badge><NotificationBadge intent="brand" aria-label="새 활동 있음" /></Avatar.Badge>
          </Avatar.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["dot", "6×6px 원", "--dds-dimension-x1_5 / radius-r-full"],
        ["count 높이 · 최소 폭", "18px · 18px (두 자리부터 좌우로 늘어남)", "--dds-dimension-x4_5"],
        ["count 패딩", "위 2px(광학 보정) · 좌우 4px", "--dds-dimension-x0_5 / x1"],
        ["count 글자", "11px / 15px · bold", "--dds-font-size-t1 / font-weight-bold"],
        ["critical 배경 / 글자", "#9B1C22 / #FFFFFF", "--dds-color-bg-critical-solid / fg-critical-contrast"],
        ["brand 배경 / 글자", "#1550A9 / #FFFFFF", "--dds-color-bg-brand-solid / fg-brand-contrast"],
        ["max", "기본 99, 초과 시 \"99+\"", "—"],
        ["배치 (아이콘 버튼 36px)", "count는 위 −4px · 오른쪽 −6px, dot은 위·오른쪽 6px (소비 앱이 position: absolute)", "—"],
        ["배치 (아바타)", "Avatar.Badge 슬롯 · 오른쪽 아래, 18% 바깥으로", "—"],
        ["접근성", "개수를 버튼 접근 이름에 넣고 배지는 aria-hidden, 단독이면 aria-label", "—"],
      ]} />
    </MockupPage>
  ),
};
