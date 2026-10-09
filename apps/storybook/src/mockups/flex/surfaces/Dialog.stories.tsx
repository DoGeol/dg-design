import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { Screen, StaticFrame, TaskParts, TaskToday } from "../proto/DialogLayout";

const meta = { title: "Mockups/Flex/Surfaces/Dialog", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 확인형 — 세 안 모두 오늘 Dialog 그대로다. */
function Confirm() {
  return (
    <StaticFrame view="center" today label="확인형 Dialog">
      <Dialog.Title>변경 사항을 게시할까요</Dialog.Title>
      <Dialog.Description>게시하면 공개 페이지에 바로 반영됩니다. 게시한 뒤에도 다시 수정할 수 있습니다.</Dialog.Description>
      <div className="fx-dialog-today-actions">
        <Dialog.Close asChild><Button intent="neutral" variant="weak">취소</Button></Dialog.Close>
        <Button>게시</Button>
      </div>
    </StaticFrame>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const isCurrent = v.variant === "current";
  const zoom = !mobile;
  const h = mobile ? 600 : 560;
  return (
    <FlexPage
      v={v}
      title="Dialog"
      summary={
        isB
          ? "확인형은 그대로 두고, 작업형은 같은 부품으로 중앙·측면·전체 보기를 정의합니다. 본문 여백 40px(DS026)입니다."
          : v.variant === "a"
            ? "확인형은 그대로 두고, 작업형에 Toolbar·Body·Aside·Footer 부품을 더합니다. 본문 여백 40px입니다."
            : "현재 Dialog는 Title·Description·Close만 있어 작업형도 내용 전체가 한 덩어리로 스크롤됩니다."
      }
    >
      <FlexSection title="확인형" note="세 안 모두 같습니다 — 폭 min(32rem, 화면−32), 여백 24, 간격 12, 반경 16.">
        <FlexState label="확인 · 되돌릴 수 있는 결정" block>
          <Screen view="center" height={mobile ? 280 : 240}><Confirm /></Screen>
        </FlexState>
      </FlexSection>

      <FlexSection
        title={isCurrent ? "작업형 · 현재 조립" : isB ? (mobile ? "작업형 · 전체 보기" : "작업형 · 중앙 보기") : "작업형"}
        note={
          isCurrent
            ? "현재 없음/우회 — 부품이 없어 Toolbar도 Footer도 없습니다. 활동과 버튼까지 내용 전체가 스크롤됩니다."
            : isB && mobile
              ? "모바일은 중앙 보기 대신 전체 보기(M031) 또는 하단 Sheet로 엽니다. Aside는 본문 뒤, Footer는 아래 고정입니다."
              : mobile
              ? "390px에서는 Aside를 본문 뒤 보조 구역으로 내리고 Footer는 아래에 고정합니다. 스크롤은 본문만입니다."
              : "Toolbar(대상·상태·닫기) / Body / Footer는 Body 아래에만 / Aside는 세로선으로 나눕니다. 스크롤은 Body만입니다."
        }
      >
        <FlexState label={zoom ? "정적 프레임 · 가상 화면 800px을 0.5로 축소" : "정적 프레임 · 실제 모달 아님"} block>
          {isCurrent ? (
            <Screen view="center" height={h} zoom={zoom}>
              <StaticFrame view="center" today label="작업형 Dialog · 현재" height="100%"><TaskToday /></StaticFrame>
            </Screen>
          ) : isB && mobile ? (
            <Screen view="full" height={h}>
              <StaticFrame view="full" label="작업형 Dialog · 전체 보기"><TaskParts mobile /></StaticFrame>
            </Screen>
          ) : (
            <Screen view="center" height={h} zoom={zoom}>
              <StaticFrame view="center" label="작업형 Dialog · 중앙 보기" height="100%"><TaskParts mobile={mobile} /></StaticFrame>
            </Screen>
          )}
        </FlexState>
      </FlexSection>

      {isB && !mobile && (
        <FlexSection title="작업형 · 측면·전체 보기" note="같은 작업·같은 메모 값을 다른 보기로 이어 갑니다. 보기를 바꿔도 입력은 유지됩니다(DS008–011).">
          <FlexState label="측면 보기 · 목록을 보면서 처리 · 폭 24rem" block>
            <Screen view="side" height={h} zoom>
              <StaticFrame view="side" label="작업형 Dialog · 측면 보기"><TaskParts /></StaticFrame>
            </Screen>
          </FlexState>
          <FlexState label="전체 보기 · 긴 작업 · 반경 0" block>
            <Screen view="full" height={h} zoom>
              <StaticFrame view="full" label="작업형 Dialog · 전체 보기"><TaskParts /></StaticFrame>
            </Screen>
          </FlexState>
        </FlexSection>
      )}

      <FlexSection title="상태" note="패널은 open·closed뿐입니다. 안쪽 조작 요소의 상태는 각 컴포넌트를 따릅니다.">
        <FlexState label="포커스" block>
          {isCurrent
            ? "초기 포커스는 initialFocusRef 또는 패널. 패널 자체에는 링을 그리지 않습니다."
            : "초기 포커스는 첫 입력(검토 메모). 닫기 버튼은 Toolbar 끝 — 2px 링. 보기를 바꿔도 포커스와 값은 유지합니다."}
        </FlexState>
        <FlexState label="긴 본문" block>
          {isCurrent ? "max-height 화면−32 안에서 내용 전체가 스크롤돼 버튼이 밀려납니다." : "Body만 스크롤되고 Toolbar·Footer는 고정입니다. 저장 중·미저장 닫기 정책은 앱 소유입니다."}
        </FlexState>
      </FlexSection>

      <FlexSpec v={v} roles={["panel-inset"]} extra={isCurrent ? [
        ["확인형", "min(32rem, 화면−32) · p24 · gap12 · r16", "DDS 선언값"],
        ["작업형", "없음 — 확인형 조립, 내용 전체 스크롤", "현재 없음"],
      ] : [
        ["확인형", "min(32rem, 화면−32) · p24 · gap12 · r16", "D 현재 값 — 세 안 동일"],
        ["작업형 중앙 폭", "min(48rem, 화면−32)", "C 본문 32rem(현재 폭) + Aside 16rem"],
        ["Aside 폭 · 여백", "16rem · 20", "C 본문 폭의 1/2 · x5"],
        ["Toolbar", "세로 8 · 끝 12 · 시작 = 본문 여백, 아래 경계 1px", "C 대상 시작선을 본문과 맞춤"],
        ["Footer", "세로 16 · 좌우 = 본문 여백, 위 경계 1px", "C Body 아래에만"],
        ["좁은 패널", "폭 560 미만이면 Aside를 본문 뒤로", "C"],
        ...(isB ? [["측면 보기 폭", "min(24rem, 화면−32), 오른쪽 붙음", "D Sheet 좌우 폭 재사용"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1100} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={1100} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
