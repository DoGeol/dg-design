import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Button, HoverCard } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Surfaces/HoverCard", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" } as const;
const mention = { color: "var(--dds-color-fg-brand)", fontWeight: "var(--dds-font-weight-bold)", textDecoration: "none" } as const;

/** Avatar → 이름·보조 정보 → 짧은 내용 순서. 편집 같은 중요한 작업은 넣지 않는다. */
function Profile() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 272 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar.Root size="large"><Avatar.Fallback>민서</Avatar.Fallback></Avatar.Root>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><strong>김민서</strong><Badge intent="informative">검토자</Badge></div>
          <p style={{ ...weak, marginTop: 2 }}>디자인 시스템 · 서울</p>
        </div>
      </div>
      <p style={{ margin: 0 }}>이번 주 검토 3건 중 2건을 마쳤습니다.</p>
      <Button size="small" intent="neutral" variant="weak" style={{ alignSelf: "flex-start" }}>프로필 보기</Button>
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  return (
    <FlexPage
      v={v}
      title="HoverCard"
      summary={
        v.variant === "current"
          ? "현재 HoverCard는 Popover와 같은 표면(p16·r12·1px 경계·overlay 그림자)입니다."
          : "치수·조합 모두 현재와 같습니다. 원문에서 새 hover 모션이나 그림자를 정할 근거가 없습니다."
      }
    >
      <FlexSection
        title="사람 미리보기"
        note="Avatar와 이름 12, 묶음 사이 16. hover 전용 보조 경로라 링크만으로도 같은 정보에 갈 수 있어야 합니다."
      >
        <FlexState label="멘션 링크 · 열림" block>
          <p style={{ margin: 0 }}>
            담당자{" "}
            <HoverCard.Root open placement="bottom-start">
              <HoverCard.Trigger href="#profile-minseo" style={mention}>@김민서</HoverCard.Trigger>
              <HoverCard.Content style={{ fontSize: "var(--fx-body-size, var(--dds-font-size-t4))", lineHeight: "var(--fx-body-line, var(--dds-line-height-t4))" }}><Profile /></HoverCard.Content>
            </HoverCard.Root>
            {" "}님이 검토 중입니다.
          </p>
          <FlexReserve height={190} />
        </FlexState>
      </FlexSection>

      <FlexSection title={mobile ? "모바일" : "정보 양"} note={
        mobile
          ? "hover가 없습니다. 탭하면 링크로 상세 화면에 갑니다 — 꼭 필요한 정보는 클릭 Popover나 상세에서도 제공합니다."
          : "미리보기에 담을 정보 양을 먼저 정합니다. 긴 설명·여러 행동이 필요하면 Popover나 상세 화면으로 옮깁니다."
      }>
        <FlexState label="판단" block>{v.variant === "current" ? "현재 규칙과 같습니다." : "A·B 모두 현재 표면을 유지합니다."}</FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["표면", "p16 · r12 · 최대 24rem · arrow 8", v.variant === "current" ? "DDS 선언값" : "D 현재 값 — A·B 동일"],
        ["내부 간격", "Avatar–이름 12 · 묶음 16", v.variant === "current" ? "소비자 조합" : "C 소비자 조합(A 후보와 같음)"],
        ["경계", "1px stroke-neutral-weak + shadow-overlay", "현재 유지 — 다크 필수"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
