import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, MultiSelect } from "@dg-design/react";
import type * as React from "react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/MultiSelect", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 옵션은 엘리먼트 상수로 둔다 — 닫힌 상태의 라벨 스캔은 사용자 컴포넌트 안까지 들어가지 않는다. */
const tagOptions = (
  <>
    <MultiSelect.Option value="design-system">디자인 시스템</MultiSelect.Option>
    <MultiSelect.Option value="design-review">디자인 리뷰</MultiSelect.Option>
    <MultiSelect.Option value="frontend">프론트엔드</MultiSelect.Option>
    <MultiSelect.Option value="a11y">접근성</MultiSelect.Option>
    <MultiSelect.Option value="performance">성능</MultiSelect.Option>
    <MultiSelect.Option value="docs">문서화</MultiSelect.Option>
  </>
);

const removeLabel = (option: { value: string; label: React.ReactNode }) =>
  `${typeof option.label === "string" ? option.label : option.value} 제거`;

function Tags({ value = [], search, size, disabled, width = "100%" }: {
  value?: string[];
  search?: "trigger";
  size?: "medium" | "large";
  disabled?: boolean;
  width?: number | string;
}) {
  return (
    <div style={{ width }}>
      <MultiSelect.Root defaultValue={value} search={search} searchProps={{ "aria-label": "태그 검색" }}>
        <MultiSelect.Trigger size={size} placeholder="태그를 선택하십시오" disabled={disabled} formatRemoveLabel={removeLabel} />
        <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
      </MultiSelect.Root>
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="MultiSelect" summary="목록에서 값 여러 개를 고릅니다. 기본 트리거는 요약 한 줄로 높이가 고정되고, 검색 트리거는 칩을 나열하며 아래로 자랍니다.">
      <MockupSection title="요약 트리거 · 검색 없음" note="2개 이상이면 개수 요약 문구로 바뀝니다.">
        <MockupState label="0개 · placeholder"><Tags /></MockupState>
        <MockupState label="1개 · 라벨"><Tags value={["frontend"]} /></MockupState>
        <MockupState label="3개 · 개수 요약"><Tags value={["frontend", "a11y", "docs"]} /></MockupState>
      </MockupSection>

      <MockupSection title={'검색 트리거 · search="trigger"'} note="칩과 검색 입력이 한 줄에 들어가고, 칩이 줄을 채우면 다음 줄로 내려갑니다.">
        <MockupState label="0개 · placeholder"><Tags search="trigger" /></MockupState>
        <MockupState label="칩 2개"><Tags search="trigger" value={["design-system", "a11y"]} /></MockupState>
        <MockupState label="칩 5개 · 줄바꿈">
          <Tags search="trigger" value={["design-system", "design-review", "frontend", "a11y", "performance"]} />
        </MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={3} note="medium 기준입니다. 트리거에는 pressed 표현이 없습니다.">
        <MockupState label="default"><Tags value={["frontend"]} /></MockupState>
        <MockupState label="hover" force="hover"><Tags value={["frontend"]} /></MockupState>
        <MockupState label="focus" force="focus"><Tags value={["frontend"]} /></MockupState>
        <MockupState label="focus · 검색 트리거(입력에 포커스)" force="focus"><Tags search="trigger" /></MockupState>
        <MockupState label="disabled"><Tags value={["frontend"]} disabled /></MockupState>
        <MockupState label="disabled · 검색 트리거"><Tags search="trigger" value={["design-system", "a11y"]} disabled /></MockupState>
        <MockupState label="error" span={3}>
          <div style={{ width: 360 }}>
            <Field.Root>
              <MultiSelect.Root>
                <MultiSelect.Trigger placeholder="태그를 선택하십시오" />
                <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
              </MultiSelect.Root>
              <Field.ErrorMessage>태그를 하나 이상 선택해야 합니다.</Field.ErrorMessage>
            </Field.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={2} note="검색 트리거는 높이 대신 최소 높이를 지킵니다.">
        <MockupState label="medium · 40"><Tags value={["frontend", "a11y"]} size="medium" /></MockupState>
        <MockupState label="large · 52"><Tags value={["frontend", "a11y"]} size="large" /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="글 작성 · 태그 입력">
          <div style={{ width: 420 }}>
            <Field.Root>
              <Field.Label>태그</Field.Label>
              <MultiSelect.Root defaultValue={["design-system", "a11y", "docs"]} search="trigger" searchProps={{ "aria-label": "태그 검색" }}>
                <MultiSelect.Trigger placeholder="태그를 검색하거나 만드십시오" formatRemoveLabel={removeLabel} />
                <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
              </MultiSelect.Root>
              <Field.Description>목록에 없는 태그는 입력한 뒤 바로 만들 수 있습니다.</Field.Description>
            </Field.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["트리거 외관", "Select 트리거와 같습니다(높이 40/52 · radius 8/12 · 테두리 2px)", "Select 스펙 참조"],
        ["검색 트리거 높이", "최소 40px, 칩이 늘면 아래로 자람 · 위아래 패딩 6px", "--dds-dimension-x10, x1_5"],
        ["검색 트리거 칩·입력 간격", "6px", "--dds-dimension-x1_5"],
        ["검색 트리거 focus", "입력 포커스 시 트리거 전체에 2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["칩", "패딩 2px 8px · radius 6px · 12px/16px · 배경 #F3F5F9 · 글자 #252629", "--dds-radius-r1_5, --dds-font-size-t2, --dds-color-bg-neutral-weak"],
        ["칩 제거 버튼", "원형 · #6D6F72, hover #252629 · 라벨과 간격 4px", "--dds-color-fg-neutral-weak / fg-neutral, --dds-dimension-x1"],
        ["패널 검색(search=content)", "최소 높이 32px · 패딩 6px 8px · 아래 구분선 2px #6D6F72 · 아래 여백 4px", "--dds-dimension-x8, --dds-color-stroke-neutral"],
        ["만들기 항목", "옵션과 같은 행 · 시작선 32px(A 보정, 현재 8) · 보류 중 글자 #6D6F72 + Spinner small(16px)", "--dds-color-fg-neutral-weak"],
        ["만들기 실패 문구", "12px · #731115 · 패딩 6px 8px", "--dds-color-fg-critical"],
        ["활성 옵션(검색 트리거 키보드)", "rgb(16 18 20 / .06)", "--dds-color-bg-transparent-hover"],
        ["목록 패널·옵션", "Select와 같습니다(radius 12 A 보정 · 옵션 32px)", "Select 스펙 참조"],
        ["disabled", "배경 #E5E8EB · 글자 #8A8C8F · 칩 제거 버튼도 비활성", "--dds-color-bg-disabled / fg-disabled"],
      ]} />
    </MockupPage>
  ),
};

