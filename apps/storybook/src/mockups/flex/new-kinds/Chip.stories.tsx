import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Button, MultiSelect, Select } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { Chip, FilterChip, FilterToolbox } from "../proto/Chip";

const meta = { title: "Mockups/Flex/NewKinds/Chip", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const STATUS = [
  { value: "all", label: "전체" },
  { value: "published", label: "발행됨" },
  { value: "draft", label: "초안" },
  { value: "scheduled", label: "예약" },
] as const;

const labelOf = (value: string) => STATUS.find((s) => s.value === value)?.label ?? value;

function Face({ name }: { name: string }) {
  return <Avatar.Root size="small"><Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback></Avatar.Root>;
}

/** 고정 필터 — 칩 모양의 Select 트리거. 제거 대신 "전체"로 되돌린다. */
function StatusFilter({ value, onChange, open }: { value: string; onChange: (v: string) => void; open?: boolean }) {
  return (
    <Select.Root value={value} onValueChange={onChange} open={open}>
      <Select.Trigger className="fx-chip fx-chip--trigger" data-applied={value === "all" ? undefined : ""} aria-label="상태 필터">
        상태: {labelOf(value)}
      </Select.Trigger>
      <Select.Content>
        {STATUS.map((s) => <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>)}
      </Select.Content>
    </Select.Root>
  );
}

/** B 필터 도구 — 고정(상태)·추가(작성자, 제거 가능)·결과 수·초기화. */
function Toolbox() {
  const [status, setStatus] = React.useState("published");
  const [author, setAuthor] = React.useState(true);
  const dirty = status !== "all" || author;
  const count = (status === "all" ? 24 : 12) - (author ? 7 : 0);
  return (
    <FilterToolbox
      label="글 필터"
      count={`결과 ${count}건`}
      resetDisabled={!dirty}
      onReset={() => { setStatus("all"); setAuthor(false); }}
    >
      <StatusFilter value={status} onChange={setStatus} />
      {author && <Chip leading={<Face name="김도걸" />} onRemove={() => setAuthor(false)} removeLabel="작성자 김도걸 필터 제거">작성자: 김도걸</Chip>}
      <Button size="small" intent="neutral" variant="ghost">필터 추가</Button>
    </FilterToolbox>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const [tags, setTags] = React.useState(["디자인 시스템", "접근성", "아주 긴 태그 이름을 그대로 둔 예시"]);
  const [pressed, setPressed] = React.useState({ mine: true, recent: false });

  return (
    <FlexPage
      v={v}
      title="Chip"
      summary={
        isB
          ? "표시값·제거·필터 진입의 역할을 먼저 나눕니다. 높이 24(제거 버튼 조작 영역)·반경 6(현재 chip 유지), 필터 도구에 결과 수·초기화·고정/제거 규칙을 둡니다."
          : v.variant === "a"
            ? "약한 중성 표면의 값 칩과 켜고 끄는 필터 칩을 나눕니다. 높이 28/32·반경 8 후보입니다. 필터 묶음은 앱 조합에 둡니다."
            : "현재 없음 — 우회. 상태 표시는 Badge(누를 수 없음), 고른 값은 MultiSelect 검색 트리거 안의 비공개 chip뿐입니다."
      }
    >
      {current ? (
        <FlexSection title="고른 값" note="현재 없음 — 우회. MultiSelect 밖에서는 같은 칩을 쓸 수 없습니다.">
          <FlexState label="우회 1 · Badge — 상태 표시, 제거·선택 없음" block>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </FlexState>
          <FlexState label='우회 2 · MultiSelect search="trigger"의 비공개 chip (20px)' block>
            <MultiSelect.Root defaultValue={["ds", "a11y"]} search="trigger" searchProps={{ "aria-label": "태그 검색" }}>
              <MultiSelect.Trigger placeholder="태그를 고르십시오" formatRemoveLabel={(o) => `${String(o.label)} 제거`} />
              <MultiSelect.Content>
                <MultiSelect.Option value="ds">디자인 시스템</MultiSelect.Option>
                <MultiSelect.Option value="a11y">접근성</MultiSelect.Option>
                <MultiSelect.Option value="docs">문서화</MultiSelect.Option>
              </MultiSelect.Content>
            </MultiSelect.Root>
          </FlexState>
        </FlexSection>
      ) : (
        <FlexSection title="값 칩" columns={2} note="칩은 초점을 받지 않고 제거 버튼만 받습니다. 이름은 “값 제거”입니다.">
          <FlexState label="값만"><Chip>디자인 시스템</Chip></FlexState>
          <FlexState label="제거 가능"><Chip onRemove={() => {}} removeLabel="접근성 제거">접근성</Chip></FlexState>
          <FlexState label="leading Avatar + 제거"><Chip leading={<Face name="이서연" />} onRemove={() => {}} removeLabel="이서연 제거">이서연</Chip></FlexState>
          <FlexState label="disabled"><Chip disabled onRemove={() => {}} removeLabel="문서화 제거">문서화</Chip></FlexState>
          <FlexState label="긴 값 · 말줄임 · 묶음 줄바꿈" span={2} block>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.map((t) => (
                <Chip key={t} style={{ maxWidth: 200 }} onRemove={() => setTags((all) => all.filter((x) => x !== t))} removeLabel={`${t} 제거`}>{t}</Chip>
              ))}
            </div>
          </FlexState>
        </FlexSection>
      )}

      {!current && (
        <FlexSection title="제거 버튼 상태" columns={3} note="조작 영역은 칩 높이와 같은 정사각입니다. 링은 안쪽 2px라 옆 칩과 겹치지 않습니다.">
          <FlexState label="hover" force="hover"><Chip onRemove={() => {}} removeLabel="접근성 제거">접근성</Chip></FlexState>
          <FlexState label="focus" force="focus"><Chip onRemove={() => {}} removeLabel="접근성 제거">접근성</Chip></FlexState>
          <FlexState label="pressed" force="pressed"><Chip onRemove={() => {}} removeLabel="접근성 제거">접근성</Chip></FlexState>
        </FlexSection>
      )}

      {!current && (
        <FlexSection title="필터 칩" columns={3} note="켜고 끄는 button[aria-pressed]입니다. 제거 버튼을 품지 않습니다.">
          <FlexState label="꺼짐"><FilterChip pressed={pressed.recent} onClick={() => setPressed((p) => ({ ...p, recent: !p.recent }))}>최근 수정</FilterChip></FlexState>
          <FlexState label="켜짐 · 체크"><FilterChip pressed={pressed.mine} onClick={() => setPressed((p) => ({ ...p, mine: !p.mine }))}>내 글</FilterChip></FlexState>
          <FlexState label="hover" force="hover"><FilterChip pressed={false}>최근 수정</FilterChip></FlexState>
          <FlexState label="focus" force="focus"><FilterChip pressed={false}>최근 수정</FilterChip></FlexState>
          <FlexState label="켜짐 + focus" force="focus"><FilterChip pressed>내 글</FilterChip></FlexState>
          <FlexState label="disabled"><FilterChip pressed={false} disabled>보관함</FilterChip></FlexState>
        </FlexSection>
      )}

      {isB && (
        <FlexSection title="필터 도구" note="고정 필터(상태)는 제거하지 않고 값만 바꿉니다. 추가한 필터만 제거 버튼을 답니다. 결과 수는 role=status, 초기화는 기본값이면 꺼집니다.">
          <FlexState label="적용됨 · 결과 수 · 초기화" block><Toolbox /></FlexState>
          <FlexState label="고정 필터 열림 — 같은 Select 패널" block>
            <StatusFilter value="published" onChange={() => {}} open />
            <FlexReserve height={v.density === "mobile" ? 240 : 170} />
          </FlexState>
        </FlexSection>
      )}

      {v.variant === "a" && (
        <FlexSection title="필터 묶음" note="A는 필터 칩만 정하고 결과 수·초기화 배치는 앱 조합에 둡니다.">
          <FlexState label="필터 칩 나열" block>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <FilterChip pressed>내 글</FilterChip>
              <FilterChip pressed={false}>최근 수정</FilterChip>
              <FilterChip pressed={false}>예약</FilterChip>
            </div>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={["chip-height", "chip-radius"]} extra={current ? [
        ["비공개 chip", "높이 20 · 좌우 8 · r6 · 12px", "D multi-select.css"],
        ["Badge", "읽기 전용 상태 표시", "D 현재 Badge"],
      ] : [
        ["제거 버튼 조작 영역", isB ? "24 / 32 정사각(칩 높이)" : "28 / 32 정사각(칩 높이)", isB ? "C 제거 버튼 조작 영역 24 → 칩 높이" : "C 칩 높이와 같게"],
        ["글자", "12 / 13", "D t2 / t3"],
        ["켜진 필터", "bg-brand-weak · fg-brand", isB ? "B DS029 옅은 파랑 필터 배경(낮음) → semantic" : "C 선택 = 브랜드 약한 표면"],
        ["focus", "필터 칩 2px 링 + 2px 간격, 제거 버튼 안쪽 2px", "비입력 계약"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
