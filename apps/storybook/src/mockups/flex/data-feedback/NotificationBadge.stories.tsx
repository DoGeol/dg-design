import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, NotificationBadge } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { BellIcon, Surface } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/NotificationBadge", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 아이콘 코너 배치는 소비자 조합이다 — 배지는 독립 터치 대상이 아니고 이름은 버튼이 갖는다. */
function Bell({ count }: { count?: number }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <Button iconOnly intent="neutral" variant="ghost" aria-label={count ? `알림 ${count}개` : "새 알림 있음"}><BellIcon /></Button>
      <NotificationBadge count={count} aria-hidden="true" style={{ position: "absolute", top: count ? 2 : 8, insetInlineEnd: count ? 0 : 8, transform: count ? "translate(25%, -25%)" : undefined }} />
    </span>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  return (
    <FlexPage
      v={v}
      title="NotificationBadge"
      summary={
        isB
          ? "글로벌 알림(헤더 벨)과 객체의 새 활동(행 dot)을 구분해 배치합니다. 크기는 현재 그대로 — A·B 같다."
          : v.variant === "a"
            ? "dot은 새 활동, count는 건수입니다. 크기는 유지하고 위치를 소비자 조합으로 맞춥니다."
            : "현재 DDS NotificationBadge입니다. dot 6px, count 최소 18px 캡슐입니다."
      }
    >
      <FlexSection title="모양" note="두 자리·세 자리에서도 원형으로 강제하지 않고 캡슐로 늘어납니다. max를 넘으면 99+ — A·B 같다.">
        <FlexState label="dot · 3 · 12 · 99+">
          <NotificationBadge role="img" aria-label="새 활동" />
          <NotificationBadge count={3} />
          <NotificationBadge count={12} />
          <NotificationBadge count={120} />
        </FlexState>
        <FlexState label="intent brand">
          <NotificationBadge intent="brand" role="img" aria-label="새 활동" />
          <NotificationBadge intent="brand" count={8} />
        </FlexState>
      </FlexSection>

      <FlexSection title="배치" columns={2} note="배지는 aria-hidden, 건수는 부모 이름(알림 12개)이 읽습니다. 중복 낭독을 막습니다.">
        <FlexState label="아이콘 코너 · count"><Bell count={12} /></FlexState>
        <FlexState label="아이콘 코너 · dot"><Bell /></FlexState>
        <FlexState label="라벨 옆 · 탭·메뉴" span={2}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--dds-dimension-x1_5)", fontSize: "var(--dds-font-size-t4)" }}>
            검토 요청 <NotificationBadge count={4} aria-hidden="true" />
          </span>
        </FlexState>
      </FlexSection>

      {isB && (
        <FlexSection title="글로벌 알림 · 객체 상태" note="행의 새 활동은 제목 앞 dot, 업무 상태는 상태 Badge. 둘을 한 표식으로 합치지 않습니다.">
          <FlexState label="목록 행" block>
            <Surface style={{ padding: "var(--dds-dimension-x3) var(--fx-list-inset, 12px)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x2)", fontSize: "var(--dds-font-size-t4)" }}>
                <NotificationBadge role="img" aria-label="새 댓글" />
                <span style={{ flex: 1 }}>표와 목록을 고르는 기준</span>
                <Badge intent="informative">검토 중</Badge>
              </span>
            </Surface>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={[]} extra={[
        ["dot", "6px 원", "D 현재 값(A·B 공통)"],
        ["count", "최소 18 × 18px · 좌우 4 · 11px bold", "D 현재 값(A·B 공통)"],
        ["max", "99 → 99+", "D 현재 기본값"],
        ["색", "critical solid 기본 · brand solid", "D 현재 값"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
