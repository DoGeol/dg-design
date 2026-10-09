import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { Accordion } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { ChevronDownIcon } from "./icons";

const meta = { title: "Mockups/Flex/Navigation/Accordion", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function Svg({ children }: { children: React.ReactNode }) {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
const ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
};

type ItemData = { value: string; title: string; description?: string; icon?: keyof typeof ICONS; disabled?: boolean; body: string };

function Item({ value, title, description, icon, disabled, body }: ItemData) {
  return (
    <Accordion.Item value={value} disabled={disabled}>
      <Accordion.Header>
        <Accordion.Trigger>
          {icon && <Accordion.Prefix><Svg>{ICONS[icon]}</Svg></Accordion.Prefix>}
          <Accordion.Body>
            <Accordion.Title>{title}</Accordion.Title>
            {description && <Accordion.Description>{description}</Accordion.Description>}
          </Accordion.Body>
          <Accordion.SuffixIcon><ChevronDownIcon size={20} /></Accordion.SuffixIcon>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content><Accordion.Body>{body}</Accordion.Body></Accordion.Content>
    </Accordion.Item>
  );
}

const FAQ: ItemData[] = [
  { value: "refund", title: "환불은 언제 처리됩니까?", body: "취소 요청 후 영업일 기준 3일 안에 결제 수단으로 환불됩니다." },
  { value: "plan", title: "플랜은 언제든 바꿀 수 있습니까? 바꾸면 남은 기간은 어떻게 계산됩니까?", body: "다음 결제일부터 바뀐 플랜이 적용되며 남은 기간은 일할 계산합니다." },
  { value: "invoice", title: "세금계산서를 받을 수 있습니까?", body: "결제 설정에서 사업자 정보를 등록하면 매월 1일에 발행됩니다." },
];

const SETTINGS: ItemData[] = [
  { value: "profile", icon: "user", title: "프로필", description: "이름과 소개를 관리합니다.", body: "공개 프로필에 표시되는 이름과 소개 문구를 바꿀 수 있습니다." },
  { value: "security", icon: "lock", title: "보안", description: "로그인 기록과 2단계 인증", body: "최근 30일 로그인 기록을 확인하고 2단계 인증을 켤 수 있습니다." },
];

/** 상태 칸용 — 항목 하나. */
function One({ open, disabled }: { open?: boolean; disabled?: boolean }) {
  return (
    <Accordion.Root defaultValues={open ? ["x"] : []} style={{ width: "100%" }}>
      <Item value="x" title="환불 정책" disabled={disabled} body="영업일 기준 3일 안에 환불됩니다." />
    </Accordion.Root>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const isCurrent = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Accordion"
      summary={
        isB
          ? "본문 disclosure는 그대로 씁니다. 목록 그룹 제목의 접기·추가 행동은 Accordion이 아니라 목록 섹션 조합으로 다룹니다."
          : v.variant === "a"
            ? "현재 여백을 유지합니다. 아이콘 유무와 관계없이 본문이 제목 시작선에 맞고, 들여쓰기는 논리 속성으로 옮기는 것을 검토합니다."
            : "현재 DDS 아코디언입니다. inline은 구분선, separated는 r8 테두리 상자입니다."
      }
    >
      <FlexSection title="inline · 자주 묻는 질문" note="긴 제목은 줄바꿈합니다. 헤더 전체가 조작 영역입니다.">
        <FlexState label="두 번째 항목 열림" block>
          <Accordion.Root defaultValues={["plan"]}>{FAQ.map((d) => <Item key={d.value} {...d} />)}</Accordion.Root>
        </FlexState>
      </FlexSection>

      <FlexSection title="상태" columns={2} note="chevron이 열림을, 2px 안쪽 링이 focus를 나타냅니다.">
        <FlexState label="default" block><One /></FlexState>
        <FlexState label="hover" force="hover" block><One /></FlexState>
        <FlexState label="focus" force="focus" block><One /></FlexState>
        <FlexState label="pressed" force="pressed" block><One /></FlexState>
        <FlexState label="open" block><One open /></FlexState>
        <FlexState label="open · hover" force="hover" block><One open /></FlexState>
        <FlexState label="open · focus" force="focus" block><One open /></FlexState>
        <FlexState label="disabled" block><One disabled /></FlexState>
      </FlexSection>

      <FlexSection title="separated · prefix" note="펼친 본문은 prefix 폭만큼 들여 제목 시작선에 맞춥니다.">
        <FlexState label="설정 묶음" block>
          <Accordion.Root variant="separated" defaultValues={["profile"]}>{SETTINGS.map((d) => <Item key={d.value} {...d} />)}</Accordion.Root>
        </FlexState>
      </FlexSection>

      {isB && (
        <FlexSection
          title="Accordion과 목록 섹션 그룹"
          note="노트만 — 목록 섹션 그룹은 새 종류(List/SectionHeader) 묶음에서 다룹니다."
        >
          <FlexState label="역할 구분" block>
            <ul style={{ margin: 0, paddingInlineStart: 18, display: "grid", gap: 4, fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" }}>
              <li>Accordion — 본문 설명·FAQ·설정 설명처럼 읽을 내용을 접습니다. 트리거는 헤더 전체입니다.</li>
              <li>목록 섹션 — 객체 행 묶음의 제목입니다. 접기와 '추가' 같은 그룹 행동이 제목 줄에 함께 놓이므로 Accordion 트리거 안에 넣지 않습니다.</li>
            </ul>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={[]} extra={[
        ["트리거 여백", "세로 16 · 좌우 16 (large 20)", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["제목 / 설명", "16/20 bold · 13/18", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["separated", "r8 · 1px stroke-neutral-weak · 항목 간격 12", isCurrent ? "DDS 선언값" : "D 현재 값"],
        ["prefix 들여쓰기", isCurrent ? "padding-left (물리)" : "padding-inline-start 검토", isCurrent ? "DDS 선언값" : "C RTL 대비 — 값 동일"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
