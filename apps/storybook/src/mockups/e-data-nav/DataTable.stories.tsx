import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Badge, Button, DataTable, type DataColumn } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/DataTable", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Member = { id: string; name: string; email: string; plan: "무료" | "프로" | "팀"; status: "활성" | "휴면" | "정지"; joined: string; spent: number };

// 24명 회원: [이름, 이메일 아이디]
const PEOPLE = [
  ["김도경", "dokyung.kim"], ["이서준", "seojun.lee"], ["박하늘", "haneul.park"], ["최윤아", "yoona.choi"],
  ["정민호", "minho.jung"], ["강지우", "jiwoo.kang"], ["윤채원", "chaewon.yoon"], ["장현우", "hyunwoo.jang"],
  ["임수빈", "subin.lim"], ["한예린", "yerin.han"], ["오태윤", "taeyun.oh"], ["서다은", "daeun.seo"],
  ["신우진", "woojin.shin"], ["권나연", "nayeon.kwon"], ["황도윤", "doyoon.hwang"], ["안소율", "soyul.ahn"],
  ["송재민", "jaemin.song"], ["류하은", "haeun.ryu"], ["전시우", "siwoo.jeon"], ["홍지안", "jian.hong"],
  ["고은채", "eunchae.ko"], ["문건우", "gunwoo.moon"], ["양서아", "seoa.yang"], ["배준혁", "junhyuk.bae"],
] as const;
const PLANS = ["무료", "프로", "팀"] as const;
const STATUSES = ["활성", "활성", "활성", "휴면", "활성", "정지"] as const;

const MEMBERS: Member[] = PEOPLE.map(([name, mail], i) => ({
  id: `M-${String(10231 + i)}`,
  name,
  email: `${mail}@example.com`,
  plan: PLANS[(i * 7) % 3]!,
  status: STATUSES[i % STATUSES.length]!,
  joined: `2026-${String(1 + (i % 9)).padStart(2, "0")}-${String(3 + ((i * 11) % 25)).padStart(2, "0")}`,
  spent: ((i * 37) % 19) * 12000 + 9900,
}));

const STATUS_INTENT = { 활성: "positive", 휴면: "neutral", 정지: "critical" } as const;
const toOptions = (values: readonly string[]) => [...new Set(values)].map((v) => ({ label: v, value: v }));

const COLUMNS: DataColumn<Member>[] = [
  { field: "name", header: "이름", sortable: true, filter: "text", width: 140, pin: "left" },
  { field: "email", header: "이메일", filter: "text", width: 240 },
  { field: "plan", header: "요금제", filter: { options: toOptions(PLANS) }, width: 120 },
  { field: "joined", header: "가입일", sortable: true, width: 130 },
  { field: "spent", header: "누적 결제", sortable: true, width: 130, cell: (m) => `${m.spent.toLocaleString("ko-KR")}원` },
  {
    field: "status", header: "상태", filter: { options: toOptions(STATUSES) }, width: 110, pin: "right",
    cell: (m) => <Badge intent={STATUS_INTENT[m.status]}>{m.status}</Badge>,
  },
];
const COMPACT = COLUMNS.filter((c) => c.field !== "email" && c.field !== "spent");

/** 고정 헤더를 보이려고 스크롤 영역을 미리 내려 둔다. DataTable은 ref를 받지 않아 바깥 div에서 찾는다. */
function Scrolled({ by, children }: { by: number; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const id = window.setTimeout(() => ref.current?.querySelector('[role="region"]')?.scrollTo(0, by), 100);
    return () => window.clearTimeout(id);
  }, [by]);
  return <div ref={ref} style={{ width: "100%" }}>{children}</div>;
}

