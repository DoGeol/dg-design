import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Button, HoverCard } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/HoverCard", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;
const mention = { color: "var(--dds-color-fg-brand)", fontWeight: "var(--dds-font-weight-bold)", textDecoration: "none" } as const;

function ProfileCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 288 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar.Root size="large"><Avatar.Fallback>도걸</Avatar.Fallback></Avatar.Root>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong>편도걸</strong>
            <Badge intent="brand">관리자</Badge>
          </div>
          <p style={{ ...weak, marginTop: 2 }}>@dogeol</p>
        </div>
      </div>
      <p style={{ margin: 0 }}>Dogeol Design System과 dg-studio를 만듭니다.</p>
      <p style={weak}>프로젝트 12개 · 2024.03.02 가입</p>
      <Button size="small" intent="neutral" variant="weak" style={{ alignSelf: "flex-start" }}>프로필 보기</Button>
    </div>
  );
}

/** 멘션 링크 트리거. 링크 자체로도 프로필에 갈 수 있어야 한다(카드는 미리보기일 뿐). */
function Mention({ open }: { open?: boolean }) {
  return (
    <HoverCard.Root defaultOpen={open} placement="bottom-start">
      <HoverCard.Trigger href="#profile-dogeol" style={mention}>@편도걸</HoverCard.Trigger>
      <HoverCard.Content><ProfileCard /></HoverCard.Content>
    </HoverCard.Root>
  );
}

function Comment({ open }: { open?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, width: "100%", alignSelf: "flex-start" }}>
      <Avatar.Root size="medium"><Avatar.Fallback>지수</Avatar.Fallback></Avatar.Root>
      <div>
        <strong>김지수</strong> <span style={weak}>2026.10.02 14:20</span>
        <p style={{ margin: "4px 0 0" }}><Mention open={open} /> 님, 표지 문구를 바꿨습니다. 확인 부탁드립니다.</p>
      </div>
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="HoverCard" summary="링크나 아바타에 포인터를 올리면 뜨는 미리보기 카드입니다. 마우스 전용 보조 경로라 포커스·터치로는 열리지 않습니다.">
      <MockupSection title="트리거" columns={2} note="포인터를 700ms 올려 두면 실제로 열립니다. 열린 화면은 OpenProfile 스토리입니다.">
        <MockupState label="멘션 링크 · fg-brand bold"><span>담당자 <Mention /></span></MockupState>
        <MockupState label="아바타 링크">
          <HoverCard.Root placement="bottom-start">
            <HoverCard.Trigger href="#profile-dogeol" aria-label="편도걸 프로필" style={{ display: "inline-flex", borderRadius: "50%" }}><Avatar.Root size="medium"><Avatar.Fallback>도걸</Avatar.Fallback></Avatar.Root></HoverCard.Trigger>
            <HoverCard.Content><ProfileCard /></HoverCard.Content>
          </HoverCard.Root>
        </MockupState>
      </MockupSection>

      <MockupSection title="상태와 동작">
        <MockupState label="open">700ms hover 뒤 열립니다. 포인터를 카드로 옮겨도 열린 채로 남아 안의 버튼을 누를 수 있습니다.</MockupState>
        <MockupState label="closed">트리거와 카드 밖으로 나가고 300ms 뒤 닫힙니다. ESC로도 닫힙니다.</MockupState>
        <MockupState label="포커스·터치">열리지 않습니다. 카드의 정보는 링크 이동 같은 다른 경로로도 닿아야 합니다.</MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="댓글 목록 · 멘션"><Comment /></MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["최대 폭", "min(384px, 화면 − 16px)", "24rem · --dds-dimension-x4"],
        ["패딩", "16px", "--dds-dimension-x4"],
        ["radius", "12px", "--dds-radius-r3"],
        ["배경 / 그림자", "#FFFFFF · 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-color-bg-layer-default / --dds-shadow-overlay"],
        ["줄바꿈", "어절 단위(word-break: keep-all)", "—"],
        ["화살표", "8 × 8px 45° 회전 · 자동 포함 · 패널 밖으로 나온 두 변에 1px #E5E8EB 테두리", "--dds-dimension-x2 · --dds-color-stroke-neutral-weak"],
        ["프로필 카드(소비 측 조립)", "폭 288 · 요소 간격 12 · Avatar large 48 · 보조 글자 13px #6D6F72", "--dds-dimension-x3 · font-size-t3 · fg-neutral-weak"],
        ["멘션 링크(소비 측)", "#0B397E · bold", "--dds-color-fg-brand · font-weight-bold"],
        ["지연", "열림 700ms · 닫힘 300ms", "—"],
        ["z-index", "2000", "--dds-z-overlay"],
        ["등장 모션", "150ms · scale 0.96 → 1 · ease-out", "--dds-duration-fast · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const OpenProfile: StoryObj = {
  render: () => (
    <MockupPage title="HoverCard · 프로필" summary="댓글의 멘션에 포인터를 올린 상태입니다. 카드는 링크 아래 왼쪽 정렬로 뜹니다.">
      <MockupSection title="댓글 목록" columns={1}>
        <MockupState label="placement bottom-start · 화살표 포함" minHeight={380}><Comment open /></MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
