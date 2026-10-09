import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Badge, Button, Card, Dialog, RadioGroup, Sheet } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexState, flexOf, type Flex } from "../FlexKit";
import { ExpandIcon, TaskParts, TaskToday, type View as PanelView } from "../proto/DialogLayout";

const meta = { title: "Mockups/Flex/Scenarios/TaskPanel", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;

const ROWS = [
  ["컴포넌트 디자인 기록", "검토 중", "informative"],
  ["토큰 이름 정리", "요청됨", "neutral"],
  ["다크 모드 경계 점검", "완료", "positive"],
] as const;

/** 모달 뒤에 깔리는 검토 목록. */
function Backdrop() {
  return (
    <FlexSection title="배경 · 검토 요청 목록" note="행을 열면 같은 작업이 데스크톱은 Dialog, 모바일은 하단 Sheet로 열립니다.">
      <FlexState label="목록" block>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ROWS.map(([title, status, intent]) => (
            <Card key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div><strong>{title}</strong><p style={weak}>블로그 · 10월 9일</p></div>
              <Badge intent={intent}>{status}</Badge>
            </Card>
          ))}
        </div>
      </FlexState>
    </FlexSection>
  );
}

/** B 데스크톱 — 같은 Dialog에서 보기만 바꾼다. 입력값·포커스는 그대로다. */
function ViewSwitch({ view, onChange }: { view: PanelView; onChange: (view: PanelView) => void }) {
  return (
    <RadioGroup.Root variant="segmented" size="small" aria-label="패널 보기" value={view} onValueChange={(next) => onChange(next as PanelView)}>
      <RadioGroup.Item value="center">중앙</RadioGroup.Item>
      <RadioGroup.Item value="side">측면</RadioGroup.Item>
      <RadioGroup.Item value="full">전체</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

function DesktopPanel({ v }: { v: Flex }) {
  const [view, setView] = React.useState<PanelView>("center");
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Overlay />
      {v.variant === "current" ? (
        <Dialog.Content className="fx-scene"><TaskToday /></Dialog.Content>
      ) : (
        <Dialog.Content className="fx-scene fx-dialog-frame" data-view={view}>
          <TaskParts toolbarExtra={v.variant === "b" && <ViewSwitch view={view} onChange={setView} />} />
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
}

function MobilePanel({ v }: { v: Flex }) {
  const [full, setFull] = React.useState(false);
  const expand = v.variant === "b" && (
    <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label={full ? "작게 보기" : "전체 화면으로 보기"} aria-pressed={full} onClick={() => setFull(!full)}>
      <ExpandIcon />
    </Button>
  );
  return (
    <Sheet.Root side="bottom" defaultOpen>
      <Sheet.Overlay />
      {v.variant === "current" ? (
        <Sheet.Content><TaskToday kind="sheet" /></Sheet.Content>
      ) : (
        <Sheet.Content className="fx-dialog-frame" data-kind="sheet" data-view={full ? "sheet-full" : "sheet"}>
          <TaskParts kind="sheet" mobile toolbarExtra={expand} />
        </Sheet.Content>
      )}
    </Sheet.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isCurrent = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="작업 패널"
      summary={
        isCurrent
          ? mobile
            ? "현재: 하단 Sheet 높이 20rem 고정, 제목부터 버튼까지 내용 전체가 스크롤됩니다."
            : "현재: Dialog에 Title·Description·Close만 있어 폼·활동·버튼이 한 덩어리로 스크롤됩니다."
          : v.variant === "b"
            ? mobile
              ? "B: 하단 Sheet(r16·여백 20). 오른쪽 위 버튼으로 같은 Sheet를 전체 화면으로 넓혀도 메모가 남습니다."
              : "B: Toolbar의 보기 전환으로 같은 작업을 중앙·측면·전체로 이어 갑니다. 본문 여백 40, Body만 스크롤합니다."
            : mobile
              ? "A: 하단 Sheet(r24·여백 20), 최대 90dvh. 활동은 본문 뒤, CTA 52는 아래 고정입니다."
              : "A: Toolbar / Body / Aside / Footer. 본문 여백 40, Footer는 Body 아래에만, Body만 스크롤합니다."
      }
    >
      <Backdrop />
      <FlexSection title="검증할 것" note={mobile ? "390px · 키보드가 올라와도 마지막 필드와 CTA에 닿아야 합니다." : "데스크톱 좁은 비교 열에서는 패널을 0.55로 줄여 그립니다(가상 화면 높이 40rem+32)."}>
        <FlexState label="스크롤·Footer" block>
          {isCurrent ? "버튼이 스크롤 끝에 있어 긴 폼에서 주 행동이 보이지 않습니다." : "본문만 스크롤되고 닫기·주 행동은 항상 보입니다. 다크에서도 패널 경계 1px이 보여야 합니다."}
        </FlexState>
      </FlexSection>
      {mobile ? <MobilePanel v={v} /> : <DesktopPanel v={v} />}
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={ctx.globals.density === "mobile" ? 820 : 720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
