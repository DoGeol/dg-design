import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Card } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Badge", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const INTENTS = [
  ["brand", "신규"],
  ["neutral", "초안"],
  ["critical", "반려"],
  ["positive", "게시됨"],
  ["warning", "검토 중"],
  ["informative", "예약됨"],
] as const;
/** 시안 칸 배경이 neutral-weak라 같은 색을 쓰는 요소가 묻힌다. 실제 화면처럼 흰 표면 위에 둔다. */
const surface = { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 8, background: "var(--dds-color-bg-layer-default)" } as const;
const VARIANTS = ["solid", "weak", "outline"] as const;

const POSTS = [
  { title: "10월 정기 점검 안내", author: "운영팀", date: "2026.10.02", status: "positive", label: "게시됨" },
  { title: "추석 연휴 배송 일정", author: "물류팀", date: "2026.09.30", status: "warning", label: "검토 중" },
  { title: "개인정보 처리방침 개정", author: "법무팀", date: "2026.09.28", status: "informative", label: "예약됨" },
  { title: "가을 신상품 기획전", author: "마케팅팀", date: "2026.09.25", status: "critical", label: "반려" },
] as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Badge" summary="상태·분류를 짧은 단어로 표시합니다. 누를 수 없는 요소라 hover·focus 상태가 없습니다. 목록에는 weak, 강조 한 곳에만 solid를 씁니다.">
      <MockupSection title="intent × variant" columns={6} note="medium 크기입니다.">
        {VARIANTS.flatMap((variant) =>
          INTENTS.map(([intent, text]) => (
            <MockupState key={`${variant}-${intent}`} label={`${intent} · ${variant}`}>
              <div style={surface}><Badge intent={intent} variant={variant}>{text}</Badge></div>
            </MockupState>
          )),
        )}
      </MockupSection>

      <MockupSection title="크기" columns={4}>
        <MockupState label="medium · 20"><div style={surface}><Badge intent="positive">게시됨</Badge><Badge intent="brand" variant="solid">신규</Badge></div></MockupState>
        <MockupState label="large · 24"><div style={surface}><Badge intent="positive" size="large">게시됨</Badge><Badge intent="brand" variant="solid" size="large">신규</Badge></div></MockupState>
        <MockupState label="truncate · 폭 96px (시안 보정: 말줄임)" span={2}>
          <div style={surface}><div style={{ width: 96 }}>
            <Badge intent="neutral" size="large" truncate title="외부 협력사 공유 문서">외부 협력사 공유 문서</Badge>
          </div></div>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예 · 공지 목록" columns={1}>
        <MockupState label="상태는 weak, 새 글 표시만 brand solid">
          <Card style={{ width: "100%", paddingBlock: 4 }}>
            {POSTS.map((p, i) => (
              <div key={p.title} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i === POSTS.length - 1 ? "none" : "1px solid var(--dds-color-stroke-neutral-weak)",
              }}>
                <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <strong style={{ fontSize: 14, lineHeight: "19px" }}>{p.title}</strong>
                  {i === 0 && <Badge intent="brand" variant="solid">신규</Badge>}
                </span>
                <span style={{ width: 80, fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>{p.author}</span>
                <span style={{ width: 88, fontSize: 13, color: "var(--dds-color-fg-neutral-weak)", fontVariantNumeric: "tabular-nums" }}>{p.date}</span>
                <span style={{ width: 64 }}><Badge intent={p.status} size="large">{p.label}</Badge></span>
              </div>
            ))}
          </Card>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["높이 medium / large", "20 / 24px", "--dds-dimension-x5 / x6"],
        ["radius medium / large", "4 / 6px", "--dds-radius-r1 / r1_5"],
        ["좌우 패딩 medium / large", "6 / 8px", "--dds-dimension-x1_5 / x2"],
        ["글자 medium / large", "11px / 15px · 12px / 16px", "--dds-font-size-t1 / t2"],
        ["굵기", "solid bold · weak·outline regular", "--dds-font-weight-bold / regular"],
        ["solid 배경 (글자)", "brand #1550A9 · neutral #3B3D40 · critical #9B1C22 · positive #196623 (흰 글자) · warning #D4AB4F (#101214) · informative #175891 (흰 글자)", "--dds-color-bg-{intent}-solid / fg-{intent}-contrast"],
        ["weak 배경", "brand #F1F5FC · neutral #F3F5F9 · critical #FCF3F2 · positive #E7FCE7 · warning #FCF4E5 · informative #F0F6FC", "--dds-color-bg-{intent}-weak"],
        ["weak 글자 · outline 글자와 테두리", "brand #0B397E · neutral #252629 · critical #731115 · positive #0F4A17 · warning #4D3A0C · informative #0D3F6A", "--dds-color-fg-{intent}"],
        ["outline 테두리", "1px, 배경 투명", "—"],
        ["truncate", "max-width 100%, 넘치면 끝에 말줄임표 (시안 보정: inline-block + line-height 20/24px)", "--dds-dimension-x5 / x6"],
      ]} />
    </MockupPage>
  ),
};
