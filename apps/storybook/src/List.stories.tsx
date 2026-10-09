import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Button, DropdownMenu, List } from "@dg-design/react";

import { MoreIcon } from "./mockups/c-overlay/icons";
import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "List",
} satisfies Meta;

export default meta;

function MoreMenu({ title }: { title: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label={`${title} 더 보기`}>
          <MoreIcon size={16} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>이름 바꾸기</DropdownMenu.Item>
        <DropdownMenu.Item>복제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** 블로그 저장 글(행 전체 링크 + 상태 Badge)과 이력서 버전(정적 이름 + trailing 메뉴) 두 소비처 모양. */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <List.Section collapsible>
        <List.SectionHeader as="h2" title="발행됨" count={2} action={<Button size="small" intent="neutral" variant="ghost">글 추가</Button>} />
        <List.Root>
          <List.Item>
            <List.Action href="#post-1">다크 모드 대비 검수 메모</List.Action>
            <List.Meta>접근성 · 10월 5일 수정</List.Meta>
            <List.Trailing>
              <Badge intent="positive" variant="weak">발행됨</Badge>
              <MoreMenu title="다크 모드 대비 검수 메모" />
            </List.Trailing>
          </List.Item>
          <List.Item>
            <List.Action href="#post-2">토큰 이름 정리</List.Action>
            <List.Meta>디자인 시스템 · 10월 2일 수정</List.Meta>
            <List.Trailing>
              <Badge intent="neutral" variant="weak">초안</Badge>
            </List.Trailing>
          </List.Item>
        </List.Root>
      </List.Section>
    </div>
  ),
};

function Rows() {
  return (
    <>
      <Caption>두 줄 행 · current · leading · 긴 제목</Caption>
      <List.Root aria-label="두 줄 행">
        <List.Item current>
          <List.Leading>
            <Avatar.Root size="small" aria-label="김도걸">
              <Avatar.Fallback>김</Avatar.Fallback>
            </Avatar.Root>
          </List.Leading>
          <List.Action href="#current">지금 열린 문서 — 현재 버전</List.Action>
          <List.Meta>10월 9일 수정</List.Meta>
          <List.Trailing>
            <Badge intent="informative" variant="weak">공개</Badge>
          </List.Trailing>
        </List.Item>
        <List.Item>
          <List.Action href="#long">말줄임 확인용으로 아주 길게 쓴 제목입니다 trailing 폭은 그대로 유지되어야 합니다</List.Action>
          <List.Meta>메타도 길어지면 한 줄에서 말줄임으로 끝나야 합니다 · 10월 1일 수정</List.Meta>
          <List.Trailing>
            <MoreMenu title="긴 제목" />
          </List.Trailing>
        </List.Item>
      </List.Root>
      <Caption>한 줄 행 · 정적 행(Title) · 버튼 Action</Caption>
      <List.Root aria-label="한 줄 행">
        <List.Item>
          <List.Title>이력서 v2</List.Title>
          <List.Trailing>
            <Button size="small" intent="neutral" variant="ghost">편집</Button>
            <MoreMenu title="이력서 v2" />
          </List.Trailing>
        </List.Item>
        <List.Item>
          <List.Action>그 자리에서 여는 행</List.Action>
        </List.Item>
      </List.Root>
      <List.Section collapsible>
        <List.SectionHeader title="초안·예약" count={1} description="예약된 글은 발행 시각에 공개된다" action={<Button size="small" intent="neutral" variant="ghost">초안 추가</Button>} />
        <List.Root>
          <List.Item>
            <List.Action href="#draft">첫 초안</List.Action>
          </List.Item>
        </List.Root>
      </List.Section>
      <List.Section collapsible defaultOpen={false}>
        <List.SectionHeader title="보관함" count={12} />
        <List.Root>
          <List.Item>
            <List.Title>접혀서 보이지 않는 행</List.Title>
          </List.Item>
        </List.Root>
      </List.Section>
    </>
  );
}

/** VR 기준: 두 줄·한 줄·정적 행, current, leading, 말줄임, 묶음 제목(펼침·접힘·설명·행동)을 두 밀도로. */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <Rows />}</DensityColumns>,
};
