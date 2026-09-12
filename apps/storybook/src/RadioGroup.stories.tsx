import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "@dg-design/react";
import * as React from "react";

// Select/DropdownMenu와 같은 이유로 component를 지정하지 않는다 — barrel엔 RadioGroup
// 객체 하나뿐이라 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023).
const meta = {
  title: "RadioGroup",
} satisfies Meta;

export default meta;

const ORIENTATIONS = ["vertical", "horizontal"] as const;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`radiogroup--functional-demo`)를 쓴다 —
 * 항목 3개 구성을 바꾸지 않는다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320 }}>
      <RadioGroup.Root
        aria-label="배송 방법"
        defaultValue="standard"
        onValueChange={(value) => console.log(value)}
      >
        <RadioGroup.Item value="standard">일반배송</RadioGroup.Item>
        <RadioGroup.Item value="express">빠른배송</RadioGroup.Item>
        <RadioGroup.Item value="pickup">방문수령</RadioGroup.Item>
      </RadioGroup.Root>
    </div>
  ),
};

/**
 * 모션 데모: 포인터로 누른 선택만 배경이 이동하고 기본형 점이 교차하는지 확인한다.
 * 처음은 정지 상태이며, 폭이 다른 항목·RTL·항목 추가·키보드·프로그램 변경을 한자리에서 본다.
 */
function MotionDemoView() {
  const [value, setValue] = React.useState("all");
  const [rtl, setRtl] = React.useState(false);
  const [extra, setExtra] = React.useState(false);
  const [wide, setWide] = React.useState(false);
  const [shipping, setShipping] = React.useState("standard");

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}
    >
      {/* 폭이 제각각인 항목 — FLIP이 위치와 크기를 같이 맞춰야 한다 */}
      <div data-testid="motion-segmented">
        <RadioGroup.Root
          variant="segmented"
          aria-label="필터"
          value={value}
          onValueChange={setValue}
        >
          <RadioGroup.Item value="all">전체</RadioGroup.Item>
          <RadioGroup.Item value="mine">{wide ? "아주 긴 내 항목 라벨" : "내 것"}</RadioGroup.Item>
          <RadioGroup.Item value="archived">보관함(오래된 항목)</RadioGroup.Item>
          {extra ? <RadioGroup.Item value="trash">휴지통</RadioGroup.Item> : null}
        </RadioGroup.Root>
      </div>

      <div data-testid="motion-none-segmented">
        <RadioGroup.Root variant="segmented" aria-label="모션 없음" defaultValue="all" motion="none">
          <RadioGroup.Item value="all">전체</RadioGroup.Item>
          <RadioGroup.Item value="mine">내 것</RadioGroup.Item>
          <RadioGroup.Item value="archived">보관함(오래된 항목)</RadioGroup.Item>
        </RadioGroup.Root>
      </div>

      <div data-testid="motion-disabled-segmented">
        <RadioGroup.Root variant="segmented" aria-label="비활성" defaultValue="mine" disabled>
          <RadioGroup.Item value="all">전체</RadioGroup.Item>
          <RadioGroup.Item value="mine">내 것</RadioGroup.Item>
        </RadioGroup.Root>
      </div>

      {/* 기본형 점 — 나가는 점과 들어오는 점이 교차한다 */}
      <div data-testid="motion-default">
        <RadioGroup.Root aria-label="배송 방법" value={shipping} onValueChange={setShipping}>
          <RadioGroup.Item value="standard">일반배송</RadioGroup.Item>
          <RadioGroup.Item value="express">빠른배송</RadioGroup.Item>
          <RadioGroup.Item value="pickup">방문수령</RadioGroup.Item>
        </RadioGroup.Root>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" data-testid="set-archived" onClick={() => setValue("archived")}>
          프로그램 선택
        </button>
        <button type="button" data-testid="toggle-rtl" onClick={() => setRtl((on) => !on)}>
          RTL 토글
        </button>
        <button type="button" data-testid="toggle-extra" onClick={() => setExtra((on) => !on)}>
          항목 추가/제거
        </button>
        <button type="button" data-testid="toggle-wide" onClick={() => setWide((on) => !on)}>
          라벨 폭 변경
        </button>
      </div>
    </div>
  );
}

export const MotionDemo: StoryObj<typeof meta> = {
  name: "Motion demo",
  render: () => <MotionDemoView />,
};

/** orientation(2) x disabled(2) 그리드 — 각 셀은 3항목 라디오그룹, 두 번째 항목 선택 상태 */
function StateMatrix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {ORIENTATIONS.map((orientation) => (
        <section key={orientation}>
          <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>
            orientation: {orientation}
          </h2>
          <div style={{ display: "flex", gap: 48 }}>
            {[false, true].map((disabled) => (
              <div key={String(disabled)}>
                <h3 style={{ font: "500 12px sans-serif", marginBottom: 8 }}>
                  {disabled ? "disabled" : "enabled"}
                </h3>
                <RadioGroup.Root
                  aria-label={`${orientation} ${disabled ? "disabled" : "enabled"}`}
                  orientation={orientation}
                  disabled={disabled}
                  defaultValue="b"
                >
                  <RadioGroup.Item value="a">A</RadioGroup.Item>
                  <RadioGroup.Item value="b">B</RadioGroup.Item>
                  <RadioGroup.Item value="c">C</RadioGroup.Item>
                </RadioGroup.Root>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>
          variant: segmented (small, medium, large, disabled)
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(["small", "medium", "large"] as const).map((size) => (
            <div key={size} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ font: "500 12px sans-serif", width: 60 }}>{size}</span>
              <RadioGroup.Root variant="segmented" size={size} defaultValue="dark" aria-label={`테마 ${size}`}>
                <RadioGroup.Item value="light">Light</RadioGroup.Item>
                <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
                <RadioGroup.Item value="system">System</RadioGroup.Item>
              </RadioGroup.Root>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ font: "500 12px sans-serif", width: 60 }}>disabled</span>
            <RadioGroup.Root variant="segmented" size="medium" defaultValue="dark" disabled aria-label="테마 비활성">
              <RadioGroup.Item value="light">Light</RadioGroup.Item>
              <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
              <RadioGroup.Item value="system">System</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
        </div>
      </section>
    </div>
  );
}

export const StateMatrixStory: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <StateMatrix />,
};
