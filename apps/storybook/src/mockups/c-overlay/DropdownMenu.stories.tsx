import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Button, Card, DropdownMenu } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import { CopyIcon, DownloadIcon, EditIcon, LinkIcon, MoreIcon, Shortcut, TrashIcon, criticalItem } from "./icons";

const meta = { title: "Mockups/A/DropdownMenu", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;
/** 상태 칸에서 항목을 패널 배경(흰색) 위에 올려 보이게 하는 받침. */
const panel = { width: "100%", padding: 4, borderRadius: 12, background: "var(--dds-color-bg-layer-default)" } as const;

/** 문서 행의 더보기 메뉴. 항목·구분선·라벨·비활성·critical·단축키를 모두 담는다. */
function DocumentMenu({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu.Root defaultOpen={defaultOpen}>
      <DropdownMenu.Trigger asChild>
        <Button size="small" intent="neutral" variant="ghost" aria-label="문서 메뉴"><MoreIcon size={18} /></Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>문서</DropdownMenu.Label>
        <DropdownMenu.Item><EditIcon />이름 변경<Shortcut>F2</Shortcut></DropdownMenu.Item>
        <DropdownMenu.Item><CopyIcon />복제<Shortcut>Ctrl+D</Shortcut></DropdownMenu.Item>
        <DropdownMenu.Item><LinkIcon />링크 복사<Shortcut>Ctrl+Shift+C</Shortcut></DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>내보내기</DropdownMenu.Label>
        <DropdownMenu.Item><DownloadIcon />PDF로 내보내기</DropdownMenu.Item>
        <DropdownMenu.Item disabled><DownloadIcon />Word로 내보내기 (준비 중)</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item style={criticalItem}><TrashIcon />삭제<Shortcut>Delete</Shortcut></DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Content 없이 Root 컨텍스트만으로 항목 하나를 그린다(상태 칸용). */
function LoneItem(props: React.ComponentProps<typeof DropdownMenu.Item>) {
  return <div style={panel}><DropdownMenu.Root><DropdownMenu.Item {...props} /></DropdownMenu.Root></div>;
}

function DocumentRow({ open }: { open?: boolean }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 420 }}>
      <div><strong>2026 포트폴리오 소개</strong><p style={{ ...weak, marginTop: 4 }}>2026.09.28 수정 · 공개</p></div>
      <DocumentMenu defaultOpen={open} />
    </Card>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="DropdownMenu" summary="트리거를 눌러 여는 동작 목록입니다. 열리면 첫 항목에 포커스가 가고, 화살표 키로 이동합니다. 항목을 고르면 메뉴가 닫힙니다.">
      <MockupSection title="항목 상태" columns={4} note="항목은 높이 32, radius 6입니다. hover·focus는 같은 배경을 쓰고 focus에만 링이 붙습니다.">
        <MockupState label="default"><LoneItem><CopyIcon />복제</LoneItem></MockupState>
        <MockupState label="hover" force="hover"><LoneItem><CopyIcon />복제</LoneItem></MockupState>
        <MockupState label="pressed" force="pressed"><LoneItem><CopyIcon />복제</LoneItem></MockupState>
        <MockupState label="focus · 키보드 이동" force="focus"><LoneItem><CopyIcon />복제</LoneItem></MockupState>
        <MockupState label="disabled"><LoneItem disabled><DownloadIcon />Word로 내보내기</LoneItem></MockupState>
        <MockupState label="critical (소비 측 색)"><LoneItem style={criticalItem}><TrashIcon />삭제</LoneItem></MockupState>
        <MockupState label="critical · hover" force="hover"><LoneItem style={criticalItem}><TrashIcon />삭제</LoneItem></MockupState>
        <MockupState label="단축키 (소비 측 조립)"><LoneItem><LinkIcon />링크 복사<Shortcut>Ctrl+Shift+C</Shortcut></LoneItem></MockupState>
      </MockupSection>

      <MockupSection title="라벨 · 구분선" columns={2}>
        <MockupState label="Label · 12px bold fg-neutral-weak">
          <div style={panel}><DropdownMenu.Root><DropdownMenu.Label>내보내기</DropdownMenu.Label><DropdownMenu.Item><DownloadIcon />PDF로 내보내기</DropdownMenu.Item></DropdownMenu.Root></div>
        </MockupState>
        <MockupState label="Separator · 1px, 패널 좌우 끝까지">
          <div style={panel}><DropdownMenu.Root><DropdownMenu.Item><LinkIcon />링크 복사</DropdownMenu.Item><DropdownMenu.Separator /><DropdownMenu.Item style={criticalItem}><TrashIcon />삭제</DropdownMenu.Item></DropdownMenu.Root></div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1} note="더보기 아이콘 버튼을 누르면 실제로 열립니다. 열린 화면은 Open 스토리입니다.">
        <MockupState label="문서 목록 행 · 더보기"><DocumentRow /></MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["패널 최소 폭 / 최대 높이", "192px / 화면 − 16px(넘치면 스크롤)", "12rem · --dds-dimension-x4"],
        ["패널 패딩", "4px", "--dds-dimension-x1"],
        ["패널 radius", "12px", "--dds-radius-r3"],
        ["패널 배경 / 그림자", "#FFFFFF · 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-color-bg-layer-default / --dds-shadow-overlay"],
        ["줄바꿈", "어절 단위(word-break: keep-all)", "—"],
        ["항목 높이 / 패딩 / 간격", "최소 32 / 6·8px / 아이콘과 8px", "--dds-dimension-x8 / x1_5·x2 / x2"],
        ["항목 radius / 글자", "6px · 14 / 19px", "--dds-radius-r1_5 · font-size-t4"],
        ["항목 hover·focus / pressed", "rgb(16 18 20 / 0.06) / 0.12", "--dds-color-bg-transparent-hover / -pressed"],
        ["항목 focus ring", "2px #1550A9 · offset −2px(안쪽)", "--dds-color-stroke-focus-ring"],
        ["항목 disabled", "글자 #8A8C8F · not-allowed", "--dds-color-fg-disabled"],
        ["critical 항목(소비 측)", "글자 #731115", "--dds-color-fg-critical"],
        ["단축키(소비 측)", "오른쪽 정렬 · 12px #6D6F72", "--dds-font-size-t2 · fg-neutral-weak"],
        ["Label", "6·8px 패딩 · 12 / 16px bold · #6D6F72", "--dds-font-size-t2 · fg-neutral-weak"],
        ["Separator", "1px #E5E8EB · 위아래 4px, 좌우는 패널 끝까지", "--dds-color-stroke-neutral-weak"],
        ["배치 / 트리거 간격", "bottom-start · 4px", "—"],
        ["등장 모션", "150ms · scale 0.96 → 1 · ease-out", "--dds-duration-fast · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const Open: StoryObj = {
  render: () => (
    <MockupPage title="DropdownMenu · 열림" summary="더보기 버튼으로 연 직후입니다. 첫 항목(이름 변경)에 키보드 포커스가 있습니다.">
      <MockupSection title="문서 목록" columns={1}>
        <MockupState label="placement bottom-start · 라벨·구분선·비활성·critical·단축키" minHeight={460}>
          <div style={{ alignSelf: "flex-start" }}><DocumentRow open /></div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
