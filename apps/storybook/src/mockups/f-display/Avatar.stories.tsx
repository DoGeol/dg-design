import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Avatar, Card } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Avatar", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Size = "small" | "medium" | "large" | "xlarge";

/** 외부 URL 없이 쓰는 인물 일러스트(data URI). */
function portrait(bg: string, skin: string, hair: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' fill='${bg}'/><circle cx='32' cy='26' r='12' fill='${skin}'/><path d='M20 24c0-9 6-14 12-14s12 5 12 14c-3-4-7-6-12-6s-9 2-12 6z' fill='${hair}'/><path d='M10 64c3-13 12-20 22-20s19 7 22 20' fill='${hair}'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
const PHOTO_A = portrait("#C4D5F0", "#F3D9C2", "#3B3D40");
const PHOTO_B = portrait("#E7FCE7", "#E8C4A6", "#5A3E2B");
const PHOTO_C = portrait("#FCF4E5", "#F6DEC9", "#252629");
const BROKEN = "data:image/svg+xml;base64,not-a-valid-image";

function PersonIcon() {
  return (
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function OnlineBadge({ size }: { size: Size }) {
  const d = { small: 8, medium: 10, large: 12, xlarge: 14 }[size];
  return (
    <Avatar.Badge
      aria-label="온라인"
      style={{ width: d, height: d, borderRadius: "var(--dds-radius-r-full)", background: "var(--dds-color-bg-positive-solid)", boxShadow: "0 0 0 2px var(--dds-color-bg-layer-default)" }}
    />
  );
}

function A({ size = "medium", src, name, initial, icon, badge, style }: {
  size?: Size; src?: string; name: string; initial?: string; icon?: boolean; badge?: boolean; style?: React.CSSProperties;
}) {
  return (
    <Avatar.Root size={size} style={style}>
      {src && <Avatar.Image src={src} alt={name} />}
      <Avatar.Fallback aria-label={name}>{icon ? <PersonIcon /> : initial}</Avatar.Fallback>
      {badge && <OnlineBadge size={size} />}
    </Avatar.Root>
  );
}

/** 실제로 놓이는 흰 면. 칸 배경(#F3F5F9)이 fallback 배경과 같아 그대로 두면 이니셜이 묻힌다. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--dds-dimension-x2)", padding: "var(--dds-dimension-x3)", borderRadius: "var(--dds-radius-r2)", background: "var(--dds-color-bg-layer-default)" }}>{children}</div>;
}

const ring: React.CSSProperties = { boxShadow: "0 0 0 2px var(--dds-color-bg-layer-default)" };

function Group({ size = "medium" }: { size?: Size }) {
  const overlap = { small: -6, medium: -8, large: -12, xlarge: -16 }[size];
  return (
    <div role="group" aria-label="참여자 5명" style={{ display: "flex", alignItems: "center" }}>
      <A size={size} src={PHOTO_A} name="편도걸" style={ring} />
      <A size={size} src={PHOTO_B} name="김하늘" style={{ ...ring, marginLeft: overlap }} />
      <A size={size} name="이서준" initial="이" style={{ ...ring, marginLeft: overlap }} />
      <A size={size} name="외 2명" initial="+2" style={{ ...ring, marginLeft: overlap }} />
    </div>
  );
}

const SIZES: [Size, number][] = [["small", 24], ["medium", 36], ["large", 48], ["xlarge", 64]];

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Avatar" summary="사람을 나타내는 원형 요소입니다. 이미지가 없거나 실패하면 이니셜, 이름도 없으면 사람 아이콘으로 대체합니다.">
      <MockupSection title="내용" columns={4} note="이미지 → 이니셜 → 아이콘 순으로 대체합니다. large 기준입니다.">
        <MockupState label="image · loaded"><Surface><A size="large" src={PHOTO_A} name="편도걸" /></Surface></MockupState>
        <MockupState label="fallback · 이니셜"><Surface><A size="large" name="김하늘" initial="김" /></Surface></MockupState>
        <MockupState label="fallback · 아이콘"><Surface><A size="large" name="이름 없는 사용자" icon /></Surface></MockupState>
        <MockupState label="error · 이미지 실패 → 이니셜"><Surface><A size="large" src={BROKEN} name="이서준" initial="이" /></Surface></MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={4} note="이니셜 글자 크기는 시안 보정입니다(현재 컴포넌트는 14px 고정).">
        {SIZES.map(([size, px]) => (
          <MockupState key={size} label={`${size} · ${px}`}>
            <Surface>
              <A size={size} src={PHOTO_B} name="김하늘" />
              <A size={size} name="편도걸" initial="편" />
              <A size={size} name="이름 없는 사용자" icon />
            </Surface>
          </MockupState>
        ))}
      </MockupSection>

      <MockupSection title="배지 · 그룹" columns={2} note="Badge는 오른쪽 아래에 18% 걸쳐 놓입니다. 그룹은 2px 흰 테두리로 겹침을 구분합니다.">
        <MockupState label="badge · 온라인">
          <Surface>{SIZES.map(([size]) => <A key={size} size={size} src={PHOTO_C} name="박지민" badge />)}</Surface>
        </MockupState>
        <MockupState label="group · 최대 3명 + 나머지 수">
          <Surface>
            <Group size="small" />
            <Group size="medium" />
            <Group size="large" />
          </Surface>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="댓글 작성자 · medium">
          <div style={{ display: "flex", gap: "var(--dds-dimension-x3)", alignItems: "flex-start", width: "100%" }}>
            <A src={PHOTO_A} name="편도걸" />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x1)", minWidth: 0 }}>
              <span style={{ display: "flex", gap: "var(--dds-dimension-x2)", alignItems: "baseline" }}>
                <strong>편도걸</strong>
                <span style={{ fontSize: "var(--dds-font-size-t2)", color: "var(--dds-color-fg-neutral-weak)" }}>2026.10.02 14:20</span>
              </span>
              <span>배포 전에 다크 모드 대비를 한 번 더 확인하겠습니다.</span>
            </div>
          </div>
        </MockupState>
        <MockupState label="프로필 카드 · xlarge + 배지">
          <Card style={{ display: "flex", alignItems: "center", gap: "var(--dds-dimension-x4)", width: "100%" }}>
            <A size="xlarge" src={PHOTO_C} name="박지민" badge />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x1)" }}>
              <strong style={{ fontSize: "var(--dds-font-size-t6)", lineHeight: "var(--dds-line-height-t6)" }}>박지민</strong>
              <span style={{ color: "var(--dds-color-fg-neutral-weak)" }}>프로덕트 디자이너 · 온라인</span>
            </div>
          </Card>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["크기 small / medium / large / xlarge", "24 / 36 / 48 / 64px", "— (avatar.css 고정 px)"],
        ["모양", "원형", "--dds-radius-r-full"],
        ["테두리", "1px #E5E8EB", "--dds-color-stroke-neutral-weak"],
        ["fallback 배경 / 글자", "#F3F5F9 / #252629", "--dds-color-bg-neutral-weak / fg-neutral"],
        ["이니셜 글자 (시안 보정)", "11 / 13 / 16 / 20px · bold", "--dds-font-size-t1 / t3 / t5 / t7"],
        ["대체 아이콘", "지름의 60%, stroke 1.5", undefined],
        ["Badge 위치", "오른쪽 아래, translate(18%, 18%)", undefined],
        ["온라인 배지 (예시)", "#196623 + 2px 흰 테두리", "--dds-color-bg-positive-solid"],
        ["그룹 겹침", "small / medium / large 6 / 8 / 12px, 2px 흰 테두리", "--dds-color-bg-layer-default"],
        ["이미지 등장", "기본 즉시 · motion=\"auto\"면 150ms 페이드", "--dds-duration-fast"],
      ]} />
    </MockupPage>
  ),
};
