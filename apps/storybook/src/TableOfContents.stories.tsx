import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TableOfContents,
  type TableOfContentsItem,
} from "@dg-design/react/table-of-contents";
import * as React from "react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "TableOfContents",
} satisfies Meta;

export default meta;

const basicItems: readonly TableOfContentsItem[] = [
  { id: "overview", label: "개요", depth: 1 },
  { id: "installation", label: "설치 방법", depth: 1 },
  { id: "npm", label: "npm", depth: 2 },
  { id: "pnpm", label: "pnpm", depth: 2 },
  { id: "usage", label: "사용 예제", depth: 1 },
  { id: "accessibility", label: "접근성 고려사항", depth: 1 },
];

const deepAndLongItems: readonly TableOfContentsItem[] = [
  {
    id: "very-long-title",
    label:
      "매우 길어서 좁은 뷰포트나 모바일 화면(375px)에서 두 줄 이상으로 줄바꿈되어야 하는 긴 제목 항목입니다",
    depth: 1,
  },
  { id: "step-1", label: "1단계: 사전 준비 및 의존성 확인", depth: 2 },
  { id: "step-1-1", label: "1.1단계: 환경 변수 구성", depth: 3 },
  { id: "step-1-1-1", label: "1.1.1단계: 4단계 깊이(들여쓰기 3단계 제한 확인)", depth: 4 },
  { id: "conclusion", label: "최종 정리 및 요약", depth: 1 },
];

/**
 * 기능 데모: 접이식 목차와 대화형 상태 변경.
 * VR 스냅샷이 열린 동적 상태를 잡지 않도록 기본적으로 접힌 상태로 제공합니다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: function Render() {
    const [demoOpen, setDemoOpen] = React.useState(false);
    const [activeId, setActiveId] = React.useState<string | null>("installation");

    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxWidth: 375 }}>
        <div>
          <button
            type="button"
            onClick={() => setDemoOpen((prev) => !prev)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "var(--dds-radius-option)",
              border: "1px solid var(--dds-color-stroke-neutral-weak)",
              backgroundColor: "var(--dds-color-bg-layer-default)",
              color: "var(--dds-color-fg-neutral)",
            }}
          >
            {demoOpen ? "데모 접기" : "데모 열기"}
          </button>
        </div>

        {demoOpen ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>
                현재 activeId: <strong>{activeId ?? "없음"}</strong> (클릭하여 변경)
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {basicItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: 12,
                      cursor: "pointer",
                      borderRadius: "var(--dds-radius-option)",
                      border: "1px solid var(--dds-color-stroke-neutral-weak)",
                      backgroundColor:
                        activeId === item.id
                          ? "var(--dds-color-bg-transparent-pressed)"
                          : "transparent",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
                >
                  활성 없음
                </button>
              </div>
            </div>

            <TableOfContents
              variant="collapsible"
              defaultOpen={false}
              items={basicItems}
              activeId={activeId}
              label="기능 데모 접이식 목차"
            />
          </div>
        ) : null}
      </div>
    );
  },
};

function MatrixSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <Caption>Inline — active 없음</Caption>
        <TableOfContents items={basicItems} label="이 페이지의 목차" />
      </div>

      <div>
        <Caption>Inline — active 있음 (npm 선택)</Caption>
        <TableOfContents
          items={basicItems}
          activeId="npm"
          label="이 페이지의 목차"
        />
      </div>

      <div>
        <Caption>Collapsible — 접힘 상태 (default)</Caption>
        <TableOfContents
          variant="collapsible"
          items={basicItems}
          label="접혀 있는 목차"
        />
      </div>

      <div>
        <Caption>Collapsible — 펼침 상태 (defaultOpen)</Caption>
        <TableOfContents
          variant="collapsible"
          defaultOpen
          items={basicItems}
          activeId="installation"
          label="펼쳐진 목차"
        />
      </div>

      <div>
        <Caption>긴 제목과 깊은 계층 (375px 넘침 방지 및 3단계 들여쓰기 제한)</Caption>
        <TableOfContents
          items={deepAndLongItems}
          activeId="step-1-1-1"
          label="세부 기술 사양"
        />
      </div>
    </div>
  );
}

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: function Render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* 라이트 모드 (데스크톱 및 모바일) */}
        <div>
          <h2 style={{ font: "700 16px sans-serif", margin: "0 0 16px", padding: "0 24px" }}>
            Light Theme
          </h2>
          <DensityColumns>{() => <MatrixSection />}</DensityColumns>
        </div>

        {/* 다크 모드 */}
        <div
          data-dds-theme="dark"
          style={{
            backgroundColor: "var(--dds-color-bg-canvas, #1a1a1a)",
            color: "var(--dds-color-fg-neutral)",
            paddingBottom: 24,
          }}
        >
          <h2 style={{ font: "700 16px sans-serif", margin: "24px 0 16px", padding: "24px 24px 0" }}>
            Dark Theme
          </h2>
          <DensityColumns>{() => <MatrixSection />}</DensityColumns>
        </div>
      </div>
    );
  },
};
