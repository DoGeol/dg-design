import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Table } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { POSTS, STATUS_INTENT, Surface, num, type Post } from "./shared";

const meta = { title: "Mockups/Flex/DataFeedback/Table", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 숫자 열은 머리글과 셀 모두 fx-num — 현재 열에서는 아무 규칙도 걸리지 않아 왼쪽 정렬 그대로다. */
function PostTable({ rows, hover, caption = "최근 글", minWidth, scroll }: {
  rows: readonly Post[];
  hover?: number;
  caption?: string;
  minWidth?: number;
  scroll?: boolean;
}) {
  const total = rows.reduce((sum, p) => sum + p.views, 0);
  return (
    <Table.Root
      style={minWidth ? { minWidth } : undefined}
      wrapperProps={scroll ? { tabIndex: 0, role: "region", "aria-label": `${caption} 스크롤` } : undefined}
    >
      <Table.Caption>{caption}</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>제목</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head className="fx-num">조회수</Table.Head>
          <Table.Head className="fx-num">댓글</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={4} style={{ color: "var(--dds-color-fg-neutral-weak)", textAlign: "center" }}>조건에 맞는 글이 없습니다.</Table.Cell>
          </Table.Row>
        ) : rows.map((p, i) => (
          <Table.Row key={p.id} className={hover === i ? "mk-hover" : undefined}>
            <Table.Cell>{p.title}</Table.Cell>
            <Table.Cell><Badge intent={STATUS_INTENT[p.status]}>{p.status}</Badge></Table.Cell>
            <Table.Cell className="fx-num">{num(p.views)}</Table.Cell>
            <Table.Cell className="fx-num">{num(p.comments)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      {rows.length > 1 && (
        <Table.Footer>
          <Table.Row>
            <Table.Head scope="row" colSpan={2}>합계</Table.Head>
            <Table.Cell className="fx-num">{num(total)}</Table.Cell>
            <Table.Cell className="fx-num">{num(rows.reduce((sum, p) => sum + p.comments, 0))}</Table.Cell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const current = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Table"
      summary={
        isB
          ? "다열 비교가 목적일 때만 표를 씁니다. 객체를 훑고 여는 목록은 List로 갑니다. 셀 여백과 행 높이는 현재 값입니다."
          : v.variant === "a"
            ? "기본 여백을 유지하고 숫자 열을 끝 정렬·고정폭 숫자로 맞춥니다. 행을 카드처럼 만들지 않습니다."
            : "현재 DDS 표입니다. 모든 셀이 왼쪽 정렬이라 숫자 자릿수가 어긋납니다."
      }
    >
      <FlexSection
        title="비교 표"
        note={current ? "숫자도 왼쪽 정렬입니다(text-align: left 고정)." : "숫자 열은 머리글까지 끝 정렬 + tabular-nums. 머리글은 약한 글자, 본문은 진한 글자입니다. A·B 같다."}
      >
        <FlexState label="caption · 머리글 · 본문 · 합계" block>
          <Surface style={{ padding: "0 4px" }}><PostTable rows={POSTS.slice(0, 5)} /></Surface>
        </FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={1} note="hover는 중성 투명 표면(bg-transparent-hover)입니다. 행을 누르는 기본 행동이 없으면 hover만 있고 pressed는 없습니다.">
        <FlexState label="hover · 둘째 행" block>
          <Surface style={{ padding: "0 4px" }}><PostTable rows={POSTS.slice(0, 3)} hover={1} /></Surface>
        </FlexState>
        <FlexState label="focus-visible · 스크롤 영역" force="focus" block>
          <Surface style={{ padding: 4, overflow: "visible" }}><PostTable rows={POSTS.slice(0, 2)} caption="좁은 표" minWidth={520} scroll /></Surface>
        </FlexState>
        <FlexState label="empty · 결과 없음" block>
          <Surface style={{ padding: "0 4px" }}><PostTable rows={[]} /></Surface>
        </FlexState>
      </FlexSection>

      {mobile && (
        <FlexSection
          title="좁은 화면"
          note={isB
            ? "비교 표는 가로 스크롤을 유지합니다. 사람·문서를 훑고 여는 화면이면 표 대신 List로 바꿉니다."
            : "행을 카드 블록으로 바꾸지 않고 가로 스크롤을 유지합니다. 스크롤 영역에 이름과 tabIndex를 줍니다."}
        >
          <FlexState label="가로 스크롤 · 최소 폭 520px" block>
            <Surface style={{ padding: "0 4px" }}><PostTable rows={POSTS.slice(0, 4)} minWidth={520} scroll /></Surface>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={["table-row"]} extra={[
        ["셀 여백", "12 / 16px", "D 현재 값(A·B 공통)"],
        ["머리글 글자", "13/18 bold · fg-neutral-weak", "D 현재 값"],
        ["본문 글자", "14/19 · fg-neutral", "D 현재 값"],
        ["숫자 열", current ? "왼쪽 정렬" : "끝 정렬 + tabular-nums", current ? "현재 동작" : "C 비교 가독성(A·B 공통)"],
        ["행 구분 · hover", "1px stroke-neutral-weak · bg-transparent-hover", "D 현재 값"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1100} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={1100} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
