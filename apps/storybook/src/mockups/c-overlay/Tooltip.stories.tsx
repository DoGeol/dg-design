import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, Tooltip } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";
import { CopyIcon, DownloadIcon, EditIcon, LinkIcon, TrashIcon } from "./icons";

type Placement = React.ComponentProps<typeof Tooltip.Root>["placement"];

const meta = { title: "Mockups/A/Tooltip", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 아이콘 버튼 + 툴팁. 툴팁 문구가 곧 버튼 이름이라 aria-label과 같게 둔다. */
function Tip({ label, icon, open, placement, intent = "neutral" }: {
  label: string;
  icon: React.ReactNode;
  open?: boolean;
  placement?: Placement;
  intent?: "neutral" | "critical";
}) {
  return (
    <Tooltip.Root defaultOpen={open} placement={placement}>
      <Tooltip.Trigger asChild>
        <Button size="small" intent={intent} variant="ghost" aria-label={label}>{icon}</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}

const center = { justifyContent: "center", width: "100%" } as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Tooltip" summary="아이콘 버튼처럼 글자가 없는 컨트롤의 이름을 알려 주는 짧은 말풍선입니다. hover·focus로 열리고, 안에 상호작용 요소를 넣지 않습니다.">
      <MockupSection title="배치" columns={4} note="기본은 top입니다. 공간이 부족하면 반대쪽으로 뒤집힙니다.">
        {(["top", "right", "bottom", "left"] as const).map((p) => (
          <MockupState key={p} label={p} minHeight={128}>
            <div style={{ display: "flex", ...center, paddingTop: p === "top" ? 32 : 0 }}>
              <Tip label="링크 복사" icon={<LinkIcon />} open placement={p} />
            </div>
          </MockupState>
        ))}
      </MockupSection>

      <MockupSection title="상태" columns={4} note="트리거는 DDS Button입니다. 툴팁은 열림·닫힘 두 상태뿐입니다.">
        <MockupState label="closed"><Tip label="이름 변경" icon={<EditIcon />} /></MockupState>
        <MockupState label="hover · 700ms 뒤 열림" force="hover"><Tip label="이름 변경" icon={<EditIcon />} /></MockupState>
        <MockupState label="focus · 바로 열림" force="focus"><Tip label="이름 변경" icon={<EditIcon />} /></MockupState>
        <MockupState label="긴 문구 · 최대 폭 256" minHeight={128}>
          <div style={{ display: "flex", ...center, paddingTop: 56 }}>
            <Tooltip.Root defaultOpen>
              <Tooltip.Trigger asChild><Button size="small" intent="neutral" variant="ghost" aria-label="내보내기"><DownloadIcon /></Button></Tooltip.Trigger>
              <Tooltip.Content>PDF로 내보냅니다. 비공개 문서는 포함되지 않습니다.</Tooltip.Content>
            </Tooltip.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1} note="문서 도구 막대의 아이콘 버튼마다 툴팁을 답니다. 열린 화면은 Open 스토리입니다.">
        <MockupState label="문서 도구 막대">
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "var(--dds-color-bg-layer-default)", border: "1px solid var(--dds-color-stroke-neutral-weak)" }}>
            <Tip label="이름 변경" icon={<EditIcon />} />
            <Tip label="복제" icon={<CopyIcon />} />
            <Tip label="링크 복사" icon={<LinkIcon />} />
            <Tip label="내보내기" icon={<DownloadIcon />} />
            <Tip label="삭제" icon={<TrashIcon />} intent="critical" />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["최대 폭", "256px, 넘치면 줄바꿈", "16rem"],
        ["줄바꿈 (A)", "현재 음절 단위 → 어절 단위 keep-all (c-overlay/overrides.css)", "—"],
        ["패딩", "6 / 8px (세로 / 가로)", "--dds-dimension-x1_5 / x2"],
        ["radius (A)", "현재 6 → 8px (overrides-a.css)", "--dds-radius-r1_5 → r2"],
        ["배경 / 글자", "#3B3D40 / #FFFFFF", "--dds-color-bg-neutral-solid / fg-neutral-contrast"],
        ["글자", "12 / 16px · regular", "--dds-font-size-t2 · line-height-t2"],
        ["그림자", "0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-shadow-overlay"],
        ["화살표", "8 × 8px 45° 회전 · 배경색 상속", "--dds-dimension-x2"],
        ["트리거 간격 / 화면 여백", "4 / 8px (floating-ui 상수)", "—"],
        ["지연", "열림 700ms · 닫힘 150ms · 그룹 스킵 300ms · blur·ESC는 즉시", "—"],
        ["z-index", "2000", "--dds-z-overlay"],
        ["등장 모션", "150ms · scale 0.96 → 1 · ease-out", "--dds-duration-fast · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const Open: StoryObj = {
  render: () => (
    <MockupPage title="Tooltip · 열림" summary="도구 막대의 링크 복사 버튼에 포인터를 올린 상태입니다.">
      <MockupSection title="문서 도구 막대" columns={1}>
        <MockupState label="placement top · 화살표 포함" minHeight={200}>
          <div style={{ display: "flex", ...center, paddingTop: 48 }}>
            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "var(--dds-color-bg-layer-default)", border: "1px solid var(--dds-color-stroke-neutral-weak)" }}>
              <Tip label="이름 변경" icon={<EditIcon />} />
              <Tip label="복제" icon={<CopyIcon />} />
              <Tip label="링크 복사" icon={<LinkIcon />} open />
              <Tip label="내보내기" icon={<DownloadIcon />} />
              <Tip label="삭제" icon={<TrashIcon />} intent="critical" />
            </div>
          </div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
