import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Chip, FilterChip, FilterToolbox, Select } from "@dg-design/react";
import * as React from "react";

import { DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "FilterToolbox",
} satisfies Meta;

export default meta;

const STATUS = [
  { value: "all", label: "전체" },
  { value: "published", label: "발행됨" },
  { value: "draft", label: "초안" },
] as const;

function Toolbox({
  initialStatus = "published",
  initialMine = true,
  initialTags = ["접근성"],
}: {
  initialStatus?: string;
  initialMine?: boolean;
  initialTags?: string[];
}) {
  const [status, setStatus] = React.useState(initialStatus);
  const [mine, setMine] = React.useState(initialMine);
  const [tags, setTags] = React.useState(initialTags);
  const isDefault = status === "all" && !mine && tags.length === 0;
  return (
    <FilterToolbox.Root aria-label="글 필터">
      <FilterToolbox.Chips>
        <Select.Root value={status} onValueChange={setStatus}>
          <Select.Trigger variant="chip" active={status !== "all"} aria-label="상태">
            상태: {STATUS.find((s) => s.value === status)?.label}
          </Select.Trigger>
          <Select.Content>
            {STATUS.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select.Root>
        <FilterChip pressed={mine} onPressedChange={setMine}>
          내 글
        </FilterChip>
        {tags.map((tag) => (
          <Chip key={tag} onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))} removeLabel={`태그 ${tag} 필터 제거`}>
            태그: {tag}
          </Chip>
        ))}
      </FilterToolbox.Chips>
      <FilterToolbox.Count>{isDefault ? 24 : 3}개</FilterToolbox.Count>
      <FilterToolbox.Actions>
        <Button
          size="small"
          intent="neutral"
          variant="ghost"
          disabled={isDefault}
          onClick={() => {
            setStatus("all");
            setMine(false);
            setTags([]);
          }}
        >
          초기화
        </Button>
      </FilterToolbox.Actions>
    </FilterToolbox.Root>
  );
}

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ maxWidth: 640, padding: 24 }}>
      <Toolbox />
    </div>
  ),
};

/** VR 기준: 고정 필터(칩 Select 켜짐)·필터 칩·제거 칩·결과 수·초기화, 그리고 모두 기본값인 상태를 두 밀도로. */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <DensityColumns>
      {() => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Toolbox />
          <Toolbox initialStatus="all" initialMine={false} initialTags={[]} />
        </div>
      )}
    </DensityColumns>
  ),
};
