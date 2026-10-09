import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, MultiSelect } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { PEOPLE, Person } from "./parts";

const meta = { title: "Mockups/Flex/Forms/MultiSelect", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;

/** 옵션은 엘리먼트 상수로 둔다 — 닫힌 상태 라벨 스캔은 사용자 컴포넌트 안까지 들어가지 않는다. mk-hover로 hover 행을 고정한다. */
const peopleOptions = PEOPLE.map((p) => (
  <MultiSelect.Option key={p.id} value={p.id} className={p.id === "park" ? "mk-hover" : undefined}>
    <Person name={p.name} dept={p.dept} />
  </MultiSelect.Option>
));

const tagOptions = (
  <>
    <MultiSelect.Option value="ds">디자인 시스템</MultiSelect.Option>
    <MultiSelect.Option value="a11y">접근성</MultiSelect.Option>
    <MultiSelect.Option value="fe">프론트엔드</MultiSelect.Option>
    <MultiSelect.Option value="docs">문서화</MultiSelect.Option>
    <MultiSelect.Option value="perf">성능</MultiSelect.Option>
  </>
);

const removeLabel = (option: { value: string; label: React.ReactNode }) =>
  `${typeof option.label === "string" ? option.label : option.value} 제거`;

/** 검토자 — 검색 → 선택 수/해제 → 목록 → 도움말. 현재는 검색과 목록만 있다. */
function Reviewers({ v, className }: { v: Flex; className?: string }) {
  const [value, setValue] = React.useState<string[]>(["kim", "pyeon", "choi"]);
  const ordered = v.variant !== "current";
  return (
    <Field.Root style={full}>
      <Field.Label>검토자</Field.Label>
      <MultiSelect.Root
        value={value}
        onValueChange={setValue}
        defaultOpen
        search="content"
        searchProps={{ "aria-label": "이름 검색", placeholder: "이름으로 검색" }}
      >
        <MultiSelect.Trigger className={className} formatCount={(n) => `${n}명 선택됨`} placeholder="검토자를 고르십시오" />
        <MultiSelect.Content className="fx-rich">
          {ordered && (
            <div className="fx-ms-head">
              <span>{value.length}명 선택됨</span>
              <button type="button" className="fx-ms-clear" disabled={value.length === 0} onClick={() => setValue([])}>모두 해제</button>
            </div>
          )}
          {peopleOptions}
          {ordered && <p className="fx-ms-help">Return으로 선택·해제, Esc로 닫습니다.</p>}
        </MultiSelect.Content>
      </MultiSelect.Root>
    </Field.Root>
  );
}

function Tags({ className, value, disabled }: { className?: string; value: string[]; disabled?: boolean }) {
  return (
    <MultiSelect.Root defaultValue={value} search="trigger" searchProps={{ "aria-label": "태그 검색" }}>
      <MultiSelect.Trigger className={className} placeholder="태그를 검색하십시오" formatRemoveLabel={removeLabel} disabled={disabled} />
      <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
    </MultiSelect.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const box = isB ? "fx-box" : undefined;
  return (
    <FlexPage
      v={v}
      title="MultiSelect"
      summary={
        isB
          ? "사각 mark 18px로 복수 선택을 드러내고 검색 → 선택 수·해제 → 목록 → 도움말 순서입니다. 툴바 chip에서도 같은 패널로 들어갑니다."
          : v.variant === "a"
            ? "Select와 패널 치수를 맞추고 사각 mark 16px로 복수 선택을 드러냅니다. 검색 → 선택 수·해제 → 목록 순서입니다."
            : "현재 DDS MultiSelect입니다. 선택 표식이 단일 Select와 같은 체크이고 패널에는 검색과 목록만 있습니다."
      }
    >
      <FlexSection
        title="열린 패널 · 검토자"
        note={
          v.variant === "current"
            ? "현재 없음 — 선택 수·해제·도움말 자리가 없습니다."
            : "선택(mark)과 hover(박지아)는 다른 행입니다. 선택 수·해제·도움말은 listbox 바깥 슬롯이 필요합니다(지금은 안에 둔 시안)."
        }
      >
        <FlexState label="selected 3 · hover 1 · 검색 위" block>
          <Reviewers v={v} className={box} />
          <FlexReserve height={mobile ? 430 : 330} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="트리거 안 chip"
        columns={1}
        note={v.variant === "current" ? "chip 20px · r6 · 12px입니다." : "chip 높이·반경은 chip 역할입니다. 칩이 늘면 트리거가 아래로 자랍니다."}
      >
        <FlexState label="chip 3" block><Tags className={box} value={["ds", "a11y", "docs"]} /></FlexState>
        <FlexState label="chip 5 · 줄바꿈" block><Tags className={box} value={["ds", "a11y", "fe", "docs", "perf"]} /></FlexState>
        <FlexState label="disabled" block><Tags value={["ds", "a11y"]} disabled /></FlexState>
      </FlexSection>

      <FlexSection
        title="문맥 진입 · 툴바 chip"
        note={isB ? "필터 줄의 chip이 같은 값 패널을 엽니다. 새 API 없이 Trigger 외형만 바꿉니다." : "현재·A는 field 트리거만 씁니다."}
      >
        <FlexState label={isB ? "chip 트리거" : "field 트리거 · 고정 폭"}>
          <div style={isB ? undefined : { width: 200 }}>
            <MultiSelect.Root defaultValue={["ds", "a11y"]}>
              <MultiSelect.Trigger aria-label="태그" className={isB ? "fx-trigger-chip" : undefined} formatCount={(n) => `태그 ${n}`} />
              <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
            </MultiSelect.Root>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec
        v={v}
        roles={["mark-size", "chip-height", "chip-radius", "select-panel-radius", "select-panel-inset", "option-height", "field-height"]}
        extra={[
          ["mark 반경 · 선택", v.variant === "current" ? "체크 아이콘 16" : "r4 · bg-brand-solid + fg-brand-contrast 체크", v.variant === "a" ? "C Checkbox small r4 재사용" : isB ? "C DS017 7÷1.75=4.0 (교차 배율)" : "현재 DDS 값 유지"],
          ["패널 검색", v.variant === "current" ? "밑줄 2px · 32px" : "box r6 · 32px", v.variant === "a" ? "C 검색 6 + 여백 8 = 패널 14" : isB ? "C DS017 58÷1.75=33.1 · 9÷1.75=5.1 (교차 배율)" : "현재 DDS 값 유지"],
          ...(v.variant === "current" ? [] : [["순서", "검색 → 선택 수·해제 → 목록 → 도움말", "C A·B 문서 — 검색·행동은 listbox 밖"] as const]),
        ]}
      />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={960} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={960} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
