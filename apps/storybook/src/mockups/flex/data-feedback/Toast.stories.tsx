import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button, Toast } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/DataFeedback/Toast", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const noop = () => {};

/**
 * viewport 자리. 실제 Toast.Provider의 viewport는 body에 fixed로 붙어 iframe 높이에 잡히지 않는다 —
 * 같은 마크업(Toast.View, live 끔)을 viewport와 같은 간격·폭의 흐름 안 상자에 쌓는다.
 */
function Stage({ children, mobile }: { children: React.ReactNode; mobile: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mobile ? "stretch" : "flex-end", gap: "var(--dds-dimension-x2)", width: "100%" }}>
      {children}
    </div>
  );
}
const toastWidth = { width: "min(24rem, 100%)", boxSizing: "border-box" } as const;

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const current = v.variant === "current";
  const undo = <button type="button" className="fx-df-link">되돌리기</button>;
  return (
    <FlexPage
      v={v}
      title="Toast"
      summary={
        current
          ? "현재 DDS Toast입니다. 작은 weak 표면, 5초 자동 닫힘, hover·focus 중 정지."
          : "현재 작은 피드백 형태를 유지합니다. 결과를 짧게 쓰고 되돌리기처럼 꼭 필요한 행동만 붙입니다. A·B 같다."
      }
    >
      <FlexSection
        title="결과 피드백"
        note={current
          ? "현재 useToast 옵션에는 action이 없습니다 — 되돌리기는 Toast.View를 직접 쓸 때만 붙습니다."
          : "되돌리기 행동은 useToast 옵션에도 열어야 합니다(현재 View 전용). 일반 Popover처럼 흰 패널·테두리를 강제하지 않습니다."}
      >
        <FlexState label="viewport 자리 · 쌓임 3개" block>
          <Stage mobile={mobile}>
            <Toast.View live={false} intent="neutral" title="글 1개를 보관함으로 옮겼습니다" action={current ? undefined : undo} onClose={noop} style={toastWidth} />
            <Toast.View live={false} intent="positive" title="변경 사항을 저장했습니다" onClose={noop} style={toastWidth} />
            <Toast.View live={false} intent="critical" title="발행하지 못했습니다" description="연결을 확인한 뒤 다시 시도해 주세요." onClose={noop} style={toastWidth} />
          </Stage>
        </FlexState>
      </FlexSection>

      {mobile && (
        <FlexSection
          title="하단 고정 행동과 겹침"
          note="viewport 기본 위치는 아래 16px라 하단 CTA를 덮습니다. 앱이 CTA 높이 + safe area만큼 올립니다 — A·B 같다."
        >
          <FlexState label="CTA 위 · 아래 여백 16 + safe area" block>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x4)", padding: "var(--dds-dimension-x4)", borderRadius: "var(--dds-radius-r3)", background: "var(--dds-color-bg-neutral-weak)" }}>
              <Toast.View live={false} intent="positive" title="임시 저장했습니다" onClose={noop} />
              <Button className="fx-cta" size={current ? "large" : "medium"} style={{ width: "100%" }}>발행하기</Button>
            </div>
          </FlexState>
        </FlexSection>
      )}

      <FlexSection title="상태" columns={2} note="닫기 버튼은 2px 링. hover·focus 중에는 자동 닫힘이 멈춥니다.">
        <FlexState label="닫기 · focus-visible" force="focus" block>
          <Toast.View live={false} intent="informative" title="새 버전을 쓸 수 있습니다" onClose={noop} />
        </FlexState>
        <FlexState label="warning" block>
          <Toast.View live={false} intent="warning" title="저장 공간이 거의 찼습니다" onClose={noop} />
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={mobile ? ["cta-height"] : []} extra={[
        ["viewport", "오른쪽 아래 16px · 폭 min(384px, 100vw − 32px)", "D 현재 값(A·B 공통)"],
        ["쌓임", "간격 8 · 최대 3개", "D 현재 값"],
        ["항목", "여백 12/16 · r12 · overlay 그림자", "D 현재 값"],
        ["제목 / 설명", "13/18 bold · 12/16", "D 현재 값"],
        ["되돌리기 행동", current ? "View에만 있음" : "useToast 옵션으로 공개", current ? "현재 API" : "C 조합 API 보완(A·B 공통)"],
        ["다크 경계", "없음 — weak 표면 + 그림자", "layer 위는 확인 · neutral-weak 표면 위 겹침은 미검증"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={720} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
