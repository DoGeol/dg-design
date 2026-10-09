import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Card, DropdownMenu } from "@dg-design/react";
import * as React from "react";

import { CopyIcon, EditIcon, FileIcon, LinkIcon, MoreIcon, TrashIcon } from "../../c-overlay/icons";
import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { FilterChip, FilterToolbox } from "../proto/Chip";
import { List, ListItem, SectionHeader } from "../proto/List";

const meta = { title: "Mockups/Flex/Scenarios/ObjectList", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Intent = "positive" | "neutral" | "informative";
interface Post { id: string; title: string; meta: string; status: readonly [string, Intent] }

const PUBLISHED: readonly Post[] = [
  { id: "p1", title: "컴포넌트 디자인 기록", meta: "디자인 시스템 · 조회 1,204 · 10월 7일", status: ["발행됨", "positive"] },
  { id: "p2", title: "토큰 이름 규칙을 다시 정한 이유와 남은 질문", meta: "토큰 · 조회 312 · 9월 28일", status: ["발행됨", "positive"] },
];
const DRAFTS: readonly Post[] = [
  { id: "d1", title: "다크 모드 대비 검수 메모", meta: "접근성 · 10월 5일 수정", status: ["초안", "neutral"] },
  { id: "d2", title: "모바일 속성 행 정리", meta: "디자인 시스템 · 10월 12일 오전 9:00 예약", status: ["예약", "informative"] },
];

/** 보조 행동 메뉴 — 행 열기와 별개의 버튼. open을 주면 열린 채로 둔다(제어 모드라 형제가 닫지 못한다). */
function RowMenu({ post, open }: { post: Post; open?: boolean }) {
  return (
    <DropdownMenu.Root open={open}>
      <DropdownMenu.Trigger asChild>
        <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label={`${post.title} 더 보기`}><MoreIcon size={18} /></Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item><EditIcon />편집</DropdownMenu.Item>
        <DropdownMenu.Item><CopyIcon />복제</DropdownMenu.Item>
        <DropdownMenu.Item><LinkIcon />링크 복사</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item intent="critical"><TrashIcon />삭제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function Row({ post, open }: { post: Post; open?: boolean }) {
  return (
    <ListItem
      leading={<span className="fx-list__doc"><FileIcon size={18} /></span>}
      title={post.title}
      meta={post.meta}
      href={`#${post.id}`}
      trailing={<><Badge intent={post.status[1]}>{post.status[0]}</Badge><RowMenu post={post} open={open} /></>}
    />
  );
}

/** 현재 DDS 우회 — Card 한 장이 행 하나. 행 열기는 제목 링크, 메뉴는 옆 버튼. */
function CardRow({ post, open }: { post: Post; open?: boolean }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <span className="fx-list__doc"><FileIcon size={18} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <a href={`#${post.id}`} onClick={(e) => e.preventDefault()} style={{ color: "inherit", fontWeight: 700, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</a>
        <div style={{ color: "var(--dds-color-fg-neutral-weak)", fontSize: 13 }}>{post.meta}</div>
      </div>
      <Badge intent={post.status[1]}>{post.status[0]}</Badge>
      <RowMenu post={post} open={open} />
    </Card>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const mobile = v.density === "mobile";
  const [draftsOpen, setDraftsOpen] = React.useState(true);
  const [mine, setMine] = React.useState(true);

  return (
    <FlexPage
      v={v}
      title="객체 목록"
      summary={
        isB
          ? "블로그 글 목록입니다. 묶음 제목(건수·접기·추가)과 필터 도구 아래 List 행을 둡니다. 행을 누르면 글을 열고, 메뉴 버튼은 따로 초점을 받습니다."
          : v.variant === "a"
            ? "List 후보 + Badge + DropdownMenu입니다. 행 열기와 오른쪽 보조 메뉴를 분리합니다."
            : "현재 없음 — 우회. Card를 행처럼 쌓고 제목 링크와 메뉴 버튼을 나란히 둡니다."
      }
    >
      <FlexSection
        title={mobile ? "블로그 글 · 모바일" : "블로그 글"}
        note={current ? "현재 없음 — 우회. 행 전체 누름 영역이 없어 제목 링크만 누를 수 있습니다." : "제목 링크의 누름 영역이 행 전체를 덮고, 메뉴 버튼은 그 위에 따로 놓입니다. 마지막 행의 메뉴를 열어 두었습니다."}
      >
        <FlexState label={current ? "Card 쌓기 + 메뉴" : isB ? "필터 · 묶음 · 행 · 메뉴" : "목록 · 행 · 메뉴"} block>
          <div className="fx-list-toolbar">
            <strong>글 {PUBLISHED.length + DRAFTS.length}개</strong>
            <Button size={mobile ? "medium" : "small"}>새 글</Button>
          </div>
          {isB && (
            <FilterToolbox label="글 필터" count={`결과 ${mine ? 4 : 9}건`} resetDisabled={!mine} onReset={() => setMine(false)}>
              <FilterChip pressed={mine} onClick={() => setMine((m) => !m)}>내 글</FilterChip>
              <FilterChip pressed={false}>최근 수정</FilterChip>
            </FilterToolbox>
          )}
          {current ? (
            <div style={{ display: "grid", gap: 8 }}>
              {[...PUBLISHED, ...DRAFTS].map((post, i, all) => <CardRow key={post.id} post={post} open={i === all.length - 1} />)}
            </div>
          ) : isB ? (
            <>
              <SectionHeader title="발행됨" count={PUBLISHED.length} collapse={{ expanded: true, controls: "fx-obj-pub" }} />
              <List id="fx-obj-pub">{PUBLISHED.map((post) => <Row key={post.id} post={post} />)}</List>
              <SectionHeader
                title="초안·예약"
                count={DRAFTS.length}
                collapse={{ expanded: draftsOpen, controls: "fx-obj-draft", onToggle: () => setDraftsOpen((o) => !o) }}
                action={<Button size="small" intent="neutral" variant="ghost">초안 추가</Button>}
              />
              <List id="fx-obj-draft" hidden={!draftsOpen}>{DRAFTS.map((post, i) => <Row key={post.id} post={post} open={i === DRAFTS.length - 1} />)}</List>
            </>
          ) : (
            <List>{[...PUBLISHED, ...DRAFTS].map((post, i, all) => <Row key={post.id} post={post} open={i === all.length - 1} />)}</List>
          )}
          <FlexReserve height={mobile ? 250 : 190} />
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["list-row-2", "list-inset", "list-leading-gap", "menu-item-height"]} extra={[
        ["행 기본 행동", current ? "제목 링크만" : "제목 링크 = 행 전체", current ? "D Card에 누름 영역 없음" : "C 한 행 한 기본 행동"],
        ["보조 행동", "DropdownMenu 버튼(36 ghost)", "D Button small iconOnly"],
        ...(isB ? [["필터 도구", "칩 · 결과 수 · 초기화", "B 결과 수·초기화 관계(COMPONENT-RULES)"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
