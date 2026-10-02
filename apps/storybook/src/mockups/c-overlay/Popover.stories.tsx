import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button, Popover, Switch } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import { InfoIcon } from "./icons";

const meta = { title: "Mockups/A/Popover", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" } as const;

/** 알림 빠른 설정. 열리면 첫 스위치로 포커스가 간다. */
function NotifyPopover({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const firstRef = React.useRef<HTMLInputElement>(null);
  return (
    <Popover.Root defaultOpen={defaultOpen} placement="bottom" initialFocusRef={firstRef}>
      <Popover.Trigger asChild><Button intent="neutral" variant="weak">알림 설정</Button></Popover.Trigger>
      <Popover.Content aria-label="알림 설정" style={{ width: 288 }}>
        <Popover.Arrow />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <strong>이 프로젝트 알림</strong>
            <p style={{ ...weak, marginTop: 4 }}>변경 사항은 바로 저장됩니다.</p>
          </div>
          <Switch ref={firstRef} defaultChecked>새 댓글</Switch>
          <Switch defaultChecked>나를 멘션한 글</Switch>
          <Switch>문서 수정</Switch>
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid var(--dds-color-stroke-neutral-weak)" }}>
            <Popover.Close asChild><Button size="small" intent="neutral" variant="weak">닫기</Button></Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

/** 라벨 옆 설명 팝오버. 읽기 전용이라 포커스를 옮기지 않는다. */
function InfoPopover() {
  return (
    <Popover.Root placement="bottom-start" autoFocus={false}>
      <Popover.Trigger asChild>
        <Button size="small" intent="neutral" variant="ghost" aria-label="공개 범위 설명" iconOnly><InfoIcon /></Button>
      </Popover.Trigger>
      <Popover.Content aria-label="공개 범위 설명" style={{ width: 280 }}>
        <Popover.Arrow />
        <p style={{ margin: 0 }}>공개 프로젝트는 링크가 없어도 검색과 프로필에서 보입니다. 비공개로 바꾸면 기존 공유 링크도 막힙니다.</p>
      </Popover.Content>
    </Popover.Root>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Popover" summary="트리거 옆에 뜨는 비모달 패널입니다. 안에 버튼·스위치 같은 상호작용 요소를 둘 수 있고, 같은 화면에서는 하나만 열립니다.">
      <MockupSection title="구성" columns={2} note="트리거를 누르면 실제로 열립니다. 열린 화면은 Open 스토리입니다.">
        <MockupState label="버튼 트리거 · 빠른 설정"><NotifyPopover /></MockupState>
        <MockupState label="아이콘 트리거 · 설명"><span>공개 범위</span><InfoPopover /></MockupState>
      </MockupSection>

      <MockupSection title="상태와 동작" note="패널 자체의 시각 상태는 open·closed 두 가지입니다.">
        <MockupState label="open">트리거 아래 4px 간격, 150ms 동안 scale 0.96에서 1로 나타납니다. 공간이 부족하면 위로 뒤집힙니다.</MockupState>
        <MockupState label="closed">ESC·바깥 클릭·트리거 재클릭·Popover.Close로 닫힙니다.</MockupState>
        <MockupState label="focus">autoFocus 기본값이면 패널이 프로그램 포커스를 받지만 패널 자체에는 링을 그리지 않습니다. 링은 안쪽의 조작 요소에만 보입니다. 설명용은 autoFocus를 끕니다.</MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="프로젝트 헤더 · 오른쪽 도구">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div><strong>2026 포트폴리오</strong><p style={{ ...weak, marginTop: 4 }}>문서 12개 · 공개</p></div>
            <div style={{ display: "flex", gap: 8 }}><NotifyPopover /><Button>게시</Button></div>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["최대 폭", "min(384px, 화면 − 16px)", "24rem · --dds-dimension-x4"],
        ["패딩", "16px", "--dds-dimension-x4"],
        ["radius", "12px", "--dds-radius-r3"],
        ["배경 / 그림자", "#FFFFFF · 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-color-bg-layer-default / --dds-shadow-overlay"],
        ["줄바꿈", "어절 단위(word-break: keep-all)", "—"],
        ["화살표", "8 × 8px 정사각형 45° 회전 · 패널 배경색 · 변에 절반 걸침 · 패널 밖으로 나온 두 변에 1px #E5E8EB 테두리", "--dds-dimension-x2 · --dds-color-stroke-neutral-weak"],
        ["트리거 간격 / 화면 여백", "4 / 8px (floating-ui 상수)", "—"],
        ["focus ring(패널)", "없음 · 안쪽 조작 요소만 2px #1550A9", "--dds-color-stroke-focus-ring"],
        ["z-index", "2000", "--dds-z-overlay"],
        ["등장 모션", "150ms · scale 0.96 → 1 · ease-out", "--dds-duration-fast · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const Open: StoryObj = {
  render: () => (
    <MockupPage title="Popover · 열림" summary="화살표가 트리거를 가리킵니다. 첫 스위치에 초기 포커스를 둔 상태입니다.">
      <MockupSection title="프로젝트 헤더" columns={1}>
        <MockupState label="placement bottom · 화살표 포함" minHeight={420}>
          <div style={{ display: "flex", justifyContent: "center", width: "100%", alignSelf: "flex-start", paddingTop: 24 }}>
            <NotifyPopover defaultOpen />
          </div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
