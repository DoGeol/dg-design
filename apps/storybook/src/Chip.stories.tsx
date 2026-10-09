import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Chip, FilterChip } from "@dg-design/react";
import * as React from "react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "Chip",
} satisfies Meta;

export default meta;

/** 사람 값 칩 제거 — 지우면 초점이 다음(없으면 이전) 칩 제거 버튼으로 간다. */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: function Render() {
    const [people, setPeople] = React.useState(["김도걸", "이수민", "박지원"]);
    const [mine, setMine] = React.useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {people.map((name) => (
            <Chip key={name} onRemove={() => setPeople((prev) => prev.filter((n) => n !== name))} removeLabel={`${name} 제거`}>
              {name}
            </Chip>
          ))}
        </div>
        <div>
          <FilterChip pressed={mine} onPressedChange={setMine}>
            내 글
          </FilterChip>
        </div>
      </div>
    );
  },
};

function Chips() {
  const row = { display: "flex", flexWrap: "wrap", gap: 6, rowGap: 12, alignItems: "center" } as const;
  return (
    <>
      <Caption>값 칩</Caption>
      <div style={row}>
        <Chip>태그</Chip>
        <Chip onRemove={() => {}} removeLabel="디자인 제거">
          디자인
        </Chip>
        <Chip
          leading={
            <Avatar.Root size="small" aria-hidden>
              <Avatar.Fallback>김</Avatar.Fallback>
            </Avatar.Root>
          }
          onRemove={() => {}}
          removeLabel="김도걸 제거"
        >
          김도걸
        </Chip>
        <Chip disabled onRemove={() => {}} removeLabel="비활성 제거">
          비활성
        </Chip>
        <span style={{ maxWidth: 160, display: "inline-flex" }}>
          <Chip onRemove={() => {}} removeLabel="긴 값 제거">
            아주 길게 이어지는 값은 칩 안에서 말줄임
          </Chip>
        </span>
      </div>
      <Caption>필터 칩</Caption>
      <div style={row}>
        <FilterChip>꺼짐</FilterChip>
        <FilterChip defaultPressed>켜짐</FilterChip>
        <FilterChip disabled>비활성</FilterChip>
        <FilterChip defaultPressed disabled>
          켜짐 비활성
        </FilterChip>
      </div>
    </>
  );
}

/** VR 기준: 값 칩(제거·leading·disabled·말줄임)과 필터 칩(꺼짐·켜짐·disabled)을 두 밀도로. */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <Chips />}</DensityColumns>,
};
