import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Field, MultiSelect } from "@dg-design/react";
import * as React from "react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { Chip } from "../proto/Chip";
import { PropertyField, PropertyGroup } from "../proto/PropertyField";

const meta = { title: "Mockups/Flex/Scenarios/PersonPicker", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const PEOPLE = [
  { value: "kim", name: "김도걸", team: "디자인" },
  { value: "lee", name: "이서연", team: "프론트엔드" },
  { value: "park", name: "박지훈", team: "백엔드" },
  { value: "choi", name: "최유나", team: "제품" },
  { value: "jung", name: "정민수", team: "디자인" },
] as const;

const nameOf = (value: string) => PEOPLE.find((p) => p.value === value)?.name ?? value;

function Face({ name }: { name: string }) {
  return <Avatar.Root size="small"><Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback></Avatar.Root>;
}

type State = "selected" | "empty" | "failed" | "navigating";

/**
 * 상태 하나 = 실제 MultiSelect 하나. 열린 상태는 제어 open이라 형제가 닫지 못한다.
 * 탐색 중은 검색 입력에 ArrowDown을, 생성 실패는 만들기 항목 click을 효과로 한 번 보낸다 — DDS 동작 그대로의 화면이다.
 */
function Picker({ v, state }: { v: Flex; state: State }) {
  const current = v.variant === "current";
  const isB = v.variant === "b";
  const mobile = v.density === "mobile";
  const mode = current ? "trigger" : "content";
  const wrap = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState<string[]>(state === "selected" ? ["kim", "lee", "park"] : ["kim"]);

  React.useEffect(() => {
    if (state !== "navigating" && state !== "failed") return;
    const id = window.setTimeout(() => {
      if (state === "failed") {
        content.current?.querySelector<HTMLElement>("[data-create]")?.click();
        return;
      }
      const input = mode === "trigger" ? wrap.current?.querySelector("input") : content.current?.querySelector("[data-dds-search]");
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      // 비교 화면은 iframe 셋 중 하나만 실제 포커스를 가진다 — 포커스된 옵션에 강제 focus 표시를 달아 세 열 모두 보이게 한다.
      if (mode === "content") (document.activeElement as HTMLElement | null)?.classList.add("mk-focus");
    }, 200);
    return () => window.clearTimeout(id);
  }, [state, mode]);

  const picker = (
    <MultiSelect.Root
      value={value}
      onValueChange={setValue}
      open={state !== "selected"}
      search={mode}
      defaultSearchValue={state === "empty" ? "홍길순" : state === "failed" ? "한지우" : ""}
      searchProps={{ "aria-label": "사람 검색", placeholder: "이름으로 검색" }}
      onCreate={state === "failed" ? () => Promise.reject(new Error("권한 없음")) : undefined}
      createLabel={(query) => `“${query}” 초대하기`}
      createErrorLabel={() => "초대하지 못했습니다. 권한을 확인하십시오."}
    >
      <MultiSelect.Trigger
        className={isB && mobile ? "fx-prop__trigger" : undefined}
        placeholder="사람을 고르십시오"
        // 옵션 children이 아바타·팀까지 품어서 한 명일 때 트리거에 행 전체가 나온다 — 표시 label 분리 전까지 이름만 넘긴다.
        children={!current && value.length === 1 ? nameOf(value[0] ?? "") : undefined}
        formatCount={(n) => `${n}명`}
        formatRemoveLabel={(option) => `${nameOf(option.value)} 제거`}
      />
      <MultiSelect.Content ref={content} className={current ? undefined : "fx-chip-picker"} data-empty="일치하는 사람이 없습니다. 이름을 확인하십시오.">
        {PEOPLE.map((p) => (
          <MultiSelect.Option key={p.value} value={p.value}>
            {current ? p.name : <span className="fx-chip-person"><Face name={p.name} />{p.name}<span className="fx-chip-person__team">{p.team}</span></span>}
          </MultiSelect.Option>
        ))}
      </MultiSelect.Content>
    </MultiSelect.Root>
  );

  return (
    <div ref={wrap}>
      {isB && mobile ? (
        <PropertyGroup label="참여자 설정"><PropertyField layout="row" label="참여자">{picker}</PropertyField></PropertyGroup>
      ) : (
        <Field.Root style={{ width: "100%" }}>
          <Field.Label>참여자</Field.Label>
          {picker}
        </Field.Root>
      )}
      {!current && state === "selected" && (
        <div className="fx-chip-row">
          {value.map((id) => (
            <Chip key={id} leading={<Face name={nameOf(id)} />} onRemove={() => setValue((all) => all.filter((x) => x !== id))} removeLabel={`${nameOf(id)} 제거`}>
              {nameOf(id)}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  const mobile = v.density === "mobile";
  const row = mobile ? 48 : 36;
  return (
    <FlexPage
      v={v}
      title="사람 선택"
      summary={
        isB
          ? mobile
            ? "모바일은 속성 행(참여자 · n명)으로 들어가 같은 MultiSelect 패널을 엽니다. 고른 사람은 행 아래 칩으로 남습니다."
            : "검색 가능한 MultiSelect 패널에 아바타·이름·팀을 한 행으로 두고, 고른 사람은 24 칩으로 트리거 아래 나열합니다."
          : v.variant === "a"
            ? "MultiSelect 요약 트리거 + 패널 검색, 고른 사람은 28/32 칩으로 트리거 아래 나열합니다."
            : "현재 DDS 그대로입니다. 검색 트리거 안의 비공개 chip, 이름만 있는 옵션, 빈 결과 안내 없음."
      }
    >
      <FlexSection
        title="네 가지 상태"
        columns={1}
        note={
          current
            ? "검색 결과 없음은 빈 패널만 남습니다. 생성 실패는 만들기 항목 아래 role=alert 문구입니다."
            : "검색 결과 없음 문구는 CSS 재구성입니다 — DDS에 빈 결과 슬롯이 없어 MultiSelect.Empty를 제안합니다."
        }
      >
        <FlexState label="선택됨 · 3명" block><Picker v={v} state="selected" /></FlexState>
        <FlexState label="검색 결과 없음 · “홍길순”" block><Picker v={v} state="empty" /><FlexReserve height={current ? 40 : 110} /></FlexState>
        <FlexState label="생성 실패 · “한지우” 초대" block><Picker v={v} state="failed" /><FlexReserve height={current ? 90 : 140} /></FlexState>
        <FlexState label="탐색 중 · 키보드로 첫 행" block><Picker v={v} state="navigating" /><FlexReserve height={row * 5 + (current ? 24 : 64)} /></FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["field-height", "option-height", "chip-height", "chip-radius"]} extra={current ? [
        ["선택 표시", "검색 트리거 안 비공개 chip 20", "D multi-select.css"],
        ["빈 결과", "안내 없음 — 빈 패널", "D 현재 동작"],
      ] : [
        ["옵션 행", "Avatar 24 + 이름 + 팀(약한 글자)", "D Avatar small · C 행 구성"],
        ["고른 사람", "Chip + Avatar + 제거 버튼, 트리거 아래 줄바꿈", isB ? "B 표시값·제거 역할 분리" : "C private chip 추출 후보"],
        ["빈 결과", "패널 안 약한 글자 한 줄", "C 재구성 — Empty 슬롯 필요"],
        ...(isB && mobile ? [["진입", "속성 행 56 · 참여자 / n명 / caret", "B M026 속성 행"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1000} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