export const Open: StoryObj = {
  render: () => (
    <MockupPage title="MultiSelect · 열린 목록" summary="항목을 누르면 토글만 하고 닫히지 않습니다. 선택된 항목마다 체크가 보입니다.">
      <MockupSection title="열린 상태" columns={1}>
        <MockupState label="open · 2개 선택됨" minHeight={340}>
          <div style={{ width: 320, alignSelf: "flex-start" }}>
            <MultiSelect.Root open defaultValue={["frontend", "a11y"]}>
              <MultiSelect.Trigger placeholder="태그를 선택하십시오" />
              <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
            </MultiSelect.Root>
          </div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};

export const OpenSearchContent: StoryObj = {
  render: () => (
    <MockupPage title={'MultiSelect · 패널 검색'} summary={'search="content"는 패널 맨 위에 검색 입력을 두고, 일치하는 항목만 남깁니다. 정확히 같은 항목이 없으면 맨 아래에 만들기 항목이 붙습니다.'}>
      <MockupSection title="열린 상태 · 검색어 입력됨" columns={1}>
        <MockupState label={'open · 검색어 "디자인" · 만들기 항목'} minHeight={260}>
          <div style={{ width: 320, alignSelf: "flex-start" }}>
            <MultiSelect.Root
              open
              defaultValue={["design-system"]}
              search="content"
              defaultSearchValue="디자인"
              searchProps={{ "aria-label": "태그 검색", placeholder: "태그 검색" }}
              onCreate={async (query) => ({ value: query, label: query })}
              createLabel={(query) => `"${query}" 태그 만들기`}
            >
              <MultiSelect.Trigger placeholder="태그를 선택하십시오" />
              <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
            </MultiSelect.Root>
          </div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};

export const OpenSearchTrigger: StoryObj = {
  render: () => (
    <MockupPage title={'MultiSelect · 트리거 검색'} summary={'search="trigger"는 칩 뒤 입력에 바로 검색어를 칩니다. 포커스는 입력에 남고 활성 항목은 배경으로만 표시합니다.'}>
      <MockupSection title="열린 상태 · 칩과 검색어" columns={1}>
        <MockupState label={'open · 칩 2개 · 검색어 "디자인" · 만들기 항목'} minHeight={260}>
          <div style={{ width: 360, alignSelf: "flex-start" }}>
            <MultiSelect.Root
              open
              defaultValue={["frontend", "a11y"]}
              search="trigger"
              defaultSearchValue="디자인"
              searchProps={{ "aria-label": "태그 검색" }}
              onCreate={async (query) => ({ value: query, label: query })}
              createLabel={(query) => `"${query}" 태그 만들기`}
            >
              <MultiSelect.Trigger placeholder="태그를 검색하거나 만드십시오" formatRemoveLabel={removeLabel} />
              <MultiSelect.Content>{tagOptions}</MultiSelect.Content>
            </MultiSelect.Root>
          </div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
