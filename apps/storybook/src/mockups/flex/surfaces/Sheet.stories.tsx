import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, RadioGroup, Sheet, TextField } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import {
  DialogBody, DialogFooter, ExpandIcon, MEMO, Screen, StaticFrame, TaskParts, TaskToday, TaskToolbar,
} from "../proto/DialogLayout";

const meta = { title: "Mockups/Flex/Surfaces/Sheet", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function StatusRadios() {
  return (
    <RadioGroup.Root aria-label="검토 상태" defaultValue="doing">
      <RadioGroup.Item value="doing">검토 중</RadioGroup.Item>
      <RadioGroup.Item value="done">검토 완료</RadioGroup.Item>
      <RadioGroup.Item value="hold">보류</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

/** 짧은 선택 — 상태 하나와 한 줄 메모. B의 간단 단계이기도 하다. */
function ShortPick({ today, expand }: { today?: boolean; expand?: boolean }) {
  const memo = (
    <Field.Root style={{ width: "100%" }}>
      <Field.Label>메모</Field.Label>
      <TextField defaultValue={MEMO} />
    </Field.Root>
  );
  if (today) {
    return (
      <>
        <Sheet.Title>검토 상태</Sheet.Title>
        <Sheet.Description>상태를 바꾸면 요청자에게 알립니다.</Sheet.Description>
        <StatusRadios />
        {memo}
        <div className="fx-dialog-today-actions">
          <Sheet.Close asChild><Button intent="neutral" variant="weak">취소</Button></Sheet.Close>
          <Button>저장</Button>
        </div>
      </>
    );
  }
  return (
    <>
      <TaskToolbar kind="sheet" extra={expand && (
        <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="자세히 보기"><ExpandIcon /></Button>
      )} />
      <DialogBody>
        <div className="fx-dialog-head">
          <Sheet.Title>검토 상태</Sheet.Title>
          <Sheet.Description>상태를 바꾸면 요청자에게 알립니다.</Sheet.Description>
        </div>
        <StatusRadios />
        {memo}
      </DialogBody>
      <DialogFooter><Button className="fx-cta">저장</Button></DialogFooter>
    </>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const isCurrent = v.variant === "current";
  const screen = 640;
  return (
    <FlexPage
      v={v}
      title="Sheet"
      summary={
        isB
          ? "모바일 하단 Sheet는 반경 16(현재 유지)·여백 20입니다. 같은 컨테이너에서 간단 → 상세 → 전체로 넓혀도 입력값이 남습니다(M031)."
          : v.variant === "a"
            ? "모바일 하단 Sheet는 반경 24·여백 20입니다. 짧은 선택은 내용 높이, 긴 폼은 제한 높이에 Body만 스크롤합니다."
            : "현재 Sheet는 p24·r16, 하단은 높이 20rem 고정이고 내용 전체가 스크롤됩니다."
      }
    >
      {!mobile && (
        <FlexSection
          title="데스크톱 · 오른쪽 Sheet"
          note={isCurrent
            ? "제목·닫기와 버튼까지 내용 전체가 스크롤됩니다."
            : "치수는 세 안 모두 현재와 같습니다(r16·p24). 제목·닫기 영역과 Footer를 스크롤 밖에 둡니다."}
        >
          <FlexState label="정적 프레임 · 폭 min(24rem, 화면−32)" block>
            <Screen view="side" height={520}>
              {isCurrent
                ? <StaticFrame kind="sheet" view="side" today label="오른쪽 Sheet · 현재"><TaskToday kind="sheet" /></StaticFrame>
                : <StaticFrame kind="sheet" view="side" label="오른쪽 Sheet"><TaskParts kind="sheet" /></StaticFrame>}
            </Screen>
          </FlexState>
        </FlexSection>
      )}

      {mobile && (
        <FlexSection
          title={isB ? "모바일 · 같은 컨테이너 단계 전환" : "모바일 · 하단 Sheet"}
          note={
            isCurrent
              ? "높이가 내용과 상관없이 20rem으로 고정입니다. 긴 폼은 제목부터 버튼까지 한 덩어리로 스크롤됩니다."
              : isB
                ? "간단 → 상세 → 전체. 세 프레임 모두 같은 메모 값을 유지합니다. 뒤로가기는 이전 단계, 닫기는 Sheet 전체를 닫습니다."
                : "짧은 선택은 내용 높이, 긴 폼은 최대 90dvh에 Body만 스크롤합니다. Footer 아래에 safe area를 더합니다."
          }
          columns={1}
        >
          <FlexState label={isB ? "1 간단 · 내용 높이" : isCurrent ? "짧은 선택 · 높이 20rem 고정" : "짧은 선택 · 내용 높이"} block>
            <Screen view="sheet" height={screen}>
              <StaticFrame kind="sheet" view="sheet" today={isCurrent} height={isCurrent ? 320 : undefined} label="하단 Sheet · 짧은 선택">
                <ShortPick today={isCurrent} expand={isB} />
              </StaticFrame>
            </Screen>
          </FlexState>
          <FlexState label={isB ? "2 상세 · 최대 90dvh · 메모 유지" : isCurrent ? "긴 폼 · 높이 20rem · 전체 스크롤" : "긴 폼 · 최대 90dvh · Body만 스크롤"} block>
            <Screen view="sheet" height={screen}>
              <StaticFrame kind="sheet" view="sheet" today={isCurrent} height={isCurrent ? 320 : "90%"} label="하단 Sheet · 긴 폼">
                {isCurrent ? <TaskToday kind="sheet" /> : <TaskParts kind="sheet" mobile />}
              </StaticFrame>
            </Screen>
          </FlexState>
          {isB && (
            <FlexState label="3 전체 · 반경 0 · 메모·활동 유지" block>
              <Screen view="sheet-full" height={screen}>
                <StaticFrame kind="sheet" view="sheet-full" label="하단 Sheet · 전체 보기"><TaskParts kind="sheet" mobile /></StaticFrame>
              </Screen>
            </FlexState>
          )}
        </FlexSection>
      )}

      <FlexSpec v={v} roles={["sheet-radius", "sheet-inset"]} extra={[
        ["좌우 Sheet 폭", "min(24rem, 화면−32)", isCurrent ? "DDS 선언값" : "D 현재 값"],
        isCurrent
          ? ["상하 Sheet 높이", "min(20rem, 화면−32) 고정", "DDS 선언값"]
          : ["상하 Sheet 높이", "짧은 선택 내용 높이 · 긴 폼 최대 90dvh", "C DatePicker 90dvh 선례"],
        ...(isCurrent ? [] : [
          ["스크롤", "Body만 — 제목·닫기·Footer 고정", "C"],
          ["하단 safe area", "Footer 아래 max(16, env(safe-area-inset-bottom))", "C"],
          ["드래그 핸들", "없음 — 실제 drag를 줄 때만", "A 원문 조건"],
        ] as const),
        ...(isB ? [["단계 전환", "간단 → 상세(90dvh) → 전체(100%, r0), 같은 값", "B M031 가변·전체 모달"] as const] : []),
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
