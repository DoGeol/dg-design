import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizeHandle } from "@dg-design/react/resize-handle";
import * as React from "react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "ResizeHandle",
} satisfies Meta;

export default meta;

/**
 * 조작 가능한 분할 패널 데모.
 * VR 스냅샷이 열린 패널의 동적 상태를 집지 않도록 기본적으로 접힌(닫힌) 상태로 제공한다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [leftWidth, setLeftWidth] = React.useState(220);

    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "var(--dds-radius-r2)",
              border: "1px solid var(--dds-color-stroke-neutral-weak)",
              backgroundColor: "var(--dds-color-bg-layer-default)",
              color: "var(--dds-color-fg-neutral)",
            }}
          >
            {open ? "패널 데모 닫기" : "패널 데모 열기"}
          </button>
        </div>

        {open && (
          <div
            style={{
              display: "flex",
              width: 500,
              height: 200,
              border: "1px solid var(--dds-color-stroke-neutral-weak)",
              borderRadius: "var(--dds-radius-r2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: leftWidth,
                padding: 16,
                backgroundColor: "var(--dds-color-bg-neutral-weak)",
              }}
            >
              사이드바 ({leftWidth}px)
            </div>
            <ResizeHandle
              aria-label="사이드바 너비 조절"
              orientation="vertical"
              value={leftWidth}
              min={120}
              max={360}
              step={10}
              onValueChange={setLeftWidth}
              onReset={() => setLeftWidth(220)}
            />
            <div style={{ flex: 1, padding: 16 }}>본문 영역</div>
          </div>
        )}
      </div>
    );
  },
};

interface MatrixRowProps {
  label: string;
  horizontalProps?: Partial<React.ComponentProps<typeof ResizeHandle>>;
  verticalProps?: Partial<React.ComponentProps<typeof ResizeHandle>>;
}

function MatrixRow({ label, horizontalProps, verticalProps }: MatrixRowProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 12, color: "var(--dds-color-fg-neutral-weak)" }}>{label}</div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {/* Vertical 바 데모 (좌우 패널 사이) */}
        <div
          style={{
            display: "flex",
            width: 140,
            height: 60,
            border: "1px dashed var(--dds-color-stroke-neutral-weak)",
            borderRadius: 4,
            alignItems: "stretch",
          }}
        >
          <div style={{ flex: 1, background: "var(--dds-color-bg-neutral-weak)", opacity: 0.5 }} />
          <ResizeHandle
            aria-label={`${label} 세로 손잡이`}
            orientation="vertical"
            value={50}
            min={0}
            max={100}
            onValueChange={() => {}}
            {...verticalProps}
          />
          <div style={{ flex: 1 }} />
        </div>

        {/* Horizontal 바 데모 (상하 패널 사이) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 140,
            height: 60,
            border: "1px dashed var(--dds-color-stroke-neutral-weak)",
            borderRadius: 4,
          }}
        >
          <div style={{ flex: 1, background: "var(--dds-color-bg-neutral-weak)", opacity: 0.5 }} />
          <ResizeHandle
            aria-label={`${label} 가로 손잡이`}
            orientation="horizontal"
            value={50}
            min={0}
            max={100}
            onValueChange={() => {}}
            {...horizontalProps}
          />
          <div style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  );
}

function HandleGrid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <MatrixRow label="Default" />
      <MatrixRow
        label="Hover"
        verticalProps={{ "data-hover": "" } as any}
        horizontalProps={{ "data-hover": "" } as any}
      />
      <MatrixRow
        label="Focus Visible"
        verticalProps={{
          style: {
            backgroundColor: "var(--dds-color-fg-brand)",
            outline: "var(--dds-dimension-x0_5) solid var(--dds-color-stroke-focus-ring)",
            outlineOffset: "var(--dds-dimension-x0_5)",
          },
        }}
        horizontalProps={{
          style: {
            backgroundColor: "var(--dds-color-fg-brand)",
            outline: "var(--dds-dimension-x0_5) solid var(--dds-color-stroke-focus-ring)",
            outlineOffset: "var(--dds-dimension-x0_5)",
          },
        }}
      />
      <MatrixRow
        label="Dragging"
        verticalProps={{ "data-dragging": "" } as any}
        horizontalProps={{ "data-dragging": "" } as any}
      />
      <MatrixRow
        label="Disabled"
        verticalProps={{ disabled: true }}
        horizontalProps={{ disabled: true }}
      />
    </div>
  );
}

function MatrixContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div data-dds-theme="light" style={{ background: "var(--dds-color-bg-layer-default)", color: "var(--dds-color-fg-neutral)" }}>
        <Caption>라이트 테마</Caption>
        <HandleGrid />
      </div>

      <div
        data-dds-theme="dark"
        style={{
          background: "var(--dds-color-bg-layer-default)",
          color: "var(--dds-color-fg-neutral)",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Caption>다크 모드 스코프</Caption>
        <HandleGrid />
      </div>
    </div>
  );
}

/**
 * VR 기준: horizontal·vertical × default·hover·focus-visible·dragging·disabled,
 * 라이트·다크 및 모바일(44px 조작 영역) 매트릭스.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <MatrixContent />}</DensityColumns>,
};
