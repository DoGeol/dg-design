import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Button, Card, Checkbox, Table } from "@dg-design/react";
import * as React from "react";

import { FileIcon, MoreIcon } from "../../c-overlay/icons";
import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { List, ListItem, SectionHeader } from "../proto/List";

const meta = { title: "Mockups/Flex/NewKinds/List", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const POSTS = [
  { id: "p1", title: "컴포넌트 디자인 기록", meta: "디자인 시스템 · 10월 7일 수정", status: ["발행됨", "positive"] },
  { id: "p2", title: "다크 모드 대비 검수 메모", meta: "접근성 · 10월 5일 수정", status: ["초안", "neutral"] },
  { id: "p3", title: "토큰 이름 규칙을 다시 정한 이유와 남은 질문", meta: "토큰 · 9월 28일 수정", status: ["예약", "informative"] },
] as const;

function More({ name }: { name: string }) {
  return (
    <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label={`${name} 더 보기`}>
      <MoreIcon size={18} />
    </Button>
  );
}

function Doc() {
  return <span className="fx-list__doc"><FileIcon size={18} /></span>;
}

function Person({ name, size = "small" }: { name: string; size?: "small" | "medium" }) {
  return <Avatar.Root size={size}><Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback></Avatar.Root>;
}

/** menu={false}는 상태 칸용 — 강제 상태가 칸 안 모든 요소에 걸려서 대상을 행 링크 하나로 둔다. */
function PostRow({ post, menu = true, ...rest }: { post: (typeof POSTS)[number]; menu?: boolean } & Omit<React.ComponentProps<typeof ListItem>, "title">) {
  return (
    <ListItem
      leading={<Doc />}
      title={post.title}
      meta={post.meta}
      href={`#${post.id}`}
      trailing={<><Badge intent={post.status[1]}>{post.status[0]}</Badge>{menu && <More name={post.title} />}</>}
      {...rest}
    />
  );
}

/** 현재 DDS로 객체 목록을 만드는 두 가지 우회 — Card 쌓기, Table 행. */
function Workaround() {
  return (
    <>
      <FlexState label="우회 1 · Card 쌓기" block>
        <div style={{ display: "grid", gap: 8 }}>
          {POSTS.slice(0, 2).map((post) => (
            <Card key={post.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Doc />
              <div style={{ flex: 1, minWidth: 0 }}>
                <a href={`#${post.id}`} style={{ color: "inherit", fontWeight: 700 }}>{post.title}</a>
                <div style={{ color: "var(--dds-color-fg-neutral-weak)", fontSize: 13 }}>{post.meta}</div>
              </div>
              <Badge intent={post.status[1]}>{post.status[0]}</Badge>
              <More name={post.title} />
            </Card>
          ))}
        </div>
      </FlexState>
      <FlexState label="우회 2 · Table 행" block>
        <Table.Root>
          <Table.Header>
            <Table.Row><Table.Head>제목</Table.Head><Table.Head>상태</Table.Head><Table.Head>메뉴</Table.Head></Table.Row>
          </Table.Header>
          <Table.Body>
            {POSTS.slice(0, 2).map((post) => (
              <Table.Row key={post.id}>
                <Table.Cell><a href={`#${post.id}`} style={{ color: "inherit" }}>{post.title}</a></Table.Cell>
                <Table.Cell><Badge intent={post.status[1]}>{post.status[0]}</Badge></Table.Cell>
                <Table.Cell><More name={post.title} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </FlexState>
    </>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const [open, setOpen] = React.useState(true);
  return (
    <FlexPage
      v={v}
      title="List"
      summary={
        isB
          ? "객체 목록을 첫 설계 묶음으로 둡니다. 두 줄 56·한 줄 48(데스크톱 측정), 그룹 제목의 접기·추가와 선택 모드를 함께 정의합니다."
          : v.variant === "a"
            ? "leading → 제목·메타 → trailing 행입니다. 한 줄 56·두 줄 64, 좌우 16을 후보로 둡니다. 실사용 두 곳 검증 후 승격합니다."
            : "현재 없음 — 우회. 객체 목록은 Card를 쌓거나 Table 행으로 만듭니다. 행 전체 누름 영역과 보조 메뉴 분리를 각 앱이 직접 맞춥니다."
      }
    >
      {current ? (
        <FlexSection title="행 구성" note="현재 없음 — 우회. Card는 행마다 테두리·여백이 커지고, Table은 열 머리글과 비교 의미가 붙습니다.">
          <Workaround />
        </FlexSection>
      ) : (
        <FlexSection title="행 구성" note="기본 행동은 제목 링크 하나이고 행 전체가 누름 영역입니다. 메뉴 버튼은 그 위에 따로 놓입니다.">
          <FlexState label="두 줄 · 문서" block>
            <List>{POSTS.map((post) => <PostRow key={post.id} post={post} />)}</List>
          </FlexState>
          <FlexState label="한 줄 · 사람" block>
            <List>
              {["김도걸", "이서연", "박지훈"].map((name) => (
                <ListItem key={name} leading={<Person name={name} />} title={name} href={`#${name}`} trailing={<More name={name} />} />
              ))}
            </List>
          </FlexState>
        </FlexSection>
      )}

      {!current && (
        <FlexSection title="상태" columns={1} note="hover·pressed는 행 링크에만 반응합니다. 메뉴 버튼 위에서는 행이 바뀌지 않습니다. 강제 상태 칸은 메뉴 버튼을 뺐습니다.">
          <FlexState label="hover" force="hover" block><List><PostRow post={POSTS[0]} menu={false} /></List></FlexState>
          <FlexState label="focus-visible · 행 2px 링" force="focus" block><List><PostRow post={POSTS[0]} menu={false} /></List></FlexState>
          <FlexState label="pressed" force="pressed" block><List><PostRow post={POSTS[0]} menu={false} /></List></FlexState>
          <FlexState label="현재 열린 객체 · aria-current" block>
            <List><PostRow post={POSTS[1]} aria-current="true" /></List>
          </FlexState>
          <FlexState label="긴 제목 · trailing 유지" block><List><PostRow post={POSTS[2]} /></List></FlexState>
        </FlexSection>
      )}

      {!current && (
        <FlexSection
          title="묶음 제목"
          note={isB ? "SectionHeader — 제목 버튼이 접기(aria-expanded), 추가는 오른쪽 형제 버튼입니다." : "A는 그룹 제목을 따로 정하지 않습니다. 목록 위 제목만 둡니다."}
        >
          <FlexState label={isB ? "펼침 · 건수 · 추가" : "목록 위 제목"} block>
            {isB ? (
              <>
                <SectionHeader
                  title="발행됨"
                  count={2}
                  description="목록과 검색 결과에 보입니다."
                  collapse={{ expanded: open, controls: "fx-list-published", onToggle: () => setOpen((o) => !o) }}
                  action={<Button size="small" intent="neutral" variant="ghost">글 추가</Button>}
                />
                <List id="fx-list-published" hidden={!open}>
                  {POSTS.slice(0, 2).map((post) => <PostRow key={post.id} post={post} />)}
                </List>
                <SectionHeader title="보관함" count={14} collapse={{ expanded: false, controls: "fx-list-archive" }} />
                <List id="fx-list-archive" hidden><PostRow post={POSTS[2]} /></List>
              </>
            ) : (
              <>
                <SectionHeader title="발행됨" />
                <List>{POSTS.slice(0, 2).map((post) => <PostRow key={post.id} post={post} />)}</List>
              </>
            )}
          </FlexState>
        </FlexSection>
      )}

      {isB && (
        <FlexSection title="선택 모드" note="선택 모드에서는 행의 기본 행동이 링크에서 체크로 바뀝니다. 링크와 체크를 한 행에 함께 두지 않습니다.">
          <FlexState label="2개 선택" block>
            <div className="fx-list-selectbar">
              <span>2개 선택됨</span>
              <Button size="small" intent="critical" variant="weak">보관</Button>
            </div>
            <List>
              {POSTS.map((post, i) => (
                <ListItem
                  key={post.id}
                  leading={<Checkbox defaultChecked={i < 2} aria-labelledby={`fx-sel-${post.id}`} />}
                  title={<span id={`fx-sel-${post.id}`}>{post.title}</span>}
                  meta={post.meta}
                  trailing={<Badge intent={post.status[1]}>{post.status[0]}</Badge>}
                />
              ))}
            </List>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={["list-row-1", "list-row-2", "list-inset", "list-leading-gap"]} extra={current ? [
        ["Card 우회", "padding 16 · r12 · 테두리 1px", "D 현재 Card"],
        ["Table 우회", "행 44 · 셀 12/16", "D 현재 Table"],
      ] : [
        ["leading", "아이콘 18 / Avatar 24·36", "D Avatar small·medium 재사용"],
        ["구분선", "1px stroke-neutral-weak, 좌우 여백에서 시작", "D 경계 1px"],
        ["focus", "행 2px 링(안쪽)", "비입력 계약 — 행 링크가 초점"],
        ...(isB ? [["SectionHeader", "최소 40 · 제목 13 bold weak", "D dimension-x10, t3"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
