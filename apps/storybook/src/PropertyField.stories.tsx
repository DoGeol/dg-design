import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, PropertyField, Select } from "@dg-design/react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "PropertyField",
} satisfies Meta;

export default meta;

function Settings({ error }: { error?: boolean }) {
  return (
    <PropertyField.Group aria-label="발행 설정">
      <PropertyField.Root>
        <PropertyField.Label>공개 범위</PropertyField.Label>
        <Select.Root defaultValue="link">
          <Select.Trigger />
          <Select.Content>
            <Select.Option value="public">전체 공개</Select.Option>
            <Select.Option value="link">링크가 있는 사람</Select.Option>
            <Select.Option value="private">나만 보기</Select.Option>
          </Select.Content>
        </Select.Root>
      </PropertyField.Root>
      <PropertyField.Root>
        <PropertyField.Label>카테고리</PropertyField.Label>
        <Select.Root>
          <Select.Trigger placeholder="선택" />
          <Select.Content>
            <Select.Option value="design">디자인</Select.Option>
            <Select.Option value="dev">개발</Select.Option>
          </Select.Content>
        </Select.Root>
        {error && <PropertyField.ErrorMessage>카테고리를 고르세요</PropertyField.ErrorMessage>}
      </PropertyField.Root>
      <PropertyField.Root>
        <PropertyField.Label>발행 시각</PropertyField.Label>
        <Popover.Root>
          <Popover.Trigger asChild>
            <PropertyField.Trigger placeholder="바로 발행">10월 9일 09:00</PropertyField.Trigger>
          </Popover.Trigger>
          <Popover.Content aria-label="발행 시각 고르기">달력 자리</Popover.Content>
        </Popover.Root>
      </PropertyField.Root>
      <PropertyField.Root>
        <PropertyField.Label>기준 버전</PropertyField.Label>
        <Select.Root defaultValue="v2">
          <Select.Trigger disabled />
          <Select.Content>
            <Select.Option value="v2">이력서 v2</Select.Option>
          </Select.Content>
        </Select.Root>
        <PropertyField.Description>공개 버전이 있으면 바꿀 수 없다</PropertyField.Description>
      </PropertyField.Root>
    </PropertyField.Group>
  );
}

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <Settings />
    </div>
  ),
};

/** VR 기준: 값·placeholder·Popover형·disabled·설명·오류를 두 밀도로(데스크톱 행, 모바일 묶음 표면). */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <DensityColumns>
      {() => (
        <>
          <Caption>기본</Caption>
          <Settings />
          <Caption>오류</Caption>
          <Settings error />
        </>
      )}
    </DensityColumns>
  ),
};
