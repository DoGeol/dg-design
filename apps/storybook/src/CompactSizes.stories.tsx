import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDate } from "@internationalized/date";
import {
  Alert,
  Chip,
  DatePicker,
  FileInput,
  FilterChip,
  MultiSelect,
  Pagination,
  Select,
  Tabs,
  TextArea,
} from "@dg-design/react";

import { Caption, DensityColumns } from "./new-kinds-frame";

// 2026-10-22 스펙(TextArea 높이·조절, 작은 크기, flex 조작 영역)을 한 화면에 모은 조합 스토리.
const meta = {
  title: "Compact sizes",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 } as const;
const TEN_LINES = Array.from({ length: 10 }, (_, i) => `${i + 1}번째 줄`).join("\n");

function Pages({ size }: { size: "xsmall" | "small" }) {
  return (
    <Pagination.Root size={size} aria-label={`쪽 ${size}`}>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous href="#" />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href="#">1</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href="#" isActive>
            2
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next href="#" />
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

function Matrix() {
  return (
    <>
      <Caption>TextArea — 고정 rows=3 · resizable · autoResize rows=3(빈 값) · autoResize maxRows=4(10줄)</Caption>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "start", gap: 8 }}>
        <TextArea aria-label="고정" rows={3} />
        <TextArea aria-label="손잡이" rows={3} resizable />
        <TextArea aria-label="자동 최소" rows={3} autoResize />
        <TextArea aria-label="자동 최대" rows={2} maxRows={4} autoResize defaultValue={TEN_LINES} />
      </div>

      <Caption>Chip·FilterChip·Select 칩 small (모바일은 medium)</Caption>
      <div style={{ ...row, gap: 12 }}>
        <Chip size="small" onRemove={() => {}} removeLabel="디자인 제거">
          디자인
        </Chip>
        <FilterChip size="small" defaultPressed>
          내 글
        </FilterChip>
        <Select.Root defaultValue="all">
          <Select.Trigger variant="chip" size="small" aria-label="상태">
            상태: 전체
          </Select.Trigger>
          <Select.Content>
            <Select.Option value="all">전체</Select.Option>
          </Select.Content>
        </Select.Root>
        <MultiSelect.Root search="trigger" defaultValue={["a"]} searchProps={{ "aria-label": "태그 검색" }}>
          <MultiSelect.Trigger size="xsmall" placeholder="태그" style={{ width: 220 }} />
          <MultiSelect.Content>
            <MultiSelect.Option value="a">디자인</MultiSelect.Option>
          </MultiSelect.Content>
        </MultiSelect.Root>
      </div>

      <Caption>Tabs small · medium</Caption>
      {(["small", "medium"] as const).map((size) => (
        <Tabs.Root key={size} size={size} defaultValue="a">
          <Tabs.List aria-label={`탭 ${size}`}>
            <Tabs.Trigger value="a">개요 {size}</Tabs.Trigger>
            <Tabs.Trigger value="b">기록 {size}</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      ))}

      <Caption>Pagination xsmall · small</Caption>
      <Pages size="xsmall" />
      <Pages size="small" />

      <Caption>DatePicker xsmall · large</Caption>
      <DatePicker kind="date" locale="ko-KR" label="시작일" size="xsmall" defaultValue={new CalendarDate(2026, 10, 22)} />
      <DatePicker kind="date" locale="ko-KR" label="종료일" size="large" defaultValue={new CalendarDate(2026, 10, 22)} />

      <Caption>닫기 X(모바일 조작 영역 44) · FileInput 기본 Trigger(반경 = Button)</Caption>
      <Alert intent="neutral" title="새 버전이 있어요" onClose={() => {}} />
      <div style={{ marginTop: 8 }}>
        <FileInput.Root>
          <FileInput.Actions>
            <FileInput.Trigger>파일 선택</FileInput.Trigger>
          </FileInput.Actions>
        </FileInput.Root>
      </div>
    </>
  );
}

/** VR 기준 + 기능 테스트(`compact-sizes--state-matrix`)가 높이·스크롤·클릭 영역을 잰다. */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <Matrix />}</DensityColumns>,
};
