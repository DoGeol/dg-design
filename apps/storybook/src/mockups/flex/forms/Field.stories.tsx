import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, TextField } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Forms/Field", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;
const stack = (gap: string) => ({ display: "grid", gap }) as const;

/** 한 필드. inbox면 라벨과 값이 한 면(B 모바일)이고, 설명·오류는 면 바깥 같은 시작선에 둔다. */
function Item({ label, value, description, error, inbox, box, focus }: {
  label: string;
  value: string;
  description?: string;
  error?: string;
  inbox?: boolean;
  box?: boolean;
  focus?: boolean;
}) {
  const control = <TextField className={box ? "fx-box" : undefined} defaultValue={value} />;
  return (
    <Field.Root style={full} className={focus ? "mk-focus" : undefined}>
      {inbox ? (
        <div className="fx-inbox">
          <Field.Label>{label}</Field.Label>
          {control}
        </div>
      ) : (
        <>
          <Field.Label>{label}</Field.Label>
          {control}
        </>
      )}
      {description && <Field.Description>{description}</Field.Description>}
      {error && <Field.ErrorMessage>{error}</Field.ErrorMessage>}
    </Field.Root>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const inbox = isB && mobile;
  const box = isB && !mobile;
  return (
    <FlexPage
      v={v}
      title="Field"
      summary={
        isB
          ? "폼 묶음·단독 입력·속성 값을 용도별 조합으로 나눕니다. 데스크톱은 외부 라벨 box, 모바일 묶음은 내부 라벨 box(M024)이고 설명·오류는 면 바깥에 둡니다."
          : v.variant === "a"
            ? "외부 라벨을 기본으로 두고 필드 안 6, 필드 사이 12(모바일 14), 묶음 사이 24(모바일 28)를 구분합니다. 내부 라벨은 후보입니다."
            : "현재 DDS Field입니다. 외부 라벨 한 가지이고 필드 사이·묶음 사이 간격은 앱이 정합니다."
      }
    >
      <FlexSection
        title="배치 · 라벨 · 설명 · 오류"
        columns={1}
        note={
          inbox
            ? "작은 라벨과 값이 한 면에 있고, 설명과 오류는 면 바깥 같은 시작선에 둡니다."
            : "라벨 → 컨트롤 → 설명/오류 순서이고 placeholder로 라벨을 대신하지 않습니다."
        }
      >
        <FlexState label="설명 있음" block>
          <Item label="표시 이름" value="편도걸" description="댓글과 멘션에 보입니다." inbox={inbox} box={box} />
        </FlexState>
        <FlexState label="error + focus" block>
          <Item label="이메일" value="dogeol@" error="이메일 형식이 아닙니다." inbox={inbox} box={box} focus />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="간격 · 필드 사이와 묶음 사이"
        note={
          v.variant === "current"
            ? "현재 없음 — 간격 역할이 없어 앱이 16·24를 직접 둡니다."
            : "같은 묶음 안은 field-gap, 묶음이 바뀌면 group-gap입니다. 묶음 제목은 본문 굵게입니다."
        }
      >
        <FlexState label="두 묶음" block>
          <div style={stack("var(--fx-group-gap, 24px)")}>
            <div style={stack("var(--fx-field-gap, 16px)")}>
              <strong>기본 정보</strong>
              <Item label="이름" value="편도걸" inbox={inbox} box={box} />
              <Item label="소속" value="프론트엔드" inbox={inbox} box={box} />
            </div>
            <div style={stack("var(--fx-field-gap, 16px)")}>
              <strong>연락처</strong>
              <Item label="업무 메일" value="dogeol@studio.kr" inbox={inbox} box={box} />
            </div>
          </div>
        </FlexState>
      </FlexSection>

      {isB && !mobile && (
        <FlexSection title="단독 입력 · line" note="한 가지 내용에 집중하는 입력은 외부 라벨 line입니다. 속성 값(비키보드 값)은 PropertyField(새 종류)로 다룹니다.">
          <FlexState label="line" block>
            <Field.Root style={full}>
              <Field.Label>메모</Field.Label>
              <TextField className="fx-line" defaultValue="다음 주 배포 전에 확인" />
              <Field.Description>나만 볼 수 있습니다.</Field.Description>
            </Field.Root>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={["field-gap", "group-gap", "field-height", "field-radius"]} extra={[
        ["라벨–컨트롤 간격", "6px", "D dimension-x1_5 유지"],
        ["라벨 · 설명/오류 글자", "14 bold · 13", "D font-size-t4 · t3 유지"],
        ...(inbox ? [
          ["내부 라벨", "12/16 regular · fg-neutral-weak", "C M005 Caption Medium 12/18 재구성(줄 16)"],
          ["내부 라벨 면 위아래 · 라벨–값", "8 · 2px", "C 56 안에 라벨 줄 16 + 값 줄 24를 맞춤"],
        ] as const : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={760} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
