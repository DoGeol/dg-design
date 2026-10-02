import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, SaveStatus, type SaveStatusValue } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/SaveStatus", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const LABEL: Record<SaveStatusValue, string> = {
  saved: "저장했습니다",
  dirty: "저장하지 않은 변경 사항이 있습니다",
  saving: "저장하는 중입니다",
  error: "저장하지 못했습니다",
};

function Toolbar({ status }: { status: SaveStatusValue }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", boxSizing: "border-box",
      padding: "8px 16px", background: "var(--dds-color-bg-layer-default)",
      border: "1px solid var(--dds-color-stroke-neutral-weak)", borderRadius: 12,
    }}>
      <strong style={{ fontSize: 14, lineHeight: "19px" }}>2026년 4분기 운영 계획</strong>
      <SaveStatus status={status}>{LABEL[status]}</SaveStatus>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        {status === "error"
          ? <Button size="small" intent="neutral" variant="weak">다시 시도</Button>
          : <Button size="small" intent="neutral" variant="weak">미리 보기</Button>}
        <Button size="small" disabled={status === "saving"}>게시</Button>
      </div>
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="SaveStatus" summary="문서의 저장 상태를 아이콘과 문구로 함께 알립니다. 색만으로 상태를 전하지 않고, 저장 실패만 role=alert로 즉시 읽힙니다.">
      <MockupSection title="상태" columns={4}>
        <MockupState label="saved"><SaveStatus status="saved">{LABEL.saved}</SaveStatus></MockupState>
        <MockupState label="dirty"><SaveStatus status="dirty">{LABEL.dirty}</SaveStatus></MockupState>
        <MockupState label="saving (loading)"><SaveStatus status="saving">{LABEL.saving}</SaveStatus></MockupState>
        <MockupState label="error"><SaveStatus status="error">{LABEL.error}</SaveStatus></MockupState>
      </MockupSection>

      <MockupSection title="사용 예 · 에디터 툴바" columns={1} note="문서 제목 바로 옆에 두고, 실패하면 다시 시도 버튼을 함께 보입니다.">
        <MockupState label="saved"><Toolbar status="saved" /></MockupState>
        <MockupState label="dirty"><Toolbar status="dirty" /></MockupState>
        <MockupState label="saving · 게시 비활성"><Toolbar status="saving" /></MockupState>
        <MockupState label="error · 다시 시도"><Toolbar status="error" /></MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["글자", "12px / 16px · regular", "--dds-font-size-t2 / line-height-t2"],
        ["아이콘 셀 · 간격", "16×16px · 문구와 4px", "--dds-dimension-x4 / x1"],
        ["saved · saving 색", "#6D6F72 (체크 / Spinner small)", "--dds-color-fg-neutral-weak"],
        ["dirty 색", "#4D3A0C (채운 점)", "--dds-color-fg-warning"],
        ["error 색", "#731115 (원 안 느낌표)", "--dds-color-fg-critical"],
        ["아이콘 stroke", "1.5px, round cap", "—"],
        ["saving → saved", "아이콘 150ms ease-out 교차 페이드(motion=\"none\"으로 끔)", "--dds-duration-fast / easing-out"],
        ["접근성", "error는 role=alert, 나머지는 role=status. 같은 노드를 유지해야 변경이 읽힘", "—"],
      ]} />
    </MockupPage>
  ),
};
