import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock, CopyButton } from "@dg-design/react/code-block";
import * as React from "react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "CodeBlock",
} satisfies Meta;

export default meta;

const sampleTsx = `import { Button } from "@dg-design/react/button";

export function App() {
  return <Button variant="solid">확인</Button>;
}`;

const longOneLineCode = `const veryLongConfigurationObjectWithNestedPropertiesAndLongStrings = { apiEndpoint: "https://api.dg-design.internal.service/v1/projects/components/code-block/definitions", timeoutMilliseconds: 30000, retryAttempts: 5, enabledFeatures: ["syntax-highlighting", "line-numbers", "copy-action-feedback", "touch-density-optimization"] };`;

/**
 * 기능 데모: 복사 액션 및 실시간 피드백 테스트.
 * VR 스냅샷이 열린 동적 상태를 잡지 않도록 기본적으로 닫힌 상태로 제공합니다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [lastCopyResult, setLastCopyResult] = React.useState<string | null>(
      null,
    );

    return (
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 480,
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "var(--dds-radius-r2)",
              border: "1px solid var(--dds-color-stroke-neutral-weak)",
              backgroundColor: "var(--dds-color-bg-layer-default)",
              color: "var(--dds-color-fg-neutral)",
              fontSize: "var(--dds-font-size-t3)",
            }}
          >
            {open ? "데모 닫기" : "CodeBlock 기능 데모 열기"}
          </button>
        </div>

        {open ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <CodeBlock
              filename="demo.tsx"
              copyText={sampleTsx}
              onCopy={(success) =>
                setLastCopyResult(
                  success ? "복사 성공!" : "복사 실패",
                )
              }
            >
              <pre>
                <code>{sampleTsx}</code>
              </pre>
            </CodeBlock>
            {lastCopyResult ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--dds-font-size-t2)",
                  color: "var(--dds-color-fg-neutral-weak)",
                }}
              >
                마지막 복사 상태: {lastCopyResult}
              </p>
            ) : null}
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
        <Caption>Filename 있음 + 복사 가능 (기본 구성)</Caption>
        <CodeBlock filename="button-snippet.tsx" copyText={sampleTsx}>
          <pre>
            <code>{sampleTsx}</code>
          </pre>
        </CodeBlock>
      </div>

      <div>
        <Caption>Filename 없음 + 복사 가능 (상단 우측 정렬)</Caption>
        <CodeBlock copyText={sampleTsx}>
          <pre>
            <code>{sampleTsx}</code>
          </pre>
        </CodeBlock>
      </div>

      <div>
        <Caption>Filename 있음 + copyable=false (헤더에 파일명만 노출)</Caption>
        <CodeBlock filename="read-only.tsx" copyable={false}>
          <pre>
            <code>{sampleTsx}</code>
          </pre>
        </CodeBlock>
      </div>

      <div>
        <Caption>Filename 없음 + copyable=false (헤더 완전 생략, 순수 코드 영역)</Caption>
        <CodeBlock copyable={false}>
          <pre>
            <code>{sampleTsx}</code>
          </pre>
        </CodeBlock>
      </div>

      <div>
        <Caption>긴 한 줄 코드 가로 스크롤 (모바일 뷰포트 375px 넘침 방어)</Caption>
        <CodeBlock
          filename="long-config.json"
          copyText={longOneLineCode}
          label="긴 단일 행 구성 파일 코드"
        >
          <pre>
            <code>{longOneLineCode}</code>
          </pre>
        </CodeBlock>
      </div>

      <div>
        <Caption>단독 CopyButton 인라인 소비 (명령어 설치 행)</Caption>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: "var(--dds-radius-r2)",
            border: "1px solid var(--dds-color-stroke-neutral-weak)",
            backgroundColor: "var(--dds-color-bg-neutral-weak)",
            fontFamily: "ui-monospace, monospace",
            fontSize: "var(--dds-font-size-t2)",
          }}
        >
          <code>pnpm add @dg-design/react</code>
          <CopyButton text="pnpm add @dg-design/react" />
        </div>
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
          <h2
            style={{
              font: "700 16px sans-serif",
              margin: "0 0 16px",
              padding: "0 24px",
            }}
          >
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
          <h2
            style={{
              font: "700 16px sans-serif",
              margin: "24px 0 16px",
              padding: "24px 24px 0",
            }}
          >
            Dark Theme
          </h2>
          <DensityColumns>{() => <MatrixSection />}</DensityColumns>
        </div>
      </div>
    );
  },
};
