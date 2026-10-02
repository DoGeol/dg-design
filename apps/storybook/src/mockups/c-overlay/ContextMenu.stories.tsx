import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ContextMenu } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";
import { CopyIcon, EditIcon, FileIcon, LinkIcon, Shortcut, TrashIcon, criticalItem } from "./icons";

const meta = { title: "Mockups/A/ContextMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;
const panel = { width: "100%", padding: 4, borderRadius: 12, background: "var(--dds-color-bg-layer-default)" } as const;

const FILES = ["표지.png", "소개.md", "작업 목록.md", "회고.md"];

/**
 * 우클릭 대상 영역 + 메뉴. openAt이 있으면 마운트 직후 그 좌표(영역 기준)로 contextmenu
 * 이벤트를 보낸다 — 이 컴포넌트는 defaultOpen만으로는 커서 좌표가 없어 (0, 0)에 뜬다.
 */
function FileGrid({ openAt }: { openAt?: { x: number; y: number } }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { x, y } = openAt ?? {};
  React.useEffect(() => {
    const el = ref.current;
    if (x === undefined || y === undefined || !el) return;
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: r.left + x, clientY: r.top + y }));
  }, [x, y]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(4, 140px)", gap: 12, padding: 16, borderRadius: 12, border: "1px dashed var(--dds-color-stroke-neutral)", background: "var(--dds-color-bg-layer-default)" }}>
        {FILES.map((name, i) => (
          <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 12, borderRadius: 8, background: i === 1 ? "var(--dds-color-bg-brand-weak)" : undefined, color: i === 1 ? "var(--dds-color-fg-brand)" : undefined }}>
            <FileIcon size={32} />
            <span style={{ fontSize: "var(--dds-font-size-t3)" }}>{name}</span>
          </div>
        ))}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>소개.md</ContextMenu.Label>
        <ContextMenu.Item><EditIcon />이름 변경<Shortcut>F2</Shortcut></ContextMenu.Item>
        <ContextMenu.Item><CopyIcon />복제<Shortcut>Ctrl+D</Shortcut></ContextMenu.Item>
        <ContextMenu.Item><LinkIcon />링크 복사</ContextMenu.Item>
        <ContextMenu.Item disabled><FileIcon />다른 프로젝트로 이동 (권한 없음)</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item style={criticalItem}><TrashIcon />삭제<Shortcut>Delete</Shortcut></ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

function LoneItem(props: React.ComponentProps<typeof ContextMenu.Item>) {
  return <div style={panel}><ContextMenu.Root><ContextMenu.Item {...props} /></ContextMenu.Root></div>;
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="ContextMenu" summary="영역을 우클릭한 자리에 뜨는 메뉴입니다. 패널·항목 외관은 DropdownMenu와 같고, 여는 방법과 위치 기준만 다릅니다.">
      <MockupSection title="우클릭 대상 영역" columns={1} note="영역 안을 우클릭하면 실제로 열립니다. 열린 화면은 Open 스토리입니다. 트리거 자체에는 스타일이 없어 소비 측이 그립니다.">
        <MockupState label="파일 목록 · 점선은 시안 표시용"><FileGrid /></MockupState>
      </MockupSection>

      <MockupSection title="항목 상태" columns={4} note="DropdownMenu와 같은 CSS를 씁니다.">
        <MockupState label="default"><LoneItem><CopyIcon />복제</LoneItem></MockupState>
        <MockupState label="hover · focus" force="focus"><LoneItem><CopyIcon />복제</LoneItem></MockupState>
        <MockupState label="disabled"><LoneItem disabled><FileIcon />다른 프로젝트로 이동</LoneItem></MockupState>
        <MockupState label="critical (소비 측 색)"><LoneItem style={criticalItem}><TrashIcon />삭제</LoneItem></MockupState>
      </MockupSection>

      <MockupSection title="동작">
        <MockupState label="open">우클릭 좌표 오른쪽 아래(bottom-start)에 뜨고 첫 항목에 포커스가 갑니다. 화면 끝이면 뒤집히거나 밀립니다.</MockupState>
        <MockupState label="closed">ESC·바깥 클릭·항목 선택으로 닫힙니다. 다른 자리를 우클릭하면 그 자리에서 다시 열립니다.</MockupState>
        <MockupState label="입력 수단">마우스 우클릭 전용입니다. 같은 동작은 더보기 버튼 같은 다른 UI로도 닿아야 합니다.</MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["위치", "우클릭 좌표 기준 bottom-start · 간격 4px · 화면 여백 8px", "—"],
        ["패널", "DropdownMenu와 같음 · 최소 폭 192 · 패딩 4", "12rem · --dds-dimension-x1"],
        ["패널 radius (A)", "현재 8 → 12px (overrides-a.css, dropdown-menu 클래스 공유)", "--dds-radius-r2 → r3"],
        ["항목", "최소 높이 32 · radius 6 · 14px", "--dds-dimension-x8 · radius-r1_5 · font-size-t4"],
        ["항목 hover·focus / pressed", "rgb(16 18 20 / 0.06) / 0.12", "--dds-color-bg-transparent-hover / -pressed"],
        ["critical 항목(소비 측)", "글자 #731115", "--dds-color-fg-critical"],
        ["선택 대상 표시(소비 측)", "배경 #F1F5FC · 글자 #0B397E · radius 8", "--dds-color-bg-brand-weak · fg-brand · radius-r2"],
        ["등장 모션", "150ms · scale 0.96 → 1 · ease-out", "--dds-duration-fast · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const Open: StoryObj = {
  render: () => (
    <MockupPage title="ContextMenu · 열림" summary="파일 목록에서 ‘소개.md’를 우클릭한 직후입니다. 메뉴는 커서 자리에서 오른쪽 아래로 펼쳐집니다.">
      <MockupSection title="파일 목록" columns={1}>
        <MockupState label="우클릭 좌표 bottom-start · 첫 항목 포커스" minHeight={420}>
          <div style={{ alignSelf: "flex-start" }}><FileGrid openAt={{ x: 236, y: 64 }} /></div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
