import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button, Card, Dialog, Field, TextField } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Dialog", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const footer = { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 } as const;

type Kind = "confirm" | "delete" | "form";

/** 세 가지 구성. trigger를 주면 닫힌 채 트리거로 열고, 없으면 열린 채로 그린다. */
function ProjectDialog({ kind, trigger }: { kind: Kind; trigger?: React.ReactElement }) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <Dialog.Root defaultOpen={!trigger} initialFocusRef={kind === "form" ? inputRef : cancelRef}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Overlay />
      <Dialog.Content>
        {kind === "confirm" && (
          <>
            <Dialog.Title>변경 사항을 게시할까요</Dialog.Title>
            <Dialog.Description>게시하면 공개 페이지에 바로 반영됩니다. 게시한 뒤에도 다시 수정할 수 있습니다.</Dialog.Description>
          </>
        )}
        {kind === "delete" && (
          <>
            <Dialog.Title>프로젝트를 삭제할까요</Dialog.Title>
            <Dialog.Description>‘2026 포트폴리오’와 안에 있는 문서 12개가 모두 삭제됩니다. 삭제한 뒤에는 되돌릴 수 없습니다.</Dialog.Description>
          </>
        )}
        {kind === "form" && (
          <>
            <Dialog.Title>프로젝트 이름 변경</Dialog.Title>
            <Dialog.Description>목록과 공유 링크에 보이는 이름입니다.</Dialog.Description>
            <Field.Root style={{ marginTop: 8 }}>
              <Field.Label>프로젝트 이름</Field.Label>
              <TextField ref={inputRef} defaultValue="2026 포트폴리오" />
              <Field.Description>40자까지 입력할 수 있습니다.</Field.Description>
            </Field.Root>
          </>
        )}
        <div style={footer}>
          <Dialog.Close asChild><Button ref={cancelRef} intent="neutral" variant="weak">취소</Button></Dialog.Close>
          {kind === "confirm" && <Button>게시</Button>}
          {kind === "delete" && <Button intent="critical">삭제</Button>}
          {kind === "form" && <Button>저장</Button>}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

/** 열린 다이얼로그 뒤에 깔리는 화면. 900px 뷰포트 안에 들어오게 높이를 맞춘다. */
function Backdrop({ kind, title, summary }: { kind: Kind; title: string; summary: string }) {
  return (
    <MockupPage title={title} summary={summary}>
      <MockupSection title="배경 화면 · 프로젝트 목록" columns={1}>
        <MockupState label="열린 다이얼로그 하나 · 딤 rgb(16 18 20 / 0.5)" minHeight={600}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", alignSelf: "flex-start" }}>
            {["2026 포트폴리오", "블로그 리뉴얼", "디자인 시스템 문서"].map((name, i) => (
              <Card key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <strong>{name}</strong>
                  <p style={{ margin: "4px 0 0", color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)" }}>문서 {12 - i * 4}개 · 2026.09.{28 - i * 3} 수정</p>
                </div>
                <Button size="small" intent="neutral" variant="weak">열기</Button>
              </Card>
            ))}
          </div>
          <ProjectDialog kind={kind} />
        </MockupState>
      </MockupSection>
    </MockupPage>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Dialog" summary="흐름을 멈추고 결정을 받는 모달입니다. 배경은 딤으로 가리고 inert가 되며, 버튼은 오른쪽 정렬로 취소(neutral weak)를 왼쪽, 확정을 오른쪽에 둡니다.">
      <MockupSection title="구성" note="버튼을 누르면 실제 다이얼로그가 열립니다. 열린 화면은 OpenConfirm·OpenDelete·OpenForm 스토리입니다.">
        <MockupState label="확인 · 확정은 brand solid"><ProjectDialog kind="confirm" trigger={<Button>게시</Button>} /></MockupState>
        <MockupState label="삭제 확인 · 되돌릴 수 없어 critical"><ProjectDialog kind="delete" trigger={<Button intent="critical">프로젝트 삭제</Button>} /></MockupState>
        <MockupState label="폼 · 입력 + 저장"><ProjectDialog kind="form" trigger={<Button variant="weak">이름 변경</Button>} /></MockupState>
      </MockupSection>

      <MockupSection title="상태와 동작" note="패널 자체의 시각 상태는 open·closed와 focus 두 가지입니다.">
        <MockupState label="open">중앙 정렬, 200ms 동안 scale 0.96에서 1로 커지며 서서히 나타납니다.</MockupState>
        <MockupState label="closed">ESC·딤 클릭·Dialog.Close로 닫히고, 연 트리거로 포커스가 돌아갑니다.</MockupState>
        <MockupState label="focus">initialFocusRef가 없으면 패널이 포커스를 받아 2px 링이 보입니다. 삭제 확인은 취소 버튼, 폼은 첫 입력에 초기 포커스를 둡니다.</MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="설정 화면 · 위험 영역">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, width: "100%" }}>
            <div>
              <strong>프로젝트 삭제</strong>
              <p style={{ margin: "4px 0 0", color: "var(--dds-color-fg-neutral-weak)" }}>문서와 공유 링크가 함께 삭제됩니다.</p>
            </div>
            <ProjectDialog kind="delete" trigger={<Button intent="critical">프로젝트 삭제</Button>} />
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["너비", "min(512px, 화면 − 32px)", "32rem · --dds-dimension-x8"],
        ["최대 높이", "화면 − 32px, 넘치면 패널 안 스크롤", "--dds-dimension-x8"],
        ["패딩 / 요소 간격", "24 / 12px", "--dds-dimension-x6 / x3"],
        ["radius", "16px", "--dds-radius-r4"],
        ["배경 / 그림자", "#FFFFFF · 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-color-bg-layer-default / --dds-shadow-overlay"],
        ["줄바꿈 (A)", "현재 음절 단위 → 어절 단위 keep-all (c-overlay/overrides.css)", "—"],
        ["딤", "rgb(16 18 20 / 0.5)", "--dds-color-bg-overlay"],
        ["제목", "20 / 27px · bold · #252629", "--dds-font-size-t7 · line-height-t7 · fg-neutral"],
        ["설명", "14 / 19px · regular", "--dds-font-size-t4 · line-height-t4"],
        ["하단 버튼(소비 측 조립)", "오른쪽 정렬 · 간격 8px · 위 여백 24px(gap 12 + 12)", "--dds-dimension-x2 / x3"],
        ["focus ring(패널)", "2px #1550A9 outline · offset 2px", "--dds-color-stroke-focus-ring · dimension-x0_5"],
        ["z-index", "2000", "--dds-z-overlay"],
        ["등장 모션", "200ms · cubic-bezier(0, 0, 0.2, 1)", "--dds-duration-base · --dds-easing-out"],
      ]} />
    </MockupPage>
  ),
};

export const OpenConfirm: StoryObj = {
  render: () => <Backdrop kind="confirm" title="Dialog · 확인" summary="되돌릴 수 있는 결정을 확인받습니다. 확정은 brand solid, 취소는 neutral weak입니다." />,
};

export const OpenDelete: StoryObj = {
  render: () => <Backdrop kind="delete" title="Dialog · 삭제 확인" summary="되돌릴 수 없는 삭제는 critical 버튼과 Dialog 확인을 거칩니다. 초기 포커스는 취소에 둡니다." />,
};

export const OpenForm: StoryObj = {
  render: () => <Backdrop kind="form" title="Dialog · 폼" summary="짧은 입력 하나를 받는 다이얼로그입니다. 열리면 입력에 바로 포커스가 갑니다." />,
};
