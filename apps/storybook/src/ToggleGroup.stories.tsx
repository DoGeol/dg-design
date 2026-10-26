import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup } from "@dg-design/react/toggle-group";
import * as React from "react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "ToggleGroup",
} satisfies Meta;

export default meta;

/**
 * 기능 데모: 단일 선택 및 복수 선택 대화형 조작.
 * VR 스냅샷이 열린 동적 상태를 집지 않도록 기본적으로 닫힌 상태로 제공한다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [singleVal, setSingleVal] = React.useState<string | null>("wide");
    const [multiVal, setMultiVal] = React.useState<string[]>(["guides"]);

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
            {open ? "데모 닫기" : "데모 열기"}
          </button>
        </div>

        {open ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>
                단일 선택 (type="single", 현재: {singleVal ?? "없음"})
              </p>
              <ToggleGroup.Root
                type="single"
                value={singleVal}
                onValueChange={setSingleVal}
                aria-label="미리보기 너비"
              >
                <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
                <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
                <ToggleGroup.Item value="full">전체화면</ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>

            <div>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--dds-color-fg-neutral-weak)" }}>
                복수 선택 (type="multiple", 현재: {multiVal.join(", ") || "없음"})
              </p>
              <ToggleGroup.Root
                type="multiple"
                value={multiVal}
                onValueChange={setMultiVal}
                aria-label="표시 옵션"
              >
                <ToggleGroup.Item value="guides">안내선</ToggleGroup.Item>
                <ToggleGroup.Item value="labels">이름표</ToggleGroup.Item>
                <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
                <ToggleGroup.Item value="rulers" disabled>
                  눈금자 (비활성)
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
};

function MatrixGrid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Single 모드 크기별 (small, medium, large) × 선택/미선택/비활성 */}
      <div>
        <Caption>Single 모드 — small, medium, large</Caption>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ToggleGroup.Root type="single" size="small" defaultValue="b" aria-label="Small 그룹">
            <ToggleGroup.Item value="a">옵션 A</ToggleGroup.Item>
            <ToggleGroup.Item value="b">선택됨</ToggleGroup.Item>
            <ToggleGroup.Item value="c" disabled>
              비활성
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <ToggleGroup.Root type="single" size="medium" defaultValue="b" aria-label="Medium 그룹">
            <ToggleGroup.Item value="a">옵션 A</ToggleGroup.Item>
            <ToggleGroup.Item value="b">선택됨</ToggleGroup.Item>
            <ToggleGroup.Item value="c" disabled>
              비활성
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <ToggleGroup.Root type="single" size="large" defaultValue="b" aria-label="Large 그룹">
            <ToggleGroup.Item value="a">옵션 A</ToggleGroup.Item>
            <ToggleGroup.Item value="b">선택됨</ToggleGroup.Item>
            <ToggleGroup.Item value="c" disabled>
              비활성
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>

      {/* 2. Multiple 모드 크기별 × 복수 선택 / 비활성 선택 유지 */}
      <div>
        <Caption>Multiple 모드 — 복수 선택 및 비활성 선택 유지</Caption>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ToggleGroup.Root
            type="multiple"
            size="medium"
            defaultValue={["opt1", "opt2", "opt4"]}
            aria-label="Multiple 예시"
          >
            <ToggleGroup.Item value="opt1">선택 1</ToggleGroup.Item>
            <ToggleGroup.Item value="opt2">선택 2</ToggleGroup.Item>
            <ToggleGroup.Item value="opt3">미선택</ToggleGroup.Item>
            <ToggleGroup.Item value="opt4" disabled>
              선택 비활성
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>

      {/* 3. 그룹 전체 disabled */}
      <div>
        <Caption>전체 Disabled 그룹</Caption>
        <ToggleGroup.Root type="single" defaultValue="opt1" disabled aria-label="전체 비활성 그룹">
          <ToggleGroup.Item value="opt1">항목 1</ToggleGroup.Item>
          <ToggleGroup.Item value="opt2">항목 2</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      {/* 4. 세로 방향 (Vertical) */}
      <div>
        <Caption>Vertical (세로 방향)</Caption>
        <ToggleGroup.Root
          type="single"
          orientation="vertical"
          defaultValue="v2"
          aria-label="세로 보기 옵션"
        >
          <ToggleGroup.Item value="v1">상단 정렬</ToggleGroup.Item>
          <ToggleGroup.Item value="v2">가운데 정렬</ToggleGroup.Item>
          <ToggleGroup.Item value="v3">하단 정렬</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      {/* 5. 긴 텍스트와 가로 스크롤 (폭 초과 시) */}
      <div>
        <Caption>긴 문구 및 가로 스크롤 (폭 제한 280px)</Caption>
        <div style={{ maxWidth: 280, border: "1px dashed var(--dds-color-stroke-neutral-weak)", padding: 4 }}>
          <ToggleGroup.Root type="single" defaultValue="long1" aria-label="긴 문구 그룹">
            <ToggleGroup.Item value="long1">매우 긴 첫 번째 옵션 라벨</ToggleGroup.Item>
            <ToggleGroup.Item value="long2">두 번째로 긴 설정 옵션 라벨</ToggleGroup.Item>
            <ToggleGroup.Item value="long3">세 번째 긴 옵션</ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>
    </div>
  );
}

function MatrixContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <Caption>라이트 테마</Caption>
        <MatrixGrid />
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
        <MatrixGrid />
      </div>
    </div>
  );
}

/**
 * VR 기준 상태 매트릭스:
 * single·multiple × 크기(small/medium/large) × selected/hover/focus/disabled,
 * 라이트·다크 및 데스크톱·모바일 밀도, 가로/세로, 긴 문구 스크롤 포함.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <MatrixContent />}</DensityColumns>,
};
