import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button, Card, Checkbox, Sheet, TextField } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";
import { CloseIcon, FilterIcon, ShareIcon } from "./icons";

const meta = { title: "Mockups/A/Sheet", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;

type Side = "bottom" | "right";

/** 제목 + 닫기 아이콘 버튼. Sheet.Title은 그대로 쓰고 줄만 나눈다. */
function Header({ title, closeRef }: { title: string; closeRef: React.Ref<HTMLButtonElement> }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <Sheet.Title>{title}</Sheet.Title>
      <Sheet.Close asChild>
        <Button ref={closeRef} size="small" intent="neutral" variant="ghost" aria-label="닫기"><CloseIcon size={18} /></Button>
      </Sheet.Close>
    </div>
  );
}

/** side마다 대표 사용 예 하나. trigger를 주면 닫힌 채 트리거로 연다. */
function ExampleSheet({ side, trigger }: { side: Side; trigger?: React.ReactElement }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Sheet.Root side={side} defaultOpen={!trigger} initialFocusRef={closeRef}>
      {trigger && <Sheet.Trigger asChild>{trigger}</Sheet.Trigger>}
      <Sheet.Overlay />
      {side === "bottom" ? (
        <Sheet.Content>
          <Header title="링크로 공유" closeRef={closeRef} />
          <Sheet.Description>링크가 있는 사람은 로그인 없이 읽을 수 있습니다. 편집 권한은 주지 않습니다.</Sheet.Description>
          <div style={{ display: "flex", gap: 8, maxWidth: 640 }}>
            <TextField aria-label="공유 링크" readOnly defaultValue="https://dogeol.dev/s/2026-portfolio" style={{ flex: 1, minWidth: 0 }} />
            <Button>링크 복사</Button>
          </div>
          <p style={weak}>링크는 2026.10.31까지 유효합니다.</p>
        </Sheet.Content>
      ) : (
        <Sheet.Content>
          <Header title="필터" closeRef={closeRef} />
          <Sheet.Description>조건에 맞는 프로젝트만 목록에 보입니다.</Sheet.Description>
          <fieldset style={{ border: 0, padding: 0, margin: "8px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
            <legend style={{ fontWeight: "var(--dds-font-weight-bold)", marginBottom: 12 }}>상태</legend>
            <Checkbox defaultChecked>진행 중</Checkbox>
            <Checkbox defaultChecked>검토 대기</Checkbox>
            <Checkbox>완료</Checkbox>
            <Checkbox disabled>보관됨 (권한 없음)</Checkbox>
          </fieldset>
          <fieldset style={{ border: 0, padding: 0, margin: "8px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
            <legend style={{ fontWeight: "var(--dds-font-weight-bold)", marginBottom: 12 }}>공개 범위</legend>
            <Checkbox defaultChecked>공개</Checkbox>
            <Checkbox>비공개</Checkbox>
          </fieldset>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--dds-color-stroke-neutral-weak)" }}>
            <Button intent="neutral" variant="weak">초기화</Button>
            <Button>적용</Button>
          </div>
        </Sheet.Content>
      )}
    </Sheet.Root>
  );
}

function Backdrop({ side, title, summary }: { side: Side; title: string; summary: string }) {
  return (
    <MockupPage title={title} summary={summary}>
      <MockupSection title="배경 화면 · 프로젝트 목록" columns={1}>
        <MockupState label={`side="${side}" · 열린 시트 하나`} minHeight={600}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", alignSelf: "flex-start" }}>
            {["2026 포트폴리오", "블로그 리뉴얼", "디자인 시스템 문서"].map((name) => (
              <Card key={name}><strong>{name}</strong><p style={{ ...weak, marginTop: 4 }}>진행 중 · 공개</p></Card>
            ))}
          </div>
          <ExampleSheet side={side} />
        </MockupState>
      </MockupSection>
    </MockupPage>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Sheet" summary="화면 가장자리에서 밀려 들어오는 모달 패널입니다. 동작은 Dialog와 같고, 오른쪽은 필터·상세, 아래쪽은 짧은 선택·공유에 씁니다.">
      <MockupSection title="side" columns={2} note="버튼을 누르면 실제 시트가 열립니다. 열린 화면은 OpenBottom·OpenRight 스토리입니다.">
        <MockupState label='right · 폭 384, 높이 전체'>
          <ExampleSheet side="right" trigger={<Button intent="neutral" variant="ghost"><FilterIcon />필터</Button>} />
        </MockupState>
        <MockupState label='bottom · 높이 320, 폭 전체'>
          <ExampleSheet side="bottom" trigger={<Button intent="neutral" variant="ghost"><ShareIcon />공유</Button>} />
        </MockupState>
      </MockupSection>

      <MockupSection title="상태와 동작" note="left·top도 같은 규칙으로 대칭입니다.">
        <MockupState label="open">200ms 동안 자기 쪽 가장자리에서 미끄러져 들어옵니다. 배경은 딤과 inert로 막힙니다.</MockupState>
        <MockupState label="closed">ESC·딤 클릭·Sheet.Close로 닫히고, 연 트리거로 포커스가 돌아갑니다.</MockupState>
        <MockupState label="focus">패널이 포커스를 받으면 안쪽 2px 링이 생깁니다. 시안은 닫기 버튼에 초기 포커스를 둡니다.</MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="목록 상단 도구 막대 · 필터는 오른쪽 시트로">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div><strong>프로젝트 12개</strong><p style={{ ...weak, marginTop: 4 }}>진행 중 · 검토 대기 · 공개</p></div>
            <ExampleSheet side="right" trigger={<Button intent="neutral" variant="weak"><FilterIcon />필터 3개 적용됨</Button>} />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["left·right 크기", "폭 min(384px, 화면 − 32px) · 높이 100%", "24rem · --dds-dimension-x8"],
        ["top·bottom 크기", "높이 min(320px, 화면 − 32px) · 폭 100%", "20rem · --dds-dimension-x8"],
        ["패딩 / 요소 간격", "24 / 12px", "--dds-dimension-x6 / x3"],
        ["radius (A)", "현재 0 → 화면 안쪽 두 모서리만 16px (overrides-a.css)", "--dds-radius-r4"],
        ["배경 / 그림자", "#FFFFFF · 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-color-bg-layer-default / --dds-shadow-overlay"],
        ["줄바꿈 (A)", "현재 음절 단위 → 어절 단위 keep-all (c-overlay/overrides.css)", "—"],
        ["딤", "rgb(16 18 20 / 0.5)", "--dds-color-bg-overlay"],
        ["제목 / 설명", "20 / 27px bold · 14 / 19px regular", "--dds-font-size-t7 / t4"],
        ["하단 버튼(소비 측 조립)", "margin-top auto로 바닥에 붙임 · 위 구분선 1px #E5E8EB · 간격 8px", "--dds-color-stroke-neutral-weak"],
        ["focus ring(패널)", "2px #1550A9 · offset −2px(안쪽)", "--dds-color-stroke-focus-ring"],
        ["z-index", "2000", "--dds-z-overlay"],
        ["등장 모션", "200ms translate 100% → 0 · ease-out", "--dds-duration-base · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const OpenBottom: StoryObj = {
  render: () => <Backdrop side="bottom" title="Sheet · bottom" summary="아래에서 올라오는 짧은 패널입니다. 위쪽 두 모서리만 16px로 둥급니다." />,
};

export const OpenRight: StoryObj = {
  render: () => <Backdrop side="right" title="Sheet · right" summary="오른쪽 전체 높이 패널입니다. 적용·초기화 버튼은 바닥에 붙입니다." />,
};
