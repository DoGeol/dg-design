import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, ContextMenu, DropdownMenu } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { CopyIcon, EditIcon, FileIcon, LinkIcon, MoreIcon, TrashIcon } from "./icons";

const meta = { title: "Mockups/Flex/Navigation/ContextMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak: React.CSSProperties = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" };

/** DropdownMenu·ContextMenu 둘 다 같은 하위 부품 모양을 가진다 — 같은 행동 목록을 두 진입점에 그대로 쓴다. */
type Parts = Pick<typeof DropdownMenu, "Item" | "Separator" | "Shortcut">;

function RowActions({ M }: { M: Parts }) {
  return (
    <>
      <M.Item><span className="fx-menu-lead"><FileIcon /></span>열기<M.Shortcut>Enter</M.Shortcut></M.Item>
      <M.Item><span className="fx-menu-lead"><EditIcon /></span>이름 변경<M.Shortcut>F2</M.Shortcut></M.Item>
      <M.Item><span className="fx-menu-lead"><CopyIcon /></span>복제<M.Shortcut>Ctrl+D</M.Shortcut></M.Item>
      <M.Item><span className="fx-menu-lead"><LinkIcon /></span>링크 복사</M.Item>
      <M.Separator />
      <M.Item intent="critical"><span className="fx-menu-lead"><TrashIcon /></span>삭제<M.Shortcut>Delete</M.Shortcut></M.Item>
    </>
  );
}

/** 행 오른쪽 더보기 — 우클릭과 같은 행동에 닿는 명시적 트리거. */
function MoreMenu({ open }: { open?: boolean }) {
  return (
    <DropdownMenu.Root defaultOpen={open} placement="bottom-end">
      <DropdownMenu.Trigger asChild>
        <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="문서 행 메뉴"><MoreIcon size={18} /></Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content><RowActions M={DropdownMenu} /></DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

const row: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
  borderRadius: "var(--dds-radius-r2)", border: "1px solid var(--dds-color-stroke-neutral-weak)",
};

function DocRow({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <FileIcon size={20} />
      <div style={{ minWidth: 0, flex: 1 }}><div>2026 포트폴리오 소개</div><p style={weak}>9월 28일 수정 · 공개</p></div>
      {children}
    </>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isCurrent = v.variant === "current";
  const reserve = mobile && !isCurrent ? 320 : 240;
  return (
    <FlexPage
      v={v}
      title="ContextMenu"
      summary={
        isCurrent
          ? "현재 DDS입니다. 우클릭 위치에서 열리고 DropdownMenu 패널·항목 CSS를 그대로 씁니다."
          : "DropdownMenu와 같은 패널·항목 치수를 공유합니다. 우클릭 전용 스타일은 만들지 않고, 같은 행동을 더보기 버튼으로도 엽니다."
      }
    >
      <FlexSection
        title={mobile ? "더보기 버튼 메뉴" : "우클릭 메뉴"}
        note={
          mobile
            ? "터치에는 우클릭이 없고 long-press는 구현하지 않습니다. 행 오른쪽 더보기가 기본 진입점입니다."
            : "좌표 없이 열면 행의 왼쪽 위에서 뜹니다. 닫히면 포커스가 행으로 돌아옵니다."
        }
      >
        <FlexState label={mobile ? "문서 행 · 더보기 열림" : "문서 행 · 우클릭 열림"} block>
          {mobile ? (
            <div style={row}><DocRow><MoreMenu open /></DocRow></div>
          ) : (
            <ContextMenu.Root defaultOpen>
              <ContextMenu.Trigger style={row}><DocRow /></ContextMenu.Trigger>
              <ContextMenu.Content><RowActions M={ContextMenu} /></ContextMenu.Content>
            </ContextMenu.Root>
          )}
          <FlexReserve height={reserve} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="명시적 트리거"
        note={
          isCurrent
            ? "현재도 조합할 수 있습니다 — ContextMenu는 보조 경로라 같은 행동이 화면의 다른 UI로도 닿아야 한다는 계약입니다."
            : "우클릭과 더보기가 같은 행동 목록을 씁니다. 행을 여는 기본 행동과 더보기는 따로 둡니다."
        }
      >
        <FlexState label={mobile ? "우클릭 행 — 데스크톱 전용" : "같은 행 · 더보기 버튼"} block>
          {mobile ? (
            <p style={weak}>모바일에서 우클릭 메뉴는 열리지 않습니다. 위 더보기 메뉴가 같은 행동을 모두 담습니다.</p>
          ) : (
            <div style={row}><DocRow><MoreMenu /></DocRow></div>
          )}
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["menu-radius", "menu-inset", "menu-item-height", "menu-item-radius"]} extra={[
        ["패널·항목 CSS", "DropdownMenu와 공유", isCurrent ? "DDS 선언값" : "D 현재 구조 유지"],
        ["진입 경로", "우클릭 + 행 더보기 버튼", isCurrent ? "계약상 권장" : "C 보조 경로 계약"],
        ["long-press", "없음", isCurrent ? "미구현" : "D 유일 경로로 삼지 않음"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
