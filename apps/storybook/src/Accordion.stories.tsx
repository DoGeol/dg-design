import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useState } from "react";
import { Accordion, Button, TextField } from "@dg-design/react";

type ItemProps = { value: string; title: string; description: string; disabled?: boolean; children: ReactNode };

function Item({ value, title, description, disabled, children }: ItemProps) {
  return (
    <Accordion.Item value={value} disabled={disabled}>
      <Accordion.Header>
        <Accordion.Trigger>
          <Accordion.Prefix aria-hidden>•</Accordion.Prefix>
          <Accordion.Body>
            <Accordion.Title>{title}</Accordion.Title>
            <Accordion.Description>{description}</Accordion.Description>
          </Accordion.Body>
          <Accordion.SuffixIcon aria-hidden>⌄</Accordion.SuffixIcon>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content><Accordion.Body>{children}</Accordion.Body></Accordion.Content>
    </Accordion.Item>
  );
}

function DemoAccordion({ variant = "inline", size = "medium", defaultValues = [] }: {
  variant?: "inline" | "separated";
  size?: "medium" | "large";
  defaultValues?: string[];
}) {
  return (
    <Accordion.Root variant={variant} size={size} defaultValues={defaultValues}>
      <Item value="profile" title="프로필" description="이름과 소개를 관리합니다.">
        <TextField aria-label="프로필 이름" placeholder="이름을 입력하세요" />
      </Item>
      <Item value="notification" title="알림" description="현재 준비 중인 설정입니다." disabled>
        사용할 수 없는 내용
      </Item>
      <Item value="security" title="보안" description="로그인과 보안을 관리합니다.">
        보안 설정 내용
      </Item>
    </Accordion.Root>
  );
}

const meta = { title: "Accordion" } satisfies Meta;

export default meta;

/** 기능 테스트는 이 닫힌 데모의 trigger·입력·disabled 항목을 계약으로 사용한다. */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => <div style={{ maxWidth: 420, padding: 24 }}><DemoAccordion /></div>,
};

export const ControlledValues: StoryObj<typeof meta> = {
  name: "Controlled values",
  render: () => {
    const [values, setValues] = useState<string[]>(["profile"]);
    return (
      <div style={{ display: "grid", gap: 16, maxWidth: 420, padding: 24 }}>
        <Accordion.Root values={values} onValuesChange={setValues}>
          <Item value="profile" title="관리된 프로필" description="외부 values 배열이 열린 상태를 결정합니다.">
            관리된 프로필 내용
          </Item>
          <Item value="security" title="관리된 보안" description="외부 reset으로 함께 닫힙니다.">
            관리된 보안 내용
          </Item>
        </Accordion.Root>
        <Button type="button" variant="weak" intent="neutral" onClick={() => setValues([])}>
          외부에서 모두 닫기
        </Button>

        <Accordion.Root disabled defaultValues={["profile"]} aria-label="Root disabled 아코디언">
          <Item value="profile" title="Root 비활성 프로필" description="Root disabled는 모든 항목에 적용됩니다.">
            외부 controlled 값만 상태를 바꿀 수 있습니다.
          </Item>
        </Accordion.Root>
      </div>
    );
  },
};

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24, padding: 24 }}>
      {(["inline", "separated"] as const).flatMap((variant) =>
        (["medium", "large"] as const).map((size) => (
          <div key={`${variant}-${size}`} style={{ display: "grid", gap: 8 }}>
            <span style={{ font: "500 12px sans-serif" }}>{variant} · {size}</span>
            <DemoAccordion variant={variant} size={size} defaultValues={["profile"]} />
            <DemoAccordion variant={variant} size={size} />
          </div>
        )),
      )}
    </div>
  ),
};
