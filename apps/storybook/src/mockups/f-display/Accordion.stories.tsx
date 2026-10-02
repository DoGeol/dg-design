import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Accordion } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Accordion", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Variant = "inline" | "separated";
type Size = "medium" | "large";

function Svg({ size = 20, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
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
          <Accordion.SuffixIcon><Svg><path d="m6 9 6 6 6-6" /></Svg></Accordion.SuffixIcon>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content><Accordion.Body>{body}</Accordion.Body></Accordion.Content>
    </Accordion.Item>
  );
}

const SETTINGS: ItemData[] = [
  { value: "profile", icon: "user", title: "프로필", description: "이름과 소개를 관리합니다.", body: "공개 프로필에 표시되는 이름과 소개 문구를 바꿀 수 있습니다." },
  { value: "notification", icon: "bell", title: "알림", description: "준비 중인 설정입니다.", disabled: true, body: "알림 설정은 다음 업데이트에서 제공합니다." },
  { value: "security", icon: "lock", title: "보안", description: "로그인 기록과 2단계 인증을 관리합니다.", body: "최근 30일 로그인 기록을 확인하고 2단계 인증을 켤 수 있습니다." },
];

const FAQ: ItemData[] = [
  { value: "refund", title: "환불은 언제 처리됩니까?", body: "취소 요청 후 영업일 기준 3일 안에 결제 수단으로 환불됩니다." },
  { value: "plan", title: "플랜은 언제든 바꿀 수 있습니까?", body: "다음 결제일부터 바뀐 플랜이 적용되며, 남은 기간은 일할 계산합니다." },
  { value: "invoice", title: "세금계산서를 받을 수 있습니까?", body: "결제 설정에서 사업자 정보를 등록하면 매월 1일에 발행됩니다." },
];

function Demo({ items = SETTINGS, variant = "inline", size = "medium", open = [], multiple, disabled }: {
  items?: ItemData[]; variant?: Variant; size?: Size; open?: string[]; multiple?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{ width: "100%", background: "var(--dds-color-bg-layer-default)", borderRadius: "var(--dds-radius-r2)", wordBreak: "keep-all" }}>
      <Accordion.Root variant={variant} size={size} defaultValues={open} multiple={multiple} disabled={disabled}>
        {items.map((it) => <Item key={it.value} {...it} />)}
      </Accordion.Root>
    </div>
  );
}

const ONE = SETTINGS.slice(0, 1);

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Accordion" summary="관련 항목 여러 개를 접어 두고 필요한 것만 펼칩니다. 기본은 한 번에 하나만 열립니다.">
      <MockupSection title="열림 방식" columns={2} note="single은 다른 항목을 열면 기존 항목이 닫힙니다.">
        <MockupState label="single · 하나 열림"><Demo open={["profile"]} /></MockupState>
        <MockupState label="multiple · 여러 개 열림"><Demo items={FAQ} multiple open={["refund", "invoice"]} /></MockupState>
      </MockupSection>

      <MockupSection title="변형 · 크기" columns={2}>
        <MockupState label="inline · medium · 항목 사이 구분선"><Demo /></MockupState>
        <MockupState label="separated · medium · 항목 간격 12"><Demo variant="separated" /></MockupState>
        <MockupState label="inline · large"><Demo size="large" open={["security"]} /></MockupState>
        <MockupState label="separated · large · 항목 간격 16"><Demo variant="separated" size="large" open={["security"]} /></MockupState>
      </MockupSection>

      <MockupSection title="트리거 상태" columns={3} note="inline · medium 기준입니다.">
        <MockupState label="default · closed"><Demo items={ONE} /></MockupState>
        <MockupState label="hover" force="hover"><Demo items={ONE} /></MockupState>
        <MockupState label="pressed" force="pressed"><Demo items={ONE} /></MockupState>
        <MockupState label="focus" force="focus"><Demo items={ONE} /></MockupState>
        <MockupState label="open"><Demo items={ONE} open={["profile"]} /></MockupState>
        <MockupState label="disabled · Root 전체"><Demo items={ONE} disabled /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="자주 묻는 질문 · separated, 제목만">
          <div style={{ width: "100%", maxWidth: 640 }}>
            <Accordion.Root variant="separated" defaultValues={["plan"]}>
              {FAQ.map((it) => <Item key={it.value} {...it} />)}
            </Accordion.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["트리거 패딩 medium / large", "16 × 16 / 20 × 16px (세로 × 가로)", "--dds-dimension-x4 / x5, x4"],
        ["제목 medium / large", "16 / 20px · bold #252629", "--dds-font-size-t5 / t7, fg-neutral"],
        ["설명 medium / large", "13 / 16px · #6D6F72, 제목과 간격 2px", "--dds-font-size-t3 / t5, fg-neutral-weak"],
        ["Prefix · SuffixIcon 간격", "12px", "--dds-dimension-x3"],
        ["본문 패딩 medium / large", "0 16 16 / 0 16 20px", "--dds-dimension-x4 / x5"],
        ["inline 구분선", "1px #E5E8EB, 좌우 12px 안쪽", "--dds-color-stroke-neutral-weak, x3"],
        ["separated 항목", "1px #E5E8EB, radius 8px, 간격 12 / 16px", "--dds-radius-r2, --dds-dimension-x3 / x4"],
        ["hover / pressed 배경", "rgb(16 18 20 / 0.06) / 0.12", "--dds-color-bg-transparent-hover / -pressed"],
        ["focus ring", "2px #1550A9, 안쪽 offset -2px", "--dds-color-stroke-focus-ring"],
        ["disabled 글자·아이콘", "#8A8C8F", "--dds-color-fg-disabled"],
        ["chevron", "20px stroke 1.75 #6D6F72, 열리면 180도 200ms", "--dds-duration-base"],
      ]} />
    </MockupPage>
  ),
};
