import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Pagination, Skeleton, StatePanel, Table } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Table", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Order = { id: string; customer: string; product: string; amount: number; status: "결제 완료" | "배송 중" | "취소 요청"; date: string };

const ORDERS: Order[] = [
  { id: "ORD-24091", customer: "김도경", product: "무선 키보드 K3", amount: 89000, status: "결제 완료", date: "2026-10-02" },
  { id: "ORD-24090", customer: "이서준", product: "모니터 암 듀얼", amount: 134000, status: "배송 중", date: "2026-10-01" },
  { id: "ORD-24089", customer: "박하늘", product: "USB-C 허브 7포트", amount: 52000, status: "취소 요청", date: "2026-10-01" },
  { id: "ORD-24088", customer: "최윤아", product: "노트북 거치대", amount: 39000, status: "배송 중", date: "2026-09-30" },
  { id: "ORD-24087", customer: "정민호", product: "인체공학 마우스", amount: 67000, status: "결제 완료", date: "2026-09-30" },
];

const STATUS_INTENT = { "결제 완료": "positive", "배송 중": "informative", "취소 요청": "critical" } as const;
const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

function OrderHeader() {
  return (
    <Table.Header>
      <Table.Row>
        <Table.Head>주문 번호</Table.Head>
        <Table.Head>주문자</Table.Head>
        <Table.Head>상품</Table.Head>
        <Table.Head style={{ textAlign: "right" }}>결제 금액</Table.Head>
        <Table.Head>상태</Table.Head>
        <Table.Head>주문일</Table.Head>
      </Table.Row>
    </Table.Header>
  );
}

function OrderRow({ order, hover }: { order: Order; hover?: boolean }) {
  return (
    // mk-hover: 시안 키트의 강제 hover 클래스. 한 행만 hover로 그리려고 행에 직접 단다.
    <Table.Row className={hover ? "mk-hover" : undefined}>
      <Table.Cell style={{ fontVariantNumeric: "tabular-nums" }}>{order.id}</Table.Cell>
      <Table.Cell>{order.customer}</Table.Cell>
      <Table.Cell>{order.product}</Table.Cell>
      <Table.Cell style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{won(order.amount)}</Table.Cell>
      <Table.Cell><Badge intent={STATUS_INTENT[order.status]}>{order.status}</Badge></Table.Cell>
      <Table.Cell style={{ fontVariantNumeric: "tabular-nums" }}>{order.date}</Table.Cell>
    </Table.Row>
  );
}

function InboxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 13h4l1.5 2.5h5L16 13h4" />
      <path d="M5.5 6.5 4 13v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5l-1.5-6.5a1 1 0 0 0-1-.8h-11a1 1 0 0 0-1 .8Z" />
    </svg>
  );
}

const box = { width: "100%", background: "var(--dds-color-bg-layer-default)", borderRadius: 12, padding: "4px 0" } as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Table" summary="정렬·선택 로직 없이 마크업만 입히는 표입니다. 숫자 열은 오른쪽 정렬과 고정폭 숫자를 씁니다.">
      <MockupSection title="기본 · hover 행" columns={1} note="두 번째 행이 hover 상태입니다. 행 구분은 1px 아래 테두리만 씁니다.">
        <MockupState label="default + hover (ORD-24090)">
          <div style={box}>
            <Table.Root>
              <Table.Caption style={{ paddingInline: 16 }}>최근 주문 5건</Table.Caption>
              <OrderHeader />
              <Table.Body>
                {ORDERS.map((order) => <OrderRow key={order.id} order={order} hover={order.id === "ORD-24090"} />)}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.Cell colSpan={3} style={{ fontWeight: 700 }}>합계</Table.Cell>
                  <Table.Cell style={{ textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{won(ORDERS.reduce((s, o) => s + o.amount, 0))}</Table.Cell>
                  <Table.Cell colSpan={2} />
                </Table.Row>
              </Table.Footer>
            </Table.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={1} note="빈 상태와 로딩은 표 머리글을 유지한 채 본문만 바꿉니다.">
        <MockupState label="empty">
          <div style={box}>
            <Table.Root>
              <OrderHeader />
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan={6} style={{ padding: 16 }}>
                    <StatePanel.Root role="status" minHeight={200}>
                      <StatePanel.Icon><InboxIcon /></StatePanel.Icon>
                      <StatePanel.Title>아직 주문이 없습니다</StatePanel.Title>
                      <StatePanel.Description>첫 주문이 들어오면 이곳에 표시됩니다.</StatePanel.Description>
                      <StatePanel.Actions><Button size="small">상품 등록하기</Button></StatePanel.Actions>
                    </StatePanel.Root>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
        </MockupState>
        <MockupState label="loading">
          <div style={box} aria-busy="true">
            <Table.Root>
              <OrderHeader />
              <Table.Body>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Table.Row key={i}>
                    {[80, 48, 120, 72, 60, 80].map((w, j) => (
                      <Table.Cell key={j}><Skeleton radius="small" style={{ width: w, height: 14, display: "block", marginLeft: j === 3 ? "auto" : undefined }} /></Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="주문 관리 · 표 + 페이지네이션">
          <div style={{ ...box, padding: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 8px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, lineHeight: "22px" }}>주문 내역</h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>전체 248건 중 1–5번째 주문입니다.</p>
              </div>
              <Button size="small">주문 내보내기</Button>
            </div>
            <Table.Root>
              <OrderHeader />
              <Table.Body>{ORDERS.map((order) => <OrderRow key={order.id} order={order} />)}</Table.Body>
            </Table.Root>
            <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
              <Pagination.Root>
                <Pagination.List>
                  <Pagination.Item><Pagination.Previous aria-disabled="true" data-disabled="" /></Pagination.Item>
                  <Pagination.Item><Pagination.Link href="#" isActive>1</Pagination.Link></Pagination.Item>
                  <Pagination.Item><Pagination.Link href="#">2</Pagination.Link></Pagination.Item>
                  <Pagination.Item><Pagination.Link href="#">3</Pagination.Link></Pagination.Item>
                  <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
                  <Pagination.Item><Pagination.Link href="#">50</Pagination.Link></Pagination.Item>
                  <Pagination.Item><Pagination.Next href="#" /></Pagination.Item>
                </Pagination.List>
              </Pagination.Root>
            </div>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["셀 패딩 (head·cell)", "12px 위아래 · 16px 좌우", "--dds-dimension-x3 / x4"],
        ["머리글 글자", "13px / 18px · bold · #6D6F72", "--dds-font-size-t3 · --dds-color-fg-neutral-weak"],
        ["본문 글자", "14px / 19px · regular · #252629", "--dds-font-size-t4 · --dds-color-fg-neutral"],
        ["행 구분선", "아래 1px #E5E8EB", "--dds-color-stroke-neutral-weak"],
        ["행 hover 배경", "rgb(16 18 20 / 0.06)", "--dds-color-bg-transparent-hover"],
        ["캡션", "13px · #6D6F72 · 위아래 8px", "--dds-font-size-t3 · --dds-dimension-x2"],
        ["가로 스크롤 영역 focus", "2px #1550A9 outline · offset 2px", "--dds-color-stroke-focus-ring"],
        ["숫자 열", "오른쪽 정렬 · tabular-nums (소비자 지정)"],
        ["빈 상태", "StatePanel · 최소 높이 200px · radius 12 · 배경 #F3F5F9", "--dds-radius-r3 · --dds-color-bg-neutral-weak"],
      ]} />
    </MockupPage>
  ),
};
