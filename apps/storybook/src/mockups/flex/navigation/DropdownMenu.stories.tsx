import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, DropdownMenu } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { CheckIcon, ChevronRightIcon, CopyIcon, DownloadIcon, EditIcon, FolderIcon, MoreIcon, TrashIcon } from "./icons";

const meta = { title: "Mockups/Flex/Navigation/DropdownMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type RowProps = React.ComponentProps<typeof DropdownMenu.Item> & {
  lead?: React.ReactNode;
  shortcut?: string;
  trail?: React.ReactNode;
};

/** 열 고정 항목 — leading 16(아이콘 또는 선택 체크) · 명령문 · trailing(단축키·chevron·토글 중 하나). */
function Row({ lead, shortcut, trail, children, ...props }: RowProps) {
  return (
    <DropdownMenu.Item {...props}>
      <span className="fx-menu-lead">{lead}</span>
      {children}
      {shortcut && <DropdownMenu.Shortcut>{shortcut}</DropdownMenu.Shortcut>}
      {trail && <span className="fx-menu-trail">{trail}</span>}
    </DropdownMenu.Item>
  );
}

/** 포털 없이 그리는 정적 패널. Item은 Content 없이 Root 컨텍스트만 있으면 그려진다. */
function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="fx-menu-panel" style={style}><DropdownMenu.Root>{children}</DropdownMenu.Root></div>;
}

/** 열린 메뉴 높이 + 여유. [데스크톱, 모바일] */
const RESERVE = { current: [240, 260], a: [260, 330], b: [400, 520] } as const;

const open = { background: "var(--dds-color-bg-transparent-hover)" } as const;

