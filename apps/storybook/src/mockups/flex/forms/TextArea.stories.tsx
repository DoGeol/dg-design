import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, TextArea } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/TextArea", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;
const BODY = "과정을 기록합니다.\n결정과 이유를 남깁니다.";

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const box = isB ? "fx-box" : undefined;
  return (
    <FlexPage
      v={v}
      title="TextArea"
      summary={
        isB
          ? "TextField의 box·line을 여러 줄에서도 같게 씁니다. 라벨·설명·글자 수·오류를 한 조합으로 두고 높이는 내용이 정합니다."
          : v.variant === "a"
            ? "TextField와 표면·반경·좌우 여백을 맞추고 높이만 내용에 따라 늘어납니다. 오류는 왼쪽, 글자 수는 오른쪽 한 줄입니다."
            : "현재 DDS TextArea입니다. 반경 8px·여백 8/12px, 글자 수는 입력 아래 오른쪽에 따로 섭니다."
      }
    >
      <FlexSection title="상태" columns={2} note="medium · rows 3 기준입니다. pressed는 입력에 해당하지 않습니다.">
        <FlexState label="filled" block><TextArea aria-label="소개" className={box} defaultValue={BODY} /></FlexState>
        <FlexState label="hover" force="hover" block><TextArea aria-label="소개" className={box} defaultValue={BODY} /></FlexState>
        <FlexState label="focus" force="focus" block><TextArea aria-label="소개" className={box} defaultValue={BODY} /></FlexState>
        <FlexState label="error" block><TextArea aria-label="소개" className={box} aria-invalid defaultValue="짧음" /></FlexState>
        <FlexState label="disabled" block><TextArea aria-label="소개" disabled defaultValue={BODY} /></FlexState>
        <FlexState label="readonly" block><TextArea aria-label="소개" readOnly defaultValue={BODY} /></FlexState>
      </FlexSection>

      <FlexSection
        title="라벨 · 설명 · 글자 수 · 오류"
        note={
          v.variant === "current"
            ? "현재는 글자 수가 입력 아래에 따로 서고 오류는 그 아래로 내려갑니다."
            : "오류는 왼쪽, 글자 수는 오른쪽 같은 줄입니다. 좁으면 순서대로 줄바꿈합니다."
        }
      >
        <FlexState label={isB && mobile ? "error · 내부 라벨 box" : "error · showCount"} block>
          {isB && mobile ? (
            <Field.Root style={full}>
              <div className="fx-inbox fx-inbox-multi">
                <Field.Label>소개</Field.Label>
                <TextArea defaultValue="짧음" showCount maxLength={200} />
              </div>
              <Field.ErrorMessage>20자 이상 쓰십시오.</Field.ErrorMessage>
            </Field.Root>
          ) : (
            <Field.Root style={full} className={v.variant === "current" ? undefined : "fx-meta-row"}>
              <Field.Label>소개</Field.Label>
              <TextArea className={box} defaultValue="짧음" showCount maxLength={200} />
              <Field.ErrorMessage>20자 이상 쓰십시오.</Field.ErrorMessage>
            </Field.Root>
          )}
        </FlexState>
        <FlexState label="설명 · autoResize" block>
          <Field.Root style={full}>
            {!(isB && mobile) && <Field.Label>회고</Field.Label>}
            {isB && mobile ? (
              <div className="fx-inbox fx-inbox-multi">
                <Field.Label>회고</Field.Label>
                <TextArea autoResize defaultValue={`${BODY}\n다음 배포 전에 다시 봅니다.`} />
              </div>
            ) : (
              <TextArea className={box} autoResize defaultValue={`${BODY}\n다음 배포 전에 다시 봅니다.`} />
            )}
            <Field.Description>입력하는 만큼 높이가 늘어납니다.</Field.Description>
          </Field.Root>
        </FlexState>
      </FlexSection>

      <FlexSection
        title="단독 입력"
        note={isB ? "댓글처럼 한 내용에 집중하는 여러 줄은 line입니다(M024)." : "현재·A는 outline 한 가지입니다."}
      >
        <FlexState label={isB ? "line" : "outline"} block>
          <Field.Root style={full}>
            <Field.Label>댓글</Field.Label>
            <TextArea className={isB ? "fx-line" : undefined} rows={2} defaultValue="좋은 정리입니다. 표 부분만 다시 봐 주십시오." />
          </Field.Root>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["field-radius", "field-inset", "field-font", "body-line"]} extra={[
        ["위아래 여백", mobile && v.variant !== "current" ? "16px" : "8px", mobile && v.variant !== "current" ? "C (field 56 − 줄 24) ÷ 2 — 한 줄일 때 field 높이와 같게" : "D dimension-x2 유지"],
        ["최소 높이", "rows 3 (내용이 정함)", "D 고정 높이로 자르지 않음"],
        ...(isB && mobile ? [["여러 줄 box 최소 높이", "128px", "B M020 173×0.75=129.8"] as const] : []),
        v.variant === "current"
          ? ["글자 수 · 오류 배치", "아래 오른쪽 · 그 아래", "현재 DDS 값 유지"] as const
          : isB && mobile
            ? ["글자 수 · 오류 배치", "면 안 오른쪽 아래 · 면 바깥", "C 내부 라벨 box — 설명·오류는 면 바깥 시작선"] as const
            : ["글자 수 · 오류 배치", "같은 줄 오른쪽 · 왼쪽", "C A·B 문서 — 좁으면 줄바꿈"] as const,
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
