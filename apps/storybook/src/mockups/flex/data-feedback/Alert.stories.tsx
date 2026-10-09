import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, Button, Field, TextField } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/DataFeedback/Alert", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;
const noop = () => {};

function Policy() {
  return (
    <Alert
      intent="warning"
      title="전체 공개로 바뀝니다"
      description="발행하면 검색 결과와 RSS에 바로 노출됩니다."
      actions={<Button size="small" intent="neutral" variant="weak">공개 범위 바꾸기</Button>}
    />
  );
}

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const current = v.variant === "current";
  return (
    <FlexPage
      v={v}
      title="Alert"
      summary={
        isB
          ? "안내를 폼 상단에 모으지 않고 관련 필드 바로 옆에 둡니다. 크기·색은 현재 그대로입니다."
          : v.variant === "a"
            ? "p16·r8을 유지합니다. weak 표면 + 아이콘 + 문구, 제목→설명→복구 행동을 같은 시작선에 둡니다."
            : "현재 DDS Alert입니다. intent별 weak 표면과 아이콘, actions 슬롯이 있습니다."
      }
    >
      <FlexSection title="intent" note="큰 안내 영역에 solid 브랜드를 쓰지 않습니다. critical만 role=alert, 나머지는 status — A·B 같다.">
        <FlexState label="informative" block>
          <Alert intent="informative" title="예약 발행은 10분 단위입니다" description="선택한 시각에 가장 가까운 10분으로 맞춥니다." />
        </FlexState>
        <FlexState label="critical · 복구 행동 + 닫기" block>
          <Alert
            intent="critical"
            title="발행하지 못했습니다"
            description="네트워크 연결이 끊겼습니다. 작성한 내용은 임시 저장했습니다."
            actions={<Button size="small" intent="critical" variant="weak">다시 시도</Button>}
            onClose={noop}
          />
        </FlexState>
        <FlexState label="positive" block>
          <Alert intent="positive" title="검토를 통과했습니다" />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="폼 안 배치"
        note={isB
          ? "정책·주의는 해당 필드 바로 아래(field-gap 간격), 실패와 복구는 저장 행동 바로 위에 둡니다."
          : "폼 위에 안내를 모읍니다. 필드와 거리가 멀어 어떤 값 때문인지 다시 찾아야 합니다."}
      >
        <FlexState label="발행 설정" block>
          <div style={{ display: "grid", gap: "var(--fx-field-gap, 16px)" }}>
            {!isB && <Policy />}
            <Field.Root style={full}>
              <Field.Label>제목</Field.Label>
              <TextField defaultValue="표와 목록을 고르는 기준" />
            </Field.Root>
            <Field.Root style={full}>
              <Field.Label>공개 범위</Field.Label>
              <TextField readOnly defaultValue="전체 공개" />
            </Field.Root>
            {isB && <Policy />}
            {isB && (
              <Alert intent="critical" title="발행하지 못했습니다" description="다시 시도해도 실패하면 임시 저장본에서 이어 쓸 수 있습니다." />
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--dds-dimension-x2)" }}>
              <Button intent="neutral" variant="weak">임시 저장</Button>
              <Button>발행</Button>
            </div>
          </div>
        </FlexState>
      </FlexSection>

      <FlexSection title="좁은 폭 · 행동 두 개" note={current ? "행동이 한 줄에 고정돼 좁은 폭에서 닫기 버튼 쪽으로 밀려납니다." : "행동은 본문 아래에서 줄바꿈하고 닫기 버튼과 겹치지 않습니다."}>
        <FlexState label="폭 260px" block>
          <div style={{ maxWidth: 260 }}>
            <Alert
              intent="warning"
              title="저장 공간이 부족합니다"
              actions={<><Button size="small" intent="neutral" variant="weak">오래된 이미지 정리</Button><Button size="small" intent="neutral" variant="ghost">요금제 보기</Button></>}
              onClose={noop}
            />
          </div>
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["field-gap"]} extra={[
        ["여백 · 반경", "16px · r8", "D 현재 값(A·B 공통)"],
        ["아이콘 · 간격", "20px · 8px", "D 현재 값"],
        ["제목 / 설명", "14/19 bold · 13/18", "D 현재 값"],
        ["행동", current ? "한 줄 · 위 8 · 사이 8" : "줄바꿈 허용 · 위 8 · 사이 8", current ? "현재 동작" : "C 좁은 폭 겹침 방지(A·B 공통)"],
        ["배치", isB ? "관련 필드 바로 아래" : "폼 상단", isB ? "C B 원문 우선 — 폼 과업 안 배치" : "현재 관례"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