/** 안마다 다른 조합. 치수는 CSS 역할 변수가 맡는다. */
function MenuItems({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  if (v.variant === "current") {
    return (
      <>
        <DropdownMenu.Label>문서</DropdownMenu.Label>
        <Row lead={<EditIcon />} shortcut="F2">이름 변경</Row>
        <Row lead={<CopyIcon />} shortcut="Ctrl+D">복제</Row>
        <Row lead={<FolderIcon />}>다른 폴더로 이동…</Row>
        <DropdownMenu.Separator />
        <Row lead={<DownloadIcon />}>PDF로 내보내기</Row>
        <DropdownMenu.Separator />
        <Row lead={<TrashIcon />} shortcut="Delete" intent="critical">삭제</Row>
      </>
    );
  }
  return (
    <>
      {isB ? (
        <div className="fx-menu-header">
          <strong>컴포넌트 디자인 기록</strong>
          <span>문서 · 작성 중</span>
        </div>
      ) : (
        <DropdownMenu.Label>문서</DropdownMenu.Label>
      )}
      {isB && <DropdownMenu.Separator />}
      <Row lead={<EditIcon />} shortcut="F2">이름 변경</Row>
      <Row lead={<CopyIcon />} shortcut="Ctrl+D">복제</Row>
      <Row lead={<FolderIcon />} trail={<ChevronRightIcon />}>이동</Row>
      <DropdownMenu.Separator />
      {isB ? (
        <>
          <DropdownMenu.Label>보기</DropdownMenu.Label>
          <Row lead={<CheckIcon />}>눈금자 표시</Row>
          <Row>격자 표시</Row>
          <Row trail={<span className="fx-menu-toggle" data-on="" aria-hidden />}>자동 저장</Row>
        </>
      ) : (
        <Row lead={<DownloadIcon />}>PDF로 내보내기</Row>
      )}
      <DropdownMenu.Separator />
      <Row lead={<TrashIcon />} shortcut="Delete" intent="critical">삭제</Row>
      {isB && (
        <>
          <DropdownMenu.Separator />
          <p className="fx-menu-footer" style={{ margin: 0 }}>10월 8일 편도걸이 수정했습니다.</p>
        </>
      )}
    </>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const isCurrent = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="DropdownMenu"
      summary={
        isB
          ? "머리·발 영역, 그룹, 단축키 열, 체크·토글 항목, 하위 메뉴 표식을 한 메뉴 문법으로 조합합니다(DS021–023)."
          : v.variant === "a"
            ? "패널 여백 6px, 항목 36px로 넓히고 하위 메뉴는 Sub API를 더해 같은 chevron으로 표시합니다."
            : "현재 DDS 메뉴입니다. 하위 메뉴·체크 항목이 없어 '이동…'은 Dialog로 우회합니다."
      }
    >
      <FlexSection
        title="열린 메뉴"
        note={
          isB
            ? "체크·토글·하위 메뉴는 표현만입니다 — CheckboxItem·Sub API는 아직 없습니다. 위험 명령은 마지막 구역에 따로 둡니다."
            : v.variant === "a"
              ? "위험 명령만 별도 구역에 둡니다. 선택 체크와 하위 메뉴 chevron은 섞지 않습니다."
              : "체크·토글 항목은 현재 없음 — 설정은 메뉴 밖 Switch로 우회합니다."
        }
      >
        <FlexState label="문서 도구 막대 · 더보기" block>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <strong>컴포넌트 디자인 기록</strong>
            <DropdownMenu.Root defaultOpen placement="bottom-end">
              <DropdownMenu.Trigger asChild>
                <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="문서 메뉴"><MoreIcon size={18} /></Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content><MenuItems v={v} /></DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <FlexReserve height={RESERVE[v.variant][mobile ? 1 : 0]} />
        </FlexState>
      </FlexSection>

      <FlexSection title="항목 상태" columns={2} note="hover와 focus는 같은 배경, focus에만 2px 링이 붙습니다.">
        <FlexState label="default"><Panel style={{ width: "100%" }}><Row lead={<CopyIcon />}>복제</Row></Panel></FlexState>
        <FlexState label="hover" force="hover"><Panel style={{ width: "100%" }}><Row lead={<CopyIcon />}>복제</Row></Panel></FlexState>
        <FlexState label="focus" force="focus"><Panel style={{ width: "100%" }}><Row lead={<CopyIcon />}>복제</Row></Panel></FlexState>
        <FlexState label="pressed" force="pressed"><Panel style={{ width: "100%" }}><Row lead={<CopyIcon />}>복제</Row></Panel></FlexState>
        <FlexState label="disabled"><Panel style={{ width: "100%" }}><Row lead={<DownloadIcon />} disabled>Word로 내보내기</Row></Panel></FlexState>
        <FlexState label="critical"><Panel style={{ width: "100%" }}><Row lead={<TrashIcon />} intent="critical">삭제</Row></Panel></FlexState>
        <FlexState label="critical · hover" force="hover"><Panel style={{ width: "100%" }}><Row lead={<TrashIcon />} intent="critical">삭제</Row></Panel></FlexState>
        <FlexState label="critical · focus" force="focus"><Panel style={{ width: "100%" }}><Row lead={<TrashIcon />} intent="critical">삭제</Row></Panel></FlexState>
        {isB && (
          <>
            <FlexState label="selected(체크)"><Panel style={{ width: "100%" }}><Row lead={<CheckIcon />}>눈금자 표시</Row></Panel></FlexState>
            <FlexState label="selected · hover" force="hover"><Panel style={{ width: "100%" }}><Row lead={<CheckIcon />}>눈금자 표시</Row></Panel></FlexState>
            <FlexState label="selected · focus" force="focus"><Panel style={{ width: "100%" }}><Row lead={<CheckIcon />}>눈금자 표시</Row></Panel></FlexState>
            <FlexState label="토글 켜짐"><Panel style={{ width: "100%" }}><Row trail={<span className="fx-menu-toggle" data-on="" aria-hidden />}>자동 저장</Row></Panel></FlexState>
          </>
        )}
      </FlexSection>

      <FlexSection
        title="하위 메뉴"
        note={
          isCurrent
            ? "현재 없음 — Sub API가 없어 '이동…'으로 Dialog를 엽니다. 말줄임표가 다음 단계를 예고합니다."
            : isB
              ? "Sub API 없음 — 표현만. 오른쪽 chevron은 하위 탐색에만 쓰고 선택 체크와 섞지 않습니다."
              : "A — Sub API 확장 후 같은 chevron. → 로 열고 ← 로 부모 항목에 돌아오는 계약까지 구현합니다."
        }
      >
        {isCurrent ? (
          <FlexState label="우회 · Dialog로 이어짐" block>
            <Panel style={{ maxWidth: 240 }}><Row lead={<FolderIcon />}>다른 폴더로 이동…</Row></Panel>
          </FlexState>
        ) : (
          <FlexState label={isB ? "Sub API 없음 — 표현만" : "Sub · 열린 상태"} block>
            <div className="fx-submenu">
              <Panel>
                <Row lead={<EditIcon />}>이름 변경</Row>
                <Row lead={<FolderIcon />} trail={<ChevronRightIcon />} style={open}>이동</Row>
                <Row lead={<DownloadIcon />}>내보내기</Row>
              </Panel>
              <Panel>
                <Row>보관함</Row>
                <Row>공유 문서함</Row>
                <Row>개인 폴더</Row>
              </Panel>
            </div>
          </FlexState>
        )}
      </FlexSection>

      <FlexSpec v={v} roles={["menu-radius", "menu-inset", "menu-item-height", "menu-item-radius"]} extra={[
        ["항목 좌우 여백 · 아이콘 간격", "8px · 8px", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["패널 최소 폭", "192px (12rem)", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["leading 열", "16px — 아이콘 또는 선택 체크", isCurrent ? "아이콘을 자식으로 직접 둠" : "C 열 고정 · 아이콘 16과 같게"],
        ["단축키", mobile && !isCurrent ? "숨김" : "오른쪽 열 · 12px fg-neutral-weak", mobile && !isCurrent ? "C 터치에는 단축키 없음" : "D 현재 값"],
        ...(isB ? [
          ["머리·발 영역", "6·8px 여백 · 제목 14 bold / 보조 12", "D 항목 여백·Label 글자 재사용"],
          ["토글 표시", "32×20, thumb 16 (장식)", "D Switch medium 재사용"],
        ] as const : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1000} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