const box = { width: "100%", background: "var(--dds-color-bg-layer-default)", borderRadius: 12, padding: "0 4px", overflow: "hidden" } as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="DataTable" summary="불러온 행 안에서 정렬·필터·선택을 처리하는 표입니다. 열 머리글 아래에 필터가 붙고, 이름과 상태 열은 가로 스크롤에도 고정됩니다.">
      <MockupSection title="정렬 · 필터 · 행 선택" columns={1} note="이름 오름차순 정렬, 3행 선택(머리글 체크박스는 일부 선택), 24행 중 앞부분입니다.">
        <MockupState label="selectable · defaultSort 이름 오름차순 · 선택 3">
          <div style={box}>
            <DataTable
              data={MEMBERS}
              rowKey="id"
              caption="회원 목록"
              columns={COLUMNS}
              selectable
              defaultSort={{ id: "name", direction: "asc" }}
              defaultSelectedKeys={["M-10231", "M-10236", "M-10240"]}
              virtual={{ height: 420, rowHeight: 48 }}
            />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={2} note="고정 헤더는 스크롤 영역 높이가 있어야 동작하므로 virtual 높이로 영역을 정합니다.">
        <MockupState label="고정 헤더 · 아래로 스크롤한 상태">
          <div style={box}>
            <Scrolled by={260}>
              <DataTable
                data={MEMBERS}
                rowKey="id"
                caption="회원 목록"
                columns={COMPACT}
                defaultSort={{ id: "joined", direction: "desc" }}
                virtual={{ height: 300, rowHeight: 48 }}
              />
            </Scrolled>
          </div>
        </MockupState>
        <MockupState label="빈 결과 · 이름 필터 일치 없음">
          <div style={box}>
            <DataTable
              data={MEMBERS}
              rowKey="id"
              caption="회원 목록"
              columns={COMPACT}
              selectable
              defaultFilters={{ name: "홍길동" }}
            />
          </div>
        </MockupState>
        <MockupState label="필터 적용 · 상태 = 정지">
          <div style={box}>
            <DataTable data={MEMBERS} rowKey="id" caption="회원 목록" columns={COMPACT} defaultFilters={{ status: "정지" }} />
          </div>
        </MockupState>
        <MockupState label="정렬 내림차순 · 누적 결제">
          <div style={box}>
            <DataTable
              data={MEMBERS.slice(0, 4)}
              rowKey="id"
              caption="회원 목록"
              columns={COLUMNS.filter((c) => c.field === "name" || c.field === "spent")}
              defaultSort={{ id: "spent", direction: "desc" }}
            />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="회원 관리 · 선택 시 일괄 작업 막대">
          <div style={{ ...box, display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px", background: "var(--dds-color-bg-brand-weak)", borderRadius: 8, margin: "8px 0" }}>
              <span style={{ fontWeight: 700, color: "var(--dds-color-fg-brand)" }}>2명 선택됨</span>
              <span style={{ display: "flex", gap: 8 }}>
                <Button size="small" intent="neutral" variant="weak">요금제 변경</Button>
                <Button size="small" intent="critical" variant="weak">계정 정지</Button>
              </span>
            </div>
            <DataTable
              data={MEMBERS.slice(0, 6)}
              rowKey="id"
              caption="휴면 전환 예정 회원"
              columns={COLUMNS}
              selectable
              defaultSelectedKeys={["M-10232", "M-10234"]}
            />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["셀 패딩", "12px 위아래 · 16px 좌우 (virtual은 위아래 0 + 행 높이 고정)", "--dds-dimension-x3 / x4"],
        ["행 높이 (virtual)", "소비자 지정 · 시안 48px", "virtual.rowHeight"],
        ["선택 열 폭", "44px · 체크박스 16px · radius 4", "토큰 없음 · --dds-dimension-x4 · --dds-radius-r1"],
        ["머리글", "13px bold #6D6F72 · 배경 #FFFFFF · 아래 1px #E5E8EB · sticky top 0", "--dds-font-size-t3 · --dds-color-bg-layer-default"],
        ["정렬 아이콘 (시안 보정)", "16px stroke 셰브론 · 정렬 중 #252629, 미정렬 #8A8C8F", "--dds-color-fg-neutral / fg-disabled"],
        ["필터 입력 (시안 보정)", "높이 32px · 좌우 8px · radius 8 · 1px #E5E8EB · 13px regular · 머리글과 8px", "--dds-dimension-x8 / x2 · --dds-radius-r2"],
        ["고정 열 배경 / hover", "#FFFFFF / #F3F5F9", "--dds-color-bg-layer-default / bg-neutral-weak"],
        ["선택 행 배경 (시안 보정)", "#F1F5FC", "--dds-color-bg-brand-weak"],
        ["행 구분선", "아래 1px #E5E8EB", "--dds-color-stroke-neutral-weak"],
        ["빈 결과", "가운데 정렬 14px #6D6F72 · \"표시할 데이터가 없습니다.\"", "--dds-color-fg-neutral-weak"],
        ["focus (스크롤 영역·정렬·필터)", "2px #1550A9 outline · offset 2px", "--dds-color-stroke-focus-ring"],
      ]} />
    </MockupPage>
  ),
};
