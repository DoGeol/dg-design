import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Breadcrumb, Button, DropdownMenu } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { ArrowLeftIcon, ChevronLeftIcon, MoreIcon } from "./icons";

const meta = { title: "Mockups/Flex/Navigation/Breadcrumb", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak: React.CSSProperties = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" };
const heading: React.CSSProperties = { margin: 0, fontSize: "var(--dds-font-size-t7)", lineHeight: "var(--dds-line-height-t7)" };

/** 경로 배열을 Item·Separator로 펼친다. 마지막은 현재 페이지(span). */
function Trail({ path }: { path: React.ReactNode[] }) {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {path.map((node, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Breadcrumb.Separator />}
            <Breadcrumb.Item>
              {i === path.length - 1 ? <Breadcrumb.Page>{node}</Breadcrumb.Page> : typeof node === "string" ? <Breadcrumb.Link href="#">{node}</Breadcrumb.Link> : node}
            </Breadcrumb.Item>
          </React.Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

/** 줄임표 — 숨긴 경로를 메뉴로 연다. 목록을 CSS로 감추기만 하지 않는다. */
const collapsed = (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <Breadcrumb.Link asChild>
        <button type="button" aria-label="숨긴 경로 3개 보기" style={{ display: "inline-flex", border: 0, padding: 0, background: "none", cursor: "pointer" }}>
          <MoreIcon />
        </button>
      </Breadcrumb.Link>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item>상품</DropdownMenu.Item>
      <DropdownMenu.Item>전자기기</DropdownMenu.Item>
      <DropdownMenu.Item>주변기기</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

const one = (label: string, force?: "hover" | "focus") => (
  <FlexState label={label} force={force}>
    <Breadcrumb.Root><Breadcrumb.List><Breadcrumb.Item><Breadcrumb.Link href="#">주문 관리</Breadcrumb.Link></Breadcrumb.Item></Breadcrumb.List></Breadcrumb.Root>
  </FlexState>
);

const PATH = ["홈", "주문 관리", "ORD-24091"];

/** 상세 페이지 머리 — 안마다 경로·뒤로가기·제목의 조합이 다르다. */
function PageHead({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  if (v.variant === "b") {
    return mobile ? (
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginInlineStart: -8 }}>
          <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="주문 관리로 돌아가기"><ArrowLeftIcon size={20} /></Button>
          <span style={weak}>주문 관리</span>
        </div>
        <h3 style={heading}>주문 ORD-24091</h3>
        <p style={weak}>10월 2일 결제 완료</p>
      </div>
    ) : (
      <div style={{ display: "grid", gap: 8 }}>
        <Trail path={PATH} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="주문 관리로 돌아가기" style={{ marginInlineStart: -8 }}><ArrowLeftIcon size={20} /></Button>
          <h3 style={{ ...heading, flex: 1, minWidth: 0 }}>주문 ORD-24091</h3>
          <Button>배송 시작</Button>
        </div>
        <p style={weak}>10월 2일 결제 완료</p>
      </div>
    );
  }
  if (v.variant === "a" && mobile) {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item><Breadcrumb.Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><ChevronLeftIcon />주문 관리</Breadcrumb.Link></Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h3 style={heading}>주문 ORD-24091</h3>
        <p style={weak}>10월 2일 결제 완료</p>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Trail path={PATH} />
      <h3 style={heading}>주문 ORD-24091</h3>
      <p style={weak}>10월 2일 결제 완료</p>
      <div style={{ display: "flex", gap: 8 }}>
        <Button intent="neutral" variant="weak">영수증 보기</Button>
        <Button>배송 시작</Button>
      </div>
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const isCurrent = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Breadcrumb"
      summary={
        isB
          ? "치수는 그대로입니다. 경로·뒤로가기·제목을 한 페이지 내비게이션 단위로 묶고, 뒤로가기는 경로의 바로 위 단계와 같은 곳으로 갑니다."
          : v.variant === "a"
            ? "보조 위치 정보로 현재 크기를 유지하고 제목 위에 둡니다. 모바일은 앱이 '부모로 돌아가기 + 현재 위치'로 줄입니다."
            : "현재 DDS 경로입니다. 상위 단계는 링크, 현재 페이지는 굵은 일반 텍스트입니다."
      }
    >
      <FlexSection
        title="페이지 머리"
        note={
          isB
            ? mobile
              ? "모바일은 뒤로가기 + 상위 이름 + 제목입니다. 전체 경로는 뒤로가기가 대신합니다."
              : "경로는 위치, 뒤로가기는 직전 단계, 주 행동은 제목 줄에 하나입니다(R04)."
            : v.variant === "a"
              ? mobile ? "부모 링크 하나와 현재 제목으로 줄입니다(앱 조합)." : "경로는 제목 위에 두고 큰 제목·탭과 경쟁하지 않게 합니다."
              : mobile ? "현재는 축약 조합이 없어 전체 경로를 그대로 씁니다(길면 줄바꿈)." : "경로를 제목 위에 둡니다. 뒤로가기와의 관계는 정하지 않습니다."
        }
      >
        <FlexState label="주문 상세" block><PageHead v={v} /></FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={2}>
        {one("link default")}
        {one("link hover", "hover")}
        {one("link focus", "focus")}
        <FlexState label="current page"><Breadcrumb.Root><Breadcrumb.List><Breadcrumb.Item><Breadcrumb.Page>주문 상세</Breadcrumb.Page></Breadcrumb.Item></Breadcrumb.List></Breadcrumb.Root></FlexState>
      </FlexSection>

      <FlexSection title="긴 경로" note="줄임표는 숨긴 단계를 메뉴로 엽니다. 모든 안이 같습니다.">
        <FlexState label="5단계" block><Trail path={["홈", "상품", "전자기기", "키보드", "무선 키보드 K3"]} /></FlexState>
        <FlexState label="7단계 접음 · 처음 + 줄임표 + 마지막 둘" block><Trail path={["홈", collapsed, "키보드", "무선 키보드 K3 블루투스 저소음 적축"]} /></FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={[]} extra={[
        ["글자", "13 / 18, 현재 페이지 bold", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["항목 간격 / 구분자", "6px / chevron 16", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ...(isB ? [["뒤로가기", "small 아이콘 버튼 36 · 아이콘 20", "D Button small 재사용"]] as const : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={640} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
