import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, MultiSelect, RadioGroup, Select, Switch, TextArea, TextField } from "@dg-design/react";

import { Caption, DensityColumns } from "./new-kinds-frame";

// 여러 컴포넌트를 한 줄에 둔 조합 스토리라 component를 지정하지 않는다.
const meta = {
  title: "Xsmall row",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 } as const;

function Row() {
  return (
    <>
      <Caption>Button xsmall 옆 입력류 xsmall (모바일은 medium)</Caption>
      <div style={row}>
        <TextField size="xsmall" aria-label="검색" placeholder="검색" style={{ width: 120 }} />
        <Select.Root defaultValue="all">
          <Select.Trigger size="xsmall" aria-label="상태" style={{ width: 96 }} />
          <Select.Content>
            <Select.Option value="all">전체</Select.Option>
            <Select.Option value="open">진행</Select.Option>
          </Select.Content>
        </Select.Root>
        <Button size="xsmall">적용</Button>
      </div>
      <Caption>MultiSelect search xsmall 칩</Caption>
      <div style={row}>
        <MultiSelect.Root search="trigger" defaultValue={["a"]} searchProps={{ "aria-label": "태그 검색" }}>
          <MultiSelect.Trigger size="xsmall" placeholder="태그" style={{ width: 200 }} />
          <MultiSelect.Content>
            <MultiSelect.Option value="a">디자인</MultiSelect.Option>
            <MultiSelect.Option value="b">개발</MultiSelect.Option>
          </MultiSelect.Content>
        </MultiSelect.Root>
        <Button size="xsmall" variant="weak" intent="neutral">
          초기화
        </Button>
      </div>
      <Caption>작은 단계 — segmented xsmall·Switch small·Badge small</Caption>
      <div style={row}>
        <RadioGroup.Root variant="segmented" size="xsmall" orientation="horizontal" defaultValue="day" aria-label="기간">
          <RadioGroup.Item value="day">일</RadioGroup.Item>
          <RadioGroup.Item value="week">주</RadioGroup.Item>
        </RadioGroup.Root>
        <Switch size="small">자동 저장</Switch>
        <Badge size="small">새 항목</Badge>
        <Button size="xsmall" loading>
          저장
        </Button>
      </div>
      <Caption>TextArea xsmall</Caption>
      <TextArea size="xsmall" rows={1} aria-label="메모" placeholder="메모" />
    </>
  );
}

/** VR 기준 + 기능 테스트(`xsmall-row--state-matrix`)가 높이를 잰다. */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <Row />}</DensityColumns>,
};
