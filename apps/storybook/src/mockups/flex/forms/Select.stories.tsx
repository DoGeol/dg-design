import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Select } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { PEOPLE, Person, personName } from "./parts";

const meta = { title: "Mockups/Flex/Forms/Select", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;

/** 옵션은 엘리먼트 상수로 둔다 — 닫힌 상태 라벨 스캔은 사용자 컴포넌트 안까지 들어가지 않는다. mk-hover로 hover 행 하나를 고정한다. */
const peopleOptions = PEOPLE.map((p) => (
  <Select.Option key={p.id} value={p.id} className={p.id === "lee" ? "mk-hover" : undefined}>
    <Person name={p.name} dept={p.dept} />
  </Select.Option>
));

const sortOptions = (
  <>
    <Select.Option value="updated">최근 수정순</Select.Option>
    <Select.Option value="name">이름순</Select.Option>
    <Select.Option value="created">만든 날짜순</Select.Option>
  </>
);

const statusOptions = (
  <>
    <Select.Option value="all">전체</Select.Option>
    <Select.Option value="doing">진행 중</Select.Option>
    <Select.Option value="done">완료</Select.Option>
  </>
);

/** 풍부한 행의 닫힌 값 — label/textValue 분리 API가 없어 Trigger children으로 이름만 넘기는 우회. */
function Assignee({ v, open, className }: { v: Flex; open?: boolean; className?: string }) {
  const [value, setValue] = React.useState<string>("pyeon");
  return (
    <Field.Root style={full}>
      <Field.Label>담당자</Field.Label>
      <Select.Root value={value} onValueChange={setValue} defaultOpen={open}>
        <Select.Trigger className={className}>{personName(value)}</Select.Trigger>
        <Select.Content className="fx-rich">{peopleOptions}</Select.Content>
      </Select.Root>
      {v.variant !== "current" && <Field.Description>검토를 맡을 사람 한 명입니다.</Field.Description>}
    </Field.Root>
  );
}

function Plain({ className, label, options, defaultValue, disabled, invalid, placeholder }: {
  className?: string;
  label: string;
  options: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
}) {
  return (
    <Field.Root style={full}>
      <Select.Root defaultValue={defaultValue}>
        <Select.Trigger aria-label={label} className={className} placeholder={placeholder} disabled={disabled} />
        <Select.Content>{options}</Select.Content>
      </Select.Root>
      {invalid && <Field.ErrorMessage>값을 하나 고르십시오.</Field.ErrorMessage>}
    </Field.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const box = isB ? "fx-box" : undefined;
  return (
    <FlexPage
      v={v}
      title="Select"
      summary={
        isB
          ? "field·버튼·chip 트리거가 같은 값 패널을 엽니다. 행은 아바타·이름·소속으로 값을 설명하고, 선택은 브랜드 체크, hover는 중성 표면입니다."
          : v.variant === "a"
            ? "field 트리거를 TextField와 맞추고 패널 반경 14px·여백 8px, 옵션 36px로 정보 여유를 둡니다."
            : "현재 DDS Select입니다. 트리거는 field 한 가지이고 패널 반경 12px·여백 4px, 옵션 32px입니다."
      }
    >
      <FlexSection
        title="열린 패널 · 사람 선택"
        note={
          v.variant === "current"
            ? "풍부한 행은 Option children으로 가능하지만 닫힌 값은 Trigger children으로 이름만 넘겨 우회합니다."
            : "선택(편도걸 체크·focus)과 hover(이하준)를 다른 행으로 그립니다. 닫힌 값은 이름만 보입니다 — label/textValue 분리 API가 필요합니다."
        }
      >
        <FlexState label="selected + focus · hover 행 분리" block>
          <Assignee v={v} open className={box} />
          <FlexReserve height={mobile ? 300 : 230} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="트리거 형태"
        columns={1}
        note={
          isB
            ? "같은 Select.Root·Content에 Trigger 외형만 className으로 바꿉니다. 새 API는 없습니다."
            : v.variant === "a"
              ? "A는 field 트리거만 기본입니다. 버튼·chip 트리거는 합성 API가 생긴 뒤 후속으로 봅니다."
              : "현재 없음 — 툴바·필터 자리에도 field 트리거를 고정 폭으로 둡니다."
        }
      >
        <FlexState label={isB ? "버튼 트리거 · 페이지 툴바" : "툴바 자리 · field 트리거"} block>
          <div className="fx-toolbar">
            <strong>문서 42개</strong>
            <div style={isB ? undefined : { width: 168 }}>
              <Plain className={isB ? "fx-trigger-button" : undefined} label="정렬" options={sortOptions} defaultValue="updated" />
            </div>
          </div>
        </FlexState>
        <FlexState label={isB ? "chip 트리거 · 필터 줄" : "필터 자리 · field 트리거"} block>
          <div className="fx-toolbar" style={{ justifyContent: "flex-start" }}>
            <div style={isB ? undefined : { width: 168 }}>
              <Plain className={isB ? "fx-trigger-chip" : undefined} label="상태" options={statusOptions} defaultValue="doing" />
            </div>
            {isB && <span className="fx-note">chip은 값을 바로 보이고 같은 패널을 엽니다.</span>}
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection title="field 트리거 상태" columns={2} note="medium 기준입니다. 트리거에는 pressed 표현이 없습니다.">
        <FlexState label="empty"><Plain className={box} label="정렬" options={sortOptions} placeholder="정렬을 고르십시오" /></FlexState>
        <FlexState label="hover" force="hover"><Plain className={box} label="정렬" options={sortOptions} defaultValue="name" /></FlexState>
        <FlexState label="focus" force="focus"><Plain className={box} label="정렬" options={sortOptions} defaultValue="name" /></FlexState>
        <FlexState label="disabled"><Plain className={box} label="정렬" options={sortOptions} defaultValue="name" disabled /></FlexState>
        <FlexState label="error" span={2}><Plain className={box} label="정렬" options={sortOptions} placeholder="정렬을 고르십시오" invalid /></FlexState>
      </FlexSection>

      <FlexSpec
        v={v}
        roles={["field-height", "field-radius", "select-panel-radius", "select-panel-inset", "option-height", "option-radius", "chip-height", "chip-radius", "button-radius"]}
        extra={[
          ["옵션 좌우 여백 · 표식–글자", "8 · 8px", isB ? "C DS017 16÷1.75=9.1 · 14÷1.75=8 (교차 배율) — 현재와 같음" : "현재 DDS 값 유지"],
          mobile && v.variant !== "current"
            ? ["아바타 행 실제 높이", "48px", "option-height 48이 아바타 행 36보다 커서 최소값이 정한다"] as const
            : ["아바타 행 실제 높이", "36px (24 + 6·2)", "C 아바타 small 24 + 행 위아래 6 — option-height는 최소값"] as const,
          ["선택 표식 색", isB ? "fg-brand" : "fg-neutral(currentColor)", isB ? "B DS017·018 선택 표시와 hover 색 분리" : "현재 DDS 값 유지"],
          ...(isB ? [["버튼 트리거 높이", "36px · 좌우 12", "D Button small 재사용"] as const] : []),
          ...(v.variant === "a" ? [["사람 행 선택 표식", "trailing 체크", "A 문서 — leading Avatar, trailing 선택 표식"] as const] : []),
        ]}
      />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
